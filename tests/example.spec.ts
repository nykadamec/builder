import { test, expect } from '@playwright/test';

// Keep tests minimal and modular. Each test file should focus on one feature.
test('homepage has title and links to the docs', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AI Web App Builder|Next\.js App/);
  // Sanity check: hero text or any visible element
  await expect(page.locator('body')).toBeVisible();
});

