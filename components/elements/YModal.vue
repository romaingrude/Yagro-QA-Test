<!--
-------------------------------------------------------------------------------
A Generic modal
-------------------------------------------------------------------------------
Description
This is a wrapper for the PrimeVue Dialog component.
It is controlled via a prop called show, which is a boolean.
When the modal is closed, it emits a close event.
-------------------------------------------------------------------------------
Usage
<YModal
  :show="displayModal"
  @close="handleClose"
>
  <template #header>
    Example Title
  </template>

  <template #body>
    Body Content
  </template>

</YModal>
-------------------------------------------------------------------------------
Props
- show: Boolean
  - Whether the modal is visible or not.
-------------------------------------------------------------------------------
Slots
- header: String
  - The header of the modal.
- body: String
  - The body of the modal.
- footer: String
  - The footer of the modal.
-------------------------------------------------------------------------------
Emits
- close: Function
  - Emits a close event when the modal is closed.
-------------------------------------------------------------------------------
-->

<script lang="ts">
import { defineComponent } from 'vue'
import Dialog from 'primevue/dialog'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { Dialog },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['open', 'close', 'toggle'],
  setup(props, { emit }) {
    /* Translation */
    const { t } = useI18n()

    /* Methods */
    function close() {
      emit('close')
    }

    return { t, close }
  },
})
</script>

<template>
  <Dialog
    :style="{ width: 'max-content' }"
    :breakpoints="{ '1441px': '55vw', '1024px': '80vw' }"
    :visible="show"
    :modal="true"
    :dismissable-mask="true"
    :close-on-escape="true"
    class="dialog"
    @update:visible="close"
  >
    <template #header>
      <h2>
        <slot name="header" />
      </h2>
    </template>

    <slot name="body" />

    <template #footer>
      <slot name="footer">
        <YButton @click="close">
          {{ t('modal.close') }}
        </YButton>
      </slot>
    </template>
  </Dialog>
</template>
