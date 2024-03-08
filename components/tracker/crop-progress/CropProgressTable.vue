<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import QuantityFormat from '~~/components/formatters/QuantityFormat.vue'
import TrackerSalesProgressBar from '~~/components/tracker/crop-progress/SalesProgressBar.vue'
import YTable from '~~/components/elements/YTable.vue'
import { useSelectedStore } from '~/stores/selected'
import CostField from '~/components/tracker/crop-progress/details/CostField.vue'
import AvgPriceField from '~/components/tracker/crop-progress/details/AvgPriceField.vue'
import YieldField from '~/components/tracker/crop-progress/details/YieldField.vue'

export default defineComponent({
  components: {
    YieldField,
    AvgPriceField,
    CostField,
    QuantityFormat,
    TrackerSalesProgressBar,
    YTable,
  },

  props: {
    crops: {
      default: () => [],
      type: Array,
    },
  },

  setup(props) {
    const { t } = useI18n()
    const selected = useSelectedStore()

    const allCrops = computed(() => {
      if (!props.crops)
        return []
      return props.crops.map(e => Object({ ...e, crop: e.crops[0] }))
    })

    const programmeTableColumns = [
      { key: 'crop.name', name: 'Crop', sortable: true },
      { key: 'area.magnitude', name: 'Area', sortable: true },
      { key: 'yield.magnitude', name: 'Yield', sortable: true },
      { key: 'cost.magnitude', name: 'Cost to date', sortable: true },
      { key: 'percentageSold', name: '% Sold' },
      { key: 'summary.overall_avg_price', name: 'Your Avg Price', sortable: true },
    ]

    return {
      programmeTableColumns,
      selected,
      t,
      allCrops,
    }
  },

  methods: {
    localePath: p => p, // TODO: intlify nop stub, remove when using @nuxtjs/i18n
  },
})
</script>

<template>
  <YTable :columns="programmeTableColumns" :items="allCrops" class="mb-5">
    <template #[`crop.name`]="{ data }">
      <span class="text-capitalize link-style" @click="selected.setCrop(data.crop)">
        <NuxtLink :to="localePath(`/tracker/crop-progress/crop/${data.crop.id}`)">{{ data.crop.name }}</NuxtLink>
      </span>
    </template>

    <template #[`area.magnitude`]="{ data }">
      <QuantityFormat v-if="data.area" :magnitude="Number(data.area.magnitude)" :units="data.area.dimension" />
    </template>

    <template #[`yield.magnitude`]="{ data }">
      <YieldField :crop="data.crop" :yield="data.yield" :source="data.source" />
    </template>

    <template #[`cost.magnitude`]="{ data }">
      <CostField v-if="data.cost" :crop="data.crop" :cost="data.cost" />
    </template>
    <template #[`percentageSold`]="{ data }">
      <TrackerSalesProgressBar
        :total-amount="data.production ? Number(data.production.magnitude) : null"
        :sold-amount="data.summary ? Number(data.summary.sold_amount) : null"
        :sold-percentage="data.summary ? data.summary.sold_amount / data.production.magnitude : null"
        :contracted-amount="data.summary ? Number(data.summary.contracted_amount) : null"
        :contracted-percentage="data.summary ? data.summary.contracted_amount / data.production.magnitude : null"
        :dimension="data.production ? data.production.dimension : null"
        :compact="true"
      />
    </template>

    <template #[`summary.overall_avg_price`]="{ data }">
      <span>
        <AvgPriceField v-if="data.summary" :crop="data.crop" :avg-price="data.summary" />
      </span>
    </template>
  </YTable>
</template>

<style></style>
