import { fireEvent } from '@testing-library/dom'
import { render, waitFor } from '@testing-library/vue'
import YTooltip from '../YTooltip.vue'

describe('yTooltip.vue', () => {
  it('target element is rendered', () => {
    const { getByText } = render(YTooltip, {
      slots: {
        default: '<button>Click me</button>',
      },
    })
    expect(getByText('Click me')).toBeVisible()
  })
  it('tooltip content is rendered', () => {
    const { getByText } = render(YTooltip, {
      slots: {
        content: '<p>Test popover</p>',
        default: '<button>Click me</button>',
      },
    })
    expect(getByText('Test popover')).toBeInTheDocument()
  })

  it.todo('tooltip renders on hover', async () => {
    const { getByText, debug } = render(YTooltip, {
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
