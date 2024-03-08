<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import YTooltip from '../../../components/elements/YTooltip.vue'

export default defineComponent({
  components: { YTooltip },
  props: {
    params: {
      required: false,
      type: Object as PropType<ICellRendererParams>,
      default: () => {
        Object()
      },
    },
  },
  setup(props) {
    const localePath = p => p
    const value = computed(() => props.params.value)
    const isEdit = computed(() => props.params.edit)
    const isDelete = computed(() => props.params.delete)
    const title = computed(() => props.params.title)

    const editRow = () => {
      props.params.context.editRow(props.params.data)
    }

    const deleteRow = () => {
      props.params.context.deleteRow(props.params.data)
    }

    return {
      deleteRow,
      editRow,
      isDelete,
      isEdit,
      localePath,
      title,
      value,
    }
  },
})
</script>

<template>
  <div>
    <YTooltip v-if="isEdit" id="edit-tip" class="px-2" placement="top">
      <font-awesome-icon :icon="['far', 'pencil']" class="link-style" size="lg" @click="editRow()" />
      <template #content>
        <span class="text-capitalize y-tool-tip-action">{{ $t('general.editBudget') }} {{ title }}</span>
      </template>
    </YTooltip>

    <YTooltip v-if="isDelete" class="px-2" placement="top">
      <font-awesome-icon :icon="['far', 'trash']" class="link-style" size="lg" @click="deleteRow()" />
      <template #content>
        <span class="text-capitalize y-tool-tip-action">{{ $t('general.deleteBudget') }} {{ title }}</span>
      </template>
    </YTooltip>
  </div>
</template>

<style>
.y-tool-tip-action {
  font-size: 0.75rem;
}
</style>
