// Draw.io Diagram Editor Functions
// Handles iframe embedding, postMessage communication, and diagram persistence

// Global state
let currentEditingDiagramId = null;
let diagramIframe = null;
let diagramIframeInitialized = false;
let pendingDiagramLoad = null;

// Draw.io embed URL configuration
const DRAWIO_EMBED_URL = 'https://embed.diagrams.net/?' + new URLSearchParams({
    embed: '1',           // Enable embed mode
    proto: 'json',        // Use JSON protocol for messages
    ui: 'atlas',          // Clean UI theme
    spin: '1',            // Show loading spinner
    saveAndExit: '1',     // Show "Save and Exit" button
    libraries: '1',       // Enable shape libraries
    noSaveBtn: '0',       // Keep Save button visible
    noExitBtn: '0'        // Keep Exit button visible
});

// Initialize diagram iframe and postMessage listener
function initializeDiagramIframe() {
    console.log('[Diagram] Initializing iframe...');

    diagramIframe = document.getElementById('diagramIframe');

    if (!diagramIframe) {
        console.error('[Diagram] Iframe element not found');
        return;
    }

    // Set up postMessage listener
    window.addEventListener('message', handleDiagramMessage);

    console.log('[Diagram] ✅ Iframe initialized, listener ready');
}

// Handle postMessage events from draw.io iframe
function handleDiagramMessage(event) {
    // Only accept messages from diagrams.net domains
    if (!event.origin.includes('diagrams.net')) {
        return;
    }

    try {
        const msg = JSON.parse(event.data);
        console.log('[Diagram] Message received:', msg.event || msg.action);

        switch (msg.event) {
            case 'init':
                // Iframe is ready, send initial diagram data
                console.log('[Diagram] Iframe ready (init event)');
                diagramIframeInitialized = true;

                if (pendingDiagramLoad) {
                    loadDiagramIntoIframe(pendingDiagramLoad);
                    pendingDiagramLoad = null;
                }
                break;

            case 'load':
                // Diagram loaded successfully
                console.log('[Diagram] Diagram loaded, size:', msg.width, 'x', msg.height);
                break;

            case 'autosave':
                // Auto-save triggered by draw.io
                console.log('[Diagram] Auto-save triggered');
                if (msg.xml && currentEditingDiagramId) {
                    saveDiagramSilently(msg.xml);
                }
                break;

            case 'save':
                // User clicked Save button
                console.log('[Diagram] Save button clicked');
                if (msg.xml && currentEditingDiagramId) {
                    saveDiagramSilently(msg.xml);
                    showToast('Diagram saved', 'success');
                }
                break;

            case 'exit':
                // User clicked Exit button or closed
                console.log('[Diagram] Exit requested');
                closeDiagramEditor();
                break;

            case 'export':
                // Export completed (if we requested it)
                console.log('[Diagram] Export completed');
                break;

            default:
                console.log('[Diagram] Unhandled event:', msg.event);
        }
    } catch (error) {
        console.error('[Diagram] Error handling message:', error);
    }
}

// Load diagram XML into the iframe
function loadDiagramIntoIframe(diagramData) {
    if (!diagramIframe || !diagramIframe.contentWindow) {
        console.error('[Diagram] Iframe not ready');
        return;
    }

    const xmlData = diagramData || getEmptyDiagramXML();

    console.log('[Diagram] Loading diagram into iframe');
    console.log('[Diagram] XML length:', xmlData.length);

    const message = {
        action: 'load',
        autosave: 1,              // Enable autosave
        xml: xmlData
    };

    diagramIframe.contentWindow.postMessage(JSON.stringify(message), '*');
    console.log('[Diagram] Load message sent');
}

// Get empty diagram XML template
function getEmptyDiagramXML() {
    return `<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
  </root>
</mxGraphModel>`;
}

// Open diagram by ID
function openDiagramByIdDrawio(id) {
    console.log('=== OPENING DIAGRAM ===');
    console.log('[Diagram] ID:', id);

    const stored = localStorage.getItem(`diagrams_${currentPersona}`);
    const diagrams = stored ? JSON.parse(stored) : [];
    const diagram = diagrams.find(d => d.id === id);

    if (!diagram) {
        console.error('[Diagram] Not found with ID:', id);
        showToast('Diagram not found', 'error');
        return;
    }

    console.log('[Diagram] Found:', {
        id: diagram.id,
        name: diagram.name,
        hasData: !!diagram.diagramData,
        dataLength: diagram.diagramData ? diagram.diagramData.length : 0
    });

    currentEditingDiagramId = id;

    // Show editor
    document.getElementById('diagramEditor').style.display = 'flex';
    document.getElementById('diagramEditorTitle').textContent = diagram.name || 'Untitled Diagram';

    // Initialize rating buttons (Phase 3b)
    if (typeof initializeModalRating === 'function') {
        initializeModalRating('diagramEditor', {
            modalName: 'Diagram Editor',
            modalType: 'diagram-editor',
            complexity: 'very-high'
        });
    }

    // Initialize iframe if not already done
    if (!diagramIframe) {
        initializeDiagramIframe();
    }

    // Check if iframe src contains diagrams.net (meaning it's already loaded)
    const iframeHasDrawio = diagramIframe.src && diagramIframe.src.includes('diagrams.net');

    if (!iframeHasDrawio) {
        // First time loading draw.io
        console.log('[Diagram] Loading iframe source:', DRAWIO_EMBED_URL);

        // Save diagram data to load after init
        pendingDiagramLoad = diagram.diagramData;

        // Set iframe src to load draw.io
        diagramIframe.src = DRAWIO_EMBED_URL;

        console.log('[Diagram] Waiting for iframe init event...');
    } else if (diagramIframeInitialized) {
        // Iframe already ready, load immediately
        console.log('[Diagram] Iframe already initialized, loading diagram data');
        loadDiagramIntoIframe(diagram.diagramData);
    } else {
        // Iframe loading, save for pending load
        console.log('[Diagram] Iframe loading, saving data for pending load');
        pendingDiagramLoad = diagram.diagramData;
    }
}

