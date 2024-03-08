<script>
import { defineComponent } from 'vue'
import YButton from '~/components/elements/YButton'

export default defineComponent({
  components: { YButton },
  emits: ['add', 'edit'],

  setup(props, { emit }) {
    const showAddModal = () => {
      emit('add')
    }

    const showEditModal = () => {
      emit('edit')
    }

    return { showAddModal, showEditModal }
  },
})
</script>

<template>
  <YButton type="tertiary" @click="showAddModal()">
    <font-awesome-icon class="icon-color mr-2" :icon="['far', 'plus']" />{{ $t('budgets.addBudgets') }}
  </YButton>
</template>

<style lang="scss" scoped>
.button {
  &:hover {
    cursor: pointer;
  }
}

.mr-2 {
  margin-right: 0.5rem !important;
}
</style>
