/**
 * BackupFileHelpers - Utilities for creating and validating backup files
 *
 * These helpers ensure backup files have the correct format and properly
 * encrypted API keys for restore testing.
 */

import fs from 'fs';
import path from 'path';

export class BackupFileHelpers {
  /**
   * Verify that a backup file has encrypted API keys
   *
   * @param {string} filePath - Path to backup JSON file
   * @returns {Object} - Verification result { hasKeys: boolean, providers: Array, format: string, errors: Array }
   */
  static verifyBackupHasEncryptedKeys(filePath) {
    const result = {
      hasKeys: false,
      providers: [],
      format: 'unknown',
      errors: []
    };

    try {
      // Read and parse file
      const content = fs.readFileSync(filePath, 'utf-8');
      const backup = JSON.parse(content);

      // Check format version
      result.format = backup.version || 'unknown';

      // Check if apiKeysEncrypted exists
      if (!backup.apiKeysEncrypted) {
        result.errors.push('No apiKeysEncrypted property found');
        return result;
      }

      // Check if encrypted flag is set
      if (!backup.apiKeysEncrypted.encrypted) {
        result.errors.push('apiKeysEncrypted.encrypted is not true');
        return result;
      }

      // Check if providers list exists
      if (!backup.apiKeysEncrypted.providers || !Array.isArray(backup.apiKeysEncrypted.providers)) {
        result.errors.push('apiKeysEncrypted.providers is missing or not an array');
        return result;
      }

      result.providers = backup.apiKeysEncrypted.providers;

      // Check if providers have encrypted keys
      if (!backup.apiKeysEncrypted.data) {
        result.errors.push('apiKeysEncrypted.data is missing');
        return result;
      }

      // Verify each provider has an encrypted key
      for (const provider of result.providers) {
        const providerData = backup.apiKeysEncrypted.data[provider.toLowerCase()];
        if (!providerData) {
          result.errors.push(`Provider ${provider} has no data`);
          continue;
        }

        if (!providerData.apiKey) {
          result.errors.push(`Provider ${provider} has no apiKey`);
          continue;
        }

        // Check if key looks encrypted (not plaintext)
        if (providerData.apiKey.startsWith('sk-') || providerData.apiKey.startsWith('sk-ant-')) {
          result.errors.push(`Provider ${provider} has PLAINTEXT key (security violation!)`);
          continue;
        }

        // Verify key is long enough to be encrypted
        if (providerData.apiKey.length < 50) {
          result.errors.push(`Provider ${provider} key too short to be encrypted (${providerData.apiKey.length} chars)`);
        }
      }

      // If no errors found for all providers, mark as having keys
      if (result.errors.length === 0) {
        result.hasKeys = true;
      }

    } catch (error) {
      result.errors.push(`Failed to parse backup file: ${error.message}`);
    }

    return result;
  }

  /**
   * Create a backup file with properly encrypted API keys using actual export
   *
   * This uses the real export functionality to create a valid backup file
   * that can be used for restore testing.
   *
   * @param {Page} page - Playwright page object
   * @param {string} password - Password for API key encryption
   * @param {Object} options - Options { withData: boolean, withKeys: boolean }
   * @returns {Promise<string>} - Path to created backup file
   */
  static async createValidBackupFile(page, password = 'TestPassword123', options = {}) {
    const { withData = true, withKeys = true } = options;

    // Import BackupRestorePage dynamically to avoid circular dependency
    const { BackupRestorePage } = await import('../page-objects/BackupRestorePage.js');
    const backupPage = new BackupRestorePage(page);

    let filePath;

    if (withKeys && !withData) {
      // API keys only
      filePath = await backupPage.exportKeysOnly(password);
    } else if (withData && !withKeys) {
      // Data only
      filePath = await backupPage.exportBackupWithoutKeys();
    } else if (withData && withKeys) {
      // Both - export separately and merge
      // NOTE: UI doesn't support combined export, so we need to create it manually
      const dataPath = await backupPage.exportBackupWithoutKeys();
      const keysPath = await backupPage.exportKeysOnly(password);

      // Read both files
      const dataBackup = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      const keysBackup = JSON.parse(fs.readFileSync(keysPath, 'utf-8'));

      // Merge them
      const combined = {
        ...dataBackup,
        apiKeysEncrypted: keysBackup.apiKeysEncrypted
      };

      // Write combined file
      const timestamp = Date.now();
      const combinedPath = path.join(path.dirname(dataPath), `combined-backup-${timestamp}.json`);
      fs.writeFileSync(combinedPath, JSON.stringify(combined, null, 2));

      // Clean up temp files
      fs.unlinkSync(dataPath);
      fs.unlinkSync(keysPath);

      filePath = combinedPath;
    } else {
      throw new Error('Must specify at least withData or withKeys');
    }

    return filePath;
  }

