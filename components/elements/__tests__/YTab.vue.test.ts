import { render } from '@testing-library/vue'
import YTab from '../YTab.vue'

describe('yTab.vue', () => {
  it('correct number of tabs', () => {
    const { getAllByRole } = render(YTab, {
      props: {
        tabs: [
          { key: 'tab1', name: 'Tab 1' },
          { key: 'tab2', name: 'Tab 2' },
        ],
      },
    })
    expect(getAllByRole('tab').length).toBe(2)
  })

  it('correct columns and content of the tab', () => {
    const { getByText } = render(YTab, {
      props: {
        tabs: [
          { key: 'tab1', name: 'Tab 1' },
          { key: 'tab2', name: 'Tab 2' },
        ],
      },
      slots: {
        tab1: '<template #tab1><span>Content 1</span></template>',
        tab2: '<template #tab2><span>Content 2</span></template>',
      },
    })
    expect(getByText('Tab 1')).toBeInTheDocument()
    expect(getByText('Tab 2')).toBeInTheDocument()
    expect(getByText('Content 1')).toBeInTheDocument()
    expect(getByText('Content 2')).toBeInTheDocument()
  })
})
