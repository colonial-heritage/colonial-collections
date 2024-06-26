import {expect} from '@playwright/test';
import test from './lib/app-test';
import {getObjectUrl} from './lib/database';

test.describe('Object details page not signed in', () => {
  test('opens the object page if clicked on in the search list', async ({
    page,
  }) => {
    await page.goto('/objects?query=object');
    const cardName = await page
      .getByTestId('object-card-name')
      .first()
      .textContent();
    await page.getByTestId('object-card').first().click();
    await page.waitForURL(/.*\/objects\/.+/);

    await expect(page.getByTestId('error')).toHaveCount(0);
    await expect(page.getByTestId('no-entity')).toHaveCount(0);
    const detailsName = await page.getByTestId('page-title').textContent();
    expect(cardName).toEqual(detailsName);
  });

  test('shows an error message if no object matches the ID', async ({page}) => {
    await page.goto('/en/objects/anIdThatDoesNotExist');
    await expect(page.getByTestId('no-entity')).toBeVisible();
    await expect(page.getByTestId('object-name')).toHaveCount(0);
  });

  test('navigates back to the list with the previously selected filters', async ({
    page,
  }) => {
    await page.goto('/objects?query=object');
    await page
      .getByTestId('typesFilter')
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.waitForURL(/.*types=.+/);
    const url = page.url();
    await page.getByTestId('object-card').first().click();
    await page.waitForURL(/.*\/objects\/.+/);
    await page.getByTestId('to-filtered-list-button').first().click();
    await page.waitForURL(/.*\/objects\?.+/);
    expect(page.url()).toEqual(url);
    await expect(page.getByTestId('selectedFilter')).toHaveCount(2);
  });

  test('shows a text when hovering the popover menu button', async ({page}) => {
    const url = await getObjectUrl();
    await page.goto(url);
    await page.waitForSelector('[data-testid="popover-menu-button"]', {
      state: 'attached',
    });
    await page.getByTestId('popover-menu-button').hover();
    await expect(
      page.getByTestId('add-to-list-not-signed-in-panel')
    ).toBeVisible();
    await expect(page.getByTestId('add-to-list-signed-in-panel')).toHaveCount(
      0
    );
  });
});

const objectUrl = await getObjectUrl();

test.describe('Object details page logged in', () => {
  test("opens the 'add enrichment' form", async ({page, gotoSignedIn}) => {
    await gotoSignedIn(objectUrl);
    await page.getByTestId('add-enrichment-button').first().click();
    await expect(page.getByTestId('enrichment-form')).toBeVisible();
  });

  test('adds an enrichment to the object', async ({page, gotoSignedIn}) => {
    const uniqueIdentifier = Date.now().toString();

    await gotoSignedIn(objectUrl);
    await page.getByTestId('add-enrichment-button').first().click();
    await expect(page.getByTestId('enrichment-form')).toBeVisible();
    await page
      .getByTestId('enrichment-form')
      .locator('textarea[name="description"]')
      .fill(
        `Narrative written by an automated test, identifier: ${uniqueIdentifier}`
      );
    await page
      .getByTestId('enrichment-form')
      .locator('textarea[name="citation"]')
      .fill('End to end test');
    await page.getByTestId('agreed-to-license').click();
    await page.getByTestId('community-selector').click();
    page.keyboard.press('ArrowDown');
    page.keyboard.press('Enter');
    await page
      .getByTestId('enrichment-form')
      .locator('button[type="submit"]')
      .click();
    await expect(page.getByTestId('notification')).toHaveCount(1, {
      timeout: 30000,
    });

    // Retry until successful, it can take a while for the new enrichment to show up
    await expect(async () => {
      await page.reload();
      await expect(page.locator('main')).toContainText(`${uniqueIdentifier}`, {
        // The default timeout is 30 seconds, lower the timeout to 5 seconds,
        // because a reload should be faster than an initial load.
        // This will result in more retries, what is good for this test.
        timeout: 5000,
      });
    }).toPass();
  });
});
