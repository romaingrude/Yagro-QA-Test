import { fireEvent } from '@testing-library/dom'
import { render, waitFor } from '@testing-library/vue'
import YPopover from '../YPopover.vue'

describe('yPopover.vue', () => {
  it('target element is rendered', () => {
    const { getByText } = render(YPopover, {
      slots: {
        default: '<button>Click me</button>',
      },
    })
    expect(getByText('Click me')).toBeVisible()
  })
  it('popover content is rendered', () => {
    const { getByText } = render(YPopover, {
      slots: {
        content: '<p>Test popover</p>',
        default: '<button>Click me</button>',
      },
    })
    expect(getByText('Test popover')).toBeInTheDocument()
  })
  it('popover content with header is rendered', () => {
    const { getByText } = render(YPopover, {
      slots: {
        content: '<p>Test popover</p>',
        default: '<button>Click me</button>',
        header: '<p>Test header</p>',
      },
    })
    expect(getByText('Test header')).toBeInTheDocument()
  })

  // Can't seem to get tests working for hovering over popovers will need to come back to it
  it.todo('tooltip with only content renders on hover', async () => {
    const { getByText, debug } = render(YPopover, {
      slots: {
        content: '<p>Popover text</p>',
        default: '<button>Click me</button>',
      },
    })
    expect(getByText('Popover text')).not.toBeVisible()
    const targetElement = getByText('Click me')
    debug()
    fireEvent.mouseOver(targetElement)
    await waitFor(() => {
      expect(getByText('Popover text')).toBeInTheDocument()
    })
  })
})
