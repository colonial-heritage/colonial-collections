/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getBySel('greeting')
     */
    getBySel(
      dataTestAttribute: string,
      args?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Chainable<JQuery<HTMLElement>>;
    /**
     * Custom command to sign out.
     * @example cy.signOut()
     */
    signOut(): Chainable<void>;
    /**
     * Custom command to sign in.
     * @example cy.signIn()
     */
    signIn(): Chainable<void>;
  }

  interface ApplicationWindow {
    Clerk: {
      isReady: () => boolean;
      client: {
        signIn: {
          create: (params: {
            identifier: string;
            password: string;
          }) => Promise<{createdSessionId: string}>;
        };
      };
      setActive: (params: {session: string}) => Promise<void>;
    };
  }
}
