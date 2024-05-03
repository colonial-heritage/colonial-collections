import {expect} from '@playwright/test';
import test from './lib/app-test';
import {env} from 'node:process';

test.describe('Communities page', () => {
  test('shows a list of communities', async ({page}) => {
    await page.goto('/en/communities', {waitUntil: 'networkidle'});
    await expect(page.getByTestId('community-item-name').first()).toBeVisible();
    await expect(page.getByTestId('error')).not.toBeVisible();
  });
});

test.describe('Community details page', () => {
  test('opens the community page if clicked on in the communities list', async ({
    page,
  }) => {
    await page.goto('/communities', {waitUntil: 'networkidle'});
    const communityItemName = await page
      .getByTestId('community-item-name')
      .first();

    const communityName = await communityItemName.textContent();

    const parentLink = await communityItemName.locator('xpath=./ancestor::a');
    await parentLink!.click();
    await page.waitForURL(/.*\/communities\/.+/);
    await expect(page.getByTestId('error')).not.toBeVisible();
    await expect(page.getByTestId('no-entity')).not.toBeVisible();
    const detailsName = await page.getByTestId('community-name').textContent();
    expect(communityName).toEqual(detailsName);
  });

  test('shows an error message if no community matches the ID', async ({
    page,
  }) => {
    await page.goto('/communities/anIdThatDoesNotExist', {
      waitUntil: 'networkidle',
    });
    await expect(page.getByTestId('no-entity')).toBeVisible();
    await expect(page.getByTestId('community-name')).not.toBeVisible();
  });
});

test.describe('Communities page logged in', () => {
  test("opens the 'add community' modal", async ({page, gotoSignedIn}) => {
    await gotoSignedIn('/en/communities');
    await page.getByTestId('add-community').click();
    await expect(page.locator('.cl-modalContent')).toBeVisible();
    await expect(page.locator('.cl-headerTitle')).toContainText(
      'Create Community'
    );
  });

  test('finds my community with the "Show only my communities" toggle', async ({
    page,
    gotoSignedIn,
  }) => {
    await gotoSignedIn('/en/communities');
    await page.getByTestId('my-community-toggle').check();
    await page.waitForURL(/onlyMyCommunities=true/);
    const communityItems = await page.getByTestId('community-item-name');
    await expect(communityItems).toHaveCount(1);
  });
});

test.describe('Community details page logged in', () => {
  test('edits my community', async ({page, gotoSignedIn}) => {
    const uniqueIdentifier = Date.now();
    await gotoSignedIn(`/en/communities${env.TEST_COMMUNITY_SLUG}`);
    await page.getByTestId('edit-community').click();
    await page.fill(
      '#description',
      `This community is used for end-to-end testing; please do not remove or use this community. Unique Identifier: ${uniqueIdentifier}`
    );
    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('notification')).toBeVisible();
    await expect(page.locator('main')).toContainText(`${uniqueIdentifier}`);
  });

  test('opens the manage user modal', async ({page, gotoSignedIn}) => {
    await gotoSignedIn(`/en/communities${env.TEST_COMMUNITY_SLUG}`);
    await page.getByTestId('manage-members-button').click();
    await expect(page.locator('.cl-headerTitle')).toContainText('Members');
  });
});
