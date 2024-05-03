import {expect, test} from '@playwright/test';

test.describe('Dataset details page', () => {
  test('loads an existing dataset', async ({page}) => {
    await page.goto('/en', {waitUntil: 'networkidle'});
    const cardName = await page
      .getByTestId('dataset-card-name')
      .first()
      .textContent();
    await page.getByTestId('dataset-card-name').first().click();
    await page.waitForURL(/.*\/datasets\/.+/, {waitUntil: 'networkidle'});

    await expect(page.getByTestId('error')).toHaveCount(0);
    const detailsName = await page.getByTestId('page-title').textContent();
    expect(cardName).toEqual(detailsName);
    await expect(page.getByTestId('no-dataset')).toHaveCount(0);
  });

  test('shows an error message if no dataset can be found', async ({page}) => {
    await page.goto('/en/datasets/anIdThatDoesNotExist', {
      waitUntil: 'networkidle',
    });
    await expect(page.getByTestId('no-dataset')).toBeVisible();
    await expect(page.getByTestId('dataset-name')).toHaveCount(0);
  });

  test('navigates back to the list with the previously selected filters', async ({
    page,
  }) => {
    await page.goto('/en', {waitUntil: 'networkidle'});
    await page
      .getByTestId('licensesFilter')
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.waitForURL(/.*\/en\?.+/);
    const url = page.url();
    await page.getByTestId('dataset-card-name').first().click();
    await page.waitForURL(/.*\/datasets\/.+/, {waitUntil: 'networkidle'});
    await page.getByTestId('to-filtered-list-button').first().click();
    await page.waitForURL(/.*\/en\?.+/);
    expect(page.url()).toEqual(url);
    await expect(page.getByTestId('selectedFilter')).toHaveCount(1);
  });
});
