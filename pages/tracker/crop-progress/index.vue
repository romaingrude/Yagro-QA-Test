<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onBeforeMount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { definePageMeta } from '#imports'
import { useSelectedStore } from '~~/stores/selected'
import CropProgressSummaryCard from '~/components/tracker/crop-progress/CropProgressSummaryCard.vue'
import HarvestYearSelect from '~/components/core/harvestYearSelect.vue'
import TrackerCropProgressTable from '~/components/tracker/crop-progress/CropProgressTable.vue'
import YButton from '~/components/elements/YButton.vue'
import useFetchData from '~/composables/useFetchData'

export default defineComponent({
  components: {
    CropProgressSummaryCard,
    HarvestYearSelect,
    TrackerCropProgressTable,
    YButton,
  },
  setup() {
    definePageMeta({
      weight: 35,
    })
    const selected = useSelectedStore()

    onBeforeMount(() => {
      selected.clearSelected(['crop', 'variety', 'field'])
    })
    const { t } = useI18n()

    // Fetching data
    const harvestYears = ref([])
    const crops = ref([])
    const production = ref([])
    const costs = ref([])

    const fetchData = function () {
      // Clear previous data
      harvestYears.value = []

      const { fetchedData: fetchedHarvestYears } = useFetchData(`fms/harvests/${selected.year}`, {
        component: getCurrentInstance().type.name,
      })

      watch(fetchedHarvestYears, (newValue) => {
        if (newValue) {
          harvestYears.value = newValue
          crops.value = []
          production.value = []
          crops.value = []

          // Fetching data for each crop
          newValue.crops.map(async (crop) => {
            let path = `fms/harvests/fields/yearId=${selected.year}&cropId=${crop.id}`
            if (selected.year == 2023)
              path += `&includeExpected=true`

            const { fetchedData: fetchedCrops } = useFetchData(path)
            const { fetchedData: fetchedProduction } = useFetchData(
              `api/business-tracker/${selected.year}/crops/${crop.id}/production`,
            )
            const { fetchedData: fetchedCosts } = useFetchData(
              `fms/applications/fields/yearId=${selected.year}&cropId=${crop.id}`,
            )

            watch(fetchedCrops, (newValue) => {
              if (newValue && Object.keys(newValue).length)
                crops.value.push(Object({ ...newValue, crop: crop.id }))
            })

            watch(fetchedProduction, (newValue) => {
              if (newValue)
                production.value.push(Object({ ...newValue, crop: crop.id }))
            })

            watch(fetchedCosts, (newValue) => {
              if (newValue)
                costs.value.push(Object({ cost: newValue.cost, crop: crop.id }))
            })
          })
        }
      })
    }

    watch(
      () => selected.year,
      (current, prev) => {
        if (current != prev && current)
          fetchData()
      },
      { immediate: true },
    )

    const harvestYearsData = computed(() => {
      if (!harvestYears.value)
        return null
      return harvestYears.value
    })

    const cropsData = computed(() => {
      if (!crops.value && !crops.value.length)
        return null
      return crops.value
    })

    const productionData = computed(() => {
      if (!production.value && !production.value.length)
        return null
      return production.value
    })

    const costsData = computed(() => {
      if (!costs.value && !costs.value.length)
        return null
      return costs.value
    })

    const allCropsData = computed(() => {
      if (!cropsData.value || !productionData.value || !costsData.value)
        return []
      const mergedData = cropsData.value.map(t1 => ({
        ...t1,
        ...productionData.value.find(t2 => t2.crop === t1.crop),
      }))
      return mergedData.map(t1 => ({ ...t1, ...costsData.value.find(t2 => t2.crop === t1.crop) }))
    })

    // DISPLAY
    const state = reactive({ allCropsData, display: 'table' })
    const switchDisplay = (newDisplay: string) => {
      state.display = newDisplay
    }

    return {
      selected,
      state,
      switchDisplay,
      allCropsData,
      harvestYearsData,
      cropsData,
      t,
    }
  },
})
</script>

<template>
  <div>
    <Html>
      <Head>
        <Title>
          {{ $t('config.tabTitle', { brand: selected.partnerCompany }) }} - {{ $t('feature.analytics') }}
          {{ $t('feature.cropProgress') }}
        </Title>
      </Head>
    </Html>
    <div class="container content">
      <div class="d-flex justify-content-between">
        <div class="flex-fill">
          <h1 class="mb-3 text-capitalize">
            {{ $t('tracker.trackerTitle') }}
          </h1>
        </div>
        <div class="w-25">
          <HarvestYearSelect type="tracker" />
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <div class="align-items-end">
          <h2 class="mb-4">
            {{ t('feature.cropProgress') }}
          </h2>
        </div>
        <div class="align-items-end">
          <div class="btn-group align-items-end">
            <YButton :is-active="state.display == 'table'" class="text-capitalize" @click="switchDisplay('table')">
              {{ t('general.table') }}
            </YButton>
            <YButton :is-active="state.display == 'grid'" class="text-capitalize" @click="switchDisplay('grid')">
              {{ t('general.grid') }}
            </YButton>
          </div>
        </div>
      </div>
      <div v-if="state.display == 'grid'" class="row">
        <div v-for="crop in allCropsData" :key="`${crop.crops[0].id}-row`" class="col-md-6 mb-3">
          <CropProgressSummaryCard key="summary_card_" :crop="crop" />
        </div>
        <p v-if="!allCropsData.length" class="font-italic mb-0">
          {{ $t('dataTable.emptyTable') }}
        </p>
      </div>
      <div v-if="state.display == 'table'" class="row">
        <TrackerCropProgressTable :crops="allCropsData" />
      </div>
    </div>
  </div>
</template>

<style></style>
