<script lang="ts">
import { computed, defineComponent } from 'vue'
import YPopover from '~/components/elements/YPopover'

export default defineComponent({
  components: {
    YPopover,
  },

  props: {
    derived: {
      type: Boolean,
      default: true,
    },

    source: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sources = computed(() => {
      if (!props.source)
        return ''
      return props.source.split(';')
    })

    const message = computed(() => {
      if (!sources.value && sources.value == '')
        return ''
      const kind = sources.value.includes('missing')
        ? '*partial* yield data'
        : sources.value.includes('budget')
          ? '*budgeted* yield'
          : '*estimated* yield'
      const whose = sources.value.includes('yagro estimation') ? 'Yagro\'s' : 'your'
      const prelude = props.derived
        ? `This is based on ${whose} ${kind}`
        : `This is your ${kind}, and is used to derive other values such as your cost of production`

      const maybeStrongWarn = sources.value.includes('missing')
        ? ` ${props.derived ? 'and' : 'which'} may be severely skewed as a result`
        : ''

      return `${prelude}${maybeStrongWarn}. Send us your actual yields (even if 0t for a failed crop)
      when available for more accurate data.`
    })

    return {
      sources,
      message,
    }
  },
})
</script>

<template>
  <YPopover v-if="sources.includes('missing')" placement="top">
    <font-awesome-icon :icon="['far', 'exclamation-triangle']" />
    <template #header>
      <h5>{{ $t('tracker.incompleteYield') }}</h5>
    </template>
    <template #content>
      {{ message }}
    </template>
  </YPopover>
  <YPopover
    v-else-if="
      sources.includes('user estimation') || sources.includes('budget') || sources.includes('yagro estimation')
    "
    placement="top"
  >
    <font-awesome-icon :icon="['far', 'exclamation-triangle']" />
    <template #header>
      <h5>{{ $t('tracker.estimatedYield') }}</h5>
    </template>
    <template #content>
      {{ message }}
    </template>
  </YPopover>
</template>
