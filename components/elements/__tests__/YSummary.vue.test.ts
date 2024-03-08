import { render } from '@testing-library/vue'
import YSummary from '../YSummary.vue'

describe('ySummary.vue', () => {
  it('summary renders', () => {
    const { container } = render(YSummary, {
      props: {
        columns: [1, 3],
        rows: 2,
      },
    })
    expect(container.firstChild).toBeVisible()
  })
  it('renders correct number of rows and columns', () => {
    const { container } = render(YSummary, {
      props: {
        columns: [1, 3],
        rows: 2,
      },
    })
    expect(container.getElementsByClassName('row').length).toBe(2)
    expect(container.getElementsByClassName('col-md').length).toBe(4)
  })
  it('slot content is displayed in correct box', () => {
    const { getByText } = render(YSummary, {
      props: {
        columns: [1, 3],
        rows: 2,
      },
      slots: {
        '1_1': '<p>Slot 1 - 1</p>',
        '2_1': '<p>Slot 2 - 1</p>',
        '2_2': '<p>Slot 2 - 2</p>',
        '2_3': '<p>Slot 2 - 3</p>',
      },
    })
    expect(getByText('Slot 1 - 1')).toBeVisible()
    expect(getByText('Slot 2 - 1')).toBeVisible()
    expect(getByText('Slot 2 - 2')).toBeVisible()
    expect(getByText('Slot 2 - 3')).toBeVisible()
  })
})
