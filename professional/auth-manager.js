/**
 * Authentication State Manager
 * Manages authentication state across all professional platform pages
 */

class AuthManager {
    constructor() {
        this.authService = null;
        this.currentUser = null;
        this.stateChangeCallbacks = new Set();
        this.initialized = false;

        this.initialize();
    }

    /**
     * Initialize the authentication manager
     */
    async initialize() {
        try {
            // Initialize Microsoft Auth Service with configuration loaded from config-loader.js
            this.authService = new MicrosoftAuthService();

            // Listen for authentication state changes
            this.authService.onAuthStateChange((event, user) => {
                this.handleAuthStateChange(event, user);
            });

            // Check current authentication state
            this.currentUser = this.authService.getCurrentUser();

            this.initialized = true;
            console.log('AuthManager initialized successfully');

            // Notify callbacks that we're ready
            this.notifyStateChange('initialized', this.currentUser);

        } catch (error) {
            console.error('Failed to initialize AuthManager:', error);
            this.notifyStateChange('error', error);
        }
    }

    /**
     * Handle authentication state changes from the auth service
     */
    handleAuthStateChange(event, user) {
        if (event === 'login') {
            this.currentUser = user;
            this.notifyStateChange('login', this.getUserProfile());
        } else if (event === 'logout') {
            this.currentUser = null;
            this.notifyStateChange('logout', null);
        } else if (event === 'error') {
            this.notifyStateChange('error', user);
        }
    }

    /**
     * Check if user is currently authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Get current user profile
     */
    getUserProfile() {
        return this.authService ? this.authService.getUserProfile() : null;
    }

    /**
     * Check if current user has admin privileges
     */
    isAdmin() {
        const profile = this.getUserProfile();
        return profile ? profile.isAdmin : false;
    }

    /**
     * Initiate login flow
     */
    async login(userType = 'user') {
        if (!this.authService) {
            throw new Error('Authentication service not initialized');
        }

        return await this.authService.login(userType);
    }

    /**
     * Logout current user
     */
    async logout() {
        if (!this.authService) {
            console.warn('Authentication service not initialized');
            return;
        }

        return await this.authService.logout();
    }

    /**
     * Get access token for API calls
     */
    async getAccessToken(scopes) {
        if (!this.authService) {
            throw new Error('Authentication service not initialized');
        }

        return await this.authService.getAccessToken(scopes);
    }

    /**
     * Protect a page - redirect to login if not authenticated
     */
    requireAuth(adminOnly = false) {
        if (!this.isAuthenticated()) {
            // Store current page for redirect after login
            sessionStorage.setItem('authRedirectUrl', window.location.href);
            window.location.href = 'login.html';
            return false;
        }

        if (adminOnly && !this.isAdmin()) {
            this.showAccessDenied();
            return false;
        }

        return true;
    }

    /**
     * Show access denied message
     */
    showAccessDenied() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: var(--font-family-body, 'Arial', sans-serif);
        `;

        message.innerHTML = `
            <div style="
                background: white;
                color: #333;
                padding: 40px;
                border-radius: 12px;
                text-align: center;
                max-width: 400px;
                margin: 20px;
            ">
                <h2 style="margin-bottom: 16px; color: #dc2626;">Access Denied</h2>
                <p style="margin-bottom: 24px; line-height: 1.5;">
                    You don't have permission to access this page. Administrator privileges are required.
                </p>
                <button onclick="window.location.href='professional.html'" style="
                    padding: 12px 24px;
                    background: #0066CC;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-right: 12px;
                ">Go to Dashboard</button>
                <button onclick="authManager.logout()" style="
                    padding: 12px 24px;
                    background: #6b7280;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">Logout</button>
            </div>
        `;

        document.body.appendChild(message);
    }

    /**
     * Register callback for authentication state changes
     */
    onStateChange(callback) {
        this.stateChangeCallbacks.add(callback);

        // Immediately call with current state if initialized
        if (this.initialized) {
            callback('initialized', this.getUserProfile());
        }

        // Return unsubscribe function
        return () => {
            this.stateChangeCallbacks.delete(callback);
        };
    }

    /**
     * Notify all registered callbacks
     */
    notifyStateChange(event, data) {
        this.stateChangeCallbacks.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Auth state callback error:', error);
            }
        });
    }

    /**
     * Create user avatar element
     */
    createUserAvatar(user = null) {
        const profile = user || this.getUserProfile();
        if (!profile) return null;

        const avatar = document.createElement('div');
        avatar.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--color-highlight, #11304f);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: var(--font-family-ui, 'Arial', sans-serif);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        `;

        const initials = profile.name ?
            profile.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase() :
            '?';

        avatar.textContent = initials;
        avatar.title = `${profile.name} (${profile.email})`;

        return avatar;
    }

    /**
     * Create user menu dropdown
     */
    createUserMenu() {
        const profile = this.getUserProfile();
        if (!profile) return null;

        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid var(--color-neutral-border, #e5e5e7);
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            padding: 8px 0;
            min-width: 200px;
            z-index: 1000;
            font-family: var(--font-family-body, 'Arial', sans-serif);
            font-size: 14px;
        `;

        menu.innerHTML = `
            <div style="padding: 12px 16px; border-bottom: 1px solid var(--color-neutral-border, #e5e5e7);">
                <div style="font-weight: 600; color: var(--color-dark, #1a1a1a);">${profile.name}</div>
                <div style="color: var(--color-neutral-text-light, #666); font-size: 12px;">${profile.email}</div>
            </div>
            <button onclick="window.location.href='professional.html'" style="
                display: block;
                width: 100%;
                padding: 8px 16px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                font-family: inherit;
                font-size: inherit;
            ">Dashboard</button>
            ${profile.isAdmin ? `
                <button onclick="window.location.href='admin.html'" style="
                    display: block;
                    width: 100%;
                    padding: 8px 16px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: inherit;
                ">Admin Panel</button>
            ` : ''}
            <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--color-neutral-border, #e5e5e7);">
            <button onclick="authManager.logout()" style="
                display: block;
                width: 100%;
                padding: 8px 16px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                font-family: inherit;
                font-size: inherit;
                color: #dc2626;
            ">Sign Out</button>
        `;

        return menu;
    }

    /**
     * Handle redirect after login
     */
    handlePostLoginRedirect() {
        const redirectUrl = sessionStorage.getItem('authRedirectUrl');
        if (redirectUrl) {
            sessionStorage.removeItem('authRedirectUrl');
            window.location.href = redirectUrl;
        }
    }

    /**
     * Get configuration for admin interface
     */
    getAuthConfig() {
        return this.authService ? this.authService.getConfiguration() : null;
    }

    /**
     * Update configuration (admin only)
     */
    updateAuthConfig(newConfig) {
        if (!this.isAdmin()) {
            throw new Error('Admin privileges required');
        }

        if (this.authService) {
            this.authService.updateConfiguration(newConfig);
        }
    }
}

// Create global instance
window.authManager = new AuthManager();

// Export for module use
window.AuthManager = AuthManager;