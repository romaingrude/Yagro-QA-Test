<script lang="ts">
import Popper from 'vue3-popper/dist/popper.esm'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: { Popper },
  props: {
    noHeader: { default: false, type: Boolean },
  },
  setup(props) {
    const hasHeader = computed(() => props.noHeader)
    return { hasHeader }
  },
})
</script>

<template>
  <Popper v-bind="$attrs" arrow hover>
    <slot />
    <template #content>
      <div v-if="!hasHeader" class="bg-dove-grey p-2 header-wrapper">
        <slot name="header" />
      </div>
      <div id="popperContentWrapper" class="p-2">
        <slot name="content" />
      </div>
    </template>
  </Popper>
</template>

<style scoped>
:deep(.popper) {
  z-index: 1060;
  display: block;
  max-width: 276px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  text-align: start;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  word-break: normal;
  word-spacing: normal;
  white-space: normal;
  line-break: auto;
  font-size: 0.875rem;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
}

:deep(.popper h5) {
  margin-bottom: 0;
  font-size: 1rem;
}

.header-wrapper {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0;
  font-size: 1rem;
  color: inherit;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ebebeb;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

#popperContentWrapper {
  background-color: #fff;
  padding: 0.5rem 0.75rem;
  color: #212529;
  border-bottom-left-radius: calc(0.3rem - 1px);
  border-bottom-right-radius: calc(0.3rem - 1px);
}
</style>
