// Data Migration Service
// Handles migration from localStorage to Azure Blob Storage with fallback mechanisms

class DataMigrationService {
    constructor(azureBlobService, userId) {
        this.azureService = azureBlobService;
        this.userId = userId;
        this.migrationStatus = this.loadMigrationStatus();
    }

    /**
     * Get migration status from localStorage
     * @returns {Object} Migration status object
     */
    loadMigrationStatus() {
        const status = localStorage.getItem('migrationStatus');
        return status ? JSON.parse(status) : {
            isComplete: false,
            lastMigration: null,
            migratedKeys: [],
            failedKeys: [],
            totalKeys: 0,
            version: '1.0.0'
        };
    }

    /**
     * Save migration status to localStorage
     * @param {Object} status - Migration status to save
     */
    saveMigrationStatus(status) {
        this.migrationStatus = status;
        localStorage.setItem('migrationStatus', JSON.stringify(status));
    }

    /**
     * Perform full migration of localStorage data to Azure Blob Storage
     * @param {Function} progressCallback - Optional callback for progress updates
     * @returns {Promise<Object>} Migration result
     */
    async performMigration(progressCallback = null) {
        console.log('🚀 Starting data migration from localStorage to Azure Blob Storage...');

        try {
            // Get all localStorage keys that need migration
            const keysToMigrate = this.getLocalStorageKeys();
            console.log(`📊 Found ${keysToMigrate.length} items to migrate`);

            if (keysToMigrate.length === 0) {
                return {
                    success: true,
                    message: 'No data found to migrate',
                    migrated: 0,
                    failed: 0
                };
            }

            const migrationResults = {
                success: true,
                migrated: 0,
                failed: 0,
                details: [],
                startTime: new Date().toISOString()
            };

            // Update migration status
            this.migrationStatus.totalKeys = keysToMigrate.length;
            this.migrationStatus.lastMigration = new Date().toISOString();

            // Migrate each item
            for (let i = 0; i < keysToMigrate.length; i++) {
                const key = keysToMigrate[i];

                try {
                    const result = await this.migrateItem(key);

                    if (result.success) {
                        migrationResults.migrated++;
                        if (!this.migrationStatus.migratedKeys.includes(key)) {
                            this.migrationStatus.migratedKeys.push(key);
                        }
                        console.log(`✅ Migrated: ${key}`);
                    } else {
                        migrationResults.failed++;
                        if (!this.migrationStatus.failedKeys.includes(key)) {
                            this.migrationStatus.failedKeys.push(key);
                        }
                        console.warn(`❌ Failed to migrate: ${key} - ${result.error}`);
                    }

                    migrationResults.details.push({
                        key,
                        success: result.success,
                        error: result.error || null
                    });

                    // Report progress
                    if (progressCallback) {
                        progressCallback({
                            completed: i + 1,
                            total: keysToMigrate.length,
                            percentage: Math.round(((i + 1) / keysToMigrate.length) * 100),
                            currentItem: key
                        });
                    }

                    // Brief pause to avoid overwhelming the service
                    await new Promise(resolve => setTimeout(resolve, 100));

                } catch (error) {
                    console.error(`Error migrating ${key}:`, error);
                    migrationResults.failed++;
                    migrationResults.details.push({
                        key,
                        success: false,
                        error: error.message
                    });
                }
            }

            // Mark migration as complete if all items were migrated successfully
            if (migrationResults.failed === 0) {
                this.migrationStatus.isComplete = true;
            }

            migrationResults.endTime = new Date().toISOString();
            this.saveMigrationStatus(this.migrationStatus);

            console.log(`🎉 Migration completed! Migrated: ${migrationResults.migrated}, Failed: ${migrationResults.failed}`);
            return migrationResults;

        } catch (error) {
            console.error('Migration error:', error);
            return {
                success: false,
                error: error.message,
                migrated: 0,
                failed: 0
            };
        }
    }

