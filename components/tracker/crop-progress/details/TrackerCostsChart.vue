<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { LineChart } from 'vue-chart-3'
import moment from 'moment-timezone'
import { useSelectedStore } from '~/stores/selected'
import useFetchData from '~/composables/useFetchData'

const selected = useSelectedStore()

// Fetching data
const yieldData = ref(null)
const budgetData = ref(null)
const previousData = ref(null)
const previousYears = ref(null)

const fetchData = async function () {
  if (selected.crop) {
    // Clear previous data
    budgetData.value = null
    yieldData.value = null
    previousData.value = null
    await Promise.all(
      [0, 1, 2, 3].map((i) => {
        const { fetchedData: fetchedYearsData } = useFetchData(
          `api/fms/applied-product/${selected.year - i}/crops/${selected.crop.id}/months`,
        )
        return fetchedYearsData
      }),
    ).then(e => (previousYears.value = e))

    const { fetchedData: fetchedYieldData } = useFetchData(
      `api/fms/yields/status/52/${selected.crop.id}/${selected.year}`,
    )
    const { fetchedData: fetchedBudgetData } = useFetchData(`budgets/${selected.year}/crops/${selected.crop.id}`)

    watch(fetchedYieldData, (newValue) => {
      if (newValue)
        yieldData.value = newValue
    })

    watch(previousYears, (newValue) => {
      if (newValue)
        previousData.value = newValue
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

const yieldStatus = computed(() => {
  if (!yieldData.value)
    return null
  return yieldData.value.yield_source
})

const budget = computed(() => {
  if (!budgetData.value)
    return null
  return budgetData.value
})

const previousYearCosts = computed(() => {
  if (!previousData.value)
    return []
  return previousData.value.filter(ele => ele != null)
})

const costChart = ref()

function harvestYearDelta(labels, index) {
  return Math.max(0, Math.ceil((labels.lastIndexOf('January') - index) / 12))
}

const optionsGraph = {
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
    legend: {
      labels: {
        filter: legendItem => typeof legendItem.text !== 'undefined',
        pointStyle: 'rect',
        usePointStyle: true,
      },
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
          const text = `My ${selected.year}`

          if (dataset.label == text) {
            return `${dataset.label}: £${context.parsed.y.toFixed(2)}/ha`
          }
          else {
            const lineLabel = `${dataset.label}: £${context.parsed.y.toFixed(2)}/ha`
            let comparisonDataset
            context.chart.data.datasets.forEach((d) => {
              if (d.data.length > 0) {
                if (d.label == text)
                  comparisonDataset = d.data[context.dataIndex]
              }
            })
            if (!comparisonDataset) {
              console.error(`Expected a dataset for current year, only found: ${context.chart.data.datasets}`)
              return lineLabel
            }
            else {
              const variance = context.parsed.y - comparisonDataset
              const varLabel = `${variance >= 0 ? '+' : '-'} £${Math.abs(variance).toFixed(2)}/ha`
              return `${lineLabel} (${varLabel})`
            }
          }
        },
        title: (context) => {
          const harvestYearDelta = Math.max(
            0,
            Math.ceil((costChart.value.chartInstance.data.labels.lastIndexOf('January') - context[0].dataIndex) / 12),
          )
          const harvestRelative
            = harvestYearDelta == 0
              ? 'year of harvest'
              : harvestYearDelta > 1
                ? `${harvestYearDelta} years before harvest`
                : 'year before harvest'
          return `${context[0].label} (${harvestRelative})`
        },
      },
      mode: 'x',
      position: 'nearest',
    },
  },
  scales: {
    yA: {
      display: true,
      suggestedMin: 0,
      title: {
        display: true,
        text: 'Cost in £/ha',
      },
    },
  },
}

function sortMonthsToHarvestYear(...multipleYearData) {
  return multipleYearData
    .map(r => r.cumulative_variable_costs.map(m => [r.harvest_year, ...m.year_month.split('-')]))
    .reduce((acc, yms) => acc.concat(yms), [])
    .map(([h, y, m]) => [Number(h) - Number(y), Number(m)])
    .sort(([ayd, am], [byd, bm]) => (ayd > byd ? -1 : ayd < byd ? 1 : am - bm))
}

function generateLabels(earliestMonth, mostYearsBeforeHarvest, latestMonth) {
  return moment
    .months()
    // first possibly partial year
    .slice(earliestMonth - 1, mostYearsBeforeHarvest ? 12 : latestMonth)
    // any extra full years - we never really actually expect this, but
    // if we render it properly, as though it's real, then it makes data
    // problems more apparent.
    .concat(...Array(Math.max(0, mostYearsBeforeHarvest - 1)).fill(moment.months()))
    // last partial year, if it differs from the first
    .concat(mostYearsBeforeHarvest ? moment.months().slice(0, latestMonth) : [])
}

function dataPoints(labels, yearData, dataKey = 'cumulative_variable_costs') {
  if (!yearData[dataKey])
    return null

  const points = []
  for (const [i, monthLabel] of labels.entries()) {
    const monthNum = moment.months().indexOf(monthLabel) + 1
    const data
      = yearData[dataKey]
        .filter(m => yearData.harvest_year - Number(m.year_month.split('-')[0]) == harvestYearDelta(labels, i))
        .filter(m => Number(m.year_month.split('-')[1]) == monthNum)
        .map(m => m.cost / yearData.area)
        .slice(-1)[0] // expect only one, or none
      || (points.length == 0 ? 0 : points.slice(-1)[0])

    points.push(data)
  }
  return points
}
function blankOutFutureDatapoints(yearDatapoints, labels, now, harvestYear) {
  const thisMonth = now.format('MMMM')
  const yearsToHarvest = harvestYear - now.year()
  const latestMonth = labels.slice(-1)[0]
  const thisMonthOccursInHarvestYear = now.month() <= moment.months().indexOf(latestMonth)

  // seek next month occurrence back until we get to correct year
  let thisMonthIdx = labels.length // init, not valid
  for (const _ of Array(yearsToHarvest + (thisMonthOccursInHarvestYear ? 1 : 0))) {
    thisMonthIdx
      // ternary because lastIndexOf(_, -1) is treated as lastIndexOf(_, 0)
      = thisMonthIdx > 0 ? labels.lastIndexOf(thisMonth, thisMonthIdx - 1) : -1
  }

  // blank out future indices
  return yearDatapoints.map((e, i) => (i > thisMonthIdx ? null : e))
}

// Pass market data points through this because we don't know if it has been uploaded or nothing applied
// so assume not uploaded
function blankOutNoDatapoints(yearDatapoints, harvestYear) {
  const now = moment()
  if (harvestYear < now.year() || (harvestYear == now.year() && now.month() > 8))
    return yearDatapoints

  let stop = false
  for (let i = yearDatapoints.length - 1; i >= 0; i--) {
    if (stop)
      break
    if (!yearDatapoints[i])
      continue

    if (yearDatapoints[i] == yearDatapoints[i - 1]) {
      yearDatapoints[i] = null
      continue
    }
    stop = true
  }

  return yearDatapoints
}

function avgDatapoints(labels, ...datapointsArrs) {
  return datapointsArrs
    .reduce((sum, dp) => sum.map((el, i) => el + dp[i]), Array.from({ length: labels.length }).fill(0))
    .map(el => el / datapointsArrs.length)
}

const chartData = computed(() => {
  let datasets = []
  let labels = []
  if (previousYearCosts.value && previousYearCosts.value.length > 0) {
    const results = previousYearCosts.value
    const normalisedMonths = sortMonthsToHarvestYear(...results)
    const now = moment()
    const earliestMonth = normalisedMonths[0][1]
    const mostYearsBeforeHarvest = normalisedMonths[0][0]
    const havePriorYears = results.length > 1

    const latestMonth = havePriorYears || selected.year < now.year() ? normalisedMonths.slice(-1)[0][1] : 12
    labels = generateLabels(earliestMonth, mostYearsBeforeHarvest, latestMonth)
    // Worst-case we show a straight line budget, evenly distributed over months
    let budgetFitPoints = labels.map((_, i, a) => i / a.length)

    let yearDatapoints
      = results.filter(r => r.harvest_year == selected.year).map(e => dataPoints(labels, e))[0]
      ?? Array(labels.length).fill(0)
    if (selected.year >= now.year())
      yearDatapoints = blankOutFutureDatapoints(yearDatapoints, labels, now, selected.year)

    if (yieldStatus.value) {
      const badWords = ['missing', 'user estimation', 'yagro estimation']
      if (badWords.some(v => yieldStatus.value.includes(v))) {
        yearDatapoints = blankOutNoDatapoints(yearDatapoints, selected.year.id)
        yearDatapoints = blankOutNoDatapoints(yearDatapoints, selected.year.id)
      }
    }

    datasets.push({
      backgroundColor: 'rgb(227,93,106)',
      borderColor: '#e35d6a',
      cubicInterpolationMode: 'monotone',
      data: yearDatapoints,
      fill: false,
      label: `My ${selected.year}`,
      yAxisID: 'yA',
    })

    if (yearDatapoints.slice(-1)[0] != null)
      // The year is complete, so we can fit the budget curve to the shape of what actually happened
      budgetFitPoints = yearDatapoints

    let marketDatapoints = results
      .filter(r => r.harvest_year == selected.year)
      .map(d => dataPoints(labels, d, 'market_cumulative_variable_costs'))[0]

    if (marketDatapoints) {
      if (selected.year >= now.year())
        marketDatapoints = blankOutFutureDatapoints(marketDatapoints, labels, now, selected.year)

      marketDatapoints = blankOutNoDatapoints(marketDatapoints, selected.year)
      datasets.push({
        backgroundColor: '#e6d53a',
        borderColor: '#e6d53a',
        cubicInterpolationMode: 'monotone',
        data: marketDatapoints,
        fill: false,
        hidden: true,
        label: `Best in class ${selected.year}`,
        yAxisID: 'yA',
      })

      // We can get a better shape for the budget curve by sampling more farms
      // rather than over-fitting to just this one's one year.
      budgetFitPoints = marketDatapoints
    }
    else {
      datasets.push({ data: [] })
    }

    const marketPrevYearDataPoints = results
      .filter(r => r.harvest_year == selected.year - 1)
      .map(d => dataPoints(labels, d, 'prev_year_cumulative_variable_costs'))[0]

    if (marketPrevYearDataPoints) {
      datasets.push({
        backgroundColor: '#a6d23a',
        borderColor: '#a6d23a',
        cubicInterpolationMode: 'monotone',
        data: marketPrevYearDataPoints,
        fill: false,
        hidden: true,
        label: `Best in class ${selected.year - 1}`,
        yAxisID: 'yA',
      })
    }
    else {
      datasets.push({ data: [] })
    }

    const prevDatapoints = results.filter(r => r.harvest_year < selected.year).map(d => dataPoints(labels, d))
    const prevAvgPoints = avgDatapoints(labels, ...prevDatapoints)
    if (prevAvgPoints[prevAvgPoints.length - 1] > 0) {
      datasets.push({
        backgroundColor: '#17a2b8',
        borderColor: '#17a2b8',
        borderDash: [5, 5],
        cubicInterpolationMode: 'monotone',
        data: prevAvgPoints,
        fill: false,
        label: `My prior ${prevDatapoints.length} years' average`,
        pointStyle: 'line',
      })

      // We can get the best shape for this farm's budget curve by using its own historical data.
      budgetFitPoints = prevAvgPoints
    }
    else {
      datasets.push({ data: [] })
    }

    if (budget.value) {
      const budgetDatapoints = budgetFitPoints.map(
        v => (budget.value.cost.total / budget.value.area.magnitude) * (v / budgetFitPoints.slice(-1)[0]),
      )

      datasets.push({
        backgroundColor: '#3ed5a6',
        borderColor: '#3ed5a6',
        cubicInterpolationMode: 'monotone',
        data: budgetDatapoints,
        fill: false,
        label: `My ${selected.year} budget`,
      })
    }
    else {
      datasets.push({ data: [] })
    }
  }
  else {
    // Clean previous labels and data
    datasets = [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }]
  }
  return {
    datasets,
    labels,
  }
})
</script>

<template>
  <div id="costschart">
    <YTooltip placement="top" class="w-100">
      <LineChart
        id="business-tracker-costs-chart-line-chart"
        ref="costChart"
        :chart-data="chartData"
        :options="optionsGraph"
        :height="400"
      />
      <template #content>
        <i class="i-fa6-solid-lightbulb h-4 w-4" />
        {{ $t('tracker.toggleCurves') }}
      </template>
    </YTooltip>
  </div>
</template>
