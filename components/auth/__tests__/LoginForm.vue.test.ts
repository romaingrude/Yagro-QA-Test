import { render } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { createTestingPinia } from '@pinia/testing'
import { VILLUS_CLIENT, createClient } from 'villus'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import LoginForm from '../LoginForm.vue'

describe('login.vue', () => {
  it.skip('form renders', () => {
    const i18n = createI18n({
      // vue-i18n options here ...
    })
    const { getByPlaceholderText } = render(LoginForm, {
      global: {
        config: {
          compilerOptions: {
            isCustomElement: tag => ['font-awesome-icon', 'Button'].includes(tag),
          },
        },
        plugins: [createTestingPinia(), i18n, PrimeVue, ToastService],
        provide: {
          [VILLUS_CLIENT as symbol]: createClient({
            url: 'http://test/graphql',
          }),
        },
      },
    })
    expect(getByPlaceholderText('login.email'))
    expect(getByPlaceholderText('login.password'))
  })
})
