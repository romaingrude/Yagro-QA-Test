<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

// TYPES
interface BreadcrumbItem {
  label: string
  onClick(): void
}
// COMPONENT
export default defineComponent({
  props: {
    items: { required: true, type: Array as PropType<BreadcrumbItem[]> },
  },
  setup(props) {
    const breadcrumbItems = computed(() => props.items)
    return {
      breadcrumbItems,
    }
  },
})
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="(item, index) in breadcrumbItems"
        :key="`breadcrumb${item.label}`"
        class="text-capitalize link-style breadcrumb-item"
        :class="{ active: index + 1 === breadcrumbItems.length }"
        aria-current="page"
        @click="item.onClick"
      >
        {{ item.label }}
      </li>
    </ol>
  </nav>
</template>
