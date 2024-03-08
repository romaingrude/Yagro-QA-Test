<script lang="ts">
import { useI18n } from 'vue-i18n'
import YSummary from '../../elements/YSummary.vue'
import QuantityFormat from '~/components/formatters/MoneyFormat.vue'
import TrackerSalesProgressBar from '~/components/tracker/crop-progress/SalesProgressBar.vue'
import { computed, defineComponent } from '#imports'
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
    YSummary,
  },
  props: {
    crop: {
      default: null,
      required: true,
      type: Object,
    },
  },

  setup(props) {
    const { t } = useI18n()
    const selected = useSelectedStore()

    const cropData = computed(() => {
      if (!props.crop)
        return []
      return props.crop
    })

    return {
      cropData,
      selected,
      t,
    }
  },
})
</script>

<template>
  <YSummary v-if="cropData" :border-row="true" :border-column="true" :rows="3" :columns="[2, 1, 3]" class="flex-fill">
    <template #1_1>
      <div class="p-3">
        <h3 class="text-nowrap mb-0 pointer" @click="selected.setCrop(cropData.crops[0])">
          <NuxtLink class="text-capitalize link-style" :to="`/tracker/crop-progress/crop/${cropData.crops[0].id}`">
            {{ cropData.crops[0].name }}
          </NuxtLink>
        </h3>
      </div>
    </template>

    <template #1_2>
      <div class="py-2 px-3">
        <small class="text-muted text-capitalize">{{ t('general.area') }}</small>
        <p class="mb-0">
          <QuantityFormat v-if="cropData.area" :magnitude="cropData.area.magnitude" :units="cropData.area.dimension" />
        </p>
      </div>
    </template>

    <template #2_1>
      <TrackerSalesProgressBar
        :total-amount="cropData.production ? Number(cropData.production.magnitude) : null"
        :sold-amount="cropData.summary ? Number(cropData.summary.sold_amount) : null"
        :sold-percentage="
          cropData.summary ? Number(cropData.summary.sold_amount) / Number(cropData.production.magnitude) : null
        "
        :contracted-sold="cropData.summary ? Number(cropData.summary.contracted_sold) : null"
        :contracted-amount="cropData.summary ? Number(cropData.summary.contracted_amount) : null"
        :contracted-percentage="
          cropData.summary ? Number(cropData.summary.contracted_amount) / Number(cropData.production.magnitude) : null
        "
        :dimension="cropData.production ? cropData.production.dimension : null"
        :compact="false"
      />
    </template>

    <template #3_1>
      <div class="p-3">
        <small class="text-muted">
          <template v-if="cropData.id < 2024"> {{ t('general.yield') }} </template>
          <template v-else> {{ t('tracker.estYield') }} </template>
        </small>
        <p class="mb-0">
          <YieldField :crop="cropData.crops[0]" :yield="cropData.yield" :source="cropData.source" />
        </p>
      </div>
    </template>
    <template #3_2>
      <div class="p-3">
        <small class="text-muted">{{ t('tracker.costToDate') }}</small>
        <p class="mb-0">
          <CostField v-if="cropData.cost" :crop="cropData.crops[0]" :cost="cropData.cost" />
        </p>
      </div>
    </template>

    <template #3_3>
      <div class="p-3">
        <small class="text-muted">{{ t('tracker.yourAvgPrice') }}</small>
        <p class="mb-0">
          <AvgPriceField v-if="cropData.summary" :crop="cropData.crops[0]" :avg-price="cropData.summary" />
        </p>
      </div>
    </template>
  </YSummary>
</template>

<style></style>
