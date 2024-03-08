<script lang="ts">
import { useMutation } from 'villus'
import { useI18n } from 'vue-i18n'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '~~/stores/user'
import { useSelectedStore } from '~~/stores/selected'
import { useNuxtApp } from '#imports'

export default defineComponent({
  components: { Toast },
  setup() {
    const { $posthog } = useNuxtApp()
    const router = useRouter()
    const { t } = useI18n()
    const toast = useToast()
    // LOGIN FORM
    const email = ref('')
    const password = ref('')

    // AUTH
    const loginRequest = `
     mutation LoginUser($input: LoginInput!) {
      loginUser (input: $input) {
        auth_token
        refresh_token
        user {
          email
          roles
          partnerId
        }
        group {
          id
          name
          uuid
        }
      }
    }
    `
    const { execute } = useMutation(loginRequest)

    const user = useUserStore()
    const selected = useSelectedStore()

    const attemptLogin = async () => {
      const response = await execute({
        input: {
          email: email.value,
          password: password.value,
        },
      })
        .then(
          
              rawResponse => rawResponse
          )
        .catch((error) => {
          console.error(error)
          toast.add({
            detail: 'We could not log you in with those credentials.',
            life: 3000,
            severity: 'error',
            summary: 'Login Failed',
          })
        })

       if (response.error) {
            toast.add({
            detail: 'We could not log you in with those credentials.',
            life: 30000,
            severity: 'error',
            summary: 'Login Failed',
              })
              console.error('Authentication Failed')
            }
        

      if (response.data.loginUser.user.roles.some(r => ['YAGRO_ENG_ADMIN', 'YAGRO_ADMIN'].includes(r)))
        user.setAdmin(true)
      else
        user.setAdmin(false)

      user.setUser({
        auth_token: response.data.loginUser.auth_token,
        email: response.data.loginUser.user.email,
        refresh_token: response.data.loginUser.refresh_token,
      })
      user.setGroup(response.data.loginUser.group)
      selected.setGroup(response.data.loginUser.group)
      selected.setPartnerId(response.data.loginUser.user.partnerId)
      selected.setNotificationStatus({ virtualGroupPageNotification: false }) // If showed, make it true
      if ($posthog)
        $posthog.identify(response.data.loginUser.user.id)
      console.log(response.data.loginUser)
      router.push({ path: '/' })
    }

    return {
      attemptLogin,
      email,
      password,
      t,
    }
  },
})
</script>

<template>
  <div>
    <form class="mb-5">
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="i-fa6-solid-at h-4 w-4" />
            </span>
          </div>

          <input
            id="emailInput"
            v-model="email"
            data-cy="emailInput"
            type="email"
            class="form-control"
            :placeholder="t('login.email')"
            autocomplete="email"
            @keyup.enter="attemptLogin"
          >
        </div>
      </div>

      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="i-fa6-solid-key h-4 w-4" />
            </span>
          </div>

          <input
            id="passwordInput"
            v-model="password"
            data-cy="passwordInput"
            type="password"
            class="form-control"
            :placeholder="t('login.password')"
            autocomplete="current-password"
            @keyup.enter="attemptLogin"
          >
        </div>
      </div>

      <div class="form-group d-grid">
        <YButton
          data-cy="loginButton"
          @click="attemptLogin"
        >
          {{ t('login.logIn') }}
        </YButton>
      </div>
    </form>
    <Toast position="top-center" />
  </div>
</template>
