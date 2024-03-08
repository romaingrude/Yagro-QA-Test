/**
 * This does a rough job of imitating the Bootstrap popover.
 * It is not a full implementation.
 * - Note: This is not a Vue component, and is not reactive.
 */

export function usePopover() {
  /* Selectors */
  const selectors = {
    target: '[data-toggle="popover"]',
    className: 'y-popover',
  }

  /* Elements */
  const elements = {
    popovers: document.querySelectorAll(selectors.target),
  }

  /**
   * Adds a popover to the DOM.
   * @param {object} event - the event object
   * @param {object} popover - the popover element
   */
  function activatePopover(event, popover) {
    deactivatePopovers()

    const content = popover.querySelector('.hidden').innerHTML

    const container = document.createElement('div')

    container.className = selectors.className
    container.innerHTML = content
    container.style.left = `${event.pageX - 150 / 2}px`
    container.style.top = `${event.pageY - 60}px`

    document.body.appendChild(container)
  }

  /**
   * Finds all popovers and removes them.
   */
  function deactivatePopovers() {
    document.querySelectorAll(`.${selectors.className}`).forEach((elem) => {
      elem.remove()
    })
  }

  /**
   * Sets event listeners on elements.
   *
   */
  function setEventListeners() {
    if (elements.popovers) {
      elements.popovers.forEach((popover) => {
        popover.addEventListener('mouseover', (event) => {
          activatePopover(event, popover)
        })
        popover.addEventListener('mouseout', () => {
          deactivatePopovers()
        })
      })
    }
  }

  function setup() {
    setEventListeners()
  }
  setup()
}
