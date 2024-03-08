<script lang="ts">
import { computed, ref, watch } from 'vue'
import { defineComponent } from '#imports'
import { useSelectedStore } from '~/stores/selected'
import HarvestYearSelect from '~~/components/core/harvestYearSelect.vue'
import CropSummary from '~/components/tracker/crop-progress/details/CropSummary.vue'
import TrackerCostsChart from '~/components/tracker/crop-progress/details/TrackerCostsChart.vue'
import ProductionSummaryCard from '~/components/tracker/crop-progress/details/ProductionSummaryCard.vue'
import CostSummaryCard from '~/components/tracker/crop-progress/details/CostSummaryCard.vue'
import CategoryCostBudgetTable from '~/components/tracker/crop-progress/details/CategoryCostBudgetTable.vue'
import useFetchData from '~/composables/useFetchData'
import YTextandIconButton from '~/components/elements/YTextandIconButton.vue'
import YModal from '~/components/elements/YModal.vue'
import AddEditBudgetDialog from '~/components/modals/AddEditBudgetDialog.vue'
import SalesChart from '~/components/tracker/crop-progress/details/SalesChart.vue'
import YAlert from '~/components/elements/YAlert.vue'

export default defineComponent({
  components: {
    CategoryCostBudgetTable,
    CostSummaryCard,
    CropSummary,
    HarvestYearSelect,
    ProductionSummaryCard,
    TrackerCostsChart,
    YTextandIconButton,
    YModal,
    AddEditBudgetDialog,
    SalesChart,
    YAlert,
  },

  setup() {
    const selected = useSelectedStore()

    const fmsCrop = ref(null)
    const apiCrop = ref(null)
    const production = ref(null)
    const budget = ref(null)
    const fixedCosts = ref(null)
    const cropData = ref(null)

    const fetchData = function () {
      if (selected.crop) {
        // Clear previous data
        fmsCrop.value = null
        apiCrop.value = null
        production.value = null
        budget.value = null
        fixedCosts.value = null
        cropData.value = null

        let path = `fms/harvests/fields/yearId=${selected.year}&cropId=${selected.crop.id}`
        if (selected.year === 2023)
          path += `&includeExpected=true`

        const { fetchedData: fetchedFmsCropData } = useFetchData(path)
        const { fetchedData: fetchedApiCropData } = useFetchData(
          `api/fields/harvest-years/${selected.year}/crops/${selected.crop.id}`,
        )
        const { fetchedData: productionSummary } = useFetchData(
          `api/business-tracker/${selected.year}/crops/${selected.crop.id}/production`,
        )
        const { fetchedData: fetchedBudgetData } = useFetchData(`budgets/${selected.year}/crops/${selected.crop.id}`)

        const { fetchedData: fetchedCropData } = useFetchData(
          `api/fields/harvest-years/${selected.year}/crops/${selected.crop.id}`,
        )

        watch(fetchedCropData, (newValue) => {
          if (newValue)
            cropData.value = newValue
        })

        watch(fetchedFmsCropData, (newValue) => {
          if (newValue)
            fmsCrop.value = newValue
        })
        watch(fetchedApiCropData, (newValue) => {
          if (newValue)
            apiCrop.value = newValue
        })
        watch(productionSummary, (newValue) => {
          if (newValue)
            production.value = newValue
        })
        watch(fetchedBudgetData, (newValue) => {
          if (newValue)
            budget.value = newValue
        })
      }
    }

    watch(
      () => selected.year,
      (current, prev) => {
        if (current != prev && current)
          fetchData()
      },
      { immediate: true },
    )

    watch(
      () => selected.crop,
      (current, prev) => {
        if (current != prev && current)
          fetchData()
      },
      { immediate: true },
    )

    const fmsCropData = computed(() => {
      return fmsCrop.value || null
    })

    const apiCropData = computed(() => {
      return apiCrop.value || null
    })

    const productionData = computed(() => {
      return production.value || null
    })

    const budgetData = computed(() => {
      return budget.value || null
    })
    const showEditCropBudgetsForm = ref(false)

    // Opens or closes the Modal that contains the Add/Edit budget dialog
    const viewHideAddEditCropBudget = () => {
      showEditCropBudgetsForm.value = !showEditCropBudgetsForm.value
    }
    const salesAlertSeen = ref(false)

    const closeSalesAlert = () => {
      salesAlertSeen.value = false
    }

    const openAlert = () => {
      salesAlertSeen.value = true
    }

    const addFixedCostData = () => {
      closeSalesAlert()
      viewHideAddEditCropBudget()
    }

    const fakeFixedCostData = ref({
      crop: selected.crop,
      fuel: 25,
      contractsAndHire: 100,
      labour: 110,
      machinery: 135,
      overheads: 200,
      rentAndInterest: 130,
    })

    // Fake data for fixed costs totals
    let fakeFixedCostTotals = 0
    for (const [key, value] of Object.entries(fakeFixedCostData.value)) {
      if (key !== 'crop')
        fakeFixedCostTotals += value
    }

    const breakEvens = computed(() => {
      const area = budgetData.value?.area?.magnitude
      const cropYield = budgetData.value?.yield?.magnitude
      const budgetedVariableCost = budgetData.value?.cost?.total / area

      const actualVariableCostAreaField = cropData.value?.area?.field?.magnitude
      const actualVariableCostYield = cropData.value?.yield?.magnitude
      const actualVariableCostTotal = cropData.value?.cost?.total?.magnitude / actualVariableCostAreaField

      return {
        isEnabled: budgetData.value && fakeFixedCostTotals,
        budgetedBreakEven: Number.parseFloat((budgetedVariableCost + fakeFixedCostTotals / area) / cropYield),
        rollingBreakEven: Number.parseFloat(
          (actualVariableCostTotal + fakeFixedCostTotals / actualVariableCostAreaField) / actualVariableCostYield,
        ),
      }
    })

    return {
      fmsCropData,
      apiCropData,
      productionData,
      selected,
      budgetData,
      fakeFixedCostData,
      viewHideAddEditCropBudget,
      showEditCropBudgetsForm,
      closeSalesAlert,
      openAlert,
      salesAlertSeen,
      addFixedCostData,
      breakEvens,
    }
  },
})
</script>

