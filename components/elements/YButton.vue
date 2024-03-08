<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    isActive: {
      default: false,
      type: Boolean,
    },
    size: {
      default: 'md',
      type: String,
    },
    type: {
      default: 'primary',
      type: String,
    },
  },
  setup(props) {
    const buttonType = ref(props.type)
    const buttonSize = ref(props.size)
    const active = computed(() => {
      return props.isActive ? 'active' : ''
    })
    return {
      active,
      buttonSize,
      buttonType,
    }
  },
})
</script>

<template>
  <button type="button" class="btn" :class="`btn-${buttonType} ${active} btn-${buttonSize}`">
    <slot />
  </button>
</template>
