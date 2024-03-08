import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import YAlert from '../YAlert.vue'

const i18n = createI18n({})

const options = {
  global: {
    plugins: [i18n],
  },
  props: {
    id: 'test-id',
    title: 'Test Alert',
    text: 'This is a test alert',
    mode: 'info',
    isDismissible: true,
    autoDismiss: false,
  },
}
describe('yAlert.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(YAlert, options)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders the alert with the correct structure and content', () => {
    expect(wrapper.find('.y-alert__title').text()).toBe('Test Alert')
    expect(wrapper.find('.y-alert__text').html()).toContain('This is a test alert')
    expect(wrapper.find('.y-alert--info').exists()).toBe(true)
    expect(wrapper.find('.y-alert__close').exists()).toBe(true)
  })

  it('closes the alert when the close button is clicked', async () => {
    const closeButton = wrapper.find('.y-alert__close')
    closeButton.trigger('click')
    await nextTick()
    expect(wrapper.vm.isVisible).toBe(false)
  })

  it('emits the close event when the close button is clicked', async () => {
    const closeButton = wrapper.find('.y-alert__close')
    closeButton.trigger('click')
    await nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')[0]).toEqual(['test-id'])
  })

  it('renders the alert with custom mode and changes class', async () => {
    wrapper.setProps({ mode: 'success' })
    await nextTick()
    expect(wrapper.find('.y-alert--success').exists()).toBe(true)
  })

  it('renders the alert with custom primaryAction and secondaryAction slots', async () => {
    const slotWrapper = mount(YAlert, {
      global: {
        plugins: [i18n],
      },
      props: {
        id: 'test-id',
        title: 'Test Alert',
      },
      slots: {
        primaryAction: '<button>Primary</button>',
        secondaryAction: '<button>Secondary</button>',
      },
    })

    expect(slotWrapper.find('.y-alert__list-item--primary').exists()).toBe(true)
    expect(slotWrapper.find('.y-alert__list-item--secondary').exists()).toBe(true)
  })

  it('auto-dismisses the alert when autoDismiss is set to true', async () => {
    options.props.autoDismiss = true
    const wrapper = mount(YAlert, options)
    const timeoutId = setTimeout(() => {}, 7500)
    await new Promise(resolve => setTimeout(resolve, 7500))
    clearTimeout(timeoutId) // Clear the timeout to prevent it from firing again

    expect(wrapper.vm.isVisible).toBe(false)
  }, 8000)

  it('renders the alert with a custom autoDismissTime', async () => {
    options.props.autoDismiss = true
    options.props.autoDismissTime = 3000
    const wrapper = mount(YAlert, options)

    const timeoutId = setTimeout(() => {}, 3500)
    await new Promise(resolve => setTimeout(resolve, 3500))
    clearTimeout(timeoutId) // Clear the timeout to prevent it from firing again

    expect(wrapper.vm.isVisible).toBe(false)
  }, 4000)
})
