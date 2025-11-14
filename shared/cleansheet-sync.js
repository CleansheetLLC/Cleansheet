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

        // Collection schema for Phase 1 (core data)
        this.collections = {
            core: ['profile', 'currentPersona', 'subscriptionTier'],
            experiences: ['experiences'],
            stories: ['stories']
        };
    }

    // ========================================
    // Sync Operations
    // ========================================

    /**
     * Initialize sync (auto-migrate localStorage on first login, setup auto-sync)
     */
    async initialize() {
        if (!this.auth.isAuthenticated()) {
            console.log('Not authenticated - skipping sync initialization');
            return;
        }

        try {
            // Check if first authenticated login with local data
            const user = this.auth.getUser();
            const metadata = await this.downloadBlob(`${user.id}/workspace/sync-metadata.json`);

            if (!metadata) {
                // No cloud workspace exists - check for local data
                console.log('📦 First authenticated login detected');

                const hasLocalData = this.hasLocalData();

                if (hasLocalData) {
                    console.log('📤 Auto-migrating localStorage to cloud...');
                    this.notifyListeners('migration_start', { type: 'localStorage' });

                    // Collect and upload local data
                    await this.syncUp();

                    // Mark migration complete
                    localStorage.setItem('cleansheet_migration_complete', new Date().toISOString());
                    localStorage.setItem('cleansheet_migration_source', 'localStorage');

                    console.log('✓ Auto-migration complete');
                    this.notifyListeners('migration_complete', {
                        type: 'localStorage',
                        timestamp: new Date().toISOString()
                    });
                } else {
                    console.log('No local data to migrate - creating new cloud workspace');
                }
            } else {
                // Cloud workspace exists - perform initial sync down
                console.log('☁️ Existing cloud workspace found');
                await this.syncDown();
            }

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

            console.log('✓ Sync initialized successfully');

        } catch (error) {
            console.error('Sync initialization failed:', error);
            this.notifyListeners('sync_error', { phase: 'initialization', error });
        }
    }

    /**
     * Check if there's any Phase 1 data in localStorage
     */
    hasLocalData() {
        const profile = localStorage.getItem('cleansheet_profile');
        const experiences = localStorage.getItem('cleansheet_experiences');
        const stories = localStorage.getItem('cleansheet_stories') || localStorage.getItem('behavioralStories');

        // Return true if any Phase 1 data exists
        return !!(profile || experiences || stories);
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
     * Phase 1: Handle profile, experiences, stories
     */
    mergeProfiles(profile1, profile2) {
        const merged = { ...profile1 };

        // Merge array collections by ID (Phase 1: experiences, stories)
        const arrayCollections = ['experiences', 'stories'];

        arrayCollections.forEach(collection => {
            const arr1 = profile1[collection] || [];
            const arr2 = profile2[collection] || [];

            // Merge by ID if items have IDs, otherwise concatenate
            if (arr1.length > 0 && arr1[0].id) {
                const mergedMap = new Map();

                [...arr1, ...arr2].forEach(item => {
                    const existing = mergedMap.get(item.id);
                    if (!existing || this.isMoreRecent(item, existing)) {
                        mergedMap.set(item.id, item);
                    }
                });

                merged[collection] = Array.from(mergedMap.values());
            } else {
                // No IDs, just concatenate and dedupe by JSON stringify
                const combined = [...arr1, ...arr2];
                const unique = [];
                const seen = new Set();

                combined.forEach(item => {
                    const key = JSON.stringify(item);
                    if (!seen.has(key)) {
                        seen.add(key);
                        unique.push(item);
                    }
                });

                merged[collection] = unique;
            }
        });

        // For profile object, prefer local (profile2)
        if (profile2.profile) {
            merged.profile = profile2.profile;
        }

        // For scalar fields, prefer local (profile2)
        if (profile2.currentPersona) {
            merged.currentPersona = profile2.currentPersona;
        }
        if (profile2.subscriptionTier) {
            merged.subscriptionTier = profile2.subscriptionTier;
        }

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
     * Collect full profile data from localStorage
     * Phase 1: Core data only (profile, persona, experiences, stories, subscription)
     */
    collectFullProfileData() {
        // Parse profile object
        const profileStr = localStorage.getItem('cleansheet_profile');
        const profile = profileStr ? JSON.parse(profileStr) : {firstName: '', lastName: '', profession: '', goal: ''};

        // Load stories with fallback to legacy key
        let storiesStr = localStorage.getItem('cleansheet_stories');
        if (!storiesStr) {
            storiesStr = localStorage.getItem('behavioralStories');
        }

        return {
            // Phase 1: Core Professional Data
            profile: profile,
            currentPersona: localStorage.getItem('cleansheet_currentPersona') || 'default',
            experiences: JSON.parse(localStorage.getItem('cleansheet_experiences') || '[]'),
            stories: JSON.parse(storiesStr || '[]'),
            subscriptionTier: localStorage.getItem('subscription_tier') || 'seeker',

            // Metadata
            exportDate: new Date().toISOString(),
            version: '2.0', // Phase 1 schema
            phase: 1
        };
    }

    /**
     * Save full profile data to localStorage
     * Phase 1: Core data only (profile, persona, experiences, stories, subscription)
     */
    saveFullProfileData(data) {
        // Save profile as single JSON object
        if (data.profile) {
            localStorage.setItem('cleansheet_profile', JSON.stringify(data.profile));
        }

        // Save persona
        if (data.currentPersona) {
            localStorage.setItem('cleansheet_currentPersona', data.currentPersona);
        }

        // Save experiences
        if (data.experiences) {
            localStorage.setItem('cleansheet_experiences', JSON.stringify(data.experiences));
        }

        // Save stories (to both keys for backwards compatibility)
        if (data.stories) {
            localStorage.setItem('cleansheet_stories', JSON.stringify(data.stories));
            localStorage.setItem('behavioralStories', JSON.stringify(data.stories));
        }

        // Save subscription tier
        if (data.subscriptionTier) {
            localStorage.setItem('subscription_tier', data.subscriptionTier);
        }

        // Update last modified timestamp
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

    /**
     * Merge collection data into localStorage
     * Phase 1: Handle core, experiences, and stories collections
     */
    mergeCollectionIntoLocalStorage(collectionName, data) {
        const fields = this.collections[collectionName];
        if (!fields) {
            console.warn(`Unknown collection: ${collectionName}`);
            return;
        }

        fields.forEach(field => {
            const value = data[field];
            if (value === undefined || value === null) return;

            if (field === 'profile') {
                // Profile is a JSON object
                localStorage.setItem('cleansheet_profile', JSON.stringify(value));
            } else if (field === 'currentPersona') {
                localStorage.setItem('cleansheet_currentPersona', value);
            } else if (field === 'subscriptionTier') {
                localStorage.setItem('subscription_tier', value);
            } else if (field === 'experiences') {
                localStorage.setItem('cleansheet_experiences', JSON.stringify(value));
            } else if (field === 'stories') {
                // Save to both keys for backwards compatibility
                localStorage.setItem('cleansheet_stories', JSON.stringify(value));
                localStorage.setItem('behavioralStories', JSON.stringify(value));
            } else if (Array.isArray(value)) {
                // Generic array field
                localStorage.setItem(field, JSON.stringify(value));
            } else {
                // Generic scalar field
                localStorage.setItem(field, value);
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

    // ========================================
    // Hybrid Load/Save Pattern Helpers
    // ========================================

    /**
     * Hybrid load: Try cloud first, fall back to localStorage
     * @param {string} key - localStorage key
     * @param {*} defaultValue - Default value if not found
     * @returns {Promise<*>}
     */
    async hybridLoad(key, defaultValue = null) {
        // Try cloud first if authenticated
        if (this.auth.isAuthenticated()) {
            try {
                const cloudData = await this.getWorkspace();
                if (cloudData && cloudData[key] !== undefined) {
                    // Cache to localStorage
                    const value = cloudData[key];
                    if (typeof value === 'object') {
                        localStorage.setItem(key, JSON.stringify(value));
                    } else {
                        localStorage.setItem(key, value);
                    }
                    console.log(`✓ Loaded ${key} from cloud`);
                    return value;
                }
            } catch (error) {
                console.warn(`Cloud load failed for ${key}, using localStorage:`, error);
            }
        }

        // Fallback to localStorage
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return stored; // Not JSON, return as string
            }
        }

        return defaultValue;
    }

    /**
     * Hybrid save: Save to localStorage immediately, debounced cloud sync
     * @param {string} key - localStorage key
     * @param {*} value - Value to save
     * @param {number} debounceMs - Debounce delay in ms (default: 2000)
     */
    async hybridSave(key, value, debounceMs = 2000) {
        // Always save to localStorage (instant, works offline)
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }

        // Update last modified
        localStorage.setItem('cleansheet_last_modified', new Date().toISOString());

        // Sync to cloud if authenticated (debounced)
        if (this.auth.isAuthenticated()) {
            // Clear existing timer for this key
            if (!this._debouncedSyncs) {
                this._debouncedSyncs = new Map();
            }

            const existingTimer = this._debouncedSyncs.get(key);
            if (existingTimer) {
                clearTimeout(existingTimer);
            }

            // Set new timer
            const timer = setTimeout(async () => {
                try {
                    console.log(`⬆️ Syncing ${key} to cloud (debounced)`);
                    await this.syncUp();
                    this._debouncedSyncs.delete(key);
                } catch (error) {
                    console.error(`Cloud sync failed for ${key}:`, error);
                    // Data still in localStorage, will sync later
                }
            }, debounceMs);

            this._debouncedSyncs.set(key, timer);
        }
    }

    /**
     * Get workspace data (downloads full profile from cloud)
     * @returns {Promise<Object>}
     */
    async getWorkspace() {
        const user = this.auth.getUser();
        const metadata = await this.downloadBlob(`${user.id}/workspace/sync-metadata.json`);

        if (!metadata) {
            return null;
        }

        // Download all collections
        const downloads = metadata.collections.map(name =>
            this.downloadBlob(`${user.id}/workspace/${name}.json`)
                .then(data => ({ name, data }))
        );

        const collections = await Promise.all(downloads);

        // Merge collections into single object
        const workspace = {};
        collections.forEach(({ name, data }) => {
            Object.assign(workspace, data);
        });

        return workspace;
    }

    /**
     * Save workspace data (uploads full profile to cloud)
     * @param {Object} data - Workspace data to save
     */
    async saveWorkspace(data) {
        // This is just an alias for syncUp with optional data override
        // If data provided, temporarily replace localStorage
        if (data) {
            const originalData = this.collectFullProfileData();
            this.saveFullProfileData(data);
            await this.syncUp();
            // Restore original if different
            if (JSON.stringify(data) !== JSON.stringify(originalData)) {
                this.saveFullProfileData(originalData);
            }
        } else {
            await this.syncUp();
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.CleansheetSync = CleansheetSync;
}