// Close diagram editor
function closeDiagramEditorDrawio() {
    console.log('=== CLOSING DIAGRAM EDITOR ===');

    // Note: draw.io already auto-saves, so we don't need explicit save here
    // The 'exit' event handler already triggered any final save

    // Hide editor
    const editorElement = document.getElementById('diagramEditor');
    if (editorElement) {
        editorElement.style.display = 'none';
        console.log('[Diagram] Editor hidden');
    }

    // Clear rating buttons (Phase 3b)
    if (typeof clearModalRating === 'function') {
        clearModalRating('diagramEditor');
    }

    currentEditingDiagramId = null;

    // Reload diagrams list to show updated last modified time
    loadDiagrams();
    console.log('[Diagram] ✅ Diagrams list reloaded');
}

// Save diagram silently (called by autosave)
function saveDiagramSilently(xmlData) {
    console.log('=== SAVING DIAGRAM ===');
    console.log('[Diagram] ID:', currentEditingDiagramId);

    if (!currentEditingDiagramId) {
        console.warn('[Diagram] No diagram ID to save');
        return;
    }

    if (!xmlData) {
        console.warn('[Diagram] No XML data to save');
        return;
    }

    try {
        const stored = localStorage.getItem(`diagrams_${currentPersona}`);
        let diagrams = stored ? JSON.parse(stored) : [];
        console.log('[Diagram] Total diagrams in storage:', diagrams.length);

        const diagramIndex = diagrams.findIndex(d => d.id === currentEditingDiagramId);
        console.log('[Diagram] Index:', diagramIndex);

        if (diagramIndex === -1) {
            console.warn('[Diagram] Not found in localStorage with ID:', currentEditingDiagramId);
            return;
        }

        console.log('[Diagram] Found to update:', {
            id: diagrams[diagramIndex].id,
            name: diagrams[diagramIndex].name,
            oldDataLength: diagrams[diagramIndex].diagramData ? diagrams[diagramIndex].diagramData.length : 0
        });

        // Save diagram XML
        console.log('[Diagram] New data length:', xmlData.length);
        console.log('[Diagram] Data preview:', xmlData.substring(0, 100));

        diagrams[diagramIndex].diagramData = xmlData;
        diagrams[diagramIndex].lastModified = new Date().toISOString();

        localStorage.setItem(`diagrams_${currentPersona}`, JSON.stringify(diagrams));
        console.log('[Diagram] ✅ Saved successfully to localStorage');
    } catch (error) {
        console.error('[Diagram] ❌ Error saving:', error);
        console.error('[Diagram] Error stack:', error.stack);
        showToast('Error saving diagram', 'error');
    }
}

// Edit diagram metadata
function editDiagramMetadata() {
    if (!currentEditingDiagramId) return;

    const stored = localStorage.getItem(`diagrams_${currentPersona}`);
    const diagrams = stored ? JSON.parse(stored) : [];
    const diagram = diagrams.find(d => d.id === currentEditingDiagramId);

    if (!diagram) return;

    // Fill modal with current data
    document.getElementById('diagramName').value = diagram.name || '';
    document.getElementById('diagramDescription').value = diagram.description || '';
    document.getElementById('diagramModalTitle').textContent = 'Edit Diagram';

    // Set link type
    currentDiagramLinkType = diagram.linkedType || 'none';
    setDiagramLinkType(currentDiagramLinkType);

    // If linked, select the item
    if (diagram.linkedId) {
        const select = document.getElementById('diagramLinkSelect');
        // Set the value after options are populated
        setTimeout(() => {
            select.value = diagram.linkedId;
        }, 100);
    }

    // Store current ID for update
    currentDiagramId = currentEditingDiagramId;

    // Show modal
    document.getElementById('diagramModal').style.display = 'flex';
}

console.log('[Diagram] ✅ drawio-diagram-editor.js loaded');
