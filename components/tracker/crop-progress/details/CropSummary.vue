<script lang="ts">
import { defineComponent, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import QuantityFormat from '~/components/formatters/QuantityFormat.vue'
import YSummary from '~/components/elements/YSummary.vue'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'
import { useSelectedStore } from '~/stores/selected'
import { useFetchData } from '~/.nuxt/imports'
import YTooltip from '~/components/elements/YTooltip.vue'
import EditExpectedYieldModal from '~/components/modals/EditExpectedYieldModal.vue'

export default defineComponent({
  components: { YSummary, QuantityFormat, MoneyFormat, YTooltip, EditExpectedYieldModal },
  props: {
    fieldArea: {
      default: null,
      type: Object,
    },
    fields: {
      default: () => 0,
      type: Number,
    },
    production: {
      default: null,
      type: Object,
    },
    yield: {
      default: null,
      type: Object,
    },
    salesAchieved: {
      default: null,
      type: Number,
    },
    totalCost: {
      default: null,
      type: Number,
    },
  },
  setup() {
    const { t } = useI18n()
    const selected = useSelectedStore()

    const showEditModal = ref(false)
    const detail = ref(null)

    const fetchDetails = () => {
      if (!selected.variety && !selected.crop)
        return null

      const maybeField = selected.field?.id ? `/${selected.field.id}` : ''
      const cropOrVariety = selected.variety?.id ? `varieties/${selected.variety.id}` : `crops/${selected.crop?.id}`
      const { fetchedData: detailData } = useFetchData(
        `api/fields${maybeField}/harvest-years/${selected.year}/${cropOrVariety}`,
      )

      watch(detailData, (newValue) => {
        if (newValue)
          detail.value = newValue
      })
    }

    const expectedYieldEnabled = computed(() => {
      const now = new Date()
      return !!(selected.year >= now.getFullYear() - 1)
    })

    watchEffect(() => fetchDetails())

    return {
      t,
      expectedYieldEnabled,
      showEditModal,
      selected,
      detail,
    }
  },
})
</script>

<template>
  <YSummary :border-column="false" :border-row="false" :rows="1" :columns="[6]" class="mb-5 p-3">
    <template #1_1>
      <small class="text-capitalize text-muted">Field area</small>
      <p>
        <QuantityFormat v-if="fieldArea" :magnitude="fieldArea.magnitude" :units="fieldArea.dimension" />
        <span v-else>{{ t('marketwatch.filters.NA') }}</span>
      </p>
    </template>
    <template #1_2>
      <small class="text-capitalize text-muted"># Fields</small>
      <p class="mb-0">
        <span v-if="fields">{{ fields }} </span>
        <span v-else>{{ t('marketwatch.filters.NA') }}</span>
      </p>
    </template>
    <template #1_3>
      <small class="text-capitalize text-muted">
        Production
        <YPopover>
          <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
          <template #header><h5>{{ t('metrics.production') }}</h5></template>
          <template #content>{{ t('metrics.productionMsg') }}</template>
        </YPopover>
      </small>
      <p class="mb-0">
        <QuantityFormat v-if="production" :magnitude="production.magnitude" :units="production.dimension" />
        <span v-else>{{ t('marketwatch.filters.NA') }}</span>
      </p>
    </template>
    <template #1_4>
      <small class="text-capitalize text-muted">
        Yield
        <YPopover>
          <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
          <template #header><h5>{{ t('metrics.yield') }}</h5></template>
          <template #content>{{ t('metrics.yieldMsg') }}</template>
        </YPopover>
        <YTooltip v-if="expectedYieldEnabled">
          <font-awesome-icon cursor="pointer" :icon="['far', 'pencil']" fixed-width @click="showEditModal = true" />
          <template #content>Edit your expected yield</template>
        </YTooltip>
        <EditExpectedYieldModal
          v-if="detail"
          :show="showEditModal"
          :year="selected.year"
          :crop="selected.crop"
          :input-yield="detail.yield"
          @close="showEditModal = false"
          @cancel="showEditModal = false"
        />
      </small>
      <p class="mb-0">
        <QuantityFormat v-if="yield" :magnitude="yield.magnitude" :units="yield.dimension" />
        <span v-else>{{ t('marketwatch.filters.NA') }}</span>
      </p>
    </template>
    <template #1_5>
      <small class="text-capitalize text-muted">
        £ achieved
        <YPopover>
          <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
          <template #header>
            <h5>{{ t('tracker.achievedSales') }}</h5>
          </template>
          <template #content>{{ t('tracker.achievedSalesMsg') }}</template>
        </YPopover>
      </small>
      <p class="mb-0">
        <MoneyFormat :value="salesAchieved" />
      </p>
    </template>
    <template #1_6>
      <small class="text-capitalize text-muted">
        Total cost
        <YPopover placement="top">
          <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
          <template #header><h5>{{ t('metrics.totalCost') }}</h5></template>
          <template #content>{{ t('metrics.totalCostMsg') }}</template>
        </YPopover>
      </small>
      <p class="mb-0">
        <MoneyFormat :value="totalCost" />
      </p>
    </template>
  </YSummary>
</template>
