import { ref, watchEffect } from 'vue'
import { useQuery } from 'villus'
import { useSelectedStore } from '~~/stores/selected'

export function useContractsData(queryFields: string, allCrops = false) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getTrackerContracts = `
    query GetTrackerContracts($filters: TrackerCropsFilter) {
      getTrackerContracts(filters: $filters) {
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
        cropId: !allCrops ? selected.crop?.id : null,
        groupId: selected.group?.id,
        year: selected.year,
      },
    }
  })

  return useQuery({ query: getTrackerContracts, variables })
}
