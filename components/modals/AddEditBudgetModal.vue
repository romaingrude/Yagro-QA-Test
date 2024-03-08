<script>
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import cropSelect from '../core/cropSelect.vue'
import MoneyQuantityCellRender from '../formatters/CellRenders/MoneyQuantityCellRender.vue'
import YAgGrid from '../elements/YAgGrid.vue'
import YButton from '../elements/YButton.vue'
import YModal from '../elements/YModal.vue'
import YToggle from '../elements/YToggle.vue'
import { useNuxtApp } from '#imports'

export default defineComponent({
  // eslint-disable-next-line vue/no-unused-components
  components: { CropSelect: cropSelect, MoneyQuantityCellRender, YAgGrid, YButton, YModal, YToggle },
  props: {
    budget: {
      default: null,
      type: Object,
    },
    editingExisting: {
      default: false,
      type: Boolean,
    },
    show: {
      default: false,
      required: true,
      type: Boolean,
    },
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const nuxtApp = useNuxtApp()
    const variableGridApi = ref()
    const fixedGridApi = ref()

    const fixedRowDataTotals = ref([
      {
        fuel: 0,
        contractsAndHire: 0,
        labour: 0,
        machinery: 0,
        overheads: 0,
        rentAndInterest: 0,
      },
    ])

    const fixedRowDataByHa = ref([
      {
        fuel: 0,
        contractsAndHire: 0,
        labour: 0,
        machinery: 0,
        overheads: 0,
        rentAndInterest: 0,
      },
    ])

    const variableRowData = ref([{ area: 0, seed: 0, fertiliser: 0, chemical: 0, yield: 0, price: 0 }])
    const fixedCostsToggleByHa = ref(false)

    const updateFixedRows = (params) => {
      const area = variableRowData.value[0].area
      let source

      if (params)
        source = params.data
      else
        source = fixedCostsToggleByHa.value ? fixedRowDataByHa.value[0] : fixedRowDataTotals.value[0]

      if (fixedCostsToggleByHa.value) {
        fixedRowDataByHa.value[0] = {
          fuel: Number(source.fuel),
          contractsAndHire: Number(source.contractsAndHire),
          labour: Number(source.labour),
          machinery: Number(source.machinery),
          overheads: Number(source.overheads),
          rentAndInterest: Number(source.rentAndInterest),
        }
        fixedRowDataTotals.value[0] = {
          fuel: Number(source.fuel) * area,
          contractsAndHire: Number(source.contractsAndHire) * area,
          labour: Number(source.labour) * area,
          machinery: Number(source.machinery) * area,
          overheads: Number(source.overheads) * area,
          rentAndInterest: Number(source.rentAndInterest) * area,
        }
      }
      else {
        fixedRowDataTotals.value[0] = {
          fuel: Number(source.fuel),
          contractsAndHire: Number(source.contractsAndHire),
          labour: Number(source.labour),
          machinery: Number(source.machinery),
          overheads: Number(source.overheads),
          rentAndInterest: Number(source.rentAndInterest),
        }
        fixedRowDataByHa.value[0] = {
          fuel: Number(source.fuel) / area,
          contractsAndHire: Number(source.contractsAndHire) / area,
          labour: Number(source.labour) / area,
          machinery: Number(source.machinery) / area,
          overheads: Number(source.overheads) / area,
          rentAndInterest: Number(source.rentAndInterest) / area,
        }
      }
    }

    const zeroData = () => {
      variableRowData.value[0] = { area: 0, seed: 0, fertiliser: 0, chemical: 0, yield: 0, price: 0 }
      fixedRowDataTotals.value[0] = {
        fuel: 0,
        contractsAndHire: 0,
        labour: 0,
        machinery: 0,
        overheads: 0,
        rentAndInterest: 0,
      }
      fixedRowDataByHa.value[0] = {
        fuel: 0,
        contractsAndHire: 0,
        labour: 0,
        machinery: 0,
        overheads: 0,
        rentAndInterest: 0,
      }
    }

    const save = () => {
      emit('save')
      zeroData()
    }

    const close = () => {
      emit('close')
      zeroData()
    }

    const variableOnGridReady = (params) => {
      variableGridApi.value = params.api
      variableGridApi.value.sizeColumnsToFit()
    }

    const fixedOnGridReady = (params) => {
      fixedGridApi.value = params.api
      fixedGridApi.value.sizeColumnsToFit()
    }

    window.onresize = () => {
      if (variableGridApi.value)
        variableGridApi.value.sizeColumnsToFit({ defaultMinWidth: 100 })

      if (fixedGridApi.value)
        fixedGridApi.value.sizeColumnsToFit({ defaultMinWidth: 100 })
    }

    const variableColumnDefs = [
      {
        headerName: 'Area',
        field: 'area',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { quantity: true, unit: 'ha' },
      },
      {
        headerName: 'Seed',
        field: 'seed',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { money: true, unit: 'ha' },
      },
      {
        headerName: 'Fertiliser',
        field: 'fertiliser',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { money: true, unit: 'ha' },
      },
      {
        headerName: 'Chemical',
        field: 'chemical',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { money: true, unit: 'ha' },
      },
      {
        headerName: 'Yield',
        field: 'yield',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { quantity: true, unit: 't/ha' },
      },
      {
        headerName: 'Price',
        field: 'price',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { money: true, unit: 't' },
      },
    ]
    const variableDefaultColumnDef = {
      width: 140,
      editable: true,
    }

    const fixedColumnDefs = [
      {
        headerName: 'Fuel',
        field: 'fuel',
      },
      {
        headerName: 'Contract & Hire',
        field: 'contractsAndHire',
      },
      {
        headerName: 'Labour',
        field: 'labour',
      },
      {
        headerName: 'Machinery',
        field: 'machinery',
      },
      {
        headerName: 'Overheads',
        field: 'overheads',
      },
      {
        headerName: 'Rent & Interest',
        field: 'rentAndInterest',
      },
    ]
    const fcEditable = computed(() => variableRowData.value[0].area !== 0)

    const fixedDefaultColumnDef = {
      width: 140,
      cellRendererSelector: () => {
        let outParams = {}
        if (fixedCostsToggleByHa.value) {
          outParams = {
            money: true,
            unit: 'ha',
            secondary: {
              money: true,
              modifier: params => params.value * variableRowData.value[0].area,
            },
          }
        }
        else {
          outParams = {
            money: true,
            secondary: {
              money: true,
              modifier: params => params.value / variableRowData.value[0].area,
              unit: 'ha',
            },
          }
        }
        return {
          component: 'MoneyQuantityCellRender',
          params: outParams,
        }
      },
      editable: () => fcEditable.value,
    }

    const sharedGridOptions = {
      singleClickEdit: true,
      stopEditingWhenCellsLoseFocus: true,
    }
    const variableGridOptions = {
      ...sharedGridOptions,
      onCellValueChanged: (params) => {
        variableRowData.value[0].area = Number(params.data.area)
        updateFixedRows()
      },
    }
    const fixedGridOptions = {
      ...sharedGridOptions,
      onCellValueChanged: (params) => {
        updateFixedRows(params)
      },
    }

    const fixedOnCellClicked = () => {
      if (fcEditable.value)
        return
      nuxtApp.$Yalert.addAlert({
        title: 'Cannot edit cell',
        text: 'No area available. Please add area in the variable costs table.',
        mode: 'warning',
        isDismissible: true,
        autoDismiss: true,
      })
    }

    const frameworkComponents = { MoneyQuantityCellRender }

    const switchMode = () => {
      fixedCostsToggleByHa.value = !fixedCostsToggleByHa.value
    }

    return {
      t,
      fixedCostsToggleByHa,
      save,
      close,
      variableOnGridReady,
      fixedOnGridReady,
      variableColumnDefs,
      variableDefaultColumnDef,
      variableRowData,
      fixedColumnDefs,
      fixedDefaultColumnDef,
      fixedRowDataTotals,
      fixedRowDataByHa,
      variableGridOptions,
      fixedGridOptions,
      fcEditable,
      fixedOnCellClicked,
      frameworkComponents,
      switchMode,
    }
  },
})
</script>

