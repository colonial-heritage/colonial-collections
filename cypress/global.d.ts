declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-test attribute.
     * @example cy.getBySel('greeting')
     */
    getBySel(
      dataTestAttribute: string,
      args?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Chainable<JQuery<HTMLElement>>;
  }
}
