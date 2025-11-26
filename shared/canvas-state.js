/**
 * Canvas State Management - Career Canvas V2
 *
 * Simple, flat state management for the Canvas application.
 * Pattern: Global state object with setter functions that trigger UI updates.
 *
 * Used by: career-canvas-v2.html
 */

// ===========================================
// GLOBAL STATE
// ===========================================

const canvasState = {
    // Current persona (determines data displayed)
    currentPersona: 'retail-manager',

    // View mode: 'member' | 'learner' | 'seeker' | 'professional'
    currentViewMode: 'member',

    // Currently expanded node ID in D3 tree (only one at a time)
    expandedNodeId: null,

    // Currently selected node ID
    selectedNodeId: null,

    // Active slideout panel ID (null if none open)
    activeSlideout: null,

    // Active main menu item
    activeMenu: 'home',

    // Right panel collapsed state
    panelCollapsed: false,

    // Subscription tier for feature flags
    subscriptionTier: 'free',

    // UI preferences
    preferences: {
        theme: 'light',
        compactMode: false
    }
};

// ===========================================
// PERSONA METADATA
// ===========================================

const personaInfo = {
    'retail-manager': {
        id: 'retail-manager',
        name: 'Alex Martinez',
        role: 'Retail Manager',
        initials: 'AM',
        avatarColor: '#11304f'
    },
    'chemist': {
        id: 'chemist',
        name: 'Dr. Sarah Chen',
        role: 'Research Chemist',
        initials: 'SC',
        avatarColor: '#11304f'
    },
    'new-graduate': {
        id: 'new-graduate',
        name: 'Jordan Kim',
        role: 'New Graduate',
        initials: 'JK',
        avatarColor: '#11304f'
    },
    'data-analyst': {
        id: 'data-analyst',
        name: 'Riley Patel',
        role: 'Data Analyst',
        initials: 'RP',
        avatarColor: '#11304f'
    }
};

// ===========================================
// STATE GETTERS
// ===========================================

/**
 * Get current persona ID
 * @returns {string}
 */
function getCurrentPersona() {
    return canvasState.currentPersona;
}

/**
 * Get current persona metadata
 * @returns {Object}
 */
function getCurrentPersonaInfo() {
    return personaInfo[canvasState.currentPersona] || personaInfo['retail-manager'];
}

/**
 * Get current view mode
 * @returns {string}
 */
function getCurrentViewMode() {
    return canvasState.currentViewMode;
}

/**
 * Check if a feature is enabled based on subscription tier
 * @param {string} feature
 * @returns {boolean}
 */
function isFeatureEnabled(feature) {
    const tierFeatures = {
        'free': ['basic_canvas', 'documents', 'diagrams'],
        'pro': ['basic_canvas', 'documents', 'diagrams', 'ai_assistant', 'calendar_sync', 'export'],
        'team': ['basic_canvas', 'documents', 'diagrams', 'ai_assistant', 'calendar_sync', 'export', 'collaboration', 'analytics']
    };

    const enabledFeatures = tierFeatures[canvasState.subscriptionTier] || tierFeatures['free'];
    return enabledFeatures.includes(feature);
}

// ===========================================
// STATE SETTERS (WITH UI UPDATES)
// ===========================================

/**
 * Update multiple state properties at once
 * @param {Object} updates - Key-value pairs to update
 */
function updateCanvasState(updates) {
    Object.assign(canvasState, updates);

    // Trigger refresh if available
    if (typeof refreshCanvas === 'function') {
        refreshCanvas();
    }

    console.log('[canvas-state] State updated:', Object.keys(updates));
}

/**
 * Set current persona and update UI
 * @param {string} personaId
 */
function setCanvasPersona(personaId) {
    if (!personaInfo[personaId]) {
        console.warn('[canvas-state] Unknown persona:', personaId);
        return;
    }

    canvasState.currentPersona = personaId;
    canvasState.expandedNodeId = null; // Reset expanded node when switching

    // Persist to localStorage
    try {
        localStorage.setItem('cleansheet_currentPersona', personaId);
    } catch (e) {
        console.warn('[canvas-state] Could not persist persona:', e);
    }

    // Trigger persona change callback if defined
    if (typeof onPersonaChange === 'function') {
        onPersonaChange(personaId);
    }

    console.log('[canvas-state] Persona set to:', personaId);
}

/**
 * Set current view mode and update UI
 * @param {string} mode - 'seeker' | 'learner' | 'professional' | 'personal'
 */
