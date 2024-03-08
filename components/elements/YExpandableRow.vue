<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    identifier: { required: true, type: String }, // required when using multiple expandable row components
    expandStyle: { required: false, type: String, default: 'm-2' },
    headerStyle: { required: false, type: String, default: 'p-3' },
  },
  setup(props) {
    const rowIdentifier = ref(props.identifier)
    const expanded = ref(false)
    return {
      expanded,
      rowIdentifier,
    }
  },
})
</script>

<template>
  <div :class="`expandable-wrapper my-3 border rounded ${headerStyle}`">
    <div class="d-flex justify-content-between">
      <div
        class="pointer arrow-icon d-flex align-items-center justify-content-center bg-light text-success border rounded-circle"
        data-bs-toggle="collapse"
        :data-bs-target="`#collapseContent-${rowIdentifier}`"
        aria-expanded="false"
        :aria-controls="`collapseContent-${rowIdentifier}`"
        alt="Arrow Expand"
        @click="expanded = !expanded"
      >
        <font-awesome-icon :icon="['far', `chevron-${expanded ? 'down' : 'right'}`]" fixed-width />
      </div>
      <slot name="expandable-header" />
    </div>
    <div
      :id="`collapseContent-${rowIdentifier}`"
      :class="expanded ? `collapse show ${expandStyle}` : `collapse ${expandStyle}`"
    >
      <slot name="expanded-content" />
    </div>
  </div>
</template>

<style scoped>
.arrow-icon {
  position: absolute;
  left: -12px;
  height: 26px;
  width: 26px;
  margin-right: 1rem;
}
.expandable-wrapper {
  position: relative;
  width: 100%;
}
</style>
