import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import YBreadcrumbs from '../YBreadcrumbs.vue'

describe('breadcrumbs.vue', () => {
  it('renders items in order', () => {
    const propItems = [{ label: 'A' }, { label: 'B' }, { label: 'C' }]
    const wrapper = mount(YBreadcrumbs, {
      props: {
        items: propItems,
      },
    })
    expect(wrapper.findAll('li').at(0).text()).toBe('A')
    expect(wrapper.findAll('li').at(1).text()).toBe('B')
    expect(wrapper.findAll('li').at(2).text()).toBe('C')
  })
  it('last item has active class', () => {
    const propItems = [{ label: 'A' }, { label: 'B' }, { label: 'C' }]
    const wrapper = mount(YBreadcrumbs, {
      props: {
        items: propItems,
      },
    })
    expect(wrapper.findAll('li').at(0).classes()).not.toContain('active')
    expect(wrapper.findAll('li').at(1).classes()).not.toContain('active')
    expect(wrapper.findAll('li').at(2).classes()).toContain('active')
  })
  it('on click functions work', () => {
    const fn = vi.fn()
    const propItems = [{ label: 'A', onClick: fn }]
    const wrapper = mount(YBreadcrumbs, {
      props: {
        items: propItems,
      },
    })
    expect(fn).toHaveBeenCalledTimes(0)
    wrapper.findAll('li').at(0).trigger('click')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
