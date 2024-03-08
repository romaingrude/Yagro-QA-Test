import { useQuery } from 'villus'
import { ref, watchEffect } from 'vue'
import { useSelectedStore } from '~~/stores/selected'
export function useBudgetData(queryFields: string) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getBudgets = `
query GetBudgets($filters: BudgetFilter) {
  getBudgets(filters: $filters) {
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

  return useQuery({ query: getBudgets, variables })
}
