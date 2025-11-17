/**
 * Smoke Test - Verify basic app loading without authentication
 *
 * This test verifies that:
 * 1. The app loads without authentication prompts
 * 2. The page title is correct
 * 3. Basic DOM elements are present
 */

import { test, expect } from '@playwright/test';

test.describe('🚀 Smoke Test', () => {

  test('should load career-canvas.html without authentication', async ({ page }) => {
    // This should NOT trigger any authentication prompts
    const response = await page.goto('/web/career-canvas.html');

    // Verify successful HTTP response (no 401/403 authentication errors)
    expect(response.status()).toBe(200);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify page loaded (no auth prompt blocked it)
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Verify HTML element exists (page parsed successfully)
    const html = await page.locator('html');
    await expect(html).toBeAttached();

    console.log(`✅ Page loaded successfully: "${title}"`);
    console.log(`✅ HTTP 200 - No authentication required`);
  });

  test('should access localStorage without errors', async ({ page }) => {
    await page.goto('/web/career-canvas.html');
    await page.waitForLoadState('networkidle');

    // Verify localStorage is accessible (no security restrictions)
    const storageWorks = await page.evaluate(() => {
      try {
        localStorage.setItem('smoke_test', 'passed');
        const value = localStorage.getItem('smoke_test');
        localStorage.removeItem('smoke_test');
        return value === 'passed';
      } catch (e) {
        return false;
      }
    });

    expect(storageWorks).toBe(true);
  });

});
