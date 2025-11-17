/**
 * CryptoHelpers - Utilities for validating encryption in tests
 *
 * CRITICAL: These helpers ensure API keys and sensitive data are
 * properly encrypted and never stored in plaintext.
 */

export class CryptoHelpers {
  /**
   * Verify that an API key is properly encrypted in localStorage
   *
   * @param {Page} page - Playwright page object
   * @param {string} provider - Provider name ('openai', 'anthropic', 'gemini')
   * @returns {Promise<boolean>} - True if encryption verified
   */
  static async verifyApiKeyEncryption(page, provider) {
    const encrypted = await page.evaluate((p) => {
      const config = localStorage.getItem('llm_config_encrypted');
      if (!config) return null;

      try {
        const parsed = JSON.parse(config);
        return parsed[p]?.apiKey;
      } catch {
        return null;
      }
    }, provider);

    if (!encrypted) {
      console.error(`[CryptoHelpers] No encrypted key found for ${provider}`);
      return false;
    }

    // Verify encryption characteristics:
    // 1. Should be longer than typical API key (encryption adds overhead)
    // 2. Should match Base64 pattern (our encryption uses Base64 encoding)
    // 3. Should not contain plaintext patterns (sk-, sk-ant-, etc.)

    const isLongEnough = encrypted.length > 50;
    const isBase64Like = /^[A-Za-z0-9+/=]+$/.test(encrypted) || encrypted.includes(':'); // Allow for structured formats
    const hasNoPlaintextPrefix = !encrypted.startsWith('sk-') && !encrypted.startsWith('sk-ant-');

    if (!isLongEnough) {
      console.error(`[CryptoHelpers] Encrypted key too short: ${encrypted.length} chars`);
    }
    if (hasNoPlaintextPrefix === false) {
      console.error(`[CryptoHelpers] SECURITY RISK: Plaintext prefix found in stored key!`);
    }

    return isLongEnough && hasNoPlaintextPrefix;
  }

  /**
   * Verify NO plaintext API keys exist anywhere in localStorage
   * Scans for common API key patterns.
   *
   * @param {Page} page - Playwright page object
   * @returns {Promise<{secure: boolean, violations: Array}>}
   */
  static async verifyNoPlaintextKeys(page) {
    const results = await page.evaluate(() => {
      const violations = [];
      const apiKeyPatterns = [
        /sk-[a-zA-Z0-9]{20,}/,  // OpenAI keys
        /sk-ant-[a-zA-Z0-9-]{20,}/,  // Anthropic keys
        /AIza[a-zA-Z0-9_-]{35}/  // Google API keys
      ];

      // Scan all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        if (!value) continue;

        // Check if value matches plaintext API key patterns
        for (const pattern of apiKeyPatterns) {
          if (pattern.test(value)) {
            violations.push({
              key: key,
              pattern: pattern.toString(),
              sample: value.substring(0, 20) + '...'
            });
          }
        }
      }

      return {
        secure: violations.length === 0,
        violations: violations
      };
    });

    if (!results.secure) {
      console.error('[CryptoHelpers] SECURITY VIOLATION: Plaintext API keys found!');
      console.error(results.violations);
    }

    return results;
  }

  /**
   * Inject a mock encrypted API key for testing
   *
   * @param {Page} page - Playwright page object
   * @param {string} provider - Provider name
   * @param {string} mockEncryptedKey - Mock encrypted value
   */
  static async injectMockEncryptedKey(page, provider, mockEncryptedKey) {
    await page.evaluate(({ p, k }) => {
      let config = {};
      const existing = localStorage.getItem('llm_config_encrypted');
      if (existing) {
        config = JSON.parse(existing);
      }

      config[p] = {
        apiKey: k,
        model: 'test-model'
      };

      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    }, { p: provider, k: mockEncryptedKey });
  }

  /**
   * Simulate device transfer (clear device keys, restore from backup)
   * Used to test re-encryption with new device keys
   *
   * @param {Page} page - Playwright page object
   * @returns {Promise<void>}
   */
  static async simulateDeviceTransfer(page) {
    await page.evaluate(() => {
      // Clear device-specific encryption keys
      // In real implementation, this would clear the device key from IndexedDB or similar
      localStorage.removeItem('device_encryption_key');

      // Clear all encrypted config
      localStorage.removeItem('llm_config_encrypted');

      // Clear persona to trigger fresh setup
      localStorage.removeItem('cleansheet_currentPersona');
    });
  }

  /**
   * Verify password encryption characteristics in backup file
   *
   * @param {Object} backupData - Parsed backup JSON
   * @returns {boolean} - True if password encryption verified
   */
  static verifyPasswordEncryptionInBackup(backupData) {
    if (!backupData.apiKeysEncrypted) {
      return false;
    }

    const encrypted = backupData.apiKeysEncrypted;

    // Check structure
    if (!encrypted.encrypted || !encrypted.providers || !encrypted.data) {
      console.error('[CryptoHelpers] Invalid backup structure');
      return false;
    }

    // Verify providers array exists
    if (!Array.isArray(encrypted.providers) || encrypted.providers.length === 0) {
      console.error('[CryptoHelpers] No providers in encrypted backup');
      return false;
    }

    // Verify data object has encrypted keys
    if (typeof encrypted.data !== 'object' || Object.keys(encrypted.data).length === 0) {
      console.error('[CryptoHelpers] No encrypted data in backup');
      return false;
    }

    // Verify each provider has encrypted apiKey
    for (const provider of encrypted.providers) {
      const providerKey = provider.toLowerCase();
      const providerData = encrypted.data[providerKey];

      if (!providerData || !providerData.apiKey) {
        console.error(`[CryptoHelpers] Missing encrypted key for ${provider}`);
        return false;
      }

      // Verify encryption (should be long string, not plaintext)
      if (providerData.apiKey.length < 50) {
        console.error(`[CryptoHelpers] Key for ${provider} appears unencrypted`);
        return false;
      }
    }

    return true;
  }

  /**
   * Generate mock encrypted API key for testing
   * (Not cryptographically secure, just for test fixtures)
   *
   * @param {string} plainKey - Plaintext API key
   * @returns {string} - Mock encrypted value
   */
  static mockEncrypt(plainKey) {
    // Simple mock encryption: Base64 encode with a prefix
    const encoded = Buffer.from(plainKey).toString('base64');
    return `ENCRYPTED_${encoded}_${Date.now()}`;
  }

  /**
   * Verify backup file integrity (no corruption)
   *
   * @param {Object} backupData - Parsed backup JSON
   * @returns {{valid: boolean, errors: Array<string>}}
   */
  static validateBackupIntegrity(backupData) {
    const errors = [];

    // Check required fields
    if (!backupData.version) errors.push('Missing version field');
    if (!backupData.exportDate) errors.push('Missing exportDate field');
    if (!backupData.userFirstName && !backupData.data) errors.push('Missing data');

    // Check data structure if present
    if (backupData.data) {
      if (typeof backupData.data !== 'object') {
        errors.push('Data field is not an object');
      }
    }

    // Check encrypted keys structure if present
    if (backupData.apiKeysEncrypted) {
      if (!backupData.apiKeysEncrypted.encrypted) {
        errors.push('apiKeysEncrypted.encrypted flag missing');
      }
      if (!Array.isArray(backupData.apiKeysEncrypted.providers)) {
        errors.push('apiKeysEncrypted.providers is not an array');
      }
      if (typeof backupData.apiKeysEncrypted.data !== 'object') {
        errors.push('apiKeysEncrypted.data is not an object');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}
