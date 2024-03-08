<script>
export default {
  props: {
    title: String,
    kind: String,
  },

  computed: {
    info() {
      switch (this.kind) {
        case 'cost_per_ha':
          return 'The variable costs from products applied to the field, per hectare farmed; which may differ from the area harvested.'
        case 'cost_per_t':
          return 'Variable costs of products applied per tonne harvested.'
        case 'gross_margin':
          return 'The gross margin per hectare farmed; the output (yield * price) of the crop minus the associated variable costs.'
        case 'harvest_area':
          return 'The area harvested; which may differ from the area farmed.'
        case 'market_range_cost_per_t':
          return 'Your cost of production compared to the market.'
        case 'free_product':
          return 'Free product could affect this market range'
        case 'rel_performance':
          return 'Performance relative to your other programmes. Narrow bars are similar to your average, wide bars are very different - worse-performing if red (left) and better if green (right). The boundary between red and green represents your mean performance.'
        case 'yield':
          return 'The number of tonnes produced per hectare harvested; which may differ from the area farmed.'
        default:
          return ''
      }
    },
  },
}
</script>

<template>
  <span v-b-popover.hover.top.window="info" :title="title" class="text-muted">
    <i class="i-fa6-solid-circle-question h-4 w-4" />
  </span>
</template>
