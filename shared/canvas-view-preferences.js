/**
 * Canvas View Preferences - Career Canvas V2
 *
 * Manages view preferences (card, table, etc.) for slideout panels.
 * Preferences are persisted to localStorage and restored on page load.
 *
 * Usage:
 *   ViewPreferences.init();
 *   const view = ViewPreferences.getView('documentsSlideout'); // 'card' or 'table'
 *   ViewPreferences.setView('documentsSlideout', 'table');
 *
 * Used by: career-canvas-v2.html, canvas-slideouts.js
 */

const ViewPreferences = {
    // ===========================================
    // VIEW TYPES (Extensible)
    // ===========================================

    VIEW_TYPES: {
        CARD: 'card',
        TABLE: 'table'
        // Future: LIST: 'list', COMPACT: 'compact', TIMELINE: 'timeline'
    },

    // Default view for slideouts without explicit preference
    defaultView: 'card',

    // Per-slideout preferences (loaded from localStorage)
    preferences: {},

    // localStorage key
    STORAGE_KEY: 'cleansheet_viewPreferences',

    // ===========================================
    // TABLE COLUMN CONFIGURATIONS
    // ===========================================

    // Per-slideout column definitions for table view
    tableColumns: {
        // Default columns for unspecified slideouts
        default: [
            { key: 'title', label: 'Name', width: 'auto' },
            { key: 'description', label: 'Description', width: 'auto', truncate: 60 },
            { key: 'lastModified', label: 'Modified', width: '120px' }
        ],

        // Seeker mode slideouts
        jobsSlideout: [
            { key: 'title', label: 'Position', width: 'auto' },
            { key: 'company', label: 'Company', width: '150px' },
            { key: 'status', label: 'Status', width: '100px' },
            { key: 'appliedDate', label: 'Applied', width: '100px' }
        ],
        experienceSlideout: [
            { key: 'title', label: 'Role', width: 'auto' },
            { key: 'company', label: 'Company', width: '150px' },
            { key: 'duration', label: 'Duration', width: '100px' }
        ],
        goalsSlideout: [
            { key: 'title', label: 'Goal', width: 'auto' },
            { key: 'target', label: 'Target Date', width: '120px' },
            { key: 'status', label: 'Status', width: '100px' }
        ],

        // Professional mode slideouts
        documentsSlideout: [
            { key: 'title', label: 'Document', width: 'auto' },
            { key: 'type', label: 'Type', width: '100px' },
            { key: 'lastModified', label: 'Modified', width: '120px' }
        ],
        diagramsSlideout: [
            { key: 'title', label: 'Diagram', width: 'auto' },
            { key: 'type', label: 'Type', width: '100px' },
            { key: 'lastModified', label: 'Modified', width: '120px' }
        ],
        storiesSlideout: [
            { key: 'title', label: 'Story', width: 'auto' },
            { key: 'situation', label: 'Situation', width: 'auto', truncate: 40 },
            { key: 'lastModified', label: 'Modified', width: '120px' }
        ],
        tablesSlideout: [
            { key: 'title', label: 'Table', width: 'auto' },
            { key: 'rows', label: 'Rows', width: '80px' },
            { key: 'lastModified', label: 'Modified', width: '120px' }
        ],
        formsSlideout: [
            { key: 'title', label: 'Form', width: 'auto' },
            { key: 'fields', label: 'Fields', width: '80px' },
            { key: 'lastModified', label: 'Modified', width: '120px' }
        ],
        reportsSlideout: [
            { key: 'title', label: 'Report', width: 'auto' },
            { key: 'type', label: 'Type', width: '100px' },
            { key: 'lastModified', label: 'Modified', width: '120px' }
        ]
    },

    // ===========================================
    // CORE API
    // ===========================================

    /**
     * Initialize the view preferences system
     * Call this on page load
     */
    init() {
        this._load();
        console.log('[canvas-view-preferences] Initialized with', Object.keys(this.preferences).length, 'preferences');
    },

    /**
     * Get the current view type for a slideout
     * @param {string} slideoutId - The slideout DOM ID
     * @returns {string} - View type ('card', 'table', etc.)
     */
    getView(slideoutId) {
        return this.preferences[slideoutId] || this.defaultView;
    },

    /**
     * Set the view type for a slideout
     * @param {string} slideoutId - The slideout DOM ID
     * @param {string} viewType - View type to set
     */
    setView(slideoutId, viewType) {
        // Validate view type
        const validTypes = Object.values(this.VIEW_TYPES);
        if (!validTypes.includes(viewType)) {
            console.warn('[canvas-view-preferences] Invalid view type:', viewType);
            return;
        }

        const previousType = this.preferences[slideoutId];
        this.preferences[slideoutId] = viewType;
        this._persist();

        // Fire custom event for listeners
        document.dispatchEvent(new CustomEvent('viewpreference:change', {
            detail: {
                slideoutId: slideoutId,
                viewType: viewType,
                previousType: previousType
            }
        }));

        console.log('[canvas-view-preferences] Set', slideoutId, 'to', viewType);
    },

    /**
     * Toggle between card and table views
     * @param {string} slideoutId - The slideout DOM ID
     * @returns {string} - New view type
     */
    toggleView(slideoutId) {
        const currentView = this.getView(slideoutId);
        const newView = currentView === 'card' ? 'table' : 'card';
        this.setView(slideoutId, newView);
        return newView;
    },

    /**
     * Get table column configuration for a slideout
     * @param {string} slideoutId - The slideout DOM ID
     * @returns {Array} - Column definitions
     */
    getTableColumns(slideoutId) {
        return this.tableColumns[slideoutId] || this.tableColumns.default;
    },

    /**
     * Register custom table columns for a slideout
     * @param {string} slideoutId - The slideout DOM ID
     * @param {Array} columns - Column definitions
     */
    registerTableColumns(slideoutId, columns) {
        this.tableColumns[slideoutId] = columns;
        console.log('[canvas-view-preferences] Registered columns for', slideoutId);
    },

    // ===========================================
    // BULK OPERATIONS
    // ===========================================

    /**
     * Set default view for all future slideouts
     * @param {string} viewType - Default view type
     */
    setDefaultView(viewType) {
        const validTypes = Object.values(this.VIEW_TYPES);
        if (validTypes.includes(viewType)) {
            this.defaultView = viewType;
            console.log('[canvas-view-preferences] Default view set to', viewType);
        }
    },

    /**
     * Apply a view type to all slideouts
     * @param {string} viewType - View type to apply globally
     */
    applyViewToAll(viewType) {
        const validTypes = Object.values(this.VIEW_TYPES);
        if (!validTypes.includes(viewType)) {
            console.warn('[canvas-view-preferences] Invalid view type:', viewType);
            return;
        }

        // Apply to all known slideouts
        Object.keys(this.preferences).forEach(slideoutId => {
            this.preferences[slideoutId] = viewType;
        });

        this._persist();

        // Fire bulk change event
        document.dispatchEvent(new CustomEvent('viewpreference:changeall', {
            detail: { viewType: viewType }
        }));

        console.log('[canvas-view-preferences] Applied', viewType, 'to all slideouts');
    },

    /**
     * Clear all view preferences (reset to defaults)
     */
    clearPreferences() {
        this.preferences = {};
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('[canvas-view-preferences] Could not clear preferences:', e);
        }
        console.log('[canvas-view-preferences] Preferences cleared');
    },

    // ===========================================
    // PERSISTENCE
    // ===========================================

    /**
     * Save preferences to localStorage
     * @private
     */
    _persist() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (e) {
            console.warn('[canvas-view-preferences] Could not persist preferences:', e);
        }
    },

    /**
     * Load preferences from localStorage
     * @private
     */
    _load() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.preferences = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('[canvas-view-preferences] Could not load preferences:', e);
            this.preferences = {};
        }
    }
};

// ===========================================
// AUTO-INITIALIZATION
// ===========================================

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ViewPreferences.init());
    } else {
        ViewPreferences.init();
    }
}

// ===========================================
// EXPORTS
// ===========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ViewPreferences };
}