function setCanvasViewMode(mode) {
    const validModes = ['seeker', 'learner', 'professional', 'personal'];

    if (!validModes.includes(mode)) {
        console.warn('[canvas-state] Invalid view mode:', mode);
        return;
    }

    canvasState.currentViewMode = mode;

    // Persist to localStorage
    try {
        localStorage.setItem('cleansheet_viewMode', mode);
    } catch (e) {
        console.warn('[canvas-state] Could not persist view mode:', e);
    }

    // Trigger view mode change callback if defined
    if (typeof onViewModeChange === 'function') {
        onViewModeChange(mode);
    }

    console.log('[canvas-state] View mode set to:', mode);
}

/**
 * Set active menu and update UI
 * @param {string} menuId
 */
function setCanvasActiveMenu(menuId) {
    canvasState.activeMenu = menuId;

    // Trigger menu change callback if defined
    if (typeof onMenuChange === 'function') {
        onMenuChange(menuId);
    }

    console.log('[canvas-state] Active menu set to:', menuId);
}

/**
 * Set expanded node in D3 tree
 * @param {string|null} nodeId
 */
function setExpandedNode(nodeId) {
    canvasState.expandedNodeId = nodeId;

    console.log('[canvas-state] Expanded node set to:', nodeId);
}

/**
 * Set selected node in D3 tree
 * @param {string|null} nodeId
 */
function setSelectedNode(nodeId) {
    canvasState.selectedNodeId = nodeId;

    console.log('[canvas-state] Selected node set to:', nodeId);
}

/**
 * Set active slideout panel
 * @param {string|null} slideoutId
 */
function setActiveSlideout(slideoutId) {
    canvasState.activeSlideout = slideoutId;

    console.log('[canvas-state] Active slideout set to:', slideoutId);
}

/**
 * Toggle panel collapsed state
 */
function togglePanelCollapsed() {
    canvasState.panelCollapsed = !canvasState.panelCollapsed;

    // Persist preference
    try {
        localStorage.setItem('cleansheet_panelCollapsed', canvasState.panelCollapsed);
    } catch (e) {
        console.warn('[canvas-state] Could not persist panel state:', e);
    }

    console.log('[canvas-state] Panel collapsed:', canvasState.panelCollapsed);
}

// ===========================================
// STATE PERSISTENCE
// ===========================================

/**
 * Load state from localStorage
 */
function loadPersistedState() {
    try {
        const persona = localStorage.getItem('cleansheet_currentPersona');
        if (persona && personaInfo[persona]) {
            canvasState.currentPersona = persona;
        }

        const viewMode = localStorage.getItem('cleansheet_viewMode');
        if (viewMode) {
            canvasState.currentViewMode = viewMode;
        }

        const panelCollapsed = localStorage.getItem('cleansheet_panelCollapsed');
        if (panelCollapsed !== null) {
            canvasState.panelCollapsed = panelCollapsed === 'true';
        }

        console.log('[canvas-state] Persisted state loaded');
    } catch (e) {
        console.warn('[canvas-state] Could not load persisted state:', e);
    }
}

/**
 * Clear all persisted state
 */
function clearPersistedState() {
    try {
        localStorage.removeItem('cleansheet_currentPersona');
        localStorage.removeItem('cleansheet_viewMode');
        localStorage.removeItem('cleansheet_panelCollapsed');
        console.log('[canvas-state] Persisted state cleared');
    } catch (e) {
        console.warn('[canvas-state] Could not clear persisted state:', e);
    }
}

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Initialize canvas state (call on page load)
 */
function initializeCanvasState() {
    loadPersistedState();
    console.log('[canvas-state] Initialized with persona:', canvasState.currentPersona, 'mode:', canvasState.currentViewMode);
}

// Auto-initialize when script loads
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCanvasState);
    } else {
        initializeCanvasState();
    }
}

// ===========================================
// EXPORTS (for module systems)
// ===========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        canvasState,
        personaInfo,
        getCurrentPersona,
        getCurrentPersonaInfo,
        getCurrentViewMode,
        isFeatureEnabled,
        updateCanvasState,
        setCanvasPersona,
        setCanvasViewMode,
        setCanvasActiveMenu,
        setExpandedNode,
        setSelectedNode,
        setActiveSlideout,
        togglePanelCollapsed,
        loadPersistedState,
        clearPersistedState,
        initializeCanvasState
    };
}
