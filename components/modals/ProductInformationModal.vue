<script lang="ts">
import { computed, defineComponent, ref, toRef, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Listbox from 'primevue/listbox'
import DimensionFormat from '~~/components/formatters/DimensionFormat.vue'
import QuantityFormat from '~~/components/formatters/QuantityFormat.vue'
import MarketwatchProductsStats from '~/components/analytics/prices/MarketwatchProductsStats.vue'
import useFetchData from '~/composables/useFetchData'
import { useSelectedStore } from '~/stores/selected'

export default defineComponent({
  components: { Dialog, DimensionFormat, Listbox, MarketwatchProductsStats, QuantityFormat },
  props: {
    productId: {
      default: null,
      required: true,
      type: Number,
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
    const selected = useSelectedStore()
    const productData = ref(null)
    const fetchData = function () {
      productData.value = null

      const { fetchedData } = useFetchData(`api/shared/get-product/${props.productId}`)
      watch(fetchedData, (newValue) => {
        if (newValue)
          productData.value = newValue
      })
    }

    const productDetails = computed(() => {
      if (!productData.value)
        return null
      return productData.value.product
    })

    watch(
      () => props.productId,
      (current, prev) => {
        if ((!prev && JSON.stringify(current) !== '{}') || (prev && current))
          fetchData()
      },
      { immediate: true },
    )
    const localePath = p => p
    const closeModal = () => {
      emit('close')
    }
    return {
      closeModal,
      isShow,
      localePath,
      productDetails,
      selectedElement,
      selected,
    }
  },
})
</script>

<template>
  <div>
    <Dialog :visible="isShow" class="dialog" :modal="true" @update:visible="closeModal">
      <template #header>
        <h4 v-if="productDetails" class="my-sm-2 ms-3 text-white">
          {{ productDetails?.name }}
        </h4>
      </template>
      <div v-if="productDetails" class="m-3">
        <dl class="row row-cols-2 mb-0">
          <div v-if="productDetails.category" class="col">
            <dt>{{ $t('products.category') }}</dt>
            <dd class="text-capitalize">
              {{ productDetails.category.name }}
            </dd>
          </div>

          <div v-if="productDetails.subcategories" class="col">
            <dt>{{ $t('products.subcategories') }}</dt>
            <dd class="text-capitalize">
              <ul class="list-inline">
                <li v-for="subcat in productDetails.subcategories" :key="subcat" class="list-inline-item">
                  {{ subcat.name }}
                </li>
              </ul>
            </dd>
          </div>

          <div v-if="productDetails.serial" class="col">
            <dt>{{ $t('products.mappNumber') }}</dt>
            <dd>
              {{ productDetails.serial }}
            </dd>
          </div>

          <div v-if="productDetails.manufacturer?.name" class="col">
            <dt>{{ $t('products.marketingCompany') }}</dt>
            <dd>
              {{ productDetails.manufacturer.name }}
            </dd>
          </div>

          <div v-if="productDetails.units" class="col">
            <dt>{{ $t('products.unit') }}</dt>
            <dd class="text-capitalize">
              <DimensionFormat :value="productDetails.units" />
            </dd>
          </div>
        </dl>
        <div v-if="productDetails.ingredients && productDetails.ingredients.length > 0" class="mb-3">
          <dt class="text-capitalize">
            {{ $t('products.ingredients') }}
          </dt>
          <dd>
            <Listbox class="list" :options="productDetails.ingredients" option-label="name">
              <template #option="slotProps">
                <div>
                  <span class="text-capitalize">{{ slotProps.option.name }}</span>
                  <QuantityFormat
                    v-if="slotProps.option.amount && slotProps.option.units"
                    class="float-end"
                    :magnitude="slotProps.option.amount"
                    :units="slotProps.option.units"
                  />
                </div>
              </template>
            </Listbox>
          </dd>
        </div>
        <div v-if="productDetails?.pricingStats && productDetails?.pricingStats.latest" class="p-3 bg-light">
          <h4>{{ $t('products.marketwatch') }}</h4>
          <MarketwatchProductsStats :product="productDetails" class="mb-2" />
        </div>
      </div>

      <template #footer>
        <YButton class="text-nowrap" type="dark-grey" @click="closeModal">
          {{ $t('general.cancel') }}
        </YButton>
        <NuxtLink :to="localePath(`/product/${productDetails?.id}`)" @click="selected.setProduct(productDetails)">
          <YButton class="text-nowrap" type="outline-primary">
            {{ $t('products.viewProductDetails') }}
          </YButton>
        </NuxtLink>
      </template>
    </Dialog>
  </div>
</template>
