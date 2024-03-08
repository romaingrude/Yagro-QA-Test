import { useQuery } from 'villus'
import { ref, watchEffect } from 'vue'
import { useSelectedStore } from '~~/stores/selected'
export function useAlertData(queryFields: string, selectedCommodity: string) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getAlerts = `
  query GetAlerts($groupId: ID, $commodityTicker: String) {
    getAlerts(groupId: $groupId, commodityTicker: $commodityTicker) {
      ${queryFields}
    }
  }
`

  const variables = ref({
    commodityTicker: null,
    groupId: null,
  })

  watchEffect(() => {
    variables.value = {
      commodityTicker: selectedCommodity,
      groupId: selected.group?.id,
    }
  })

  return useQuery({ query: getAlerts, variables })
}
