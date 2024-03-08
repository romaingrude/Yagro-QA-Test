import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import YAgGrid from '~/components/elements/YAgGrid.vue'

const i18n = createI18n({})
describe('yAgGrid.vue', () => {
  it('renders items in order', () => {
    const rowData = [
      { location: 'Cambridge', name: 'Downing Farm' },
      { location: 'London', name: 'Euston Farm' },
    ]
    const columnDefs = [
      { field: 'name', headerName: 'Farm Name' },
      { field: 'location', headerName: 'Location' },
    ]
    const wrapper = mount(YAgGrid, {
      global: {
        plugins: [i18n],
      },
      props: {
        columnDefs,
        pagination: true,
        paginationPageSize: 10,
        rowData,
      },
    })

    const cols = wrapper.findAll('.ag-header-cell-label')
    expect(cols.length).toEqual(2)
    expect(cols.at(0).text()).toEqual('Farm Name')
    expect(cols.at(1).text()).toEqual('Location')

    const cells = wrapper.findAll('.ag-cell-value')
    expect(cells.length).toEqual(4)
    expect(cells.at(0).text()).toEqual('Downing Farm')
    expect(cells.at(1).text()).toEqual('Cambridge')
    expect(cells.at(2).text()).toEqual('Euston Farm')
    expect(cells.at(3).text()).toEqual('London')

    expect(wrapper.find('.pagination').isVisible()).toBe(true)
    expect(wrapper.find('#to-first').attributes().disabled).toBeDefined()
    expect(wrapper.find('#to-previous').attributes().disabled).toBeDefined()
    expect(wrapper.find('#to-next').attributes().disabled).toBeDefined()
    expect(wrapper.find('#to-last').attributes().disabled).toBeDefined()
    expect(wrapper.find('#current').text()).toBe('1')
  })
})
