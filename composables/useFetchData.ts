import { ref } from 'vue'
import { useNuxtApp } from '#imports'

export default function useFetchData(apiPath: string, options = {}) {
  const { $fetchData } = useNuxtApp()
  const fetchedData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const responseData = await $fetchData(apiPath, options)
      fetchedData.value = responseData
    }
    catch (error) {
      error.value = error
    }
    finally {
      loading.value = false
    }
  }

  fetchData()

  return { fetchedData, loading, error, fetchData }
}
