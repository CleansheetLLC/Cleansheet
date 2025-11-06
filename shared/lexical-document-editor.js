// Lexical Document Editor Functions
// Replaces Quill-based document editor with Lexical

function initializeLexicalEditor() {
    if (documentLexicalEditor) return; // Already initialized

    console.log('[Lexical] Initializing Lexical editor...');

    const {
        createEditor,
        $getRoot,
        $createParagraphNode,
        registerRichText,
        registerHistory,
        createEmptyHistoryState,
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode
    } = window.CleansheetLexical;

    // Create Lexical editor config
    const config = {
        namespace: 'DocumentEditor',
        theme: {
            paragraph: 'editor-paragraph',
            quote: 'editor-quote',
            heading: {
                h1: 'editor-heading-h1',
                h2: 'editor-heading-h2',
                h3: 'editor-heading-h3',
            },
            list: {
                ul: 'editor-list-ul',
                ol: 'editor-list-ol',
                listitem: 'editor-listitem',
            },
            text: {
                bold: 'editor-text-bold',
                italic: 'editor-text-italic',
                underline: 'editor-text-underline',
                strikethrough: 'editor-text-strikethrough',
                code: 'editor-text-code',
            },
        },
        onError: (error) => {
            console.error('[Lexical] Error:', error);
        },
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            LinkNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode
        ]
    };

    // Create editor instance
    documentLexicalEditor = createEditor(config);
    documentLexicalEditor.setRootElement(document.getElementById('lexicalEditor'));

    // Register plugins
    registerRichText(documentLexicalEditor);
    registerHistory(documentLexicalEditor, createEmptyHistoryState(), 300);

    // Setup auto-save
    documentLexicalEditor.registerUpdateListener(({ editorState }) => {
        if (documentAutoSaveTimer) clearTimeout(documentAutoSaveTimer);
        documentAutoSaveTimer = setTimeout(() => {
            console.log('[Lexical] Auto-save triggered');
            saveDocumentContentSilently();
        }, 2000);
    });

    // Create toolbar
    createLexicalToolbar();

    console.log('[Lexical] ✅ Editor initialized successfully');
}

