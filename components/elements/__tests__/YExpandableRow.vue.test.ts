import { fireEvent } from '@testing-library/dom'
import { render } from '@testing-library/vue'
import YExpandableRow from '../YExpandableRow.vue'

describe('yExpandableRow.vue', () => {
  it('identifier is passed through props', () => {
    const { container } = render(YExpandableRow, {
      props: {
        identifier: 'primary',
      },
    })
    expect(container.querySelector('#collapseContent-primary')).toBeTruthy()
  })
  it('expandable header is visible', () => {
    const { getByText } = render(YExpandableRow, {
      props: {
        identifier: 'primary',
      },
      slots: {
        'expandable-header': '<p>Expand me</p>',
      },
    })
    expect(getByText('Expand me')).toBeVisible()
  })
  it.todo('clicking the arrow icon expands the row', async () => {
    const { getByText, container, debug, screen } = render(YExpandableRow, {
      props: {
        identifier: 'primary',
      },
      slots: {
        'expanded-content': '<div><p>Hidden content</p></div>',
      },
    })
    debug()
    const arrowButton = container.getElementsByClassName('arrow-icon')[0]
    expect(getByText('Hidden content')).not.toHaveClass('show')

    fireEvent.click(arrowButton)
    await screen.findByText('Hidden content')
  })
})
