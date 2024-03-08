import { render } from '@testing-library/vue'
import YSelect from '../YSelect.vue'

describe('ySelect.vue', () => {
  it('select renders', () => {
    const { container } = render(YSelect, {
      props: {
        options: [],
      },
    })
    expect(container.firstChild).toBeVisible()
  })
  it('all options from props are listed', () => {
    const { getByText } = render(YSelect, {
      props: {
        options: ['Option A', 'Option B', 'Option C'],
      },
    })
    expect(getByText('Option A'))
    expect(getByText('Option B'))
    expect(getByText('Option C'))
  })
  it.todo('selecting an option changes the value')
})
