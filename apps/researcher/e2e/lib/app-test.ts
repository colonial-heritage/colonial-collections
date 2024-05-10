import {setupClerkTestingToken} from '@clerk/testing/playwright';
import {test as base, expect} from '@playwright/test';
import {env} from 'node:process';
import {projectTestEmail} from './community';

type ExtendedFixtures = {
  gotoSignedIn: (url: string) => Promise<void>;
};

const test = base.extend<ExtendedFixtures>({
  gotoSignedIn: async ({page}, use, testInfo) => {
    await use(async (url: string) => {
      await setupClerkTestingToken({page});

      // Sometimes, after pressing the button 'Continue', the button stays on the loading state.
      // The function `.toPass()` will retry the function until it passes or times out.
      await expect(async () => {
        await page.goto('/sign-in');
        await page.waitForSelector('.cl-signIn-root', {state: 'attached'});
        await page
          .locator('input[name=identifier]')
          .fill(projectTestEmail(testInfo.project.name));
        await page.getByRole('button', {name: 'Continue', exact: true}).click();
        await page.waitForSelector('.cl-signIn-password', {state: 'attached'});
        await page
          .locator('input[name=password]')
          .fill(env.TEST_USER_PASSWORD!);
        await page.getByRole('button', {name: 'Continue', exact: true}).click();
        await page.waitForSelector('.cl-userButtonAvatarBox', {
          state: 'visible',
          timeout: 50000,
        });
      }).toPass();

      await page.goto(url);
      await page.waitForSelector('.cl-userButtonAvatarBox', {
        state: 'visible',
        timeout: 50000,
      });
    });
  },
});

export default test;
