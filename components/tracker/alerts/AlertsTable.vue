<script lang="ts">
import { computed, defineComponent, provide, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from 'nuxt/app'
import YButton from '~~/components/elements/YButton.vue'
import YTable from '~~/components/elements/YTable.vue'
import useFetchData from '~~/composables/useFetchData'

// import YAlert from '~~/components/elements/YAlert.vue';
// import YTab from '~~/components/elements/YTab.vue';

export default defineComponent({
  components: {
    YButton,
    YTable,
    // YTab,
    Dialog,
  },
  props: {
    noAddButton: {
      default: false,
      required: false,
      type: Boolean,
    },
    selectedCommodity: {
      default: null,
      required: false,
      type: String,
    },
  },

  setup(props) {
    const { t } = useI18n()
    const nuxtApp = useNuxtApp()
    const noAddButton_ = computed(() => props.noAddButton)
    // const selectedCommodity_ = computed(() => props.selectedCommodity);
    const showEditModal = ref(false)
    const showDeleteModal = ref(false)
    const editModalTitle = ref('') // t('marketwatch.alerts.edit')
    const deleteModalTitle = ref('Delete') // t('marketwatch.alerts.delete')
    const editModalText = ref('')
    const deleteModalText = ref('Are you sure you want to delete this alert?') // t('marketwatch.alerts.deleteAlertConfirmation')
    const editModalActiveAlertee = ref('')
    const editModalActiveProduct = ref('')
    const editModalActiveFacet = ref('')
    const editModalActiveAlertOn = ref('')
    const editModalValueThreshold = ref(null)

    const loading = ref(false)
    provide('loading', loading)

    const alertsTableColumns = [
      { key: 'product', name: 'Product', sortable: false },
      { key: 'criteria', name: 'Criteria', sortable: false, unformatted: true },
      { key: 'recipient', name: 'Recipient', sortable: false, unformatted: true },
      { key: 'actions', name: 'Actions', sortable: false },
    ]

    interface alertData {
      product: string
      symbol: string
      facet: string
      alertOn: string
      value: number
      recipient: string
      criteria?: string
    }

    interface fetchedAlert {
      product: string
      symbol: string
      facets: {
        month: number
        year: number
      }
      alert_on: string
      threshold_price: number
      recipient_identifier: number
    }

    const alertsData = ref([])
    const commoditiesMap = ref([])
    const { fetchedData: fetchedCommodities } = useFetchData('pricing/commodities')

    const tranformCommodities = (commoditiesArray) => {
      const map = {}
      commoditiesArray?.forEach((commodity) => {
        map[commodity.id] = commodity.name
      })
      return map
    }

    watch(fetchedCommodities, (newVal) => {
      if (!newVal)
        return
      commoditiesMap.value = tranformCommodities(newVal)

      const { fetchedData: fetchedAlerts } = useFetchData('pricing/alerts')

      const months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
      }

      const reformatAlertsData = (data: Array<fetchedAlert>) => {
        const reformattedData: Array<alertData> = data?.map((alert: fetchedAlert) => {
          return {
            product: commoditiesMap.value?.[alert.product],
            symbol: alert.symbol,
            facet: `${months[alert.facets?.month]} ${alert.facets?.year}`,
            alertOn: alert.alert_on === 'greater_than' ? 'rises above' : 'drops below',
            value: alert.threshold_price,
            recipient: alert.recipient_identifier % 2 === 0 ? 'John Doe' : 'Jane Doe',
            criteria: `${alert.alert_on === 'greater_than' ? 'rises above' : 'drops below'} £${
              alert.threshold_price
            } / t`,
          }
        })
        return reformattedData
      }

      watch(fetchedAlerts, (newVal) => {
        if (!newVal)
          return

        const formattednewVal = reformatAlertsData(newVal)
        alertsData.value = formattednewVal
      })
    })

    const editModalTabs = [
      { key: 'absoluteValues', name: 'Absolute Values' },
      { key: 'percentageChange', name: 'Percentage Change', disabled: true },
      { key: 'historicMinMax', name: 'Historic Min/Max', disabled: true },
    ]

    const editModalAlertOptions = ['John Doe', 'Jane Doe', 'John Smith']
    const editModalAlertOnOptions = ['drops below', 'rises above']
    const editModalFacetOptions = [
      'nearby',
      'July 2023',
      'November 2023',
      'January 2024',
      'March 2024',
      'May 2024',
      'July 2024',
      'November 2024',
      'January 2025',
      'March 2025',
      'May 2025',
    ]

    const createEditModal = (data: alertData) => {
      showEditModal.value = true
      editModalActiveProduct.value = data.product.split('(')[0]
      editModalTitle.value = `Set alert for ${editModalActiveProduct.value}`
      editModalActiveAlertee.value = data.recipient
      editModalActiveFacet.value = editModalFacetOptions.includes(data.facet) ? data.facet : editModalFacetOptions[0]
      editModalActiveAlertOn.value = data.alertOn
      editModalValueThreshold.value = `${data.value}`
    }

    const confirmEdit = () => {
      showEditModal.value = false
      nuxtApp.$Yalert.addAlert({
        title: t('demo.dnsTitle'),
        text: t('demo.dataNotSaved'),
        isDismissible: false,
        autoDismiss: true,
      })
    }

    const confirmDelete = () => {
      showDeleteModal.value = false
      nuxtApp.$Yalert.addAlert({
        title: t('demo.dndTitle'),
        text: t('demo.dataNotDeleted'),
        isDismissible: false,
        autoDismiss: true,
      })
    }

    return {
      noAddButton_,
      showEditModal,
      showDeleteModal,
      editModalTitle,
      deleteModalTitle,
      editModalText,
      deleteModalText,
      editModalActiveAlertee,
      editModalActiveProduct,
      alertsTableColumns,
      alertsData,
      editModalTabs,
      editModalActiveFacet,
      editModalActiveAlertOn,
      editModalAlertOptions,
      editModalAlertOnOptions,
      editModalFacetOptions,
      editModalValueThreshold,
      createEditModal,
      confirmEdit,
      confirmDelete,
    }
  },
})
</script>

