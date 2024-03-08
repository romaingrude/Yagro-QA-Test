import { render } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'

import YBulletBar from '../YBulletBar.vue'

const i18n = createI18n({})
describe('yBulletBar.vue', () => {
  it('bullet-bar renders', () => {
    const { container } = render(YBulletBar, {
      global: {
        plugins: [i18n],
      },
    })
    expect(container.firstChild).toBeVisible()
  })

  it('bullet-bar shows value indicator', () => {
    const { container } = render(YBulletBar, {
      global: {
        plugins: [i18n],
      },
      props: {
        max: 2,
        min: 0,
        spreadMax: 2,
        spreadMin: 0,
        value: 1,
      },
    })

    // Test middle indicator is half way between bullet bar
    expect(container.getElementsByClassName('indicator')[0])
    expect(container.getElementsByClassName('indicator')[1]).toHaveAttribute('style', 'left: calc(50% - 6px);')
    expect(container.getElementsByClassName('indicator')[2])
  })
})
