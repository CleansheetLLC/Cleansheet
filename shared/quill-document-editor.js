// Quill Document Editor Functions
// Robust Quill-based document editor replacing Lexical

let documentQuillEditor = null;
let currentEditingDocumentId = null;
let documentAutoSaveTimer = null;

// Initialize Quill editor with comprehensive features
function initializeQuillEditor() {
    if (documentQuillEditor) return; // Already initialized

    console.log('[Quill] Initializing Quill editor with comprehensive features...');

    // Custom toolbar configuration
    const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],

        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],

        ['blockquote', 'code-block'],
        ['link', 'image'],

        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'direction': 'rtl' }],

        ['clean']
    ];

    // Create Quill editor
    documentQuillEditor = new Quill('#quillEditor', {
        theme: 'snow',
        placeholder: 'Start writing your document...',
        modules: {
            toolbar: {
                container: toolbarOptions,
                handlers: {
                    'image': function() {
                        const range = this.quill.getSelection();
                        const url = prompt('Enter image URL:');
                        if (url) {
                            this.quill.insertEmbed(range.index, 'image', url);
                        }
                    }
                }
            },
            history: {
                delay: 1000,
                maxStack: 100,
                userOnly: true
            }
        }
    });

    // Add auto-save on content changes
    documentQuillEditor.on('text-change', function(delta, oldDelta, source) {
        if (source === 'user' && currentEditingDocumentId) {
            console.log('[Quill] Content changed, scheduling auto-save...');

            // Clear existing timer
            if (documentAutoSaveTimer) {
                clearTimeout(documentAutoSaveTimer);
            }

            // Auto-save after 2 seconds of inactivity
            documentAutoSaveTimer = setTimeout(() => {
                saveDocumentContentSilently();
            }, 2000);
        }
    });

    // Add keyboard shortcuts
    documentQuillEditor.keyboard.addBinding({
        key: 'S',
        ctrlKey: true
    }, function(range, context) {
        saveDocumentContentSilently();
        return false; // Prevent default browser save
    });

    console.log('[Quill] Editor initialized successfully');
}

// Open document by ID using Quill
function openDocumentByIdQuill(id) {
    console.log('=== OPENING DOCUMENT WITH QUILL ===');
    console.log('Document ID:', id);

    const stored = localStorage.getItem(`interview_documents_${currentPersona}`);
    const documents = stored ? JSON.parse(stored) : [];
    const doc = documents.find(d => d.id === id);

    if (!doc) {
        console.error('Document not found:', id);
        alert('Document not found');
        return;
    }

    console.log('Found document:', doc.name);
    currentEditingDocumentId = id;

    // Show editor
    document.getElementById('documentEditor').style.display = 'flex';
    document.getElementById('documentEditorTitle').textContent = doc.name || 'Untitled Document';

    // Initialize Quill if not already done
    if (!documentQuillEditor) {
        console.log('[Quill] Initializing editor...');

        // Wait a bit for DOM to be ready
        setTimeout(() => {
            initializeQuillEditor();

            // Set content after initialization
            setTimeout(() => {
                setQuillContent(doc);
            }, 100);
        }, 100);
    } else {
        // Set content immediately if editor exists
        setQuillContent(doc);
    }

    // Update last accessed
    const docIndex = documents.findIndex(d => d.id === id);
    if (docIndex !== -1) {
        documents[docIndex].lastAccessed = new Date().toISOString();
        localStorage.setItem(`interview_documents_${currentPersona}`, JSON.stringify(documents));
    }
}

// Set content in Quill editor
function setQuillContent(doc) {
    if (!documentQuillEditor) {
        console.error('[Quill] Editor not initialized');
        return;
    }

    try {
        // Try to parse as Delta (Quill's native format)
        if (doc.content && typeof doc.content === 'string') {
            try {
                const delta = JSON.parse(doc.content);
                if (delta.ops) {
                    console.log('[Quill] Loading Delta content');
                    documentQuillEditor.setContents(delta);
                    return;
                }
            } catch (e) {
                // Not valid JSON, treat as HTML or plain text
            }
        }

        // Try as HTML
        if (doc.content && doc.content.includes('<')) {
            console.log('[Quill] Loading HTML content');
            documentQuillEditor.clipboard.dangerouslyPasteHTML(doc.content);
        } else {
            // Treat as plain text
            console.log('[Quill] Loading plain text content');
            documentQuillEditor.setText(doc.content || '');
        }
    } catch (error) {
        console.error('[Quill] Error setting content:', error);
        documentQuillEditor.setText(doc.content || '');
    }

    // Scroll to top
    documentQuillEditor.scrollingContainer.scrollTop = 0;
}

