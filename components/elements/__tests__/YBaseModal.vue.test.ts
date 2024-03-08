import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import YBaseModal from '../YBaseModal.vue'

describe('yBaseModal.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(YBaseModal, {
      propsData: {
        show: true,
        title: 'Test Modal',
        footerDisplay: true,
      },
      slots: {
        content: '<button>Test Content</button>',
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders the alert with the correct structure and content', () => {
    expect(wrapper.find('.y-modal-close').exists()).toBe(true)
    expect(wrapper.find('.y-modal-title').text()).toBe('Test Modal')
    expect(wrapper.find('.y-modal-content').text()).toBe('Test Content')
    expect(wrapper.find('#primary-button').text()).toBe('Cancel')
    expect(wrapper.find('#secondary-button').text()).toBe('Save')
  })

  it('render the modal with custom text on buttons', async () => {
    wrapper.setProps({ secondaryButtonText: 'Send', primaryButtonText: 'Close' })
    await nextTick()
    expect(wrapper.find('#primary-button').text()).toBe('Close')
    expect(wrapper.find('#secondary-button').text()).toBe('Send')
  })

  it('render the modal only with close button', async () => {
    wrapper.setProps({ isInfo: true })
    await nextTick()
    expect(wrapper.find('#primary-button').text()).toBe('Cancel')
    expect(wrapper.find('#secondary-button').exists()).toBe(false)
  })

  it('render the modal without footer', async () => {
    wrapper.setProps({ footerDisplay: false })
    await nextTick()
    expect(wrapper.find('#primary-button').exists()).toBe(false)
    expect(wrapper.find('#secondary-button').exists()).toBe(false)
  })

  it('render the modal with scrollbar', async () => {
    const slotWrapper = mount(YBaseModal, {
      propsData: {
        show: true,
        title: 'Test Modal',
        withScrollBar: true,
      },
      slots: {
        content: `<p>Lorem ipsumobis sed nesciunt neque possimus molestiaemobis sed nesciunt neque possimus molestiaemobis sed nesciunt neque possimus molestiaemobis sed nes</p>`,
      },
    })
    expect(slotWrapper.find('.y-modal-content-scrollbar').exists()).toBe(true)
  })
})
