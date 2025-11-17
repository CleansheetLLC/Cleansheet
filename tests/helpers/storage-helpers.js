/**
 * StorageHelpers - Utilities for localStorage operations in tests
 *
 * Provides safe, consistent access to localStorage for test setup,
 * verification, and cleanup.
 */

export class StorageHelpers {
  /**
   * Clear all Cleansheet-related data from localStorage
   * Preserves other localStorage keys that might be used by the browser
   *
   * @param {Page} page - Playwright page object
   */
  static async clearAllCanvasData(page) {
    await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const cleansheetPrefixes = [
        'user_',
        'canvas_',
        'api_',
        'llm_',
        'cleansheet_',
        'device_'
      ];

      keys.forEach(key => {
        // Remove if key starts with any Cleansheet prefix
        if (cleansheetPrefixes.some(prefix => key.startsWith(prefix))) {
          localStorage.removeItem(key);
        }
      });
    });
  }

  /**
   * Get a single item from localStorage and parse as JSON
   *
   * @param {Page} page - Playwright page object
   * @param {string} key - localStorage key
   * @returns {Promise<any>} - Parsed value or null
   */
  static async getStorageItem(page, key) {
    return await page.evaluate((k) => {
      const item = localStorage.getItem(k);
      if (!item) return null;

      try {
        return JSON.parse(item);
      } catch {
        // Return raw string if not JSON
        return item;
      }
    }, key);
  }

  /**
   * Set a localStorage item with JSON stringification
   *
   * @param {Page} page - Playwright page object
   * @param {string} key - localStorage key
   * @param {any} value - Value to store (will be JSON.stringify'd)
   */
  static async setStorageItem(page, key, value) {
    await page.evaluate(({ k, v }) => {
      const stringValue = typeof v === 'string' ? v : JSON.stringify(v);
      localStorage.setItem(k, stringValue);
    }, { k: key, v: value });
  }

  /**
   * Verify that a localStorage key contains encrypted data
   * (not readable plaintext)
   *
   * @param {Page} page - Playwright page object
   * @param {string} key - localStorage key
   * @returns {Promise<boolean>} - True if appears encrypted
   */
  static async verifyEncryptedStorage(page, key) {
    const value = await page.evaluate((k) => localStorage.getItem(k), key);

    if (!value) return false;

    // Check for encryption patterns:
    // - Should be Base64 (alphanumeric + / + =)
    // - Should be longer than typical plaintext
    // - OR should have structured encryption format (colon-separated, etc.)

    const isEncrypted = (
      (value.length > 100 && /^[A-Za-z0-9+/=]+$/.test(value)) ||  // Pure Base64
      (value.includes(':') && value.length > 50)  // Structured format like "iv:salt:ciphertext"
    );

    return isEncrypted;
  }

  /**
   * Get all localStorage keys
   *
   * @param {Page} page - Playwright page object
   * @returns {Promise<Array<string>>} - Array of all keys
   */
  static async getAllStorageKeys(page) {
    return await page.evaluate(() => Object.keys(localStorage));
  }

  /**
   * Get all Cleansheet-related localStorage keys
   *
   * @param {Page} page - Playwright page object
   * @returns {Promise<Array<string>>} - Array of Cleansheet keys
   */
  static async getCleansheetKeys(page) {
    return await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const cleansheetPrefixes = [
        'user_',
        'canvas_',
        'api_',
        'llm_',
        'cleansheet_',
        'device_'
      ];

      return keys.filter(key =>
        cleansheetPrefixes.some(prefix => key.startsWith(prefix))
      );
    });
  }

  /**
   * Dump all localStorage contents for debugging
   *
   * @param {Page} page - Playwright page object
   * @returns {Promise<Object>} - Object with all key-value pairs
   */
  static async dumpAllStorage(page) {
    return await page.evaluate(() => {
      const dump = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        dump[key] = localStorage.getItem(key);
      }
      return dump;
    });
  }

  /**
   * Check localStorage quota usage
   *
   * @param {Page} page - Playwright page object
   * @returns {Promise<{used: number, available: number, percentage: number}>}
   */
  static async getQuotaUsage(page) {
    return await page.evaluate(() => {
      let used = 0;

      // Calculate total size of localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        // Count bytes (approximate - 2 bytes per char for UTF-16)
        used += (key.length + value.length) * 2;
      }

      // Most browsers have 5-10MB localStorage limit
      const typical_limit = 5 * 1024 * 1024; // 5MB in bytes

      return {
        used: used,
        available: typical_limit - used,
        percentage: (used / typical_limit) * 100
      };
    });
  }

  /**
   * Verify atomic transaction - all keys set or none
   * Used to ensure backup restore is atomic
   *
   * @param {Page} page - Playwright page object
   * @param {Array<string>} requiredKeys - Keys that must all exist
   * @returns {Promise<boolean>} - True if all keys exist
   */
  static async verifyAtomicTransaction(page, requiredKeys) {
    const existingKeys = await this.getCleansheetKeys(page);

    const allPresent = requiredKeys.every(key => existingKeys.includes(key));

    if (!allPresent) {
      const missing = requiredKeys.filter(key => !existingKeys.includes(key));
      console.error('[StorageHelpers] Atomic transaction failed. Missing keys:', missing);
    }

    return allPresent;
  }

  /**
   * Setup mock canvas data for testing
   *
   * @param {Page} page - Playwright page object
   * @param {Object} options - Configuration options
   * @param {number} options.experienceCount - Number of mock experiences
   * @param {boolean} options.withProfile - Include user profile
   * @param {boolean} options.withCanvas - Include canvas tree
   * @returns {Promise<Object>} - The mock data created
   */
  static async setupMockCanvasData(page, options = {}) {
    const {
      experienceCount = 5,
      withProfile = true,
      withCanvas = false
    } = options;

    const mockData = {
      experiences: [],
      profile: null,
      canvasTree: null
    };

    // Generate mock experiences
    for (let i = 0; i < experienceCount; i++) {
      mockData.experiences.push({
        id: `test-exp-${i}`,
        role: `Test Role ${i}`,
        organizationName: `Test Company ${i}`,
        startDate: `2020-0${(i % 9) + 1}-01`,
        endDate: i < experienceCount - 1 ? `2021-0${(i % 9) + 1}-01` : null,
        description: `Test description for experience ${i}`,
        skills: ['JavaScript', 'Testing', 'Playwright'],
        achievements: [`Achievement ${i}`]
      });
    }

    // Generate mock profile if requested
    if (withProfile) {
      mockData.profile = {
        userFirstName: 'Test',
        userLastName: 'User',
        email: 'test@cleansheet.test',
        targetRole: 'Test Engineer',
        yearsExperience: 5
      };
    }

    // Generate mock canvas tree if requested
    if (withCanvas) {
      mockData.canvasTree = {
        name: 'Root',
        children: [
          {
            name: 'Category 1',
            children: mockData.experiences.slice(0, 2).map(exp => ({
              name: exp.role,
              id: exp.id
            }))
          },
          {
            name: 'Category 2',
            children: mockData.experiences.slice(2, 5).map(exp => ({
              name: exp.role,
              id: exp.id
            }))
          }
        ]
      };
    }

    // Set in localStorage
    await this.setStorageItem(page, 'user_experiences_current', mockData.experiences);

    if (mockData.profile) {
      await this.setStorageItem(page, 'user_profile_current', mockData.profile);
    }

    if (mockData.canvasTree) {
      await this.setStorageItem(page, 'canvas_tree_current', mockData.canvasTree);
    }

    // Set persona to indicate we have data
    await this.setStorageItem(page, 'cleansheet_currentPersona', 'member');

    return mockData;
  }

  /**
   * Verify data consistency across related localStorage keys
   * Checks that relationships are maintained (e.g., canvas tree references valid experiences)
   *
   * @param {Page} page - Playwright page object
   * @returns {Promise<{consistent: boolean, errors: Array<string>}>}
   */
  static async verifyDataConsistency(page) {
    const errors = [];

    const experiences = await this.getStorageItem(page, 'user_experiences_current');
    const canvasTree = await this.getStorageItem(page, 'canvas_tree_current');

    if (!experiences || !Array.isArray(experiences)) {
      errors.push('Experiences data missing or invalid');
      return { consistent: false, errors };
    }

    // If canvas tree exists, verify all referenced IDs exist in experiences
    if (canvasTree) {
      const experienceIds = new Set(experiences.map(exp => exp.id));

      const checkTreeReferences = (node) => {
        if (node.id && !experienceIds.has(node.id)) {
          errors.push(`Canvas tree references non-existent experience: ${node.id}`);
        }
        if (node.children) {
          node.children.forEach(checkTreeReferences);
        }
      };

      if (canvasTree.children) {
        canvasTree.children.forEach(checkTreeReferences);
      }
    }

    return {
      consistent: errors.length === 0,
      errors
    };
  }

  /**
   * Wait for a localStorage key to be set
   *
   * @param {Page} page - Playwright page object
   * @param {string} key - localStorage key to wait for
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   * @returns {Promise<void>}
   */
  static async waitForStorageKey(page, key, timeout = 5000) {
    await page.waitForFunction(
      (storageKey) => {
        const value = localStorage.getItem(storageKey);
        return value !== null;
      },
      key,
      { timeout }
    );
  }

  /**
   * Wait for a localStorage key to change value
   *
   * @param {Page} page - Playwright page object
   * @param {string} key - localStorage key
   * @param {string} oldValue - Previous value to compare against
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  static async waitForStorageChange(page, key, oldValue, timeout = 5000) {
    await page.waitForFunction(
      ({ storageKey, previousValue }) => {
        const currentValue = localStorage.getItem(storageKey);
        return currentValue !== previousValue;
      },
      { storageKey: key, previousValue: oldValue },
      { timeout }
    );
  }
}
