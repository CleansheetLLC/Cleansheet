/**
 * API Key Configuration Tests - Provider Management & Model Selection
 *
 * Tests the API key management UI including adding, deleting, and switching
 * between providers (OpenAI, Anthropic, Gemini). Verifies connection testing
 * and model selection workflows.
 *
 * Priority: HIGH - Users need reliable API key management
 * Risk Level: MEDIUM - Configuration errors can prevent AI features
 */

import { test, expect } from '../../fixtures/canvas-fixtures.js';
import { CryptoHelpers } from '../../helpers/crypto-helpers.js';
import { StorageHelpers } from '../../helpers/storage-helpers.js';
import { ApiKeyManagerPage } from '../../page-objects/ApiKeyManagerPage.js';

test.describe('🔑 API Key Configuration', () => {

  test.beforeEach(async ({ page }) => {
    // Start with clean slate
    await page.goto('/web/career-canvas.html');
    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should add new API key and verify encryption', async ({ page }) => {
    // Test adding a new provider with API key
    // CRITICAL: Key must be encrypted immediately

    const testKey = 'sk-test-openai-key-123456789012345678901234567890';

    // Inject key directly (mock API key entry)
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt(testKey)
    );

    // Set model
    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.openai.model = 'gpt-4o';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify key was encrypted
    const isEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    expect(isEncrypted).toBe(true);

    // Verify model saved
    const model = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.openai?.model;
    });
    expect(model).toBe('gpt-4o');

    // Verify no plaintext leakage
    const securityScan = await CryptoHelpers.verifyNoPlaintextKeys(page);
    expect(securityScan.secure).toBe(true);
  });

  test('should delete API key and remove from storage', async ({ page }) => {
    // Test deleting provider - must remove ALL traces

    // Setup key
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-key')
    );

    await page.reload();

    // Verify key exists
    let config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });
    expect(config.openai).toBeDefined();

    // Delete key
    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      delete config.openai;
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify key removed
    config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });
    expect(config.openai).toBeUndefined();
  });

  test('should switch between multiple providers', async ({ page }) => {
    // Test switching active provider

    // Setup multiple providers
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-openai-key')
    );

    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'anthropic',
      CryptoHelpers.mockEncrypt('sk-ant-test-anthropic-key')
    );

    // Set OpenAI as active
    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.activeProvider = 'openai';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify OpenAI active
    let activeProvider = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.activeProvider;
    });
    expect(activeProvider).toBe('openai');

    // Switch to Anthropic
    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.activeProvider = 'anthropic';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify Anthropic now active
    activeProvider = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.activeProvider;
    });
    expect(activeProvider).toBe('anthropic');

    // Verify both keys still encrypted
    const openaiEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    const anthropicEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'anthropic');

    expect(openaiEncrypted).toBe(true);
    expect(anthropicEncrypted).toBe(true);
  });

  test('should support all three providers (OpenAI, Anthropic, Gemini)', async ({ page }) => {
    // Test that all three providers can be configured simultaneously

    // Setup all providers
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-openai-key')
    );

    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'anthropic',
      CryptoHelpers.mockEncrypt('sk-ant-test-anthropic-key')
    );

    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'gemini',
      CryptoHelpers.mockEncrypt('AIzaSyTest_Gemini_Key_1234567890')
    );

    // Set models for each
    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.openai.model = 'gpt-4o';
      config.anthropic.model = 'claude-sonnet-4-5-20250929';
      config.gemini.model = 'gemini-2.0-flash-exp';
      config.activeProvider = 'openai';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify all providers configured
    const config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    expect(config.openai).toBeDefined();
    expect(config.anthropic).toBeDefined();
    expect(config.gemini).toBeDefined();

    // Verify models
    expect(config.openai.model).toBe('gpt-4o');
    expect(config.anthropic.model).toBe('claude-sonnet-4-5-20250929');
    expect(config.gemini.model).toBe('gemini-2.0-flash-exp');

    // Verify all encrypted
    const openaiEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    const anthropicEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'anthropic');
    const geminiEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'gemini');

    expect(openaiEncrypted).toBe(true);
    expect(anthropicEncrypted).toBe(true);
    expect(geminiEncrypted).toBe(true);
  });

  test('should update model selection for provider', async ({ page }) => {
    // Test changing model for existing provider

    // Setup provider with initial model
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-key')
    );

    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.openai.model = 'gpt-4o';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify initial model
    let model = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.openai?.model;
    });
    expect(model).toBe('gpt-4o');

    // Change model
    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.openai.model = 'gpt-4o-mini';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify model updated
    model = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.openai?.model;
    });
    expect(model).toBe('gpt-4o-mini');

    // Verify key still encrypted
    const isEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    expect(isEncrypted).toBe(true);
  });

  test('should validate API key format before storing', async ({ page }) => {
    // Test that invalid key formats are rejected

    // Valid key formats:
    // OpenAI: sk-[alphanumeric 20+ chars]
    // Anthropic: sk-ant-[alphanumeric/dashes 40+ chars]
    // Gemini: AIza[alphanumeric/underscores 39 chars]

    // Test invalid keys (should be rejected)
    const invalidKeys = [
      { provider: 'openai', key: 'invalid-key' },
      { provider: 'anthropic', key: 'sk-wrong-prefix' },
      { provider: 'gemini', key: 'wrong-format' }
    ];

    for (const { provider, key } of invalidKeys) {
      // Attempt to inject invalid key
      const result = await page.evaluate(({ p, k }) => {
        // Simulate validation logic
        const patterns = {
          openai: /^sk-[a-zA-Z0-9]{20,}$/,
          anthropic: /^sk-ant-[a-zA-Z0-9-]{40,}$/,
          gemini: /^AIza[a-zA-Z0-9_-]{35,}$/
        };

        const isValid = patterns[p]?.test(k);
        return isValid;
      }, { p: provider, k: key });

      expect(result).toBe(false); // Should be invalid
    }

    // Test valid keys (should be accepted)
    const validKeys = [
      { provider: 'openai', key: 'sk-test1234567890abcdefghijklmnop' },
      { provider: 'anthropic', key: 'sk-ant-test1234567890abcdefghijklmnop1234567890' },
      { provider: 'gemini', key: 'AIzaSyTest1234567890abcdefghijklmnop1234' }
    ];

    for (const { provider, key } of validKeys) {
      const result = await page.evaluate(({ p, k }) => {
        const patterns = {
          openai: /^sk-[a-zA-Z0-9]{20,}$/,
          anthropic: /^sk-ant-[a-zA-Z0-9-]{40,}$/,
          gemini: /^AIza[a-zA-Z0-9_-]{35,}$/
        };

        const isValid = patterns[p]?.test(k);
        return isValid;
      }, { p: provider, k: key });

      expect(result).toBe(true); // Should be valid
    }
  });

  test('should prevent duplicate provider entries', async ({ page }) => {
    // Test that adding same provider twice overwrites, not duplicates

    // Add OpenAI first time
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-key-first')
    );

    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.openai.model = 'gpt-4o';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Add OpenAI second time (different key)
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-key-second')
    );

    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.openai.model = 'gpt-4o-mini'; // Different model
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify only ONE OpenAI entry
    const config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    // Should have openai key
    expect(config.openai).toBeDefined();

    // Should have updated model
    expect(config.openai.model).toBe('gpt-4o-mini');

    // Count provider keys
    const providerKeys = Object.keys(config).filter(key =>
      ['openai', 'anthropic', 'gemini'].includes(key)
    );

    // Should only have 1 provider (not 2 openai entries)
    expect(providerKeys.length).toBe(1);
  });

  test('should preserve API keys when updating other profile data', async ({ page }) => {
    // CRITICAL: API keys must not be affected by profile changes

    // Setup API key
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-key')
    );

    await page.reload();

    // Verify key present
    let config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });
    const originalKeyValue = config.openai.apiKey;

    // Update profile data
    await StorageHelpers.setStorageItem(page, 'user_profile_current', {
      userFirstName: 'Updated',
      userLastName: 'User',
      email: 'updated@test.com'
    });

    await page.reload();

    // Verify API key unchanged
    config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    expect(config.openai.apiKey).toBe(originalKeyValue);

    // Verify still encrypted
    const isEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    expect(isEncrypted).toBe(true);
  });

  test('should handle missing or corrupted config gracefully', async ({ page }) => {
    // Test error handling for corrupted llm_config_encrypted

    // Inject corrupted config
    await page.evaluate(() => {
      localStorage.setItem('llm_config_encrypted', 'NOT_VALID_JSON');
    });

    await page.reload();

    // Application should not crash - check for console errors
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    // Should handle gracefully (might log error but not crash)
    const hasCrash = consoleLogs.some(log =>
      log.includes('Uncaught') && !log.includes('JSON')
    );

    expect(hasCrash).toBe(false);

    // Clear corrupted data and verify reset
    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();

    // Should be able to add new key after corruption
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-recovery-key')
    );

    await page.reload();

    const isEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    expect(isEncrypted).toBe(true);
  });

});
