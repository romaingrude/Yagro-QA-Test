<script lang="ts">
import Popper from 'vue3-popper/dist/popper.esm'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { Popper },
  props: [],
})
</script>

<template>
  <Popper v-bind="$attrs" arrow hover>
    <slot />
    <template #content>
      <slot id="popperContent" name="content" />
    </template>
  </Popper>
</template>

<style scoped>
:deep(.popper),
#popperContent {
  background-color: black !important;
  padding: 5px !important;
  border-radius: 20px !important;
  color: white !important;
}

:deep(.popper #arrow::before) {
  background: black;
}

:deep(.popper:hover),
:deep(.popper:hover > #arrow::before) {
  background: black;
}
</style>
