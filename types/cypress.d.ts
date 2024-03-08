declare namespace Cypress {
  export interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    loginAs(account: string): Chainable<Element>
    startFrom(page: string): Chainable<Element>
  }
}
