<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useSelectedStore } from '~~/stores/selected'
import useFetchData from '~~/composables/useFetchData'

export default defineComponent({
  props: {
    allOption: {
      default: false,
      type: Boolean,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selected = useSelectedStore()
    const emitValue = (newValue) => {
      emit('update:modelValue', newValue)
    }
    const crops = ref(null)

    crops.value = null
    const { fetchedData: data } = useFetchData('api/fms/applied-product/52/crop')

    watch(data, (newVal: any) => {
      if (newVal) {
        if (props.allOption)
          newVal.push({ id: -1, name: 'All crops' })
        crops.value = newVal
      }
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
    v-model="selected.selected_crop"
    :options="options"
    :searchable="true"
    :can-clear="false"
    placeholder="Select a crop"
    @update:model-value="emitValue($event)"
  />
</template>
