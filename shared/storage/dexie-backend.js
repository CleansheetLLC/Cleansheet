/**
 * Dexie Backend - IndexedDB Storage Operations
 *
 * Implements the IStorageBackend interface using Dexie.js.
 * Provides CRUD operations, bulk operations, queries, and storage management.
 *
 * @version 1.0.0
 * @date 2025-11-26
 */

(function(global) {
    'use strict';

    /**
     * DexieBackend - IndexedDB operations via Dexie.js
     */
    class DexieBackend {
        constructor(database = null) {
            this.db = database || global.cleansheetDb;
            this.name = 'dexie';
            this.initialized = false;

            if (!this.db) {
                throw new Error('[DexieBackend] No database provided. Ensure cleansheet-db.js is loaded first.');
            }
        }

        /**
         * Initialize the backend (open database connection)
         * @returns {Promise<{success: boolean}>}
         */
        async initialize() {
            if (this.initialized) {
                return { success: true };
            }

            try {
                if (!this.db.isOpen()) {
                    await this.db.open();
                }
                this.initialized = true;
                console.log('[DexieBackend] Initialized successfully');
                return { success: true };
            } catch (error) {
                console.error('[DexieBackend] Initialization failed:', error);
                return { success: false, error: error.message };
            }
        }

        /**
         * Check if IndexedDB is available in this browser
         * @returns {Promise<boolean>}
         */
        async isAvailable() {
            return typeof indexedDB !== 'undefined';
        }

        /**
         * Close the database connection
         * @returns {Promise<void>}
         */
        async close() {
            if (this.db.isOpen()) {
                await this.db.close();
            }
            this.initialized = false;
        }

        // ==========================================
        // Core CRUD Operations
        // ==========================================

        /**
         * Get a single item by primary key
         * @param {string} table - Table name
         * @param {string|number} key - Primary key value
         * @returns {Promise<any>}
         */
        async get(table, key) {
            return this.db.table(table).get(key);
        }

        /**
         * Get all items from a table with optional filtering
         * @param {string} table - Table name
         * @param {Object} options - Query options
         * @param {string} options.personaId - Filter by persona
         * @param {string} options.sortBy - Field to sort by
         * @param {Object} options.where - Where clause {field: value}
         * @param {Function} options.filter - Custom filter function
         * @returns {Promise<Array>}
         */
        async getAll(table, options = {}) {
            let collection = this.db.table(table);

            // Apply where clause
            if (options.where) {
                const [field, value] = Object.entries(options.where)[0];
                collection = collection.where(field).equals(value);
            } else if (options.personaId) {
                collection = collection.where('personaId').equals(options.personaId);
            }

            // Apply custom filter
            if (options.filter && typeof options.filter === 'function') {
                collection = collection.filter(options.filter);
            }

            // Apply sorting
            if (options.sortBy) {
                return collection.sortBy(options.sortBy);
            }

            return collection.toArray();
        }

        /**
         * Insert or update an item (upsert)
         * @param {string} table - Table name
         * @param {Object} item - Item to store
         * @returns {Promise<string|number>} - Primary key of stored item
         */
        async put(table, item) {
            item.lastModified = new Date().toISOString();
            return this.db.table(table).put(item);
        }

        /**
         * Insert a new item (fails if key exists)
         * @param {string} table - Table name
         * @param {Object} item - Item to insert
         * @returns {Promise<string|number>} - Primary key of inserted item
         */
        async add(table, item) {
            const now = new Date().toISOString();
            item.created = now;
            item.lastModified = now;
            return this.db.table(table).add(item);
        }

        /**
         * Delete an item by primary key
         * @param {string} table - Table name
         * @param {string|number} key - Primary key
         * @returns {Promise<void>}
         */
        async delete(table, key) {
            return this.db.table(table).delete(key);
        }

        /**
         * Check if an item exists
         * @param {string} table - Table name
         * @param {string|number} key - Primary key
         * @returns {Promise<boolean>}
         */
        async exists(table, key) {
            const item = await this.db.table(table).get(key);
            return item !== undefined;
        }

        // ==========================================
        // Bulk Operations
        // ==========================================

        /**
         * Insert or update multiple items
         * @param {string} table - Table name
         * @param {Array} items - Items to store
         * @returns {Promise<void>}
         */
        async bulkPut(table, items) {
            const now = new Date().toISOString();
            items.forEach(item => {
                item.lastModified = now;
                if (!item.created) {
                    item.created = now;
                }
            });
            return this.db.table(table).bulkPut(items);
        }

        /**
         * Insert multiple new items
         * @param {string} table - Table name
         * @param {Array} items - Items to insert
         * @returns {Promise<Array>} - Primary keys of inserted items
         */
        async bulkAdd(table, items) {
            const now = new Date().toISOString();
            items.forEach(item => {
                item.created = now;
                item.lastModified = now;
            });
            return this.db.table(table).bulkAdd(items);
        }

        /**
         * Delete multiple items by primary keys
         * @param {string} table - Table name
         * @param {Array} keys - Primary keys to delete
         * @returns {Promise<void>}
         */
        async bulkDelete(table, keys) {
            return this.db.table(table).bulkDelete(keys);
        }

        /**
         * Get multiple items by primary keys
         * @param {string} table - Table name
         * @param {Array} keys - Primary keys
         * @returns {Promise<Array>}
         */
        async bulkGet(table, keys) {
            return this.db.table(table).bulkGet(keys);
        }

        // ==========================================
        // Query Operations
        // ==========================================

        /**
         * Create a where clause for querying
         * @param {string} table - Table name
         * @param {string} field - Field to query
         * @returns {Dexie.WhereClause}
         */
        where(table, field) {
            return this.db.table(table).where(field);
        }

        /**
         * Count items in a table
         * @param {string} table - Table name
         * @param {Object} options - Query options (same as getAll)
         * @returns {Promise<number>}
         */
        async count(table, options = {}) {
            if (options.personaId) {
                return this.db.table(table)
                    .where('personaId')
                    .equals(options.personaId)
                    .count();
            }
            return this.db.table(table).count();
        }

        // ==========================================
        // Transaction Support
        // ==========================================

        /**
         * Execute operations in a transaction
         * @param {Array<string>} tableNames - Table names to include
         * @param {Function} callback - Transaction callback
         * @returns {Promise}
         */
        async transaction(tableNames, callback) {
            const tables = tableNames.map(name => this.db.table(name));
            return this.db.transaction('rw', tables, callback);
        }

        // ==========================================
        // Storage Management
        // ==========================================

        /**
         * Get storage usage estimate
         * @returns {Promise<{used: number, quota: number, percentUsed: string}>}
         */
        async getUsage() {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                return {
                    used: estimate.usage || 0,
                    quota: estimate.quota || 0,
                    percentUsed: estimate.quota
                        ? ((estimate.usage / estimate.quota) * 100).toFixed(1)
                        : '0'
                };
            }
            // Fallback: estimate based on record counts
            return this._estimateUsage();
        }

        /**
         * Estimate storage usage by counting records
         * @private
         * @returns {Promise<{used: number, quota: number, percentUsed: string}>}
         */
        async _estimateUsage() {
            const tableNames = this.db.getTableNames();
            let totalSize = 0;

            for (const name of tableNames) {
                const records = await this.db.table(name).toArray();
                totalSize += JSON.stringify(records).length;
            }

            return {
                used: totalSize,
                quota: 500 * 1024 * 1024, // Conservative 500MB estimate
                percentUsed: ((totalSize / (500 * 1024 * 1024)) * 100).toFixed(1)
            };
        }

        /**
         * Clear all data from a table
         * @param {string} table - Table name
         * @returns {Promise<void>}
         */
        async clearTable(table) {
            return this.db.table(table).clear();
        }

        /**
         * Clear all tables (full database clear)
         * @returns {Promise<void>}
         */
        async clearAll() {
            const tableNames = this.db.getTableNames();
            await this.transaction(tableNames, async () => {
                for (const name of tableNames) {
                    await this.db.table(name).clear();
                }
            });
            console.log('[DexieBackend] All tables cleared');
        }

        // ==========================================
        // Utility Methods
        // ==========================================

        /**
         * Generate a unique ID
         * @returns {string}
         */
        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        }

        /**
         * Get all table names
         * @returns {string[]}
         */
        getTableNames() {
            return this.db.getTableNames();
        }

        /**
         * Get database version
         * @returns {number}
         */
        getVersion() {
            return this.db.getVersion();
        }
    }

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { DexieBackend };
    }

    // Export to global scope for browser
    global.DexieBackend = DexieBackend;

    console.log('[DexieBackend] Backend module loaded');

})(typeof window !== 'undefined' ? window : global);
