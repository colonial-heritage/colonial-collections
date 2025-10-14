import {clerk, setupClerkTestingToken} from '@clerk/testing/playwright';
import {test as base} from '@playwright/test';
import {
  createCommunity,
  createUser,
  deleteCommunity,
  deleteUser,
} from './community';
import type {Organization, User} from '@clerk/backend';

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
  // Create test user and community for each worker
  account: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const workerIdentifier = `test-${
        test.info().workerIndex
      }-${new Date().getTime()}`;

      const firstName = 'End-to-end';
      const lastName = `Test ${workerIdentifier}`;
      const emailAddress = `${workerIdentifier}+clerk_test@example.com`;
      const password = Math.random().toString(36).slice(2);

      const communityName = `End-2-end Community ${workerIdentifier}`;
      const communitySlug = `test-community-${workerIdentifier}`;

      const testUser = await createUser({
        firstName,
        lastName,
        emailAddress,
        password,
        testId: workerIdentifier,
      });

      let community;
      try {
        community = (await createCommunity({
          userId: testUser.id,
          name: communityName,
          slug: communitySlug,
        })) as Community;
      } catch (error) {
        // Clean up the user if community creation fails
        await deleteUser(testUser.id);
        throw error;
      }

      await use({community, user: testUser, emailAddress, password});

      // Cleanup: delete user and community separately
      try {
        await deleteUser(testUser.id);
        await deleteCommunity(community.id);
      } catch (error) {
        console.error('Cleanup failed:', error);
      }
    },
    {scope: 'worker'},
  ],
  // Authenticate using the per-worker created user
  gotoSignedIn: async ({page, account}, use) => {
    await use(async (url: string) => {
      try {
        // Set up testing token to bypass bot detection
        await setupClerkTestingToken({page});

        // Navigate to home page to ensure Clerk loads
        await page.goto('/');
        await page.waitForTimeout(2000);

        // Verify Clerk is loaded
        const clerkLoaded = await page.evaluate(() => {
          return typeof window.Clerk !== 'undefined';
        });

        if (!clerkLoaded) {
          throw new Error(
            'Clerk is not loaded. Check your Clerk configuration.'
          );
        }

        // Sign in programmatically using Clerk helper
        await clerk.signIn({
          page,
          signInParams: {
            strategy: 'password',
            identifier: account.emailAddress,
            password: account.password,
          },
        });

        // Navigate to the target page
        await page.goto(url);

        // Wait for authentication to complete
        await page.waitForSelector('.cl-userButtonAvatarBox', {
          state: 'visible',
          timeout: 10000,
        });
      } catch (error) {
        console.error('Authentication failed:', error);
        await page.screenshot({path: 'debug-auth-failure.png', fullPage: true});
        throw error;
      }
    });
  },
});

export default test;
