import {expect} from '@playwright/test';
import test from './lib/app-test';
test.describe('Researcher homepage', () => {
  test('shows the object list after searching', async ({page}) => {
    await page.goto('/en');
    await page.getByTestId('searchQuery').fill('object');
    await page.locator('button:near([data-testid="searchQuery"])').click();
    await page.waitForURL(/query=/);

    await expect(page.getByTestId('loading-element')).toHaveCount(0);
    await expect(page.getByTestId('error')).not.toBeVisible();
    const objectCardsCount = await page.getByTestId('object-card').count();
    expect(objectCardsCount).toBeGreaterThan(0);
  });
});

test.describe('Object list filters', () => {
  test('filters based on the search query', async ({page}) => {
    await page.goto('/en');
    const searchText = 'My query';

    await page.getByTestId('searchQuery').fill(searchText);
    await page.locator('button:near([data-testid="searchQuery"])').click();
    await page.waitForURL(/query=/);
    await expect(page.getByTestId('loading-element')).toHaveCount(0);
    await expect(page.getByTestId('selectedFilter')).toHaveCount(1);
    expect(await page.getByTestId('selectedFilter').textContent()).toContain(
      searchText
    );
  });

  test('filters by one publisher', async ({page}) => {
    await page.goto('/objects?query=object');
    const firstCheckbox = await page
      .getByTestId('publishersFilter')
      .locator('input[type="checkbox"]')
      .first();
    await firstCheckbox.check();
    await page.waitForURL(/publishers=/);

    await expect(page.getByTestId('selectedFilter')).toHaveCount(2);
  });

  test('filters by two materials', async ({page}) => {
    await page.goto('/objects?query=object');
    const checkboxes = await page
      .getByTestId('materialsFilter')
      .locator('input[type="checkbox"]');
    await checkboxes.nth(0).check();
    await page.waitForURL(/materials=/);
    await checkboxes.nth(1).check();
    await page.waitForURL(/materials=.*&materials=.*/);

    await expect(page.getByTestId('selectedFilter')).toHaveCount(3);
  });

  test('removes a publisher filter by deselecting the filter in the sidebar', async ({
    page,
  }) => {
    await page.goto('/objects?query=object');
    const firstCheckbox = await page
      .getByTestId('publishersFilter')
      .locator('input[type="checkbox"]')
      .first();
    await firstCheckbox.check();
    await page.waitForURL(/publishers=/);

    await firstCheckbox.uncheck();
    await page.waitForFunction(
      () => !window.location.search.includes('publishers='),
      {timeout: 60000}
    );

    await expect(page.getByTestId('selectedFilter')).toHaveCount(1);
  });

  test('removes a publisher filter by deselecting it in the selected filter bar', async ({
    page,
  }) => {
    await page.goto('/objects?query=object');
    const firstCheckbox = await page
      .getByTestId('publishersFilter')
      .locator('input[type="checkbox"]')
      .first();
    await firstCheckbox.check();
    await page.waitForURL(/publishers=/);

    const firstSelectedFilterButton = await page
      .getByTestId('selectedFilter')
      .first()
      .locator('button');
    await firstSelectedFilterButton.click();

    await expect(page.getByTestId('selectedFilter')).toHaveCount(1);
  });

  test('filters by one type', async ({page}) => {
    await page.goto('/objects?query=object');
    const firstCheckbox = await page
      .getByTestId('typesFilter')
      .locator('input[type="checkbox"]')
      .first();
    await firstCheckbox.check();
    await page.waitForURL(/types=/);

    await expect(page.getByTestId('selectedFilter')).toHaveCount(2);
  });

  test('filters multiple categories together (query, publishers and types)', async ({
    page,
  }) => {
    await page.goto('/en');
    const searchText = 'object';

    await page.getByTestId('searchQuery').fill(searchText);
    await page.locator('button:near([data-testid="searchQuery"])').click();
    await page.waitForURL(/query=/);

    const firstTypeCheckbox = await page
      .getByTestId('typesFilter')
      .locator('input[type="checkbox"]')
      .first();
    await firstTypeCheckbox.check();
    await page.waitForURL(/types=/);

    const firstPublisherCheckbox = await page
      .getByTestId('publishersFilter')
      .locator('input[type="checkbox"]')
      .first();
    await firstPublisherCheckbox.check();
    await page.waitForURL(/publishers=/);

    await expect(page.getByTestId('selectedFilter')).toHaveCount(3);
  });
});
