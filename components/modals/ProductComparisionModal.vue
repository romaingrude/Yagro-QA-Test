<script lang="ts">
import { computed, defineComponent, ref, toRef, watch } from 'vue'
import Dialog from 'primevue/dialog'
import QuantityFormat from '~~/components/formatters/QuantityFormat.vue'
import useFetchData from '~/composables/useFetchData'

export default defineComponent({
  components: { Dialog, QuantityFormat },
  props: {
    productAltId: {
      default: null,
      required: true,
      type: Number,
    },
    product: {
      default: null,
      required: true,
      type: Object,
    },
    show: {
      default: false,
      required: true,
      type: Boolean,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const selectedElement = null
    const isShow = toRef(props, 'show')
    const productData = computed(() => props.product)
    const productAltData = ref(null)

    const fetchData = function () {
      productAltData.value = null
      const { fetchedData } = useFetchData(`api/shared/get-product/${props.productAltId}`)
      watch(fetchedData, (newValue) => {
        if (newValue)
          productAltData.value = newValue
      })
    }

    const productAltDetails = computed(() => {
      if (!productAltData.value)
        return null
      return productAltData.value.product
    })

    watch(
      () => props.productAltId,
      (current, prev) => {
        if ((!prev && JSON.stringify(current) !== '{}') || (prev && current))
          fetchData()
      },
      { immediate: true },
    )

    const ingredientsComparison = computed(() => {
      if (!productAltDetails.value || !productData.value)
        return []
      return productData.value.ingredients.map((e) => {
        const alt = productAltDetails.value.ingredients.find(o => o.name === e.name)
        return Object({
          name: e.name,
          productAmount: e.amount,
          productUnits: e.units,
          altAmount: alt?.amount,
          altUnits: alt?.units,
        })
      })
    })

    const tableColumns = computed(() => {
      if (!productAltDetails.value || !productData.value)
        return []
      return [
        { key: 'name', name: 'Ingredient', sortable: true },
        { key: 'productAmount', name: productData.value?.name, sortable: true },
        { key: 'altAmount', name: productAltDetails.value?.name, sortable: true },
      ]
    })

    const localePath = p => p
    const closeModal = () => {
      emit('close')
    }
    return {
      closeModal,
      isShow,
      localePath,
      productAltDetails,
      selectedElement,
      tableColumns,
      ingredientsComparison,
    }
  },
})
</script>

<template>
  <div>
    <Dialog :visible="isShow" class="dialog" :modal="true" @update:visible="closeModal">
      <template #header>
        <h4 class="my-sm-2 ms-3 text-white">
          {{ $t('products.productComparison') }}
        </h4>
      </template>
      <YTable :columns="tableColumns" :items="ingredientsComparison" class="mb-5">
        <template #[`name`]="{ data }">
          <span class="text-capitalize">{{ data.name }}</span>
        </template>
        <template #[`productAmount`]="{ data }">
          <QuantityFormat v-if="data.productAmount" :magnitude="data.productAmount" :units="data.productUnits" />
        </template>
        <template #[`altAmount`]="{ data }">
          <QuantityFormat v-if="data.altAmount" :magnitude="data.altAmount" :units="data.altUnits" />
        </template>
      </YTable>
    </Dialog>
  </div>
</template>
