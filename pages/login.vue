<script setup>
import MagicLogo from '../components/magic/MagicLogo'
import MagicBackground from '../components/magic/MagicBackground'
import LoginForm from '~/components/auth/LoginForm'
import { useSelectedStore } from '~~/stores/selected'
import { onMounted, useRoute } from '#imports'

const route = useRoute()
const selected = useSelectedStore()

definePageMeta({
  layout: 'unauthorized',
})

function getYear() {
  return new Date().getFullYear()
}

onMounted(() => {
  if (!selected.partnerId)
    selected.setPartnerId(route.query.partner_id ? route.query.partner_id : 'yagro')
})
</script>

<template>
  <div>
    <Html>
      <Head>
        <Title>{{ $t('config.tabTitle', { brand: selected.partnerCompany }) }} - {{ $t('login.logIn') }}</Title>
      </Head>
    </Html>

    <div class="d-flex min-vh-100">
      <div class="login-wrapper d-flex flex-column px-3 w-100">
        <div class="login d-flex flex-column flex-grow-1 py-3 mx-auto w-100">
          <div class="flex-grow-1 d-flex flex-column justify-content-center">
            <div class="login-logo">
              <MagicLogo />
            </div>

            <h3 id='title'>
              {{ $t('login.yourYagroPlatform', { brand: selected.partnerCompany }) }} -
              {{ $t('general.siteName') }}
            </h3>
            <LoginForm />
          </div>
          <p class="copyright">
            © {{ getYear() }} - YAGRO Ltd.
          </p>
        </div>
      </div>

      <div class="d-none d-md-block position-relative flex-fill">
        <MagicBackground />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-wrapper {
  @media (min-width: 768px) {
    flex: 0 0 50%;
    max-width: 50%;
  }

  @media (min-width: 992px) {
    flex: 0 0 41.66667%;
    max-width: 41.66667%;
  }

  @media (min-width: 1200px) {
    flex: 0 0 33.33333%;
    max-width: 33.33333%;
  }
}

.login {
  max-width: 480px;
}

.login-logo {
  max-height: 30%;
  overflow: hidden;
}
</style>
