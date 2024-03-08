<!-- ConfirmModal
  A general confirmation modal. A wrapper around the normal YModal with
  an OK and Cancel setup.

  See YModal for more docs.
 -->
<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import YButton from '../elements/YButton.vue'
import YModal from '../elements/YModal.vue'

export default defineComponent({
  components: { YButton, YModal },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['open', 'close', 'toggle', 'confirm'],
  setup(props, { emit }) {
    const { t } = useI18n()

    function confirm() {
      emit('confirm')
    }

    function close() {
      emit('close')
    }

    return { t, confirm, close }
  },
})
</script>

<template>
  <YModal :show="show">
    <template #header>
      <h2>
        <slot name="header" />
      </h2>
    </template>

    <template #body>
      <slot name="body" />
    </template>

    <template #footer>
      <slot name="footer">
        <YButton type="dark-grey" class="mx-2" @click="close">
          {{ t('general.cancel') }}
        </YButton>
      </slot>
      <slot name="footer">
        <YButton @click="confirm">
          {{ t('general.ok') }}
        </YButton>
      </slot>
    </template>
  </YModal>
</template>
