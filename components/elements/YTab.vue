<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'

// TYPES
interface Tab {
  name: string
  key: string
  disabled?: boolean
}

export default defineComponent({
  components: { TabPanel, TabView },
  props: {
    tabs: {
      required: true,
      type: Array as PropType<Tab[]>,
    },
  },
  setup(props) {
    const panelTabs = computed(() => props.tabs)
    return { panelTabs }
  },
})
</script>

<template>
  <TabView class="mt-3">
    <TabPanel v-for="tab in panelTabs" :key="tab.key" :field="tab.key" :disabled="tab.disabled">
      <template #header>
        {{ tab.name }}
      </template>
      <slot :name="tab.key" />
    </TabPanel>
  </TabView>
</template>
