/// <reference types="cypress" />
// ***********************************************
// In commands.ts you can create
// various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

// Docs: https://clerk.com/docs/testing/cypress
Cypress.Commands.add('signIn', () => {
  cy.log('Signing in.');
  cy.visit('/en', {
    failOnStatusCode: false,
  });

  cy.window()
    .should(window => {
      expect(window).to.not.have.property('Clerk', undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async window => {
      cy.clearCookies({domain: window.location.host}).then(async () => {
        const res = await window.Clerk.client.signIn.create({
          identifier: Cypress.env('TEST_USER_EMAIL'),
          password: Cypress.env('TEST_USER_PASSWORD'),
        });

        await window.Clerk.setActive({
          session: res.createdSessionId,
        });

        cy.log('Finished Signing in.');
      });
    });
});

Cypress.Commands.add('signOut', () => {
  cy.log('sign out by clearing all cookies.');
  cy.clearCookies({domain: undefined});
});
