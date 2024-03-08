<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    comparisonValue: {
      default: null,
      required: false,
      type: Number,
    },
    decimalPoints: {
      default: 0,
      required: false,
      type: Number,
    },
    positiveIsGood: {
      default: true,
      required: true,
      type: Boolean,
    },
    title: {
      default: '',
      required: false,
      type: String,
    },
    value: {
      default: 0,
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const difference: ComputedRef<number> = computed(() => {
      if (!props.comparisonValue)
        return Number(props.value).toFixed(props.decimalPoints)
      return Number(
        ((Number(props.value) - Number(props.comparisonValue)) / Number(props.comparisonValue)) * 100,
      ).toFixed(props.decimalPoints)
    })

    const getColour = computed(() => {
      if (difference.value == 0)
        return 'text-muted'
      else if (props.positiveIsGood)
        return difference.value < 0 ? 'text-danger' : 'text-success'

      return difference.value < 0 ? 'text-success' : 'text-danger'
    })

    return {
      difference,
      getColour,
    }
  },
})
</script>

<template>
  <small v-if="value" data-bs-toggle="tooltip" data-bs-placement="bottom" :class="getColour" :title="title">{{ difference }}%
  </small>
</template>

<style></style>
