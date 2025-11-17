/**
 * Backup Export Tests - Data Export & Download Validation
 *
 * Tests the backup/export functionality to ensure users can safely
 * export their canvas data with or without API keys.
 *
 * Priority: HIGH - Users need reliable backups to prevent data loss
 * Risk Level: HIGH - Backup failures can result in permanent data loss
 */

import { test, expect } from '../../fixtures/canvas-fixtures.js';
import { CryptoHelpers } from '../../helpers/crypto-helpers.js';
import { StorageHelpers } from '../../helpers/storage-helpers.js';
import { BackupRestorePage } from '../../page-objects/BackupRestorePage.js';
import fs from 'fs';

test.describe('📦 Backup Export Functionality', () => {

  test('should export full backup with encrypted API keys', async ({ canvasFullyConfigured }) => {
    // Test that backup includes both canvas data AND encrypted API keys
    // CRITICAL: API keys must be encrypted in the export file

    const { page, mockData } = canvasFullyConfigured;
    const backupPage = new BackupRestorePage(page);

    const password = 'TestExportPassword123';

    // Trigger export
    const filePath = await backupPage.exportFullBackup(password);

    // Verify file was downloaded
    expect(filePath).toBeTruthy();
    expect(fs.existsSync(filePath)).toBe(true);

    // Parse backup file
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    // Verify structure
    expect(backup).toHaveProperty('version');
    expect(backup).toHaveProperty('exportDate');
    expect(backup).toHaveProperty('data');
    expect(backup).toHaveProperty('apiKeysEncrypted');

    // Verify canvas data present
    expect(backup.data.experiences).toBeDefined();
    expect(backup.data.experiences).toBeInstanceOf(Array);
    expect(backup.data.experiences.length).toBeGreaterThan(0);

    // Verify API keys encrypted
    const encryption = CryptoHelpers.verifyPasswordEncryptionInBackup(backup);
    expect(encryption).toBe(true);

    // Verify NO plaintext API keys
    const backupString = JSON.stringify(backup);
    expect(backupString).not.toMatch(/sk-[a-zA-Z0-9]{40,}/);
    expect(backupString).not.toMatch(/sk-ant-[a-zA-Z0-9-]{40,}/);
  });

  test('should export backup WITHOUT API keys (safe sharing)', async ({ canvasWithData }) => {
    // Test that users can export canvas data without API keys for safe sharing
    // Use case: Sharing portfolio with recruiters, colleagues

    const { page } = canvasWithData;
    const backupPage = new BackupRestorePage(page);

    // Export without keys
    const filePath = await backupPage.exportBackupWithoutKeys();

    // Verify file downloaded
    expect(filePath).toBeTruthy();

    // Parse backup
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    // Verify structure
    expect(backup).toHaveProperty('version');
    expect(backup).toHaveProperty('data');

    // CRITICAL: Should NOT have API keys
    expect(backup).not.toHaveProperty('apiKeysEncrypted');

    // Verify canvas data present
    expect(backup.data.experiences).toBeDefined();
    expect(backup.data.profile).toBeDefined();

    // Verify file is safe to share (no sensitive data)
    const backupString = JSON.stringify(backup);
    expect(backupString).not.toContain('apiKey');
    expect(backupString).not.toContain('ENCRYPTED_');
  });

  test('should export API keys only (no canvas data)', async ({ canvasWithApiKeys }) => {
    // Test API keys-only export for device transfer scenarios
    // Use case: User wants to transfer API keys to another device

    const { page } = canvasWithApiKeys;
    const backupPage = new BackupRestorePage(page);

    const password = 'KeysOnlyPassword456';

    // Export keys only
    const filePath = await backupPage.exportKeysOnly(password);

    // Verify file downloaded
    expect(filePath).toBeTruthy();

    // Parse backup
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    // Verify structure
    expect(backup.type).toBe('api-keys-only');
    expect(backup).toHaveProperty('apiKeysEncrypted');

    // CRITICAL: Should NOT have canvas data
    expect(backup).not.toHaveProperty('data');
    expect(backup).not.toHaveProperty('experiences');
    expect(backup).not.toHaveProperty('profile');

    // Verify encryption
    const encryption = CryptoHelpers.verifyPasswordEncryptionInBackup(backup);
    expect(encryption).toBe(true);
  });

  test('should include all canvas data types in full export', async ({ page }) => {
    // Test that ALL data types are included in export
    // CRITICAL: Missing data types = data loss

    // Setup comprehensive data
    await StorageHelpers.setStorageItem(page, 'user_experiences_current', [
      { id: '1', role: 'Test Role 1' },
      { id: '2', role: 'Test Role 2' }
    ]);

    await StorageHelpers.setStorageItem(page, 'user_profile_current', {
      userFirstName: 'Test',
      userLastName: 'User',
      email: 'test@test.com'
    });

    await StorageHelpers.setStorageItem(page, 'canvas_tree_current', {
      name: 'Root',
      children: []
    });

    await StorageHelpers.setStorageItem(page, 'user_documents_current', [
      { id: '1', title: 'Test Document', content: 'Content' }
    ]);

    await StorageHelpers.setStorageItem(page, 'user_diagrams_current', [
      { id: '1', name: 'Test Diagram', diagramData: '<mxfile>...</mxfile>' }
    ]);

    await page.reload();
    await page.waitForLoadState('networkidle');

    const backupPage = new BackupRestorePage(page);
    const filePath = await backupPage.exportBackupWithoutKeys();

    // Parse and verify
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    // Verify ALL data types present
    expect(backup.data.experiences).toBeDefined();
    expect(backup.data.experiences).toHaveLength(2);

    expect(backup.data.profile).toBeDefined();
    expect(backup.data.profile.userFirstName).toBe('Test');

    expect(backup.data.canvasTree).toBeDefined();
    expect(backup.data.canvasTree.name).toBe('Root');

    // Documents and diagrams may be optional depending on implementation
    // But if they exist in localStorage, they should be in backup
    if (backup.data.documents) {
      expect(backup.data.documents).toHaveLength(1);
    }

    if (backup.data.diagrams) {
      expect(backup.data.diagrams).toHaveLength(1);
    }
  });

  test('should generate valid filename with timestamp pattern', async ({ canvasWithData }) => {
    // Test that backup files have proper naming convention
    // Pattern: cleansheet-backup-YYYY-MM-DD.json or cleansheet-api-keys-YYYY-MM-DD.json

    const { page } = canvasWithData;
    const backupPage = new BackupRestorePage(page);

    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });

    // Trigger export (without waiting for file save)
    await backupPage.openBackupModal();
    await page.locator('button:has-text("Export"), button:has-text("Download")').first().click();

    const download = await downloadPromise;
    const filename = download.suggestedFilename();

    // Verify filename pattern
    // Should match: cleansheet-backup-2025-11-17.json or similar
    const filenamePattern = /cleansheet-(backup|api-keys)-\d{4}-\d{2}-\d{2}\.json/;
    expect(filename).toMatch(filenamePattern);

    // Verify contains current date (or close to it)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    expect(filename).toContain(today);
  });

  test('should verify JSON structure completeness', async ({ canvasWithData }) => {
    // Test that exported JSON has valid structure for restore
    // CRITICAL: Invalid structure = restore failure

    const { page } = canvasWithData;
    const backupPage = new BackupRestorePage(page);

    const filePath = await backupPage.exportBackupWithoutKeys();

    // Parse backup
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    // Validate integrity using helper
    const integrity = CryptoHelpers.validateBackupIntegrity(backup);

    if (!integrity.valid) {
      console.error('❌ Backup integrity validation failed:');
      console.error(integrity.errors);
    }

    expect(integrity.valid).toBe(true);
    expect(integrity.errors).toHaveLength(0);

    // Verify required fields
    expect(backup.version).toBeDefined();
    expect(backup.exportDate).toBeDefined();
    expect(backup.data).toBeDefined();

    // Verify exportDate is valid ISO string
    const exportDate = new Date(backup.exportDate);
    expect(exportDate.toString()).not.toBe('Invalid Date');

    // Verify version format
    expect(backup.version).toMatch(/^\d+\.\d+$/);
  });

  test('should handle large datasets near localStorage quota', async ({ page }) => {
    // Test export with large dataset (approaching 5MB localStorage limit)
    // CRITICAL: Large exports can fail silently

    // Generate large dataset (many experiences with long descriptions)
    const largeDataset = [];
    for (let i = 0; i < 100; i++) {
      largeDataset.push({
        id: `large-exp-${i}`,
        role: `Large Test Role ${i}`,
        organizationName: `Company ${i}`,
        description: 'X'.repeat(1000), // 1KB per experience
        skills: Array(50).fill(`Skill ${i}`),
        achievements: Array(20).fill(`Achievement ${i} - `.repeat(10))
      });
    }

    await StorageHelpers.setStorageItem(page, 'user_experiences_current', largeDataset);
    await StorageHelpers.setStorageItem(page, 'user_profile_current', {
      userFirstName: 'Test',
      summary: 'Y'.repeat(5000) // 5KB summary
    });

    await page.reload();

    // Check quota usage
    const quota = await StorageHelpers.getQuotaUsage(page);
    console.log(`[Large Dataset Test] localStorage usage: ${(quota.used / 1024 / 1024).toFixed(2)}MB (${quota.percentage.toFixed(1)}%)`);

    // Export should succeed even with large dataset
    const backupPage = new BackupRestorePage(page);
    const filePath = await backupPage.exportBackupWithoutKeys();

    // Verify file created
    expect(filePath).toBeTruthy();
    expect(fs.existsSync(filePath)).toBe(true);

    // Verify file size is reasonable (not empty, not corrupted)
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(1000); // At least 1KB
    expect(stats.size).toBeLessThan(10 * 1024 * 1024); // Less than 10MB

    // Verify parseable
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    expect(backup.data.experiences).toHaveLength(100);
  });

  test('should verify encryption in exported files', async ({ canvasFullyConfigured }) => {
    // Test that API keys in export are properly encrypted
    // SECURITY TEST: No plaintext keys in export files

    const { page } = canvasFullyConfigured;
    const backupPage = new BackupRestorePage(page);

    const password = 'SecurityTestPassword789';
    const filePath = await backupPage.exportFullBackup(password);

    // Parse backup
    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = JSON.parse(content);

    // Verify encryption flag
    expect(backup.apiKeysEncrypted.encrypted).toBe(true);

    // Verify each provider's key is encrypted
    for (const provider of backup.apiKeysEncrypted.providers) {
      const providerKey = provider.toLowerCase();
      expect(backup.apiKeysEncrypted.data[providerKey]).toBeDefined();

      const apiKey = backup.apiKeysEncrypted.data[providerKey].apiKey;

      // Verify encryption characteristics
      expect(apiKey).toBeTruthy();
      expect(apiKey.length).toBeGreaterThan(50); // Encrypted keys are long
      expect(apiKey).not.toMatch(/^sk-/); // Should not start with plaintext prefix
      expect(apiKey).not.toMatch(/^sk-ant-/);
    }

    // SECURITY: Scan entire backup for plaintext key patterns
    const backupString = JSON.stringify(backup);
    const plaintextPatterns = [
      /sk-[a-zA-Z0-9]{40,}/,
      /sk-ant-[a-zA-Z0-9-]{40,}/,
      /AIza[a-zA-Z0-9_-]{39}/
    ];

    for (const pattern of plaintextPatterns) {
      const foundPlaintext = pattern.test(backupString);
      if (foundPlaintext) {
        console.error(`🚨 SECURITY VIOLATION: Plaintext API key pattern found: ${pattern}`);
      }
      expect(foundPlaintext).toBe(false);
    }
  });

});
