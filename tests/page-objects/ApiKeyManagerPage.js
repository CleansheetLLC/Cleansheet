/**
 * ApiKeyManagerPage - Page Object Model for API key management
 *
 * CRITICAL: Handles sensitive API key operations with encryption validation
 */

import { ModalHelpers } from '../helpers/modal-helpers.js';

export class ApiKeyManagerPage {
  constructor(page) {
    this.page = page;

    // Main settings button
    this.settingsButton = page.locator('button:has-text("AI Assistant Settings"), button:has-text("Set Up Now")');
    this.settingsModal = page.locator('#llmSettingsModal, .llm-settings-modal');

    // Provider table elements
    this.providerTable = page.locator('#providerConfigTable, table.provider-table');
    this.providerTableBody = page.locator('#providerTableBody, table.provider-table tbody');

    // Add key modal
    this.addKeyModal = page.locator('#addKeyModal, .add-key-modal');
    this.apiKeyInput = page.locator('#addKeyInput, input[name="apiKey"]');
    this.saveKeyButton = page.locator('button:has-text("Save Key")');

    // Provider-specific elements (will be parameterized)
    // These are template selectors - use getProviderSelector() to build actual selectors

    // Feedback messages
    this.successToast = page.locator('.toast.success');
    this.errorToast = page.locator('.toast.error');
    this.connectionStatus = page.locator('.connection-status');
  }

  /**
   * Build provider-specific selector
   *
   * @param {string} provider - Provider name ('openai', 'anthropic', 'gemini')
   * @param {string} element - Element type ('row', 'radio', 'key', 'model', 'copy', 'test', 'delete')
   * @returns {string} - CSS selector
   */
  getProviderSelector(provider, element) {
    const selectors = {
      row: `tr:has([value="${provider}"]), tr[data-provider="${provider}"]`,
      radio: `input[type="radio"][value="${provider}"]`,
      key: `.key-display[data-provider="${provider}"], td:has-text("sk-")`,
      model: `#model_${provider}, select[data-provider="${provider}"]`,
      addButton: `button:has-text("Add Key")[data-provider="${provider}"], tr[data-provider="${provider}"] button:has-text("Add")`,
      copyButton: `button[onclick*="copyApiKey('${provider}')"], button[data-action="copy"][data-provider="${provider}"]`,
      testButton: `button[onclick*="testProviderConnection('${provider}')"], button[data-action="test"][data-provider="${provider}"]`,
      deleteButton: `button[onclick*="deleteApiKey('${provider}')"], button[data-action="delete"][data-provider="${provider}"]`
    };

    return selectors[element] || '';
  }

  /**
   * Open AI Assistant Settings modal
   */
  async openApiKeySettings() {
    await this.settingsButton.click();
    await ModalHelpers.waitForModal(this.page, '#llmSettingsModal, .llm-settings-modal');
  }

  /**
   * Add API key for a provider
   *
   * @param {string} provider - Provider name ('openai', 'anthropic', 'gemini')
   * @param {string} apiKey - API key value
   */
  async addApiKey(provider, apiKey) {
    // If settings not open, open them
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    // Click "Add Key" button for the provider
    const addButtonSelector = this.getProviderSelector(provider, 'addButton');
    await this.page.locator(addButtonSelector).click();

    // Wait for add key modal
    await ModalHelpers.waitForModal(this.page, '#addKeyModal, .add-key-modal');

    // Enter API key
    await this.apiKeyInput.fill(apiKey);

    // Click Save
    await this.saveKeyButton.click();

    // Wait for success toast
    await this.successToast.waitFor({ state: 'visible', timeout: 5000 });

    // Wait for modal to close
    await this.page.waitForTimeout(500);
  }

  /**
   * Switch active provider
   *
   * @param {string} provider - Provider name
   */
  async switchProvider(provider) {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    const radioSelector = this.getProviderSelector(provider, 'radio');
    await this.page.locator(radioSelector).check();

    // Wait for confirmation
    await this.successToast.waitFor({ state: 'visible', timeout: 5000 });

    // Verify toast mentions provider change
    const toastText = await this.successToast.textContent();
    if (!toastText.toLowerCase().includes('provider') && !toastText.toLowerCase().includes(provider)) {
      throw new Error(`Provider switch success message unexpected: ${toastText}`);
    }
  }

  /**
   * Update model selection for a provider
   *
   * @param {string} provider - Provider name
   * @param {string} modelId - Model ID to select
   */
  async updateModel(provider, modelId) {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    const modelSelector = this.getProviderSelector(provider, 'model');
    await this.page.locator(modelSelector).selectOption(modelId);

    // Wait for auto-save confirmation
    await this.page.waitForTimeout(1000);

    // Verify model updated toast
    const toastVisible = await this.successToast.isVisible({ timeout: 2000 }).catch(() => false);
    if (toastVisible) {
      const toastText = await this.successToast.textContent();
      if (!toastText.toLowerCase().includes('model')) {
        console.warn(`Model update toast unexpected: ${toastText}`);
      }
    }
  }

