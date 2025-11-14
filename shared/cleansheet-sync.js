/**
 * Cleansheet Workspace Sync Service
 * Handles bidirectional sync with Azure Blob Storage
 * Includes duplicate email detection and migration on first login
 * Version: 1.0.0
 */

class CleansheetSync {
    constructor(auth, config = {}) {
        this.auth = auth;
        this.config = {
            storageAccount: config.storageAccount || 'storageb681',
            containerName: config.containerName || 'userworkspaces',
            anonymousContainer: config.anonymousContainer || 'profileblobs',
            autoSyncInterval: config.autoSyncInterval || 60000, // 60 seconds
            ...config
        };

        this.syncInProgress = false;
        this.autoSyncTimer = null;
        this.listeners = [];

        // Collection schema (maps to your actual data structure)
        this.collections = {
            profile: ['userFirstName', 'userLastName', 'userOccupation', 'userGoals'],
            experiences: ['experiences'],
            stories: ['stories'],
            portfolio: ['portfolio'],
            goals: ['goals'],
            jobs: ['jobOpportunities'],
            richContent: ['documents', 'diagrams', 'whiteboards', 'presentations'],
            codeAssets: ['code', 'markdown', 'mermaid', 'plantuml'],
            latexAssets: ['latex']
        };
    }

    // ========================================
    // Sync Operations
    // ========================================

