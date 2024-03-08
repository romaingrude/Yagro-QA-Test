<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import { useSelectedStore } from '~/stores/selected'

export default defineComponent({
  props: {
    params: {
      required: false,
      type: Object as PropType<ICellRendererParams>,
      default: () => {
        Object()
      },
    },
  },
  setup(props) {
    const selected = useSelectedStore()
    const value = computed(() => {
      if (!props.params?.value)
        return 'N/A'
      return props.params.value.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    })

    const path = computed(() => {
      return `/tracker/crop-progress/crop/${props.params?.data.crop.id}`
    })

    const cropChosen = computed(() => {
      return props.params.data.crop
    })

    const linkable = !!props.params?.data.crop.id

    return { path, value, linkable, selected, cropChosen }
  },
})
</script>

<template>
  <span v-if="linkable" @click="selected.setCrop(cropChosen)">
    <NuxtLink class="link-style" :to="path">{{ value }}</NuxtLink>
  </span>

  <p v-else>
    <b>{{ value }}</b>
  </p>
</template>
