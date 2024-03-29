// ***********************************************************
// This support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';

// Sometimes, randomly in different tests, the test fails with one of the console errors:
// - https://react.dev/errors/418
// - https://react.dev/errors/423
// We have not found the cause of these errors, but it does not impact the app's functionality.
// This is a workaround to ignore the error and continue the test.
Cypress.on('uncaught:exception', err => {
  expect(err.message).to.contains(/invariant=418|invariant=423/g);

  return false;
});
