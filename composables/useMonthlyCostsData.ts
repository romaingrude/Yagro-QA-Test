import { useQuery } from 'villus'
import { ref, watchEffect } from 'vue'
import { useSelectedStore } from '~~/stores/selected'

export function useMonthlyCostsData(queryFields: string) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getTrackerMonthlyCosts = `
query GetTrackerMonthlyCosts($filters: TrackerMonthlyFilter) {
  getTrackerMonthlyCosts(filters: $filters) {
    ${queryFields}
  }
}
`
  const variables = ref({
    filters: {
      cropId: null,
      groupId: null,
      year: null,
    },
  })

  watchEffect(() => {
    variables.value = {
      filters: {
        cropId: selected.crop?.id,
        groupId: selected.group?.id,
        year: selected.year,
      },
    }
  })
  return useQuery({ query: getTrackerMonthlyCosts, variables })
}
