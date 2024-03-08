import { defineNuxtRouteMiddleware, useNuxtApp } from '#imports'
import { useDisplayStore } from '~~/stores/display'

export default defineNuxtRouteMiddleware((to) => {
  const { $posthog } = useNuxtApp()
  const display = useDisplayStore()
  display.closeSidebarOverlay()
  if ($posthog) {
    $posthog.capture('$pageview', {
      $current_url: to.fullPath,
    })
  }
})
