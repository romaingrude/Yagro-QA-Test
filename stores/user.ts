import { defineStore } from 'pinia'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'

// import { acceptHMRUpdate } from 'pinia';

export const useUserStore = defineStore({
  actions: {
    setAdmin(value: boolean) {
      this.admin = value
    },
    setGroup(value) {
      this.group = value
    },
    setUser(value) {
      this.user = value
    },
  },

  getters: {
    isAdmin: state => state.admin,
  },

  id: 'user',

  state: () => ({
    admin: useLocalStorage('pinia/user/admin', false, StorageSerializers.boolean),
    group: useLocalStorage(
      'pinia/user/group',
      {
        id: '',
        name: '',
      },
      StorageSerializers.object,
    ),
    user: useLocalStorage(
      'pinia/user/user',
      {
        auth_token: '',
        email: '',
        refresh_token: '',
      },
      StorageSerializers.object,
    ),
  }),
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
// }
