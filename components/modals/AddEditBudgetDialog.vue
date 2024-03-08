<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from 'nuxt/app'
import YAgGrid from '~/components/elements/YAgGrid'
import MoneyFormat from '~/components/formatters/MoneyFormat'
import MoneyQuantityCellRender from '~/components/formatters/CellRenders/MoneyQuantityCellRender'
import YButton from '~/components/elements/YButton'
import YAlert from '~/components/elements/YAlert'
import { useSelectedStore } from '~/stores/selected'
import YIcon from '~/components/elements/YIcon'
import YToggle from '~/components/elements/YToggle'
import YSelect from '~/components/elements/YSelect'

export default defineComponent({
  name: 'AddEditBudgetDialog',
  components: {
    YButton,
    YAgGrid,
    MoneyFormat,
    // eslint-disable-next-line vue/no-unused-components
    MoneyQuantityCellRender,
    YAlert,
    YIcon,
    YToggle,
    YSelect,
  },
  props: {
    budget: {
      default: () => [],
      type: Array,
      required: false,
    },
    fixedCost: {
      default: () => [],
      type: Array,
      required: false,
    },
    editingExisting: {
      default: false,
      type: Boolean,
    },
    crops: {
      default: () => [],
      type: Array,
      require: false,
    },
  },
  emits: ['closeDialog', 'saveAddedBudget'],
  setup(props, context) {
    const variableCostsChanged = ref(0)
    const budgetData = ref(props.budget)
    const gridApi = ref()
    const gridColumnApi = ref()
    const fixedCostData = ref(props.fixedCost)
    const chosenCropId = ref(budgetData.value[0]?.crop?.id || undefined)
    const poundsPerHa = ref('')
    const changesMade = ref(false)
    const showSaveAlert = ref(false)

    const budgetModel = ref({
      area: budgetData.value[0]?.area?.magnitude || Number.parseFloat(budgetData.value[0]?.area.toFixed(2)) || 0,
      seedCostPerHa:
        Number.parseFloat((budgetData.value[0]?.cost?.seed / budgetData.value[0]?.area?.magnitude).toFixed(2))
        || Number.parseFloat(budgetData.value[0]?.seedCostPerHa.toFixed(2))
        || 0,
      fertiliserCostPerHa:
        Number.parseFloat((budgetData.value[0]?.cost?.fertiliser / budgetData.value[0]?.area?.magnitude).toFixed(2))
        || Number.parseFloat(budgetData.value[0]?.fertiliserCostPerHa.toFixed(2))
        || 0,
      chemicalCostPerHa:
        Number.parseFloat((budgetData.value[0]?.cost?.chemical / budgetData.value[0]?.area?.magnitude).toFixed(2))
        || Number.parseFloat(budgetData.value[0]?.chemicalCostPerHa.toFixed(2))
        || 0,
      cropYield: budgetData.value[0]?.yield?.magnitude || Number.parseFloat(budgetData.value[0]?.cropYield.toFixed(2)) || 0,
      salePrice: budgetData.value[0]?.price || Number.parseFloat(budgetData.value[0]?.salePrice.toFixed(2)) || 0,
    })

    const variableCostsRowData = ref([
      props.editingExisting
        ? {
            area: budgetModel.value.area,
            seedCostPerHa: budgetModel.value.seedCostPerHa,
            fertiliserCostPerHa: budgetModel.value.fertiliserCostPerHa,
            chemicalCostPerHa: budgetModel.value.chemicalCostPerHa,
            cropYield: budgetModel.value.cropYield,
            salePrice: budgetModel.value.salePrice,
          }
        : {
            area: 0,
            seedCostPerHa: 0,
            fertiliserCostPerHa: 0,
            chemicalCostPerHa: 0,
            cropYield: 0,
            salePrice: 0,
          },
    ])

    const fixedCostEditable = ref(false)

    onMounted(() => {
      if (variableCostsRowData.value[0]?.area > 0)
        fixedCostEditable.value = true
    })

    const { t } = useI18n()

    const selected = useSelectedStore()
    const cropsData = ref(props.crops)

    const numberValueParser = (params) => {
      if (Number.isNaN(Number(params.newValue)) || !params.newValue)
        return params.oldValue || 0
      else
        return Number(params.newValue)
    }

    const fixedCostsRowData = ref([
      props.editingExisting
        ? {
            fuel: fixedCostData.value[0].fuel,
            contractsAndHire: fixedCostData.value[0].contractsAndHire,
            labour: fixedCostData.value[0].labour,
            machinery: fixedCostData.value[0].machinery,
            overheads: fixedCostData.value[0].overheads,
            rentAndInterest: fixedCostData.value[0].rentAndInterest,
          }
        : {
            fuel: null,
            contractsAndHire: null,
            labour: null,
            machinery: null,
            overheads: null,
            rentAndInterest: null,
          },
    ])

    const budgeted = computed(() => {
      const budgetedPrice = budgetModel.value.salePrice
      const budgetedSales = budgetModel.value.area * budgetModel.value.cropYield * budgetModel.value.salePrice

      const variableCosts
        = Number.parseFloat(variableCostsRowData.value[0].seedCostPerHa)
        + Number.parseFloat(variableCostsRowData.value[0].fertiliserCostPerHa)
        + Number.parseFloat(variableCostsRowData.value[0].chemicalCostPerHa)

      const fixedCosts = Object.values(fixedCostsRowData.value[0]).reduce(
        (acc, prev) => Number(acc) + (poundsPerHa.value ? Number(prev) : Number(prev) / variableCostsRowData.value[0].area),
        0,
      )

      const budgetedBreakEven = (variableCosts + fixedCosts) / budgetModel.value.cropYield

      return {
        price: budgetedPrice || 0,
        sales: Number.isNaN(budgetedSales) ? 0 : budgetedSales.toFixed(2),
        breakEven: Number.isNaN(budgetedBreakEven) ? 0 : budgetedBreakEven.toFixed(2),
      }
    })

    const changeUnits = () => {
      poundsPerHa.value = poundsPerHa.value ? '' : 'ha'
      Object.entries(fixedCostsRowData.value[0]).forEach(([key, value]) => {
        fixedCostsRowData.value[0][key] = poundsPerHa.value
          ? value / variableCostsRowData.value[0].area
          : value * variableCostsRowData.value[0].area
      })

      gridApi.value.refreshCells({ force: true })
    }

    const onGridReady = (params) => {
      gridApi.value = params.api
      gridColumnApi.value = params.columnApi
    }

    // Variable Costs
    const varialbleCostsGridOptions = ref({
      singleClickEdit: true,
      stopEditingWhenCellsLoseFocus: true,
      context: {
        budget: true,
        componentParent: this,
        group: null,
      },
      onCellValueChanged: (params) => {
        variableCostsChanged.value = 0
        for (const [key, value] of Object.entries(budgetModel)) {
          if (Number(value) !== Number(params.data[key]))
            variableCostsChanged.value += 1
        }
        changesMade.value = variableCostsChanged.value > 0

        gridApi.value.refreshCells({ force: true })
      },
    })

    const variableCostsDefaultColDef = ref({
      width: 130,
      sortable: false,
      resizable: false,
      filter: false,
      editable: true,
      valueParser: numberValueParser,
    })

    const variableCostsColumnDefs = ref([
      {
        headerName: 'Area',
        field: 'area',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { quantity: true, unit: 'ha' },
        onCellValueChanged: (params) => {
          fixedCostEditable.value = params.newValue > 0
          gridApi.value.refreshCells({ force: true })
        },
      },
      {
        headerName: 'Seed',
        field: 'seedCostPerHa',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { money: true, unit: 'ha' },
      },
      {
        headerName: 'Fertiliser',
        field: 'fertiliserCostPerHa',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { money: true, unit: 'ha' },
      },
      {
        headerName: 'Chemical',
        field: 'chemicalCostPerHa',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { money: true, unit: 'ha' },
      },
      {
        headerName: 'Yield',
        field: 'cropYield',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { quantity: true, unit: 't/ha' },
      },
      {
        headerName: 'Price',
        field: 'salePrice',
        cellRenderer: 'MoneyQuantityCellRender',
        cellRendererParams: { money: true, unit: 't' },
      },
    ])

    // Fixed Costs
    const fixedCostsGridOptions = ref({
      singleClickEdit: true,
      stopEditingWhenCellsLoseFocus: true,
      context: {
        budget: true,
        componentParent: this,
        group: null,
      },
    })

    const fixedCostsDefaultColDef = ref({
      width: 130,
      sortable: false,
      resizable: false,
      filter: false,
      editable: () => {
        return fixedCostEditable.value
      },
      valueParser: numberValueParser,
      cellRenderer: 'MoneyQuantityCellRender',
      cellRendererSelector: () => {
        return {
          component: 'MoneyQuantityCellRender',
          params: {
            money: true,
            unit: poundsPerHa.value ? 'ha' : '',
            secondary: {
              money: true,
              modifier: poundsPerHa.value
                ? params => params.value * variableCostsRowData.value[0].area
                : params => params.value / variableCostsRowData.value[0].area,
              unit: poundsPerHa.value ? '' : 'ha',
            },
          },
        }
      },
    })

    const fixedCostsColumnDefs = ref([
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
    ])

    const { $fetchData } = useNuxtApp()

    const showThreeYearAlert = ref(false)
    const threeYearResponse = ref({
      mode: '',
      message: '',
    })

    const calculateThreeYearAverage = async () => {
      showThreeYearAlert.value = false
      threeYearResponse.value = {
        mode: '',
        message: '',
      }
      let currentYear = selected.year
      const allYears = []
      for (let i = 0; i < 3; i++) {
        allYears.push(currentYear)
        currentYear -= 1
      }

      const allFetchData = [
        await $fetchData(`budgets/${allYears[0]}/crops/${chosenCropId.value}`),
        await $fetchData(`budgets/${allYears[1]}/crops/${chosenCropId.value}`),
        await $fetchData(`budgets/${allYears[2]}/crops/${chosenCropId.value}`),
      ]

      if (!allFetchData.includes(undefined)) {
        const allYearsData = {
          area: [],
          seedCostPerHa: [],
          fertiliserCostPerHa: [],
          chemicalCostPerHa: [],
          cropYield: [],
          salePrice: [],
        }

        // Get all values for each item over 3 years
        allFetchData.forEach((item) => {
          allYearsData.area.push(Number.parseFloat(item?.area.magnitude) || 0)
          allYearsData.seedCostPerHa.push(Number.parseFloat((item?.cost.seed / item?.area.magnitude).toFixed(2)) || 0)
          allYearsData.fertiliserCostPerHa.push(
            Number.parseFloat((item?.cost.fertiliser / item?.area.magnitude).toFixed(2)) || 0,
          )
          allYearsData.chemicalCostPerHa.push(Number.parseFloat((item?.cost.chemical / item?.area.magnitude).toFixed(2)) || 0)
          allYearsData.cropYield.push(Number.parseFloat(item?.yield.magnitude) || 0)
          allYearsData.salePrice.push(Number.parseFloat(item?.price) || 0)
        })

        // Calculate the Average and set Three year average data
        variableCostsRowData.value[0].area = Number.parseFloat(
          (allYearsData.area.reduce((acc, prev) => acc + prev, 0) / 3).toFixed(2),
        )
        variableCostsRowData.value[0].seedCostPerHa = Number.parseFloat(
          (allYearsData.seedCostPerHa.reduce((acc, prev) => acc + prev, 0) / 3).toFixed(2),
        )
        variableCostsRowData.value[0].fertiliserCostPerHa = Number.parseFloat(
          (allYearsData.fertiliserCostPerHa.reduce((acc, prev) => acc + prev, 0) / 3).toFixed(2),
        )
        variableCostsRowData.value[0].chemicalCostPerHa = Number.parseFloat(
          (allYearsData.chemicalCostPerHa.reduce((acc, prev) => acc + prev, 0) / 3).toFixed(2),
        )
        variableCostsRowData.value[0].cropYield = Number.parseFloat(
          (allYearsData.cropYield.reduce((acc, prev) => acc + prev, 0) / 3).toFixed(2),
        )
        variableCostsRowData.value[0].salePrice = Number.parseFloat(
          (allYearsData.salePrice.reduce((acc, prev) => acc + prev, 0) / 3).toFixed(2),
        )
        showThreeYearAlert.value = true

        threeYearResponse.value = {
          mode: t('addEditBudgetDialog.success'),
          message: t('addEditBudgetDialog.threeYearAvSuccess'),
        }
      }
      else {
        showThreeYearAlert.value = true

        threeYearResponse.value = {
          mode: t('addEditBudgetDialog.warning'),
          message: t('addEditBudgetDialog.threeYearAvFailed'),
        }
      }
    }

    const showAreaAlert = ref(false)
    const checkAreaHasBeenEntered = () => {
      if (!fixedCostEditable.value)
        showAreaAlert.value = true
    }

    const closeDialog = () => {
      showSaveAlert.value = false
      context.emit('closeDialog')
    }

    const nuxtApp = useNuxtApp()

    const showFinalSaveAlert = () => {
      nuxtApp.$Yalert.addAlert({
        title: t('demo.dnsTitle'),
        text: t('demo.dataNotSaved'),
        mode: t('general.info'),
        autoDismiss: true,
      })
    }

    const noChangesMadeAlert = () => {
      nuxtApp.$Yalert.addAlert({
        title: 'No Changes Made',
        text: 'No changes were made.',
        mode: 'info',
        autoDismiss: true,
      })
    }

    const saveDialog = () => {
      if (changesMade.value) {
        showSaveAlert.value = true
      }
      else {
        closeDialog()
        noChangesMadeAlert()
      }
    }

    const confirmSave = () => {
      closeDialog()
      showFinalSaveAlert()
    }

    const doNotSaveChanges = () => {
      showSaveAlert.value = false
    }

    const fieldErrors = ref([])

    const saveAddedBudget = () => {
      fieldErrors.value = []
      if (!chosenCropId.value)
        fieldErrors.value.push(`${t('addEditBudgetDialog.crop')} ${t('addEditBudgetDialog.fieldRequired')}`)

      for (const [key, value] of Object.entries(variableCostsRowData.value[0])) {
        if (!value && ['area', 'cropYield', 'salePrice'].includes(key)) {
          const missingField = variableCostsColumnDefs.value.filter(obj => obj.field === key)[0].headerName
          fieldErrors.value.push(`${missingField} ${t('addEditBudgetDialog.fieldRequired')}`)
        }
      }

      if (!fieldErrors.value.length)
        context.emit('saveAddedBudget')
    }

    return {
      varialbleCostsGridOptions,
      variableCostsDefaultColDef,
      variableCostsColumnDefs,
      variableCostsRowData,
      fixedCostsGridOptions,
      fixedCostsDefaultColDef,
      fixedCostsColumnDefs,
      fixedCostsRowData,
      fixedCostEditable,
      gridApi,
      gridColumnApi,
      onGridReady,
      budgeted,
      poundsPerHa,
      changeUnits,
      showSaveAlert,
      selected,
      closeDialog,
      saveDialog,
      saveAddedBudget,
      doNotSaveChanges,
      confirmSave,
      changesMade,
      cropsData,
      budgetData,
      chosenCropId,
      fieldErrors,
      checkAreaHasBeenEntered,
      showAreaAlert,
      calculateThreeYearAverage,
      showThreeYearAlert,
      threeYearResponse,
    }
  },
})
</script>

