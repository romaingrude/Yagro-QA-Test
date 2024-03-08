import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useSelectedStore } from '~~/stores/selected'
import { useNuxtApp } from '#imports'
export function useRouteParams() {
  // Selected Store
  const selected = useSelectedStore()
  const route = useRoute()
  const { $fetchData } = useNuxtApp()

  // Crops
  const cropId = computed(() => route.params.crop_id)

  const selectCropFromRouteParams = async (): Promise<void> => {
    if (!route.params?.crop_id) {
      selected.setCrop(null)
      return
    }
    if (selected.selected_crop?.id == route.params.crop_id)
      return
    selected.setCrop(await $fetchData(`api/crops/${cropId.value}`))
  }

  // Varieties
  const varietyId = computed(() => route.params.variety_id)

  const selectVarietyFromRouteParams = async (): Promise<void> => {
    if (!route.params?.variety_id) {
      selected.setVariety(null)
      return
    }
    if (selected.selected_variety?.id == route.params.variety_id)
      return
    selected.setVariety(await $fetchData(`api/varieties/${varietyId.value}`))
  }

  //   Fields
  const fieldId = computed(() => route.params.field_id)

  const selectFieldFromRouteParams = async (): Promise<void> => {
    if (!route.params?.field_id) {
      selected.setField(null)
      return
    }
    if (selected.selected_field?.id == route.params.field_id)
      return
    selected.setField(await $fetchData(`fms/fields/plants/${fieldId.value}`))
  }
  return {
    selectCropFromRouteParams,
    selectFieldFromRouteParams,
    selectVarietyFromRouteParams,
  }
}
