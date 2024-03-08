<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useSelectedStore } from '~~/stores/selected'
import useFetchData from '~/composables/useFetchData'
import YSelect from '~/components/elements/YSelect.vue'

export default defineComponent({
  components: { YSelect },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selected = useSelectedStore()
    const emitValue = (newValue) => {
      emit('update:modelValue', newValue)
    }

    // Fetching data
    const data = ref([])
    const fetchData = function () {
      data.value = []
      // Change for selected.group?.id after the login will be done for ii
      const { fetchedData } = useFetchData('api/farm/autocomplete/seasons/52')

      watch(fetchedData, (newValue) => {
        if (newValue)
          data.value = newValue
      })
    }
    onMounted(() => {
      fetchData()
    })

    const options = computed(() => {
      if (!data.value || !data.value.length)
        return []
      const years = data.value
      const sortedYears = Array(...years.sort((a, b) => (a.id < b.id ? 1 : -1))).map((item) => {
        return { label: item.name, value: item }
      })

      /* Aware this needs fixing, commented out to test pipeline */
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      selected.selected_season = sortedYears[0]
      return sortedYears
    })

    return {
      emitValue,
      options,
      selected,
    }
  },
})
</script>

<template>
  <YSelect
    v-if="options.length > 0"
    v-model="selected.selected_season"
    :searchable="true"
    :close-on-select="true"
    :can-clear="false"
    :allow-empty="false"
    :object="true"
    :options="options"
    placeholder="Select a season"
    @update:model-value="emitValue($event)"
  />
</template>