<template>
  <div>
    <div class="dialog-body px-4">
      <header class="dialog-header-section">
        <h5 v-if="selected.crop" class="dialog-header-section__header">
          {{ $t('addEditBudgetDialog.budgets') }} - {{ selected.crop?.name }}
        </h5>

        <h5 v-else class="dialog-header-section__header">
          {{ editingExisting ? $t('general.edit') : $t('general.add') }} {{ $t('budgets.cropBudget') }}
        </h5>

        <span v-if="changesMade && selected.crop" class="changes-made font-italic">{{
          $t('addEditBudgetDialog.unsavedChanges')
        }}</span>
        <YIcon name="icon-close" class="dialog-header-section__close-btn" @click="closeDialog" />
      </header>

      <section class="alert-section">
        <YAlert
          v-if="showSaveAlert"
          id="area-inputted"
          :title="$tc('addEditBudgetDialog.warning')"
          :text="$tc('addEditBudgetDialog.yAlertText')"
          :mode="$tc('addEditBudgetDialog.warning')"
          :is-dismissible="true"
          :auto-dismiss="false"
          class="dialog-alerts text-capitalize"
          @close="doNotSaveChanges"
        >
          <template #primaryAction>
            <YButton class="alert-section__btn" @click="doNotSaveChanges">
              {{ $t('addEditBudgetDialog.no') }}
            </YButton>
          </template>
          <template #secondaryAction>
            <YButton class="alert-section__btn" @click="confirmSave">
              {{ $t('addEditBudgetDialog.yes') }}
            </YButton>
          </template>
        </YAlert>

        <YAlert
          v-if="showAreaAlert"
          id="area-entered-alert"
          :title="$t('addEditBudgetDialog.noAreaAvailable')"
          :text="$t('addEditBudgetDialog.addAreaInVariableCosts')"
          :mode="$tc('addEditBudgetDialog.warning')"
          :is-dismissible="true"
          :auto-dismiss="false"
          class="dialog-alerts"
          @close="showAreaAlert = false"
        />

        <YAlert
          v-if="showThreeYearAlert"
          id="three-year-average-alert"
          :title="$t('addEditBudgetDialog.threeYearAverageTitle')"
          :text="threeYearResponse.message"
          :mode="threeYearResponse.mode"
          :is-dismissible="true"
          :auto-dismiss="false"
          class="dialog-alerts"
          @close="showThreeYearAlert = false"
        />
      </section>

      <section v-if="!selected.crop" class="crop-select__section mt-4 mb-2">
        <YSelect
          v-model="chosenCropId"
          :searchable="true"
          :options="cropsData"
          :placeholder="$t('addEditBudgetDialog.selectCrop')"
          class="w-50 p3 crop-select__selector capitalize"
        />
      </section>

      <section v-if="fieldErrors.length > 0" class="errors-section">
        <ul class="p-0 text-red">
          <li v-for="error in fieldErrors" :key="error" class="errors-section__error list-group-item">
            {{ error }}
          </li>
        </ul>
      </section>

      <section v-if="selected.crop" class="budgeted-section">
        <h6>{{ $t('general.sale') }}</h6>
        <div class="budgeted-section__table">
          <div class="budgeted-section__row">
            <div class="budgeted-section__col">
              {{ $t('addEditBudgetDialog.budgetedPrice') }}
            </div>
            <div class="budgeted-section__col">
              {{ $t('addEditBudgetDialog.budgetedSales') }}
            </div>
            <div class="budgeted-section__col">
              {{ $t('addEditBudgetDialog.budgetedBreakEven') }}
            </div>
          </div>
          <div class="budgeted-section__row">
            <div class="budgeted-section__col col_data">
              <MoneyFormat :value="budgeted.price" per-unit="t" />
            </div>
            <div class="budgeted-section__col col_data">
              <MoneyFormat :value="budgeted.sales" per-unit="t" />
            </div>
            <div class="budgeted-section__col col_data">
              <MoneyFormat :value="budgeted.breakEven" per-unit="t" />
            </div>
          </div>
        </div>
      </section>

      <!-- Variable Costs -->
      <section class="variable-costs-section mt-3 mb-0">
        <h5 class="d-inline-block modal-dialog__title">
          {{ $t('addEditBudgetDialog.variableCosts') }}
        </h5>
        <YAgGrid
          :grid-options="varialbleCostsGridOptions"
          :default-col-def="variableCostsDefaultColDef"
          :column-defs="variableCostsColumnDefs"
          :row-data="variableCostsRowData"
          :pagination="false"
          class="vc-modal-custom-ag-grid"
          @grid-ready="onGridReady"
        />
      </section>

      <section v-if="chosenCropId" class="three-yr-average-section mb-3">
        <YButton class="px-0 primary-colour" type="tertiary" @click="calculateThreeYearAverage()">
          {{ $t('addEditBudgetDialog.setValOnThreeYrAv') }}
        </YButton>
      </section>

      <!-- Fixed Costs -->
      <section class="fixed-costs-section mt-4" @click="checkAreaHasBeenEntered">
        <h5 class="d-inline-block modal-dialog__title">
          {{ $t('addEditBudgetDialog.fixedCosts') }}
        </h5>
        <font-awesome-icon v-if="!fixedCostEditable" class="fixed-costs-section__icon" :icon="['far', 'fa-lock-alt']" />
        <div class="d-inline-flex align-items-center">
          <span class="capitalize">{{ $t('addEditBudgetDialog.total') }}</span>
          <span>{{ $t('addEditBudgetDialog.currencyBracketed') }}</span>
          <!-- Toggle Switch Between £ and £/ha -->
          <YToggle :is-disabled="!fixedCostEditable" :is-checked="poundsPerHa === 'ha'" @switch-func="changeUnits" />
          <span>{{ $t('addEditBudgetDialog.currencyPerHectare') }}</span>
        </div>
        <YAgGrid
          :grid-options="fixedCostsGridOptions"
          :default-col-def="fixedCostsDefaultColDef"
          :column-defs="fixedCostsColumnDefs"
          :row-data="fixedCostsRowData"
          :pagination="false"
          class="fc-modal-custom-ag-grid"
          :class="{ 'fc-modal-disabled': !fixedCostEditable }"
          @grid-ready="onGridReady"
        />
      </section>
      <section class="dialog-tip-section ml-4 font-italic text-muted mt-3">
        {{ $t('addEditBudgetDialog.cellEditInfo') }}
      </section>
    </div>
    <footer class="dialog-footer-section p-3">
      <YButton type="tertiary" class="" @click="closeDialog">
        {{ $t('general.cancel') }}
      </YButton>
      <YButton v-if="selected.crop" @click="saveDialog">
        {{ $t('general.ok') }}
      </YButton>
      <YButton v-if="!selected.crop" @click="saveAddedBudget">
        Save
      </YButton>
    </footer>
  </div>
