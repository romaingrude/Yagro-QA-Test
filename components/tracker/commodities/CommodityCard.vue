<script lang="ts">
import { computed, defineComponent } from 'vue'
import Card from 'primevue/card'
import CommodityFutures from './CommodityFutures.vue'
import CommodityGraph from './CommodityGraph.vue'
import { useSelectedStore } from '~~/stores/selected'
import useFetchData from '~/composables/useFetchData'

export default defineComponent({
  components: {
    Card,
    CommodityFutures,
    CommodityGraph,
  },
  props: {
    commodity: {
      required: true,
      type: Object,
    },
  },
  setup(props) {
    const selected = useSelectedStore()
    const commodityInfo = computed(() => {
      return props.commodity
    })

    const { fetchedData: commodityData } = useFetchData(
      `pricing/commodities/${commodityInfo.value.id}/futures?limit=5`,
    )

    const title = computed(() => {
      if (!commodityInfo.value)
        return ''
      return `${commodityInfo.value.exchange} ${commodityInfo.value.name}`
    })
    return {
      commodityInfo,
      selected,
      title,
      commodityData,
    }
  },
})
</script>

<template>
  <Card class="m-2">
    <template #title>
      <h3 class="text-nowrap mb-0 pointer">
        <NuxtLink class="text-capitalize link-style" :to="`/tracker/commodities/commodity/${commodityInfo.id}`">
          {{ title }}
        </NuxtLink>
      </h3>
    </template>
    <template #content>
      <CommodityGraph :data="commodityData" :ticker="commodityInfo.id" :currency="commodityInfo.currency" />
      <br>
      <CommodityFutures :data="commodityData" :currency="commodityInfo.currency" />
    </template>
  </Card>
</template>