    /**
     * Migrate a single item from localStorage to Azure
     * @param {string} key - localStorage key
     * @returns {Promise<Object>} Migration result for the item
     */
    async migrateItem(key) {
        try {
            const data = localStorage.getItem(key);
            if (data === null) {
                return {
                    success: false,
                    error: 'Item not found in localStorage'
                };
            }

            // Determine the blob path based on the key type
            const blobPath = this.getBlobPath(key);

            // Add migration metadata
            const metadata = {
                migratedFrom: 'localStorage',
                migrationDate: new Date().toISOString(),
                originalKey: key,
                userId: this.userId
            };

            // Upload to Azure
            const result = await this.azureService.uploadBlob(blobPath, data, metadata);

            if (result.success) {
                // Optionally keep a backup in localStorage with a different key
                localStorage.setItem(`backup_${key}`, data);
            }

            return result;

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get all localStorage keys that should be migrated
     * @returns {Array<string>} Array of localStorage keys
     */
    getLocalStorageKeys() {
        const keysToMigrate = [];
        const migrationPatterns = [
            'retailManagerDocuments',
            'researchChemistDocuments',
            'newGraduateDocuments',
            'dataAnalystDocuments',
            'professional_document_',
            'currentPersona',
            'userPreferences',
            'documentTemplates',
            'projectStructure',
            'tableDefinitions',
            'formDefinitions',
            'reportDefinitions'
        ];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // Skip migration-related keys and backups
            if (key.startsWith('backup_') || key === 'migrationStatus') {
                continue;
            }

            // Check if key matches any migration pattern
            const shouldMigrate = migrationPatterns.some(pattern =>
                key.includes(pattern) || key.startsWith(pattern)
            );

            if (shouldMigrate) {
                keysToMigrate.push(key);
            }
        }

        return keysToMigrate;
    }

    /**
     * Determine the blob path for a localStorage key
     * @param {string} key - localStorage key
     * @returns {string} Blob path in Azure storage
     */
    getBlobPath(key) {
        const paths = this.azureService.getContainerPaths(this.userId);

        // Document-related data
        if (key.includes('Documents') || key.startsWith('professional_document_')) {
            return `${paths.user.documents}${key}.json`;
        }

        // Project data
        if (key.includes('project') || key === 'projectStructure') {
            return `${paths.user.projects}${key}.json`;
        }

        // Form definitions
        if (key.includes('form') || key === 'formDefinitions') {
            return `${paths.user.schemas}${key}.json`;
        }

        // Table definitions
        if (key.includes('table') || key === 'tableDefinitions') {
            return `${paths.user.schemas}${key}.json`;
        }

        // Report definitions
        if (key.includes('report') || key === 'reportDefinitions') {
            return `${paths.user.schemas}${key}.json`;
        }

        // User preferences and metadata
        if (key.includes('preferences') || key.includes('persona') || key === 'currentPersona') {
            return `${paths.user.preferences}${key}.json`;
        }

        // Templates
        if (key.includes('template') || key === 'documentTemplates') {
            return `${paths.user.metadata}${key}.json`;
        }

        // Default to metadata folder
        return `${paths.user.metadata}${key}.json`;
    }

    /**
     * Check if an item has been migrated
     * @param {string} key - localStorage key
     * @returns {boolean} True if already migrated
     */
    isItemMigrated(key) {
        return this.migrationStatus.migratedKeys.includes(key);
    }

    /**
     * Rollback migration for testing or error recovery
     * @returns {Promise<Object>} Rollback result
     */
    async rollbackMigration() {
        console.log('🔄 Rolling back migration...');

        try {
            let restoredCount = 0;

            // Restore backed up data
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('backup_')) {
                    const originalKey = key.replace('backup_', '');
                    const data = localStorage.getItem(key);

                    localStorage.setItem(originalKey, data);
                    localStorage.removeItem(key);
                    restoredCount++;

                    console.log(`Restored: ${originalKey}`);
                }
            }

            // Reset migration status
            this.migrationStatus = {
                isComplete: false,
                lastMigration: null,
                migratedKeys: [],
                failedKeys: [],
                totalKeys: 0,
                version: '1.0.0'
            };
            this.saveMigrationStatus(this.migrationStatus);

            console.log(`✅ Rollback completed. Restored ${restoredCount} items.`);

            return {
                success: true,
                restored: restoredCount,
                message: 'Migration rolled back successfully'
            };

        } catch (error) {
            console.error('Rollback error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get migration progress/status
     * @returns {Object} Current migration status
     */
    getMigrationStatus() {
        return {
            ...this.migrationStatus,
            pendingMigration: !this.migrationStatus.isComplete,
            completionPercentage: this.migrationStatus.totalKeys > 0
                ? Math.round((this.migrationStatus.migratedKeys.length / this.migrationStatus.totalKeys) * 100)
                : 0
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataMigrationService;
} else if (typeof window !== 'undefined') {
    window.DataMigrationService = DataMigrationService;
}