import {expect, test} from '@playwright/test';

test.describe('Content pages', () => {
  test('loads the contact page', async ({page}) => {
    await page.goto('/contact', {waitUntil: 'networkidle'});
    await expect(page.getByTestId('markdown-container')).toBeVisible();
    await expect(page.getByTestId('error')).toHaveCount(0);
  });

  test('loads the about page', async ({page}) => {
    await page.goto('/about', {waitUntil: 'networkidle'});
    await expect(page.getByTestId('markdown-container')).toBeVisible();
    await expect(page.getByTestId('error')).toHaveCount(0);
  });

  test('loads the faq page', async ({page}) => {
    await page.goto('/faq', {waitUntil: 'networkidle'});
    await expect(page.getByTestId('markdown-container')).toBeVisible();
    await expect(page.getByTestId('error')).toHaveCount(0);
  });
});
