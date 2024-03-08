<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    max: Number,
    min: Number,
    showSpreadBar: {
      default: true,
      type: Boolean,
    },
    spreadMax: Number,
    spreadMin: Number,
    value: Number,
    valuePrefix: {
      default: null,
      type: String,
    },
  },

  setup(props) {
    const bulletValue = computed(() => props.value)
    const barMin = computed(() => props.min)
    const barMax = computed(() => props.max)
    const barSpreadMin = computed(() => props.spreadMin)
    const barSpreadMax = computed(() => props.spreadMax)
    const barShowSpreadBar = computed(() => props.showSpreadBar)
    const { t } = useI18n()
    const bulletValuePrefix = computed(() => props.valuePrefix ?? t('general.yourFarmAvg'))
    const spreadValPercentage = computed(() => {
      const fullRange = barMax.value - barMin.value
      return fullRange == 0
        ? 50
        : bulletValue.value === undefined
          ? undefined
          : Math.min(100, 100 * ((bulletValue.value - barMin.value) / fullRange))
    })

    const spreadMinPercentage = computed(() => {
      const fullRange = barMax.value - barMin.value
      return barSpreadMin.value === undefined ? undefined : 100 * ((barSpreadMin.value - barMin.value) / fullRange)
    })
    const spreadMaxPercentage = computed(() => {
      const fullRange = barMax.value - barMin.value
      return barSpreadMax.value === undefined ? undefined : 100 * ((barSpreadMax.value - barMin.value) / fullRange)
    })
    const indicatorCompensateForEnds = computed(() => {
      return spreadValPercentage.value < 1 ? '- 4px' : '- 6px'
    })
    return {
      barMax,
      barMin,
      barShowSpreadBar,
      barSpreadMax,
      barSpreadMin,
      bulletValue,
      bulletValuePrefix,
      indicatorCompensateForEnds,
      spreadMaxPercentage,
      spreadMinPercentage,
      spreadValPercentage,
    }
  },
})
</script>

<template>
  <div class="bullet-bar">
    <div
      v-if="barShowSpreadBar && barSpreadMin !== undefined"
      class="indicator indicator-min"
      :style="`left: ${spreadMinPercentage}%;`"
    />

    <div
      v-if="spreadValPercentage !== undefined && bulletValue !== 0"
      class="indicator"
      :style="`left: calc(${spreadValPercentage <= 0 ? 0 : spreadValPercentage}% ${indicatorCompensateForEnds});`"
    />

    <div
      v-if="barShowSpreadBar && barSpreadMax !== undefined"
      class="indicator indicator-max"
      :style="`left: ${spreadMaxPercentage}%;`"
    />

    <div class="min" :style="`background-color: ${spreadValPercentage == 0 ? '#006838' : '#cac8cb'};`" />

    <div class="max" :style="`background-color: ${spreadValPercentage == 100 ? '#006838' : '#cac8cb'};`" />

    <div class="base">
      <div
        v-if="barShowSpreadBar"
        class="score"
        :style="`left: ${spreadMinPercentage}%; width: ${spreadMaxPercentage - spreadMinPercentage}%;`"
      />
    </div>

    <div class="tooltip" :style="`left: calc(${spreadValPercentage}% ${indicatorCompensateForEnds} - 85px);`">
      <div v-if="barSpreadMin !== undefined">
        <span>Min:</span>
        <slot name="formatter" :data="barSpreadMin">
          {{ barSpreadMin }}
        </slot>
      </div>

      <div v-if="bulletValue !== undefined && bulletValue !== 0">
        <span>{{ bulletValuePrefix }}:</span>
        <slot name="formatter" :data="bulletValue">
          {{ bulletValue }}
        </slot>
        <slot name="tooltip-extra" />
      </div>

      <div v-if="barSpreadMax !== undefined">
        <span>Max:</span>
        <slot name="formatter" :data="barSpreadMax">
          {{ barSpreadMax }}
        </slot>
      </div>
    </div>

    <div class="legend">
      <div>
        <slot name="formatter" :data="barMin">
          {{ barMin }}
        </slot>
      </div>

      <div>
        <slot name="formatter" :data="max">
          {{ max }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.bullet-bar {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 2px 0 5px;
  position: relative;

  &:hover .tooltip {
    display: block;
    opacity: 1;
  }

  .indicator {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 12px solid #006838;
    content: '';
    height: 0;
    position: absolute;
    top: -6px;
    width: 0;
    z-index: 5;
  }

  .indicator-min {
    background-color: #8dc63f;
    height: 6px;
    top: 2px;
  }

  .indicator-max {
    background-color: #bc4213;
    height: 6px;
    top: 2px;
  }

  .min,
  .max {
    background-color: #cac8cb;
    content: '';
    height: 8px;
    position: absolute;
    width: 2px;
    z-index: 1;
    top: 2px;
  }

  .min {
    left: 0;
  }

  .max {
    right: 0;
  }

  .benchmark {
    color: #006838;
    font-family:
      Avenir Next W06 Medium,
      AvenirNextLTW01-Medium,
      Helvetica,
      Arial,
      sans-serif;
    line-height: 1;
    position: absolute;
    top: 0;
    transform: translate3d(-50%, 15px, 0);
    z-index: 3;
  }

  .tooltip {
    animation: bubble-3Ql2Y;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
    color: #006838;
    font-family:
      Avenir Next W06 Demi,
      Avenir Next LT W01 Demi,
      Helvetica,
      Arial,
      sans-serif;
    font-size: 11px;
    line-height: 1;
    padding: 10px 15px;

    display: none;
    opacity: 0;

    position: absolute;
    bottom: -50%;
    z-index: 5;

    & > div {
      text-align: left;
    }
  }

  .base {
    background-color: #cac8cb;
    height: 4px;
    position: relative;
    width: 100%;
  }

  .below .score {
    background-color: #ffddcf;
    box-shadow: 3px 0 0 0 #f50;
  }

  .score {
    background-color: #ebe5ca;
    border-radius: 5px 0 0 5px;
    z-index: 1;
  }

  .benchmark,
  .score {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
  }

  .legend {
    align-items: center;
    color: #909da0;
    display: flex;
    font-size: 75%;
    line-height: 1;
    margin-top: 5px;
    width: 100%;
  }

  .legend div {
    flex: 1;
  }

  .legend div:last-child {
    text-align: right;
  }
}
</style>
