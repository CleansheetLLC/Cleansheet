// Enhanced Data Service
// Integrates Azure Blob Storage with localStorage fallback and migration support

class EnhancedDataService {
    constructor(azureBlobService, userId) {
        this.azureService = azureBlobService;
        this.userId = userId;
        this.isOnline = navigator.onLine;
        this.migrationService = null;

        // Initialize migration service if Azure is available
        if (this.azureService) {
            this.migrationService = new DataMigrationService(this.azureService, this.userId);
        }

        // Listen for online/offline events
        this.setupNetworkListeners();

        // Cache for frequently accessed data
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Setup network status listeners
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Connection restored - Azure Blob Storage available');
            this.syncPendingChanges();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📱 Offline mode - Using localStorage fallback');
        });
    }

    /**
     * Initialize the service and perform migration if needed
     * @returns {Promise<Object>} Initialization result
     */
    async initialize() {
        console.log('🚀 Initializing Enhanced Data Service...');

        try {
            // Check if Azure service is available
            if (!this.azureService) {
                console.log('📝 Azure service not configured - using localStorage only');
                return {
                    success: true,
                    mode: 'localStorage',
                    message: 'Running in localStorage-only mode'
                };
            }

            // Test Azure connection
            const healthCheck = await this.azureService.healthCheck();
            if (!healthCheck.healthy) {
                console.warn('⚠️ Azure Blob Storage unhealthy - using localStorage fallback');
                return {
                    success: true,
                    mode: 'localStorage',
                    message: 'Azure unavailable, using localStorage fallback',
                    error: healthCheck.error
                };
            }

            // Check migration status
            const migrationStatus = this.migrationService.getMigrationStatus();
            console.log('📊 Migration status:', migrationStatus);

            // Perform migration if needed
            if (!migrationStatus.isComplete && migrationStatus.pendingMigration) {
                console.log('🔄 Starting automatic migration...');

                const migrationResult = await this.migrationService.performMigration((progress) => {
                    console.log(`Migration progress: ${progress.percentage}% (${progress.currentItem})`);
                });

                if (migrationResult.success) {
                    console.log('✅ Migration completed successfully');
                } else {
                    console.warn('⚠️ Migration completed with errors:', migrationResult);
                }
            }

            return {
                success: true,
                mode: 'azure',
                message: 'Enhanced Data Service initialized with Azure Blob Storage',
                migrationStatus: migrationStatus
            };

        } catch (error) {
            console.error('❌ Enhanced Data Service initialization error:', error);
            return {
                success: false,
                mode: 'localStorage',
                error: error.message
            };
        }
    }

    /**
     * Save document with Azure Blob + localStorage fallback
     * @param {string} key - Document key/identifier
     * @param {Object} document - Document data
     * @returns {Promise<Object>} Save result
     */
    async saveDocument(key, document) {
        try {
            // Always save to localStorage immediately for offline support
            localStorage.setItem(key, JSON.stringify(document));
            console.log(`💾 Document saved to localStorage: ${key}`);

            // Try to save to Azure if online and available
            if (this.isOnline && this.azureService) {
                const blobPath = this.getBlobPath(key);
                const metadata = {
                    documentType: document.documentType || 'unknown',
                    lastModified: document.lastModified || new Date().toISOString(),
                    userId: this.userId,
                    version: '1.0.0'
                };

                const azureResult = await this.azureService.uploadBlob(blobPath, document, metadata);

                if (azureResult.success) {
                    console.log(`☁️ Document synced to Azure: ${key}`);

                    // Update cache
                    this.cache.set(key, {
                        data: document,
                        timestamp: Date.now(),
                        source: 'azure'
                    });

                    return {
                        success: true,
                        source: 'azure',
                        localStorage: true,
                        azure: true,
                        key,
                        url: azureResult.url
                    };
                } else {
                    console.warn(`⚠️ Azure sync failed for ${key}, saved locally: ${azureResult.error}`);

                    // Queue for retry later
                    this.queueForSync(key, document);

                    return {
                        success: true,
                        source: 'localStorage',
                        localStorage: true,
                        azure: false,
                        key,
                        error: azureResult.error
                    };
                }
            } else {
                // Queue for sync when online
                this.queueForSync(key, document);

                return {
                    success: true,
                    source: 'localStorage',
                    localStorage: true,
                    azure: false,
                    key,
                    message: this.isOnline ? 'Azure unavailable' : 'Offline mode'
                };
            }

        } catch (error) {
            console.error(`❌ Error saving document ${key}:`, error);
            return {
                success: false,
                error: error.message,
                key
            };
        }
    }

    /**
     * Load document with Azure Blob + localStorage fallback
     * @param {string} key - Document key/identifier
     * @returns {Promise<Object>} Load result with document data
     */
    async loadDocument(key) {
        try {
            // Check cache first
            const cachedData = this.getCachedData(key);
            if (cachedData) {
                console.log(`⚡ Document loaded from cache: ${key}`);
                return {
                    success: true,
                    data: cachedData.data,
                    source: 'cache',
                    key
                };
            }

            // Try to load from Azure first if online and available
            if (this.isOnline && this.azureService) {
                const blobPath = this.getBlobPath(key);
                const azureResult = await this.azureService.downloadBlob(blobPath);

                if (azureResult.success) {
                    console.log(`☁️ Document loaded from Azure: ${key}`);

                    // Update localStorage with latest data
                    localStorage.setItem(key, JSON.stringify(azureResult.data));

                    // Update cache
                    this.cache.set(key, {
                        data: azureResult.data,
                        timestamp: Date.now(),
                        source: 'azure'
                    });

                    return {
                        success: true,
                        data: azureResult.data,
                        source: 'azure',
                        key,
                        lastModified: azureResult.lastModified
                    };
                } else if (azureResult.error !== 'Blob not found') {
                    console.warn(`⚠️ Azure load failed for ${key}: ${azureResult.error}`);
                }
            }

            // Fallback to localStorage
            const localData = localStorage.getItem(key);
            if (localData) {
                try {
                    const document = JSON.parse(localData);
                    console.log(`💾 Document loaded from localStorage: ${key}`);

                    // Update cache
                    this.cache.set(key, {
                        data: document,
                        timestamp: Date.now(),
                        source: 'localStorage'
                    });

                    return {
                        success: true,
                        data: document,
                        source: 'localStorage',
                        key
                    };
                } catch (parseError) {
                    console.error(`❌ Error parsing localStorage data for ${key}:`, parseError);
                }
            }

            return {
                success: false,
                error: 'Document not found',
                key
            };

        } catch (error) {
            console.error(`❌ Error loading document ${key}:`, error);
            return {
                success: false,
                error: error.message,
                key
            };
        }
    }

    /**
     * List all documents with Azure + localStorage integration
     * @param {string} type - Document type filter (optional)
     * @returns {Promise<Object>} List of documents
     */
    async listDocuments(type = null) {
        try {
            const documents = [];
            const documentKeys = new Set();

            // Get documents from Azure if available
            if (this.isOnline && this.azureService) {
                const paths = this.azureService.getContainerPaths(this.userId);
                const azureResult = await this.azureService.listBlobs(paths.user.documents);

                if (azureResult.success) {
                    for (const blob of azureResult.blobs) {
                        const key = this.extractKeyFromBlobPath(blob.name);
                        documentKeys.add(key);

                        documents.push({
                            key,
                            source: 'azure',
                            lastModified: blob.lastModified,
                            size: blob.size,
                            url: blob.url
                        });
                    }
                }
            }

            // Get documents from localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                // Filter for document keys
                if (this.isDocumentKey(key) && !documentKeys.has(key)) {
                    try {
                        const data = localStorage.getItem(key);
                        const document = JSON.parse(data);

                        documents.push({
                            key,
                            source: 'localStorage',
                            lastModified: document.lastModified || null,
                            documentType: document.documentType || 'unknown',
                            title: document.title || key
                        });

                        documentKeys.add(key);
                    } catch (parseError) {
                        console.warn(`⚠️ Error parsing document ${key}:`, parseError);
                    }
                }
            }

            // Filter by type if specified
            let filteredDocuments = documents;
            if (type) {
                filteredDocuments = documents.filter(doc =>
                    doc.documentType === type || doc.key.includes(type)
                );
            }

            return {
                success: true,
                documents: filteredDocuments,
                count: filteredDocuments.length,
                sources: {
                    azure: filteredDocuments.filter(d => d.source === 'azure').length,
                    localStorage: filteredDocuments.filter(d => d.source === 'localStorage').length
                }
            };

        } catch (error) {
            console.error('❌ Error listing documents:', error);
            return {
                success: false,
                error: error.message,
                documents: []
            };
        }
    }

    /**
     * Delete document from both Azure and localStorage
     * @param {string} key - Document key/identifier
     * @returns {Promise<Object>} Delete result
     */
    async deleteDocument(key) {
        try {
            let azureDeleted = false;
            let localStorageDeleted = false;

            // Delete from Azure if available
            if (this.isOnline && this.azureService) {
                const blobPath = this.getBlobPath(key);
                const azureResult = await this.azureService.deleteBlob(blobPath);
                azureDeleted = azureResult.success;

                if (!azureDeleted) {
                    console.warn(`⚠️ Failed to delete from Azure: ${azureResult.error}`);
                }
            }

            // Delete from localStorage
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                localStorageDeleted = true;
            }

            // Remove from cache
            this.cache.delete(key);

            return {
                success: azureDeleted || localStorageDeleted,
                azure: azureDeleted,
                localStorage: localStorageDeleted,
                key
            };

        } catch (error) {
            console.error(`❌ Error deleting document ${key}:`, error);
            return {
                success: false,
                error: error.message,
                key
            };
        }
    }

    /**
     * Sync pending changes when connection is restored
     */
    async syncPendingChanges() {
        if (!this.isOnline || !this.azureService) return;

        const syncQueue = this.getSyncQueue();
        console.log(`🔄 Syncing ${syncQueue.length} pending changes...`);

        for (const item of syncQueue) {
            try {
                const result = await this.saveDocument(item.key, item.data);
                if (result.azure) {
                    this.removeFromSyncQueue(item.key);
                    console.log(`✅ Synced: ${item.key}`);
                }
            } catch (error) {
                console.warn(`⚠️ Sync failed for ${item.key}:`, error);
            }
        }
    }

    /**
     * Helper methods
     */

    getBlobPath(key) {
        if (!this.azureService) return '';

        const paths = this.azureService.getContainerPaths(this.userId);
        return `${paths.user.documents}${key}.json`;
    }

    extractKeyFromBlobPath(blobPath) {
        const parts = blobPath.split('/');
        const fileName = parts[parts.length - 1];
        return fileName.replace('.json', '');
    }

    isDocumentKey(key) {
        const documentPatterns = [
            'Documents',
            'professional_document_',
            'documentTemplate'
        ];

        return documentPatterns.some(pattern => key.includes(pattern));
    }

    queueForSync(key, data) {
        const syncQueue = this.getSyncQueue();
        const existingIndex = syncQueue.findIndex(item => item.key === key);

        if (existingIndex >= 0) {
            syncQueue[existingIndex] = { key, data, timestamp: Date.now() };
        } else {
            syncQueue.push({ key, data, timestamp: Date.now() });
        }

        localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    }

    getSyncQueue() {
        const queue = localStorage.getItem('syncQueue');
        return queue ? JSON.parse(queue) : [];
    }

    removeFromSyncQueue(key) {
        const syncQueue = this.getSyncQueue();
        const filteredQueue = syncQueue.filter(item => item.key !== key);
        localStorage.setItem('syncQueue', JSON.stringify(filteredQueue));
    }

    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached;
        }

        // Remove expired cache entry
        if (cached) {
            this.cache.delete(key);
        }

        return null;
    }

    /**
     * Get service status and health information
     * @returns {Promise<Object>} Service status
     */
    async getStatus() {
        const status = {
            timestamp: new Date().toISOString(),
            online: this.isOnline,
            userId: this.userId,
            cache: {
                size: this.cache.size,
                keys: Array.from(this.cache.keys())
            },
            localStorage: {
                keys: Object.keys(localStorage).filter(key => this.isDocumentKey(key)).length
            },
            syncQueue: this.getSyncQueue().length
        };

        if (this.azureService) {
            status.azure = await this.azureService.healthCheck();

            if (this.migrationService) {
                status.migration = this.migrationService.getMigrationStatus();
            }
        } else {
            status.azure = { healthy: false, message: 'Azure service not configured' };
        }

        return status;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedDataService;
} else if (typeof window !== 'undefined') {
    window.EnhancedDataService = EnhancedDataService;
}