</template>

<style lang="scss">
.crop-select__selector {
  margin-left: 0 !important;
  z-index: 1;
}

.font-italic {
  font-style: italic;
}

.changes-made {
  margin-left: 20px;
}

.dialog-header-section {
  margin-top: 30px;
}

.dialog-header-section__header {
  font-weight: 500;
  text-transform: capitalize;
  display: inline;
}

.dialog-header-section__close-btn {
  width: 20px;
  float: right;
  cursor: pointer;
}

.ag-theme-yagro .ag-header {
  border-bottom: 1px solid var(--color-border);
}

.y-modal-add-budget .p-dialog-header,
.y-modal-add-budget .p-dialog-footer {
  display: none;
}

.y-modal-add-budget .p-dialog-content {
  padding: 0 0 0;
  border-radius: 5px;
}

.dialog-alerts {
  position: absolute;
  z-index: 2;
  top: 30px;
  right: 40px;
  width: 50%;
}

.budgeted-section {
  margin: 20px 0;
}

.budgeted-section__row {
  display: flex;
  margin-bottom: 5px;
}

.budgeted-section__col {
  min-width: 200px;
}

.col_data {
  font-weight: bold;
}

.modal-dialog__title {
  font-size: 1rem;
  font-weight: 500;
  margin-right: 10px;
}

