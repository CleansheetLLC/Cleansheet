/**
 * Canvas Slideouts - Career Canvas V2
 *
 * Manages 60% width slideout panels for content display and editing.
 *
 * Pattern: Absolute positioning, right: -60% → right: 0 transition
 *
 * Used by: career-canvas-v2.html
 */

// ===========================================
// SLIDEOUT REGISTRY
// ===========================================

const slideoutRegistry = {
    // Seeker mode slideouts
    'Job Opportunities': 'jobsSlideout',
    'Career Experience': 'experienceSlideout',
    'Goals': 'goalsSlideout',
    'Portfolio': 'portfolioSlideout',
    'Interview Prep': 'interviewSlideout',

    // Professional mode slideouts
    'Documents': 'documentsSlideout',
    'Tables': 'tablesSlideout',
    'Forms': 'formsSlideout',
    'Reports': 'reportsSlideout',
    'Templates': 'templatesSlideout',
    'Pipelines': 'pipelinesSlideout',
    'Workflows': 'workflowsSlideout',

    // Learner mode slideouts
    'Learning': 'learningSlideout',
    'Skills': 'skillsSlideout',
    'Certifications': 'certificationsSlideout',

    // Personal mode slideouts
    'Recipes': 'recipesSlideout',
    'Finance': 'financeSlideout',
    'Shopping': 'shoppingSlideout'
};

// ===========================================
// CORE FUNCTIONS
// ===========================================

/**
 * Open a slideout panel by ID
 * @param {string} slideoutId - DOM ID of the slideout element
 */
function openSlideout(slideoutId) {
    // Close any open slideouts first
    closeAllSlideouts();

    const slideout = document.getElementById(slideoutId);
    if (slideout) {
        slideout.classList.add('active');

        // Update state if available
        if (typeof setActiveSlideout === 'function') {
            setActiveSlideout(slideoutId);
        } else if (typeof canvasState !== 'undefined') {
            canvasState.activeSlideout = slideoutId;
        }

        // Fire custom event
        document.dispatchEvent(new CustomEvent('slideoutOpened', {
            detail: { slideoutId }
        }));

        console.log('[canvas-slideouts] Opened:', slideoutId);
    } else {
        console.warn('[canvas-slideouts] Slideout not found:', slideoutId);
    }
}

/**
 * Close a specific slideout panel
 * @param {string} slideoutId - DOM ID of the slideout element
 */
function closeSlideout(slideoutId) {
    const slideout = document.getElementById(slideoutId);
    if (slideout) {
        slideout.classList.remove('active');

        // Update state if available
        if (typeof setActiveSlideout === 'function') {
            setActiveSlideout(null);
        } else if (typeof canvasState !== 'undefined') {
            canvasState.activeSlideout = null;
        }

        // Fire custom event
        document.dispatchEvent(new CustomEvent('slideoutClosed', {
            detail: { slideoutId }
        }));

        console.log('[canvas-slideouts] Closed:', slideoutId);
    }
}

/**
 * Close all open slideout panels
 */
function closeAllSlideouts() {
    document.querySelectorAll('.slideout.active').forEach(slideout => {
        slideout.classList.remove('active');
    });

    // Update state
    if (typeof setActiveSlideout === 'function') {
        setActiveSlideout(null);
    } else if (typeof canvasState !== 'undefined') {
        canvasState.activeSlideout = null;
    }
}

/**
 * Toggle a slideout panel
 * @param {string} slideoutId - DOM ID of the slideout element
 */
function toggleSlideout(slideoutId) {
    const slideout = document.getElementById(slideoutId);
    if (slideout && slideout.classList.contains('active')) {
        closeSlideout(slideoutId);
    } else {
        openSlideout(slideoutId);
    }
}

/**
 * Check if any slideout is currently open
 * @returns {boolean}
 */
function isAnySlideoutOpen() {
    return document.querySelectorAll('.slideout.active').length > 0;
}

/**
 * Get the currently open slideout ID
 * @returns {string|null}
 */
