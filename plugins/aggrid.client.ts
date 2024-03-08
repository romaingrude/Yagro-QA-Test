// import { LicenseManager } from 'ag-grid-enterprise';
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const AG_GRID_LICENSE = config.public.agGridLicense
  if (AG_GRID_LICENSE)
    LicenseManager.setLicenseKey(AG_GRID_LICENSE)
})
