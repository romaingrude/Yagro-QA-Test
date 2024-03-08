<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'

export default defineComponent({
  props: {
    params: {
      required: false,
      type: Object as PropType<ICellRendererParams>,
    },
  },
  setup(props) {
    const localePath = p => p

    const route = ref(props.params?.path)
    const value = computed(() => {
      return props.params.value
    })

    return {
      localePath,
      route,
      value,
    }
  },
})
</script>

<template>
  <NuxtLink v-if="value" class="align-items-center" :to="localePath(`${route}${value.id}`)">
    <span class="capitalize">{{ value.name }}</span>
  </NuxtLink>
</template>
