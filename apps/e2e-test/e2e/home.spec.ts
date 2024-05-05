import {expect} from '@playwright/test';
import test from './lib/app-test';
test.describe('Researcher homepage', () => {
  test('shows the object list after searching', async ({page}) => {
    await page.goto('/en', {waitUntil: 'networkidle'});
    await page.getByTestId('searchQuery').fill('object');
    await page.locator('button:near([data-testid="searchQuery"])').click();
    await page.waitForURL(/query=/, {waitUntil: 'networkidle'});

    await expect(page.getByTestId('loading-element')).toHaveCount(0);
    await expect(page.getByTestId('error')).not.toBeVisible();
    const objectCardsCount = await page.getByTestId('object-card').count();
    expect(objectCardsCount).toBeGreaterThan(0);
  });
});
