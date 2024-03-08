<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import MoneyFormat from '../MoneyFormat.vue'
import SeedBagQty from '../../analytics/programmes/SeedBagQty.vue'
import QuantityFormat from '../QuantityFormat.vue'

export default defineComponent({
  components: {
    QuantityFormat,
    SeedBagQty,
    MoneyFormat,
  },
  props: {
    params: {
      required: false,
      type: Object as PropType<ICellRendererParams>,
    },
  },
  setup(props) {
    const value = computed(() => props.params?.value)
    const isMoneyFormat = computed(() => props.params?.money || false)
    const isQuantityFormat = computed(() => props.params?.quantity || false)
    const isSeedFormat = computed(() => props.params?.seed || false)
    const seedId = computed(() => props.params?.data.seedId)
    const drillUnit = computed(() => props.params?.data.unit)
    const unit = computed(() => props.params?.unit || '')
    const secondary = computed(() => {
      return { money: false, quantity: false, seed: false, unit: '', ...props.params?.secondary }
    })

    const secondaryValue = computed(() => {
      if (secondary.value.value)
        return secondary.value.value

      if (secondary.value.modifier)
        return secondary.value.modifier(props.params) || 0

      return null
    })

    return {
      drillUnit,
      isMoneyFormat,
      isQuantityFormat,
      isSeedFormat,
      seedId,
      unit,
      value,
      secondary,
      secondaryValue,
    }
  },
})
</script>

<template>
  <div>
    <MoneyFormat v-if="isMoneyFormat" :value="value" :per-unit="unit" />
    <MoneyFormat
      v-if="isMoneyFormat && secondary.money"
      :value="secondaryValue"
      :per-unit="secondary.unit"
      class="secondary"
    />

    <QuantityFormat v-if="isQuantityFormat" :magnitude="value" :units="unit" />
    <QuantityFormat
      v-if="isQuantityFormat && secondary.quantity"
      :magnitude="secondaryValue"
      :units="secondary.unit || ''"
      class="secondary"
    />

    <SeedBagQty v-if="isSeedFormat" :seed-id="seedId" :value="value" :value-unit="drillUnit" :per-unit="unit" />
    <SeedBagQty
      v-if="isSeedFormat && secondary.seed"
      :value="secondaryValue"
      :value-unit="secondary.drillUnit"
      :per-unit="secondary.unit"
      class="secondary"
    />
  </div>
</template>

<style lang="scss" scoped>
.secondary {
  font-size: 0.9rem;
  color: #9d9d9d;
  display: block;
  text-align: left;
}
</style>
