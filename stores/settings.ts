import { defineStore } from 'pinia'

// import { acceptHMRUpdate } from 'pinia';

export const useSettingsStore = defineStore({
  actions: {
    setCurrencyCode(value: string) {
      this._currencyCode = value
    },
  },

  getters: {
    currencyCode: state => state._currencyCode,
  },

  id: 'settings',

  state: () => ({
    _currencyCode: 'GBP',
  }),
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
// }
