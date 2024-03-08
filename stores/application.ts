/*
-------------------------------------------------------------------------------
Application Store
-------------------------------------------------------------------------------
Description
Used to store settings / values that are used across the application.
graphql endpoint is set via Nuxt runtimeConfig.
-------------------------------------------------------------------------------
Reference
https://github.com/nuxt/framework/discussions/3726
*/

import { defineStore } from 'pinia'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { useRuntimeConfig } from '#app'
import Namespaces from '~/api/namespaces.json'

export const useApplicationStore = defineStore('application', {
  actions: {
    /* Sets the graphQL endpoint */
    setGraphQLEndpoint(value: string) {
      if (!value)
        return
      this.graphql.activeEndpoint = value
    },
    /* Changes the GraphQL endpoint for testing purposes */
    toggleGraphQLEndpoint() {
      this.graphql.activeEndpoint === this.graphql.developmentEndpoint
        ? this.setGraphQLEndpoint(this.graphql.productionEndpoint)
        : this.setGraphQLEndpoint(this.graphql.developmentEndpoint)
    },
    setNamespace(value: string) {
      this.namespace = value
    },
  },
  getters: {
    getGraphQLEndpoint() {
      if (this.isLivePlatform())
        return Namespaces[this.namespace].graphqlApiUrl

      return this.graphql.activeEndpoint
    },
    getNamespace() {
      return this.namespace
    },
    getMicroserviceApiUrl() {
      return Namespaces[this.namespace].microserviceApiUrl
    },
    getWebserviceApiUrl() {
      return Namespaces[this.namespace].webserviceApiUrl
    },
    isLivePlatform() {
      return this.namespace !== 'demo'
    },
  },
  state: () => {
    const config = useRuntimeConfig()

    return {
      namespace: 'demo',
      graphql: useLocalStorage(
        'pinia/application/graphql',
        {
          activeEndpoint: config.public.graphql.activeEndpoint,
          developmentEndpoint: config.public.graphql.developmentEndpoint,
          productionEndpoint: config.public.graphql.productionEndpoint,
        },
        { serializer: StorageSerializers.object },
      ),
    }
  },
})
