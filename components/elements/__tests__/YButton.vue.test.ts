import { mount } from '@vue/test-utils'
import YButton from '../YButton.vue'

describe('button.vue', () => {
  it('button contains content in slot', () => {
    const wrapper = mount(YButton, {
      slots: {
        default: 'Main Content',
      },
    })
    expect(wrapper.find('button').text()).toBe('Main Content')
  })
  it('button type is passed through props', () => {
    const wrapper = mount(YButton, {
      props: {
        type: 'primary',
      },
    })
    expect(wrapper.find('button').classes()).toContain('btn-primary')
  })
})
