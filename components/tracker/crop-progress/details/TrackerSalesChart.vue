<script setup lang="ts">
import { Chart } from 'chart.js'
import { BarChart } from 'vue-chart-3'
import { useI18n } from 'vue-i18n'
import { computed, ref, watch, watchEffect } from 'vue'
import { useSelectedStore } from '~/stores/selected'
import useFetchData from '~/composables/useFetchData'

const { t } = useI18n()
const selected = useSelectedStore()

// Fetching data
const sales = ref(null)
const budgetData = ref(null)

const fetchData = function () {
  if (selected.crop) {
    // Clear previous data
    budgetData.value = null
    sales.value = null

    const { fetchedData: fetchedSalesData } = useFetchData(
      `api/business-tracker/${selected.year}/crops/${selected.crop.id}/sales-chart`,
    )
    const { fetchedData: fetchedBudgetData } = useFetchData(`budgets/${selected.year}/crops/${selected.crop.id}`)

    watch(fetchedSalesData, (newValue) => {
      if (newValue)
        sales.value = newValue
    })
    watch(fetchedBudgetData, (newValue) => {
      if (newValue)
        budgetData.value = newValue
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

const salesContractsData = computed(() => {
  if (!sales.value)
    return null
  return sales.value
})

const budget = computed(() => {
  if (!budgetData.value)
    return null
  return budgetData.value
})

const bchart = ref()

const chartOptions = {
  maintainAspectRatio: false,

  onHover: (evt, activeEls, chart) => {
    if (
      activeEls.length !== 0
      || chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true).length !== 0
    )
      evt.native.target.style.cursor = 'pointer'
    else
      evt.native.target.style.cursor = 'default'
  },
  plugins: {
    horizontal: [
      {
        enabled: false,
        scaleId: 'yA',
        style: '#3ed5a6',
        xMax: 0,
        y: budget.value?.price,
      },
    ],
    legend: {
      position: 'bottom',
      labels: {
        filter: legendItem => typeof legendItem.text !== 'undefined',
        usePointStyle: false,
        boxWidth: 60,
        boxHeight: 20,
      },

      onClick: labelToggle,

      onHover: (e) => {
        e.native.target.style.cursor = 'pointer'
      },

      onLeave: (e) => {
        e.native.target.style.cursor = 'default'
      },
    },

    tooltip: {
      callbacks: {
        label(context) {
          const dataset = context.dataset
          if (context.parsed.y === null)
            return ''
          else if (dataset.label.startsWith(t('general.price')))
            return `${dataset.label}: £${context.parsed.y.toFixed(2)}/t`
          else if (dataset.label.startsWith(t('general.quantity')))
            return `${dataset.label}: ${context.parsed.y.toFixed(2)} t`
        },

        labelColor(context) {
          const line = context.dataset
          return {
            backgroundColor: line.backgroundColor,
            borderColor: line.borderColor,
            borderWidth: line.borderWidth * 2,
          }
        },
      },
      mode: 'index',
      position: 'nearest',
    },
  },

  scales: {
    xAxes: {
      ticks: {
        callback(value, index, ticks) {
          const dataLabel = this.getLabelForValue(value)
          if (index === 0 || dataLabel.includes(t('months.january')))
            return [dataLabel.split(' ')[0], dataLabel.split(' ')[1]]

          if (ticks.length <= 12)
            return dataLabel.slice(0, -5)

          if (index % 3 === 0)
            return dataLabel.slice(0, -5)

          return ''
        },
      },
    },
    yA: {
      display: true,
      suggestedMin: 0,
      title: {
        display: true,
        text: t('tracker.priceIn'),
      },
    },
    yB: {
      display: true,
      position: 'right',
      stacked: true,
      title: {
        display: true,
        text: t('tracker.quantityIn'),
      },
    },
  },
}

const chartData = computed(() => {
  const datasets = []
  if (
    salesContractsData.value
    && Object.keys(salesContractsData.value).length
    && Object.keys(salesContractsData.value.contracts).length
  ) {
    datasets.push(
      {
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgb(227,93,106)',
        borderWidth: 2,
        data: salesContractsData.value.contracts.prices,
        fill: false,
        label: t('tracker.priceContract'),
        showLine: false,
        type: 'line',
        yAxisID: 'yA',
      },
      {
        backgroundColor: 'rgb(0,0,0,0)',
        borderColor: 'rgb(220,220,220)',
        borderWidth: 2,
        data: salesContractsData.value.contracts.quantities,
        label: t('tracker.quantityContract'),
        showLine: false,
        stack: 'Q',
        type: 'bar',
        yAxisID: 'yB',
      },
    )
  }
  else {
    datasets.push({ data: [] }, { data: [] })
  }
  if (
    salesContractsData.value
    && Object.keys(salesContractsData.value).length
    && Object.keys(salesContractsData.value.sales).length
  ) {
    datasets.push(
      {
        backgroundColor: 'rgb(227,93,106)',
        borderWidth: 1,
        data: salesContractsData.value.sales.prices,
        fill: false,
        label: t('general.price', 2),
        showLine: false,
        type: 'line',
        yAxisID: 'yA',
      },
      {
        backgroundColor: 'rgb(220,220,220)',
        borderWidth: 2,
        data: salesContractsData.value.sales.quantities,
        label: t('general.quantity'),
        showLine: false,
        stack: 'Q',
        type: 'bar',
        yAxisID: 'yB',
      },
    )
  }
  else {
    datasets.push({ data: [] }, { data: [] })
  }

  if (budget.value && salesContractsData.value) {
    datasets.push({
      backgroundColor: chartOptions.plugins.horizontal[0].style,
      data: [],
      label: t('general.budget'),
      type: 'line',
    })
  }
  else {
    datasets.push({ data: [] })
  }
  return {
    datasets,
    labels:
      salesContractsData.value && Object.keys(salesContractsData.value).length ? salesContractsData.value.labels : [],
  }
})

watchEffect(() => {
  if (bchart.value) {
    const hLine = bchart.value.chartInstance.options.plugins.horizontal[0]
    if (budget.value && budget.value.price) {
      // We have detected a change (or initial value) for the budget...
      // Set the y value for the budget line
      const budgetedPrice = budget.value.price
      hLine.y = budgetedPrice
      // Set the xMax value to the number of bars (i.e. number of labels)
      hLine.xMax = Math.max(1, chartData.value.labels.length)
      // We don't want the budget line hard against the top of the graph, so we add 5, which forces an
      // extra line on the y scale.
      bchart.value.chartInstance.options.scales.yA.suggestedMax = budgetedPrice + 5
      hLine.enabled = true
    }
    else {
      hLine.enabled = false
      hLine.xMax = 0
      hLine.y = 0
    }
  }
})

function labelToggle(evt, item, legend) {
  if (item.text.startsWith(t('general.budget')))
    evt.chart.options.plugins.horizontal[0].enabled = !evt.chart.options.plugins.horizontal[0].enabled

  // Call default onClick handler
  Chart.defaults.plugins.legend.onClick(evt, item, legend)
}

const horizontalLinePlugin = {
  afterDraw(chart, args, options) {
    const xScale = chart.scales.xAxes
    const ctx = chart.ctx
    let index
    let hLine

    if (options) {
      for (index = 0; index < options.length; index++) {
        hLine = options[index]
        if (!hLine.enabled)
          continue

        const scaleId = hLine.scaleId || 'y-axis-0'
        const yScale = chart.scales[scaleId]
        let yValue

        if (hLine.y)
          yValue = yScale.getPixelForValue(hLine.y)
        else
          yValue = 0

        const xValue0 = xScale.getPixelForValue(0) // Centre of first column
        const xValue1 = xScale.getPixelForValue(1) // Centre of second column
        const xAdjust = (xValue1 - xValue0) / 2 // Half column width
        const xMin = xValue0 - xAdjust
        const xMax = xScale.getPixelForValue(hLine.xMax) - xAdjust
        ctx.lineWidth = 3

        if (yValue) {
          ctx.beginPath()
          ctx.moveTo(xMin, yValue)
          ctx.lineTo(xMax, yValue)
          if (hLine.style)
            ctx.strokeStyle = hLine.style

          ctx.stroke()
        }
      }
    }
  },
  id: 'horizontal',
}

const chartPlugins = [horizontalLinePlugin]
</script>

<template>
  <div id="saleschart">
    <YTooltip placement="top" class="w-100">
      <BarChart ref="bchart" :chart-data="chartData" :options="chartOptions" :plugins="chartPlugins" :height="400" />
      <template #content>
        <font-awesome-icon :icon="['far', 'lightbulb']" />
        {{ $t('tracker.toggle') }}
      </template>
    </YTooltip>
  </div>
</template>
