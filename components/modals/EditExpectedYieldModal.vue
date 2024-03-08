<script>
import { ref, toRef, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from 'nuxt/app'
import YButton from '../elements/YButton.vue'
import { useFetchData } from '~/.nuxt/imports'

export default {
  components: { Dialog, YButton, InputNumber },
  props: {
    show: { type: Boolean, required: true, default: false },
    year: { type: Number, required: true },
    crop: { type: Object, required: true },
    inputYield: { type: Object, required: true },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const nuxtApp = useNuxtApp()

    const showEditModal = toRef(props, 'show')
    const year = toRef(props, 'year')
    const crop = toRef(props, 'crop')
    const inputYield = toRef(props, 'inputYield')
    let yieldInfo = ref({ ...inputYield.value })
    const isVarietyPreferred = ref(false)

    const closeModal = () => {
      emit('close')
      yieldInfo = ref({ ...inputYield.value })
    }

    const saveModal = () => {
      emit('close')
      yieldInfo = ref({ ...inputYield.value })
      nuxtApp.$Yalert.addAlert({
        title: t('demo.dnsTitle'),
        text: t('demo.dataNotSaved'),
        isDismissible: false,
        autoDismiss: true,
      })
    }

    const prepareAvgYieldData = () => {
      const cropDetails = []
      const varietyIds = inputYield.value.varieties.map(el => el.id)
      const varietyYields = { total: {}, number: {} }

      for (let i = 1; i <= 3; i++) {
        const harvestYear = year.value - i
        const { fetchedData: yieldData } = useFetchData(
          `api/fields/harvest-years/${harvestYear}/crops/${crop.value.id}`,
        )

        watch(yieldData, (newValue) => {
          if (newValue)
            cropDetails.push(newValue)

          for (const cd of cropDetails) {
            for (const v of cd.yield.varieties.filter(el => varietyIds.includes(el.id))) {
              varietyYields.total[v.id] = Number(varietyYields.total[v.id] || 0) + Number(v.magnitude)
              varietyYields.number[v.id] = (varietyYields.number[v.id] || 0) + 1
            }
          }

          yieldInfo.value.magnitude
            = cropDetails.reduce((acc, el) => acc + Number(el.yield.magnitude), 0) / cropDetails.length

          for (const id of varietyIds) {
            if (Object.keys(varietyYields.total).includes(String(id))) {
              yieldInfo.value.varieties.filter(el => el.id === id)[0].magnitude
                = varietyYields.total[id] / varietyYields.number[id]
            }
          }
        })
      }

      nuxtApp.$Yalert.addAlert({
        title: 'Ready!',
        text: 'Your yield was calculated using your historical data.',
        mode: 'success',
        isDismissible: true,
        autoDismiss: true,
      })
    }

    const totalVarietyYield = computed(
      () =>
        yieldInfo.value.varieties.reduce((acc, el) => acc + Number(el.magnitude), 0) / yieldInfo.value.varieties.length,
    )

    return {
      showEditModal,
      yieldInfo,
      isVarietyPreferred,
      closeModal,
      saveModal,
      prepareAvgYieldData,
      totalVarietyYield,
    }
  },
}
</script>

<template>
  <div>
    <Dialog :visible="showEditModal" class="dialog col-3" :modal="true" @update:visible="closeModal">
      <template #header>
        <h4 class="my-sm-2 ms-3 text-white">
          Edit your expected yield
        </h4>
      </template>
      <div class="field col-12 md:col-4">
        <label class="text-capitalize" for="crop-yield">{{ crop.name }}:</label>
        <div class="p-inputgroup">
          <InputNumber
            v-if="isVarietyPreferred"
            id="crop-yield"
            v-model="totalVarietyYield"
            class="input mt-2"
            show-buttons
            increment-button-class="p-button-secondary"
            decrement-button-class="p-button-secondary"
            placeholder="Enter yield"
            :disabled="isVarietyPreferred"
          />
          <InputNumber
            v-else
            id="crop-yield"
            v-model="yieldInfo.magnitude"
            class="input mt-2"
            show-buttons
            increment-button-class="p-button-secondary"
            decrement-button-class="p-button-secondary"
            placeholder="Enter yield"
            :disabled="isVarietyPreferred"
          />
          <span class="p-inputgroup-addon mt-2">t/ha</span>
        </div>
      </div>
      <hr>
      <div class="field col-12 md:col-4">
        <input v-model="isVarietyPreferred" type="checkbox">
        <span>Estimate specific yields</span>
      </div>
      <div v-if="isVarietyPreferred">
        <div v-for="v in yieldInfo.varieties" :key="v.id" class="field col-12 md:col-4 d-flex w-100">
          <label class="text-capitalize w-50 mt-3" :for="`variety-yield-${v.id}`">{{ v.name }}:</label>
          <div class="p-inputgroup">
            <InputNumber
              :id="`variety-yield-${v.id}`"
              v-model="v.magnitude"
              class="input mt-2 w-50"
              show-buttons
              increment-button-class="p-button-secondary"
              decrement-button-class="p-button-secondary"
              placeholder="Enter yield"
            />
            <span class="p-inputgroup-addon mt-2">t/ha</span>
          </div>
        </div>
      </div>
      <div class="field col-12 md:col-4 mt-3">
        <YButton type="primary" @click="prepareAvgYieldData">
          Set values based on your 3-year average
        </YButton>
      </div>
      <template #footer>
        <YButton type="primary" @click="saveModal">
          Update
        </YButton>
      </template>
    </Dialog>
  </div>
</template>
