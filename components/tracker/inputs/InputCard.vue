<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { LineChart } from 'vue-chart-3'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'

export default defineComponent({
  components: { LineChart, MoneyFormat },
  props: {
    data: {
      required: true,
      type: Object,
      default: () => ({}),
    },
    refreshKey: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const data = ref(props.data)

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
              const category = context.dataset.label
              const price = `£${String(context.raw)}`
              return `${category}: ${price}`
            },
          },
        },
      },
      scales: {
        x: {
          distribution: 'series',
          offset: true,
          ticks: {
            major: {
              enabled: true,
              fontStyle: 'bold',
            },
            source: 'data',
            autoSkip: true,
            autoSkipPadding: 75,
            maxRotation: 0,
            sampleSize: 100,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price per Unit (£)',
          },
        },
      },
    }

    const colours = [
      '#FDBF6F', // Orange
      '#33A02C', // Dark green
      '#1F78B4', // Dark blue
      '#A6CEE3', // Light blue
      '#B2DF8A', // Light green
      '#FB9A99', // Pink (unused)
    ]

    const chartData = computed(() => {
      const datasets = []
      if (!Object.keys(data.value.data).length) {
        return {
          datasets: [{ data: [] }],
          labels: [],
        }
      }

      for (const [i, v] of Object.values(data.value.data).entries()) {
        datasets.push({
          label: v.name,
          data: v.avg,
          borderColor: colours[i],
          lineTension: 0,
          pointRadius: 0,
          fill: false,
          showLine: true,
          spanGaps: true,
        })
      }
      const labels = data.value.labels
      return {
        datasets,
        labels,
      }
    })

    const isPriceData = computed(() => {
      if (!data.value?.data)
        return false
      for (const v of Object.values(data.value.data)) {
        if (v.avg.filter(el => el !== null).length > 0)
          return true
      }

      return false
    })

    return {
      chartData,
      optionsGraph,
      isPriceData,
    }
  },
})
</script>

<template>
  <div class="col-md-6 mb-4">
    <div class="card">
      <div v-if="data.category" class="card-header">
        <h5 class="mb-0 text-capitalize">
          {{ data.category }}
        </h5>
      </div>
      <div class="card-body">
        <LineChart
          v-if="isPriceData"
          :id="`${data.category}-inputs-chart-line-chart`"
          :chart-data="chartData"
          :options="optionsGraph"
          :height="400"
        />
        <div v-else class="no-data">
          {{ $t('marketwatch.inputs.noPriceDataForTheSelectedPeriod') }}
        </div>
      </div>
      <ul class="list-group list-group-flush">
        <li
          v-for="product in data.data"
          :key="product.id"
          class="mb-0 list-group-item d-flex justify-content-between align-items-center"
        >
          <p>
            <NuxtLink class="text-capitalize link-style" :to="`/product/${product.id}`">
              {{ product.name }}
            </NuxtLink>
          </p>
          <p><MoneyFormat :value="product.latest" :per-unit="product.unit" /></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.no-data {
  height: 400px;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
