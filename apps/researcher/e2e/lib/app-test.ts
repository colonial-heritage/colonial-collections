import {setupClerkTestingToken} from '@clerk/testing/playwright';
import {test as base} from '@playwright/test';
import {env} from 'node:process';

type ExtendedFixtures = {
  gotoSignedIn: (url: string) => Promise<void>;
};

const test = base.extend<ExtendedFixtures>({
  gotoSignedIn: async ({page}, use) => {
    await use(async (url: string) => {
      await setupClerkTestingToken({page});

      await page.goto('/sign-in');
      await page.waitForSelector('.cl-signIn-root', {state: 'attached'});
      await page.locator('input[name=identifier]').fill(env.TEST_USER_EMAIL!);
      await page.getByRole('button', {name: 'Continue', exact: true}).click();
      await page.locator('input[name=password]').fill(env.TEST_USER_PASSWORD!);
      await page.getByRole('button', {name: 'Continue', exact: true}).click();
      await page.waitForSelector('.cl-userButtonAvatarBox', {state: 'visible'});
      await page.goto(url);
      await page.waitForSelector('.cl-userButtonAvatarBox', {state: 'visible'});
    });
  },
});

export default test;