function getActiveSlideoutId() {
    const active = document.querySelector('.slideout.active');
    return active ? active.id : null;
}

// ===========================================
// D3 NODE CLICK HANDLER
// ===========================================

/**
 * Check if viewport is mobile/tablet
 * @returns {boolean}
 */
function isMobileViewport() {
    return window.innerWidth <= 768;
}

/**
 * Handle click on D3 tree node - open appropriate slideout
 * On mobile: tap directly opens slideout (no expand/collapse)
 * On desktop: nodes with slideouts open slideout, others toggle expand/collapse
 * @param {string} nodeName - Name of the clicked node
 * @param {Object} nodeData - D3 node data object
 */
function handleNodeClick(nodeName, nodeData) {
    const slideoutId = slideoutRegistry[nodeName];
    const isMobile = isMobileViewport();

    if (slideoutId) {
        // Node has a slideout - open it
        if (document.getElementById(slideoutId)) {
            openSlideout(slideoutId);
        } else {
            // Create slideout dynamically if it doesn't exist
            createSlideout(slideoutId, nodeName);
            // Force reflow before adding active class so transition works
            const newSlideout = document.getElementById(slideoutId);
            if (newSlideout) {
                newSlideout.offsetHeight; // Force reflow
            }
            openSlideout(slideoutId);
        }
    } else if (isMobile) {
        // Mobile: nodes without slideouts should still try to find child slideouts
        // or show a message that this category has no content yet
        console.log('[canvas-slideouts] Mobile tap on node without slideout:', nodeName);

        // Check if this node has children with slideouts
        if (nodeData && nodeData.children) {
            // Find first child that has a slideout
            for (const child of nodeData.children) {
                const childSlideoutId = slideoutRegistry[child.data.name];
                if (childSlideoutId) {
                    if (document.getElementById(childSlideoutId)) {
                        openSlideout(childSlideoutId);
                    } else {
                        createSlideout(childSlideoutId, child.data.name);
                        // Force reflow before adding active class so transition works
                        const newSlideout = document.getElementById(childSlideoutId);
                        if (newSlideout) {
                            newSlideout.offsetHeight; // Force reflow
                        }
                        openSlideout(childSlideoutId);
                    }
                    return;
                }
            }
        }

        // No slideout found - could show toast or do nothing
        console.log('[canvas-slideouts] No slideout available for:', nodeName);
    } else {
        // Desktop: toggle expand/collapse for nodes without slideouts
        console.log('[canvas-slideouts] No slideout for node:', nodeName);

        // If we have access to D3 toggle function, use it
        if (typeof toggleD3Node === 'function' && nodeData) {
            // Get D3 tree references from the page
            const svg = d3.select('#canvas-mindmap svg');
            const g = svg.select('g');
            const linkGroup = g.select('.links');
            const nodeGroup = g.select('.nodes');
            const container = document.getElementById('canvas-mindmap');
            const width = container.clientWidth;
            const height = container.clientHeight;

            toggleD3Node(nodeData, svg, g, linkGroup, nodeGroup, width, height);
        }
    }
}

// ===========================================
// DYNAMIC SLIDEOUT CREATION
// ===========================================

/**
 * Create a slideout element dynamically
 * @param {string} slideoutId - DOM ID for the new slideout
 * @param {string} title - Display title for the slideout
 */
