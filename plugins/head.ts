/*
-------------------------------------------------------------------------------
Site 'Head' Plugin
-------------------------------------------------------------------------------
Description
Manipulates the document head, currently used to add an AWS friendly favicon.
-------------------------------------------------------------------------------
Reference(s)
https://github.com/nuxt/framework/issues/5425
-------------------------------------------------------------------------------
*/

import { useHead, useRuntimeConfig } from '#imports'

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  return useHead({
    link: [{ href: `${config.app.cdnURL}favicon.ico`, rel: 'icon', type: 'image/x-icon' }],
  })
})
