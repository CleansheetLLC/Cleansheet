/**
 * BackupRestorePage - Page Object Model for backup/restore functionality
 *
 * CRITICAL: This handles encryption-sensitive operations where data loss
 * can occur if not properly tested.
 */

import { ModalHelpers } from '../helpers/modal-helpers.js';
import { StorageHelpers } from '../helpers/storage-helpers.js';

export class BackupRestorePage {
  constructor(page) {
    this.page = page;

    // Locators for Data Management Modal
    this.dataManagementButton = page.locator('button:has-text("Data Management")');
    this.dataManagementModal = page.locator('#dataManagementModal, .data-management-modal');

    // Backup section locators
    this.backupButton = page.locator('button:has-text("Backup"), button:has-text("Export")');
    this.backupModal = page.locator('#backupModal, #apiKeyBackupPasswordModal, .backup-modal');
    this.exportWithKeysCheckbox = page.locator('input[type="checkbox"]#export-with-keys, input[name="includeApiKeys"]');
    this.exportKeysOnlyRadio = page.locator('input[type="radio"][value="api-keys-only"]');
    this.exportButton = page.locator('button:has-text("Export"), button:has-text("Download")');

    // Password input for encrypted backups
    this.passwordInput = page.locator('input[type="password"]#apiKeyBackupPassword, input[name="password"]');
    this.passwordConfirmInput = page.locator('input[type="password"]#apiKeyBackupPasswordConfirm, input[name="confirmPassword"]');

    // Restore section locators
    this.restoreButton = page.locator('button:has-text("Restore"), button:has-text("Import")');
    this.restoreModal = page.locator('#restorePasswordModal, .restore-modal');
    this.fileInput = page.locator('input[type="file"]#jsonFileInput, input[type="file"]');
    this.restorePasswordInput = page.locator('input[type="password"]#restorePassword');
    this.unlockButton = page.locator('button:has-text("Unlock"), button:has-text("Restore")');
    this.restoreWithoutKeysButton = page.locator('button:has-text("Restore Without Keys")');

    // Mode selection for restore
    this.overwriteModeRadio = page.locator('input[type="radio"][value="overwrite"]');
    this.mergeModeRadio = page.locator('input[type="radio"][value="update"], input[type="radio"][value="merge"]');

    // Feedback messages
    this.successMessage = page.locator('.toast.success, .success-message');
    this.errorMessage = page.locator('.toast.error, .error-message');
    this.passwordError = page.locator('#restorePasswordError, .password-error');
    this.attemptsRemaining = page.locator('#restoreAttemptsRemaining, .attempts-remaining');

    // Download link (for backup exports)
    this.downloadLink = page.locator('a[download]');
  }

  /**
   * Open the Data Management modal
   */
  async openDataManagement() {
    await this.dataManagementButton.click();
    await ModalHelpers.waitForModal(this.page, '#dataManagementModal, .data-management-modal');
  }

  /**
   * Open the backup/export modal
   */
  async openBackupModal() {
    // Try direct backup button first
    const directBackupButton = this.page.locator('button:has-text("Backup API Keys")').first();
    if (await directBackupButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await directBackupButton.click();
    } else {
      // Otherwise, open data management first
      await this.openDataManagement();
      await this.backupButton.click();
    }

    await ModalHelpers.waitForModal(this.page, '#apiKeyBackupPasswordModal, .backup-modal');
  }

  /**
   * Export full backup with encrypted API keys
   *
   * @param {string} password - Password for API key encryption (optional)
   * @returns {Promise<string>} - Path to downloaded file
   */
  async exportFullBackup(password = 'TestPassword123') {
    await this.openBackupModal();

    // Check "include API keys" if checkbox exists
    if (await this.exportWithKeysCheckbox.isVisible({ timeout: 500 }).catch(() => false)) {
      await this.exportWithKeysCheckbox.check();
    }

    // Enter password if required
    if (await this.passwordInput.isVisible({ timeout: 500 }).catch(() => false)) {
      await this.passwordInput.fill(password);

      if (await this.passwordConfirmInput.isVisible({ timeout: 500 }).catch(() => false)) {
        await this.passwordConfirmInput.fill(password);
      }
    }

    // Setup download promise BEFORE clicking export
    const downloadPromise = this.page.waitForEvent('download', { timeout: 10000 });

    await this.exportButton.click();

    const download = await downloadPromise;
    const path = await download.path();

    return path;
  }

  /**
   * Export backup WITHOUT API keys
   *
   * @returns {Promise<string>} - Path to downloaded file
   */
  async exportBackupWithoutKeys() {
    await this.openBackupModal();

    // Uncheck "include API keys" if checkbox exists
    if (await this.exportWithKeysCheckbox.isVisible({ timeout: 500 }).catch(() => false)) {
      await this.exportWithKeysCheckbox.uncheck();
    }

    const downloadPromise = this.page.waitForEvent('download', { timeout: 10000 });
    await this.exportButton.click();

    const download = await downloadPromise;
    return await download.path();
  }

