<script lang="ts">
import { computed, defineComponent } from 'vue'
import Dialog from 'primevue/dialog'

// import { useI18n } from 'vue-i18n';
import TrackerContractsTable from '~/components/tracker/crop-progress/details/TrackerContractsTable.vue'
import TrackerSalesTable from '~/components/tracker/crop-progress/details/TrackerSalesTable.vue'
import YButton from '~/components/elements/YButton.vue'
import YTab from '~/components/elements/YTab.vue'
import { useSelectedStore } from '~/stores/selected'

export default defineComponent({
  components: { Dialog, TrackerContractsTable, TrackerSalesTable, YButton, YTab },
  props: {
    show: {
      default: false,
      required: true,
      type: Boolean,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    // const { t } = useI18n();
    const selected = useSelectedStore()
    const panelTabs = [
      { key: 'contracts', name: 'Contracts' },
      { key: 'sales', name: 'Sales' },
    ]

    const isShow = computed(() => {
      return props.show
    })

    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal,
      isShow,
      panelTabs,
      selected,
    }
  },
})
</script>

<template>
  <div>
    <Dialog :style="{ width: '75vw' }" :visible="isShow" class="dialog" :modal="true" @update:visible="closeModal">
      <template #header>
        <h4 class="my-sm-2 ms-3 text-white">
          <span class="text-capitalize">{{ selected.crop.name }} </span> {{ $t('tracker.salesContracts') }} in
          {{ selected.year }}
        </h4>
      </template>
      <YTab :tabs="panelTabs">
        <template #contracts>
          <TrackerContractsTable />
        </template>
        <template #sales>
          <TrackerSalesTable />
        </template>
      </YTab>
      <template #footer>
        <YButton style="margin-right: 0.5rem" class="text-nowrap" type="dark-grey" @click="closeModal">
          {{
            $t('general.cancel')
          }}
        </YButton>
        <YButton class="text-nowrap" type="primary" @click="closeModal">
          {{ $t('general.ok') }}
        </YButton>
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss">
.dialog {
  .p-dialog-header {
    background-color: var(--primary-colour);
    padding: 10px;
  }
}
</style>
