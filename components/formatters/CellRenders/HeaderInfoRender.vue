<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, ref } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'

export default defineComponent({
  components: {},
  props: {
    params: {
      required: false,
      type: Object as PropType<ICellRendererParams>,
    },
  },
  setup(props) {
    const ascSort = ref('')
    const descSort = ref('')
    const noSort = ref('')
    const order = ref(0)

    const onSortChanged = () => {
      ascSort.value = descSort.value = noSort.value = 'inactive'
      if (props.params.column.isSortAscending())
        ascSort.value = 'active'
      else if (props.params.column.isSortDescending())
        descSort.value = 'active'
      else
        noSort.value = 'active'
    }

    onMounted(() => {
      props.params.column.addEventListener('sortChanged', onSortChanged)
      onSortChanged()
    })

    const onMenuClicked = () => {
      props.params.showColumnMenu(this.$refs.menuButton)
    }

    const onSortRequested = (order, event) => {
      props.params.setSort(order, event.shiftKey)
    }

    const onChange = (order, event) => {
      if (order.value === 2)
        this.order = 0
      else order.value += 1
      switch (order.value) {
        case 0:
          props.params.setSort('', event.shiftKey)
          break
        case 1:
          props.params.setSort('desc', event.shiftKey)
          break
        case 2:
          props.params.setSort('asc', event.shiftKey)
          break
      }
    }

    return {
      ascSort,
      descSort,
      noSort,
      order,
      onChange,
      onSortChanged,
      onSortRequested,
      onMenuClicked,
    }
  },
})
</script>

<template>
  <div class="form-inline" @click="onChange('', $event)">
    {{ params.displayName }}
    <div v-if="params.menuIcon" class="ml-1">
      <span v-b-popover.hover.top.window="params.text" :title="params.title" class="text-muted">
        <font-awesome-icon :icon="params.menuIcon" size="sm" />
      </span>
    </div>
    <div v-if="params.enableSorting && ascSort === 'active'" :class="ascSort" @click="onSortRequested('asc', $event)">
      <font-awesome-icon size="sm" class="ml-1" :icon="['far', 'arrow-down']" />
    </div>
    <div
      v-else-if="params.enableSorting && descSort === 'active'"
      :class="descSort"
      @click="onSortRequested('desc', $event)"
    >
      <font-awesome-icon size="sm" class="ml-1" :icon="['far', 'arrow-up']" />
    </div>
  </div>
</template>