<template>
  <div>
    <YTable :columns="alertsTableColumns" :items="alertsData" class="mb-5">
      <template #product="{ data }">
        <a href="commodities/commodity/LW">{{ `${data.product} (${data.facet})` }}</a>
      </template>
      <template #criteria />
      <template #recipient />
      <template #actions="{ data }">
        <YButton type="outline-primary me-2" @click="createEditModal(data)">
          Edit
        </YButton>
        <YButton type="outline-danger" @click="showDeleteModal = true">
          Delete
        </YButton>
      </template>
    </YTable>
    <YAlert id="alert-info" mode="info" title="Adding new alerts" :is-dismissible="false">
      <template #text>
        <span>
          {{ $t('marketwatch.alerts.addNewAlertByFindingAnItem') }}
          <!-- eslint-disable -->
          <a href="product-list">{{ $t('marketwatch.menu.productCatalogue') }}</a
          >,
          <a href="inputs">{{ $t('marketwatch.menu.inputs') }}</a>
          {{ $t('marketwatch.alerts.orFrom') }}
          <a href="commodities">{{ $t('marketwatch.menu.commodities') }}</a
          >.
          <!-- eslint-enable -->
        </span>
      </template>
    </YAlert>

    <Dialog :visible="showEditModal" class="dialog col-7" :modal="true" @update:visible="showEditModal = false">
      <template #header>
        <h4 class="my-sm-2 ms-3 text-white">
          {{ editModalTitle }}
        </h4>
      </template>
      <div class="pb-4">
        <YAlert
          id="editModalInfo"
          mode="info"
          :is-dismissible="false"
          :title="$t('marketwatch.alerts.commodityPricesEndOfDayAlert')"
        />
        <YTab :tabs="editModalTabs" class="mb-5 pb-5 pt-2">
          <template #absoluteValues>
            Alert
            <YSelect :model-value="editModalActiveAlertee" :options="editModalAlertOptions" class="mb-4" />
            When the price of {{ editModalActiveProduct }}
            <div class="d-flex">
              <YSelect
                :model-value="editModalActiveFacet"
                :options="editModalFacetOptions"
                placeholder="Facet"
                class="me-2"
              />
              <YSelect
                :model-value="editModalActiveAlertOn"
                :options="editModalAlertOnOptions"
                placeholder="Action"
                class="me-2"
              />
              <div class="d-flex w-100">
                <span class="input-group-text no-br-right border-end-0 bg-white">£</span>
                <input
                  v-model="editModalValueThreshold"
                  type="number"
                  class="form-control rounded-0"
                  placeholder="Value"
                >
                <span class="input-group-text no-br-left border-start-0 bg-white">/ t</span>
              </div>
            </div>
          </template>
          <template #percentageChange />
          <template #historicMinMax />
        </YTab>
      </div>
      <template #footer>
        <YButton type="primary" @click="confirmEdit()">
          Save
        </YButton>
      </template>
    </Dialog>

    <Dialog :visible="showDeleteModal" class="dialog col-3" :modal="true" @update:visible="showDeleteModal = false">
      <template #header>
        <h4 class="my-sm-2 ms-3 text-white">
          {{ deleteModalTitle }}
        </h4>
      </template>
      <div>
        <p>{{ deleteModalText }}</p>
      </div>
      <template #footer>
        <YButton type="dark-grey me-2" @click="showDeleteModal = false">
          Cancel
        </YButton>
        <YButton type="primary" @click="confirmDelete()">
          OK
        </YButton>
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.no-br-right {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.no-br-left {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
