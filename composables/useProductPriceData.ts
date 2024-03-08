import { useQuery } from 'villus'
import { ref, watchEffect } from 'vue'
import { useSelectedStore } from '~~/stores/selected'

export function useProductPriceData(queryFields: string, productId: number) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getProductPrices = `
  query GetProductPriceData($filters: ProductPriceFilter) {
    getProductPriceData(filters: $filters) {
    ${queryFields}
  }
}
`
  const defaultFilters = {
    groupId: null,
    seasonId: null,
  }
  if (productId)
    defaultFilters.productId = null
  const variables = ref({
    filters: defaultFilters,
  })

  watchEffect(() => {
    const filters = {
      groupId: selected.group?.id,
      seasonId: selected.selected_season?.id,
    }
    if (productId)
      filters.productId = productId
    variables.value = {
      filters,
    }
  })

  return useQuery({ query: getProductPrices, variables })
}
