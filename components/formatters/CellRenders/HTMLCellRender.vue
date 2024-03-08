<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import YButton from '../../elements/YButton.vue'

export default defineComponent({
  components: { YButton },
  props: {
    params: {
      required: false,
      type: Object as PropType<ICellRendererParams>,
    },
  },
  setup(props) {
    const isExpanded = ref(false)

    const insightCanExpand = computed(() => {
      const insightTooLong = props.params.value.replace(/<.*?>/g, '')?.replace(/&nbsp;/g, ' ')?.length > 250
      const insightHasTallProps
        = props.params.value.includes('<img') || props.params.value.includes('<br') || props.params.value.includes('<li')
      return insightTooLong || insightHasTallProps
    })

    const value = computed(() => {
      return props.params.value.replace(/<p>/, '').replace(/<\/p>/, '')
    })

    return {
      isExpanded,
      value,
      insightCanExpand,
    }
  },
})
</script>

<template>
  <div class="d-flex flex-column">
    <div :class="{ 'collapsed-insight insight-fade-text': insightCanExpand && !isExpanded }" v-html="value" />
    <YButton v-if="insightCanExpand" class="more align-self-start px-0" type="link" @click="isExpanded = !isExpanded">
      {{ isExpanded ? $t('general.seeLess') : $t('general.seeMore') }}
    </YButton>
  </div>
</template>

<style>
.collapsed-insight {
  max-height: 89px;
  overflow: hidden;
}

.insight-fade-text {
  -webkit-mask-image: linear-gradient(to bottom, #000 83%, transparent);
  mask-image: linear-gradient(to bottom, #000 83%, transparent);
}
</style>
