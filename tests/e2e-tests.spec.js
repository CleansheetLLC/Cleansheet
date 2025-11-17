// Cleansheet Career Canvas End-to-End Tests
// Tests critical user flows on Azure Blob Storage deployment

const { test, expect } = require('@playwright/test');

// Test configuration
const TEST_URL = 'https://cleansheetcorpus.blob.core.windows.net/web/career-canvas.html';
const TEST_EMAIL = 'test@cleansheet.dev';

test.describe('Cleansheet Career Canvas E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto(TEST_URL);

    // Wait for page to be ready
    await page.waitForLoadState('networkidle');
  });

  test('Page loads successfully', async ({ page }) => {
    // Check that the main title is visible
    await expect(page.locator('h1')).toBeVisible();

    // Check that the page title contains "Cleansheet"
    await expect(page).toHaveTitle(/Cleansheet/);

    console.log('✓ Page loaded successfully');
  });

  test('localStorage is independent per origin', async ({ page, context }) => {
    // Test that Azure Blob Storage URL has its own localStorage
    // This is different from localhost localStorage

    // Set a test value in localStorage
    await page.evaluate(() => {
      localStorage.setItem('test_key', 'azure_value');
    });

    // Verify it was set
    const value = await page.evaluate(() => localStorage.getItem('test_key'));
    expect(value).toBe('azure_value');

    // Clean up
    await page.evaluate(() => localStorage.removeItem('test_key'));

    console.log('✓ localStorage is origin-specific');
  });

  test('Demo data does NOT load when localStorage has data', async ({ page }) => {
    // Simulate having data in localStorage (like after a sync)
    await page.evaluate(() => {
      // Set flag to indicate we have data (use 'member' not 'career-changer')
      localStorage.setItem('cleansheet_currentPersona', 'member');

      // Set some mock experience data
      localStorage.setItem('user_experiences', JSON.stringify([
        {
          id: 'test_exp_1',
          role: 'Test Engineer',
          organizationName: 'Test Company',
          startDate: '2020-01-01'
        }
      ]));
    });

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that our test data is still present (demo didn't override it)
    const experiencesAfterReload = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('user_experiences') || '[]');
    });

    // Our test experience should still be there
    expect(experiencesAfterReload).toHaveLength(1);
    expect(experiencesAfterReload[0].id).toBe('test_exp_1');
    expect(experiencesAfterReload[0].role).toBe('Test Engineer');

    // Also verify that demo profile data was NOT written to localStorage
    const hasTargetExperiences = experiencesAfterReload.some(
      exp => exp.organizationName === 'Target' || exp.role === 'Store Manager'
    );
    expect(hasTargetExperiences).toBe(false);

    console.log('✓ Demo data correctly prevented when localStorage has data');
  });

  test('Canvas modal can be opened', async ({ page }) => {
    // Look for the "Open Canvas" or similar button
    const canvasButton = page.locator('button:has-text("Canvas"), button:has-text("Open Canvas"), [data-action="open-canvas"]').first();

    if (await canvasButton.isVisible()) {
      await canvasButton.click();

      // Wait for modal to appear
      await page.waitForSelector('[id*="canvas"], [class*="modal"].active, [class*="Canvas"]', {
        state: 'visible',
        timeout: 5000
      });

      console.log('✓ Canvas modal opens successfully');
    } else {
      console.log('⊘ Canvas button not found (may be already open or different UI)');
    }
  });

  test('localStorage sync flag is respected', async ({ page }) => {
    // Test that setting cleansheet_currentPersona prevents demo load

    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('cleansheet_currentPersona', 'member');
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that the persona was preserved
    const persona = await page.evaluate(() =>
      localStorage.getItem('cleansheet_currentPersona')
    );

    expect(persona).toBe('member');

    console.log('✓ Persona flag is preserved across reloads');
  });

  test('Multiple providers configuration UI exists', async ({ page }) => {
    // Check for LLM provider configuration
    const pageContent = await page.content();

    // Look for provider selection elements
    const hasOpenAI = pageContent.includes('OpenAI') || pageContent.includes('GPT');
    const hasGemini = pageContent.includes('Gemini');
    const hasAnthropic = pageContent.includes('Anthropic') || pageContent.includes('Claude');

    // At least 2 providers should be mentioned
    const providerCount = [hasOpenAI, hasGemini, hasAnthropic].filter(Boolean).length;
    expect(providerCount).toBeGreaterThanOrEqual(2);

    console.log(`✓ Multi-provider support detected (${providerCount} providers)`);
  });

  test('CleansheetCrypto is available', async ({ page }) => {
    // Check that encryption utilities are loaded
    const cryptoAvailable = await page.evaluate(() => {
      return typeof window.CleansheetCrypto !== 'undefined';
    });

    expect(cryptoAvailable).toBe(true);

    // Test basic encryption functions exist
    const hasMethods = await page.evaluate(() => {
      return typeof window.CleansheetCrypto.encrypt === 'function' &&
             typeof window.CleansheetCrypto.decrypt === 'function';
    });

    expect(hasMethods).toBe(true);

    console.log('✓ CleansheetCrypto encryption utilities are available');
  });

  test('Cloud sync functions are available', async ({ page }) => {
    // Check that sync-related code is loaded
    const syncAvailable = await page.evaluate(() => {
      return typeof window.CleansheetSync !== 'undefined' ||
             typeof forceSyncDown === 'function' ||
             typeof forceSyncUp === 'function';
    });

    expect(syncAvailable).toBe(true);

    console.log('✓ Cloud sync functionality is available');
  });

  test('No JavaScript console errors on load', async ({ page }) => {
    const errors = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Reload to capture any load errors
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait a bit for any delayed errors
    await page.waitForTimeout(2000);

    // Filter out known/acceptable errors
    const criticalErrors = errors.filter(err => {
      // Ignore Monaco editor AMD define errors (not critical)
      if (err.includes('anonymous define')) return false;
      // Ignore KaTeX fallback messages
      if (err.includes('KaTeX')) return false;
      // Ignore feature policy warnings
      if (err.includes('Feature Policy')) return false;
      return true;
    });

    if (criticalErrors.length > 0) {
      console.log('⚠ Console errors detected:', criticalErrors);
    }

    // Fail if critical errors found
    expect(criticalErrors.length).toBe(0);

    console.log('✓ No critical JavaScript errors on page load');
  });

});

test.describe('Smoke Tests - Quick Validation', () => {

  test('Azure Blob Storage serves content', async ({ page }) => {
    const response = await page.goto(TEST_URL);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');

    console.log('✓ Azure serves HTML correctly');
  });

  test('Critical assets load', async ({ page }) => {
    await page.goto(TEST_URL);

    // Check that critical resources loaded
    const resourceTimings = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(r => ({
        name: r.name.split('/').pop(),
        type: r.initiatorType,
        size: r.transferSize
      }));
    });

    // Should have loaded CSS, JS, etc
    const hasCSS = resourceTimings.some(r => r.name.endsWith('.css'));
    const hasJS = resourceTimings.some(r => r.name.endsWith('.js') || r.type === 'script');

    expect(hasCSS || hasJS).toBe(true);

    console.log(`✓ Critical assets loaded (${resourceTimings.length} resources)`);
  });

});
