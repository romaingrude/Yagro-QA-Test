import { createI18n } from 'vue-i18n'
import { defineNuxtPlugin } from '#app'
import localeEnGb from '~~/locales/en-GB'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    allowComposition: true,
    locale: 'en-GB',
    messages: {
      'en-GB': localeEnGb,
    },
  })
  nuxtApp.vueApp.use(i18n)
})
