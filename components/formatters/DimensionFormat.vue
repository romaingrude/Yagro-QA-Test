<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    value: { required: true, type: String },
  },
  setup(props) {
    const value = ref(props.value)

    // Methods
    const toFarmerStandardUnits = (siUnit) => {
      switch (siUnit) {
        case 'Mg':
          return 't'
        default:
          return siUnit
      }
    }

    const toLongFormSIPrefix = (prefix) => {
      switch (prefix) {
        case 'M':
          return 'mega'
        case 'k':
          return 'kilo'
        case 'd':
          return 'deci'
        case 'c':
          return 'centi'
        case 'm':
          return 'milli'
        case 'u':
          return 'micro'
        default:
          // probably we guessed wrong that this was SI prefix,
          // might be e.g. the 's' from 'seed'.
          return prefix
      }
    }

    const toLongForm = (farmerStandardUnit, plural) => {
      switch (farmerStandardUnit) {
        case 't':
          return `tonne${plural ? 's' : ''}`
        case 'ha':
          return `hectare${plural ? 's' : ''}`
        case '£':
          return `pound${plural ? 's' : ''} sterling`
        default: {
          let prefix = ''
          let unprefixed = farmerStandardUnit

          if (farmerStandardUnit.length > 1 && farmerStandardUnit[1] != '^') {
            prefix = toLongFormSIPrefix(farmerStandardUnit[0])
            unprefixed = farmerStandardUnit.slice(1)
          }

          switch (unprefixed) {
            case 'g':
              return `${prefix}gram${plural ? 's' : ''}`
            case 'l':
            case 'L':
              return `${prefix}litre${plural ? 's' : ''}`
            case 'm^2':
              return `${prefix}metre${plural ? 's' : ''} squared`
            default:
              return `${prefix}${unprefixed}`
          }
        }
      }
    }
    const fractional = computed(() => {
      return value.value
        .split('/')
        .concat([''])
        .map(p => p.trim())
        .map(p => (p == '' ? '1' : p))
        .map(toFarmerStandardUnits)
    })
    const numerator = computed(() => {
      return fractional.value[0]
    })
    const denominator = computed(() => {
      return fractional.value[1]
    })
    const asText = computed(() => {
      const num = numerator.value == 1 ? '' : `${toLongForm(numerator, true)}`
      const den = denominator.value == 1 ? '' : `per ${toLongForm(denominator.value, false)}`
      return num + (num && den ? ' ' : '') + den
    })
    return { asText, denominator, numerator }
  },
})
</script>

<template>
  <span data-bs-toggle="tooltip" data-bs-placement="bottom" :title="asText" class="dimension unit-per">
    <span v-if="numerator && numerator !== '1'" class="numerator" v-html="numerator.replace('^2', '&sup2;')" />
    <span v-if="denominator && denominator !== '1'" class="divider"> / </span>
    <span v-if="denominator && denominator !== '1'" class="denominator" v-html="denominator.replace('^2', '&sup2;')" />
  </span>
</template>

<style scoped>
.dimension {
  display: inline-flex;
}

.unit-per {
  font-size: smaller;
}
</style>