<template>
  <div>
    <Html>
      <Head>
        <Title>
          {{ $t('config.tabTitle', { brand: selected.partnerCompany }) }} - {{ $t('feature.tracker') }} -
          {{ $t('feature.cropProgress') }} -
          {{ selected.selected_crop?.name }}
        </Title>
      </Head>
    </Html>
    <div class="container content">
      <div class="d-sm-flex flex-wrap align-items-end justify-content-between mb-3">
        <div class="align-items-end mb-0">
          <h1 class="mb-0 text-capitalize">
            {{ selected.selected_crop?.name }}
          </h1>
        </div>
        <div class="d-flex align-items-end" style="width: 250px">
          <HarvestYearSelect type="tracker" />
        </div>
      </div>
      <div class="w-100">
        <div class="tracker-title-and-action">
          <h2>{{ $t('tracker.cropProduction') }}</h2>
          <YTextandIconButton
            :text="budgetData ? $t('tracker.budgets.editText') : $t('tracker.budgets.addText')"
            icon="icon-piggy-bank"
            @click="viewHideAddEditCropBudget"
          />
        </div>

        <CropSummary
          :field-area="fmsCropData ? fmsCropData.area : null"
          :fields="apiCropData ? apiCropData.field_count : null"
          :production="fmsCropData ? fmsCropData.production : null"
          :yield="fmsCropData ? fmsCropData.yield : null"
          :sales-achieved="productionData ? productionData.summary.sales_total : 0"
          :total-cost="apiCropData ? apiCropData.cost.total.magnitude : 0"
        />
      </div>
      <div class="row mb-5">
        <h2 class="ps-3 capitalize">
          {{ $tc('general.cost', 2) }}
        </h2>
        <div class="col-md-6">
          <TrackerCostsChart class="mb-3" />
        </div>
        <div class="col-md-6">
          <CostSummaryCard class="ps-3" />
          <CategoryCostBudgetTable class="ps-3" />
        </div>
      </div>

      <div class="row mb-3">
        <h2>{{ $t('tracker.sales') }}</h2>
        <div class="col-md-6">
          <section class="sales-aert-section">
            <YAlert
              v-if="salesAlertSeen"
              id="sales-alert"
              class="sales-y-alert"
              mode="warning"
              title="No data available"
              text="Please add fixed cost data"
              @close="closeSalesAlert"
            >
              <template #primaryAction>
                <button class="sales-alert_btn bold" @click="addFixedCostData">
                  Continue
                </button>
              </template>
              <template #secondaryAction>
                <button class="sales-alert_btn" @click="closeSalesAlert">
                  Close
                </button>
              </template>
            </YAlert>
          </section>
          <SalesChart :break-evens="breakEvens" @open-alert="openAlert()" />
        </div>
        <div class="col-md-6">
          <ProductionSummaryCard
            class="ps-3"
            :production="fmsCropData ? fmsCropData.production : null"
            :total-area="fmsCropData ? Number(fmsCropData.area.magnitude) : 0"
            :break-evens="breakEvens"
          />
        </div>
      </div>
      <YModal class="y-modal-add-budget" :show="showEditCropBudgetsForm">
        <template #body>
          <AddEditBudgetDialog
            :budget="[budgetData]"
            :fixed-cost="[budgetData ? fakeFixedCostData : []]"
            :editing-existing="Boolean(budgetData)"
            @close-dialog="viewHideAddEditCropBudget"
          />
        </template>
      </YModal>
    </div>
  </div>
</template>

<style>
.capitalize {
  text-transform: capitalize;
}

.tracker-title-and-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sales-aert-section {
  position: relative;
}

.sales-y-alert {
  position: absolute;
  top: -160px;
  right: 0;
  width: 50%;
  z-index: 5;
}

.sales-alert_btn {
  background-color: transparent;
  border: none;
  padding: 0;
}

.bold {
  font-weight: bold;
}
</style>
