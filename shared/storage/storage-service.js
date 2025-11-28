/**
 * StorageService - High-Level Storage API
 *
 * Main entry point for all storage operations in Cleansheet.
 * Provides DataService-compatible API with transparent encryption,
 * localStorage migration, and encrypted backup/restore.
 *
 * Usage:
 *   await storageService.initialize();
 *   const experiences = await storageService.getExperiences(personaId);
 *
 * @version 1.0.0
 * @date 2025-11-26
 */

(function(global) {
    'use strict';

    /**
     * StorageService - Unified storage interface
     */
    class StorageService {
        constructor() {
            this.storage = null;
            this.initialized = false;
        }

        // ==========================================
        // Initialization
        // ==========================================

        /**
         * Initialize the storage service
         * @param {Object} config - Configuration options
         * @param {boolean} config.autoMigrate - Auto-migrate from localStorage if data exists
         * @returns {Promise<{backend: string}>}
         */
        async initialize(config = {}) {
            if (this.initialized) {
                return { backend: this.storage.name };
            }

            try {
                // Create Dexie backend
                const backend = new global.DexieBackend();

                // Wrap with encryption middleware
                this.storage = new global.EncryptedStorage(backend);

                // Initialize the storage stack
                const result = await this.storage.initialize();
                if (!result.success) {
                    throw new Error(result.error || 'Storage initialization failed');
                }

                this.initialized = true;

                // Check for localStorage data to migrate
                if (this._hasLocalStorageData()) {
                    console.log('[StorageService] localStorage data detected - migration available');
                    if (config.autoMigrate) {
                        const personaId = this._getCurrentPersona();
                        await this.migrateFromLocalStorage(personaId);
                    }
                }

                console.log('[StorageService] Initialized with', this.storage.name);
                return { backend: this.storage.name };
            } catch (error) {
                console.error('[StorageService] Initialization failed:', error);
                throw error;
            }
        }

        /**
         * Close the storage connection
         * @returns {Promise<void>}
         */
        async close() {
            if (this.storage) {
                await this.storage.close();
            }
            this.initialized = false;
        }

        // ==========================================
        // Profile Methods
        // ==========================================

        /**
         * Get user profile for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Object|null>}
         */
        async getProfile(personaId) {
            this._ensureInitialized();
            return this.storage.get('profiles', personaId);
        }

        /**
         * Save user profile
         * @param {string} personaId - Persona identifier
         * @param {Object} profile - Profile data
         * @returns {Promise<void>}
         */
        async saveProfile(personaId, profile) {
            this._ensureInitialized();
            return this.storage.put('profiles', {
                ...profile,
                id: personaId,
                personaId
            });
        }

        // ==========================================
        // Experience Methods
        // ==========================================

        /**
         * Get all experiences for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Array>}
         */
        async getExperiences(personaId) {
            this._ensureInitialized();
            return this.storage.getAll('experiences', { personaId });
        }

        /**
         * Get a single experience
         * @param {string|number} id - Experience ID
         * @returns {Promise<Object|null>}
         */
        async getExperience(id) {
            this._ensureInitialized();
            return this.storage.get('experiences', id);
        }

        /**
         * Add a new experience
         * @param {string} personaId - Persona identifier
         * @param {Object} experience - Experience data
         * @returns {Promise<string|number>}
         */
        async addExperience(personaId, experience) {
            this._ensureInitialized();
            experience.id = experience.id || this.storage.generateId();
            experience.personaId = personaId;
            return this.storage.add('experiences', experience);
        }

        /**
         * Update an experience
         * @param {string|number} id - Experience ID
         * @param {Object} updates - Fields to update
         * @returns {Promise<void>}
         */
        async updateExperience(id, updates) {
            this._ensureInitialized();
            const existing = await this.storage.get('experiences', id);
            if (!existing) {
                throw new Error(`Experience ${id} not found`);
            }
            return this.storage.put('experiences', { ...existing, ...updates });
        }

        /**
         * Delete an experience
         * @param {string|number} id - Experience ID
         * @returns {Promise<void>}
         */
        async deleteExperience(id) {
            this._ensureInitialized();
            return this.storage.delete('experiences', id);
        }

        // ==========================================
        // Story Methods
        // ==========================================

        /**
         * Get all stories for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Array>}
         */
        async getStories(personaId) {
            this._ensureInitialized();
            return this.storage.getAll('stories', { personaId });
        }

        /**
         * Get a single story
         * @param {string|number} id - Story ID
         * @returns {Promise<Object|null>}
         */
        async getStory(id) {
            this._ensureInitialized();
            return this.storage.get('stories', id);
        }

        /**
         * Add a new story
         * @param {string} personaId - Persona identifier
         * @param {Object} story - Story data
         * @returns {Promise<string|number>}
         */
        async addStory(personaId, story) {
            this._ensureInitialized();
            story.id = story.id || this.storage.generateId();
            story.personaId = personaId;
            return this.storage.add('stories', story);
        }

        /**
         * Update a story
         * @param {string|number} id - Story ID
         * @param {Object} updates - Fields to update
         * @returns {Promise<void>}
         */
        async updateStory(id, updates) {
            this._ensureInitialized();
            const existing = await this.storage.get('stories', id);
            if (!existing) {
                throw new Error(`Story ${id} not found`);
            }
            return this.storage.put('stories', { ...existing, ...updates });
        }

        /**
         * Delete a story
         * @param {string|number} id - Story ID
         * @returns {Promise<void>}
         */
        async deleteStory(id) {
            this._ensureInitialized();
            return this.storage.delete('stories', id);
        }

        // ==========================================
        // Document Methods
        // ==========================================

        /**
         * Get all documents for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Array>}
         */
        async getDocuments(personaId) {
            this._ensureInitialized();
            return this.storage.getAll('documents', { personaId });
        }

        /**
         * Get a single document
         * @param {string|number} id - Document ID
         * @returns {Promise<Object|null>}
         */
        async getDocument(id) {
            this._ensureInitialized();
            return this.storage.get('documents', id);
        }

        /**
         * Save a document (create or update)
         * @param {string} personaId - Persona identifier
         * @param {Object} document - Document data
         * @returns {Promise<string|number>}
         */
        async saveDocument(personaId, document) {
            this._ensureInitialized();
            if (!document.id) {
                document.id = this.storage.generateId();
                document.personaId = personaId;
                return this.storage.add('documents', document);
            }
            return this.storage.put('documents', { ...document, personaId });
        }

        /**
         * Delete a document
         * @param {string|number} id - Document ID
         * @returns {Promise<void>}
         */
        async deleteDocument(id) {
            this._ensureInitialized();
            return this.storage.delete('documents', id);
        }

        // ==========================================
        // Diagram Methods
        // ==========================================

        /**
         * Get all diagrams for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Array>}
         */
        async getDiagrams(personaId) {
            this._ensureInitialized();
            return this.storage.getAll('diagrams', { personaId });
        }

        /**
         * Get a single diagram
         * @param {string|number} id - Diagram ID
         * @returns {Promise<Object|null>}
         */
        async getDiagram(id) {
            this._ensureInitialized();
            return this.storage.get('diagrams', id);
        }

        /**
         * Save a diagram (create or update)
         * @param {string} personaId - Persona identifier
         * @param {Object} diagram - Diagram data
         * @returns {Promise<string|number>}
         */
        async saveDiagram(personaId, diagram) {
            this._ensureInitialized();
            if (!diagram.id) {
                diagram.id = this.storage.generateId();
                diagram.personaId = personaId;
                return this.storage.add('diagrams', diagram);
            }
            return this.storage.put('diagrams', { ...diagram, personaId });
        }

        /**
         * Delete a diagram
         * @param {string|number} id - Diagram ID
         * @returns {Promise<void>}
         */
        async deleteDiagram(id) {
            this._ensureInitialized();
            return this.storage.delete('diagrams', id);
        }

        // ==========================================
        // Job Methods
        // ==========================================

        /**
         * Get all jobs for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Array>}
         */
        async getJobs(personaId) {
            this._ensureInitialized();
            return this.storage.getAll('jobs', { personaId });
        }

        /**
         * Add a new job application
         * @param {string} personaId - Persona identifier
         * @param {Object} job - Job data
         * @returns {Promise<string|number>}
         */
        async addJob(personaId, job) {
            this._ensureInitialized();
            job.id = job.id || this.storage.generateId();
            job.personaId = personaId;
            return this.storage.add('jobs', job);
        }

        /**
         * Update a job application
         * @param {string|number} id - Job ID
         * @param {Object} updates - Fields to update
         * @returns {Promise<void>}
         */
        async updateJob(id, updates) {
            this._ensureInitialized();
            const existing = await this.storage.get('jobs', id);
            if (!existing) {
                throw new Error(`Job ${id} not found`);
            }
            return this.storage.put('jobs', { ...existing, ...updates });
        }

        /**
         * Delete a job application
         * @param {string|number} id - Job ID
         * @returns {Promise<void>}
         */
        async deleteJob(id) {
            this._ensureInitialized();
            return this.storage.delete('jobs', id);
        }

        // ==========================================
        // Goals Methods
        // ==========================================

        /**
         * Get all goals for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Array>}
         */
        async getGoals(personaId) {
            this._ensureInitialized();
            return this.storage.getAll('goals', { personaId });
        }

        /**
         * Add a new goal
         * @param {string} personaId - Persona identifier
         * @param {Object} goal - Goal data
         * @returns {Promise<string|number>}
         */
        async addGoal(personaId, goal) {
            this._ensureInitialized();
            goal.id = goal.id || this.storage.generateId();
            goal.personaId = personaId;
            return this.storage.add('goals', goal);
        }

        /**
         * Update a goal
         * @param {string|number} id - Goal ID
         * @param {Object} updates - Fields to update
         * @returns {Promise<void>}
         */
        async updateGoal(id, updates) {
            this._ensureInitialized();
            const existing = await this.storage.get('goals', id);
            if (!existing) {
                throw new Error(`Goal ${id} not found`);
            }
            return this.storage.put('goals', { ...existing, ...updates });
        }

        /**
         * Delete a goal
         * @param {string|number} id - Goal ID
         * @returns {Promise<void>}
         */
        async deleteGoal(id) {
            this._ensureInitialized();
            return this.storage.delete('goals', id);
        }

        // ==========================================
        // Portfolio Methods
        // ==========================================

        /**
         * Get all portfolio projects for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Array>}
         */
        async getPortfolio(personaId) {
            this._ensureInitialized();
            return this.storage.getAll('portfolio', { personaId });
        }

        /**
         * Add a portfolio project
         * @param {string} personaId - Persona identifier
         * @param {Object} project - Project data
         * @returns {Promise<string|number>}
         */
        async addPortfolioProject(personaId, project) {
            this._ensureInitialized();
            project.id = project.id || this.storage.generateId();
            project.personaId = personaId;
            return this.storage.add('portfolio', project);
        }

        // ==========================================
        // Settings Methods
        // ==========================================

        /**
         * Get a setting value
         * @param {string} key - Setting key
         * @returns {Promise<any>}
         */
        async getSetting(key) {
            this._ensureInitialized();
            const setting = await this.storage.backend.backend.get('settings', key);
            return setting?.value;
        }

        /**
         * Save a setting
         * @param {string} key - Setting key
         * @param {any} value - Setting value
         * @returns {Promise<void>}
         */
        async saveSetting(key, value) {
            this._ensureInitialized();
            return this.storage.backend.backend.put('settings', {
                key,
                value,
                encrypted: false,
                lastModified: new Date().toISOString()
            });
        }

        // ==========================================
        // Bulk Operations
        // ==========================================

        /**
         * Export all data for a persona
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Object>}
         */
        async exportAll(personaId) {
            this._ensureInitialized();

            const [profile, experiences, stories, jobs, goals, portfolio, documents, diagrams] =
                await Promise.all([
                    this.getProfile(personaId),
                    this.getExperiences(personaId),
                    this.getStories(personaId),
                    this.getJobs(personaId),
                    this.getGoals(personaId),
                    this.getPortfolio(personaId),
                    this.getDocuments(personaId),
                    this.getDiagrams(personaId)
                ]);

            return {
                version: '3.0',
                exportDate: new Date().toISOString(),
                personaId,
                profile,
                experiences,
                stories,
                jobs,
                goals,
                portfolio,
                documents,
                diagrams
            };
        }

        /**
         * Import all data for a persona
         * @param {Object} data - Exported data
         * @param {string} personaId - Target persona
         * @returns {Promise<void>}
         */
        async importAll(data, personaId) {
            this._ensureInitialized();

            await this.storage.transaction(
                ['profiles', 'experiences', 'stories', 'jobs', 'goals', 'portfolio', 'documents', 'diagrams'],
                async () => {
                    if (data.profile) {
                        await this.saveProfile(personaId, data.profile);
                    }
                    if (data.experiences?.length) {
                        await this.storage.bulkPut('experiences',
                            data.experiences.map(e => ({ ...e, personaId })));
                    }
                    if (data.stories?.length) {
                        await this.storage.bulkPut('stories',
                            data.stories.map(s => ({ ...s, personaId })));
                    }
                    if (data.jobs?.length) {
                        await this.storage.bulkPut('jobs',
                            data.jobs.map(j => ({ ...j, personaId })));
                    }
                    if (data.goals?.length) {
                        await this.storage.bulkPut('goals',
                            data.goals.map(g => ({ ...g, personaId })));
                    }
                    if (data.portfolio?.length) {
                        await this.storage.bulkPut('portfolio',
                            data.portfolio.map(p => ({ ...p, personaId })));
                    }
                    if (data.documents?.length) {
                        await this.storage.bulkPut('documents',
                            data.documents.map(d => ({ ...d, personaId })));
                    }
                    if (data.diagrams?.length) {
                        await this.storage.bulkPut('diagrams',
                            data.diagrams.map(d => ({ ...d, personaId })));
                    }
                }
            );

            console.log('[StorageService] Import complete for persona:', personaId);
        }

        // ==========================================
        // Encrypted Backup/Restore
        // ==========================================

        /**
         * Create an encrypted backup
         * @param {string} personaId - Persona to backup
         * @param {string} password - Encryption password
         * @returns {Promise<Object>}
         */
        async createEncryptedBackup(personaId, password) {
            this._ensureInitialized();

            const data = await this.exportAll(personaId);
            const encrypted = await global.CleansheetCrypto.encryptWithPassword(
                JSON.stringify(data),
                password
            );

            return {
                version: '3.0',
                format: 'encrypted-backup',
                created: new Date().toISOString(),
                encrypted: true,
                payload: encrypted
            };
        }

        /**
         * Restore from an encrypted backup
         * @param {Object} backup - Backup object
         * @param {string} password - Decryption password
         * @param {string} personaId - Target persona
         * @returns {Promise<{success: boolean, personaId: string}>}
         */
        async restoreEncryptedBackup(backup, password, personaId) {
            this._ensureInitialized();

            if (!backup.encrypted) {
                throw new Error('Backup is not encrypted');
            }

            const decrypted = await global.CleansheetCrypto.decryptWithPassword(
                backup.payload,
                password
            );

            const data = JSON.parse(decrypted);
            await this.importAll(data, personaId);

            return { success: true, personaId };
        }

        // ==========================================
        // Storage Info
        // ==========================================

        /**
         * Get storage usage statistics
         * @returns {Promise<Object>}
         */
        async getUsage() {
            this._ensureInitialized();
            return this.storage.getUsage();
        }

        /**
         * Get record counts by table
         * @param {string} personaId - Persona identifier
         * @returns {Promise<Object>}
         */
        async getCounts(personaId) {
            this._ensureInitialized();
            const tables = ['experiences', 'stories', 'jobs', 'goals', 'portfolio', 'documents', 'diagrams'];
            const counts = {};

            for (const table of tables) {
                counts[table] = await this.storage.count(table, { personaId });
            }

            return counts;
        }

        // ==========================================
        // Migration from localStorage
        // ==========================================

        /**
         * Check if localStorage has data to migrate
         * @returns {boolean}
         */
        _hasLocalStorageData() {
            return !!(
                localStorage.getItem('userProfile') ||
                localStorage.getItem('user_experiences') ||
                localStorage.getItem('cleansheet_experiences') ||
                localStorage.getItem('user_stories')
            );
        }

        /**
         * Get current persona from localStorage
         * @returns {string}
         */
        _getCurrentPersona() {
            return localStorage.getItem('cleansheet_currentPersona') || 'member';
        }

        /**
         * Migrate data from localStorage to IndexedDB
         * @param {string} personaId - Target persona
         * @returns {Promise<{success: boolean, migrated: Object}>}
         */
        async migrateFromLocalStorage(personaId) {
            this._ensureInitialized();
            console.log('[StorageService] Starting localStorage migration...');

            const migrated = {
                profiles: 0,
                experiences: 0,
                stories: 0,
                jobs: 0,
                goals: 0,
                portfolio: 0,
                documents: 0,
                diagrams: 0
            };

            try {
                // Profile
                const profileStr = localStorage.getItem('userProfile');
                if (profileStr) {
                    await this.saveProfile(personaId, JSON.parse(profileStr));
                    migrated.profiles++;
                }

                // Experiences
                const expStr = localStorage.getItem('user_experiences') ||
                               localStorage.getItem('cleansheet_experiences');
                if (expStr) {
                    const experiences = JSON.parse(expStr);
                    await this.storage.bulkPut('experiences',
                        experiences.map((e, i) => ({
                            ...e,
                            id: e.id || `mig_exp_${i}`,
                            personaId
                        })));
                    migrated.experiences = experiences.length;
                }

                // Stories
                const storiesStr = localStorage.getItem('user_stories');
                if (storiesStr) {
                    const stories = JSON.parse(storiesStr);
                    await this.storage.bulkPut('stories',
                        stories.map((s, i) => ({
                            ...s,
                            id: s.id || `mig_story_${i}`,
                            personaId
                        })));
                    migrated.stories = stories.length;
                }

                // Jobs
                const jobsStr = localStorage.getItem('user_jobs');
                if (jobsStr) {
                    const jobs = JSON.parse(jobsStr);
                    await this.storage.bulkPut('jobs',
                        jobs.map((j, i) => ({
                            ...j,
                            id: j.id || `mig_job_${i}`,
                            personaId
                        })));
                    migrated.jobs = jobs.length;
                }

                // Goals (per persona)
                const goalsStr = localStorage.getItem(`userGoals_${personaId}`);
                if (goalsStr) {
                    const goals = JSON.parse(goalsStr);
                    await this.storage.bulkPut('goals',
                        goals.map((g, i) => ({
                            ...g,
                            id: g.id || `mig_goal_${i}`,
                            personaId
                        })));
                    migrated.goals = goals.length;
                }

                // Portfolio (per persona)
                const portfolioStr = localStorage.getItem(`userPortfolio_${personaId}`);
                if (portfolioStr) {
                    const portfolio = JSON.parse(portfolioStr);
                    await this.storage.bulkPut('portfolio',
                        portfolio.map((p, i) => ({
                            ...p,
                            id: p.id || `mig_port_${i}`,
                            personaId
                        })));
                    migrated.portfolio = portfolio.length;
                }

                // Diagrams (per persona)
                const diagramsStr = localStorage.getItem(`diagrams_${personaId}`) ||
                                    localStorage.getItem(`user_diagrams_${personaId}`);
                if (diagramsStr) {
                    const diagrams = JSON.parse(diagramsStr);
                    await this.storage.bulkPut('diagrams',
                        diagrams.map((d, i) => ({
                            ...d,
                            id: d.id || `mig_diag_${i}`,
                            personaId
                        })));
                    migrated.diagrams = diagrams.length;
                }

                // Documents (per persona)
                const docsStr = localStorage.getItem(`interview_documents_${personaId}`) ||
                                localStorage.getItem(`user_documents_${personaId}`);
                if (docsStr) {
                    const documents = JSON.parse(docsStr);
                    await this.storage.bulkPut('documents',
                        documents.map((d, i) => ({
                            ...d,
                            id: d.id || `mig_doc_${i}`,
                            personaId
                        })));
                    migrated.documents = documents.length;
                }

                // Mark migration complete
                await this.saveSetting('migration_from_localstorage', {
                    completed: true,
                    date: new Date().toISOString(),
                    migrated
                });

                console.log('[StorageService] Migration complete:', migrated);
                return { success: true, migrated };

            } catch (error) {
                console.error('[StorageService] Migration failed:', error);
                return { success: false, error: error.message };
            }
        }

        // ==========================================
        // Internal Helpers
        // ==========================================

        /**
         * Ensure service is initialized
         * @private
         */
        _ensureInitialized() {
            if (!this.initialized) {
                throw new Error('[StorageService] Not initialized. Call initialize() first.');
            }
        }
    }

    // Create global singleton
    const storageService = new StorageService();

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { StorageService, storageService };
    }

    // Export to global scope for browser
    global.StorageService = StorageService;
    global.storageService = storageService;

    console.log('[StorageService] Service module loaded');

})(typeof window !== 'undefined' ? window : global);
