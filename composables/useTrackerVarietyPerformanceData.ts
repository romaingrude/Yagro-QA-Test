import { ref, watchEffect } from 'vue'
import { useQuery } from 'villus'
import { useSelectedStore } from '~~/stores/selected'

export function useTrackerVarietyPerformanceData(queryFields: string) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getTrackerCropPerformances = `
    query GetTrackerVarietyPerformance($filters: TrackerCropsFilter) {
      getTrackerVarietyPerformances(filters: $filters) {
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

  return useQuery({ query: getTrackerCropPerformances, variables })
}
