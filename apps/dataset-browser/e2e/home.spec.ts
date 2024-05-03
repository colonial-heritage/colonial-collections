import {expect, test} from '@playwright/test';

test.describe('Dataset Browser homepage', () => {
  test('loads a dataset list', async ({page}) => {
    await page.goto('/en');
    await expect(page.getByTestId('error')).toHaveCount(0);
    const datasetCards = page.getByTestId('dataset-card-name');
    expect(await datasetCards.count()).toBeGreaterThan(0);
  });
});

test.describe('Dataset list filters', () => {
  test('filters by one license', async ({page}) => {
    await page.goto('/en');
    await page
      .getByTestId('licensesFilter')
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.waitForURL('**/*licenses=*');
    await expect(page.getByTestId('selectedFilter')).toHaveCount(1);
  });

  test('filters by two licenses', async ({page}) => {
    await page.goto('/en');
    const checkboxes = page
      .getByTestId('licensesFilter')
      .locator('input[type="checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await page.waitForURL('**/*licenses=*');
    await expect(page.getByTestId('selectedFilter')).toHaveCount(2);
  });

  test('removes a license filter by deselecting the filter in the sidebar', async ({
    page,
  }) => {
    await page.goto('/en');
    await page
      .getByTestId('licensesFilter')
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.waitForURL('**/*licenses=*');
    await page
      .getByTestId('licensesFilter')
      .locator('input[type="checkbox"]')
      .first()
      .uncheck();
    await page.waitForURL('**/*');
    await expect(page.getByTestId('selectedFilter')).toHaveCount(0);
  });

  test('removes a license filter by deselecting it in the selected filter bar', async ({
    page,
  }) => {
    await page.goto('/en');
    await page
      .getByTestId('licensesFilter')
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.waitForURL('**/*licenses=*');
    await page.getByTestId('selectedFilter').locator('button').click();
    await page.waitForURL('**/*');
    await expect(page.getByTestId('selectedFilter')).toHaveCount(0);
  });

  test('filters by one publisher', async ({page}) => {
    await page.goto('/en');
    await page
      .getByTestId('publishersFilter')
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.waitForURL('**/*publishers=*');
    await expect(page.getByTestId('selectedFilter')).toHaveCount(1);
  });

  test('filters based on the search query', async ({page}) => {
    await page.goto('/en');
    const searchText = 'dataset';
    await page.getByTestId('searchQuery').fill(searchText);
    await page.locator('button:near([data-testid="searchQuery"])').click();
    await page.waitForURL('**/*query=*');
    await expect(page.getByTestId('selectedFilter')).toHaveCount(1);
    await expect(page.getByTestId('selectedFilter')).toHaveText(searchText);
  });

  test('filters all categories together (query, license and publisher)', async ({
    page,
  }) => {
    await page.goto('/en');
    const searchText = 'dataset';
    await page.getByTestId('searchQuery').fill(searchText);
    await page.locator('button:near([data-testid="searchQuery"])').click();
    await page.waitForURL('**/*query=*');
    await page
      .getByTestId('publishersFilter')
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.waitForURL('**/*publishers=*');
    await page
      .getByTestId('licensesFilter')
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.waitForURL('**/*licenses=*');
    await expect(page.getByTestId('selectedFilter')).toHaveCount(3);
  });
});
