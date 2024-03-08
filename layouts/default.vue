<script lang="ts">
import { defineComponent, onMounted, useRouter } from '#imports'
import { useUserStore } from '~/stores/user'
import { useSelectedStore } from '~/stores/selected'
import MagicBreadCrumbs from '~~/components/magic/MagicBreadCrumbs.vue'
import MobileTopbar from '~~/components/core/MobileTopbar.vue'
import { useDisplayStore } from '~~/stores/display'
import YAlertList from '~/components/elements/YAlertList.vue'

export default defineComponent({
  components: { MagicBreadCrumbs, MobileTopbar },
  setup() {
    const user = useUserStore()
    const router = useRouter()
    const selected = useSelectedStore()
    const display = useDisplayStore()
    onMounted(() => {
      if (!user.user.auth_token)
        router.push({ path: '/login' })
    })
    return {
      display,
      selected,
      YAlertList,
    }
  },
})
</script>

<template>
  <div>
    <YAlertList />
    <MobileTopbar />
    <div :class="`d-flex wrapper branding-${selected.partnerId}`">
      <MainSidebar />
      <main class="app" :class="{ 'greyed-out': display.overlaySidebar }">
        <div class="container">
          <MagicBreadCrumbs />
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.greyed-out {
  opacity: 0.5;
  user-select: none;
  transition: opacity 0.3s;
}
</style>
