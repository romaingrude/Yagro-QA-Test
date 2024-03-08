import { defineStore } from 'pinia'

export const useDisplayStore = defineStore({
  actions: {
    closeSidebarOverlay() {
      this.sidebarOverlay = false
    },
    openSidebarOverlay() {
      this.sidebarOverlay = true
    },
    toggleSidebarOverlay() {
      this.sidebarOverlay = !this.sidebarOverlay
    },
  },

  getters: {
    overlaySidebar: state => state.sidebarOverlay,
  },

  id: 'display',

  state: () => ({
    sidebarOverlay: false,
  }),
})
