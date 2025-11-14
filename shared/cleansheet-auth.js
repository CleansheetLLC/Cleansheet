/**
 * Cleansheet Authentication Service
 * Handles Azure AD B2C authentication and SAS token management
 * Version: 1.0.0
 */

class CleansheetAuth {
    constructor(config) {
        this.config = {
            tenantName: config.tenantName || 'cleansheet',
            clientId: config.clientId,
            redirectUri: config.redirectUri || window.location.origin + '/career-canvas.html',
            signUpSignInPolicy: config.signUpSignInPolicy || 'B2C_1_signupsignin',
            passwordResetPolicy: config.passwordResetPolicy || 'B2C_1_passwordreset',
            tokenEndpoint: config.tokenEndpoint || '/api/user/sas-token',
            ...config
        };

        this.user = null;
        this.accessToken = null;
        this.sasToken = null;
        this.sasExpiry = null;
        this.listeners = [];

        // Load stored session
        this.loadSession();
    }

    // ========================================
    // Authentication Flow
    // ========================================

    /**
     * Get B2C authority URL
     */
    getAuthority(policy) {
        const policyName = policy || this.config.signUpSignInPolicy;
        return `https://${this.config.tenantName}.b2clogin.com/${this.config.tenantName}.onmicrosoft.com/${policyName}`;
    }

    /**
     * Initiate sign-in flow (redirect to Azure AD B2C)
     */
    signIn() {
        const authority = this.getAuthority();
        const nonce = this.generateNonce();
        const state = this.generateState();

        // Store state and nonce for validation
        sessionStorage.setItem('b2c_nonce', nonce);
        sessionStorage.setItem('b2c_state', state);

        const params = new URLSearchParams({
            client_id: this.config.clientId,
            response_type: 'id_token token',
            redirect_uri: this.config.redirectUri,
            response_mode: 'fragment',
            scope: 'openid profile email offline_access',
            state: state,
            nonce: nonce
        });

        window.location.href = `${authority}/oauth2/v2.0/authorize?${params.toString()}`;
    }

    /**
     * Sign out (clear session)
     */
    signOut() {
        // Clear local session
        this.user = null;
        this.accessToken = null;
        this.sasToken = null;
        this.sasExpiry = null;
        localStorage.removeItem('cleansheet_auth_session');

        // Notify listeners
        this.notifyListeners('signout');

        // Redirect to B2C logout
        const authority = this.getAuthority();
        window.location.href = `${authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(this.config.redirectUri)}`;
    }

    /**
     * Handle redirect callback from B2C
     */
    async handleRedirectCallback() {
        const hash = window.location.hash.substring(1);
        if (!hash) return false;

        const params = new URLSearchParams(hash);
        const idToken = params.get('id_token');
        const accessToken = params.get('access_token');
        const state = params.get('state');
        const error = params.get('error');

        if (error) {
            console.error('B2C authentication error:', error, params.get('error_description'));
            return false;
        }

        if (!idToken || !accessToken) {
            return false;
        }

        // Validate state
        const storedState = sessionStorage.getItem('b2c_state');
        if (state !== storedState) {
            console.error('State mismatch - possible CSRF attack');
            return false;
        }

        // Decode and validate ID token
        const decoded = this.decodeJWT(idToken);
        const storedNonce = sessionStorage.getItem('b2c_nonce');

        if (decoded.nonce !== storedNonce) {
            console.error('Nonce mismatch - possible replay attack');
            return false;
        }

        // Store user info and tokens
        this.user = {
            id: decoded.oid || decoded.sub,
            email: decoded.emails?.[0] || decoded.email,
            name: decoded.name,
            givenName: decoded.given_name,
            familyName: decoded.family_name
        };
        this.accessToken = accessToken;

        // Save session
        this.saveSession();

        // Clear hash from URL
        history.replaceState(null, '', window.location.pathname + window.location.search);

        // Clean up session storage
        sessionStorage.removeItem('b2c_nonce');
        sessionStorage.removeItem('b2c_state');

        // Get SAS token
        await this.refreshSasToken();

        // Notify listeners
        this.notifyListeners('signin', this.user);

        return true;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.user && !!this.accessToken;
    }

    /**
     * Get current user
     */
    getUser() {
        return this.user;
    }

    // ========================================
    // SAS Token Management
    // ========================================

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
            const response = await fetch(this.config.tokenEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`SAS token request failed: ${response.status}`);
            }

            const data = await response.json();

            this.sasToken = data.sasToken;
            this.sasExpiry = new Date(data.expiresAt).getTime();

            // Save to session
            this.saveSession();

            // Check for migration
            if (data.migrationNeeded) {
                this.notifyListeners('migration_available', data);
            }

            console.log('✓ SAS token refreshed, expires:', data.expiresAt);

            return data;

        } catch (error) {
            console.error('Failed to refresh SAS token:', error);
            throw error;
        }
    }

    // ========================================
    // Session Management
    // ========================================

    saveSession() {
        const session = {
            user: this.user,
            accessToken: this.accessToken,
            sasToken: this.sasToken,
            sasExpiry: this.sasExpiry
        };
        localStorage.setItem('cleansheet_auth_session', JSON.stringify(session));
    }

    loadSession() {
        const stored = localStorage.getItem('cleansheet_auth_session');
        if (!stored) return;

        try {
            const session = JSON.parse(stored);
            this.user = session.user;
            this.accessToken = session.accessToken;
            this.sasToken = session.sasToken;
            this.sasExpiry = session.sasExpiry;

            // Check if token is expired
            if (this.sasExpiry && Date.now() > this.sasExpiry) {
                console.log('Session expired, clearing...');
                this.clearSession();
            }
        } catch (error) {
            console.error('Failed to load session:', error);
            this.clearSession();
        }
    }

    clearSession() {
        this.user = null;
        this.accessToken = null;
        this.sasToken = null;
        this.sasExpiry = null;
        localStorage.removeItem('cleansheet_auth_session');
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
            .forEach(l => l.callback(data));
    }

    // ========================================
    // Utility Functions
    // ========================================

    generateNonce() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    generateState() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    decodeJWT(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT token');
        }
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.CleansheetAuth = CleansheetAuth;
}
