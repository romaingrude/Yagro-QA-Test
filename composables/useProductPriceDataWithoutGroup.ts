import { ref, watchEffect } from 'vue'
import { useQuery } from 'villus'
import { useSelectedStore } from '~/stores/selected'
export function useProductPriceDataWithoutGroup(queryFields: string, idList: Array<number>) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getProductPriceDataWithoutGroup = `
  query GetProductPriceDataWithoutGroup($filters: ProductPriceWithoutGroupFilter) {
    getProductPriceDataWithoutGroup(filters: $filters) {
    ${queryFields}
  }
}
`
  const variables = ref({
    filters: {
      from: null,
      productIdList: null,
      to: null,
    },
  })

  watchEffect(() => {
    variables.value = {
      filters: {
        from: selected.selected_date_range?.from,
        productIdList: idList,
        to: selected.selected_date_range?.to,
      },
    }
  })

  return useQuery({ query: getProductPriceDataWithoutGroup, variables })
}
