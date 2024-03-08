<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useSelectedStore } from '~/stores/selected'
import useFetchData from '~/composables/useFetchData'
import QuantityFormat from '~/components/formatters/QuantityFormat.vue'
import PercentageDifference from '~/components/formatters/PercentageDifference.vue'
import EstimatedYieldWarning from '~/components/tracker/crop-progress/details/EstimatedYieldWarning.vue'

export default defineComponent({
  components: {
    EstimatedYieldWarning,
    PercentageDifference,
    QuantityFormat,
  },
  props: {
    yield: {
      default: null,
      required: true,
      type: Object,
    },
    source: {
      default: null,
      required: true,
      type: String,
    },
    crop: {
      default: null,
      type: Object,
    },
  },
  setup(props) {
    const selected = useSelectedStore()

    // Fetching data
    const prevData = ref([])
    const fetchData = async function () {
      if (props.crop) {
        await Promise.all(
          [1, 2, 3].map((i) => {
            const { fetchedData } = useFetchData(
              `fms/harvests/fields/yearId=${selected.year - i}&cropId=${props.crop.id}`,
            )
            watch(fetchedData, (newValue) => {
              if (newValue)
                prevData.value.push(newValue)
            })
            return fetchedData
          }),
        )
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

    const prevAverageYield = computed(() => {
      if (!prevData.value)
        return null
      const result = prevData.value.reduce(
        (acc, y) => {
          acc.total += Number(y.yield.magnitude) ?? 0
          acc.count += y.yield.magnitude !== null ? 1 : 0
          return acc
        },
        { total: 0, count: 0 },
      )
      return result.total / result.count
    })

    return {
      selected,
      prevAverageYield,
    }
  },
})
</script>

<template>
  <span>
    <QuantityFormat v-if="yield" :magnitude="Number(yield.magnitude)" :units="yield.dimension" />
    <span v-else>{{ t('marketwatch.filters.NA') }}</span>
    {{ ' ' }}
    <PercentageDifference
      v-if="prevAverageYield && yield.magnitude"
      :value="(Number(yield.magnitude) / prevAverageYield) * 100 - 100"
      :positive-is-good="true"
    />
    <EstimatedYieldWarning v-if="source" :source="source" />
  </span>
</template>
