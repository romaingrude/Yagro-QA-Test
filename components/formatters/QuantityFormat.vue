<script lang="ts">
import { computed, defineComponent } from 'vue'
import DimensionFormat from './DimensionFormat.vue'

export default defineComponent({
  components: { DimensionFormat },
  props: {
    decimalPoints: {
      default: 2,
      type: Number,
    },
    magnitude: {
      required: true,
      type: [Number, String],
    },
    units: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const rMagnitude = computed(() => props.magnitude)
    const rUnits = computed(() => props.units)
    const rDecimalPoints = computed(() => props.decimalPoints)

    return {
      rDecimalPoints,
      rMagnitude,
      rUnits,
    }
  },
})
</script>

<template>
  <span v-if="rMagnitude != null" class="no-wrap">
    <span class="magnitude">{{ Number(rMagnitude).toFixed(rDecimalPoints) }}&nbsp;</span>
    <DimensionFormat class="dimension" :value="rUnits" />
  </span>

  <span v-else class="text-muted">
    {{ $t('general.na') }}
  </span>
</template>

<style lang="scss">
.parenthetical {
  &::before {
    content: '(';
  }

  &::after {
    content: ')';
  }

  & > .magnitude {
    display: inline-block;
  }
}
</style>