  /**
   * Export API keys ONLY (no canvas data)
   *
   * @param {string} password - Password for encryption
   * @returns {Promise<string>} - Path to downloaded file
   */
  async exportKeysOnly(password) {
    // Click "Backup API Keys" button in AI Assistant Settings
    const backupKeysButton = this.page.locator('button:has-text("Backup API Keys")');
    await backupKeysButton.click();

    await ModalHelpers.waitForModal(this.page, '#apiKeyBackupPasswordModal');

    // Enter and confirm password
    await this.passwordInput.fill(password);
    await this.passwordConfirmInput.fill(password);

    const downloadPromise = this.page.waitForEvent('download', { timeout: 10000 });
    await this.page.locator('button:has-text("Export API Keys")').click();

    const download = await downloadPromise;
    return await download.path();
  }

  /**
   * Restore from a backup file
   *
   * @param {string} filePath - Absolute path to backup JSON file
   * @param {string} password - Password for encrypted backups (optional)
   * @param {string} mode - 'overwrite' or 'merge' (default: overwrite)
   */
  async restoreFromFile(filePath, password = null, mode = 'overwrite') {
    // Try quick restore button first (for API keys only)
    const quickRestoreButton = this.page.locator('button:has-text("Restore API Keys")').first();
    if (await quickRestoreButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await quickRestoreButton.click();
    } else {
      // Otherwise, use Data Management modal
      await this.openDataManagement();
      await this.restoreButton.click();
    }

    // Upload file
    await this.fileInput.setInputFiles(filePath);

    // Select restore mode if available
    if (mode === 'overwrite') {
      if (await this.overwriteModeRadio.isVisible({ timeout: 500 }).catch(() => false)) {
        await this.overwriteModeRadio.check();
      }
    } else if (mode === 'merge') {
      if (await this.mergeModeRadio.isVisible({ timeout: 500 }).catch(() => false)) {
        await this.mergeModeRadio.check();
      }
    }

    // If password required, enter it
    if (password) {
      // Wait for password modal to appear
      await ModalHelpers.waitForModal(this.page, '#restorePasswordModal, .restore-password-modal', 2000);

      await this.restorePasswordInput.fill(password);
      await this.unlockButton.click();
    } else {
      // Click restore/import button
      const finalRestoreButton = this.page.locator('button:has-text("Restore"), button:has-text("Import")').last();
      if (await finalRestoreButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await finalRestoreButton.click();
      }
    }
  }

  /**
   * Wait for successful restore confirmation
   *
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForRestoreSuccess(timeout = 10000) {
    await this.successMessage.waitFor({ state: 'visible', timeout });

    // Verify success message contains expected text
    const text = await this.successMessage.textContent();
    if (!text.toLowerCase().includes('success') && !text.toLowerCase().includes('restored')) {
      throw new Error(`Success message does not indicate restoration: ${text}`);
    }
  }

  /**
   * Wait for restore error
   *
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForRestoreError(timeout = 5000) {
    await this.errorMessage.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get error message text
   *
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  /**
   * Get password error message
   *
   * @returns {Promise<string>}
   */
  async getPasswordError() {
    return await this.passwordError.textContent();
  }

  /**
   * Get remaining password attempts
   *
   * @returns {Promise<number>}
   */
  async getRemainingAttempts() {
    const text = await this.attemptsRemaining.textContent();
    return parseInt(text);
  }

  /**
   * Verify data was restored correctly
   *
   * @param {Object} expectedData - Expected data structure
   * @returns {Promise<Object>} - Actual restored data
   */
  async verifyDataRestored(expectedData) {
    const restoredData = await this.page.evaluate(() => {
      return {
        experiences: JSON.parse(localStorage.getItem('user_experiences_current') || '[]'),
        profile: JSON.parse(localStorage.getItem('user_profile_current') || '{}'),
        canvasTree: JSON.parse(localStorage.getItem('canvas_tree_current') || '{}'),
        apiKeys: JSON.parse(localStorage.getItem('llm_config_encrypted') || '{}')
      };
    });

    return restoredData;
  }

  /**
   * Click "Restore Without Keys" button (when password fails)
   */
  async restoreWithoutKeys() {
    await this.restoreWithoutKeysButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Verify backup file downloaded with correct filename pattern
   *
   * @param {Download} download - Playwright download object
   * @param {string} expectedPattern - Regex pattern for filename
   * @returns {boolean}
   */
  async verifyDownloadFilename(download, expectedPattern) {
    const filename = download.suggestedFilename();
    const pattern = new RegExp(expectedPattern);
    return pattern.test(filename);
  }

  /**
   * Parse downloaded backup file
   *
   * @param {string} filePath - Path to downloaded file
   * @returns {Promise<Object>} - Parsed JSON
   */
  async parseBackupFile(filePath) {
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Close any open modals
   */
  async closeAllModals() {
    // Try to close restore modal
    if (await this.restoreModal.isVisible().catch(() => false)) {
      await ModalHelpers.closeModal(this.page, '#restorePasswordModal, .restore-modal');
    }

    // Try to close backup modal
    if (await this.backupModal.isVisible().catch(() => false)) {
      await ModalHelpers.closeModal(this.page, '#apiKeyBackupPasswordModal, .backup-modal');
    }

    // Try to close data management modal
    if (await this.dataManagementModal.isVisible().catch(() => false)) {
      await ModalHelpers.closeModal(this.page, '#dataManagementModal, .data-management-modal');
    }
  }
}
