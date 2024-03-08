<script lang="ts">
import { computed, defineComponent } from 'vue'
import Listbox from 'primevue/listbox'
import Card from 'primevue/card'
import moment from 'moment-timezone'
import MoneyFormat from '~~/components/formatters/MoneyFormat.vue'

export default defineComponent({
  components: {
    Card,
    Listbox,
    MoneyFormat,
  },
  props: {
    currency: {
      required: true,
      type: String,
    },
    data: {
      required: true,
      type: Object,
    },
    limit: {
      default: 5,
      required: false,
      type: Number,
    },
    noHeader: {
      default: true,
      required: false,
      type: Boolean,
    },
  },
  setup(props) {
    const commodityData = computed(() => {
      return props.data
    })

    const noHeader_ = computed(() => {
      return props.noHeader
    })

    const monthYearText = (month, year) => {
      return moment({ month: month - 1, year }).format('MMMM YYYY')
    }

    return {
      commodityData,
      monthYearText,
      noHeader_,
    }
  },
})
</script>

<template>
  <Card>
    <template v-if="!noHeader_" #title>
      {{ $t('marketwatch.commodities.futures') }}
    </template>
    <template #content>
      <Listbox class="list" :options="commodityData" option-label="name">
        <template #option="slotProps">
          <div>
            <span class="text-capitalize">{{
              monthYearText(slotProps.option.facets.month, slotProps.option.facets.year)
            }}</span>
            <MoneyFormat
              v-if="slotProps.option.price"
              class="float-end"
              :value="slotProps.option.price"
              :currency-code="slotProps.option.currency"
              per-unit="t"
            />
          </div>
        </template>
        <template #empty>
          {{ $t('marketwatch.commodities.noFutures') }}
        </template>
      </Listbox>
    </template>
  </Card>
</template>