<template>
  <YModal :show="show" @close="close" @cancel="close">
    <template #header>
      {{ editingExisting ? $t('general.edit') : $t('general.add') }} {{ $t('budgets.cropBudget') }}
    </template>
    <template #body>
      <CropSelect />
      <div class="mt-5">
        <h5 class="text-capitalize">
          {{ $t('budgets.variableCosts') }}
        </h5>
        <YAgGrid
          :column-defs="variableColumnDefs"
          :row-data="variableRowData"
          :default-col-def="variableDefaultColumnDef"
          :grid-options="variableGridOptions"
          :pagination="false"
          :override-min-height-restriction="true"
          @grid-ready="variableOnGridReady"
        />
      </div>
      <div class="mt-5">
        <div class="d-flex">
          <h5 class="text-capitalize">
            {{ $t('budgets.fixedCosts') }}
          </h5>
          <font-awesome-icon v-if="!fcEditable" class="mt-1 ml-2" :icon="['far', 'fa-lock-alt']" />
          <span class="d-flex align-items-center ml-3 mb-1">
            {{ $t('budgets.totalPounds') }}
            <YToggle :is-checked="fixedCostsToggleByHa" :is-disabled="!fcEditable" @switch-func="switchMode" />
            {{ $t('budgets.poundsPerHa') }}
          </span>
        </div>
        <YAgGrid
          :column-defs="fixedColumnDefs"
          :row-data="fixedCostsToggleByHa ? fixedRowDataByHa : fixedRowDataTotals"
          :default-col-def="fixedDefaultColumnDef"
          :grid-options="fixedGridOptions"
          :pagination="false"
          :is-disabled="!fcEditable"
          :framework-components="frameworkComponents"
          :override-min-height-restriction="true"
          @grid-ready="fixedOnGridReady"
          @cell-clicked="fixedOnCellClicked"
        />
      </div>
      <p class="font-italic text-muted mt-3">
        *{{ $t('budgets.clickToEdit') }}
      </p>
    </template>
    <template #footer>
      <YButton type="tertiary" class="mx-3" @click="close">
        {{ $t('general.cancel') }}
      </YButton>
      <YButton @click="save">
        {{ $t('general.save') }}
      </YButton>
    </template>
  </YModal>
</template>

<style lang="scss" scoped>
.ml-2 {
  margin-left: 0.5rem !important;
}

.ml-3 {
  margin-left: 1rem !important;
}
</style>