  /**
   * Copy API key to clipboard
   *
   * @param {string} provider - Provider name
   */
  async copyApiKey(provider) {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    const copyButtonSelector = this.getProviderSelector(provider, 'copyButton');
    await this.page.locator(copyButtonSelector).click();

    // Wait for copy confirmation
    await this.successToast.waitFor({ state: 'visible', timeout: 5000 });

    const toastText = await this.successToast.textContent();
    if (!toastText.toLowerCase().includes('cop')) {
      throw new Error(`Copy success message unexpected: ${toastText}`);
    }
  }

  /**
   * Test connection for a provider
   *
   * @param {string} provider - Provider name
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async testConnection(provider) {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    const testButtonSelector = this.getProviderSelector(provider, 'testButton');
    await this.page.locator(testButtonSelector).click();

    // Wait for either success or error toast
    await Promise.race([
      this.successToast.waitFor({ state: 'visible', timeout: 10000 }),
      this.errorToast.waitFor({ state: 'visible', timeout: 10000 })
    ]);

    // Check which appeared
    const isSuccess = await this.successToast.isVisible().catch(() => false);
    const isError = await this.errorToast.isVisible().catch(() => false);

    if (isSuccess) {
      const message = await this.successToast.textContent();
      return { success: true, message };
    } else if (isError) {
      const message = await this.errorToast.textContent();
      return { success: false, message };
    } else {
      throw new Error('No toast appeared after connection test');
    }
  }

  /**
   * Delete API key
   *
   * @param {string} provider - Provider name
   * @param {boolean} confirm - Whether to confirm deletion (default: true)
   */
  async deleteApiKey(provider, confirm = true) {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    const deleteButtonSelector = this.getProviderSelector(provider, 'deleteButton');

    // Setup confirmation dialog handler
    if (confirm) {
      this.page.once('dialog', async dialog => {
        await dialog.accept();
      });
    } else {
      this.page.once('dialog', async dialog => {
        await dialog.dismiss();
      });
    }

    await this.page.locator(deleteButtonSelector).click();

    // Wait for dialog to be handled
    await this.page.waitForTimeout(500);

    if (confirm) {
      // Wait for success toast
      await this.successToast.waitFor({ state: 'visible', timeout: 5000 });

      const toastText = await this.successToast.textContent();
      if (!toastText.toLowerCase().includes('delet')) {
        throw new Error(`Delete success message unexpected: ${toastText}`);
      }
    }
  }

  /**
   * Verify API key is displayed (masked)
   *
   * @param {string} provider - Provider name
   * @returns {Promise<boolean>}
   */
  async verifyKeyDisplayed(provider) {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    const rowSelector = this.getProviderSelector(provider, 'row');
    const row = this.page.locator(rowSelector);

    // Check if row contains masked key pattern (sk-...xxxx or similar)
    const rowText = await row.textContent();

    return (
      rowText.includes('sk-...') ||
      rowText.includes('sk-ant-...') ||
      rowText.includes('...') // Generic masked pattern
    );
  }

  /**
   * Verify provider is active (radio button checked)
   *
   * @param {string} provider - Provider name
   * @returns {Promise<boolean>}
   */
  async verifyProviderActive(provider) {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    const radioSelector = this.getProviderSelector(provider, 'radio');
    return await this.page.locator(radioSelector).isChecked();
  }

  /**
   * Get all configured providers
   *
   * @returns {Promise<Array<string>>} - Array of provider names
   */
  async getConfiguredProviders() {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    // Get all rows that have a masked key displayed
    const rows = await this.providerTableBody.locator('tr').all();
    const configured = [];

    for (const row of rows) {
      const text = await row.textContent();
      if (text.includes('sk-...') || text.includes('...')) {
        // Extract provider name from radio button
        const radio = row.locator('input[type="radio"]');
        if (await radio.isVisible().catch(() => false)) {
          const value = await radio.getAttribute('value');
          configured.push(value);
        }
      }
    }

    return configured;
  }

  /**
   * Get active provider name
   *
   * @returns {Promise<string|null>} - Active provider name or null
   */
  async getActiveProvider() {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    const checkedRadio = this.page.locator('input[type="radio"][name="activeProvider"]:checked');
    if (await checkedRadio.isVisible().catch(() => false)) {
      return await checkedRadio.getAttribute('value');
    }

    return null;
  }

  /**
   * Close API key settings modal
   */
  async closeSettings() {
    if (await this.settingsModal.isVisible().catch(() => false)) {
      await ModalHelpers.closeModal(this.page, '#llmSettingsModal, .llm-settings-modal');
    }
  }

  /**
   * Verify empty state (no keys configured)
   *
   * @returns {Promise<boolean>}
   */
  async verifyEmptyState() {
    if (!await this.settingsModal.isVisible().catch(() => false)) {
      await this.openApiKeySettings();
    }

    // Check if "Add Key" buttons are visible for all providers
    const addButtons = this.page.locator('button:has-text("Add Key")');
    const count = await addButtons.count();

    // Should have at least 3 (one per provider)
    return count >= 3;
  }
}
