# Testing

The applications have different tests. The unit tests and end-to-end tests run in CI after creating a pull request. Therefore, pull requests can only be merged if all tests have passed.

## Unit testing

For unit testing we use [Jest](https://jestjs.io/). You can run the tests with the following command:

    npm run test

## Integration testing

For integration testing we use [Jest](https://jestjs.io/). You can run the tests with the following command:

    npm run test:integration

Beware: the integration tests are not run in CI. The application does not have its own, isolated search APIs to test against, so test runs on CI could fail due to e.g. connectivity issues with the external search APIs.

## End-to-end testing

For end-to-end testing we use [Playwright](https://playwright.dev/). You can run the tests with the following command:

    npm run test:e2e

For writing and debugging tests, you can use [UI mode](https://playwright.dev/docs/test-ui-mode) with the command:

    npm run test:e2e:open

### Writing end-t0-end tests

We use the attribute **data-testid** to make it easier to target elements.

If you need to forward the data-testid to a component, use the component attribute `testId`. See the [badge component](https://github.com/colonial-heritage/dataset-browser/blob/main/src/components/badge.tsx) for an example.
