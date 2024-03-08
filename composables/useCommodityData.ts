import { useQuery } from 'villus'
import { ref, watchEffect } from 'vue'
export function useCommodityData(queryFields: string, ticker: string) {
  // FETCH DATA
  const getCommodities = `
query GetCommodityData($ticker: String) {
  getCommodityData(ticker: $ticker) {
    ${queryFields}
  }
}
`
  const variables = ref({
    ticker,
  })

  watchEffect(() => {
    variables.value = {
      ticker,
    }
  })

  return useQuery({ query: getCommodities, variables })
}
