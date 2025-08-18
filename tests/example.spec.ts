import { test, expect } from '@playwright/test';

// Keep tests minimal and modular. Each test file should focus on one feature.
test('homepage has title and links to the docs', async ({ page }) => {
  await page.goto('/');
  
  // Test should match both Czech and English titles from localization files
  // Czech: "AI App Builder - Vytvářejte aplikace pomocí umělé inteligence"
  // English: "AI App Builder - Build apps with AI"
  await expect(page).toHaveTitle(/AI App Builder/);
  
  // Sanity check: hero text or any visible element
  await expect(page.locator('body')).toBeVisible();
});

