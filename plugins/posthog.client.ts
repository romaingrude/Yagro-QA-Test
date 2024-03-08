import posthog from 'posthog-js'
import * as Sentry from '@sentry/browser'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const POSTHOG_API_KEY = config.public.posthogApiKey
  if (!POSTHOG_API_KEY)
    return
  posthog.init(POSTHOG_API_KEY, {
    api_host: 'https://eu.posthog.com',
    capture_pageview: false, // Handled by navigation middleware
  })
  const SENTRY_DSN = config.public.sentryDsn
  const SENTRY_PROJECT_ID = config.public.sentryProjectId
  if (SENTRY_DSN && SENTRY_PROJECT_ID) {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [new posthog.SentryIntegration(posthog, 'yagro', SENTRY_PROJECT_ID)],
    })
  }
  return {
    provide: {
      posthog,
    },
  }
})
