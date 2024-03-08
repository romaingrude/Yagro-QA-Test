<script lang="ts">
import { defineComponent, toRef } from 'vue'
import Dialog from 'primevue/dialog'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#imports'

export default defineComponent({
  components: { Dialog },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    group: {
      type: String,
      required: false,
      default: null,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const nuxtApp = useNuxtApp()
    const showUploadModal = toRef(props, 'show')
    const groupUuid = toRef(props, 'group')
    const filesData: Array<ArrayBuffer | string> = []

    const closeModal = () => {
      emit('close')
    }

    const saveModal = () => {
      emit('close')
      nuxtApp.$Yalert.addAlert({
        title: t('demo.dnsTitle'),
        text: t('demo.dataNotSaved'),
        isDismissible: false,
        autoDismiss: true,
      })
    }

    return { showUploadModal, groupUuid, filesData, closeModal, saveModal }
  },
})
</script>

<template>
  <div>
    <Dialog :visible="showUploadModal" class="dialog col-3" :modal="true" @update:visible="closeModal">
      <template #header>
        <h4 class="my-sm-2 ms-3 text-white">
          {{ $t('data.uploads.modalParts.title') }}
        </h4>
      </template>
      <div>
        <p v-for="i in $t('data.uploads.instructions').split('\n')" :key="i">
          {{ i }}
        </p>
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-3">{{ $t('data.uploads.modalParts.attachments') }}</label>
        <VueFileAgent
          v-model="filesData"
          v-validate
          name="file"
          :multiple="true"
          data-vv-rules="required"
          theme="list"
          :deletable="true"
          accept=".xls,.xlsx,.csv,.pdf,.jpeg,.jpg,.png,.parquet"
        />
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-3">{{ $t('data.uploads.modalParts.comments') }}</label>
        <textarea class="form-control text entry" rows="3 " />
      </div>
      <div class="flex-grow-1 d-flex flex-column justify-content-center mx-5 mb-5">
        <b-button class="btn btn-primary" size="lg" @click="saveModal">
          {{ $t('data.uploads.modalParts.send') }}
          <font-awesome-icon :icon="['far', 'paper-plane']" />
        </b-button>
      </div>
    </Dialog>
  </div>
</template>
