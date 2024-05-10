import {expect} from '@playwright/test';
import test from './lib/app-test';
import {
  addObjectsToList,
  createEmptyList,
  getObjectUrl,
  resetDb,
} from './lib/database';
import {projectTestId} from './lib/community';

// Run these tests one by one so the db state won't be affected by other tests
test.describe.configure({mode: 'serial'});
// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
  const communitySlug = projectTestId(testInfo.project.name);
  await resetDb(communitySlug);
});

test.describe('Object lists not logged in', () => {
  test('opens the object list from the community page', async ({
    page,
  }, testInfo) => {
    const communitySlug = projectTestId(testInfo.project.name);
    const listId = await createEmptyList(communitySlug);

    await page.goto(`/en/communities/${communitySlug}`);
    await page.getByTestId(`object-list-item-${listId}`).click();
    await page.waitForURL(`/en/communities/${communitySlug}/${listId}`);

    await expect(page.getByTestId('error')).toHaveCount(0);
    await expect(page.getByTestId('no-entity')).toHaveCount(0);
  });

  test('shows an error message if no community matches the ID', async ({
    page,
  }, testInfo) => {
    const communitySlug = projectTestId(testInfo.project.name);
    await page.goto(`/en/communities/${communitySlug}/1234567890`);

    await expect(page.getByTestId('no-entity')).toBeVisible();
    await expect(page.getByTestId('error')).toHaveCount(0);
  });
});

test.describe('Object lists on community page logged in', () => {
  test('adds a list', async ({page, gotoSignedIn}, testInfo) => {
    const communitySlug = projectTestId(testInfo.project.name);
    await gotoSignedIn(`/en/communities/${communitySlug}`);

    await expect(page.getByTestId('object-list-item')).toHaveCount(0);
    await page.getByTestId('add-object-list-button').click();
    await page.fill('#name', 'Test List');
    await page.fill(
      '#description',
      'This list is used for end-to-end testing; please do not remove or use this list'
    );
    await page.getByTestId('save-button').click();

    await expect(page.getByTestId('notification')).toBeVisible();
    await expect(
      page.locator('[data-testid^="object-list-item-"]')
    ).toHaveCount(1);
  });
});

test.describe('Object list page logged in', () => {
  test('edits the list name and description', async ({
    page,
    gotoSignedIn,
  }, testInfo) => {
    const communitySlug = projectTestId(testInfo.project.name);
    const listId = await createEmptyList(communitySlug);
    await gotoSignedIn(`/en/communities/${communitySlug}/${listId}`);

    await page.getByTestId('edit-list-button').click();
    await page.fill('#name', ' Edited');
    await page.getByTestId('save-button').click();

    await expect(page.getByTestId('notification')).toBeVisible();
    await expect(page.locator('main')).toContainText('Edited');
  });

  test('deletes the object list', async ({page, gotoSignedIn}, testInfo) => {
    const communitySlug = projectTestId(testInfo.project.name);
    const listId = await createEmptyList(communitySlug);
    await gotoSignedIn(`/en/communities/${communitySlug}/${listId}`);

    await page.getByTestId('edit-list-button').click();
    await page.getByTestId('delete-list-button').click();
    await page.getByTestId('delete-list-confirm-button').click();

    await expect(page).toHaveURL(`/en/communities/${communitySlug}`);

    await page.goto(`/en/communities/${communitySlug}/${listId}`);

    await expect(page.getByTestId('no-entity')).toBeVisible();
  });

  test('deletes an object from the list', async ({
    page,
    gotoSignedIn,
  }, testInfo) => {
    const communitySlug = projectTestId(testInfo.project.name);
    const listId = await createEmptyList(communitySlug);
    await addObjectsToList({numberOfObject: 3, listId, communitySlug});

    await gotoSignedIn(`/en/communities/${communitySlug}/${listId}`);

    await expect(page.getByTestId('delete-object-button')).toHaveCount(0);
    await page.getByTestId('manage-items-button').click();
    await expect(page.getByTestId('delete-object-button')).toHaveCount(3);
    await page.getByTestId('delete-object-button').first().click();

    await expect(page.getByTestId('notification')).toBeVisible();
    await expect(page.getByTestId('delete-object-button')).toHaveCount(2);
  });

  test('adds an object to the list', async ({page, gotoSignedIn}, testInfo) => {
    const communitySlug = projectTestId(testInfo.project.name);
    const listId = await createEmptyList(communitySlug);
    const objectUrl = await getObjectUrl();

    await gotoSignedIn(objectUrl);
    await page.getByTestId('add-to-list-button').hover();
    await page.getByTestId(`object-list-${listId}`).click();
    await expect(page.getByTestId('notification')).toHaveCount(2);
    await page.goto(`/en/communities/${communitySlug}/${listId}`);
    await expect(page.getByTestId('object-card')).toHaveCount(1);
  });
});
