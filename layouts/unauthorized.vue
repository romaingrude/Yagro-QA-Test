<script>
import UrlSelectOverlay from '~~/components/overlays/UrlSelectOverlay.vue'
import { useSelectedStore } from '~/stores/selected'

export default defineComponent({
  components: { UrlSelectOverlay },
  setup() {
    return {
      selected: useSelectedStore(),
    }
  },
})
</script>

<template>
  <div>
    <UrlSelectOverlay />
    <div :class="`d-flex wrapper branding-${selected.partnerId}`">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
div {
  border-left: 10px solid var(--primary-colour);
}
</style>
