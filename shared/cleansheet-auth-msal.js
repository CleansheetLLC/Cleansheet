/**
 * Cleansheet Authentication Service (MSAL.js)
 * Uses Microsoft Authentication Library for Microsoft Entra External ID
 * Version: 2.0.0
 *
 * Requires: MSAL.js 2.x (loaded via CDN or npm)
 * CDN: https://cdn.jsdelivr.net/npm/@azure/msal-browser@2.38.0/lib/msal-browser.min.js
 */

class CleansheetAuth {
    constructor(config) {
        this.config = {
            clientId: config.clientId,
            authority: config.authority || `https://login.microsoftonline.com/${config.tenantId}`,
            redirectUri: config.redirectUri || window.location.origin + '/career-canvas.html',
            tokenEndpoint: config.tokenEndpoint || '/api/user/sas-token',
            ...config
        };

        // MSAL configuration
        const msalConfig = {
            auth: {
                clientId: this.config.clientId,
                authority: this.config.authority,
                redirectUri: this.config.redirectUri,
                navigateToLoginRequestUrl: true
            },
            cache: {
                cacheLocation: 'localStorage', // or 'sessionStorage'
                storeAuthStateInCookie: false
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level, message, containsPii) => {
                        if (containsPii) return;
                        switch (level) {
                            case msal.LogLevel.Error:
                                console.error(message);
                                break;
                            case msal.LogLevel.Warning:
                                console.warn(message);
                                break;
                            default:
                                console.log(message);
                        }
                    },
                    logLevel: msal.LogLevel.Warning
                }
            }
        };

        // Initialize MSAL instance
        if (typeof msal === 'undefined') {
            throw new Error('MSAL library not loaded. Include: https://cdn.jsdelivr.net/npm/@azure/msal-browser@2.38.0/lib/msal-browser.min.js');
        }

        this.msalInstance = new msal.PublicClientApplication(msalConfig);

        // Login request configuration
        this.loginRequest = {
            scopes: ['openid', 'profile', 'email', 'offline_access']
        };

        this.user = null;
        this.accessToken = null;
        this.sasToken = null;
        this.sasExpiry = null;
        this.listeners = [];

        // Initialize MSAL
        this.initialize();
    }

    // ========================================
    // Initialization
    // ========================================

    async initialize() {
        try {
            await this.msalInstance.initialize();
            console.log('✓ MSAL initialized');
        } catch (error) {
            console.error('MSAL initialization failed:', error);
        }
    }

    // ========================================
    // Authentication Flow
    // ========================================

    /**
     * Initiate sign-in flow (redirect)
     */
    async signIn() {
        try {
            await this.msalInstance.loginRedirect(this.loginRequest);
        } catch (error) {
            console.error('Sign-in error:', error);
            throw error;
        }
    }

    /**
     * Initiate sign-in with popup (alternative to redirect)
     */
    async signInPopup() {
        try {
            const response = await this.msalInstance.loginPopup(this.loginRequest);
            await this.handleLoginSuccess(response);
            return true;
        } catch (error) {
            console.error('Sign-in popup error:', error);
            return false;
        }
    }

    /**
     * Sign out
     */
    async signOut() {
        // Clear local session
        this.user = null;
        this.accessToken = null;
        this.sasToken = null;
        this.sasExpiry = null;

        // Notify listeners
        this.notifyListeners('signout');

        // Sign out from MSAL
        const logoutRequest = {
            postLogoutRedirectUri: this.config.redirectUri
        };

        try {
            await this.msalInstance.logoutRedirect(logoutRequest);
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    }

    /**
     * Handle redirect callback from Entra ID
     */
    async handleRedirectCallback() {
        try {
            const response = await this.msalInstance.handleRedirectPromise();

            if (response) {
                // User just authenticated
                await this.handleLoginSuccess(response);
                return true;
            }

            // Check if already authenticated
            const accounts = this.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                this.msalInstance.setActiveAccount(accounts[0]);
                await this.loadExistingSession();
                return false; // Not a new login, but authenticated
            }

            return false;

        } catch (error) {
            console.error('Redirect callback error:', error);
            return false;
        }
    }

    /**
     * Handle successful login
     */
    async handleLoginSuccess(response) {
        const account = response.account;

        // Set active account
        this.msalInstance.setActiveAccount(account);

        // Extract user info
        this.user = {
            id: account.homeAccountId,
            email: account.username,
            name: account.name,
            givenName: account.idTokenClaims?.given_name,
            familyName: account.idTokenClaims?.family_name
        };

        this.accessToken = response.accessToken;

        console.log('✓ User authenticated:', this.user.email);

        // Get SAS token
        await this.refreshSasToken();

        // Notify listeners
        this.notifyListeners('signin', this.user);
    }

    /**
     * Load existing session (user already authenticated)
     */
    async loadExistingSession() {
        const account = this.msalInstance.getActiveAccount();

        if (!account) return;

        // Extract user info
        this.user = {
            id: account.homeAccountId,
            email: account.username,
            name: account.name,
            givenName: account.idTokenClaims?.given_name,
            familyName: account.idTokenClaims?.family_name
        };

        console.log('✓ Existing session found:', this.user.email);

        // Get access token silently
        try {
            await this.acquireTokenSilent();
        } catch (error) {
            console.warn('Could not acquire token silently, may need to re-authenticate');
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const account = this.msalInstance.getActiveAccount();
        return !!account;
    }

    /**
     * Get current user
     */
    getUser() {
        if (!this.user) {
            const account = this.msalInstance.getActiveAccount();
            if (account) {
                this.user = {
                    id: account.homeAccountId,
                    email: account.username,
                    name: account.name,
                    givenName: account.idTokenClaims?.given_name,
                    familyName: account.idTokenClaims?.family_name
                };
            }
        }
        return this.user;
    }

    // ========================================
    // Token Management
    // ========================================

    /**
     * Acquire access token silently (refresh if needed)
     */
    async acquireTokenSilent() {
        const account = this.msalInstance.getActiveAccount();

        if (!account) {
            throw new Error('No active account');
        }

        const request = {
            ...this.loginRequest,
            account: account
        };

        try {
            const response = await this.msalInstance.acquireTokenSilent(request);
            this.accessToken = response.accessToken;
            return response.accessToken;
        } catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                // Token expired, need interactive authentication
                console.log('Token expired, initiating interactive login...');
                await this.signIn();
                throw error;
            }
            throw error;
        }
    }

    /**
     * Get access token (refresh if needed)
     */
    async getAccessToken() {
        if (!this.accessToken) {
            await this.acquireTokenSilent();
        }
        return this.accessToken;
    }

    /**
     * Get SAS token (refresh if needed)
     */
    async getSasToken() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        // Check if token needs refresh (within 5 minutes of expiry)
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (!this.sasToken || !this.sasExpiry || now > this.sasExpiry - fiveMinutes) {
            await this.refreshSasToken();
        }

        return this.sasToken;
    }

    /**
     * Refresh SAS token from server
     */
    async refreshSasToken() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            // Get fresh access token
            const accessToken = await this.getAccessToken();

            // Request SAS token from Azure Function
            const response = await fetch(this.config.tokenEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                // Try to get error details from response body
                let errorDetails = `Status: ${response.status}`;
                try {
                    const errorBody = await response.json();
                    errorDetails += ` - ${errorBody.error || errorBody.details || JSON.stringify(errorBody)}`;
                    console.error('SAS token error details:', errorBody);
                } catch (e) {
                    console.error('Could not parse error response');
                }
                throw new Error(`SAS token request failed: ${errorDetails}`);
            }

            const data = await response.json();

            this.sasToken = data.sasToken;
            this.sasExpiry = new Date(data.expiresAt).getTime();

            console.log('✓ SAS token refreshed, expires:', data.expiresAt);

            // Check for migration
            if (data.migrationNeeded) {
                this.notifyListeners('migration_available', data);
            }

            return data;

        } catch (error) {
            console.error('Failed to refresh SAS token:', error);
            throw error;
        }
    }

    // ========================================
    // Event Listeners
    // ========================================

    addEventListener(event, callback) {
        this.listeners.push({ event, callback });
    }

    notifyListeners(event, data) {
        this.listeners
            .filter(l => l.event === event || l.event === '*')
            .forEach(l => {
                try {
                    l.callback(data);
                } catch (error) {
                    console.error('Listener error:', error);
                }
            });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.CleansheetAuth = CleansheetAuth;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CleansheetAuth;
}
