<script lang="ts">
import { computed, defineComponent } from 'vue'
import yagro from '/img/yagro-background.jpg'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    partnerId: {
      default: 'yagro',
      type: String,
    },
  },
  setup() {
    const { t } = useI18n()
    const image = computed(() => {
      return yagro
    })

    const bgPosition = computed(() => {
      return { 'object-position': '66% 90%' }
    })

    const altText = computed(() => {
      return 'Yagro Background'
    })
    return {
      altText,
      bgPosition,
      image,
      t,
    }
  },
})
</script>

<template>
  <div class="bg-wrapper">
    <img :src="image" class="bg-image" :alt="altText" :style="bgPosition">
    <span v-if="!partnerId || partnerId == 'yagro'" class="image-text">
      {{ `${t('general.imageCourtesyOf')} A H Oliver & Son Farmers` }}
    </span>
  </div>
</template>

<style scoped>
.image-text {
  position: absolute;
  top: 25px;
  right: 25px;
  text-align: right;
  font-weight: bold;
  mix-blend-mode: soft-light;
}

.bg-image {
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.bg-wrapper {
  height: 100%;
  width: 100%;
}
</style>
