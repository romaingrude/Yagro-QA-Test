<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'
import QuantityFormat from '~/components/formatters/QuantityFormat.vue'
import YTable from '~/components/elements/YTable.vue'
import { useSelectedStore } from '~/stores/selected'
import useFetchData from '~/composables/useFetchData'

export default defineComponent({
  components: { MoneyFormat, QuantityFormat, YTable },

  setup() {
    const data = ref(null)

    const selected = useSelectedStore()
    const fetchData = function () {
      const { fetchedData } = useFetchData(
        `api/business-tracker/sales/harvest_year=${selected.year}&crop_id=${selected.crop.id}&order_by=sold_date&page=1&per_page=25`,
      )
      watch(fetchedData, (newValue) => {
        if (newValue)
          data.value = newValue
      })
    }

    onMounted(() => {
      fetchData()
    })

    const salesData = computed(() => {
      if (!data.value)
        return []
      return data.value.objects
    })

    const salesTableColumns = [
      { key: 'variety.name', name: 'Variety', sortable: true },
      { key: 'purchaseCompany', name: 'Purchase Company', sortable: true },
      { key: 'contractNumber', name: 'Contract Number', sortable: true },
      { key: 'quantity', name: 'Quantity', sortable: true },
      { key: 'quality', name: 'quality', sortable: true },
      { key: 'date', name: 'Sold Date', sortable: true },
      { key: 'budgetSoldPrice', name: 'Budget Sold Price', sortable: true },
      { key: 'premium', name: 'Premium', sortable: true },
      { key: 'penalty', name: 'Penalty', sortable: true },
      { key: 'totalPrice', name: 'Total Price', sortable: true },
    ]

    return {
      salesData,
      salesTableColumns,
    }
  },
})
</script>

<template>
  <YTable :columns="salesTableColumns" :items="salesData" class="mb-5">
    <template #[`variety.name`]="{ data }">
      <span class="text-capitalize"> {{ data.variety ? data.variety.name : '' }} </span>
    </template>
    <template #purchaseCompany="{ data }">
      <span class="text-capitalize">{{ data.purchase_company }}</span>
    </template>
    <template #contractNumber="{ data }">
      <span class="text-capitalize">{{ data.contract_number }}</span>
    </template>
    <template #quantity="{ data }">
      <QuantityFormat :magnitude="data.quantity" units="t" />
    </template>
    <template #quality="{ data }">
      <span class="text-capitalize">{{ data.quality }}</span>
    </template>
    <template #date="{ data }">
      <span class="text-capitalize">{{ data.sold_date }}</span>
    </template>
    <template #budgetSoldPrice="{ data }">
      <MoneyFormat :value="data.delivered_price_sold" per-unit="t" />
    </template>
    <template #premium="{ data }">
      <MoneyFormat :value="data.premium" per-unit="t" />
    </template>
    <template #penalty="{ data }">
      <MoneyFormat :value="data.penalty" per-unit="t" />
    </template>
    <template #totalPrice="{ data }">
      <MoneyFormat :value="data.total_price" />
    </template>
  </YTable>
</template>
