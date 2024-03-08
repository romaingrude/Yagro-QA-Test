<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'

// TYPES
interface TableColumn {
  name: string
}
interface TableItem {
  field: string
}

// COMPONENT
export default defineComponent({
  props: {
    columns: {
      required: true,
      type: Array as PropType<TableColumn[]>,
    },
    items: {
      required: true,
      type: Array as PropType<TableItem[]>,
    },
  },
  setup(props) {
    const tableColumns = computed(() => props.columns)
    const tableItems = computed(() => props.items)
    return {
      tableColumns,
      tableItems,
    }
  },
})
</script>

<template>
  <div>
    <table class="table table-bordered">
      <thead class="table-light">
        <tr>
          <th v-for="col in tableColumns" :key="`colHeader${col.name}`">
            {{ col.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableItems" :key="`row${item.field}`">
          <!-- Look up Vue scoped slots for docs on this -->
          <slot :item="item" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
