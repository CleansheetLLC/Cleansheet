/**
 * Canvas Test Fixtures - Reusable test setups
 *
 * Provides fixtures for common test scenarios with proper cleanup
 */

import { test as base } from '@playwright/test';
import { StorageHelpers } from '../helpers/storage-helpers.js';
import { CryptoHelpers } from '../helpers/crypto-helpers.js';

/**
 * Extended test with custom fixtures
 */
export const test = base.extend({
  /**
   * Clean canvas - Start with empty localStorage
   */
  cleanCanvas: async ({ page }, use) => {
    await page.goto('/web/career-canvas.html');
    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await use(page);
  },

  /**
   * Canvas with mock data - Preconfigured with test experiences
   */
  canvasWithData: async ({ page }, use) => {
    await page.goto('/web/career-canvas.html');
    await StorageHelpers.clearAllCanvasData(page);

    // Setup mock canvas data
    const mockData = await StorageHelpers.setupMockCanvasData(page, {
      experienceCount: 5,
      withProfile: true,
      withCanvas: true
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await use({ page, mockData });
  },

  /**
   * Canvas with API keys configured
   */
  canvasWithApiKeys: async ({ page }, use) => {
    await page.goto('/web/career-canvas.html');
    await StorageHelpers.clearAllCanvasData(page);

    // Encrypt API keys using the actual CleansheetCrypto (with device key)
    await page.evaluate(async () => {
      // Wait for CleansheetCrypto to be available
      while (typeof CleansheetCrypto === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Encrypt test keys with device key
      const encryptedOpenAI = await CleansheetCrypto.encrypt('sk-test-openai-key-12345');
      const encryptedAnthropic = await CleansheetCrypto.encrypt('sk-ant-test-anthropic-key-67890');

      // Store encrypted keys in llm_config_encrypted
      const config = {
        openai: {
          apiKey: encryptedOpenAI,
          model: 'gpt-4'
        },
        anthropic: {
          apiKey: encryptedAnthropic,
          model: 'claude-3-sonnet-20240229'
        },
        activeProvider: 'openai'
      };

      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await use(page);
  },

  /**
   * Canvas with both data and API keys
   */
  canvasFullyConfigured: async ({ page }, use) => {
    await page.goto('/web/career-canvas.html');
    await StorageHelpers.clearAllCanvasData(page);

    // Setup mock canvas data
    const mockData = await StorageHelpers.setupMockCanvasData(page, {
      experienceCount: 5,
      withProfile: true,
      withCanvas: true
    });

    // Encrypt API keys using the actual CleansheetCrypto (with device key)
    await page.evaluate(async () => {
      // Wait for CleansheetCrypto to be available
      while (typeof CleansheetCrypto === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Encrypt test keys with device key
      const encryptedOpenAI = await CleansheetCrypto.encrypt('sk-test-openai-key-12345');
      const encryptedAnthropic = await CleansheetCrypto.encrypt('sk-ant-test-anthropic-key-67890');

      // Store encrypted keys in llm_config_encrypted
      const config = {
        openai: {
          apiKey: encryptedOpenAI,
          model: 'gpt-4'
        },
        anthropic: {
          apiKey: encryptedAnthropic,
          model: 'claude-3-sonnet-20240229'
        },
        activeProvider: 'openai'
      };

      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await use({ page, mockData });
  }
});

export { expect } from '@playwright/test';

/**
 * Generate mock experience data
 *
 * @param {number} count - Number of experiences to generate
 * @returns {Array} - Array of mock experience objects
 */
export function generateMockExperiences(count = 5) {
  const experiences = [];

  for (let i = 0; i < count; i++) {
    experiences.push({
      id: `test-exp-${i}`,
      role: `Test Role ${i}`,
      organizationName: `Test Company ${i}`,
      startDate: `2020-0${(i % 9) + 1}-01`,
      endDate: i < count - 1 ? `2021-0${(i % 9) + 1}-01` : null,
      description: `Test description for experience ${i}. This is a comprehensive description that explains the role and responsibilities.`,
      skills: ['JavaScript', 'Testing', 'Playwright', 'Automation', 'CI/CD'],
      achievements: [
        `Achievement ${i}-1: Improved test coverage by 40%`,
        `Achievement ${i}-2: Reduced bug count through automation`
      ],
      projectsWorkedOn: [`Project ${i}-A`, `Project ${i}-B`]
    });
  }

  return experiences;
}

/**
 * Generate mock user profile
 *
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} - Mock profile object
 */
export function generateMockProfile(overrides = {}) {
  return {
    userFirstName: 'Test',
    userLastName: 'User',
    email: 'test@cleansheet.test',
    targetRole: 'Lead Test Engineer',
    yearsExperience: 5,
    location: 'Remote',
    summary: 'Experienced test automation engineer with focus on E2E testing.',
    ...overrides
  };
}

/**
 * Generate mock canvas tree structure
 *
 * @param {Array} experiences - Array of experiences to build tree from
 * @returns {Object} - Canvas tree structure
 */
export function generateMockCanvasTree(experiences) {
  // Group experiences into categories
  const categories = {};

  experiences.forEach((exp, index) => {
    const category = index < 2 ? 'Category A' : 'Category B';

    if (!categories[category]) {
      categories[category] = [];
    }

    categories[category].push({
      name: exp.role,
      id: exp.id
    });
  });

  // Build tree structure
  return {
    name: 'Root',
    children: Object.entries(categories).map(([name, items]) => ({
      name,
      children: items
    }))
  };
}

/**
 * Wait for canvas to be ready (after data changes)
 *
 * @param {Page} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds
 */
export async function waitForCanvasReady(page, timeout = 5000) {
  // Wait for localStorage to be populated
  await page.waitForFunction(
    () => {
      const experiences = localStorage.getItem('user_experiences_current');
      return experiences !== null;
    },
    { timeout }
  );

  // Wait for any UI updates
  await page.waitForTimeout(500);
}

/**
 * Verify no encryption errors in console
 *
 * @param {Page} page - Playwright page object
 * @returns {Array<string>} - Array of error messages (empty if no errors)
 */
export async function collectConsoleErrors(page) {
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(`PageError: ${err.message}`);
  });

  return errors;
}
