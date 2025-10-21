/**
 * Microsoft Azure AD B2C Authentication Service
 * Handles Microsoft login, token management, and user profile retrieval
 */

class MicrosoftAuthService {
    constructor(config = {}) {
        // Load configuration from config loader if available, otherwise use provided config
        const loadedConfig = window.configLoader ? window.configLoader.getConfig() : {};

        // Merge configurations with priority: provided config > loaded config > defaults
        this.config = {
            clientId: config.clientId || loadedConfig.clientId || '00000000-0000-0000-0000-000000000000',
            authority: config.authority || loadedConfig.authority || 'https://login.microsoftonline.com/common',
            redirectUri: config.redirectUri || loadedConfig.redirectUri || this.getRedirectUri(),
            scopes: config.scopes || loadedConfig.scopes || ['openid', 'profile', 'email'],
            knownAuthorities: config.knownAuthorities || loadedConfig.knownAuthorities || ['login.microsoftonline.com'],
            adminDomain: config.adminDomain || loadedConfig.adminDomain || 'cleansheet.dev',
            isProduction: config.isProduction !== undefined ? config.isProduction : (loadedConfig.isProduction || window.location.hostname === 'pro.cleansheet.dev'),
            postLogoutRedirectUri: config.postLogoutRedirectUri || loadedConfig.postLogoutRedirectUri || this.getLogoutRedirectUri()
        };

        this.msalInstance = null;
        this.currentUser = null;
        this.authCallbacks = new Set();

        this.initializeMSAL();
    }

