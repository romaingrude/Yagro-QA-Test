import { defineNuxtPlugin } from '#app'
import { useAlerts } from '~/stores/alerts'

export default defineNuxtPlugin((nuxtApp) => {
  const alerts = useAlerts()
  nuxtApp.provide('Yalert', alerts)
})
