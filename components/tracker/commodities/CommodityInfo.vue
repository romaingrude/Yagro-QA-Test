<script lang="ts">
import { computed, defineComponent } from 'vue'
import Card from 'primevue/card'
import { useSelectedStore } from '~~/stores/selected'
import MoneyFormat from '~~/components/formatters/MoneyFormat.vue'

export default defineComponent({
  components: {
    Card,
    MoneyFormat,
  },
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
  setup(props) {
    const selected = useSelectedStore()

    const commodityData = computed(() => {
      return props.data
    })

    const commodityCurrency = computed(() => {
      if (!commodityData.value)
        return 'GBP'
      return `${commodityData.value.product.currency}`
    })

    const title = computed(() => {
      if (!commodityData.value)
        return ''
      return `${commodityData.value.product.humanReadableName} (${commodityData.value.product.ticker})`
    })

    const mostRecentPrice = computed(() => {
      if (!commodityData.value)
        return null
      return commodityData.value.objects.map(c => c.close)[commodityData.value.objects.length - 1]
    })

    const highestPrice = computed(() => {
      if (!commodityData.value)
        return null
      return Math.max(...commodityData.value.objects.map(c => c.close))
    })

    const lowestPrice = computed(() => {
      if (!commodityData.value)
        return null
      return Math.min(...commodityData.value.objects.map(c => c.close))
    })

    return {
      commodityCurrency,
      highestPrice,
      lowestPrice,
      mostRecentPrice,
      selected,
      title,
    }
  },
})
</script>

<template>
  <Card>
    <template #title>
      <span class="text-capitalize"> {{ title }} - {{ $t('marketwatch.alerts.nearby') }} </span>
    </template>
    <template #content>
      <div class="m-2">
        <div>
          <dt>{{ $t('marketwatch.stats.latestPrice') }}</dt>
          <dd><MoneyFormat :value="mostRecentPrice" per-unit="t" :currency-code="commodityCurrency" /></dd>
        </div>
        <div>
          <dt>{{ $t('marketwatch.stats.ninetyDayHighPrice') }}</dt>
          <dd><MoneyFormat :value="highestPrice" per-unit="t" :currency-code="commodityCurrency" /></dd>
        </div>
        <div>
          <dt>{{ $t('marketwatch.stats.ninetyDayLowPrice') }}</dt>
          <dd><MoneyFormat :value="lowestPrice" per-unit="t" :currency-code="commodityCurrency" /></dd>
        </div>
      </div>
    </template>
  </Card>
</template>
