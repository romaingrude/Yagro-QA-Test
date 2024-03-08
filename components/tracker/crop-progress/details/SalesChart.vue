<script lang="ts">
import { BarChart } from 'vue-chart-3'
import { Chart } from 'chart.js'
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'
import { useSelectedStore } from '~/stores/selected'
import useFetchData from '~/composables/useFetchData'

export default defineComponent({
  name: 'SalesChart',
  components: {
    BarChart,
  },
  props: {
    breakEvens: {
      default: () => {},
      type: Object,
      required: false,
    },
  },
  emits: ['openAlert'],
  setup(props, context) {
    const selected = useSelectedStore()
    const { t } = useI18n()

    const breakEvens = computed(() => {
      return props.breakEvens
    })

    // Fetching data
    const sales = ref(null)
    const cropData = ref(null)
    const budgetData = ref(null)
    const fixedCostsTotals = ref(null)

    const fetchData = function () {
      if (selected.crop) {
        // Clear previous data
        budgetData.value = null
        cropData.value = null
        sales.value = null
        fixedCostsTotals.value = null

        const { fetchedData: fetchedSalesData } = useFetchData(
          `api/business-tracker/${selected.year}/crops/${selected.crop.id}/sales-chart`,
        )

        const { fetchedData: fetchedCropData } = useFetchData(
          `api/fields/harvest-years/${selected.year}/crops/${selected.crop.id}`,
        )

        const { fetchedData: fetchedBudgetData } = useFetchData(`budgets/${selected.year}/crops/${selected.crop.id}`)

        const { fetchedData: fetchedFixedCostsTotals } = useFetchData(
          `budgets/fixed-costs-totals/${selected.year}/crop/${selected.crop.id}`,
        )

        watch(fetchedSalesData, (newValue) => {
          if (newValue)
            sales.value = newValue
        })

        watch(fetchedCropData, (newValue) => {
          if (newValue)
            cropData.value = newValue
        })

        watch(fetchedBudgetData, (newValue) => {
          if (newValue)
            budgetData.value = newValue
        })

        watch(fetchedFixedCostsTotals, (newValue) => {
          if (newValue)
            fixedCostsTotals.value = newValue
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

    // Graph Details
    const chartData = computed(() => {
      // If no potential months default to array with at least one single item containing a space as chartjs dataset cannot read null or undefined
      const potentialMonths = sales?.value?.labels || [' ']

      const monthLabels
        // Empty array items either side of month act as extra pdding to accomodate for offset being set to on the scales objects' x value
        = potentialMonths.filter(month => month).length > 0
          ? ['', ...potentialMonths.filter(month => month), '']
          : ['']

      // Add horizontal line for budget
      const horizonatalLines = {
        budget: Number.parseFloat(budgetData?.value?.price),
      }

      // Only show breakEven lines if budget and fixed costs are present
      if (breakEvens.value.isEnabled) {
        horizonatalLines.budgetedBreakEven = breakEvens.value.budgetedBreakEven
        horizonatalLines.rollingBreakEven = breakEvens.value.rollingBreakEven
      }

      const contractPrices = sales?.value?.contracts?.prices || ['']
      const contractQuantities = sales?.value?.contracts?.quantities || ['']
      const salePrices = sales?.value?.sales?.prices || ['']
      const saleQuantities = sales?.value?.sales?.quantities || ['']

      return {
        labels: monthLabels,
        datasets: [
          // Horizontal Lines
          {
            label: t('salesChart.budget'),
            type: 'line',
            showLine: Boolean(horizonatalLines.budget),
            backgroundColor: 'rgb(51,160,44)',
            borderColor: 'rgb(51,160,44)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 0,
            yAxisID: 'y',
            data: monthLabels.map(() => horizonatalLines.budget),
          },
          {
            label: t('salesChart.budgetedBreakEven'),
            type: 'line',
            showLine: Boolean(horizonatalLines.budgetedBreakEven),
            backgroundColor: 'rgb(253,191,111)',
            borderColor: 'rgb(253,191,111)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 0,
            yAxisID: 'y',
            data: monthLabels.map(() => horizonatalLines.budgetedBreakEven),
          },
          {
            label: t('salesChart.rollingBreakEven'),
            type: 'line',
            showLine: Boolean(horizonatalLines.rollingBreakEven),
            backgroundColor: 'rgb(151,71,255)',
            borderColor: 'rgb(151,71,255)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 0,
            yAxisID: 'y',
            data: monthLabels.map(() => horizonatalLines.rollingBreakEven),
          },
          // Other Datasets
          {
            label: t('salesChart.price'),
            type: 'line',
            showLine: false,
            fill: false,
            backgroundColor: 'rgb(227,93,106)',
            borderColor: 'rgb(227,93,106)',
            borderWidth: 2,
            pointRadius: salePrices.some(Number) ? 3 : 0,
            yAxisID: 'y',
            data: ['n', ...salePrices],
          },
          {
            label: t('salesChart.priceContract'),
            type: 'line',
            showLine: false,
            fill: false,
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgb(227,93,106)',
            borderWidth: 2,
            pointRadius: contractPrices.some(Number) ? 3 : 0,
            yAxisID: 'y',
            data: ['n', ...contractPrices],
          },
          {
            label: t('salesChart.quantity'),
            backgroundColor: 'rgba(220,220,220)',
            borderColor: 'rgba(220,220,220)',
            borderWidth: 2,
            yAxisID: 'quantity',
            data: ['n', ...saleQuantities],
          },
          {
            label: t('salesChart.quantityContract'),
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(220,220,220)',
            borderWidth: 2,
            borderRadius: 2,
            yAxisID: 'quantity',
            data: ['n', ...contractQuantities],
          },
        ],
      }
    })

    const toolTip = ref()
    const showToolTip = ref(false)
    const setToolTip = (legendName) => {
      const toolTips = {
        [t('salesChart.budgetedBreakEven')]: t('salesChart.budgetedBreakEvenToolTip'),
        [t('salesChart.rollingBreakEven')]: t('salesChart.rollingBreakEvenToolTip'),
      }
      toolTip.value = toolTips[legendName]
    }

    const openAlert = () => {
      if (breakEvens.value.isEnabled)
        return
      context.emit('openAlert')
    }

    // Needed as onClick overrides original action. This will continue original action after custom one
    const originalAction = Chart.defaults.plugins.legend.onClick

    const chartOptions = computed(() => {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 60,
              boxHeight: 20,
              usePointStyle: true,
            },
            onHover: (event, legendItem) => {
              if (
                legendItem.text === t('salesChart.budgetedBreakEven')
                || legendItem.text === t('salesChart.rollingBreakEven')
              ) {
                setToolTip(legendItem.text)
                showToolTip.value = true
              }
            },
            onLeave: () => {
              showToolTip.value = false
            },
            onClick: (event, legendItem, index) => {
              // Further condition to be added if the fixed costs do not exist
              if (
                legendItem.text === t('salesChart.budgetedBreakEven')
                || legendItem.text === t('salesChart.rollingBreakEven')
              )
                openAlert()

              // Continue original action of toggling on off field items
              originalAction.call(this, event, legendItem, index)
            },
          },
          tooltip: {
            callbacks: {
              label(context) {
                const dataset = context.dataset
                if (context.parsed.y === null)
                  return ''

                if (dataset.label.startsWith('Price'))
                  return `${dataset.label}: £${context.parsed.y.toFixed(2)}/t`

                if (dataset.label.startsWith('Quantity'))
                  return `${dataset.label}: ${context.parsed.y.toFixed(2)} t`
              },
              labelColor(context) {
                const line = context.dataset
                return {
                  backgroundColor: line.backgroundColor,
                  borderColor: line.borderColor,
                  borderWidth: line.borderWidth * 1.5,
                  borderRadius: 1,
                }
              },
            },
            mode: 'index',
            position: 'nearest',
          },
        },
        scales: {
          x: {
            stacked: true,
            offset: false,
            grid: {
              drawOnChartArea: true,
            },
            ticks: {
              maxRotation: 0,
              callback(value, index, ticks) {
                const dataLabel = this.getLabelForValue(value)

                if (index == 1 || dataLabel.includes('January'))
                  return [dataLabel.split(' ')[0], dataLabel.split(' ')[1]]

                if (ticks.length <= 12)
                  return dataLabel.slice(0, -5)

                if (index % 2 === 0)
                  return dataLabel.slice(0, -5)
              },
            },
          },
          y: {
            position: 'left',
            suggestedMax: budgetData?.value?.price + 5,
            title: {
              display: true,
              text: t('salesChart.priceInCurrencyPerTonne'),
              font: {
                size: 17,
              },
            },
          },
          quantity: {
            beginAtZero: true,
            position: 'right',
            grid: {
              drawOnChartArea: true,
            },
            title: {
              display: true,
              text: t('salesChart.quantityInTonne'),
              font: {
                size: 18,
              },
            },
          },
        },
      }
    })

    return {
      chartData,
      chartOptions,

      showToolTip,
      toolTip,
    }
  },
})
</script>

<template>
  <div>
    <div class="chart-section">
      <div v-if="showToolTip" class="chart-section__tool-tip" :class="{ 'show-tip': showToolTip }">
        <font-awesome-icon :icon="['far', 'question-circle']" />
        <p>{{ toolTip }}</p>
      </div>
      <BarChart id="my-chart-id" :options="chartOptions" :chart-data="chartData" height="400" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-section {
  position: relative;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.chart-section__tool-tip {
  position: absolute;
  font-size: 0.8rem;
  z-index: 5;
  width: 200px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  animation: fadeIn 0.5s;
}

.show-tip {
  display: block;
}
</style>
