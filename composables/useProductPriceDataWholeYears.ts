import { useQuery } from 'villus'
import { ref, watchEffect } from 'vue'
import { useSelectedStore } from '~~/stores/selected'
export function useProductPriceDataWholeYears(queryFields: string) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getProductPricesWholeYears = `
  query GetProductPriceDataWholeYears($filters: ProductPriceWholeYearsFilter) {
    getProductPriceDataWholeYears(filters: $filters) {
      ${queryFields}
    }
  }
`

  const variables = ref({
    filters: {
      groupId: null,
      year: null,
    },
  })

  watchEffect(() => {
    variables.value = {
      filters: {
        groupId: selected.group?.id,
        year: selected.season?.year,
      },
    }
  })

  return useQuery({ query: getProductPricesWholeYears, variables })
}
