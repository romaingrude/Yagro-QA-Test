<script lang="ts">
import { computed, defineComponent } from 'vue'
import Dialog from 'primevue/dialog'
import MoneyFormat from '~/components/formatters/MoneyFormat.vue'
import QuantityFormat from '~/components/formatters/QuantityFormat.vue'
import YButton from '~/components/elements/YButton.vue'

export default defineComponent({
  components: { Dialog, MoneyFormat, QuantityFormat, YButton },
  props: {
    productData: {
      required: true,
      type: Object,
    },
    show: {
      required: true,
      type: Boolean,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isShow = computed(() => props.show)
    const product = computed(() => props.productData)

    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal,
      isShow,
      product,
    }
  },
})
</script>

<template>
  <Dialog
    :breakpoints="{ '576px': '75vw', '768px': '60vw', '992px': '45vw' }"
    :style="{ width: '30vw' }"
    :visible="isShow"
    class="dialog"
    :modal="true"
    @update:visible="closeModal"
  >
    <template #header>
      <h4 class="my-sm-2 ms-3 text-white">
        {{ $t('data.purchases.priceData') }}
      </h4>
    </template>
    <div class="mt-3">
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.group') }}: </span>
        <span>{{ product?.groupName }}</span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.product') }}: </span>
        <span>{{ product?.product?.name }}</span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.distributor') }}: </span>
        <span>{{ product?.distributor?.name }}</span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.pricePerUnit') }}: </span>
        <span><MoneyFormat :value="product?.spend / product?.units" :per-unit="product?.product?.units" /></span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.price') }}: </span>
        <span><MoneyFormat :value="product?.spend" /></span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.amount') }}: </span>
        <span><QuantityFormat :magnitude="product?.units" :units="product?.product?.units" /></span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.packSize') }}: </span>
        <span>{{ product?.packSize?.toFixed(2) }}</span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.orderDate') }}: </span>
        <span>{{ product?.date }}</span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.season') }}: </span>
        <span>{{ product?.seasonName }}</span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.agronomy') }}: </span>
        <span>{{ product?.agronomy }}</span>
      </p>
      <p>
        <span class="text-capitalize fw-bold">{{ $t('data.purchases.medium') }}: </span>
        <span>{{ product?.medium }}</span>
      </p>
    </div>
    <template #footer>
      <YButton class="text-nowrap text-capitalize" type="dark-grey" @click="closeModal">
        {{
          $t('general.close')
        }}
      </YButton>
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
.dialog {
  .p-dialog-header {
    background-color: var(--primary-colour);
    padding: 10px;
  }
}
</style>
