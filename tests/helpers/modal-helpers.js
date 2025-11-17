/**
 * ModalHelpers - Utilities for interacting with modals and slideouts
 *
 * Handles the complexity of modal/slideout timing, animations, and z-index layers.
 */

export class ModalHelpers {
  /**
   * Wait for a modal to appear and become interactive
   *
   * @param {Page} page - Playwright page object
   * @param {string} modalSelector - CSS selector for the modal
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   */
  static async waitForModal(page, modalSelector, timeout = 5000) {
    // Wait for modal to be visible
    await page.waitForSelector(modalSelector, {
      state: 'visible',
      timeout
    });

    // Wait for any CSS transition animations to complete
    // From CLAUDE.md: standard transition is 0.2s, slideout is 0.4s
    await page.waitForTimeout(500);

    // Verify modal is actually interactive (not just visible but disabled)
    const isInteractive = await page.locator(modalSelector).evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.pointerEvents !== 'none' && style.display !== 'none';
    });

    if (!isInteractive) {
      throw new Error(`Modal ${modalSelector} is visible but not interactive`);
    }
  }

  /**
   * Close a modal by clicking its close button
   *
   * @param {Page} page - Playwright page object
   * @param {string} modalSelector - CSS selector for the modal
   * @param {string} closeButtonSelector - Optional custom close button selector
   */
  static async closeModal(page, modalSelector, closeButtonSelector = null) {
    // Default close button selectors to try
    const defaultSelectors = [
      `${modalSelector} .modal-close`,
      `${modalSelector} .close-button`,
      `${modalSelector} button[aria-label="Close"]`,
      `${modalSelector} .ph-x`  // Phosphor Icons close icon
    ];

    const selectorsToTry = closeButtonSelector
      ? [closeButtonSelector]
      : defaultSelectors;

    // Try each selector until one works
    for (const selector of selectorsToTry) {
      const closeButton = page.locator(selector);
      if (await closeButton.isVisible()) {
        await closeButton.click();

        // Wait for modal to be hidden
        await page.waitForSelector(modalSelector, {
          state: 'hidden',
          timeout: 2000
        });

        return;
      }
    }

    throw new Error(`Could not find close button for modal: ${modalSelector}`);
  }

  /**
   * Wait for a slideout panel to open (from CLAUDE.md: 60% width, 400ms transition)
   *
   * @param {Page} page - Playwright page object
   * @param {string} slideoutSelector - CSS selector for the slideout
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   */
  static async waitForSlideout(page, slideoutSelector, timeout = 5000) {
    await page.waitForSelector(slideoutSelector, {
      state: 'visible',
      timeout
    });

    // Wait for slide animation (400ms from CLAUDE.md, plus buffer)
    await page.waitForTimeout(500);

    // Verify slideout is positioned correctly (should have right: 0)
    const isOpen = await page.locator(slideoutSelector).evaluate(el => {
      const style = window.getComputedStyle(el);
      const right = parseInt(style.right);
      return right === 0 || right < 10; // Allow for slight variations
    });

    if (!isOpen) {
      throw new Error(`Slideout ${slideoutSelector} is visible but not in open position`);
    }
  }

  /**
   * Close a slideout panel
   *
   * @param {Page} page - Playwright page object
   * @param {string} slideoutSelector - CSS selector for the slideout
   */
  static async closeSlideout(page, slideoutSelector) {
    await this.closeModal(page, slideoutSelector);
  }

  /**
   * Check if a modal is currently visible
   *
   * @param {Page} page - Playwright page object
   * @param {string} modalSelector - CSS selector for the modal
   * @returns {Promise<boolean>}
   */
  static async isModalVisible(page, modalSelector) {
    const modal = page.locator(modalSelector);
    return await modal.isVisible();
  }

  /**
   * Check if a modal is currently open (visible AND display flex/block)
   *
   * @param {Page} page - Playwright page object
   * @param {string} modalSelector - CSS selector for the modal
   * @returns {Promise<boolean>}
   */
  static async isModalOpen(page, modalSelector) {
    return await page.locator(modalSelector).evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.display === 'flex' || style.display === 'block';
    });
  }

  /**
   * Verify z-index layering for nested modals
   * Ensures that when multiple modals are open, they stack correctly
   *
   * @param {Page} page - Playwright page object
   * @param {string} lowerModal - Selector for the lower modal
   * @param {string} upperModal - Selector for the upper modal
   * @returns {Promise<boolean>} - True if properly stacked
   */
  static async verifyModalStacking(page, lowerModal, upperModal) {
    const zIndexes = await page.evaluate(({ lower, upper }) => {
      const lowerEl = document.querySelector(lower);
      const upperEl = document.querySelector(upper);

      if (!lowerEl || !upperEl) {
        return { lowerZ: null, upperZ: null };
      }

      const lowerStyle = window.getComputedStyle(lowerEl);
      const upperStyle = window.getComputedStyle(upperEl);

      return {
        lowerZ: parseInt(lowerStyle.zIndex) || 0,
        upperZ: parseInt(upperStyle.zIndex) || 0
      };
    }, { lower: lowerModal, upper: upperModal });

    if (zIndexes.lowerZ === null || zIndexes.upperZ === null) {
      throw new Error('One or both modals not found for z-index verification');
    }

    return zIndexes.upperZ > zIndexes.lowerZ;
  }

  /**
   * Wait for modal overlay (backdrop) to appear
   *
   * @param {Page} page - Playwright page object
   * @param {string} overlaySelector - CSS selector for the overlay
   */
  static async waitForOverlay(page, overlaySelector = '.modal-overlay') {
    await page.waitForSelector(overlaySelector, { state: 'visible' });
    await page.waitForTimeout(200); // Wait for fade-in animation
  }

  /**
   * Click the modal overlay to close modal (if dismissable)
   *
   * @param {Page} page - Playwright page object
   * @param {string} overlaySelector - CSS selector for the overlay
   */
  static async clickOverlayToClose(page, overlaySelector = '.modal-overlay') {
    await page.locator(overlaySelector).click();
    await page.waitForTimeout(300); // Wait for close animation
  }

  /**
   * Handle confirmation dialog within a modal
   *
   * @param {Page} page - Playwright page object
   * @param {Function} action - Function that triggers the confirmation
   * @param {boolean} confirm - True to confirm, false to cancel
   */
  static async handleConfirmation(page, action, confirm = true) {
    // Setup dialog handler BEFORE triggering action
    page.once('dialog', async dialog => {
      if (confirm) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });

    // Trigger the action that causes confirmation
    await action();

    // Wait for dialog to be handled
    await page.waitForTimeout(500);
  }

  /**
   * Open a modal and wait for it to be ready
   *
   * @param {Page} page - Playwright page object
   * @param {string} triggerSelector - Selector for button/element that opens modal
   * @param {string} modalSelector - Selector for the modal that will appear
   */
  static async openModal(page, triggerSelector, modalSelector) {
    await page.locator(triggerSelector).click();
    await this.waitForModal(page, modalSelector);
  }

  /**
   * Fill a form inside a modal
   *
   * @param {Page} page - Playwright page object
   * @param {string} modalSelector - Selector for the modal
   * @param {Object} formData - Object mapping field names to values
   */
  static async fillModalForm(page, modalSelector, formData) {
    const modal = page.locator(modalSelector);

    for (const [fieldName, value] of Object.entries(formData)) {
      // Try multiple selector strategies
      const selectors = [
        `${modalSelector} input[name="${fieldName}"]`,
        `${modalSelector} input[id="${fieldName}"]`,
        `${modalSelector} textarea[name="${fieldName}"]`,
        `${modalSelector} select[name="${fieldName}"]`
      ];

      let filled = false;
      for (const selector of selectors) {
        const field = page.locator(selector);
        if (await field.isVisible()) {
          // Handle different input types
          const tagName = await field.evaluate(el => el.tagName.toLowerCase());

          if (tagName === 'select') {
            await field.selectOption(value);
          } else {
            await field.fill(value);
          }

          filled = true;
          break;
        }
      }

      if (!filled) {
        throw new Error(`Could not find or fill field: ${fieldName} in modal ${modalSelector}`);
      }
    }
  }

  /**
   * Submit a modal form
   *
   * @param {Page} page - Playwright page object
   * @param {string} modalSelector - Selector for the modal
   * @param {string} submitSelector - Optional custom submit button selector
   */
  static async submitModalForm(page, modalSelector, submitSelector = null) {
    const defaultSelectors = [
      `${modalSelector} button[type="submit"]`,
      `${modalSelector} button:has-text("Save")`,
      `${modalSelector} button:has-text("Submit")`,
      `${modalSelector} button:has-text("Confirm")`
    ];

    const selectorsToTry = submitSelector
      ? [submitSelector]
      : defaultSelectors;

    for (const selector of selectorsToTry) {
      const submitButton = page.locator(selector);
      if (await submitButton.isVisible()) {
        await submitButton.click();
        return;
      }
    }

    throw new Error(`Could not find submit button in modal: ${modalSelector}`);
  }

  /**
   * Verify toast notification appears
   *
   * @param {Page} page - Playwright page object
   * @param {string} expectedText - Expected toast message text
   * @param {string} type - Toast type ('success', 'error', 'info', 'warning')
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>}
   */
  static async verifyToast(page, expectedText, type = 'success', timeout = 5000) {
    const toastSelector = `.toast.${type}`;

    try {
      await page.waitForSelector(toastSelector, {
        state: 'visible',
        timeout
      });

      const toastText = await page.locator(toastSelector).textContent();
      return toastText.includes(expectedText);
    } catch {
      return false;
    }
  }
}
