/*
-------------------------------------------------------------------------------
Villus setup
-------------------------------------------------------------------------------
Modified to allow us to change the URL of the GraphQL endpoint for
testing purposes.
-------------------------------------------------------------------------------
Reference
https://github.com/logaretm/villus/issues/126
https://villus.logaretm.com/guide/plugins/
*/

import { batch } from '@villus/batch'
import { createClient } from 'villus'
import { defineNuxtPlugin } from '#app'
import { useApplicationStore } from '~~/stores/application'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useApplicationStore()

  /* This modifies the URL being used by the active client */
  function modifyUrl({ opContext }) {
    opContext.url = config.graphql.activeEndpoint
  }

  const client = createClient({
    cachePolicy: 'cache-and-network',
    url: config.graphql.activeEndpoint,
    use: [modifyUrl, batch()],
  })

  nuxtApp.vueApp.use(client)
})