// Close document editor
function closeDocumentEditorQuill() {
    console.log('=== CLOSING DOCUMENT EDITOR ===');

    // Save before closing
    if (currentEditingDocumentId && documentQuillEditor) {
        console.log('[Close] Saving document before closing...');
        saveDocumentContentSilently();
    }

    // Clear auto-save timer
    if (documentAutoSaveTimer) {
        clearTimeout(documentAutoSaveTimer);
        documentAutoSaveTimer = null;
    }

    // Hide editor
    const editorElement = document.getElementById('documentEditor');
    if (editorElement) {
        editorElement.style.display = 'none';
        console.log('[Close] Editor hidden');
    }
    currentEditingDocumentId = null;

    // Refresh the documents list to show updated content
    if (typeof loadAllAssets === 'function') {
        console.log('[Close] Refreshing assets list...');
        loadAllAssets();
    }
}

// Save document content silently
function saveDocumentContentSilentlyQuill() {
    if (!currentEditingDocumentId || !documentQuillEditor) {
        console.log('[Save] No document to save or editor not ready');
        return;
    }

    console.log('[Save] Saving document silently...');

    try {
        const stored = localStorage.getItem(`interview_documents_${currentPersona}`);
        const documents = stored ? JSON.parse(stored) : [];
        const docIndex = documents.findIndex(d => d.id === currentEditingDocumentId);

        if (docIndex === -1) {
            console.error('[Save] Document not found in storage');
            return;
        }

        // Get content as Delta (Quill's native format for best fidelity)
        const delta = documentQuillEditor.getContents();
        const deltaJson = JSON.stringify(delta);

        // Also get HTML for preview/export purposes
        const htmlContent = documentQuillEditor.root.innerHTML;

        // Update document
        documents[docIndex].content = deltaJson;
        documents[docIndex].htmlContent = htmlContent; // Store HTML separately for previews
        documents[docIndex].lastModified = new Date().toISOString();

        // Calculate word count for preview
        const textContent = documentQuillEditor.getText();
        documents[docIndex].wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

        // Save to localStorage
        localStorage.setItem(`interview_documents_${currentPersona}`, JSON.stringify(documents));

        console.log('[Save] Document saved successfully');

        // Show brief save indicator
        showSaveIndicator();

    } catch (error) {
        console.error('[Save] Error saving document:', error);
        alert('Error saving document: ' + error.message);
    }
}

// Show save indicator
function showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    if (indicator) {
        indicator.style.opacity = '1';
        indicator.textContent = 'Saved';

        setTimeout(() => {
            indicator.style.opacity = '0.7';
        }, 1500);
    }
}

// Export functions for compatibility
function createQuillToolbar() {
    // Toolbar is automatically created by Quill
    console.log('[Quill] Toolbar created by Quill automatically');
}

// Get document statistics
function getDocumentStats() {
    if (!documentQuillEditor) return { words: 0, characters: 0 };

    const text = documentQuillEditor.getText();
    return {
        words: text.split(/\s+/).filter(word => word.length > 0).length,
        characters: text.length,
        charactersNoSpaces: text.replace(/\s/g, '').length
    };
}

// Insert text at cursor
function insertTextAtCursor(text) {
    if (!documentQuillEditor) return;

    const selection = documentQuillEditor.getSelection();
    if (selection) {
        documentQuillEditor.insertText(selection.index, text);
    }
}

// Format selected text
function formatSelection(format, value = true) {
    if (!documentQuillEditor) return;

    const selection = documentQuillEditor.getSelection();
    if (selection) {
        documentQuillEditor.formatText(selection.index, selection.length, format, value);
    }
}

console.log('[Quill] Document editor functions loaded');