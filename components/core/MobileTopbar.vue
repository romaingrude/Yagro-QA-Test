<script lang="ts">
import { defineComponent } from 'vue'
import { useDisplayStore } from '~~/stores/display'
import MagicLogo from '~/components/magic/MagicLogo.vue'

export default defineComponent({
  components: { MagicLogo },
  setup() {
    const display = useDisplayStore()
    return {
      display,
    }
  },
})
</script>

<template>
  <div class="header-mobile">
    <MagicLogo />
    <button class="appearance-none w-8 h-8 border-none bg-transparent flex items-center justify-center" @click="display.toggleSidebarOverlay">
      <i class="i-fa6-solid-bars h-4 w-4 block" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.header-mobile {
  box-shadow: 0 1px 5px -1px rgba(25, 25, 25, 0.5);
  z-index: 55;
  height: 70px;
  position: fixed;
  background-color: #fff;
  padding: 0.25em 0.5em;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100vw;

  @media (min-width: 1025px) {
    display: none;
  }
}
.i-fa6-solid-bars {
  cursor: pointer;
}
.logo-wrapper {
  max-height: 70px;
  padding: 5px;
}
</style>
