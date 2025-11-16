/**
 * Cleansheet Feature Flags System
 *
 * Purpose: Control feature visibility and availability across the platform
 * - Role-based access control
 * - Feature rollout management
 * - A/B testing capabilities
 * - Environment-specific features
 */

const FeatureFlags = {
    // Feature definitions with roles, environments, and rollout status
    features: {
        // Learner Features
        'library': {
            enabled: true,
            roles: ['learner', 'job-seeker', 'professional'],
            description: 'Access to content library',
            environments: ['development', 'staging', 'production']
        },
        'learning-progress': {
            enabled: true,
            roles: ['learner'],
            description: 'Track learning progress and bookmarks',
            environments: ['development', 'staging', 'production']
        },
        'learning-plans': {
            enabled: false,
            roles: ['learner'],
            description: 'Personalized learning paths',
            environments: ['development'],
            comingSoon: true
        },
        'skills-assessment': {
            enabled: false,
            roles: ['learner', 'job-seeker'],
            description: 'Skills testing and validation',
            environments: ['development'],
            comingSoon: true
        },

        // Job Seeker Features
        'job-search': {
            enabled: true,
            roles: ['job-seeker'],
            description: 'Search and browse job opportunities',
            environments: ['development', 'staging', 'production']
        },
        'applications-tracker': {
            enabled: true,
            roles: ['job-seeker'],
            description: 'Track job applications',
            environments: ['development', 'staging', 'production']
        },
        'resume-builder': {
            enabled: false,
            roles: ['job-seeker'],
            description: 'Build and manage resumes',
            environments: ['development'],
            comingSoon: true
        },
        'interview-prep': {
            enabled: false,
            roles: ['job-seeker'],
            description: 'Interview preparation tools',
            environments: ['development'],
            comingSoon: true
        },
        'salary-insights': {
            enabled: false,
            roles: ['job-seeker', 'professional'],
            description: 'Market salary data and analytics',
            environments: ['development'],
            premium: true
        },

        // Professional Features
        'projects-dashboard': {
            enabled: true,
            roles: ['professional'],
            description: 'Manage professional projects',
            environments: ['development', 'staging', 'production']
        },
        'documents-manager': {
            enabled: true,
            roles: ['professional'],
            description: 'Document and form management',
            environments: ['development', 'staging', 'production']
        },
        'reports-analytics': {
            enabled: true,
            roles: ['professional'],
            description: 'Generate reports and analytics',
            environments: ['development', 'staging', 'production']
        },
        'tables-editor': {
            enabled: true,
            roles: ['professional'],
            description: 'Create and edit data tables',
            environments: ['development', 'staging', 'production']
        },
        'team-collaboration': {
            enabled: false,
            roles: ['professional'],
            description: 'Collaborate with team members',
            environments: ['development'],
            comingSoon: true,
            premium: true
        },
        'api-integrations': {
            enabled: false,
            roles: ['professional'],
            description: 'Integrate with external APIs',
            environments: ['development'],
            premium: true
        },

        // Shared Features
        'bookmarks': {
            enabled: true,
            roles: ['learner', 'job-seeker', 'professional'],
            description: 'Bookmark articles and resources',
            environments: ['development', 'staging', 'production']
        },
        'notifications': {
            enabled: true,
            roles: ['learner', 'job-seeker', 'professional'],
            description: 'Browser notifications',
            environments: ['development', 'staging', 'production']
        },
        'profile-customization': {
            enabled: true,
            roles: ['learner', 'job-seeker', 'professional'],
            description: 'Customize user profile',
            environments: ['development', 'staging', 'production']
        },
        'dark-mode': {
            enabled: false,
            roles: ['learner', 'job-seeker', 'professional'],
            description: 'Dark theme support',
            environments: ['development'],
            comingSoon: true
        },
        'coaching-quarters': {
            enabled: false,
            roles: ['learner', 'job-seeker', 'professional'],
            description: '12-week coaching engagements',
            environments: ['development'],
            comingSoon: true,
            premium: true
        },
        'llm-chat-byok': {
            enabled: true,
            roles: ['member', 'learner', 'seeker'],
            description: 'Bring Your Own API Key for LLM chat assistant',
            environments: ['development', 'staging', 'production'],
            requiresAuth: false  // Works with localStorage profiles
        },
        'community-forums': {
            enabled: false,
            roles: ['learner', 'job-seeker', 'professional'],
            description: 'Connect with peers',
            environments: ['development'],
            comingSoon: true
        },

        // Admin/Debug Features
        'debug-panel': {
            enabled: false,
            roles: ['admin'],
            description: 'Debug panel and logs',
            environments: ['development']
        },
        'feature-flag-editor': {
            enabled: false,
            roles: ['admin'],
            description: 'Edit feature flags at runtime',
            environments: ['development']
        }
    },

    // Current environment (can be set via config or URL param)
    currentEnvironment: 'development',

    // User overrides (for testing/demos)
    userOverrides: {},

    /**
     * Initialize feature flags system
     */
    init(environment = 'development') {
        this.currentEnvironment = environment;

        // Load user overrides from localStorage
        const stored = localStorage.getItem('cleansheet_feature_overrides');
        if (stored) {
            try {
                this.userOverrides = JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to load feature overrides:', e);
            }
        }

        // Check for URL parameters (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        const envParam = urlParams.get('env');
        if (envParam) {
            this.currentEnvironment = envParam;
        }

        console.log(`[FeatureFlags] Initialized in ${this.currentEnvironment} environment`);
    },

    /**
     * Check if a feature is enabled for a given role
     * @param {string} featureKey - Feature identifier
     * @param {string} userRole - User's current role
     * @returns {boolean} - Whether feature is enabled
     */
    isEnabled(featureKey, userRole = null) {
        // Check user override first (for testing)
        if (this.userOverrides.hasOwnProperty(featureKey)) {
            return this.userOverrides[featureKey];
        }

        const feature = this.features[featureKey];
        if (!feature) {
            console.warn(`[FeatureFlags] Unknown feature: ${featureKey}`);
            return false;
        }

        // Check if feature is globally enabled
        if (!feature.enabled) {
            return false;
        }

        // Check environment
        if (feature.environments && !feature.environments.includes(this.currentEnvironment)) {
            return false;
        }

        // Check role access
        if (userRole && feature.roles && !feature.roles.includes(userRole)) {
            return false;
        }

        return true;
    },

    /**
     * Get all enabled features for a role
     * @param {string} userRole - User's current role
     * @returns {Array} - List of enabled feature keys
     */
    getEnabledFeatures(userRole) {
        return Object.keys(this.features).filter(key =>
            this.isEnabled(key, userRole)
        );
    },

    /**
     * Get feature metadata
     * @param {string} featureKey - Feature identifier
     * @returns {Object|null} - Feature metadata
     */
    getFeature(featureKey) {
        return this.features[featureKey] || null;
    },

    /**
     * Check if feature is marked as coming soon
     * @param {string} featureKey - Feature identifier
     * @returns {boolean}
     */
    isComingSoon(featureKey) {
        const feature = this.features[featureKey];
        return feature ? feature.comingSoon === true : false;
    },

    /**
     * Check if feature requires premium access
     * @param {string} featureKey - Feature identifier
     * @returns {boolean}
     */
    isPremium(featureKey) {
        const feature = this.features[featureKey];
        return feature ? feature.premium === true : false;
    },

    /**
     * Get all features for a role (including disabled)
     * @param {string} userRole - User's current role
     * @returns {Array} - List of feature objects with metadata
     */
    getAllFeaturesForRole(userRole) {
        return Object.keys(this.features)
            .filter(key => {
                const feature = this.features[key];
                return !feature.roles || feature.roles.includes(userRole);
            })
            .map(key => ({
                key,
                ...this.features[key],
                isEnabled: this.isEnabled(key, userRole)
            }));
    },

    /**
     * Override feature flag (for testing/demos)
     * @param {string} featureKey - Feature identifier
     * @param {boolean} enabled - Enable or disable
     */
    override(featureKey, enabled) {
        this.userOverrides[featureKey] = enabled;
        localStorage.setItem('cleansheet_feature_overrides', JSON.stringify(this.userOverrides));
        console.log(`[FeatureFlags] Override ${featureKey}: ${enabled}`);
    },

    /**
     * Clear all overrides
     */
    clearOverrides() {
        this.userOverrides = {};
        localStorage.removeItem('cleansheet_feature_overrides');
        console.log('[FeatureFlags] Cleared all overrides');
    },

    /**
     * Get feature statistics
     * @returns {Object} - Stats about enabled/disabled features
     */
    getStats() {
        const allFeatures = Object.keys(this.features);
        const enabled = allFeatures.filter(key => this.features[key].enabled);
        const comingSoon = allFeatures.filter(key => this.features[key].comingSoon);
        const premium = allFeatures.filter(key => this.features[key].premium);

        return {
            total: allFeatures.length,
            enabled: enabled.length,
            disabled: allFeatures.length - enabled.length,
            comingSoon: comingSoon.length,
            premium: premium.length,
            byRole: {
                learner: this.getEnabledFeatures('learner').length,
                'job-seeker': this.getEnabledFeatures('job-seeker').length,
                professional: this.getEnabledFeatures('professional').length
            }
        };
    },

    /**
     * Export feature flags configuration (for deployment)
     * @returns {string} - JSON configuration
     */
    exportConfig() {
        return JSON.stringify({
            environment: this.currentEnvironment,
            features: this.features,
            exportedAt: new Date().toISOString()
        }, null, 2);
    },

    /**
     * Import feature flags configuration
     * @param {string|Object} config - JSON configuration or object
     */
    importConfig(config) {
        try {
            const parsed = typeof config === 'string' ? JSON.parse(config) : config;
            if (parsed.features) {
                this.features = parsed.features;
                console.log('[FeatureFlags] Configuration imported successfully');
            }
        } catch (e) {
            console.error('[FeatureFlags] Failed to import configuration:', e);
        }
    }
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
    window.FeatureFlags = FeatureFlags;

    // Initialize with environment detection
    const hostname = window.location.hostname;
    let environment = 'development';

    if (hostname.includes('cleansheet.info') || hostname.includes('cleansheet.com')) {
        environment = 'production';
    } else if (hostname.includes('staging') || hostname.includes('test')) {
        environment = 'staging';
    }

    FeatureFlags.init(environment);
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeatureFlags;
}
