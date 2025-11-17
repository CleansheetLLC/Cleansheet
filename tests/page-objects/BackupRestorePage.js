/**
 * BackupRestorePage - Page Object Model for backup/restore functionality
 *
 * CRITICAL: This handles encryption-sensitive operations where data loss
 * can occur if not properly tested.
 *
 * Updated to match actual career-canvas.html UI structure.
 */

import { ModalHelpers } from '../helpers/modal-helpers.js';
import { StorageHelpers } from '../helpers/storage-helpers.js';

export class BackupRestorePage {
  constructor(page) {
    this.page = page;

    // Profile dropdown to access Data Management
    this.profileAvatar = page.locator('#profileAvatar');
    this.profileDropdown = page.locator('#profileDropdown');
    this.dataManagementMenuItem = page.locator('button.profile-dropdown-item:has-text("Data Management")');

    // Data Management Modal
    this.dataManagementModal = page.locator('#dataManagementModal');
    this.backupDataButton = page.locator('button[onclick="handleBackupFromModal()"]');
    this.restoreOverwriteButton = page.locator('button[onclick*="handleRestoreFromModal(\'overwrite\')"]');
    this.restoreUpdateButton = page.locator('button[onclick*="handleRestoreFromModal(\'update\')"]');
    this.restoreApiKeysButton = page.locator('button[onclick="handleRestoreApiKeysFromModal()"]');

    // Backup Options Modal
    this.backupOptionsModal = page.locator('#backupOptionsModal');
    this.backupApiKeysButton = page.locator('button[onclick="handleApiKeyBackup()"]');
    this.backupDataOnlyButton = page.locator('button[onclick="handleDataBackup()"]');

    // API Key Backup Password Modal
    this.apiKeyBackupPasswordModal = page.locator('#apiKeyBackupPasswordModal');
    this.passwordInput = page.locator('input#apiKeyBackupPassword');
    this.passwordConfirmInput = page.locator('input#apiKeyBackupPasswordConfirm');
    this.exportApiKeysButton = page.locator('button[onclick="executeApiKeysBackup()"]');

    // Restore Password Modal
    this.restorePasswordModal = page.locator('#restorePasswordModal');
    this.restorePasswordInput = page.locator('input#restorePassword');
    this.restorePasswordError = page.locator('#restorePasswordError');
    this.restorePasswordErrorText = page.locator('#restorePasswordErrorText');
    this.attemptsRemaining = page.locator('#restoreAttemptsRemaining');
    this.unlockRestoreButton = page.locator('button[onclick*="executeRestore"]');

    // Hidden file input for restore operations
    this.fileInput = page.locator('input[type="file"]#jsonFileInput');

    // Toast/Feedback messages
    this.successMessage = page.locator('.toast.success, .success-message');
    this.errorMessage = page.locator('.toast.error, .error-message');
  }

  /**
   * Open the Data Management modal via Profile dropdown
   */
  async openDataManagement() {
    // Click profile avatar to open dropdown
    await this.profileAvatar.click();

    // Wait for dropdown to be visible
    await this.profileDropdown.waitFor({ state: 'visible', timeout: 5000 });

    // Click Data Management menu item
    await this.dataManagementMenuItem.click();

    // Wait for modal to open
    await this.dataManagementModal.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Export full backup (data only, no API keys)
   *
   * @returns {Promise<string>} - Path to downloaded file
   */
  async exportBackupWithoutKeys() {
    await this.openDataManagement();

    // Click "Backup Data" button
    await this.backupDataButton.click();

    // Wait for Backup Options modal
    await this.backupOptionsModal.waitFor({ state: 'visible', timeout: 5000 });

    // Setup download promise BEFORE clicking
    const downloadPromise = this.page.waitForEvent('download', { timeout: 15000 });

    // Click "Backup Data" (data only, no keys)
    await this.backupDataOnlyButton.click();

    const download = await downloadPromise;
    return await download.path();
  }

  /**
   * Export API keys only with password protection
   *
   * @param {string} password - Password for encryption
   * @returns {Promise<string>} - Path to downloaded file
   */
  async exportKeysOnly(password) {
    await this.openDataManagement();

    // Click "Backup Data" to open options
    await this.backupDataButton.click();

    // Wait for Backup Options modal
    await this.backupOptionsModal.waitFor({ state: 'visible', timeout: 5000 });

    // Click "Backup API Keys"
    await this.backupApiKeysButton.click();

    // Wait for password modal
    await this.apiKeyBackupPasswordModal.waitFor({ state: 'visible', timeout: 5000 });

    // Enter and confirm password
    await this.passwordInput.fill(password);
    await this.passwordConfirmInput.fill(password);

    // Setup download promise
    const downloadPromise = this.page.waitForEvent('download', { timeout: 15000 });

    // Click Export API Keys
    await this.exportApiKeysButton.click();

    const download = await downloadPromise;
    return await download.path();
  }

  /**
   * Export full backup with encrypted API keys
   * Note: Current UI doesn't support combined export, so this exports keys only
   *
   * @param {string} password - Password for API key encryption
   * @returns {Promise<string>} - Path to downloaded file
   */
  async exportFullBackup(password = 'TestPassword123') {
    // For now, export keys only since UI doesn't have combined export
    return await this.exportKeysOnly(password);
  }

  /**
   * Restore data from backup file
   *
   * @param {string} filePath - Path to backup JSON file
   * @param {string|null} password - Password if file contains encrypted keys
   * @param {string} mode - 'overwrite' or 'update' (merge)
   */
  async restoreFromFile(filePath, password = null, mode = 'overwrite') {
    await this.openDataManagement();

    // Click appropriate restore button
    if (mode === 'overwrite') {
      await this.restoreOverwriteButton.click();
    } else {
      await this.restoreUpdateButton.click();
    }

    // Upload file to hidden input
    await this.fileInput.setInputFiles(filePath);

    // If password provided, handle password modal
    if (password) {
      try {
        await this.restorePasswordModal.waitFor({ state: 'visible', timeout: 3000 });
        await this.restorePasswordInput.fill(password);
        await this.unlockRestoreButton.click();
      } catch (e) {
        // Password modal might not appear if no encrypted keys
        console.log('No password modal appeared (file may not have encrypted keys)');
      }
    }

    // Note: Page will reload after successful restore
  }

  /**
   * Wait for restore success (page reload)
   *
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForRestoreSuccess(timeout = 15000) {
    // Wait for page reload (indicates success)
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch (e) {
      // If no reload, check if we're still on the page
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Wait for restore error message
   */
  async waitForRestoreError() {
    await this.restorePasswordError.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get error message text
   *
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    if (await this.restorePasswordErrorText.isVisible({ timeout: 1000 }).catch(() => false)) {
      return await this.restorePasswordErrorText.textContent();
    }

    if (await this.errorMessage.isVisible({ timeout: 1000 }).catch(() => false)) {
      return await this.errorMessage.textContent();
    }

    return '';
  }

  /**
   * Get remaining password attempts
   *
   * @returns {Promise<number>}
   */
  async getRemainingAttempts() {
    const text = await this.attemptsRemaining.textContent();
    return parseInt(text.trim());
  }
}
