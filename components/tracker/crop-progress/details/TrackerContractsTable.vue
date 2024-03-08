<script lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'
import QuantityFormat from '~/components/formatters/QuantityFormat.vue'
import YTable from '~/components/elements/YTable.vue'
import { useSelectedStore } from '~/stores/selected'
import useFetchData from '@/composables/useFetchData'

export default {
  components: { MoneyFormat, QuantityFormat, YTable },

  setup() {
    const data = ref(null)
    const selected = useSelectedStore()
    const fetchData = function () {
      const { fetchedData } = useFetchData(
        `api/business-tracker/contracts/harvest_year=${selected.year}&crop_id=${selected.crop.id}&order_by=contract_date&page=1&per_page=25`,
      )
      watch(fetchedData, (newValue) => {
        if (newValue)
          data.value = newValue
      })
    }

    onMounted(() => {
      fetchData()
    })

    const contractsData = computed(() => {
      if (!data.value)
        return []
      return data.value.objects
    })

    const contractsTableColumns = [
      { key: 'variety.name', name: 'Variety', sortable: true },
      { key: 'purchaseCompany', name: 'Purchase Company', sortable: true },
      { key: 'contractNumber', name: 'Contract Number', sortable: true },
      { key: 'contractDate', name: 'Contract Date', sortable: true },
      { key: 'contractQuantity', name: 'Contract Quantity', sortable: true },
      { key: 'budgetDeliveredPrice', name: 'Budget Delivered Price', sortable: true },
      { key: 'premium', name: 'Premium', sortable: true },
      { key: 'totalPrice', name: 'Total Price', sortable: true },
    ]

    return {
      contractsData,
      contractsTableColumns,
    }
  },
}
</script>

<template>
  <YTable :columns="contractsTableColumns" :items="contractsData" class="mb-5">
    <template #[`variety.name`]="{ data }">
      <span class="text-capitalize">{{ data.variety ? data.variety.name : '' }}</span>
    </template>
    <template #purchaseCompany="{ data }">
      <span class="text-capitalize">{{ data.purchase_company }}</span>
    </template>
    <template #contractNumber="{ data }">
      <span class="text-capitalize">{{ data.contract_number }}</span>
    </template>
    <template #contractDate="{ data }">
      <span class="text-capitalize">{{ data.contract_date }}</span>
    </template>
    <template #contractQuantity="{ data }">
      <QuantityFormat :magnitude="data.contract_quantity" units="t" />
    </template>
    <template #budgetDeliveredPrice="{ data }">
      <MoneyFormat :value="data.budget_delivered_price" per-unit="t" />
    </template>
    <template #premium="{ data }">
      <MoneyFormat :value="data.premium" per-unit="t" />
    </template>
    <template #totalPrice="{ data }">
      <MoneyFormat :value="data.total_price" />
    </template>
  </YTable>
</template>