    /**
     * Get appropriate redirect URI based on environment
     */
    getRedirectUri() {
        const hostname = window.location.hostname;

        if (hostname === 'pro.cleansheet.dev') {
            // Production
            return 'https://pro.cleansheet.dev/professional/callback.html';
        } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Development
            return window.location.origin + '/professional/callback.html';
        } else {
            // Default fallback
            return window.location.origin + '/professional/callback.html';
        }
    }

    /**
     * Get appropriate logout redirect URI based on environment
     */
    getLogoutRedirectUri() {
        const hostname = window.location.hostname;

        if (hostname === 'pro.cleansheet.dev') {
            // Production
            return 'https://pro.cleansheet.dev/professional/login.html';
        } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Development
            return window.location.origin + '/professional/login.html';
        } else {
            // Default fallback
            return window.location.origin + '/professional/login.html';
        }
    }

    /**
     * Initialize MSAL (Microsoft Authentication Library) instance
     */
    async initializeMSAL() {
        try {
            // Check if MSAL is loaded
            if (typeof msal === 'undefined') {
                console.warn('MSAL library not loaded. Loading from CDN...');
                await this.loadMSALLibrary();
            }

            const msalConfig = {
                auth: {
                    clientId: this.config.clientId,
                    authority: this.config.authority,
                    knownAuthorities: this.config.knownAuthorities,
                    redirectUri: this.config.redirectUri
                },
                cache: {
                    cacheLocation: 'localStorage', // or 'sessionStorage'
                    storeAuthStateInCookie: false
                },
                system: {
                    loggerOptions: {
                        loggerCallback: (level, message, containsPii) => {
                            if (!containsPii) {
                                console.log('[MSAL]', message);
                            }
                        }
                    }
                }
            };

            this.msalInstance = new msal.PublicClientApplication(msalConfig);
            await this.msalInstance.initialize();

            // Handle redirect response if returning from Microsoft
            await this.handleRedirectResponse();

            console.log('Microsoft Auth Service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Microsoft Auth:', error);
            throw error;
        }
    }

    /**
     * Load MSAL library from CDN if not already loaded
     */
    loadMSALLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://alcdn.msauth.net/browser/2.38.1/js/msal-browser.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Handle redirect response after Microsoft login
     */
    async handleRedirectResponse() {
        try {
            const response = await this.msalInstance.handleRedirectPromise();

            if (response) {
                this.currentUser = response.account;
                this.notifyAuthCallbacks('login', this.currentUser);
                console.log('Microsoft login successful:', this.currentUser);
                return response;
            }
        } catch (error) {
            console.error('Error handling redirect response:', error);
            this.notifyAuthCallbacks('error', error);
        }
    }

    /**
     * Initiate Microsoft login flow
     */
    async login(userType = 'user') {
        try {
            if (!this.msalInstance) {
                throw new Error('MSAL not initialized');
            }

            const loginRequest = {
                scopes: this.config.scopes,
                prompt: 'select_account'
            };

            // Add user type hint if admin login
            if (userType === 'admin') {
                loginRequest.extraQueryParameters = {
                    domain_hint: 'organizations', // Prefer work/school accounts for admin
                    login_hint: '@' + this.config.adminDomain // Suggest cleansheet.dev domain
                };
            }

            // Use popup for better UX, fallback to redirect
            try {
                const response = await this.msalInstance.loginPopup(loginRequest);
                this.currentUser = response.account;
                this.notifyAuthCallbacks('login', this.currentUser);
                return response;
            } catch (popupError) {
                console.warn('Popup login failed, trying redirect:', popupError);
                await this.msalInstance.loginRedirect(loginRequest);
            }

        } catch (error) {
            console.error('Microsoft login failed:', error);
            this.notifyAuthCallbacks('error', error);
            throw error;
        }
    }

    /**
     * Logout current user
     */
    async logout() {
        try {
            if (!this.msalInstance || !this.currentUser) {
                console.warn('No user to logout');
                return;
            }

            const logoutRequest = {
                account: this.currentUser,
                postLogoutRedirectUri: this.config.postLogoutRedirectUri
            };

            this.currentUser = null;
            this.notifyAuthCallbacks('logout', null);

            await this.msalInstance.logoutPopup(logoutRequest);
        } catch (error) {
            console.error('Logout failed:', error);
            // Clear local state even if logout fails
            this.currentUser = null;
            this.notifyAuthCallbacks('logout', null);
        }
    }

    /**
     * Get current user information
     */
    getCurrentUser() {
        if (!this.currentUser) {
            // Check if user is already logged in
            const accounts = this.msalInstance?.getAllAccounts() || [];
            if (accounts.length > 0) {
                this.currentUser = accounts[0];
            }
        }
        return this.currentUser;
    }

    /**
     * Check if user is currently authenticated
     */
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    /**
     * Get access token for API calls
     */
    async getAccessToken(scopes = this.config.scopes) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('User not authenticated');
            }

            const tokenRequest = {
                scopes: scopes,
                account: this.currentUser
            };

            try {
                // Try to get token silently first
                const response = await this.msalInstance.acquireTokenSilent(tokenRequest);
                return response.accessToken;
            } catch (silentError) {
                // If silent fails, use popup
                const response = await this.msalInstance.acquireTokenPopup(tokenRequest);
                return response.accessToken;
            }
        } catch (error) {
            console.error('Failed to get access token:', error);
            throw error;
        }
    }

    /**
     * Get user profile information
     */
    getUserProfile() {
        const user = this.getCurrentUser();
        if (!user) return null;

        return {
            id: user.localAccountId || user.homeAccountId,
            name: user.name || `${user.idTokenClaims?.given_name || ''} ${user.idTokenClaims?.family_name || ''}`.trim(),
            email: user.username || user.idTokenClaims?.email,
            givenName: user.idTokenClaims?.given_name,
            familyName: user.idTokenClaims?.family_name,
            tenantId: user.tenantId,
            isAdmin: this.checkAdminRole(user),
            avatar: this.generateAvatarUrl(user.name || user.username)
        };
    }

    /**
     * Check if user has admin role
     * Admins must have @cleansheet.dev email addresses
     */
    checkAdminRole(user) {
        const email = user.username || user.idTokenClaims?.email || '';

        // Strict domain checking for cleansheet.dev admins only
        if (!email || !email.includes('@')) {
            return false;
        }

        // Only cleansheet.dev domain users can be admins
        const isCleansheetDomain = email.endsWith('@' + this.config.adminDomain);

        // Additional validation: check if it's an organizational account for security
        const isOrganizationalAccount = user.idTokenClaims?.tid && user.idTokenClaims.tid !== '9188040d-6c67-4c5b-b112-36a304b66dad'; // Not consumer tenant

        console.log('Admin role check:', {
            email,
            domain: this.config.adminDomain,
            isCleansheetDomain,
            isOrganizationalAccount,
            tenantId: user.idTokenClaims?.tid
        });

        return isCleansheetDomain && isOrganizationalAccount;
    }

    /**
     * Generate avatar URL based on user name
     */
    generateAvatarUrl(name) {
        if (!name) return null;

        const initials = name.split(' ')
            .map(n => n.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();

        return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0066CC&color=fff&size=128`;
    }

    /**
     * Register callback for authentication events
     */
    onAuthStateChange(callback) {
        this.authCallbacks.add(callback);

        // Immediately call with current state
        const user = this.getCurrentUser();
        if (user) {
            callback('login', user);
        }

        // Return unsubscribe function
        return () => {
            this.authCallbacks.delete(callback);
        };
    }

    /**
     * Notify all registered callbacks
     */
    notifyAuthCallbacks(event, data) {
        this.authCallbacks.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Auth callback error:', error);
            }
        });
    }

    /**
     * Configure Azure AD B2C settings (for admin use)
     */
    updateConfiguration(newConfig) {
        this.config = { ...this.config, ...newConfig };

        // Reinitialize MSAL with new config
        this.initializeMSAL();
    }

    /**
     * Get current configuration (for admin interface)
     */
    getConfiguration() {
        return { ...this.config };
    }
}

// Export for use in other modules
window.MicrosoftAuthService = MicrosoftAuthService;