function createLexicalToolbar() {
    const toolbar = document.getElementById('lexicalToolbar');
    if (!toolbar) return;

    const {
        $setBlocksType,
        $createHeadingNode,
        $createQuoteNode,
        $createParagraphNode,
        FORMAT_TEXT_COMMAND,
        UNDO_COMMAND,
        REDO_COMMAND,
        INDENT_CONTENT_COMMAND,
        OUTDENT_CONTENT_COMMAND,
        INSERT_UNORDERED_LIST_COMMAND,
        INSERT_ORDERED_LIST_COMMAND,
        INSERT_TABLE_COMMAND,
        TOGGLE_LINK_COMMAND
    } = window.CleansheetLexical;

    // Toolbar helper function
    const createButton = (icon, title, onClick) => {
        const btn = document.createElement('button');
        btn.innerHTML = `<i class="ph ph-${icon}"></i>`;
        btn.title = title;
        btn.style.cssText = 'padding: 6px 10px; border: 1px solid var(--color-neutral-border); border-radius: 4px; background: white; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 16px;';
        btn.onmouseover = () => { btn.style.background = '#f0f0f0'; btn.style.borderColor = 'var(--color-primary-blue)'; };
        btn.onmouseout = () => { btn.style.background = 'white'; btn.style.borderColor = 'var(--color-neutral-border)'; };
        btn.onclick = onClick;
        return btn;
    };

    const createSeparator = () => {
        const sep = document.createElement('div');
        sep.style.cssText = 'width: 1px; height: 24px; background: var(--color-neutral-border);';
        return sep;
    };

    toolbar.innerHTML = '';

    // Undo/Redo
    toolbar.appendChild(createButton('arrow-counter-clockwise', 'Undo (Ctrl+Z)', () => {
        documentLexicalEditor.dispatchCommand(UNDO_COMMAND, undefined);
    }));
    toolbar.appendChild(createButton('arrow-clockwise', 'Redo (Ctrl+Y)', () => {
        documentLexicalEditor.dispatchCommand(REDO_COMMAND, undefined);
    }));

    toolbar.appendChild(createSeparator());

    // Format buttons
    toolbar.appendChild(createButton('text-bolder', 'Bold (Ctrl+B)', () => {
        documentLexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    }));
    toolbar.appendChild(createButton('text-italic', 'Italic (Ctrl+I)', () => {
        documentLexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    }));
    toolbar.appendChild(createButton('text-underline', 'Underline (Ctrl+U)', () => {
        documentLexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    }));
    toolbar.appendChild(createButton('text-strikethrough', 'Strikethrough', () => {
        documentLexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    }));
    toolbar.appendChild(createButton('code', 'Code', () => {
        documentLexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
    }));

    toolbar.appendChild(createSeparator());

    // Headings
    toolbar.appendChild(createButton('text-h-one', 'Heading 1', () => {
        documentLexicalEditor.update(() => {
            const { $getSelection, $isRangeSelection } = window.CleansheetLexical;
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode('h1'));
            }
        });
    }));
    toolbar.appendChild(createButton('text-h-two', 'Heading 2', () => {
        documentLexicalEditor.update(() => {
            const { $getSelection, $isRangeSelection } = window.CleansheetLexical;
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode('h2'));
            }
        });
    }));
    toolbar.appendChild(createButton('text-h-three', 'Heading 3', () => {
        documentLexicalEditor.update(() => {
            const { $getSelection, $isRangeSelection } = window.CleansheetLexical;
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode('h3'));
            }
        });
    }));

    toolbar.appendChild(createSeparator());

    // Lists
    toolbar.appendChild(createButton('list-bullets', 'Bullet List', () => {
        documentLexicalEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }));
    toolbar.appendChild(createButton('list-numbers', 'Numbered List', () => {
        documentLexicalEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }));

    toolbar.appendChild(createSeparator());

    // Indent/Outdent
    toolbar.appendChild(createButton('text-indent', 'Indent', () => {
        documentLexicalEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    }));
    toolbar.appendChild(createButton('text-outdent', 'Outdent', () => {
        documentLexicalEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    }));

    toolbar.appendChild(createSeparator());

    // Quote
    toolbar.appendChild(createButton('quotes', 'Block Quote', () => {
        documentLexicalEditor.update(() => {
            const { $getSelection, $isRangeSelection } = window.CleansheetLexical;
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    }));

    // Link
    toolbar.appendChild(createButton('link', 'Insert Link', () => {
        const url = prompt('Enter URL:');
        if (url) {
            documentLexicalEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
    }));

    // Table
    toolbar.appendChild(createButton('table', 'Insert Table', () => {
        const rows = parseInt(prompt('Number of rows:', '3') || '3');
        const cols = parseInt(prompt('Number of columns:', '3') || '3');
        documentLexicalEditor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns: cols });
    }));
}

