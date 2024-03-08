<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import MoneyFormat from '../formatters/MoneyFormat.vue'
import YButton from '../elements/YButton.vue'
import useFetchData from '~/composables/useFetchData'
import { useSelectedStore } from '~/stores/selected'

export default defineComponent({
  components: { Dialog, MoneyFormat, YButton },
  props: {
    show: {
      default: false,
      required: true,
      type: Boolean,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const selected = useSelectedStore()
    const data = ref(null)

    const fetchData = function () {
      if (selected.crop) {
        const { fetchedData } = useFetchData(
          `api/business-tracker/${selected.year}/crops/${selected.crop.id}/variety-costs`,
        )
        watch(fetchedData, (newValue) => {
          if (newValue)
            data.value = newValue
        })
      }
    }

    watch(
      () => selected.year,
      (current, prev) => {
        if (current != prev && current)
          fetchData()
      },
      { immediate: true },
    )

    watch(
      () => selected.crop,
      (current, prev) => {
        if (current != prev && current)
          fetchData()
      },
      { immediate: true },
    )

    const varieties = computed(() => {
      if (!data.value)
        return []
      return data.value.varieties
    })

    const subcategories = computed(() => {
      if (!data.value)
        return []
      return data.value.categories
    })

    const isShow = computed(() => {
      return props.show
    })

    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal,
      isShow,
      subcategories,
      varieties,
    }
  },
})
</script>

<template>
  <div>
    <Dialog :visible="isShow" class="dialog" :modal="true" @update:visible="closeModal">
      <template #header>
        <h3 class="my-sm-2 ms-3 text-white">
          {{ $t('general.variety') }}
        </h3>
      </template>

      <table>
        <thead>
          <tr class="spacer">
            <th class="text-capitalize">
              {{ $t('general.category') }}
            </th>
            <th v-for="variety in Object.keys(varieties)" :key="`${variety}-title`" colspan="2">
              {{ variety }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr class="spacer">
            <th class="text-capitalize">
              {{ $t('general.seed') }}
            </th>
            <template v-for="variety in varieties">
              <td v-if="variety" :key="`${variety}-cost-seed`">
                <MoneyFormat :value="variety.categories.Seed" />
              </td>
              <td v-if="variety" :key="`${variety}-cost-seed-per-ha`">
                <MoneyFormat :value="variety.categories.Seed / Number(variety.area)" per-unit="ha" />
              </td>
            </template>
          </tr>
          <tr>
            <th class="text-capitalize">
              {{ $t('general.fertiliser') }}
            </th>
            <template v-for="variety in varieties">
              <td v-if="variety" :key="`${variety}-cost-fertiliser`">
                <MoneyFormat :value="variety.categories.Fertiliser" />
              </td>
              <td v-if="variety" :key="`${variety}-cost-fertiliser-per-ha`">
                <MoneyFormat :value="variety.categories.Fertiliser / Number(variety.area)" per-unit="ha" />
              </td>
            </template>
          </tr>
          <tr>
            <th class="text-capitalize">
              {{ $t('general.chemical') }}
            </th>
          </tr>
          <tr
            v-for="subcategory in subcategories.filter((y) => y !== 'Seed' && y !== 'Fertiliser')"
            :key="`${subcategory}-cost`"
          >
            <th class="text-capitalize">
              - {{ subcategory }}
            </th>
            <template v-for="variety in varieties">
              <td v-if="variety" :key="`${variety}-cost-${subcategory}`">
                <MoneyFormat :value="variety.categories[subcategory]" />
              </td>
              <td v-if="variety" :key="`${variety}-cost-${subcategory}-per-ha`">
                <MoneyFormat :value="variety.categories[subcategory] / Number(variety.area)" per-unit="ha" />
              </td>
            </template>
          </tr>
        </tbody>
      </table>

      <template #footer>
        <YButton class="text-nowrap text-capitalize" type="dark-grey" @click="closeModal">
          {{
            $t('general.close')
          }}
        </YButton>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
table {
  border-collapse: separate;
  border-spacing: 1em 1em;
  font-size: large;
  white-space: nowrap;
}
</style>
