<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useSelectedStore } from '~~/stores/selected'
import useFetchData from '~~/composables/useFetchData'

export default defineComponent({
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const selected = useSelectedStore()
    const emitValue = (newValue) => {
      emit('update:modelValue', newValue)
    }

    const fields = ref(null)

    fields.value = null
    const { fetchedData: data } = useFetchData('api/fms/applied-product/52/field')

    watch(data, (newVal: any) => {
      if (newVal)
        fields.value = newVal
    })

    const options = computed(() => {
      if (!data?.value)
        return []
      return data.value
        .map((item) => {
          return { label: item.name, value: item }
        })
        .sort((a, b) => a.label.localeCompare(b.label))
    })

    return {
      emitValue,
      options,
      selected,
    }
  },
})
</script>

<template>
  <YSelect
    v-model="selected.selected_field"
    :options="options"
    :searchable="true"
    :can-clear="false"
    placeholder="Select a Field"
    @update:model-value="emitValue($event)"
  />
</template>
