/**
 * Cleansheet Core Utilities
 * Shared constants, utilities, and helper functions
 * Version: 1.0.0
 */

const CleansheetCore = {
    // Design System Constants
    colors: {
        primaryBlue: '#0066CC',
        accentBlue: '#004C99',
        dark: '#1a1a1a',
        neutralText: '#333333',
        neutralTextLight: '#666666',
        neutralTextMuted: '#999999',
        neutralBackground: '#f5f5f7',
        neutralBackgroundSecondary: '#f8f8f8',
        neutralBorder: '#e5e5e7',
        white: '#ffffff',
        headerTitle: '#e0e0e0'
    },

    fonts: {
        ui: "'Questrial', sans-serif",
        body: "'Barlow', sans-serif"
    },

    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1440
    },

    // Content metadata
    expertiseLevels: ['Neophyte', 'Novice', 'Operator', 'Expert', 'Academic'],

    careerPaths: [
        'Citizen Developer',
        'Cloud Computing',
        'Project Management',
        'Cloud Operations',
        'Network Operations',
        'Security Operations',
        'Full Stack Developer',
        'AI/ML',
        'Analytics'
    ],

    tags: [
        'Project Management',
        'Security',
        'Cloud',
        'DevOps',
        'Career Development',
        'Technical Skills',
        'Professional Skills',
        'Data Analysis',
        'Networking',
        'Development',
        'Testing',
        'Automation',
        'System Design',
        'Architecture'
    ],

    // Application status values
    applicationStatuses: [
        'Saved',
        'Applied',
        'Phone Screen',
        'Interview',
        'Offer',
        'Rejected',
        'Accepted',
        'Declined'
    ],

    // Utility Functions
    utils: {
        /**
         * Format date to readable string
         */
        formatDate(date) {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        /**
         * Format date to relative time (e.g., "2 days ago")
         */
        formatRelativeDate(date) {
            const d = new Date(date);
            const now = new Date();
            const diff = now - d;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 30) {
                return this.formatDate(date);
            } else if (days > 0) {
                return `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else if (minutes > 0) {
                return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else {
                return 'Just now';
            }
        },

        /**
         * Debounce function calls
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Sanitize HTML to prevent XSS
         */
        sanitizeHTML(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        },

        /**
         * Truncate text with ellipsis
         */
        truncate(str, maxLength) {
            if (str.length <= maxLength) return str;
            return str.substring(0, maxLength - 3) + '...';
        },

        /**
         * Generate unique ID
         */
        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        /**
         * Deep clone object
         */
        deepClone(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        /**
         * Check if value is empty (null, undefined, empty string, empty array)
         */
        isEmpty(value) {
            if (value === null || value === undefined) return true;
            if (typeof value === 'string') return value.trim() === '';
            if (Array.isArray(value)) return value.length === 0;
            if (typeof value === 'object') return Object.keys(value).length === 0;
            return false;
        },

        /**
         * Format file size
         */
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        },

        /**
         * Validate email format
         */
        isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        /**
         * Get initials from name
         */
        getInitials(name) {
            return name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
        },

        /**
         * Calculate reading time (words per minute)
         */
        calculateReadingTime(text, wpm = 200) {
            const words = text.trim().split(/\s+/).length;
            const minutes = Math.ceil(words / wpm);
            return minutes;
        },

        /**
         * Copy text to clipboard
         */
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            }
        },

        /**
         * Download data as JSON file
         */
        downloadJSON(data, filename) {
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        /**
         * Show toast notification
         */
        showToast(message, type = 'info', duration = 3000) {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: ${CleansheetCore.fonts.body};
                font-size: 14px;
                z-index: 10000;
                animation: slideInUp 0.3s ease;
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideOutDown 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, duration);
        },

        /**
         * Show loading indicator
         */
        showLoading(target = document.body) {
            const loader = document.createElement('div');
            loader.className = 'cleansheet-loader';
            loader.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%;">
                    <div style="border: 3px solid #f3f3f3; border-top: 3px solid ${CleansheetCore.colors.primaryBlue}; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
                </div>
            `;
            loader.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                z-index: 9999;
            `;

            if (target === document.body) {
                loader.style.position = 'fixed';
            }

            target.appendChild(loader);
            return loader;
        },

        /**
         * Hide loading indicator
         */
        hideLoading(loader) {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }
    },

    // Monaco Editor theme management
    monaco: {
        currentTheme: 'vs', // Default light theme
        editors: [], // Track all editor instances

        /**
         * Initialize Monaco theme from localStorage
         */
        init() {
            const saved = localStorage.getItem('monaco_theme');
            this.currentTheme = saved || 'vs';
            // Apply initial theme to preview if it exists
            this.applyTheme();
        },

        /**
         * Register an editor instance
         * @param {monaco.editor.IStandaloneCodeEditor} editor - Monaco editor instance
         */
        register(editor) {
            if (editor && !this.editors.includes(editor)) {
                this.editors.push(editor);
                // Apply current theme to newly registered editor
                if (typeof monaco !== 'undefined') {
                    monaco.editor.setTheme(this.currentTheme);
                }
            }
        },

        /**
         * Toggle between light and dark themes
         */
        toggleTheme() {
            this.currentTheme = this.currentTheme === 'vs' ? 'vs-dark' : 'vs';
            this.applyTheme();
        },

        /**
         * Set specific theme
         * @param {string} themeName - 'vs', 'vs-dark', or 'hc-black'
         */
        setTheme(themeName) {
            if (['vs', 'vs-dark', 'hc-black'].includes(themeName)) {
                this.currentTheme = themeName;
                this.applyTheme();
            }
        },

        /**
         * Apply current theme to all Monaco editors and markdown preview
         */
        applyTheme() {
            if (typeof monaco !== 'undefined') {
                monaco.editor.setTheme(this.currentTheme);
            }

            // Apply theme to markdown preview pane
            const markdownPreview = document.getElementById('markdownPreview');
            if (markdownPreview) {
                const isDark = this.currentTheme === 'vs-dark' || this.currentTheme === 'hc-black';

                if (isDark) {
                    markdownPreview.classList.add('theme-dark');
                    // Set inline styles for dark theme
                    markdownPreview.style.background = '#1e1e1e';
                } else {
                    markdownPreview.classList.remove('theme-dark');
                    // Set inline styles for light theme
                    markdownPreview.style.background = '#ffffff';
                }
            }

            localStorage.setItem('monaco_theme', this.currentTheme);
            this.updateToggleButtons();
        },

        /**
         * Update all theme toggle button states
         */
        updateToggleButtons() {
            document.querySelectorAll('.monaco-theme-toggle').forEach(btn => {
                const icon = btn.querySelector('i');
                if (icon) {
                    if (this.currentTheme === 'vs-dark' || this.currentTheme === 'hc-black') {
                        icon.className = 'ph ph-sun';
                        btn.setAttribute('aria-label', 'Switch to light mode');
                        btn.setAttribute('data-theme', 'dark');
                    } else {
                        icon.className = 'ph ph-moon';
                        btn.setAttribute('aria-label', 'Switch to dark mode');
                        btn.setAttribute('data-theme', 'light');
                    }
                }
            });
        }
    },

    // Export functionality for markdown content
    // Note: html2pdf.js must be loaded before using PDF export
    // CDN: https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
    export: {
        /**
         * Check if html2pdf library is loaded
         */
        _checkHtml2PdfLoaded() {
            if (typeof html2pdf === 'undefined') {
                console.error('html2pdf.js is not loaded. Add to page: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>');
                return false;
            }
            return true;
        },

        /**
         * Export element to PDF
         * @param {HTMLElement|string} element - Element or selector to export
         * @param {string} filename - Output filename (without .pdf extension)
         * @param {object} options - Export options
         * @returns {Promise<void>}
         */
        async toPDF(element, filename = 'document', options = {}) {
            if (!this._checkHtml2PdfLoaded()) {
                CleansheetCore.utils.showToast('PDF export library not loaded', 'error');
                return;
            }

            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) {
                CleansheetCore.utils.showToast('Element not found for export', 'error');
                return;
            }

            // Show loading indicator
            CleansheetCore.utils.showToast('Generating PDF...', 'info', 5000);

            // Default PDF options
            const pdfOptions = {
                margin: options.margin || [15, 15, 15, 15], // top, right, bottom, left in mm
                filename: `${filename}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    ...options.html2canvas
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    ...options.jsPDF
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            try {
                // Clone element to avoid modifying original
                const clone = el.cloneNode(true);

                // Add print-friendly styles
                clone.style.background = 'white';
                clone.style.color = '#333';
                clone.style.padding = '20px';
                clone.style.maxWidth = '100%';

                // Create temporary container
                const tempDiv = document.createElement('div');
                tempDiv.style.cssText = 'position: absolute; left: -9999px; top: 0;';
                tempDiv.appendChild(clone);
                document.body.appendChild(tempDiv);

                // Generate PDF
                await html2pdf().set(pdfOptions).from(clone).save();

                // Cleanup
                document.body.removeChild(tempDiv);

                CleansheetCore.utils.showToast('PDF exported successfully!', 'success');
            } catch (error) {
                console.error('PDF export error:', error);
                CleansheetCore.utils.showToast('Failed to export PDF', 'error');
            }
        },

        /**
         * Export element to standalone HTML file
         * @param {HTMLElement|string} element - Element or selector to export
         * @param {string} filename - Output filename (without .html extension)
         * @param {object} options - Export options
         */
        toHTML(element, filename = 'document', options = {}) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) {
                CleansheetCore.utils.showToast('Element not found for export', 'error');
                return;
            }

            try {
                // Get content
                const content = el.innerHTML;

                // Get inline styles or computed styles
                const styles = options.includeStyles !== false ? this._extractStyles(el) : '';

                // Build HTML document
                const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.title || filename}</title>
    <style>
        /* Cleansheet Corporate Professional Design System */
        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-weight: 300;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 20px;
            background: #ffffff;
            max-width: 900px;
            margin: 0 auto;
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: 'Questrial', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #1a1a1a;
            line-height: 1.3;
        }

        h1 { font-size: 32px; color: #0066CC; }
        h2 { font-size: 28px; color: #0066CC; }
        h3 { font-size: 24px; color: #004C99; }
        h4 { font-size: 20px; }

        p { margin: 16px 0; }

        code {
            background: #f5f5f7;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }

        pre {
            background: #1a1a1a;
            color: #e0e0e0;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
        }

        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }

        th, td {
            border: 1px solid #e5e5e7;
            padding: 12px;
            text-align: left;
        }

        th {
            background: #f5f5f7;
            font-weight: 600;
        }

        a {
            color: #0066CC;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        blockquote {
            border-left: 4px solid #0066CC;
            padding-left: 16px;
            margin: 16px 0;
            color: #666666;
            font-style: italic;
        }

        ${styles}
    </style>
    ${options.includeGoogleFonts !== false ? `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Questrial&display=swap" rel="stylesheet">
    ` : ''}
</head>
<body>
    ${options.includeMetadata !== false && options.metadata ? `
    <div style="border-bottom: 2px solid #e5e5e7; padding-bottom: 16px; margin-bottom: 24px;">
        ${options.metadata.title ? `<h1>${options.metadata.title}</h1>` : ''}
        ${options.metadata.date ? `<p style="color: #666; font-size: 14px;">Exported: ${options.metadata.date}</p>` : ''}
        ${options.metadata.source ? `<p style="color: #666; font-size: 14px;">Source: ${options.metadata.source}</p>` : ''}
    </div>
    ` : ''}

    <div class="content">
        ${content}
    </div>

    ${options.includeFooter !== false ? `
    <footer style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #e5e5e7; text-align: center; color: #999999; font-size: 12px;">
        <p>Exported from Cleansheet Platform | cleansheet.info</p>
    </footer>
    ` : ''}
</body>
</html>`;

                // Create blob and download
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                CleansheetCore.utils.showToast('HTML exported successfully!', 'success');
            } catch (error) {
                console.error('HTML export error:', error);
                CleansheetCore.utils.showToast('Failed to export HTML', 'error');
            }
        },

        /**
         * Open browser print dialog
         * @param {HTMLElement|string} element - Element or selector to print
         * @param {object} options - Print options
         */
        print(element, options = {}) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) {
                CleansheetCore.utils.showToast('Element not found for print', 'error');
                return;
            }

            try {
                // Create print window
                const printWindow = window.open('', '_blank');
                if (!printWindow) {
                    CleansheetCore.utils.showToast('Pop-up blocked. Please allow pop-ups to print.', 'error');
                    return;
                }

                // Get content
                const content = el.innerHTML;
                const styles = this._extractStyles(el);

                // Build print document
                printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${options.title || 'Print'}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Questrial&display=swap" rel="stylesheet">
    <style>
        @media print {
            @page {
                margin: 2cm;
                size: A4;
            }

            body {
                margin: 0;
                padding: 0;
            }

            /* Avoid page breaks inside elements */
            h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
            }

            img, table, figure {
                page-break-inside: avoid;
            }

            /* Show link URLs */
            a[href]:after {
                content: " (" attr(href) ")";
                font-size: 0.8em;
                color: #666;
            }
        }

        body {
            font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-weight: 300;
            line-height: 1.6;
            color: #333333;
            font-size: 11pt;
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: 'Questrial', sans-serif;
            color: #1a1a1a;
        }

        h1 { font-size: 24pt; }
        h2 { font-size: 20pt; }
        h3 { font-size: 16pt; }
        h4 { font-size: 14pt; }

        code {
            background: #f5f5f7;
            padding: 2px 4px;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
        }

        pre {
            background: #f5f5f7;
            border: 1px solid #e5e5e7;
            padding: 12px;
            overflow-x: auto;
        }

        ${styles}
    </style>
</head>
<body>
    ${content}
</body>
</html>`);

                printWindow.document.close();

                // Wait for content to load, then print
                printWindow.onload = function() {
                    setTimeout(() => {
                        printWindow.print();
                        // Don't close automatically - let user close
                        // printWindow.close();
                    }, 250);
                };
            } catch (error) {
                console.error('Print error:', error);
                CleansheetCore.utils.showToast('Failed to open print dialog', 'error');
            }
        },

        /**
         * Extract and consolidate CSS styles from element
         * @param {HTMLElement} element - Element to extract styles from
         * @returns {string} Consolidated CSS
         * @private
         */
        _extractStyles(element) {
            // For now, return empty string
            // In a full implementation, you would extract computed styles
            // or include stylesheets linked in the page
            return '';
        }
    }
};

