import { render } from '@testing-library/vue'
import YSimpleTable from '../YSimpleTable.vue'

describe('ySimpleTable.vue', () => {
  it('table renders', () => {
    const { container } = render(YSimpleTable, {
      props: {
        columns: [{ name: 'col1' }],
        items: [],
      },
    })
    expect(container.firstChild).toBeVisible()
  })
  it.todo('table displays data from columns & items props')
})
