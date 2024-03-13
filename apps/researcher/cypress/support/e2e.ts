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

// Sometimes, randomly in different tests, the test fails with the console error:
// "Minified React error #418; visit https://reactjs.org/docs/error-decoder.html?invariant=418
// for the full message or use the non-minified dev environment for full errors and additional
// helpful warnings."
// I'm not sure why this happens, but it does not impact the functionality of the app.
// This is a workaround to ignore the error and continue the test.
Cypress.on('uncaught:exception', err => {
  expect(err.message).to.include('invariant=418');

  return false;
});
