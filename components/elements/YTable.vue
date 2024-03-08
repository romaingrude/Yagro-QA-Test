<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Skeleton from 'primevue/skeleton'
import type { PropType } from 'vue'

import { FilterMatchMode } from 'primevue/api'
import YButton from './YButton.vue'
import YPopover from './YPopover.vue'

// TYPES
interface TableColumn {
  name: string
  key: string
  unformatted?: boolean // Must provide a template with custom format
  sortable?: boolean
  popoverTitle?: string
  popoverContent?: string
  headerClass?: string // We can provide multiple class with blank space like headerClass: 'w-25 text-center text-white'
}

// COMPONENT
export default defineComponent({
  components: { Column, DataTable, Skeleton, YButton, YPopover },
  props: {
    columns: {
      required: true,
      type: Array as PropType<TableColumn[]>,
    },
    striped: {
      default: false,
      type: Boolean,
    },
    sortField: {
      default: '',
      type: String,
    },
    sortOrder: {
      default: 1,
      type: Number,
    },
    exportable: {
      // To show 'Export Data' made it :exportable="true" in component
      default: false,
      type: Boolean,
    },
    filterFields: {
      // To filter table data, need to send filterable fields. To see example => components/data/purchases/PurchasesTable.vue (filters computed variable)
      // If there is no filter field it will take it from tableColumns' keys.

      default: () => [],
      required: false,
      type: Array,
    },
    filterable: {
      // To show Search Input made it :filterable="true" in component
      default: false,
      type: Boolean,
    },
    fixedWidth: {
      default: false,
      type: Boolean,
    },
    items: {
      required: true,
      type: Array as PropType<object[]>,
    },
    perPage: {
      default: 25,
      type: Number,
    },
    responsiveLayout: {
      default: 'scroll',
      type: String,
    },
    small: {
      default: false,
      type: Boolean,
    },
    withPaging: {
      default: false,
      type: Boolean,
    },
    defaultSortField: {
      default: '',
      type: String,
    },
    defaultSortOrder: {
      default: -1,
      type: Number,
    },
  },
  setup(props) {
    const tableColumns = computed(() => props.columns)
    const tableItems = computed(() => props.items)
    const fixedWidthSize = computed(() => props.fixedWidth)
    const smallClass = computed(() => props.small)
    const globalFilterFields = computed(() => {
      if (props.filterFields.length > 0)
        return props.filterFields

      const arr = []
      tableColumns.value.forEach(col => arr.push(col.key))
      return arr
    })

    const tableExportable = computed(() => props.exportable)
    const tableFilterable = computed(() => props.filterable)
    const loading = inject('loading')
    const dt = ref()

    const exportCSV = () => {
      dt.value.exportCSV()
    }

    const filters = ref({
      global: { matchMode: FilterMatchMode.CONTAINS, value: null },
    })

    return {
      dt,
      exportCSV,
      filters,
      fixedWidthSize,
      globalFilterFields,
      smallClass,
      tableColumns,
      tableExportable,
      tableFilterable,
      tableItems,
      loading,
    }
  },
})
</script>

<template>
  <div>
    <div v-if="tableExportable" class="text-end">
      <YButton class="mb-3" @click="exportCSV($event)">
        <font-awesome-icon :icon="['far', 'file-download']" fixed-width />
        {{ $t('dataTable.exportData') }}
      </YButton>
    </div>

    <div v-if="tableFilterable" class="row mb-3">
      <div class="col-lg-3 ms-auto">
        <div class="input-group">
          <label for="searchField" class="col-form-label me-2">{{ $t('dataTable.search') }}</label>
          <div class="col">
            <input id="searchField" v-model="filters.global.value" type="text" class="form-control">
          </div>
        </div>
      </div>
    </div>

    <DataTable
      ref="dt"
      :filters="filters"
      :value="tableItems"
      :paginator="withPaging"
      :rows="perPage"
      :rows-per-page-options="[10, 25, 50]"
      :class="smallClass ? 'p-datatable-sm' : ''"
      :responsive-layout="responsiveLayout"
      :global-filter-fields="globalFilterFields"
      :sort-order="sortOrder"
      :sort-field="sortField"
      :striped-rows="striped"
    >
      <template #empty>
        <div v-if="loading" class="d-flex justify-content-between content-gap">
          <Skeleton v-for="col in tableColumns" :key="col.key" />
        </div>
        <slot v-else name="empty">
          <p class="font-italic mb-0" style="text-align: center">
            {{ $t('dataTable.emptyTable') }}
          </p>
        </slot>
      </template>

      <Column
        v-for="col in tableColumns"
        :key="col.key"
        :field="col.key"
        :sortable="col.sortable"
        :header-class="`text-capitalize ${col.headerClass}`"
        :style="fixedWidthSize ? `width: ${100 / tableColumns.length}%;` : ''"
      >
        <template #header>
          {{ col.name }}
          <YPopover v-if="col.popoverTitle && col.popoverContent" placement="top">
            <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
            <template #header>
              <h5>{{ col.popoverTitle }}</h5>
            </template>
            <template #content>
              <span style="font-weight: normal; text-transform: none">{{ col.popoverContent }}</span>
            </template>
          </YPopover>
        </template>
        <template v-if="!col.unformatted" #body="slotProps">
          <Skeleton v-if="loading" />
          <slot v-else :name="col.key" :data="slotProps.data" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.content-gap {
  gap: 10px;
}
</style>
