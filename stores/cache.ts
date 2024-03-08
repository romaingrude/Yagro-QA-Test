import { defineStore } from 'pinia'

export const useCacheStore = defineStore({
  actions: {
    cacheResponse(key: string, value: any) {
      this.responses[key] = value
    },
  },

  getters: {
    getCachedResponse: (state) => {
      return (key: string) => {
        return state.responses[key]
      }
    },
  },

  id: 'cache',

  state: () => ({
    responses: {},
  }),
})