// Add CSS animations and Monaco theme toggle styles (wrapped to avoid scope conflicts)
(function() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes slideOutDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Monaco Theme Toggle Button */
        .monaco-theme-toggle {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            color: white;
            padding: 8px 12px;
            font-family: var(--font-family-ui, 'Questrial', sans-serif);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }

        .monaco-theme-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .monaco-theme-toggle i {
            font-size: 16px;
        }

        /* Markdown Preview Theme - Light (Default) */
        #markdownPreview {
            background: #ffffff !important;
            color: #333333 !important;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Light theme explicit styles */
        #markdownPreview h1,
        #markdownPreview h2,
        #markdownPreview h3,
        #markdownPreview h4,
        #markdownPreview h5,
        #markdownPreview h6 {
            color: #1a1a1a !important;
        }

        #markdownPreview p,
        #markdownPreview li,
        #markdownPreview span {
            color: #333333 !important;
        }

        #markdownPreview a {
            color: #0066CC !important;
        }

        #markdownPreview code {
            background: #f8f8f8 !important;
            color: #e83e8c !important;
        }

        #markdownPreview pre {
            background: #1e1e1e !important;
            border: 1px solid #e5e5e7 !important;
        }

        #markdownPreview pre code {
            background: none !important;
            color: #d4d4d4 !important;
        }

        #markdownPreview blockquote {
            background: #f0f7ff !important;
            border-left-color: #0066CC !important;
            color: #666666 !important;
        }

        #markdownPreview table {
            border-color: #e5e5e7 !important;
        }

        #markdownPreview th,
        #markdownPreview td {
            border-color: #e5e5e7 !important;
            color: #333333 !important;
        }

        #markdownPreview th {
            background: #f5f5f7 !important;
        }

        #markdownPreview tr:nth-child(even) {
            background: #fafafa !important;
        }

        /* Dark theme overrides */
        #markdownPreview.theme-dark {
            background: #1e1e1e !important;
            color: #d4d4d4 !important;
        }

        #markdownPreview.theme-dark h1,
        #markdownPreview.theme-dark h2,
        #markdownPreview.theme-dark h3,
        #markdownPreview.theme-dark h4,
        #markdownPreview.theme-dark h5,
        #markdownPreview.theme-dark h6 {
            color: #ffffff !important;
        }

        #markdownPreview.theme-dark p,
        #markdownPreview.theme-dark li,
        #markdownPreview.theme-dark span {
            color: #d4d4d4 !important;
        }

        #markdownPreview.theme-dark a {
            color: #4da6ff !important;
        }

        #markdownPreview.theme-dark code {
            background: #2d2d2d !important;
            color: #ff6b9d !important;
        }

        #markdownPreview.theme-dark pre {
            background: #252525 !important;
            border-color: #404040 !important;
        }

        #markdownPreview.theme-dark blockquote {
            background: #1e2a3a !important;
            border-left-color: #4da6ff !important;
        }

        #markdownPreview.theme-dark table {
            border-color: #404040 !important;
        }

        #markdownPreview.theme-dark th,
        #markdownPreview.theme-dark td {
            border-color: #404040 !important;
        }

        #markdownPreview.theme-dark th {
            background: #252525 !important;
        }

        #markdownPreview.theme-dark tr:nth-child(even) {
            background: #2a2a2a !important;
        }
    `;
    document.head.appendChild(styleElement);

    // Auto-initialize Monaco theme on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CleansheetCore.monaco.init();
        });
    } else {
        CleansheetCore.monaco.init();
    }
})();

// Export for use in HTML pages
if (typeof window !== 'undefined') {
    window.CleansheetCore = CleansheetCore;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CleansheetCore;
}
