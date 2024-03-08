<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useSelectedStore } from '~~/stores/selected'
import { PerformanceLevel } from '~/composables/usePerformanceData'
import useFetchData from '@/composables/useFetchData'
import { useRouter } from '#imports'

export default defineComponent({
  props: {
    level: {
      default: PerformanceLevel.Crop,
      type: String as PropType<PerformanceLevel>,
    },
    set: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 'analytics', // analytics, tracker, budgets
      type: String,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selected = useSelectedStore()
    const router = useRouter()

    const variables = ref({
      cropId: selected.crop?.id,
      fieldId: selected.field?.id,
      groupId: selected.group?.id,
      type: props.type,
      varietyId: selected.variety?.id,
    })

    const type = computed(() => {
      return props.type
    })

    watchEffect(() => {
      variables.value = {
        cropId: selected.crop?.id,
        fieldId: selected.field?.id,
        groupId: selected.group?.id,
        type: type.value,
        varietyId: selected.variety?.id,
      }
    })

    const harvestYearData = ref(null)

    const { fetchedData, fetchData } = useFetchData('api/fms/harvest-years');

    (async () => {
      await fetchData()
      harvestYearData.value = fetchedData.value
    })()

    /* Format the options from the returned data */
    const options = computed(() => {
      if (type.value == 'tracker') {
        const yearData = {
          years: [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
          default_year: 2023,
        }
        return yearData.years.map((year) => {
          return {
            label: year,
            value: year,
          }
        })
      }
      else {
        if (!harvestYearData.value)
          return []

        // Crops filter
        const cropsData = harvestYearData.value.years.filter(year =>
          year.crops.some(crop => crop.name === selected.selected_crop?.name),
        )

        // Varieties filter
        const varietiesData = cropsData.filter(year =>
          year.varieties.some(variety => variety.name === selected.selected_variety?.name),
        )

        // Fields filter
        const fieldsData = []
        harvestYearData.value.years.forEach((year) => {
          const filteredFieldID = year.fields.find(field => field.name === selected.selected_field?.name)?.field_id
          year.fields.forEach((field) => {
            if (field.field_id === filteredFieldID) {
              fieldsData.push({
                harvest_year: year.harvest_year,
                fields: field,
              })
            }
          })
        })

        let yearData
        let labelAddition = ''

        if (selected.selected_crop) {
          yearData = cropsData
          labelAddition = `- ${selected.selected_crop.name}`

          if (selected.selected_variety) {
            yearData = varietiesData
            labelAddition = `- ${selected.selected_variety.name}`

            if (selected.selected_field) {
              yearData = fieldsData
              labelAddition = `- ${selected.selected_field.name}`
            }
          }
        }
        else {
          yearData = harvestYearData.value.years
        }

        /* Sort the dates first */
        yearData.sort((a, b) => b.harvest_year - a.harvest_year)

        /* Then map them to the new structure required */
        const reformattedData = yearData.map((option) => {
          return {
            label: `${option.harvest_year} ${
              selected.selected_field ? `- ${option.fields.variety.crop.name}` : ''
            } ${labelAddition}`,
            value: option.fields?.id || option.harvest_year,
          }
        })
        return reformattedData
      }
    })

    const emitValue = (newValue) => {
      if (!selected.selected_field) {
        emit('update:modelValue', newValue)
        selected.setYear(Number(newValue))
        return
      }

      let selectedHarvestYear
      const routeParams = []
      harvestYearData.value.years.forEach((year) => {
        year.fields.forEach((field) => {
          if (field.id === newValue) {
            selectedHarvestYear = year.harvest_year
            routeParams.push(field)
          }
        })
      })

      if (routeParams) {
        const cropID = routeParams[0].variety.crop.id
        const varietyID = routeParams[0].variety.id
        const fieldID = routeParams[0].id
        const pathNavNames = router.currentRoute.value.name.split('-')
        router.push(`/analytics/${pathNavNames[1]}/crop/${cropID}/variety/${varietyID}/field/${fieldID}`)
      }

      emit('update:modelValue', newValue)
      selected.setYear(Number(selectedHarvestYear))
    }

    const selectedVModel = computed(() => {
      return selected.selected_field?.id || selected.selected_year
    })

    return {
      emitValue,
      options,
      selected,
      harvestYearData,
      selectedVModel,
    }
  },
})
</script>

<template>
  <YSelect
    v-model="selectedVModel"
    :searchable="true"
    :close-on-select="true"
    :can-clear="false"
    :options="options"
    :placeholder="$t('general.selectOne')"
    class="text-capitalize"
    @update:model-value="emitValue($event)"
  />
</template>
