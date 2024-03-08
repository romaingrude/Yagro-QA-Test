<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    alignBottom: {
      default: false,
      required: false,
      type: Boolean,
    },
    border: { default: true, type: Boolean },
    borderColumn: {
      default: false,
      required: false,
      type: Boolean,
    },
    borderRow: {
      default: false,
      required: false,
      type: Boolean,
    },
    columns: {
      required: true,
      type: Array,
    },
    rows: { required: true, type: Number },
  },
  setup(props) {
    const summaryRows = computed(() => props.rows)
    const summaryColumns = computed(() => props.columns)
    const borderStyling = ref(props.border)

    const outerStyling = computed(() => {
      if (borderStyling.value)
        return 'card'

      return ''
    })
    return {
      outerStyling,
      summaryColumns,
      summaryRows,
    }
  },
})
</script>

<template>
  <div :class="outerStyling">
    <div
      v-for="r_index in summaryRows"
      :key="`r${r_index}`"
      class="row g-0"
      :class="{ 'border-top': borderRow, 'align-items-end': alignBottom }"
    >
      <div
        v-for="c_index in summaryColumns[r_index - 1]"
        :key="`r${r_index}c${c_index}`"
        class="col-xs-6 col-md"
        :class="{ 'border-end': borderColumn && c_index != summaryColumns[r_index - 1] }"
      >
        <slot :name="`${r_index}_${c_index}`" />
      </div>
    </div>
  </div>
</template>
