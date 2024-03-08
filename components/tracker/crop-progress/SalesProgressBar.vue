<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import QuantityFormat from '../../formatters/QuantityFormat.vue'
import YPopover from '~~/components/elements/YPopover.vue'

export default defineComponent({
  components: {
    QuantityFormat,
    YPopover,
  },
  props: {
    compact: { default: false, type: Boolean },
    contractedAmount: { default: 0, type: Number },
    dimension: { default: 't/ha', type: String },
    soldAmount: { default: 0, type: Number },
    totalAmount: { default: 0, type: Number },
    contractedSold: { default: 0, type: Number },
  },
  setup(props) {
    const totalAmount = computed(() => {
      return props.totalAmount
    })
    const soldAmount = computed(() => {
      return props.soldAmount
    })
    const contractedAmount = computed(() => {
      return props.contractedAmount
    })
    const contractedSold = computed(() => {
      return props.contractedSold
    })
    // const dimension = computed(() => { return props.dimension});
    const compact = computed(() => {
      return props.compact
    })

    const salesData = reactive({
      compact,
      contractedAmount,
      contractedSold,
      dimension: 't',
      soldAmount,
      totalAmount,
    })

    const soldPercentage: ComputedRef<number> = computed(() => {
      return (salesData.soldAmount / salesData.totalAmount) * 100
    })

    const contractedPercentage: ComputedRef<number> = computed(() => {
      return ((salesData.contractedAmount - salesData.contractedSold) / salesData.totalAmount) * 100
    })

    const oversold = computed(() => {
      return soldPercentage.value + contractedPercentage.value > 100
    })

    return { contractedPercentage, oversold, salesData, soldPercentage }
  },
})
</script>

<template>
  <div :class="salesData.compact ? '' : 'p-3 flex-grow-1'">
    <div v-if="!salesData.compact" class="d-flex justify-content-between align-items-center">
      <template v-if="salesData.totalAmount">
        <small id="prod-summary-sold" class="text-muted d-block mb-1">
          <span class="text-capitalize">
            {{ $t('general.sold') }}
          </span>
          <YPopover>
            <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
            <template #header><h5>{{ $t('tracker.tonnageSold') }}</h5></template>
            <template #content>{{ $t('tracker.tonnageSoldMsg') }}</template>
          </YPopover>
          :
          <QuantityFormat
            :magnitude="salesData.soldAmount - salesData.contractedSold + salesData.contractedAmount"
            :units="salesData.dimension"
          />
        </small>
        <small id="prod-summary-remaining" class="text-muted d-block mb-1">
          <span class="text-capitalize">
            {{ $t('general.remaining') }}
          </span>
          <YPopover>
            <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
            <template #header><h5 class="text-capitalize">{{ $t('general.remaining') }}</h5></template>
            <template #content>{{ $t('tracker.tonnageRemaining') }}</template> </YPopover>:
          <QuantityFormat
            :magnitude="
              Math.max(
                0,
                salesData.totalAmount - (salesData.soldAmount - salesData.contractedAmount) - salesData.contractedAmount,
              )
            "
            :units="salesData.dimension"
          />
        </small>
      </template>

      <span v-else> 0.00 t {{ $t('general.sold') }} </span>
    </div>

    <span>
      <div class="progress">
        <div
          v-if="soldPercentage || contractedPercentage"
          :class="`progress-bar ${oversold ? 'bg-danger' : 'bg-success'}`"
          role="progressbar"
          :style="`width: ${oversold ? '100' : soldPercentage}%`"
        >
          <span v-if="soldPercentage && !compact">{{ soldPercentage.toFixed(1) }}%</span>
        </div>

        <div
          class="progress-bar bg-warning"
          role="progressbar"
          :style="`width: ${oversold ? '0' : contractedPercentage}%`"
        >
          <span v-if="contractedPercentage && !compact">{{ contractedPercentage.toFixed(1) }}%</span>
        </div>
      </div>
    </span>
  </div>
</template>
