<script lang="ts">
import { useQuery } from 'villus'
import { computed, defineComponent } from 'vue'
import { useSelectedStore } from '~~/stores/selected'

export default defineComponent({
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const selected = useSelectedStore()
    const emitValue = (newValue) => {
      emit('update:modelValue', newValue)
    }
    const getGroups = `
query getGroups {
    getGroups {
     id
     name
    }
}`
    const { data } = useQuery({ query: getGroups })
    const options = computed(() => {
      if (!data.value)
        return []
      if (!('getGroups' in data.value))
        return []
      return data.value.getGroups.map((item) => {
        return { label: item.name, value: item }
      })
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
  <YSelect v-model="selected.selected_group" :options="options" @update:model-value="emitValue($event)" />
</template>
