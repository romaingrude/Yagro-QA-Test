<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import QuantityFormat from '~/components/formatters/QuantityFormat'
import MoneyFormat from '~/components/formatters/MoneyFormat'
import YPopover from '~/components/elements/YPopover'
import YSummary from '~/components/elements/YSummary'

export default defineComponent({
  components: { YSummary, MoneyFormat, QuantityFormat, YPopover },
  props: {
    budgetsData: {
      required: true,
      default: null,
      type: Object,
    },
  },
  setup() {
    const { t } = useI18n()
    return {
      t,
    }
  },
})
</script>

<template>
  <div>
    <YSummary :border-column="true" :rows="2" :columns="[4]" class="mb-5">
      <template #1_1>
        <div class="p-2">
          <small class="text-muted">
            {{ $t('budgets.totalArea') }}
            <YPopover placement="top">
              <font-awesome-icon :icon="['far', 'question-circle']" />
              <template #header><h5>{{ $t('budgets.totalArea') }}</h5></template>
              <template #content>{{ $t('budgets.totalAreaMsg') }}</template>
            </YPopover>
          </small>
          <p>
            <QuantityFormat v-if="budgetsData" :magnitude="budgetsData.area_sum" units="ha" />
            <span v-else>{{ t('marketwatch.filters.NA') }}</span>
          </p>
        </div>
      </template>
      <template #1_2>
        <div class="p-2">
          <small class="text-muted">
            {{ $t('budgets.totalCost') }}
            <YPopover placement="top">
              <font-awesome-icon :icon="['far', 'question-circle']" />
              <template #header><h5>{{ $t('budgets.totalCost') }}</h5></template>
              <template #content>{{ $t('budgets.totalCostMsg') }}</template>
            </YPopover>
          </small>
          <p>
            <MoneyFormat v-if="budgetsData" :value="budgetsData.total_cost" />
            <span v-else>{{ t('marketwatch.filters.NA') }}</span>
          </p>
        </div>
      </template>
      <template #1_3>
        <div class="p-2">
          <small class="text-muted">
            {{ $t('budgets.totalSales') }}
            <YPopover placement="top">
              <font-awesome-icon :icon="['far', 'question-circle']" />
              <template #header><h5>{{ $t('budgets.totalSales') }}</h5></template>
              <template #content>{{ $t('budgets.totalSalesMsg') }}</template>
            </YPopover>
          </small>
          <p>
            <MoneyFormat v-if="budgetsData" :value="budgetsData.total_sales" />
            <span v-else>{{ t('marketwatch.filters.NA') }}</span>
          </p>
        </div>
      </template>
      <template #1_4>
        <div class="p-2">
          <small class="text-muted">
            {{ $t('budgets.budgetedGrossMargin') }}
            <YPopover placement="top">
              <font-awesome-icon :icon="['far', 'question-circle']" title="The total expected sales for all crops." />
              <template #header><h5>{{ $t('budgets.budgetedGrossMargin') }}</h5></template>
              <template #content>{{ $t('budgets.budgetedGrossMarginMsg') }}</template>
            </YPopover>
          </small>
          <p>
            <MoneyFormat v-if="budgetsData" :value="budgetsData.total_sales - budgetsData.total_cost" />
            <span v-else>{{ t('marketwatch.filters.NA') }}</span>
          </p>
        </div>
      </template>
    </YSummary>
  </div>
</template>
