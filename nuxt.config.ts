// https://v3.nuxtjs.org/api/configuration/nuxt.config

import process from 'node:process'

export default defineNuxtConfig({
  app: {
    head: {
      script: [{
        crossorigin: 'anonymous',
        integrity: 'sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM',
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
      }],
    },
  },
  components: [{
    extensions: ['vue'],
    path: '~/components/core',
  }, {
    extensions: ['vue'],
    path: '~/components/elements',
  }, {
    extensions: ['vue'],
    path: '~/components/formatters',
  }, {
    extensions: ['vue'],
    path: '~/components/modals',
  }],
  css: ['@/assets/css/main.scss'],
  devtools: {
    enabled: true,
  },
  modules: ['@pinia/nuxt', '@unocss/nuxt'],
  runtimeConfig: {
    agGridLicense: '',
    public: {
      dataEndpoint: process.env.NODE_ENV === 'production' ? '/data' : '/api/api',
      graphql: {
        activeEndpoint: process.env.NODE_ENV === 'production' ? '/api/graphql' : '/api/graphql',
        developmentEndpoint: '/api/graphql',
        productionEndpoint: '/graphql',
      },
      posthogApiKey: '',
      sentryDsn: '',
      sentryProjectId: '',
    },
  },
  ssr: false,
  vite: {
    ssr: {
      noExternal: ['vue3-popper'],
    },
  },
})
