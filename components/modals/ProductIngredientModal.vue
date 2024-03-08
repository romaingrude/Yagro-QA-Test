<script lang="ts">
import { computed, defineComponent, ref, toRef, watch } from 'vue'
import Dialog from 'primevue/dialog'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import { useRoute } from 'vue-router'
import QuantityFormat from '~/components/formatters/QuantityFormat.vue'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'
import useFetchData from '~/composables/useFetchData'
import { useSelectedStore } from '~/stores/selected'

export default defineComponent({
  components: { MoneyFormat, QuantityFormat, Dialog },
  props: {
    ingredient: {
      default: null,
      required: true,
      type: Number,
    },
    category: {
      default: 'chemical',
      required: true,
      type: String,
    },
    show: {
      default: false,
      required: true,
      type: Boolean,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const selectedElement = null
    const isShow = toRef(props, 'show')
    const ingredientData = ref(null)
    const selected = useSelectedStore()
    const route = useRoute()
    const ingredientColumns = [
      { key: 'product.name', name: 'Product', sortable: true },
      { key: 'when', name: 'Date', sortable: true },
      { key: 'rate', name: 'Rate', sortable: true },
      { key: 'area', name: 'Area', sortable: true },
      { key: 'value', name: 'Total', sortable: true },
      { key: 'perHa', name: 'Cost/ha', sortable: true },
    ]
    const { t } = useI18n()

    const fetchData = function () {
      ingredientData.value = null
      const name = props.ingredient.replaceAll(' ', '%20')
      const { fetchedData } = useFetchData(
        `api/fms/applied-product/containing=${name}&inCategory=${props.category}&harvest_year=${selected.selected_year}&field=${route.params.field_id}&variety=${route.params.variety_id}`,
      )
      watch(fetchedData, (newValue) => {
        if (newValue)
          ingredientData.value = newValue
      })
    }

    watch(
      () => props.ingredient,
      (current, prev) => {
        if (!prev || (prev && current))
          fetchData()
      },
      { immediate: true },
    )

    const appliedData = computed(() => {
      if (!ingredientData.value)
        return null
      return ingredientData.value.objects.map(e =>
        Object({
          ...e,
          perHa: e.value / e.area,
        }),
      )
    })

    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal,
      isShow,
      t,
      format,
      appliedData,
      selectedElement,
      ingredientColumns,
    }
  },
})
</script>

<template>
  <div>
    <Dialog :visible="isShow" class="dialog" :modal="true" @update:visible="closeModal">
      <template #header>
        <h4 v-if="ingredient" class="my-sm-2 ms-3 text-white">
          {{ t('programmeCheck.applicationOf') }}
          <span class="text-capitalize">{{ ingredient }}</span>
        </h4>
      </template>
      <div>
        <div class="row container-fluid bg-dove-grey m-0">
          <div class="pt-3 pb-3 col-8 d-flex justify-content-center">
            <h6 class="text-capitalize">
              {{ t('programmeCheck.application') }}
            </h6>
          </div>
          <div class="pt-3 pb-3 col-4 d-flex justify-content-center">
            <h6 class="text-capitalize">
              {{ t('general.cost') }}
            </h6>
          </div>
        </div>
        <YTable :columns="ingredientColumns" :items="appliedData" class="mb-5">
          <template #[`product.name`]="{ data }">
            <span class="text-capitalize"> {{ data.product.name }} </span>
          </template>
          <template #[`when`]="{ data }">
            <span class="text-capitalize"> {{ format(new Date(data.when), 'dd.MM.yyyy') }}</span>
          </template>
          <template #[`rate`]="{ data }">
            <QuantityFormat :magnitude="data.rate" :units="`${data.units}/ha`" />
          </template>
          <template #[`area`]="{ data }">
            <QuantityFormat :magnitude="data.area" units="ha" />
          </template>
          <template #[`value`]="{ data }">
            <MoneyFormat :value="data.value" />
            ({{ Math.min(100, (data.value * 100) / data.field_area).toFixed(0) }}%)
          </template>
          <template #[`perHa`]="{ data }">
            <MoneyFormat :value="data.perHa" per-unit="ha" />
          </template>
        </YTable>
      </div>
    </Dialog>
  </div>
</template>
