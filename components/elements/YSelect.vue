<script script="ts">
import { computed, defineComponent, ref } from 'vue'
import Multiselect from '@vueform/multiselect'

export default defineComponent({
  components: { Multiselect },
  props: {
    options: {
      required: true,
      type: Array,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectOptions = computed(() => props.options)
    const value = ref('')
    const emitValue = (newValue) => {
      emit('update:modelValue', newValue)
    }
    return {
      emitValue,
      selectOptions,
      value,
    }
  },
})
</script>

<template>
  <Multiselect v-model="value" :options="selectOptions" :can-clear="false" @input="emitValue($event)" />
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
