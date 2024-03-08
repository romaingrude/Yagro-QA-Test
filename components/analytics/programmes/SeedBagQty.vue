<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useQuery } from 'villus'
import QuantityFormat from '../../formatters/QuantityFormat.vue'

export default defineComponent({
  components: {
    QuantityFormat,
  },
  props: {
    includeSeed: {
      default: false,
      type: Boolean,
    },
    perUnit: String,
    reciprocal: {
      default: false,
      type: Boolean,
    },
    seedId: Number,
    value: [Number, String],
    valueUnit: {
      default: '1',
      type: String,
    },
  },
  setup(props) {
    const seedIdValue = computed(() => props.seedId)
    const reciprocalValue = computed(() => props.reciprocal)
    const perUnitValue = computed(() => props.perUnit)
    const valueUnitValue = computed(() => props.valueUnit)
    const propValue = computed(() => props.value)

    const getSeedBag = `
      query GetSeedBagInfo($seedId: ID) {
        getSeedBagInfo(seedId: $seedId) {
          id
          grams
          count
          seedId
      }
    }
    `

    const variables = ref({
      seedId: null,
    })

    watchEffect(() => {
      variables.value = {
        seedId: seedIdValue,
      }
    })

    const { data: seedBagData } = useQuery({ query: getSeedBag, variables })

    const seedBag = computed(() => {
      if (!seedBagData.value || !seedBagData.value.getSeedBagInfo) {
        return {
          count: null,
          grams: null,
        }
      }

      return {
        count: seedBagData.value.getSeedBagInfo.count,
        grams: seedBagData.value.getSeedBagInfo.grams,
      }
    })

    const seedValue = computed(() => {
      const unit = reciprocalValue.value ? perUnitValue.value.split('/')[1] : valueUnitValue.value.split('/')[0]
      let val = Number(propValue.value)

      switch (unit) {
        case '1':
          break

        case 'M':
          val *= 1000000 ** (reciprocalValue.value ? -1 : 1)
          break

        case 'kg':
        case 'kilogram':
        case 'kilograms':
          val *= ((1000 * seedBag.value.count) / seedBag.value.grams) ** (reciprocalValue.value ? -1 : 1)
          break

        case 't':
        case 'tonne':
        case 'tonnes':
          val *= ((1000000 * seedBag.value.count) / seedBag.value.grams) ** (reciprocalValue.value ? -1 : 1)
          break

        default:
          return null
      }
      return val
    })

    const bagsKnown = computed(() => seedBag.value.count !== null)

    const bagValue = computed(() =>
      reciprocalValue.value ? seedValue.value * seedBag.value.count : seedValue.value / seedBag.value.count,
    )

    const bagPerUnit = computed(() => (reciprocalValue.value ? 'bag' : perUnitValue.value))

    const seedValueScaled = computed(() => {
      if (reciprocalValue.value)
        return null

      if (perUnitValue.value === 'ha')
        return seedValue.value / 10000

      return seedValue.value
    })

    const seedPerUnit = computed(() => {
      if (reciprocalValue.value)
        return 'seed'

      return perUnitValue.value === 'ha' ? 'm^2' : perUnitValue.value
    })

    const reciprocalUnit = computed(() => (reciprocalValue.value ? perUnitValue.value.split('/')[0] : null))

    return {
      bagPerUnit,
      bagValue,
      bagsKnown,
      propValue,
      reciprocalUnit,
      reciprocalValue,
      seedBagData,
      seedPerUnit,
      seedValue,
      seedValueScaled,
      valueUnitValue,
    }
  },
})
</script>

<template>
  <span>
    <QuantityFormat
      v-if="bagsKnown"
      :magnitude="bagValue.toFixed(2)"
      :units="`${reciprocalValue ? reciprocalUnit : 'bags'}/${bagPerUnit}`"
    />
    <QuantityFormat v-else :units="`${valueUnitValue}/${bagPerUnit}`" :magnitude="Number(propValue).toFixed(2)" />
    <br>
    <span v-if="includeSeed && bagsKnown">
      <QuantityFormat
        class="parenthetical"
        :magnitude="seedValueScaled.toFixed(0)"
        :units="`${reciprocalValue ? reciprocalUnit : 'seeds'}/${seedPerUnit}`"
      />
    </span>
  </span>
</template>

<style scoped></style>
