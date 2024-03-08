import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useSelectedStore = defineStore({
  actions: {
    clearSelected(toSelect?: string[]) {
      if (toSelect) {
        for (const field of toSelect)
          this[`selected_${field}`] = null
      }
      else {
        this.setYear(null)
        this.setGroup(null)
        this.setCrop(null)
        this.setDateRange(null)
        this.setVariety(null)
        this.setField(null)
        this.setPartnerId(null)
        this.setVirtualGroup(null)
        this.setSeason(null)
        this.setPartnerId(null)
        this.setProduct(null)
        this.setNotificationStatus(null)
      }
    },
    setCrop(value: object) {
      this.selected_crop = value
    },
    setDateRange(value: object) {
      this.selected_date_range = value
    },
    setField(value: object) {
      this.selected_field = value
    },
    setGroup(value: object) {
      this.selected_group = value
    },
    setNotificationStatus(value: object) {
      this.selected_notification_status = value
    },
    setPartnerId(value: string) {
      this.selected_partner_id = value
    },
    setProduct(value: object) {
      this.selected_product = value
    },
    setSeason(value: object) {
      this.selected_season = value
    },
    setVariety(value: object) {
      this.selected_variety = value
    },
    setVirtualGroup(value: object) {
      this.selected_virtual_group = value
    },
    setYear(value: number) {
      this.selected_year = value
    },
  },

  getters: {
    crop: state => state.selected_crop,
    dateRange: state => state.selected_date_range,
    field: state => state.selected_field,
    group: state => state.selected_group,
    notificationStatus: state => state.selected_notification_status,
    partnerCompany: () => {
      return 'YAGRO'
    },
    partnerDataEmail: () => {
      return 'data@yagro.com'
    },
    partnerId: state => state.selected_partner_id,
    product: state => state.selected_product,
    season: state => state.selected_season,
    variety: state => state.selected_variety,
    virtualGroup: state => state.selected_virtual_group,
    year: state => state.selected_year,
  },

  id: 'selected',

  state: () => ({
    selected_crop: useLocalStorage('pinia/selected/selected_crop', null, { serializer: StorageSerializers.object }),
    selected_date_range: useLocalStorage('pinia/selected/selected_date_range', null, {
      serializer: StorageSerializers.object,
    }),
    selected_field: null,
    selected_group: useLocalStorage('pinia/selected/selected_group', null, { serializer: StorageSerializers.object }),
    selected_notification_status: useLocalStorage('pinia/selected/selected_notification_status', null, {
      serializer: StorageSerializers.object,
    }),
    selected_partner_id: useLocalStorage('pinia/selected/selected_partner_id', null, {
      serializer: StorageSerializers.object,
    }),
    selected_product: useLocalStorage('pinia/selected/selected_product', null, {
      serializer: StorageSerializers.object,
    }),
    selected_season: useLocalStorage('pinia/selected/selected_season', null, { serializer: StorageSerializers.object }),
    selected_variety: useLocalStorage('pinia/selected/selected_variety', null, {
      serializer: StorageSerializers.object,
    }),
    selected_virtual_group: useLocalStorage('pinia/selected/selected_virtual_group', null, {
      serializer: StorageSerializers.object,
    }),
    selected_year: useLocalStorage('pinia/selected/selected_year', 2022, { serializer: StorageSerializers.object }),
  }),
})
