<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '../../stores/settings'
import DimensionFormat from './DimensionFormat.vue'

export default defineComponent({
  components: { DimensionFormat },
  props: {
    currencyCode: { type: String },
    perUnit: { default: '', type: String },
    quantity: { type: Object },
    value: {
      default: '',
      type: [Number, String],
    },
  },
  setup(props) {
    const settings = useSettingsStore()
    const { locale } = useI18n()

    const _currencyCode = computed(() => props.currencyCode)
    const _perUnit = computed(() => props.perUnit)
    const _value = computed(() => props.value)
    const _quantity = computed(() => props.quantity)

    const moneyValue = computed(() => {
      return Number(_quantity.value ? _quantity.value.magnitude : _value.value)
    })

    const moneyPerUnit = computed(() => {
      return _quantity.value ? _quantity.value.dimension.split('/')[1] : _perUnit.value
    })

    const currencyCode = computed(() => {
      const cCode = _currencyCode.value ? _currencyCode.value : settings.currencyCode
      if (_quantity.value) {
        const check = _quantity.value.dimension.split('/')[0]
        if (cCode && cCode !== check)
          console.error(`Mismatched currency codes: ${_currencyCode.value} from prop and ${check} from quantity`)
      }
      return cCode
    })

    const formatter = computed(() => {
      const langCode = locale.value
      return Intl.NumberFormat(langCode, {
        currency: currencyCode.value,
        style: 'currency',
      })
    })

    const formatted = computed(() => {
      return formatter.value.format(moneyValue.value)
    })

    return {
      formatted,
      moneyPerUnit,
      moneyValue,
    }
  },
})
</script>

<template>
  <span v-if="Number.isFinite(moneyValue)" class="no-wrap">
    <span class="currency">{{ formatted }}</span>
    <DimensionFormat v-if="moneyPerUnit !== undefined" :value="`/${moneyPerUnit}`" />
  </span>
  <span v-else class="text-muted">
    {{ $t('general.na') }}
  </span>
</template>

<style lang="scss">
.currency {
  white-space: nowrap;
}
</style>
