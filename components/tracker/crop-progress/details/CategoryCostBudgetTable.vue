<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSelectedStore } from '~/stores/selected'
import YTable from '~~/components/elements/YTable.vue'
import YButton from '~~/components/elements/YButton.vue'
import TrackerVarietyCostModal from '~~/components/modals/TrackerVarietyCostModal.vue'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'
import useFetchData from '~/composables/useFetchData'

export default defineComponent({
  components: { MoneyFormat, TrackerVarietyCostModal, YButton, YTable },
  setup() {
    // Fetching data
    const selected = useSelectedStore()
    const cost = ref(null)
    const prevCosts = ref([])
    const budgetData = ref(null)

    const fetchData = function () {
      if (selected.crop) {
        // Clear previous data
        cost.value = null
        prevCosts.value = []
        budgetData.value = null

        const { fetchedData: fetchedCostsData } = useFetchData(
          `api/fms/applied-product/${selected.year}/crops/${selected.crop.id}/months`,
        )
        const { fetchedData: fetchedBudgetData } = useFetchData(`budgets/${selected.year}/crops/${selected.crop.id}`)

        watch(fetchedCostsData, async (newValue) => {
          if (newValue) {
            const months = newValue.cumulative_variable_costs.map(m => Object({ ...m, area: Number(newValue.area) }))
            cost.value = months.reverse()[0]

            const [yearNum, monthNum] = cost.value.year_month.split('-')
            const adjustYear = yearNum == selected.year ? 0 : -1

            await Promise.all(
              [0, 1, 2, 3].map((i) => {
                const harvestYear = selected.year - i
                const calendarYear = harvestYear + adjustYear

                const { fetchedData: fetchedYearsData } = useFetchData(
                  `api/fms/applied-product/${harvestYear}/crops/${selected.crop.id}/yearmonth/${calendarYear}-${monthNum}`,
                )
                watch(fetchedYearsData, (newValue) => {
                  if (newValue)
                    prevCosts.value.push(newValue)
                })
                return fetchedYearsData
              }),
            )
          }
        })
        watch(fetchedBudgetData, (newValue) => {
          if (newValue)
            budgetData.value = newValue
        })
      }
    }

    const latestMonthCost = computed(() => {
      if (!cost.value)
        return null
      return cost.value
    })

    const previousYearCosts = computed(() => {
      if (!prevCosts.value || !prevCosts.value.length)
        return []
      const costs = []
      prevCosts.value.map(el =>
        el.cumulative_variable_costs.map(m => costs.push(Object({ ...m, area: Number(el.area) }))),
      )
      return costs
    })

    const meanCategories = computed(() => {
      if (!latestMonthCost.value || !previousYearCosts.value || !previousYearCosts.value.length)
        return []
      return previousYearCosts.value
        .map(m => m.categories.map(c => Object({ ...c, area: Number(m.area) })))
        .reduce((acc, cs) => acc.concat(cs), [])
        .reduce(
          (acc, c) => Object({
            ...acc,
            [c.category]: (acc[c.category] || 0) + Number(c.cost) / c.area / previousYearCosts.value.length,
          }),
          {},
        )
    })

    const budget = computed(() => {
      // eslint-disable-next-line ts/no-use-before-define
      if (!budgetData.value || !categoriesData.value)
        return null
      return budgetData.value
    })

    const categoriesData = computed(() => {
      if (!latestMonthCost.value || !meanCategories.value)
        return []
      let categoryDataCalculation = latestMonthCost.value.categories.map(c =>
        Object({
          ...c,
          area: latestMonthCost.value.area,
          cost: Number(c.cost),
          percentVariance:
            c.category in meanCategories.value
              ? (Number(c.cost) / Number(latestMonthCost.value.area) / Number(meanCategories.value[c.category])) * 100
                - 100
              : undefined,
        }),
      )
      if (!budget.value)
        return categoryDataCalculation
      for (const cat in budget.value.cost) {
        categoryDataCalculation = categoryDataCalculation
          .map(c =>
            c.category == cat
              ? Object({
                ...c,
                budget: budget.value.cost[cat] * (c.area / budget.value.area.magnitude),
                percentBudget:
                    (c.cost / (budget.value.cost[cat] * (c.area / budget.value.area.magnitude))) * 100 - 100, // scale to actual area
              })
              : c,
          )
          .sort((a, b) => -1 * a.category.localeCompare(b.category))
      }
      return categoryDataCalculation
    })

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

    const { t } = useI18n()

    const categoryBudgetTableColumns = computed(() => {
      return [
        { key: 'categoryName', name: 'Category' },
        {
          key: 'cost.totalCost',
          name: t('general.cost'),
          popoverContent: t('tracker.costMsg'),
          popoverTitle: t('general.cost'),
        },
        {
          key: 'percentVariance',
          name: t('tracker.variancePercent'),
          popoverContent: t('tracker.variancePercentMsg'),
          popoverTitle: t('tracker.variancePercent'),
        },
        {
          key: 'percentBudget',
          name: t('tracker.budgetPercent'),
          popoverContent: t('tracker.budgetPercentMsg'),
          popoverTitle: t('tracker.budgetPercent'),
        },
      ]
    })

    return {
      categoryBudgetTableColumns,
      latestMonthCost,
      categoriesData,
      previousYearCosts,
      meanCategories,
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
    <YTable :columns="categoryBudgetTableColumns" :items="categoriesData" striped-rows>
      <template #empty>
        <h5>{{ t('tracker.noDataUploaded') }}</h5>
      </template>
      <template #categoryName="{ data }">
        <span style="text-transform: capitalize">{{ data.category }}</span>
      </template>
      <template #[`cost.totalCost`]="{ data }">
        <MoneyFormat :value="Number(data.cost).toFixed(2)" />
        <br>
        <MoneyFormat :value="Number(Number(data.cost) / Number(data.area)).toFixed(2)" per-unit="ha" />
      </template>
      <template #percentVariance="{ data }">
        <span
          v-if="Number.isFinite(data.percentVariance)"
          class="no-wrap" :class="[data.percentVariance < 0 ? 'text-success' : 'text-danger']"
        >
          <span v-if="data.percentVariance !== 0">
            {{ data.percentVariance &lt; 0 ? '-' : '+' }}
          </span>
          <span> {{ Math.abs(data.percentVariance).toFixed(0) }}% </span>
        </span>
        <span v-else>{{ t('general.na') }}</span>
      </template>
      <template #percentBudget="{ data }">
        <span
          v-if="Number.isFinite(data.percentBudget)"
          class="no-wrap" :class="[data.percentBudget < 0 ? 'text-success' : 'text-danger']"
        >
          <span v-if="data.percentBudget !== 0">
            {{ data.percentBudget &lt; 0 ? '-' : '+' }}
          </span>
          <span> {{ Math.abs(data.percentBudget).toFixed(0) }}% </span>
        </span>
        <span v-else>{{ t('general.na') }}</span>
      </template>
    </YTable>
    <YButton class="text-capitalize mt-4 float-right" @click="showModal">
      {{ $t('tracker.viewCostDetails') }}
    </YButton>
    <TrackerVarietyCostModal :show="isShow" @close="closeModal" />
  </div>
</template>

<style lang="scss" scoped>
.float-right {
  float: right;
}
</style>
