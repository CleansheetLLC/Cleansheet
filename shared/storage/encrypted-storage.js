/**
 * Encrypted Storage Middleware
 *
 * Wraps any IStorageBackend to provide transparent encryption/decryption.
 * Uses CleansheetCrypto for AES-GCM encryption with device/user-derived keys.
 *
 * All data in encrypted tables is automatically encrypted on write and
 * decrypted on read. Non-sensitive tables (settings, syncMeta) bypass encryption.
 *
 * @version 1.0.0
 * @date 2025-11-26
 */

(function(global) {
    'use strict';

    /**
     * EncryptedStorage - Encryption middleware for storage backends
     */
    class EncryptedStorage {
        /**
         * Create encrypted storage wrapper
         * @param {Object} backend - Storage backend implementing IStorageBackend
         * @param {Object} crypto - Encryption provider (default: CleansheetCrypto)
         */
        constructor(backend, crypto = null) {
            if (!backend) {
                throw new Error('[EncryptedStorage] Backend is required');
            }

            this.backend = backend;
            this.crypto = crypto || global.CleansheetCrypto;
            this.name = `encrypted-${backend.name}`;
            this.initialized = false;

            if (!this.crypto) {
                throw new Error('[EncryptedStorage] CleansheetCrypto not available. Include cleansheet-crypto.js first.');
            }

            // Tables that contain sensitive data requiring encryption
            this.encryptedTables = new Set([
                'profiles',
                'experiences',
                'stories',
                'jobs',
                'goals',
                'portfolio',
                'documents',
                'diagrams',
                'artifacts'
            ]);

            // Fields within items that contain the actual content to encrypt
            // Other fields (id, personaId, name, timestamps) remain unencrypted for indexing
            this.encryptedFields = [
                'content',      // Document content (Lexical blocks)
                'blocks',       // Alternative document content field
                'diagramData',  // Draw.io XML data
                'data',         // Generic data field
                'description',  // Detailed descriptions
                'notes',        // User notes
                'summary',      // Story summaries
                'situation',    // STAR story situation
                'task',         // STAR story task
                'action',       // STAR story action
                'result'        // STAR story result
            ];
        }

        // ==========================================
        // Lifecycle Methods
        // ==========================================

        /**
         * Initialize encrypted storage
         * @returns {Promise<{success: boolean}>}
         */
        async initialize() {
            if (this.initialized) {
                return { success: true };
            }

            try {
                // Initialize the underlying backend
                const backendResult = await this.backend.initialize();
                if (!backendResult.success) {
                    return backendResult;
                }

                // Ensure crypto is ready (derives key from user identifier)
                // CleansheetCrypto derives key on-demand, so just verify it works
                try {
                    const testEncrypted = await this.crypto.encrypt('test');
                    const testDecrypted = await this.crypto.decrypt(testEncrypted);
                    if (testDecrypted !== 'test') {
                        throw new Error('Encryption self-test failed');
                    }
                } catch (error) {
                    console.error('[EncryptedStorage] Crypto self-test failed:', error);
                    return { success: false, error: 'Encryption initialization failed' };
                }

                this.initialized = true;
                console.log('[EncryptedStorage] Initialized with', this.backend.name, 'backend');
                return { success: true };
            } catch (error) {
                console.error('[EncryptedStorage] Initialization failed:', error);
                return { success: false, error: error.message };
            }
        }

        /**
         * Check if the backend is available
         * @returns {Promise<boolean>}
         */
        async isAvailable() {
            return this.backend.isAvailable();
        }

        /**
         * Close the storage connection
         * @returns {Promise<void>}
         */
        async close() {
            await this.backend.close();
            this.initialized = false;
        }

        // ==========================================
        // Core CRUD with Encryption
        // ==========================================

        /**
         * Get and decrypt a single item
         * @param {string} table - Table name
         * @param {string|number} key - Primary key
         * @returns {Promise<any>}
         */
        async get(table, key) {
            const item = await this.backend.get(table, key);
            if (!item) return null;

            if (this.encryptedTables.has(table)) {
                return this._decryptItem(item);
            }
            return item;
        }

        /**
         * Get and decrypt all items
         * @param {string} table - Table name
         * @param {Object} options - Query options
         * @returns {Promise<Array>}
         */
        async getAll(table, options = {}) {
            const items = await this.backend.getAll(table, options);

            if (this.encryptedTables.has(table) && items.length > 0) {
                return Promise.all(items.map(item => this._decryptItem(item)));
            }
            return items;
        }

        /**
         * Encrypt and store an item
         * @param {string} table - Table name
         * @param {Object} item - Item to store
         * @returns {Promise<string|number>}
         */
        async put(table, item) {
            if (this.encryptedTables.has(table)) {
                item = await this._encryptItem(item);
            }
            return this.backend.put(table, item);
        }

        /**
         * Encrypt and insert a new item
         * @param {string} table - Table name
         * @param {Object} item - Item to insert
         * @returns {Promise<string|number>}
         */
        async add(table, item) {
            if (this.encryptedTables.has(table)) {
                item = await this._encryptItem(item);
            }
            return this.backend.add(table, item);
        }

        /**
         * Delete an item (no encryption needed)
         * @param {string} table - Table name
         * @param {string|number} key - Primary key
         * @returns {Promise<void>}
         */
        async delete(table, key) {
            return this.backend.delete(table, key);
        }

        /**
         * Check if item exists
         * @param {string} table - Table name
         * @param {string|number} key - Primary key
         * @returns {Promise<boolean>}
         */
        async exists(table, key) {
            return this.backend.exists(table, key);
        }

        // ==========================================
        // Bulk Operations with Encryption
        // ==========================================

        /**
         * Encrypt and store multiple items
         * @param {string} table - Table name
         * @param {Array} items - Items to store
         * @returns {Promise<void>}
         */
        async bulkPut(table, items) {
            if (this.encryptedTables.has(table)) {
                items = await Promise.all(items.map(item => this._encryptItem(item)));
            }
            return this.backend.bulkPut(table, items);
        }

        /**
         * Encrypt and insert multiple items
         * @param {string} table - Table name
         * @param {Array} items - Items to insert
         * @returns {Promise<Array>}
         */
        async bulkAdd(table, items) {
            if (this.encryptedTables.has(table)) {
                items = await Promise.all(items.map(item => this._encryptItem(item)));
            }
            return this.backend.bulkAdd(table, items);
        }

        /**
         * Delete multiple items
         * @param {string} table - Table name
         * @param {Array} keys - Primary keys
         * @returns {Promise<void>}
         */
        async bulkDelete(table, keys) {
            return this.backend.bulkDelete(table, keys);
        }

        /**
         * Get and decrypt multiple items
         * @param {string} table - Table name
         * @param {Array} keys - Primary keys
         * @returns {Promise<Array>}
         */
        async bulkGet(table, keys) {
            const items = await this.backend.bulkGet(table, keys);

            if (this.encryptedTables.has(table)) {
                return Promise.all(
                    items.map(item => item ? this._decryptItem(item) : null)
                );
            }
            return items;
        }

        // ==========================================
        // Pass-through Methods (No Encryption)
        // ==========================================

        /**
         * Execute a transaction
         * @param {Array<string>} tableNames - Tables to include
         * @param {Function} callback - Transaction callback
         * @returns {Promise}
         */
        async transaction(tableNames, callback) {
            return this.backend.transaction(tableNames, callback);
        }

        /**
         * Get storage usage
         * @returns {Promise<Object>}
         */
        async getUsage() {
            return this.backend.getUsage();
        }

        /**
         * Count items in a table
         * @param {string} table - Table name
         * @param {Object} options - Query options
         * @returns {Promise<number>}
         */
        async count(table, options = {}) {
            return this.backend.count(table, options);
        }

        /**
         * Clear a table
         * @param {string} table - Table name
         * @returns {Promise<void>}
         */
        async clearTable(table) {
            return this.backend.clearTable(table);
        }

        /**
         * Clear all tables
         * @returns {Promise<void>}
         */
        async clearAll() {
            return this.backend.clearAll();
        }

        /**
         * Generate a unique ID
         * @returns {string}
         */
        generateId() {
            return this.backend.generateId();
        }

        /**
         * Get table names
         * @returns {string[]}
         */
        getTableNames() {
            return this.backend.getTableNames();
        }

        // ==========================================
        // Encryption Helper Methods
        // ==========================================

        /**
         * Encrypt sensitive fields in an item
         * @private
         * @param {Object} item - Item to encrypt
         * @returns {Promise<Object>} - Item with encrypted fields
         */
        async _encryptItem(item) {
            const encrypted = { ...item, _encrypted: [] };

            for (const field of this.encryptedFields) {
                if (item[field] !== undefined && item[field] !== null) {
                    try {
                        // Convert to string if not already
                        const plaintext = typeof item[field] === 'string'
                            ? item[field]
                            : JSON.stringify(item[field]);

                        // Encrypt and store
                        encrypted[field] = await this.crypto.encrypt(plaintext);
                        encrypted._encrypted.push(field);
                    } catch (error) {
                        console.error(`[EncryptedStorage] Failed to encrypt field '${field}':`, error);
                        // Keep original value on encryption failure
                        encrypted[field] = item[field];
                    }
                }
            }

            return encrypted;
        }

        /**
         * Decrypt sensitive fields in an item
         * @private
         * @param {Object} item - Item with encrypted fields
         * @returns {Promise<Object>} - Item with decrypted fields
         */
        async _decryptItem(item) {
            if (!item._encrypted || item._encrypted.length === 0) {
                return item;
            }

            const decrypted = { ...item };

            for (const field of item._encrypted) {
                if (item[field]) {
                    try {
                        const plaintext = await this.crypto.decrypt(item[field]);

                        // Try to parse as JSON, fall back to string
                        try {
                            decrypted[field] = JSON.parse(plaintext);
                        } catch {
                            decrypted[field] = plaintext;
                        }
                    } catch (error) {
                        console.error(`[EncryptedStorage] Failed to decrypt field '${field}':`, error);
                        // Set to null on decryption failure (data may be corrupted)
                        decrypted[field] = null;
                    }
                }
            }

            // Remove encryption metadata from returned item
            delete decrypted._encrypted;
            return decrypted;
        }

        /**
         * Check if a table uses encryption
         * @param {string} table - Table name
         * @returns {boolean}
         */
        isEncryptedTable(table) {
            return this.encryptedTables.has(table);
        }

        /**
         * Add a field to the encrypted fields list
         * @param {string} field - Field name to encrypt
         */
        addEncryptedField(field) {
            this.encryptedFields.push(field);
        }

        /**
         * Remove a field from encryption
         * @param {string} field - Field name to stop encrypting
         */
        removeEncryptedField(field) {
            const index = this.encryptedFields.indexOf(field);
            if (index > -1) {
                this.encryptedFields.splice(index, 1);
            }
        }
    }

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { EncryptedStorage };
    }

    // Export to global scope for browser
    global.EncryptedStorage = EncryptedStorage;

    console.log('[EncryptedStorage] Middleware module loaded');

})(typeof window !== 'undefined' ? window : global);
