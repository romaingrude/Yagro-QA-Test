import { useQuery } from 'villus'
import { ref, watchEffect } from 'vue'
import { useSelectedStore } from '~~/stores/selected'

export enum PerformanceLevel {
  Crop = 'Crop',
  Variety = 'Variety',
  Field = 'Field',
}

export function usePerformanceData(level: PerformanceLevel, queryFields: string, allYears = false) {
  // Selected Store
  const selected = useSelectedStore()
  // FETCH DATA
  const getPerformances = `
query Get${level}Performance($filters: ${level}PerformanceFilter) {
  get${level}Performance(filters: $filters) {
    ${queryFields}
  }
}
`
  const defaultFilters = {
    cropId: null,
    groupId: null,
  }
  if (level == PerformanceLevel.Variety || level == PerformanceLevel.Field)
    defaultFilters.varietyId = null
  if (level == PerformanceLevel.Field)
    defaultFilters.fieldId = null
  if (!allYears)
    defaultFilters.year = null
  const variables = ref({
    filters: defaultFilters,
  })

  watchEffect(() => {
    const filters = {
      cropId: selected.crop?.id,
      groupId: selected.group?.id,
    }
    if (level == PerformanceLevel.Variety || level == PerformanceLevel.Field)
      filters.varietyId = selected.variety?.id
    if (level == PerformanceLevel.Field)
      filters.fieldId = selected.field?.id
    if (!allYears)
      filters.year = selected.year
    variables.value = {
      filters,
    }
  })

  return useQuery({ query: getPerformances, variables })
}
