<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'

// import {useSelectedStore} from "~/stores/selected";

export default defineComponent({
  props: {
    params: {
      required: false,
      type: Object as PropType<ICellRendererParams>,
    },
  },
  setup(props) {
    // const selected = useSelectedStore();
    const value = computed(() => props.params.value)

    const path = computed(() => {
      let route = 'programmes'

      // Uncomment after adding year param to the programme page
      // if (selected.year) {
      //   filter += `/year/${selected.year}`;
      // }
      if (props.params.data.currentCropId)
        route += `/crop/${props.params.data.currentCropId}`

      if (props.params.data.varietyId)
        route += `/variety/${props.params.data.varietyId}`

      if (props.params.data.croppedFieldId)
        route += `/field/${props.params.data.croppedFieldId}`

      return route
    })

    return {
      path,
      value,
    }
  },
})
</script>

<template>
  <NuxtLink class="link-style" :to="path">
    {{ value }}
  </NuxtLink>
</template>