function createSlideout(slideoutId, title) {
    // Check if already exists
    if (document.getElementById(slideoutId)) {
        return;
    }

    // Get saved view preference or default to 'card'
    const savedView = typeof ViewPreferences !== 'undefined'
        ? ViewPreferences.getView(slideoutId)
        : 'card';
    const isCardActive = savedView === 'card';
    const isTableActive = savedView === 'table';

    const slideout = document.createElement('div');
    slideout.id = slideoutId;
    slideout.className = 'slideout';
    slideout.innerHTML = `
        <div class="slideout-header">
            <h2>${escapeHtml(title)}</h2>
            <div class="slideout-header-actions">
                <div class="view-toggle" role="group" aria-label="View options">
                    <button class="view-toggle-btn ${isCardActive ? 'active' : ''}"
                            data-view="card"
                            aria-label="Card view"
                            onclick="setSlideoutView('${slideoutId}', 'card')">
                        <i class="ph ph-squares-four"></i>
                    </button>
                    <button class="view-toggle-btn ${isTableActive ? 'active' : ''}"
                            data-view="table"
                            aria-label="Table view"
                            onclick="setSlideoutView('${slideoutId}', 'table')">
                        <i class="ph ph-table"></i>
                    </button>
                </div>
                <button class="slideout-close" onclick="closeSlideout('${slideoutId}')">
                    <i class="ph ph-x"></i>
                </button>
            </div>
        </div>
        <div class="slideout-body" data-view="${savedView}">
            <button class="btn-primary" style="margin-bottom: 16px; align-self: flex-start;">
                <i class="ph ph-plus"></i> Add New
            </button>
            <div class="content-grid card-grid" id="${slideoutId}Grid">
                <!-- Card content will be loaded here -->
                <div class="empty-state" style="text-align: center; padding: 40px; color: var(--color-neutral-text-muted); grid-column: 1 / -1;">
                    <i class="ph ph-folder-open" style="font-size: 48px; display: block; margin-bottom: 12px;"></i>
                    <p>No items yet. Click "Add New" to create your first item.</p>
                </div>
            </div>
            <table class="content-table" id="${slideoutId}Table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Modified</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="empty-row">
                        <td colspan="3">
                            <i class="ph ph-folder-open"></i>
                            <p>No items yet. Click "Add New" to create your first item.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    // Find container or append to body
    const container = document.querySelector('.canvas-container') || document.body;
    container.appendChild(slideout);

    console.log('[canvas-slideouts] Created slideout:', slideoutId, 'with view:', savedView);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================================
// CONTENT LOADERS
// ===========================================

/**
 * Load content into a slideout's grid
 * @param {string} slideoutId - Slideout DOM ID
 * @param {Array} items - Array of items to display
 * @param {Function} renderFn - Function to render each item as HTML
 */
function loadSlideoutContent(slideoutId, items, renderFn) {
    const grid = document.getElementById(slideoutId + 'Grid');
    if (!grid) {
        console.warn('[canvas-slideouts] Grid not found:', slideoutId + 'Grid');
        return;
    }

    if (!items || items.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px; color: var(--color-neutral-text-muted); grid-column: 1 / -1;">
                <i class="ph ph-folder-open" style="font-size: 48px; display: block; margin-bottom: 12px;"></i>
                <p>No items yet.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = items.map(renderFn).join('');
}

/**
 * Default card renderer
 * @param {Object} item
 * @returns {string} HTML string
 */
function defaultCardRenderer(item) {
    const icon = item.icon || 'ph-file';
    const title = escapeHtml(item.title || item.name || 'Untitled');
    const description = escapeHtml(item.description || '');
    const tags = item.tags || [];

    return `
        <div class="card" data-id="${item.id || ''}">
            <div class="card-header">
                <div class="card-icon">
                    <i class="ph ${icon}"></i>
                </div>
                <div>
                    <div class="card-title">${title}</div>
                    ${description ? `<div class="card-description">${description}</div>` : ''}
                </div>
            </div>
            ${tags.length > 0 ? `
                <div class="card-tags">
                    ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// ===========================================
// VIEW SWITCHING
// ===========================================

/**
 * Set the view mode for a slideout (card or table)
 * @param {string} slideoutId - The slideout DOM ID
 * @param {string} viewType - 'card' or 'table'
 */
function setSlideoutView(slideoutId, viewType) {
    const slideout = document.getElementById(slideoutId);
    if (!slideout) {
        console.warn('[canvas-slideouts] Slideout not found for view change:', slideoutId);
        return;
    }

    // Update view preference (persists to localStorage)
    if (typeof ViewPreferences !== 'undefined') {
        ViewPreferences.setView(slideoutId, viewType);
    }

    // Update data-view attribute on slideout body
    const body = slideout.querySelector('.slideout-body');
    if (body) {
        body.setAttribute('data-view', viewType);
    }

    // Update toggle button states
    const toggleBtns = slideout.querySelectorAll('.view-toggle-btn');
    toggleBtns.forEach(btn => {
        const isActive = btn.dataset.view === viewType;
        btn.classList.toggle('active', isActive);
    });

    console.log('[canvas-slideouts] Set view for', slideoutId, 'to', viewType);
}

/**
 * Apply saved view preference to an existing slideout
 * Call this when opening a slideout to ensure it shows the saved view
 * @param {string} slideoutId - The slideout DOM ID
 */
function applySlideoutView(slideoutId) {
    const savedView = typeof ViewPreferences !== 'undefined'
        ? ViewPreferences.getView(slideoutId)
        : 'card';

    setSlideoutView(slideoutId, savedView);
}

/**
 * Render table content for a slideout
 * @param {string} slideoutId - The slideout DOM ID
 * @param {Array} items - Array of items to render
 * @param {Array} columns - Optional column definitions (uses ViewPreferences if not provided)
 */
function renderSlideoutTable(slideoutId, items, columns) {
    const table = document.getElementById(slideoutId + 'Table');
    if (!table) {
        console.warn('[canvas-slideouts] Table not found:', slideoutId + 'Table');
        return;
    }

    // Get column config from ViewPreferences or use provided/default
    const cols = columns || (typeof ViewPreferences !== 'undefined'
        ? ViewPreferences.getTableColumns(slideoutId)
        : [
            { key: 'title', label: 'Name', width: 'auto' },
            { key: 'description', label: 'Description', width: 'auto' },
            { key: 'lastModified', label: 'Modified', width: '120px' }
        ]);

    // Build table header
    const headerHtml = cols.map(col =>
        `<th style="width: ${col.width || 'auto'}">${escapeHtml(col.label)}</th>`
    ).join('');

    // Build table body
    let bodyHtml;
    if (!items || items.length === 0) {
        bodyHtml = `
            <tr class="empty-row">
                <td colspan="${cols.length}">
                    <i class="ph ph-folder-open"></i>
                    <p>No items yet. Click "Add New" to create your first item.</p>
                </td>
            </tr>
        `;
    } else {
        bodyHtml = items.map(item => {
            const cells = cols.map(col => {
                let value = item[col.key] || '';

                // Truncate if specified
                if (col.truncate && value.length > col.truncate) {
                    value = value.substring(0, col.truncate) + '...';
                }

                return `<td>${escapeHtml(String(value))}</td>`;
            }).join('');

            return `<tr data-id="${item.id || ''}">${cells}</tr>`;
        }).join('');
    }

    table.innerHTML = `
        <thead><tr>${headerHtml}</tr></thead>
        <tbody>${bodyHtml}</tbody>
    `;
}

// ===========================================
// KEYBOARD HANDLING
// ===========================================

/**
 * Initialize keyboard shortcuts for slideouts
 */
function initSlideoutKeyboard() {
    document.addEventListener('keydown', function(e) {
        // Escape key closes slideout
        if (e.key === 'Escape' && isAnySlideoutOpen()) {
            closeAllSlideouts();
            e.preventDefault();
        }
    });

    console.log('[canvas-slideouts] Keyboard shortcuts initialized');
}

// Auto-initialize keyboard handling
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlideoutKeyboard);
    } else {
        initSlideoutKeyboard();
    }
}

// ===========================================
// EXPORTS
// ===========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        slideoutRegistry,
        openSlideout,
        closeSlideout,
        closeAllSlideouts,
        toggleSlideout,
        isAnySlideoutOpen,
        getActiveSlideoutId,
        handleNodeClick,
        createSlideout,
        loadSlideoutContent,
        defaultCardRenderer,
        setSlideoutView,
        applySlideoutView,
        renderSlideoutTable
    };
}
