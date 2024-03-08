import { render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import MagicBackground from '~/components/magic/MagicBackground.vue'

const i18n = createI18n({})

describe('yBackground.vue', () => {
  it('background renders', () => {
    const { container } = render(MagicBackground, {
      global: {
        plugins: [createTestingPinia(), i18n],
      },
    })
    expect(container.firstChild).toBeVisible()
  })
  it('yagro background by default', () => {
    const { getByAltText } = render(MagicBackground, {
      global: {
        plugins: [createTestingPinia(), i18n],
      },
    })
    expect(getByAltText('Yagro Background')).toHaveAttribute('src', '/img/yagro-background.jpg')
  })
  it('partner background rendered when partnerId changes', () => {
    const pinia = createTestingPinia({
      initialState: {
        selected: {
          selected_partner_id: 'kws',
        },
      },
    })
    const { getByAltText } = render(MagicBackground, {
      global: {
        plugins: [pinia, i18n],
      },
    })

    expect(getByAltText('KWS Background')).toBeVisible()
    expect(getByAltText('KWS Background')).toHaveAttribute('src', '/img/kws-background.jpg')
  })
})
