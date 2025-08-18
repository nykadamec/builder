import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form correctly', async ({ page }) => {
    // Check if login form is displayed
    await expect(page.locator('h1')).toContainText('Přihlásit se');
    await expect(page.locator('text=Pokračuj do AI App Builderu')).toBeVisible();
    
    // Check form fields
    await expect(page.locator('input[name="emailOrUsername"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check remember me checkbox
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.locator('text=Zapamatovat')).toBeVisible();
    
    // Check forgot password link
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
    
    // Check register link
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Email or username is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should clear errors when user starts typing', async ({ page }) => {
    // Submit empty form to trigger errors
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email or username is required')).toBeVisible();
    
    // Start typing in email field
    await page.fill('input[name="emailOrUsername"]', 'test');
    
    // Error should disappear
    await expect(page.locator('text=Email or username is required')).not.toBeVisible();
  });

  test('should show loading state during login', async ({ page }) => {
    // Fill form with valid data
    await page.fill('input[name="emailOrUsername"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check loading state
    await expect(page.locator('text=Přihlašování...')).toBeVisible();
    await expect(page.locator('.animate-spin')).toBeVisible();
  });

  test('should handle login error gracefully', async ({ page }) => {
    // Fill form with invalid credentials
    await page.fill('input[name="emailOrUsername"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('.text-red-400')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button[aria-label*="heslo"]');
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button
    await toggleButton.click();
    
    // Password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle button again
    await toggleButton.click();
    
    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle remember me checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    
    // Initially unchecked
    await expect(checkbox).not.toBeChecked();
    
    // Click checkbox
    await checkbox.click();
    
    // Should be checked
    await expect(checkbox).toBeChecked();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.click('a[href="/forgot-password"]');
    await expect(page).toHaveURL('/forgot-password');
  });
});
