import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  /*
   * Fetch data from local json files
   * @param {string} url - the url of the json file to fetch
   * Provide the URL as you would expect in the main platform (using / not _)
   * @returns object - the response from the file
   */
  async function fetchData(url: string, options = {}) {
    // const config = useRuntimeConfig()
    let fileName = url.replaceAll('/', '_').replaceAll('?', '_')
    if (options?.body)
      fileName += `_${JSON.stringify(options.body)}`

    // let result = await $fetch(config.public.dataEndpoint, { method: 'post', body: { url, file: fileName } });
    let result = await $fetch(`/data/${fileName}.json`)

    if (result) {
      if (typeof result === 'string') {
        result = JSON.parse(result)
        return result
      }
      return result
    }
    else {
      return undefined
    }
  }

  return {
    provide: {
      fetchData,
    },
  }
})