  /**
   * Update existing backup file to v4.1 flat format
   *
   * @param {string} inputPath - Path to v2.0 backup file
   * @param {string} outputPath - Path for v4.1 output file
   */
  static convertBackupToV4(inputPath, outputPath) {
    const backup = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

    // If already v4+, just copy
    if (backup.version && parseFloat(backup.version) >= 4.0) {
      fs.copyFileSync(inputPath, outputPath);
      return;
    }

    // Convert nested v2.0 to flat v4.1
    const v4Backup = {
      version: '4.1',
      exportDate: backup.exportDate || new Date().toISOString(),

      // Flatten experiences
      experiences: backup.data?.experiences || backup.experiences || [],
      stories: backup.data?.stories || backup.stories || [],

      // Flatten profile fields to root
      userFirstName: backup.data?.profile?.userFirstName || backup.userFirstName || '',
      userLastName: backup.data?.profile?.userLastName || backup.userLastName || '',
      email: backup.data?.profile?.email || backup.email || '',
      targetRole: backup.data?.profile?.targetRole || backup.targetRole || '',
      yearsExperience: backup.data?.profile?.yearsExperience || backup.yearsExperience || 0,
      location: backup.data?.profile?.location || backup.location || '',

      // Canvas tree
      canvasTree: backup.data?.canvasTree || backup.canvasTree,

      // API keys (keep structure as-is)
      apiKeysEncrypted: backup.apiKeysEncrypted
    };

    fs.writeFileSync(outputPath, JSON.stringify(v4Backup, null, 2));
  }

  /**
   * Log detailed backup file analysis for debugging
   *
   * @param {string} filePath - Path to backup file
   */
  static debugBackupFile(filePath) {
    console.log(`\n📋 Backup File Analysis: ${path.basename(filePath)}`);
    console.log('='.repeat(60));

    const verification = BackupFileHelpers.verifyBackupHasEncryptedKeys(filePath);

    console.log(`Format: ${verification.format}`);
    console.log(`Has Encrypted Keys: ${verification.hasKeys ? '✅ YES' : '❌ NO'}`);
    console.log(`Providers: ${verification.providers.join(', ') || 'none'}`);

    if (verification.errors.length > 0) {
      console.log('\n⚠️ Issues Found:');
      verification.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    // Parse and show structure
    const backup = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log('\n📊 Structure:');
    console.log(`  - Version: ${backup.version}`);
    console.log(`  - Has 'data' wrapper: ${backup.data ? 'YES (nested v2.0)' : 'NO (flat v4.1)'}`);
    console.log(`  - Experiences: ${backup.experiences?.length || backup.data?.experiences?.length || 0}`);
    console.log(`  - apiKeysEncrypted: ${backup.apiKeysEncrypted ? 'YES' : 'NO'}`);

    if (backup.apiKeysEncrypted) {
      console.log(`    - Encrypted: ${backup.apiKeysEncrypted.encrypted}`);
      console.log(`    - Providers: ${backup.apiKeysEncrypted.providers?.join(', ')}`);
    }

    console.log('='.repeat(60) + '\n');
  }
}
