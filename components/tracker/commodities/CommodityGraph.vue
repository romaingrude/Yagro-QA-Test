<script lang="ts">
import { computed, defineComponent } from 'vue'
import { LineChart } from 'vue-chart-3'
import useFetchData from '~/composables/useFetchData'

export default defineComponent({
  components: {
    LineChart,
  },
  props: {
    currency: {
      required: true,
      type: String,
    },
    data: {
      required: true,
      type: Object,
    },
    ticker: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const commodityTicker = computed(() => {
      return props.ticker
    })

    const { fetchedData: seriesData } = useFetchData(
      `pricing/series?product[]=${commodityTicker.value}&from_date=2022-05-18&to_date=2023-05-18&product_source=commodities&facets=%7B%22nearest%22:true%7D`,
    )

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
          display: false,
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
            label: (context) => {
              const labelValue = String(Number(context.raw).toFixed(2))
              return `${labelValue}`
            },
          },
          mode: 'x',
          position: 'nearest',
        },
      },
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: `Price (${props.currency} / tonne)`,
          },
        },
      },
    }

    const chartData = computed(() => {
      const datasets = []
      if (!seriesData.value) {
        return {
          datasets: [{ data: [] }],
          labels: [],
        }
      }
      datasets.push({
        backgroundColor: 'rgb(141, 198, 63)',
        borderColor: '#8dc63f',
        cubicInterpolationMode: 'monotone',
        lineTension: 0,
        pointRadius: 0,
        fill: false,
        showLine: true,
        spanGaps: true,
        data: seriesData.value.data[commodityTicker.value].avg,
        label: commodityTicker.value,
      })

      const labels = seriesData.value.labels
      return {
        datasets,
        labels,
      }
    })

    return {
      seriesData,
      chartData,
      commodityTicker,
      optionsGraph,
    }
  },
})
</script>

<template>
  <div>
    <LineChart
      :id="`${commodityTicker}-commodity-chart-line-chart`"
      :chart-data="chartData"
      :options="optionsGraph"
      :height="300"
    />
  </div>
</template>
