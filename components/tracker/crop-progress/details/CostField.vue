<script lang="ts">
import { computed, ref, watch } from 'vue'
import { defineComponent } from '#imports'
import { useSelectedStore } from '~/stores/selected'
import useFetchData from '~/composables/useFetchData'
import PercentageDifference from '~/components/formatters/PercentageDifference.vue'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'

export default defineComponent({
  components: {
    MoneyFormat,
    PercentageDifference,
  },
  props: {
    cost: {
      default: null,
      required: true,
      type: Object,
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
              `fms/applications/fields/yearId=${selected.year - i}&cropId=${props.crop.id}`,
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

    const prevAverageCost = computed(() => {
      if (!prevData.value)
        return null
      const result = prevData.value.reduce(
        (acc, y) => {
          acc.total += Number(y.cost.magnitude) ?? 0
          acc.count += y.cost.magnitude !== null ? 1 : 0
          return acc
        },
        { total: 0, count: 0 },
      )
      return result.total / result.count
    })

    return {
      selected,
      prevAverageCost,
    }
  },
})
</script>

<template>
  <span>
    <MoneyFormat v-if="cost" :value="Number(cost.magnitude)" per-unit="ha" />
    <span v-else>{{ t('marketwatch.filters.NA') }}</span>
    {{ ' ' }}
    <PercentageDifference
      v-if="prevAverageCost && cost.magnitude"
      :value="(Number(cost.magnitude) / prevAverageCost) * 100 - 100"
      :positive-is-good="false"
    />
  </span>
</template>
