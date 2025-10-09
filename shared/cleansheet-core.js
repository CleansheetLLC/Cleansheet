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
                font-family: ${this.fonts.body};
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
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);

// Export for use in HTML pages
if (typeof window !== 'undefined') {
    window.CleansheetCore = CleansheetCore;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CleansheetCore;
}
