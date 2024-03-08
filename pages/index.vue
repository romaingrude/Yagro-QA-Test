<script>
import { useI18n } from 'vue-i18n'
import { useSelectedStore } from '~/stores/selected'
import FarmDashboard from '~/components/dashboard/FarmDashboard.vue'
import WelcomeMessage from '~/components/dashboard/WelcomeMessage.vue'

export default {
  components: {
    FarmDashboard,
    WelcomeMessage,
  },

  setup() {
    const { t } = useI18n()
    const selected = useSelectedStore()

    return {
      selected,
      t,
    }
  },
}
</script>

<template>
  <div>
    <Html>
      <Head>
        <Title>{{ $t('config.tabTitle', { brand: selected.partnerCompany }) }} - {{ t('dashboard.dashboard') }}</Title>
      </Head>
    </Html>
    <div class="container">
      <WelcomeMessage />
      <FarmDashboard />
    </div>
  </div>
</template>
