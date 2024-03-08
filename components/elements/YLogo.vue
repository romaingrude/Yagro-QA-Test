<script lang="ts">
import { computed, defineComponent } from 'vue'
import yagro from '/img/yagro-logo.png'

export default defineComponent({
  props: {
    partnerId: {
      default: 'yagro',
      type: String,
    },
  },
  setup() {
    const image = computed(() => {
      return yagro
    })

    const altText = computed(() => {
      return 'Yagro Logo'
    })
    return {
      altText,
      image,
    }
  },
})
</script>

<template>
  <div class="logo-wrapper">
    <img :src="image" :alt="altText">
  </div>
</template>

<style scoped>
img {
  height: auto;
  max-width: 100%;
}
.logo-wrapper {
  height: inherit;
  justify-content: center;
  display: flex;
  flex-direction: row;
}
</style>