    /**
     * Initialize sync (check for migration, setup auto-sync)
     */
    async initialize() {
        if (!this.auth.isAuthenticated()) {
            console.log('Not authenticated - skipping sync initialization');
            return;
        }

        try {
            // Check if first login (needs migration)
            const migrationStatus = await this.checkMigrationStatus();

            if (migrationStatus.needed) {
                console.log('📦 Migration available from anonymous profile');
                this.notifyListeners('migration_available', migrationStatus);

                // Auto-migrate if user wants
                const autoMigrate = confirm(
                    'We found an existing profile for your email address. ' +
                    'Would you like to import this data into your account?'
                );

                if (autoMigrate) {
                    await this.migrateAnonymousProfile();
                }
            }

            // Perform initial sync down
            await this.syncDown();

            // Setup auto-sync
            this.startAutoSync();

            // Sync on page unload
            window.addEventListener('beforeunload', () => this.syncUp());

            // Sync when page becomes visible
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.syncDown();
                }
            });

        } catch (error) {
            console.error('Sync initialization failed:', error);
        }
    }

    /**
     * Sync up: Upload local changes to cloud
     */
    async syncUp() {
        if (this.syncInProgress) {
            console.log('Sync already in progress, skipping');
            return;
        }

        if (!this.auth.isAuthenticated()) {
            console.log('Not authenticated - skipping sync up');
            return;
        }

        this.syncInProgress = true;
        this.notifyListeners('sync_start', { direction: 'up' });

        try {
            const user = this.auth.getUser();
            console.log(`⬆️ Syncing up workspace for ${user.email}`);

            // Collect all local data
            const fullProfile = this.collectFullProfileData();

            // Split into collections
            const collections = this.splitIntoCollections(fullProfile);

            // Upload each collection
            const uploads = [];
            for (const [name, data] of Object.entries(collections)) {
                const blobName = `${user.id}/workspace/${name}.json`;
                uploads.push(this.uploadBlob(blobName, data));
            }

            await Promise.all(uploads);

            // Update sync metadata (atomic commit)
            const metadata = {
                version: Date.now(),
                lastSyncUp: new Date().toISOString(),
                deviceId: this.getDeviceId(),
                collections: Object.keys(collections),
                totalSize: JSON.stringify(fullProfile).length,
                email: user.email
            };

            await this.uploadBlob(`${user.id}/workspace/sync-metadata.json`, metadata);

            // Update local sync state
            localStorage.setItem('cleansheet_last_sync_up', metadata.lastSyncUp);
            localStorage.setItem('cleansheet_sync_version', metadata.version.toString());

            console.log('✓ Sync up complete');
            this.notifyListeners('sync_complete', { direction: 'up', metadata });

        } catch (error) {
            console.error('Sync up failed:', error);
            this.notifyListeners('sync_error', { direction: 'up', error });
            throw error;
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Sync down: Download cloud changes to local
     */
    async syncDown() {
        if (this.syncInProgress) {
            console.log('Sync already in progress, skipping');
            return;
        }

        if (!this.auth.isAuthenticated()) {
            console.log('Not authenticated - skipping sync down');
            return;
        }

        this.syncInProgress = true;
        this.notifyListeners('sync_start', { direction: 'down' });

        try {
            const user = this.auth.getUser();
            console.log(`⬇️ Syncing down workspace for ${user.email}`);

            // Download metadata first
            const metadata = await this.downloadBlob(`${user.id}/workspace/sync-metadata.json`);

            if (!metadata) {
                console.log('No remote workspace found - first sync');
                // Upload current state
                await this.syncUp();
                return;
            }

            // Check if remote is newer
            const localVersion = parseInt(localStorage.getItem('cleansheet_sync_version') || '0');
            const remoteVersion = metadata.version;

            if (remoteVersion <= localVersion) {
                console.log('✓ Already up to date');
                this.notifyListeners('sync_complete', { direction: 'down', upToDate: true });
                return;
            }

            // Download all collections
            const downloads = metadata.collections.map(name =>
                this.downloadBlob(`${user.id}/workspace/${name}.json`)
                    .then(data => ({ name, data }))
            );

            const collections = await Promise.all(downloads);

            // Check for conflicts (local changes since last sync)
            const hasLocalChanges = this.hasLocalChanges();

            if (hasLocalChanges) {
                console.log('⚠️ Conflict detected - local changes exist');
                await this.resolveConflicts(collections, metadata);
            } else {
                // No conflict - just apply remote changes
                collections.forEach(({ name, data }) => {
                    this.mergeCollectionIntoLocalStorage(name, data);
                });
            }

            // Update local sync state
            localStorage.setItem('cleansheet_last_sync_down', new Date().toISOString());
            localStorage.setItem('cleansheet_sync_version', remoteVersion.toString());

            console.log('✓ Sync down complete');
            this.notifyListeners('sync_complete', { direction: 'down', metadata });

        } catch (error) {
            if (error.status === 404) {
                console.log('No remote workspace - first sync');
                await this.syncUp();
            } else {
                console.error('Sync down failed:', error);
                this.notifyListeners('sync_error', { direction: 'down', error });
                throw error;
            }
        } finally {
            this.syncInProgress = false;
        }
    }

    // ========================================
    // Duplicate Email Migration
    // ========================================

    /**
     * Check if user has anonymous profile that needs migration
     */
    async checkMigrationStatus() {
        try {
            const user = this.auth.getUser();
            const email = user.email;

            // Check for existing blobs in anonymous container
            const sasToken = await this.auth.getSasToken();
            const listUrl = `https://${this.config.storageAccount}.blob.core.windows.net/${this.config.anonymousContainer}?restype=container&comp=list&prefix=${encodeURIComponent(email + '/')}&${sasToken}`;

            const response = await fetch(listUrl);

            if (!response.ok) {
                return { needed: false };
            }

            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const blobs = xmlDoc.getElementsByTagName('Blob');

            if (blobs.length === 0) {
                return { needed: false };
            }

            // Find most recent blob
            let latestBlob = null;
            let latestDate = new Date(0);

            for (const blob of blobs) {
                const name = blob.getElementsByTagName('Name')[0].textContent;
                const lastModified = new Date(blob.getElementsByTagName('Last-Modified')[0].textContent);

                if (lastModified > latestDate) {
                    latestDate = lastModified;
                    latestBlob = name;
                }
            }

            return {
                needed: true,
                blobCount: blobs.length,
                latestBlob: latestBlob,
                lastModified: latestDate.toISOString()
            };

        } catch (error) {
            console.error('Migration check failed:', error);
            return { needed: false };
        }
    }

    /**
     * Migrate anonymous profile into authenticated user workspace
     */
    async migrateAnonymousProfile() {
        try {
            console.log('🔄 Starting migration from anonymous profile...');
            this.notifyListeners('migration_start');

            const user = this.auth.getUser();
            const status = await this.checkMigrationStatus();

            if (!status.needed) {
                console.log('No migration needed');
                return;
            }

            // Download anonymous profile (most recent)
            // Note: We need account key or public access for this - add to Azure Function
            const sasToken = await this.auth.getSasToken();
            const blobUrl = `https://${this.config.storageAccount}.blob.core.windows.net/${this.config.anonymousContainer}/${status.latestBlob}?${sasToken}`;

            const response = await fetch(blobUrl);

            if (!response.ok) {
                throw new Error(`Failed to download anonymous profile: ${response.status}`);
            }

            const anonymousProfile = await response.json();

            console.log('📦 Anonymous profile downloaded:', {
                experiences: anonymousProfile.experiences?.length,
                stories: anonymousProfile.stories?.length,
                size: JSON.stringify(anonymousProfile).length
            });

            // Merge with any existing local data
            const localProfile = this.collectFullProfileData();
            const mergedProfile = this.mergeProfiles(anonymousProfile, localProfile);

            // Save merged profile locally
            this.saveFullProfileData(mergedProfile);

            // Upload to authenticated workspace
            await this.syncUp();

            // Mark migration as complete
            localStorage.setItem('cleansheet_migration_complete', new Date().toISOString());
            localStorage.setItem('cleansheet_migration_source', status.latestBlob);

            console.log('✓ Migration complete');
            this.notifyListeners('migration_complete', { source: status.latestBlob });

            // Show success message
            alert('Your profile has been successfully imported! All your data is now synced to your account.');

        } catch (error) {
            console.error('Migration failed:', error);
            this.notifyListeners('migration_error', error);
            alert('Failed to import profile data. Please try again or contact support.');
            throw error;
        }
    }

    /**
     * Merge two profiles (LWW + array merge by ID)
     */
    mergeProfiles(profile1, profile2) {
        const merged = { ...profile1 };

        // Merge array collections by ID
        const arrayCollections = ['experiences', 'stories', 'portfolio', 'goals', 'jobOpportunities'];

        arrayCollections.forEach(collection => {
            const arr1 = profile1[collection] || [];
            const arr2 = profile2[collection] || [];

            // Merge by ID, keep most recent
            const mergedMap = new Map();

            [...arr1, ...arr2].forEach(item => {
                const existing = mergedMap.get(item.id);
                if (!existing || this.isMoreRecent(item, existing)) {
                    mergedMap.set(item.id, item);
                }
            });

            merged[collection] = Array.from(mergedMap.values());
        });

        // For scalar fields, use most recent
        ['userFirstName', 'userLastName', 'userOccupation', 'userGoals'].forEach(field => {
            if (profile2[field]) {
                merged[field] = profile2[field]; // Prefer local
            }
        });

        return merged;
    }

    // ========================================
    // Conflict Resolution (Last-Write-Wins)
    // ========================================

    /**
     * Resolve conflicts between local and remote data
     * Strategy: Last-Write-Wins with timestamp comparison
     */
    async resolveConflicts(remoteCollections, remoteMetadata) {
        console.log('⚠️ Resolving conflicts with Last-Write-Wins strategy');

        const localLastModified = localStorage.getItem('cleansheet_last_modified') || new Date(0).toISOString();
        const remoteLastModified = remoteMetadata.lastSyncUp;

        if (new Date(remoteLastModified) > new Date(localLastModified)) {
            // Remote is newer - use remote
            console.log('Remote is newer - applying remote changes');
            remoteCollections.forEach(({ name, data }) => {
                this.mergeCollectionIntoLocalStorage(name, data);
            });
        } else {
            // Local is newer - keep local and upload
            console.log('Local is newer - keeping local changes');
            await this.syncUp();
        }

        // Alternatively, show user a conflict dialog
        // this.showConflictDialog(localData, remoteData);
    }

    /**
     * Check if local data has unsaved changes
     */
    hasLocalChanges() {
        const lastSyncUp = localStorage.getItem('cleansheet_last_sync_up');
        const lastModified = localStorage.getItem('cleansheet_last_modified');

        if (!lastSyncUp) return true; // Never synced
        if (!lastModified) return false;

        return new Date(lastModified) > new Date(lastSyncUp);
    }

    // ========================================
    // Auto-Sync
    // ========================================

    startAutoSync() {
        if (this.autoSyncTimer) {
            clearInterval(this.autoSyncTimer);
        }

        this.autoSyncTimer = setInterval(async () => {
            if (this.hasLocalChanges() && !document.hidden) {
                console.log('Auto-sync triggered');
                await this.syncUp();
            }
        }, this.config.autoSyncInterval);

        console.log(`✓ Auto-sync enabled (every ${this.config.autoSyncInterval / 1000}s)`);
    }

    stopAutoSync() {
        if (this.autoSyncTimer) {
            clearInterval(this.autoSyncTimer);
            this.autoSyncTimer = null;
            console.log('Auto-sync disabled');
        }
    }

    // ========================================
    // Blob Operations
    // ========================================

    async uploadBlob(blobName, data) {
        const sasToken = await this.auth.getSasToken();
        const blobUrl = `https://${this.config.storageAccount}.blob.core.windows.net/${this.config.containerName}/${blobName}?${sasToken}`;

        const jsonData = JSON.stringify(data, null, 2);

        const response = await fetch(blobUrl, {
            method: 'PUT',
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Blob upload failed: ${response.status} - ${errorText}`);
        }

        console.log(`✓ Uploaded: ${blobName} (${jsonData.length} bytes)`);
        return blobName;
    }

    async downloadBlob(blobName) {
        const sasToken = await this.auth.getSasToken();
        const blobUrl = `https://${this.config.storageAccount}.blob.core.windows.net/${this.config.containerName}/${blobName}?${sasToken}`;

        const response = await fetch(blobUrl);

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw Object.assign(new Error(`Blob download failed: ${response.status}`), { status: response.status });
        }

        return await response.json();
    }

    // ========================================
    // Data Collection & Storage
    // ========================================

    /**
     * Collect full profile data from localStorage (reuse existing function)
     */
    collectFullProfileData() {
        // This should match your existing collectFullProfileData() in career-canvas.html
        return {
            userFirstName: localStorage.getItem('cleansheet_profile_firstName') || '',
            userLastName: localStorage.getItem('cleansheet_profile_lastName') || '',
            userOccupation: localStorage.getItem('cleansheet_profile_occupation') || '',
            userGoals: localStorage.getItem('cleansheet_profile_goals') || '',
            experiences: JSON.parse(localStorage.getItem('cleansheet_experiences') || '[]'),
            stories: JSON.parse(localStorage.getItem('cleansheet_stories') || '[]'),
            portfolio: JSON.parse(localStorage.getItem('userPortfolio') || '[]'),
            goals: JSON.parse(localStorage.getItem('userGoals') || '[]'),
            jobOpportunities: JSON.parse(localStorage.getItem('jobOpportunities') || '[]'),
            documents: JSON.parse(localStorage.getItem('user_documents') || '[]'),
            diagrams: JSON.parse(localStorage.getItem('user_diagrams') || '[]'),
            whiteboards: JSON.parse(localStorage.getItem('user_whiteboards') || '[]'),
            presentations: JSON.parse(localStorage.getItem('user_presentations') || '[]'),
            code: JSON.parse(localStorage.getItem('user_code') || '[]'),
            markdown: JSON.parse(localStorage.getItem('user_markdown') || '[]'),
            latex: JSON.parse(localStorage.getItem('user_latex') || '[]'),
            mermaid: JSON.parse(localStorage.getItem('user_mermaid') || '[]'),
            plantuml: JSON.parse(localStorage.getItem('user_plantuml') || '[]'),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    saveFullProfileData(profile) {
        localStorage.setItem('cleansheet_profile_firstName', profile.userFirstName || '');
        localStorage.setItem('cleansheet_profile_lastName', profile.userLastName || '');
        localStorage.setItem('cleansheet_profile_occupation', profile.userOccupation || '');
        localStorage.setItem('cleansheet_profile_goals', profile.userGoals || '');
        localStorage.setItem('cleansheet_experiences', JSON.stringify(profile.experiences || []));
        localStorage.setItem('cleansheet_stories', JSON.stringify(profile.stories || []));
        localStorage.setItem('userPortfolio', JSON.stringify(profile.portfolio || []));
        localStorage.setItem('userGoals', JSON.stringify(profile.goals || []));
        localStorage.setItem('jobOpportunities', JSON.stringify(profile.jobOpportunities || []));
        localStorage.setItem('user_documents', JSON.stringify(profile.documents || []));
        localStorage.setItem('user_diagrams', JSON.stringify(profile.diagrams || []));
        localStorage.setItem('user_whiteboards', JSON.stringify(profile.whiteboards || []));
        localStorage.setItem('user_presentations', JSON.stringify(profile.presentations || []));
        localStorage.setItem('user_code', JSON.stringify(profile.code || []));
        localStorage.setItem('user_markdown', JSON.stringify(profile.markdown || []));
        localStorage.setItem('user_latex', JSON.stringify(profile.latex || []));
        localStorage.setItem('user_mermaid', JSON.stringify(profile.mermaid || []));
        localStorage.setItem('user_plantuml', JSON.stringify(profile.plantuml || []));
        localStorage.setItem('cleansheet_last_modified', new Date().toISOString());
    }

    splitIntoCollections(fullProfile) {
        const collections = {};

        for (const [collectionName, fields] of Object.entries(this.collections)) {
            collections[collectionName] = {};
            fields.forEach(field => {
                collections[collectionName][field] = fullProfile[field];
            });
        }

        return collections;
    }

    mergeCollectionIntoLocalStorage(collectionName, data) {
        const fields = this.collections[collectionName];
        if (!fields) {
            console.warn(`Unknown collection: ${collectionName}`);
            return;
        }

        fields.forEach(field => {
            if (Array.isArray(data[field])) {
                localStorage.setItem(field, JSON.stringify(data[field]));
            } else {
                localStorage.setItem(`cleansheet_profile_${field}`, data[field] || '');
            }
        });
    }

    // ========================================
    // Utility Functions
    // ========================================

    getDeviceId() {
        let deviceId = localStorage.getItem('cleansheet_device_id');
        if (!deviceId) {
            deviceId = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('cleansheet_device_id', deviceId);
        }
        return deviceId;
    }

    isMoreRecent(item1, item2) {
        const date1 = new Date(item1.lastModified || item1.created || 0);
        const date2 = new Date(item2.lastModified || item2.created || 0);
        return date1 > date2;
    }

    addEventListener(event, callback) {
        this.listeners.push({ event, callback });
    }

    notifyListeners(event, data) {
        this.listeners
            .filter(l => l.event === event || l.event === '*')
            .forEach(l => l.callback(data));
    }
}

// Export
if (typeof window !== 'undefined') {
    window.CleansheetSync = CleansheetSync;
}
