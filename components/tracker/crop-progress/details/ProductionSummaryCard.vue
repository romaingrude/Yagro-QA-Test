<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSelectedStore } from '~/stores/selected'
import YButton from '~/components/elements/YButton.vue'
import YSummary from '~~/components/elements/YSummary.vue'
import YPopover from '~~/components/elements/YPopover.vue'
import SalesContractsModal from '~/components/modals/SalesContractsModal.vue'
import SalesProgressBar from '~~/components/tracker/crop-progress/SalesProgressBar.vue'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'
import useFetchData from '~/composables/useFetchData'

export default defineComponent({
  components: { MoneyFormat, SalesContractsModal, SalesProgressBar, YButton, YPopover, YSummary },
  props: {
    production: {
      default: null,
      type: Object,
    },
    totalArea: {
      default: () => 0,
      type: Number,
    },
    breakEvens: {
      default: () => {},
      type: Object,
      required: false,
    },
  },
  setup() {
    const selected = useSelectedStore()
    const { t } = useI18n()
    const data = ref(null)

    const fetchData = function () {
      if (selected.crop) {
        data.value = null
        const { fetchedData } = useFetchData(
          `api/business-tracker/${selected.year}/crops/${selected.crop.id}/production`,
        )
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

    const productionData = computed(() => {
      if (!data.value)
        return null
      return data.value
    })

    return {
      productionData,
      t,
    }
  },
  data() {
    return {
      isShow: false,
    }
  },
  methods: {
    closeModal() {
      this.isShow = false
    },
    showModal() {
      this.isShow = true
    },
  },
})
</script>

<template>
  <div>
    <YSummary :border-column="false" :border-row="true" :rows="4" :columns="[1, 3, 3, 3]" class="mb-4">
      <template #1_1>
        <SalesProgressBar
          :total-amount="production ? Number(production.magnitude) : null"
          :sold-amount="productionData ? Number(productionData.summary.sold_amount) : null"
          :sold-percentage="
            production && productionData ? productionData.summary.sold_amount / production.magnitude : null
          "
          :contracted-amount="production && productionData ? Number(productionData.summary.contracted_amount) : null"
          :contracted-percentage="
            production && productionData ? productionData.summary.contracted_amount / production.magnitude : null
          "
          :dimension="production ? production.dimension : null"
          :compact="false"
        />
      </template>
      <template #2_1>
        <div class="p-3">
          <small class="text-capitalize text-muted">
            {{ t('tracker.minPrice') }}
            <YPopover>
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('tracker.minimumPrice') }}</h5></template>
              <template #content>{{ t('tracker.minimumPriceMsg') }}</template>
            </YPopover>
          </small>
          <p class="mb-0">
            <MoneyFormat v-if="productionData" :value="productionData.summary.overall_min_price" per-unit="t" />
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template #2_2>
        <div class="p-3">
          <small class="text-capitalize text-muted">
            {{ t('tracker.avgPrice') }}
            <YPopover>
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('tracker.averagePrice') }}</h5></template>
              <template #content>{{ t('tracker.averagePriceMsg') }}</template>
            </YPopover>
          </small>
          <p class="mb-0">
            <MoneyFormat v-if="productionData" :value="productionData.summary.overall_avg_price" per-unit="t" />
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template #2_3>
        <div class="p-3">
          <small class="text-capitalize text-muted">
            {{ t('tracker.maxPrice') }}
            <YPopover>
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('tracker.maximumPrice') }}</h5></template>
              <template #content>{{ t('tracker.maximumPriceMsg') }}</template>
            </YPopover>
          </small>
          <p class="mb-0">
            <MoneyFormat v-if="productionData" :value="productionData.summary.overall_max_price" per-unit="t" />
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template #3_1>
        <div class="p-3">
          <small class="text-capitalize text-muted">
            {{ t('tracker.achieved') }}
            <YPopover>
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('tracker.achievedSales') }}</h5></template>
              <template #content>{{ t('tracker.achievedSalesMsg') }}</template>
            </YPopover>
          </small>
          <p class="mb-0">
            <MoneyFormat v-if="productionData" :value="productionData.summary.sales_total" />
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template #3_2>
        <div class="p-3">
          <small class="text-capitalize text-muted">
            <span style="white-space: pre-line">{{ t('tracker.leftToSell') }}</span>
            <YPopover>
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('tracker.leftToSell') }}</h5></template>
              <template #content>{{ t('tracker.leftToSellMsg') }}</template>
            </YPopover>
          </small>
          <p class="mb-0">
            <span v-if="totalArea && productionData && production">
              <MoneyFormat
                :value="
                  Math.max(
                    0,
                    production.magnitude
                      - productionData.summary.contracted_amount
                      - (productionData.summary.sold_amount - productionData.summary.contracted_sold),
                  ) * productionData.summary.overall_avg_price
                "
              />
            </span>
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template #3_3>
        <div class="p-3">
          <small class="text-capitalize text-muted">
            <span style="white-space: pre-line">{{ t('tracker.totalPotentialValue') }}</span>
            <YPopover>
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('tracker.totalPotentialValue') }}</h5></template>
              <template #content>{{ t('tracker.totalPotentialValueMsg') }}</template>
            </YPopover>
          </small>
          <p class="mb-0">
            <span v-if="totalArea && productionData && production">
              <MoneyFormat :value="Math.max(0, production.magnitude * productionData.summary.overall_avg_price)" />
            </span>
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template v-if="breakEvens.isEnabled" #4_1>
        <div class="p-3">
          <small class="text-capitalize text-muted">
            <span style="white-space: pre-line">{{ t('breakEvenFeature.budgetedBreakEven') }}</span>
            <YPopover>
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('breakEvenFeature.budgetedBreakEven') }}</h5></template>
              <template #content>
                {{ t('breakEvenFeature.budgetedBreakEvenTip') }}
              </template>
            </YPopover>
          </small>
          <p class="mb-0">
            <span v-if="breakEvens.budgetedBreakEven">
              <MoneyFormat :value="breakEvens.budgetedBreakEven" per-unit="t" />
            </span>
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
      <template v-if="breakEvens.isEnabled" #4_2>
        <div class="p-3">
          <small class="text-capitalize text-muted">
            <span style="white-space: pre-line">{{ t('breakEvenFeature.rollingBreakEven') }}</span>
            <YPopover>
              <font-awesome-icon :icon="['far', 'question-circle']" fixed-width />
              <template #header><h5>{{ t('breakEvenFeature.rollingBreakEven') }}</h5></template>
              <template #content>
                {{ t('breakEvenFeature.rollingBreakEvenTip') }}
              </template>
            </YPopover>
          </small>
          <p class="mb-0">
            <span v-if="breakEvens.rollingBreakEven">
              <MoneyFormat :value="breakEvens.rollingBreakEven" per-unit="t" />
            </span>
            <span v-else class="text-muted">{{ t('general.na') }}</span>
          </p>
        </div>
      </template>
    </YSummary>
    <YButton class="text-capitalize float-right" @click="showModal">
      {{ $t('tracker.viewSalesContracts') }}
    </YButton>
    <SalesContractsModal :show="isShow" @close="closeModal" />
  </div>
</template>

<style lang="scss" scoped>
.float-right {
  float: right;
}
</style>
