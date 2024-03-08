import { render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import MagicLogo from '../../magic/MagicLogo.vue'

describe('magicLogo.vue', () => {
  it('logo renders', () => {
    const { container } = render(MagicLogo, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    expect(container.firstChild).toBeVisible()
  })
  it('yagro logo by default', () => {
    const { getByAltText } = render(MagicLogo, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    expect(getByAltText('Yagro Logo')).toHaveAttribute('src', '/img/yagro-logo.png')
  })
  it('partner logo rendered when partnerId changes', () => {
    const pinia = createTestingPinia({
      initialState: {
        selected: {
          selected_partner_id: 'kws',
        },
      },
    })
    const { getByAltText } = render(MagicLogo, {
      global: {
        plugins: [pinia],
      },
    })

    expect(getByAltText('KWS Logo')).toBeVisible()
    expect(getByAltText('KWS Logo')).toHaveAttribute('src', '/img/kws-logo.png')
  })
})
