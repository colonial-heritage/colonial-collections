import {setupClerkTestingToken} from '@clerk/testing/playwright';
import {test as base, expect} from '@playwright/test';
import {
  createCommunity,
  createUser,
  deleteCommunityWithData,
} from './community';
import {Organization, User} from '@clerk/clerk-sdk-node';

type ExtendedFixtures = {
  gotoSignedIn: (url: string) => Promise<void>;
};

type ExtendedWorkerFixture = {
  account: {
    community: Community;
    user: User;
    emailAddress: string;
    password: string;
  };
};

type Community = Organization & {slug: string};

const test = base.extend<ExtendedFixtures, ExtendedWorkerFixture>({
  // Inspired by https://playwright.dev/docs/test-parallel#isolate-test-data-between-parallel-workers
  account: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      // Create a unique user for each worker
      const workerIdentifier = `test-${
        test.info().workerIndex
      }-${new Date().getTime()}`;

      const firstName = 'End-to-end';
      const lastName = `Test ${workerIdentifier}`;
      const emailAddress = `${workerIdentifier}+clerk_test@example.com`;
      const password = Math.random().toString(36).slice(2);

      const communityName = `End-2-end Community ${workerIdentifier}`;
      const communitySlug = `test-community-${workerIdentifier}`;

      const user = await createUser({
        firstName,
        lastName,
        emailAddress,
        password,
        testId: workerIdentifier,
      });

      const community = (await createCommunity({
        userId: user.id,
        name: communityName,
        slug: communitySlug,
      })) as Community;

      await use({community, user, emailAddress, password});

      // Clean up after the tests are done.
      await deleteCommunityWithData(community.id);
    },
    {scope: 'worker'},
  ],
  // Inspired by the official Clerk example: https://github.com/clerk/playwright-clerk-nextjs-example/blob/main/e2e/app.spec.ts
  // Added extra timeouts to make the tests more reliable
  gotoSignedIn: async ({page, account: {emailAddress, password}}, use) => {
    await use(async (url: string) => {
      // Prevent the test from failing bot detection
      await setupClerkTestingToken({page});

      // Sometimes the login page will stay in loading state after clicking the 'continue' button,
      // retry the login until the password field is visible
      await expect
        .poll(
          async () => {
            await page.goto('/sign-in');
            await page.waitForSelector('.cl-signIn-root', {state: 'attached'});
            await page.locator('input[name=identifier]').fill(emailAddress);
            await page
              .getByRole('button', {name: 'Continue', exact: true})
              .click();
            try {
              await page.waitForSelector('.cl-signIn-password', {
                state: 'attached',
                timeout: 5000,
              });
            } catch (error) {
              return false;
            }
            return true;
          },
          {timeout: 21000}
        )
        .toBe(true);

      await page.locator('input[name=password]').fill(password);
      await page.getByRole('button', {name: 'Continue', exact: true}).click();

      // Wait for the user button to appear so we are sure the user is signed in
      await page.waitForSelector('.cl-userButtonAvatarBox', {
        state: 'visible',
        timeout: 50000,
      });

      // Navigate to the desired page
      await page.goto(url);

      // Wait again for the user button so we are sure the user is loaded
      await page.waitForSelector('.cl-userButtonAvatarBox', {
        state: 'visible',
        timeout: 50000,
      });
    });
  },
});

export default test;
