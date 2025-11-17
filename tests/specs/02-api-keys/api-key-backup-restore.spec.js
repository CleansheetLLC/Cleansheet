/**
 * API Key Backup/Restore Tests - Keys-Only Workflows & Device Transfer
 *
 * Tests API key-specific backup/restore scenarios including keys-only export,
 * device transfer, and encryption key rotation. These workflows are critical
 * for users moving between devices or sharing canvas data safely.
 *
 * Priority: HIGH - Users need portable API key management
 * Risk Level: HIGH - Key loss prevents AI features
 */

import { test, expect } from '../../fixtures/canvas-fixtures.js';
import { CryptoHelpers } from '../../helpers/crypto-helpers.js';
import { StorageHelpers } from '../../helpers/storage-helpers.js';
import { BackupRestorePage } from '../../page-objects/BackupRestorePage.js';
import path from 'path';
import fs from 'fs';

test.describe('🔐 API Key Backup/Restore Workflows', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/career-canvas.html');
    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should export keys-only backup with password protection', async ({ page }) => {
    // Test keys-only export for device transfer
    // Use case: User wants to transfer API keys to new device without canvas data

    // Setup API keys
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

    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.openai.model = 'gpt-4o';
      config.anthropic.model = 'claude-sonnet-4-5-20250929';
      config.activeProvider = 'openai';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    const backupPage = new BackupRestorePage(page);
    const password = 'KeysOnlyPassword123';

    const filePath = await backupPage.exportKeysOnly(password);

    // Verify file created
    expect(filePath).toBeTruthy();
    expect(fs.existsSync(filePath)).toBe(true);

    // Parse backup
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    // Verify structure
    expect(backup.type).toBe('api-keys-only');
    expect(backup).toHaveProperty('apiKeysEncrypted');

    // CRITICAL: Should NOT have canvas data
    expect(backup).not.toHaveProperty('data');
    expect(backup).not.toHaveProperty('experiences');

    // Verify encryption
    expect(backup.apiKeysEncrypted.encrypted).toBe(true);
    expect(backup.apiKeysEncrypted.providers).toContain('openai');
    expect(backup.apiKeysEncrypted.providers).toContain('anthropic');

    // Verify no plaintext
    const backupString = JSON.stringify(backup);
    expect(backupString).not.toMatch(/sk-[a-zA-Z0-9]{40,}/);
  });

  test('should restore keys-only backup without affecting canvas data', async ({ page }) => {
    // CRITICAL: Keys-only restore must not overwrite canvas data
    // Use case: User imports API keys but keeps existing canvas

    // Setup existing canvas data
    await StorageHelpers.setStorageItem(page, 'user_experiences_current', [
      { id: 'existing-1', role: 'Existing Experience' },
      { id: 'existing-2', role: 'Another Experience' }
    ]);

    await StorageHelpers.setStorageItem(page, 'user_profile_current', {
      userFirstName: 'Existing',
      userLastName: 'User'
    });

    await page.reload();

    // Restore keys-only backup
    const keysOnlyPath = path.join(__dirname, '../../fixtures/backup-samples/api-keys-only.json');
    const password = 'TestPassword123';

    const backupPage = new BackupRestorePage(page);
    await backupPage.restoreFromFile(keysOnlyPath, password);
    await backupPage.waitForRestoreSuccess();

    // Verify API keys restored
    const config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    expect(config.openai).toBeDefined();
    expect(config.anthropic).toBeDefined();

    // CRITICAL: Verify canvas data UNCHANGED
    const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    const profile = await StorageHelpers.getStorageItem(page, 'user_profile_current');

    expect(experiences).toHaveLength(2);
    expect(experiences[0].id).toBe('existing-1');
    expect(profile.userFirstName).toBe('Existing');
  });

  test('should handle device transfer with key re-encryption', async ({ page }) => {
    // CRITICAL: Device A → backup → Device B requires key re-encryption
    // Keys encrypted with Device A's device key must be re-encrypted with Device B's

    // Simulate Device A
    const deviceAKey = 'sk-test-device-a-key-12345';

    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt(deviceAKey)
    );

    await page.reload();

    // Get Device A's encrypted value
    const deviceAEncrypted = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.openai?.apiKey;
    });

    // Export from Device A
    const backupPage = new BackupRestorePage(page);
    const filePath = await backupPage.exportKeysOnly('DeviceTransferPassword');

    // Simulate Device B (clear storage, new device keys)
    await CryptoHelpers.simulateDeviceTransfer(page);
    await page.reload();

    // Restore on Device B
    await backupPage.restoreFromFile(filePath, 'DeviceTransferPassword');
    await backupPage.waitForRestoreSuccess();

    // Get Device B's encrypted value
    const deviceBEncrypted = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.openai?.apiKey;
    });

    // CRITICAL: Should be DIFFERENT (different device keys)
    expect(deviceBEncrypted).toBeTruthy();
    expect(deviceBEncrypted).not.toBe(deviceAEncrypted);

    // But still valid encryption
    const isEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    expect(isEncrypted).toBe(true);
  });

  test('should merge keys when restoring to device with existing keys', async ({ page }) => {
    // Test merge behavior: Device has OpenAI, backup has Anthropic
    // Result: Should have both

    // Setup existing OpenAI key
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-existing-openai')
    );

    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.openai.model = 'gpt-4o';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Create backup with Anthropic and Gemini keys
    const backupWithOtherKeys = {
      type: 'api-keys-only',
      version: '2.0',
      exportDate: new Date().toISOString(),
      apiKeysEncrypted: {
        encrypted: true,
        providers: ['anthropic', 'gemini'],
        data: {
          anthropic: {
            apiKey: CryptoHelpers.mockEncrypt('sk-ant-test-key'),
            model: 'claude-sonnet-4-5-20250929'
          },
          gemini: {
            apiKey: CryptoHelpers.mockEncrypt('AIzaSyTest_Key'),
            model: 'gemini-2.0-flash-exp'
          }
        }
      }
    };

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/temp-keys-merge.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupWithOtherKeys, null, 2));

    const backupPage = new BackupRestorePage(page);
    await backupPage.restoreFromFile(backupPath, 'MergePassword', 'merge');
    await backupPage.waitForRestoreSuccess();

    // Verify all three providers present
    const config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    expect(config.openai).toBeDefined(); // Existing
    expect(config.anthropic).toBeDefined(); // From backup
    expect(config.gemini).toBeDefined(); // From backup

    // Verify models
    expect(config.openai.model).toBe('gpt-4o');
    expect(config.anthropic.model).toBe('claude-sonnet-4-5-20250929');

    // Cleanup
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  });

  test('should overwrite keys when restoring in overwrite mode', async ({ page }) => {
    // Test overwrite behavior: Device has OpenAI, backup has Anthropic
    // Result: Should ONLY have Anthropic

    // Setup existing OpenAI and Anthropic keys
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-existing-openai')
    );

    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'anthropic',
      CryptoHelpers.mockEncrypt('sk-ant-existing-key')
    );

    await page.reload();

    // Create backup with ONLY Gemini key
    const backupWithGeminiOnly = {
      type: 'api-keys-only',
      version: '2.0',
      exportDate: new Date().toISOString(),
      apiKeysEncrypted: {
        encrypted: true,
        providers: ['gemini'],
        activeProvider: 'gemini',
        data: {
          gemini: {
            apiKey: CryptoHelpers.mockEncrypt('AIzaSyTest_Gemini_Key'),
            model: 'gemini-2.0-flash-exp'
          }
        }
      }
    };

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/temp-keys-overwrite.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupWithGeminiOnly, null, 2));

    const backupPage = new BackupRestorePage(page);
    await backupPage.restoreFromFile(backupPath, 'OverwritePassword', 'overwrite');
    await backupPage.waitForRestoreSuccess();

    // Verify ONLY Gemini present (OpenAI and Anthropic removed)
    const config = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    expect(config.gemini).toBeDefined();
    expect(config.openai).toBeUndefined(); // Removed
    expect(config.anthropic).toBeUndefined(); // Removed

    // Cleanup
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  });

  test('should preserve active provider during keys-only restore', async ({ page }) => {
    // Test that activeProvider is updated correctly during restore

    // Setup existing key with activeProvider
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-openai')
    );

    await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      config.activeProvider = 'openai';
      localStorage.setItem('llm_config_encrypted', JSON.stringify(config));
    });

    await page.reload();

    // Verify initial activeProvider
    let activeProvider = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.activeProvider;
    });
    expect(activeProvider).toBe('openai');

    // Create backup with Anthropic as active
    const backupWithDifferentActive = {
      type: 'api-keys-only',
      version: '2.0',
      exportDate: new Date().toISOString(),
      apiKeysEncrypted: {
        encrypted: true,
        providers: ['anthropic'],
        activeProvider: 'anthropic',
        data: {
          anthropic: {
            apiKey: CryptoHelpers.mockEncrypt('sk-ant-test-key'),
            model: 'claude-sonnet-4-5-20250929'
          }
        }
      }
    };

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/temp-active-provider.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupWithDifferentActive, null, 2));

    const backupPage = new BackupRestorePage(page);
    await backupPage.restoreFromFile(backupPath, 'ActiveProviderPassword', 'merge');
    await backupPage.waitForRestoreSuccess();

    // Verify activeProvider updated to Anthropic
    activeProvider = await page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      return config.activeProvider;
    });
    expect(activeProvider).toBe('anthropic');

    // Cleanup
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  });

  test('should handle empty keys backup (no providers configured)', async ({ page }) => {
    // Test edge case: Backup with no API keys

    const emptyKeysBackup = {
      type: 'api-keys-only',
      version: '2.0',
      exportDate: new Date().toISOString(),
      apiKeysEncrypted: {
        encrypted: false,
        providers: [],
        data: {}
      }
    };

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/temp-empty-keys.json');
    fs.writeFileSync(backupPath, JSON.stringify(emptyKeysBackup, null, 2));

    const backupPage = new BackupRestorePage(page);

    // Should handle gracefully (not crash)
    await backupPage.restoreFromFile(backupPath);

    // Wait for either success or error
    const result = await Promise.race([
      backupPage.waitForRestoreSuccess().then(() => 'success'),
      backupPage.waitForRestoreError().then(() => 'error'),
      page.waitForTimeout(5000).then(() => 'timeout')
    ]);

    // Should either succeed (empty restore) or show friendly message
    expect(['success', 'error']).toContain(result);

    // If succeeded, verify no keys added
    if (result === 'success') {
      const config = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
      });

      const hasAnyProvider = ['openai', 'anthropic', 'gemini'].some(p => config[p]);
      expect(hasAnyProvider).toBe(false);
    }

    // Cleanup
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  });

  test('should prevent plaintext API keys in keys-only backups', async ({ page }) => {
    // SECURITY TEST: Keys-only backups must NEVER contain plaintext keys

    // Setup multiple API keys
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      CryptoHelpers.mockEncrypt('sk-test-openai-plaintext-check')
    );

    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'anthropic',
      CryptoHelpers.mockEncrypt('sk-ant-test-anthropic-plaintext-check')
    );

    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'gemini',
      CryptoHelpers.mockEncrypt('AIzaSyTest_Gemini_Plaintext_Check')
    );

    await page.reload();

    // Export keys-only
    const backupPage = new BackupRestorePage(page);
    const filePath = await backupPage.exportKeysOnly('SecurityTestPassword');

    // Parse backup
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    // CRITICAL: Scan for plaintext patterns
    const backupString = JSON.stringify(backup);

    const plaintextPatterns = [
      /sk-[a-zA-Z0-9]{40,}/,        // OpenAI actual keys
      /sk-ant-[a-zA-Z0-9-]{40,}/,   // Anthropic actual keys
      /AIza[a-zA-Z0-9_-]{39}/       // Google actual keys
    ];

    for (const pattern of plaintextPatterns) {
      const foundPlaintext = pattern.test(backupString);
      if (foundPlaintext) {
        console.error(`🚨 SECURITY VIOLATION: Plaintext API key found: ${pattern}`);
      }
      expect(foundPlaintext).toBe(false);
    }

    // Verify encryption flag set
    expect(backup.apiKeysEncrypted.encrypted).toBe(true);

    // Verify all keys are encrypted (long strings, no plaintext prefix)
    for (const provider of backup.apiKeysEncrypted.providers) {
      const apiKey = backup.apiKeysEncrypted.data[provider].apiKey;

      expect(apiKey.length).toBeGreaterThan(50); // Encrypted keys are long
      expect(apiKey).not.toMatch(/^sk-/);
      expect(apiKey).not.toMatch(/^sk-ant-/);
      expect(apiKey).not.toMatch(/^AIza/);
    }
  });

});
