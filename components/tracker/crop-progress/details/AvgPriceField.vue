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
    avgPrice: {
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
              `api/business-tracker/${selected.year - i}/crops/${props.crop.id}/production`,
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

    const prevAveragePrice = computed(() => {
      if (!prevData.value)
        return null
      const result = prevData.value.reduce(
        (acc, s) => {
          acc.gbp
            += Number(s.summary.overall_avg_price) * (Number(s.summary.remaining_amount) + Number(s.summary.sold_amount))
          acc.t += Number(s.summary.remaining_amount) + Number(s.summary.sold_amount)
          return acc
        },
        { gbp: 0, t: 0 },
      )
      return result.gbp / result.t
    })

    return {
      selected,
      prevAveragePrice,
    }
  },
})
</script>

<template>
  <span>
    <MoneyFormat v-if="avgPrice" :value="Number(avgPrice.overall_avg_price)" per-unit="t" />
    <span v-else>{{ t('marketwatch.filters.NA') }}</span>
    {{ ' ' }}
    <PercentageDifference
      v-if="prevAveragePrice && avgPrice.overall_avg_price"
      :value="(Number(avgPrice.overall_avg_price) / prevAveragePrice) * 100 - 100"
      :positive-is-good="true"
    />
  </span>
</template>
