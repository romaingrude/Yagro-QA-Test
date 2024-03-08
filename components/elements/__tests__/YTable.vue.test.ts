import { render } from '@testing-library/vue'
import YTable from '../YTable.vue'

describe('yTable.vue', () => {
  it('table renders', () => {
    const { container, getByText } = render(YTable, {
      props: {
        columns: [{ key: 'col1', name: 'Col 1' }],
        items: [{ col1: 'Test' }],
      },
      slots: {
        col1: '<template #col1={data}><p>{{data.col1}}</p></template>',
      },
    })
    expect(container.firstChild).toBeVisible()
    expect(getByText('Test')).toBeVisible()
  })
  it('renders correct number of rows and columns', () => {
    const { getAllByRole } = render(YTable, {
      props: {
        columns: [{ key: 'col1', name: 'Col 1' }],
        items: [{ col1: 'Test' }],
      },
      slots: {
        col1: '<template #col1={data}><p>{{data.col1}}</p></template>',
      },
    })
    expect(getAllByRole('row').length).toBe(2) // column heading & content
    expect(getAllByRole('cell').length).toBe(2)
  })
  it('number of rows follows the perPage prop', () => {
    const { getAllByRole } = render(YTable, {
      props: {
        columns: [{ key: 'col1', name: 'Col 1' }],
        items: [{ col1: 'This Page' }, { col1: 'Next Page' }],
        perPage: 1,
        withPaging: true,
      },
      slots: {
        col1: '<template #col1="{data}"><p>{{data.col1}}</p></template>',
      },
    })
    expect(getAllByRole('row').length).toBe(2) // column heading & content
    expect(getAllByRole('cell').length).toBe(2)
  })
  it('displays pagination bar when withPaging prop is set', () => {
    const { container } = render(YTable, {
      props: {
        columns: [{ key: 'col1', name: 'Col 1' }],
        items: [{ col1: 'This Page' }, { col1: 'Next Page' }],
        withPaging: true,
      },
      slots: {
        col1: '<template #col1="{data}"><p>{{data.col1}}</p></template>',
      },
    })
    expect(container.getElementsByClassName('p-paginator').length).toBe(1) // column heading & content
  })
})