.variable-costs-section {
  margin-bottom: 20px;
}

.fixed-costs-section__icon {
  margin-right: 10px;
}

.vc-modal-custom-ag-grid .ag-header-cell-label .ag-header-cell-text,
.fc-modal-custom-ag-grid .ag-header-cell-label .ag-header-cell-text {
  white-space: normal;
}

.fc-modal-custom-ag-grid .ag-row-level-0 {
  height: 80px !important;
}

.vc-modal-custom-ag-grid,
.fc-modal-custom-ag-grid {
  border: 1px solid var(--color-border);
  border-radius: 5px;
  width: max-content;
}

.variable-costs-section .ag-root-wrapper,
.fixed-costs-section .ag-root-wrapper {
  border: none;
}

.vc-modal-custom-ag-grid .ag-layout-auto-height {
  height: 120px;
  width: max-content;
}

.fc-modal-custom-ag-grid .ag-layout-auto-height {
  height: 135px;
  width: max-content;
}

.fc-modal-disabled .ag-row,
.fc-modal-disabled .ag-header-row {
  background-color: #efeeef;
  color: #9d9d9d;
}

.fc-modal-disabled .ag-header-cell-label {
  color: #9d9d9d;
}

.ag-theme-yagro .ag-row {
  border: none !important;
}

.ag-theme-yagro .ag-row,
.ag-theme-yagro .ag-cell-label-container {
  font-size: 0.9rem;
}

.alert-section__btn {
  background-color: transparent;
  color: #495057;
  border: none;
  padding: 0;
}

.alert-section__btn:hover {
  background-color: transparent;
  border: none;
  color: #495057;
}

.alert-section__btn:active {
  background-color: transparent !important;
  border: none !important;
  color: #495057 !important;
}

.dialog-footer-section {
  text-align: right;
  background-color: #efeeef;
}

@media screen and (max-width: 664px) {
  .budgeted-section__table {
    display: flex;
  }

  .budgeted-section__row {
    display: block;
    width: 50%;
  }
}

@media screen and (max-width: 1441px) {
  .vc-modal-custom-ag-grid,
  .fc-modal-custom-ag-grid {
    width: auto;
  }

  .fc-modal-custom-ag-grid .ag-layout-auto-height,
  .vc-modal-custom-ag-grid .ag-layout-auto-height {
    width: auto;
  }
}
</style>
