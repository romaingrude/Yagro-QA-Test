<script lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { defineComponent, ref } from 'vue'
import YButton from './YButton.vue'

export default defineComponent({
  components: {
    AgGridVue,
    YButton,
  },
  props: {
    // NOTE: The is-disabled prop only extends to the styling, and does
    // not in itself disable any functionality.
    isDisabled: {
      default: false,
      required: false,
      type: Boolean,
    },
    columnDefs: {
      default() {
        return []
      },
      required: true,
      type: Array,
    },
    defaultColDef: {
      default() {
        return {}
      },
      required: false,
      type: Object,
    },
    frameworkComponents: {
      default() {
        return {}
      },
      required: false,
      type: Object,
    },
    gridOptions: {
      default() {
        return {}
      },
      required: false,
      type: Object,
    },
    pagination: {
      default: true,
      required: false,
      type: Boolean,
    },
    paginationPageSize: {
      default: 10,
      required: false,
      type: Number,
    },
    rowData: {
      default: null,
      required: true,
      type: Array,
    },
    sideBar: {
      default() {
        return null
      },
      required: false,
      type: Object,
    },
    pinnedBottomRowData: {
      default: null,
      required: false,
      type: Array,
    },
    overrideMinHeightRestriction: {
      default: false,
      required: false,
      type: Boolean,
    },
  },
  emits: ['cellClicked', 'gridReady'],
  setup(props, { emit }) {
    const gridApi = ref('')
    const totalPages = ref(1)
    const currentPage = ref(1)

    const onGridReady = (params) => {
      gridApi.value = params.api
      totalPages.value = params.api.paginationGetTotalPages()
      currentPage.value = params.api.paginationGetCurrentPage() + 1
      emit('gridReady', params)
    }

    const onCellClicked = (event) => {
      emit('cellClicked', event)
    }

    const onPaginationChanged = (val) => {
      totalPages.value = val.api.paginationGetTotalPages()
      if (currentPage.value > totalPages.value)
        currentPage.value = 1
    }

    // Navigation between pages
    const toFirst = () => {
      props.gridOptions.api.paginationGoToFirstPage()
      currentPage.value = 1
    }
    const toLast = () => {
      props.gridOptions.api.paginationGoToLastPage()
      currentPage.value = totalPages.value
    }
    const toNext = () => {
      props.gridOptions.api.paginationGoToNextPage()
      currentPage.value += 1
    }
    const toPrevious = () => {
      props.gridOptions.api.paginationGoToPreviousPage()
      currentPage.value -= 1
    }
    const toPage = (page) => {
      props.gridOptions.api.paginationGoToPage(page - 1)
      currentPage.value = page
    }

    return {
      currentPage,
      onCellClicked,
      onGridReady,
      onPaginationChanged,
      toFirst,
      toLast,
      toNext,
      toPage,
      toPrevious,
      totalPages,
    }
  },
})
</script>

<template>
  <div>
    <AgGridVue
      v-bind="$props"
      id="agGrid"
      class="ag-theme-yagro"
      :class="{ 'disabled': isDisabled, 'min-height-0': overrideMinHeightRestriction }"
      :suppress-scroll-on-new-data="true"
      :pagination="pagination"
      :suppress-pagination-panel="pagination"
      dom-layout="autoHeight"
      @cell-clicked="onCellClicked"
      @pagination-changed="onPaginationChanged"
      @grid-ready="onGridReady"
    />
    <div v-if="pagination" class="pagination">
      <YButton id="to-first" :disabled="currentPage === 1" type="outline-primary ms-1" @click="toFirst">
        {{ $t('agGrid.first') }}
      </YButton>
      <YButton id="to-previous" :disabled="currentPage === 1" type="outline-primary ms-1" @click="toPrevious">
        {{ $t('agGrid.previous') }}
      </YButton>
      <YButton
        v-if="currentPage - 2 > 0 && currentPage === totalPages"
        type="outline-primary ms-1"
        @click="toPage(currentPage - 2)"
      >
        {{ currentPage - 2 }}
      </YButton>
      <YButton
        v-if="currentPage - 1 > 0"
        id="previous-page"
        type="outline-primary ms-1"
        @click="toPage(currentPage - 1)"
      >
        {{ currentPage - 1 }}
      </YButton>
      <YButton id="current" type="primary ms-1" @click="toPage(currentPage)">
        {{ currentPage }}
      </YButton>
      <YButton
        v-if="currentPage + 1 <= totalPages"
        id="next-page"
        type="outline-primary ms-1"
        @click="toPage(currentPage + 1)"
      >
        {{ currentPage + 1 }}
      </YButton>
      <YButton
        v-if="currentPage + 2 <= totalPages && currentPage === 1"
        type="outline-primary ms-1"
        @click="toPage(currentPage + 2)"
      >
        {{ currentPage + 2 }}
      </YButton>
      <YButton id="to-next" :disabled="currentPage === totalPages" type="outline-primary ms-1" @click="toNext">
        {{ $t('agGrid.next') }}
      </YButton>
      <YButton id="to-last" :disabled="currentPage === totalPages" type="outline-primary ms-1" @click="toLast">
        {{ $t('agGrid.last') }}
      </YButton>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/css/stylesheets/ag-grid-yagro.scss';
.pagination {
  margin-top: 20px;
  font-size: 14px;
  float: right;
  height: 45px;
}

.disabled .ag-row,
.disabled .ag-header-row,
.disabled .ag-root-wrapper {
  background-color: var(--color-dove-grey);
}

.disabled .ag-header-cell-label {
  color: var(--color-grey);
}

.min-height-0 .ag-layout-auto-height .ag-center-cols-clipper,
.min-height-0 .ag-layout-auto-height .ag-center-cols-container {
  min-height: 0;
}
</style>
