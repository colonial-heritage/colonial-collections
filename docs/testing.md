# Testing
This application has different tests. All tests run in CI after creating a pull request. Therefore, pull requests can only be merged if all tests have passed.

## Integration tests with Jest
We use [Jest](https://jestjs.io/) for our integration tests. You can run the tests with the following command:

  npm run test

## End-to-end tests with Cypress
For end-to-end testing, we use [Cypress](https://www.cypress.io/). You can run the tests with the following command:

  npm run cypress

[As recommended in the Cypress documentation](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements), we use the attribute **data-testid** to make it easier to target elements.

Select this attribute with the custom selector `getBySel`, for example:

```
it('shows an error message', () => {
  cy.getBySel('error-message').should('exist');
});
```

If you need to forward the data-testid to a component, use the component attribute `testId`. See the [badge component](https://github.com/colonial-heritage/dataset-browser/blob/main/src/components/badge.tsx) for an example.


