<script>
import { computed, defineComponent, toRef } from 'vue'
import Dialog from 'primevue/dialog'

export default defineComponent({
  components: { Dialog },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    modalHeader: {
      type: String,
      required: false,
    },
    farmValue: {
      type: Number,
      required: false,
    },
    min: {
      type: Number,
      required: false,
    },
    max: {
      type: Number,
      required: false,
    },
    median: {
      type: Number,
      required: false,
    },
    percentile25: {
      type: Number,
      required: false,
    },
    percentile75: {
      type: Number,
      required: false,
    },
    inverseRange: {
      type: Boolean,
      default: false,
    },
    productUnit: {
      type: String,
      required: false,
    },
  },
  emits: ['close'],

  setup(props, { emit }) {
    const isShow = toRef(props, 'show')

    /* Computed values */
    const canDisplay = computed(() => {
      return props.percentile25 != props.percentile75
    })

    const whiskerLow = computed(() => {
      return Math.max(props.min, props.percentile25 - 1.5 * (props.percentile75 - props.percentile25))
    })

    const whiskerHigh = computed(() => {
      return Math.min(props.max, props.percentile75 + 1.5 * (props.percentile75 - props.percentile25))
    })

    /* Methods */
    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal,
      isShow,
      canDisplay,
      whiskerLow,
      whiskerHigh,
    }
  },
})
</script>

<template>
  <Dialog
    :visible="isShow"
    :modal="true"
    :dismissable-mask="true"
    :style="{ width: '75vw' }"
    class="dialog"
    @update:visible="closeModal"
  >
    <template #header>
      <h2 class="p-dialog__title">
        <slot name="header" />
      </h2>
    </template>

    <slot name="body">
      <box-plot
        :min="min"
        :max="max"
        :median="median"
        :percentile25="percentile25"
        :percentile75="percentile75"
        :inverse-range="inverseRange"
        :can-display="canDisplay"
        :unit="productUnit"
        @close="closeModal('detail')"
        @cancel="closeModal('detail')"
      >
        <template #numberFormat="slotProps">
          <slot name="numberFormat" :value="slotProps.value" />
        </template>
      </box-plot>

      <div class="y-bullet-bar-container">
        <y-bullet-bar :value="farmValue" :min="Number(min)" :max="Number(max)">
          <template #formatter="bar">
            <slot name="numberFormat" :value="bar.data" />
          </template>
        </y-bullet-bar>
      </div>

      <div v-if="canDisplay" id="boxplot-legend">
        <div class="row">
          <div class="col-md-4 d-flex">
            <div style="width: 5px; height: 20px; margin-right: 0.5em; background-color: #1fa187" />
            <div>
              Minimum (excluding outliers):
              <slot name="numberFormat" :value="whiskerLow" />
              <info-tooltip
                v-if="(whiskerLow === 0.0) | (whiskerLow === 0)"
                kind="free_product"
                title="Affect on market range"
              />
            </div>
          </div>
          <div class="col-md-4 d-flex">
            <div
              style="width: 5px; height: 20px; margin-right: 0.5em"
              :style="{ 'background-color': inverseRange ? '#f44335' : '#0a6839' }"
            />
            <div>
              25th Percentile (Q1):
              <slot name="numberFormat" :value="percentile25" />
            </div>
          </div>
          <div class="col-md-4 d-flex">
            <div style="width: 5px; height: 20px; margin-right: 0.5em; background-color: #ffc106" />
            <div>
              Median:
              <slot name="numberFormat" :value="median" />
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-4 d-flex">
            <div
              style="width: 5px; height: 20px; margin-right: 0.5em"
              :style="{ 'background-color': inverseRange ? '#0a6839' : '#f44335' }"
            />
            <div>
              75th Percentile (Q3):
              <slot name="numberFormat" :value="percentile75" />
            </div>
          </div>
          <div class="col-md-4 d-flex">
            <div style="width: 5px; height: 20px; margin-right: 0.5em; background-color: #1fa187" />
            <div>
              Maximum (excluding outliers):
              <slot name="numberFormat" :value="whiskerHigh" />
            </div>
          </div>
          <div v-if="farmValue" class="col-md-4 d-flex">
            <div style="width: 5px; margin-right: 0.5em">
              <div class="indicator" />
            </div>
            <div>
              Your farm average:
              <slot name="numberFormat" :value="farmValue" />
            </div>
          </div>
        </div>
      </div>
    </slot>

    <template #footer>
      <slot name="footer">
        <yButton @click="closeModal">
          Close
        </yButton>
      </slot>
    </template>
  </Dialog>
</template>

<style>
#boxplot-legend {
  border: 2px solid var(--color-dove-grey);
  padding: 2rem;
  margin-top: 2rem;
}

.y-bullet-bar-container {
  margin-top: 2rem;
}

.indicator {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 12px solid #006838;
  content: '';
  height: 0;
  width: 0;
}
</style>
