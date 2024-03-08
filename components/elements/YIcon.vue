<!--
-------------------------------------------------------------------------------
YIcon
-------------------------------------------------------------------------------
Description
This component is used to display an icon from the assets/svg folder inline.

Reference
https://github.com/nuxt-community/svg-module/issues/86
-------------------------------------------------------------------------------
-->

<!-- eslint-disable vue/no-v-html -->
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
  name: 'YIcon',
  props: {
    name: {
      type: String,
      default: '',
      required: true,
    },
  },
  setup(props) {
    const icons = ref([])
    const icon = ref(null)

    onMounted(async () => {
      icons.value = Object.fromEntries(
        Object.entries(import.meta.glob('/assets/svg/*.svg', { as: 'raw' })).map(([key, value]) => {
          const filename = key.split('/').pop()?.split('.').shift()
          return [filename, value]
        }),
      )

      icon.value = props.name && (await icons.value?.[props.name]?.())
    })

    watch(
      () => props.name,
      async (name) => {
        icon.value = name && (await icons.value?.[name]?.())
      },
    )

    return {
      icon,
      icons,
    }
  },
})
</script>

<template>
  <div v-if="icon" class="y-icon" v-html="icon" />
</template>

<style>
.y-icon {
  display: block;

  .svg {
    display: block;
  }
}
</style>
