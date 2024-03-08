<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import YPopover from '~~/components/elements/YPopover.vue'
import YSummary from '~~/components/elements/YSummary.vue'
import { useSelectedStore } from '~/stores/selected'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'
import useFetchData from '~/composables/useFetchData'
import EstimatedYieldWarning from '~/components/tracker/crop-progress/details/EstimatedYieldWarning.vue'

export default defineComponent({
  components: { EstimatedYieldWarning, MoneyFormat, YPopover, YSummary },
  setup() {
    const { t } = useI18n()
    const selected = useSelectedStore()
    const data = ref(null)

    const fetchData = function () {
      if (selected.crop) {
        data.value = null
        const { fetchedData } = useFetchData(`api/fields/harvest-years/${selected.year}/crops/${selected.crop.id}`)
        watch(fetchedData, (newValue) => {
          if (newValue)
            data.value = newValue
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

    const cropData = computed(() => {
      if (!data.value)
        return null
      return data.value
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
  <div>
    <YSummary :rows="1" :columns="[3]" class="ps-2 mb-3">
      <template #1_1>
        <div class="p-2">
          <small class="text-capitalize text-muted">
            {{ t('metrics.totalCost') }}
            <YPopover placement="top">
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('metrics.totalCost') }}</h5></template>
              <template #content>{{ t('metrics.totalCostMsg') }}</template>
            </YPopover>
          </small>
          <p>
            <MoneyFormat v-if="cropData" :value="cropData.cost.total.magnitude" />
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template #1_2>
        <div class="p-2">
          <small class="text-capitalize text-muted">
            {{ t('metrics.costPerHa') }}
            <YPopover placement="top">
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('metrics.costPerHa') }}</h5></template>
              <template #content>{{ t('metrics.costPerHaMsg') }}</template>
            </YPopover>
          </small>
          <p>
            <MoneyFormat v-if="cropData" :value="cropData.cost.area.magnitude" per-unit="ha" />
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template #1_3>
        <div class="p-2">
          <small class="text-capitalize text-muted">
            {{ t('metrics.costOfProduction') }}
            <YPopover placement="top">
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('metrics.costOfProduction') }}</h5></template>
              <template #content>{{ t('metrics.costOfProductionMsg') }}</template>
            </YPopover>
          </small>
          <p v-if="cropData">
            <MoneyFormat :value="cropData.cost.production.magnitude" per-unit="t" />
            <EstimatedYieldWarning :source="cropData.yield.source" />
          </p>
          <p v-else>
            <span class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
    </YSummary>
  </div>
</template>
