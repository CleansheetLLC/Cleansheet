/**
 * Cleansheet Database Schema - Dexie.js IndexedDB Wrapper
 *
 * Provides scalable local storage (multi-GB) replacing localStorage (5-10MB limit).
 * All data is encrypted by the EncryptedStorage middleware before storage.
 *
 * @version 1.0.0
 * @date 2025-11-26
 */

// Use UMD pattern for browser compatibility (no bundler required)
(function(global) {
    'use strict';

    // Check for Dexie availability
    const getDexie = () => {
        if (typeof Dexie !== 'undefined') return Dexie;
        if (typeof global.Dexie !== 'undefined') return global.Dexie;
        throw new Error('[CleansheetDB] Dexie.js not loaded. Include dexie.min.js before this script.');
    };

    /**
     * CleansheetDatabase - IndexedDB database with Dexie.js
     */
    class CleansheetDatabase {
        constructor() {
            const Dexie = getDexie();
            this.db = new Dexie('CleansheetDB');

            // Define database schema with version 1
            this.db.version(1).stores({
                // User profiles (one per persona)
                // &id = unique primary key
                profiles: '&id, personaId, email, lastModified',

                // Work experiences
                // ++id = auto-increment primary key
                // *skills = multi-value index for array field
                experiences: '++id, personaId, organizationName, startDate, endDate, *skills, *careerPaths',

                // STAR stories linked to experiences
                stories: '++id, personaId, title, experienceId, *competencies',

                // Job applications and tracking
                jobs: '++id, personaId, company, position, status, appliedDate, lastModified',

                // Career goals
                goals: '++id, personaId, title, status, dueDate, created',

                // Portfolio projects
                portfolio: '++id, personaId, name, startDate, endDate, *technologies',

                // Lexical documents (content is encrypted)
                documents: '++id, personaId, name, linkedType, linkedId, created, lastModified',

                // Draw.io diagrams (diagramData XML is encrypted)
                diagrams: '++id, personaId, name, linkedType, linkedId, created, lastModified',

                // Generic artifacts: code snippets, markdown, plantuml, mermaid
                artifacts: '++id, personaId, type, name, language, linkedType, linkedId, created, lastModified',

                // Key-value settings store
                // &key = unique key
                settings: '&key, encrypted, lastModified',

                // Sync metadata for Azure Blob sync
                syncMeta: '&key, timestamp'
            });

            // Create table references for convenience
            this.profiles = this.db.profiles;
            this.experiences = this.db.experiences;
            this.stories = this.db.stories;
            this.jobs = this.db.jobs;
            this.goals = this.db.goals;
            this.portfolio = this.db.portfolio;
            this.documents = this.db.documents;
            this.diagrams = this.db.diagrams;
            this.artifacts = this.db.artifacts;
            this.settings = this.db.settings;
            this.syncMeta = this.db.syncMeta;
        }

        /**
         * Open the database connection
         * @returns {Promise<void>}
         */
        async open() {
            await this.db.open();
            console.log('[CleansheetDB] Database opened');
        }

        /**
         * Close the database connection
         * @returns {Promise<void>}
         */
        async close() {
            await this.db.close();
            console.log('[CleansheetDB] Database closed');
        }

        /**
         * Check if database is open
         * @returns {boolean}
         */
        isOpen() {
            return this.db.isOpen();
        }

        /**
         * Get a table by name
         * @param {string} tableName
         * @returns {Dexie.Table}
         */
        table(tableName) {
            return this.db.table(tableName);
        }

        /**
         * Run a transaction across multiple tables
         * @param {string} mode - 'r' for read, 'rw' for read-write
         * @param {Array<Dexie.Table>} tables - Tables to include in transaction
         * @param {Function} callback - Transaction callback
         * @returns {Promise}
         */
        transaction(mode, tables, callback) {
            return this.db.transaction(mode, tables, callback);
        }

        /**
         * Delete the entire database (use with caution!)
         * @returns {Promise<void>}
         */
        async deleteDatabase() {
            await this.db.delete();
            console.log('[CleansheetDB] Database deleted');
        }

        /**
         * Get database version
         * @returns {number}
         */
        getVersion() {
            return this.db.verno;
        }

        /**
         * Get all table names
         * @returns {string[]}
         */
        getTableNames() {
            return this.db.tables.map(t => t.name);
        }
    }

    // Create singleton instance
    const db = new CleansheetDatabase();

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { CleansheetDatabase, db };
    }

    // Export to global scope for browser
    global.CleansheetDatabase = CleansheetDatabase;
    global.cleansheetDb = db;

    console.log('[CleansheetDB] Database module loaded');

})(typeof window !== 'undefined' ? window : global);