function openDocumentByIdLexical(id) {
    console.log('=== OPENING DOCUMENT ===');
    console.log('Document ID:', id);

    const stored = localStorage.getItem(`interview_documents_${currentPersona}`);
    const documents = stored ? JSON.parse(stored) : [];
    const doc = documents.find(d => d.id === id);

    if (!doc) {
        console.error('Document not found with ID:', id);
        showToast('Document not found', 'error');
        return;
    }

    console.log('Found document:', {
        id: doc.id,
        name: doc.name,
        hasContent: !!doc.content,
        contentLength: doc.content ? doc.content.length : 0
    });

    currentEditingDocumentId = id;

    // Show editor
    document.getElementById('documentEditor').style.display = 'flex';
    document.getElementById('documentEditorTitle').textContent = doc.name || 'Untitled Document';

    // Initialize Lexical if not already done
    if (!documentLexicalEditor) {
        initializeLexicalEditor();
    }

    // Load document content
    console.log('[Lexical] Loading content for document ID:', id);
    documentLexicalEditor.update(() => {
        const { $getRoot, $createParagraphNode, $createTextNode } = window.CleansheetLexical;
        const root = $getRoot();
        root.clear();

        if (doc.content) {
            try {
                // Try to parse as Lexical JSON
                const editorState = documentLexicalEditor.parseEditorState(doc.content);
                documentLexicalEditor.setEditorState(editorState);
                console.log('[Lexical] Content loaded from JSON');
            } catch (e) {
                // Fallback: treat as plain text
                const paragraph = $createParagraphNode();
                const text = $createTextNode(doc.content || '');
                paragraph.append(text);
                root.append(paragraph);
                console.log('[Lexical] Content loaded as plain text');
            }
        } else {
            // Empty document
            const paragraph = $createParagraphNode();
            root.append(paragraph);
            console.log('[Lexical] Empty document');
        }
    });

    // Scroll to top
    document.getElementById('lexicalEditor').scrollTop = 0;
}

function closeDocumentEditorLexical() {
    console.log('=== CLOSING DOCUMENT EDITOR ===');

    // Save before closing
    if (currentEditingDocumentId && documentLexicalEditor) {
        console.log('[Close] Saving document before closing...');
        saveDocumentContentSilently();
    } else {
        console.warn('[Close] Cannot save: editor not initialized', {
            hasDocId: !!currentEditingDocumentId,
            hasEditor: !!documentLexicalEditor
        });
    }

    // Hide editor
    const editorElement = document.getElementById('documentEditor');
    if (editorElement) {
        editorElement.style.display = 'none';
        console.log('[Close] Editor hidden');
    }
    currentEditingDocumentId = null;

    // Reload documents list to show updated last modified time
    loadInterviewDocuments();
    console.log('[Close] ✅ Documents list reloaded');
}

function saveDocumentContentSilentlyLexical() {
    console.log('=== SAVING DOCUMENT ===');
    console.log('[Save] Document ID:', currentEditingDocumentId);

    if (!currentEditingDocumentId) {
        console.warn('[Save] No document ID to save');
        return;
    }

    if (!documentLexicalEditor) {
        console.warn('[Save] Lexical editor not initialized, cannot save');
        return;
    }

    try {
        const stored = localStorage.getItem(`interview_documents_${currentPersona}`);
        let documents = stored ? JSON.parse(stored) : [];
        console.log('[Save] Total documents in storage:', documents.length);

        const docIndex = documents.findIndex(d => d.id === currentEditingDocumentId);
        console.log('[Save] Document index:', docIndex);

        if (docIndex === -1) {
            console.warn('[Save] Document not found in localStorage with ID:', currentEditingDocumentId);
            console.log('[Save] Available document IDs:', documents.map(d => d.id));
            return;
        }

        console.log('[Save] Found document to update:', {
            id: documents[docIndex].id,
            name: documents[docIndex].name,
            oldContentLength: documents[docIndex].content ? documents[docIndex].content.length : 0
        });

        // Save Lexical content as JSON
        const editorState = documentLexicalEditor.getEditorState();
        const content = JSON.stringify(editorState.toJSON());
        console.log('[Save] New content length:', content.length);
        console.log('[Save] Content preview:', content.substring(0, 100));

        documents[docIndex].content = content;
        documents[docIndex].lastModified = new Date().toISOString();

        localStorage.setItem(`interview_documents_${currentPersona}`, JSON.stringify(documents));
        console.log('[Save] ✅ Document saved successfully to localStorage');
    } catch (error) {
        console.error('[Save] ❌ Error saving document:', error);
        console.error('[Save] Error stack:', error.stack);
        showToast('Error saving document', 'error');
    }
}
