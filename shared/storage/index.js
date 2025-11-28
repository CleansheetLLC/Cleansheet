/**
 * Cleansheet Storage Module - Entry Point
 *
 * Local-first encrypted storage for the Cleansheet platform.
 * Provides IndexedDB-backed storage with transparent AES-GCM encryption.
 *
 * Usage (Browser with script tags):
 *   <script src="https://unpkg.com/dexie@4/dist/dexie.min.js"></script>
 *   <script src="shared/cleansheet-crypto.js"></script>
 *   <script src="shared/storage/cleansheet-db.js"></script>
 *   <script src="shared/storage/dexie-backend.js"></script>
 *   <script src="shared/storage/encrypted-storage.js"></script>
 *   <script src="shared/storage/storage-service.js"></script>
 *
 *   <script>
 *     // Initialize on page load
 *     storageService.initialize().then(() => {
 *       console.log('Storage ready!');
 *     });
 *   </script>
 *
 * Usage (ES Modules):
 *   import { storageService } from './shared/storage/index.js';
 *   await storageService.initialize();
 *
 * @version 1.0.0
 * @date 2025-11-26
 */

(function(global) {
    'use strict';

    /**
     * Initialize the complete storage stack
     * Convenience function that ensures proper load order
     * @param {Object} config - Configuration options
     * @returns {Promise<Object>}
     */
    async function initializeStorage(config = {}) {
        // Check for required dependencies
        if (typeof Dexie === 'undefined') {
            throw new Error('[CleansheetStorage] Dexie.js not loaded. Include dexie.min.js first.');
        }

        if (typeof CleansheetCrypto === 'undefined') {
            throw new Error('[CleansheetStorage] CleansheetCrypto not loaded. Include cleansheet-crypto.js first.');
        }

        // Initialize the storage service
        const result = await global.storageService.initialize(config);

        console.log('[CleansheetStorage] Storage stack initialized');
        return result;
    }

    /**
     * Get the global storage service instance
     * @returns {StorageService}
     */
    function getStorageService() {
        if (!global.storageService) {
            throw new Error('[CleansheetStorage] Storage service not created. Scripts not loaded in correct order.');
        }
        return global.storageService;
    }

    /**
     * Storage module metadata
     */
    const StorageModule = {
        version: '1.0.0',
        name: 'CleansheetStorage',

        // Export all components for advanced usage
        get Database() { return global.CleansheetDatabase; },
        get DexieBackend() { return global.DexieBackend; },
        get EncryptedStorage() { return global.EncryptedStorage; },
        get StorageService() { return global.StorageService; },

        // Convenience accessors
        get db() { return global.cleansheetDb; },
        get service() { return global.storageService; },

        // Initialize function
        initialize: initializeStorage,
        getService: getStorageService
    };

    // Export to global scope
    global.CleansheetStorage = StorageModule;

    // ES Module exports
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            CleansheetStorage: StorageModule,
            initializeStorage,
            getStorageService,
            // Re-export components
            CleansheetDatabase: global.CleansheetDatabase,
            DexieBackend: global.DexieBackend,
            EncryptedStorage: global.EncryptedStorage,
            StorageService: global.StorageService,
            cleansheetDb: global.cleansheetDb,
            storageService: global.storageService
        };
    }

    console.log('[CleansheetStorage] Module loaded - v1.0.0');

})(typeof window !== 'undefined' ? window : global);
