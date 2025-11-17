/**
 * Backup Restore Tests - Data Import & Recovery Validation
 *
 * CRITICAL: These tests prevent data loss by ensuring restore functionality works correctly.
 * Failed restores can result in permanent loss of user data.
 *
 * Priority: CRITICAL
 * Risk Level: CRITICAL - Data loss prevention
 */

import { test, expect } from '../../fixtures/canvas-fixtures.js';
import { CryptoHelpers } from '../../helpers/crypto-helpers.js';
import { StorageHelpers } from '../../helpers/storage-helpers.js';
import { BackupRestorePage } from '../../page-objects/BackupRestorePage.js';
import path from 'path';
import fs from 'fs';

test.describe('🔄 Backup Restore Functionality - CRITICAL', () => {

  test.beforeEach(async ({ page }) => {
    // Start with clean slate for each restore test
    await page.goto('/web/career-canvas.html');
    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should restore full backup with correct password', async ({ page }) => {
    // CRITICAL: Main restore workflow must work
    // This is the happy path that users depend on

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/full-backup-with-keys.json');
    const password = 'TestPassword123';

    const backupPage = new BackupRestorePage(page);

    // Restore from backup
    await backupPage.restoreFromFile(backupPath, password);
    await backupPage.waitForRestoreSuccess(15000);

    // Verify data restored
    const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    expect(experiences).toBeTruthy();
    expect(experiences).toBeInstanceOf(Array);
    expect(experiences.length).toBeGreaterThan(0);

    // Verify profile restored
    const profile = await StorageHelpers.getStorageItem(page, 'user_profile_current');
    expect(profile).toBeTruthy();
    expect(profile.userFirstName).toBe('Test');

    // Verify API keys restored (encrypted)
    const apiKeys = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    expect(apiKeys.openai).toBeDefined();
    expect(apiKeys.openai.apiKey).toBeTruthy();

    // Verify encryption maintained
    const isEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    expect(isEncrypted).toBe(true);
  });

  test('should fail gracefully with incorrect password', async ({ page }) => {
    // CRITICAL: Must not restore with wrong password (security)
    // Must give clear feedback to user

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/full-backup-with-keys.json');
    const wrongPassword = 'WrongPassword456';

    const backupPage = new BackupRestorePage(page);

    // Attempt restore with wrong password
    await backupPage.restoreFromFile(backupPath, wrongPassword);
    await backupPage.waitForRestoreError();

    // Verify error message
    const errorText = await backupPage.getErrorMessage();
    expect(errorText.toLowerCase()).toContain('password');

    // Verify data NOT restored
    const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    expect(experiences).toBeFalsy(); // Should still be empty
  });

  test('should enforce password retry limit (3 attempts)', async ({ page }) => {
    // SECURITY: Prevent brute force password attacks
    // After 3 failed attempts, should lock out or offer alternative

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/full-backup-with-keys.json');

    const backupPage = new BackupRestorePage(page);

    // Attempt 1
    await backupPage.restoreFromFile(backupPath, 'wrong1');
    await backupPage.waitForRestoreError();

    let remaining = await backupPage.getRemainingAttempts();
    expect(remaining).toBe(2);

    // Attempt 2
    await page.reload(); // Re-open restore flow
    await backupPage.restoreFromFile(backupPath, 'wrong2');
    await backupPage.waitForRestoreError();

    remaining = await backupPage.getRemainingAttempts();
    expect(remaining).toBe(1);

    // Attempt 3 (final)
    await page.reload();
    await backupPage.restoreFromFile(backupPath, 'wrong3');
    await backupPage.waitForRestoreError();

    remaining = await backupPage.getRemainingAttempts();
    expect(remaining).toBe(0);

    // Verify lockout message
    const errorText = await backupPage.getErrorMessage();
    expect(errorText.toLowerCase()).toMatch(/maximum|attempts|locked/);
  });

  test('should restore backup without API keys', async ({ page }) => {
    // Test restore of canvas data only (no sensitive API keys)
    // Use case: Importing shared portfolio from colleague

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/backup-without-keys.json');

    const backupPage = new BackupRestorePage(page);

    // Restore (no password needed)
    await backupPage.restoreFromFile(backupPath);
    await backupPage.waitForRestoreSuccess();

    // Verify data restored
    const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    expect(experiences).toBeTruthy();
    expect(experiences.length).toBeGreaterThan(0);

    // Verify NO API keys restored
    const apiKeys = await StorageHelpers.getStorageItem(page, 'llm_config_encrypted');
    expect(apiKeys).toBeFalsy(); // Should be empty/null
  });

  test('should restore API keys only (no canvas data)', async ({ page }) => {
    // Test restore of just API keys for device transfer
    // Use case: Moving API keys to new browser/device

    // Setup existing canvas data (should NOT be overwritten)
    await StorageHelpers.setStorageItem(page, 'user_experiences_current', [
      { id: 'existing-1', role: 'Existing Experience' }
    ]);

    await page.reload();

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/api-keys-only.json');
    const password = 'TestPassword123';

    const backupPage = new BackupRestorePage(page);

    // Restore keys only
    await backupPage.restoreFromFile(backupPath, password);
    await backupPage.waitForRestoreSuccess();

    // Verify API keys restored
    const apiKeys = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    expect(apiKeys.openai).toBeDefined();
    expect(apiKeys.anthropic).toBeDefined();

    // CRITICAL: Verify existing canvas data NOT overwritten
    const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    expect(experiences).toHaveLength(1);
    expect(experiences[0].id).toBe('existing-1');
    expect(experiences[0].role).toBe('Existing Experience');
  });

  test('should handle overwrite mode (replace all data)', async ({ page }) => {
    // Test that overwrite mode completely replaces existing data
    // CRITICAL: User might lose data if they don't understand this mode

    // Setup existing data
    await StorageHelpers.setStorageItem(page, 'user_experiences_current', [
      { id: 'old-1', role: 'Old Experience 1' },
      { id: 'old-2', role: 'Old Experience 2' }
    ]);

    await page.reload();

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/backup-without-keys.json');

    const backupPage = new BackupRestorePage(page);

    // Restore in overwrite mode
    await backupPage.restoreFromFile(backupPath, null, 'overwrite');
    await backupPage.waitForRestoreSuccess();

    // Verify old data REPLACED (not merged)
    const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');

    // Should not contain old data
    const hasOldData = experiences.some(exp => exp.id === 'old-1' || exp.id === 'old-2');
    expect(hasOldData).toBe(false);

    // Should contain backup data
    expect(experiences.length).toBeGreaterThan(0);
    expect(experiences[0].id).toMatch(/test-exp/);
  });

  test('should handle merge/update mode (combine data)', async ({ page }) => {
    // Test that merge mode combines existing data with backup data
    // Use case: Importing additional experiences without losing existing ones

    // Setup existing data
    await StorageHelpers.setStorageItem(page, 'user_experiences_current', [
      { id: 'existing-1', role: 'Existing Role' }
    ]);

    await page.reload();

    const existingCount = 1;

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/backup-without-keys.json');

    const backupPage = new BackupRestorePage(page);

    // Restore in merge mode
    await backupPage.restoreFromFile(backupPath, null, 'merge');
    await backupPage.waitForRestoreSuccess();

    // Verify data MERGED (not replaced)
    const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');

    // Should have more than original count
    expect(experiences.length).toBeGreaterThan(existingCount);

    // Should still contain existing data
    const hasExisting = experiences.some(exp => exp.id === 'existing-1');
    expect(hasExisting).toBe(true);

    // Should also contain backup data
    const hasBackupData = experiences.some(exp => exp.id && exp.id.startsWith('test-exp'));
    expect(hasBackupData).toBe(true);
  });

  test('should handle backwards compatibility with old backup formats', async ({ page }) => {
    // Test that old backup file formats are automatically migrated
    // CRITICAL: Users with old backups must not lose data

    // Create a v1.0 format backup (simulate old format)
    const oldFormatBackup = {
      version: '1.0', // Old version
      exportDate: '2024-01-01T00:00:00.000Z',
      experiences: [ // Old: direct array, not nested in "data"
        { id: 'old-format-1', role: 'Old Format Experience' }
      ],
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    };

    const oldBackupPath = path.join(__dirname, '../../fixtures/backup-samples/v1-backup.json');
    fs.writeFileSync(oldBackupPath, JSON.stringify(oldFormatBackup, null, 2));

    const backupPage = new BackupRestorePage(page);

    // Should successfully restore despite old format
    await backupPage.restoreFromFile(oldBackupPath);
    await backupPage.waitForRestoreSuccess();

    // Verify data restored
    const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    expect(experiences).toBeTruthy();
    expect(experiences.length).toBeGreaterThan(0);

    // Cleanup
    if (fs.existsSync(oldBackupPath)) {
      fs.unlinkSync(oldBackupPath);
    }
  });

  test('should handle case sensitivity bug (regression test)', async ({ page }) => {
    // REGRESSION TEST: Providers were stored as 'OpenAI' but code expected 'openai'
    // This bug caused restore failures - ensure it's fixed

    // Create backup with mixed case provider names (old bug)
    const mixedCaseBackup = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      data: {
        experiences: [{ id: '1', role: 'Test' }]
      },
      apiKeysEncrypted: {
        encrypted: true,
        providers: ['OpenAI', 'Anthropic'], // Capitalized (old bug)
        activeProvider: 'OpenAI',
        data: {
          openai: { // But data keys are lowercase!
            apiKey: CryptoHelpers.mockEncrypt('sk-test-key'),
            model: 'gpt-4o'
          },
          anthropic: {
            apiKey: CryptoHelpers.mockEncrypt('sk-ant-test'),
            model: 'claude-sonnet-4-5-20250929'
          }
        }
      }
    };

    const mixedCasePath = path.join(__dirname, '../../fixtures/backup-samples/mixed-case-test.json');
    fs.writeFileSync(mixedCasePath, JSON.stringify(mixedCaseBackup, null, 2));

    const backupPage = new BackupRestorePage(page);

    // Should handle case mismatch gracefully
    await backupPage.restoreFromFile(mixedCasePath, 'TestPassword');
    await backupPage.waitForRestoreSuccess();

    // Verify API keys restored despite case mismatch
    const apiKeys = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}');
    });

    // Should have keys (case normalized)
    expect(apiKeys.openai || apiKeys.OpenAI).toBeDefined();

    // Cleanup
    if (fs.existsSync(mixedCasePath)) {
      fs.unlinkSync(mixedCasePath);
    }
  });

  test('should transition from empty state to populated state', async ({ page }) => {
    // Test the first-time user experience: empty → restore → populated
    // Use case: New user restoring from previous device

    // Verify empty state
    const initialExperiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    expect(initialExperiences).toBeFalsy(); // Should be null/empty

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/full-backup-with-keys.json');
    const password = 'TestPassword123';

    const backupPage = new BackupRestorePage(page);

    // Restore
    await backupPage.restoreFromFile(backupPath, password);
    await backupPage.waitForRestoreSuccess();

    // Verify populated
    const restoredExperiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    expect(restoredExperiences).toBeTruthy();
    expect(restoredExperiences.length).toBeGreaterThan(0);

    // Verify UI reflects populated state (not empty state)
    const chatInterface = page.locator('#chatInputContainer, .chat-interface');
    const emptyState = page.locator('#chatEmptyState, .empty-state');

    // Chat interface should be visible (or at least not empty state)
    const isEmpty = await emptyState.isVisible().catch(() => false);
    expect(isEmpty).toBe(false);
  });

  test('should handle NO_KEYS_FOUND error gracefully', async ({ page }) => {
    // Test error handling when backup claims to have keys but doesn't
    // This can happen with corrupted backups

    // Create malformed backup (says it has keys, but doesn't)
    const malformedBackup = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      data: {
        experiences: [{ id: '1', role: 'Test' }]
      },
      apiKeysEncrypted: {
        encrypted: true,
        providers: [], // Empty! Bug
        data: {} // No keys!
      }
    };

    const malformedPath = path.join(__dirname, '../../fixtures/backup-samples/malformed-test.json');
    fs.writeFileSync(malformedPath, JSON.stringify(malformedBackup, null, 2));

    const backupPage = new BackupRestorePage(page);

    // Should fail with specific error (not generic password error)
    await backupPage.restoreFromFile(malformedPath, 'TestPassword');
    await backupPage.waitForRestoreError();

    const errorText = await backupPage.getErrorMessage();

    // Should mention "no keys" not "incorrect password"
    expect(errorText.toLowerCase()).toMatch(/no.*keys|keys.*not.*found|corrupted/);
    expect(errorText.toLowerCase()).not.toContain('incorrect password');

    // Cleanup
    if (fs.existsSync(malformedPath)) {
      fs.unlinkSync(malformedPath);
    }
  });

  test('should verify decryption and re-encryption with device keys', async ({ page }) => {
    // CRITICAL SECURITY TEST: Device A → backup → Device B
    // Keys encrypted with Device A's key, must be re-encrypted with Device B's key

    const backupPath = path.join(__dirname, '../../fixtures/backup-samples/full-backup-with-keys.json');
    const password = 'TestPassword123';

    // Simulate Device A (initial state)
    await CryptoHelpers.injectMockEncryptedKey(
      page,
      'openai',
      'DEVICE_A_ENCRYPTED_KEY_12345'
    );

    // Get Device A's encrypted value
    const deviceAKey = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted')).openai.apiKey;
    });

    // Simulate Device B (clear storage, new device keys)
    await CryptoHelpers.simulateDeviceTransfer(page);
    await page.reload();

    // Restore on Device B
    const backupPage = new BackupRestorePage(page);
    await backupPage.restoreFromFile(backupPath, password);
    await backupPage.waitForRestoreSuccess();

    // Get Device B's encrypted value
    const deviceBKey = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}').openai?.apiKey;
    });

    // CRITICAL: Should be DIFFERENT (different device keys)
    expect(deviceBKey).toBeTruthy();
    expect(deviceBKey).not.toBe(deviceAKey);

    // But encryption should still be valid
    const isEncrypted = await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');
    expect(isEncrypted).toBe(true);
  });

});
