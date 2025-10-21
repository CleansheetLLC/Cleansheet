# Professional Multi-User Platform Implementation Plan

## Executive Summary

This plan integrates the RBAC permission system with Azure Blob backend architecture to transform professional.html into a production-ready multi-user collaborative platform. The approach prioritizes incremental value delivery, ensuring each phase provides testable functionality while building toward the complete vision.

## Integration Analysis

### Document Relationship Assessment
- **RBAC Plan**: Focuses on permissions, sharing UI, and access control
- **Multi-User Plan**: Focuses on Azure backend, sync architecture, and offline capabilities
- **Integration Points**: User management, data persistence, sharing workflows, conflict resolution

### Strategic Sequencing Rationale
1. **Backend Foundation First**: Azure integration provides scalable data persistence
2. **User Management Layer**: Authentication and basic user profiles
3. **RBAC Integration**: Layer permissions on top of stable backend
4. **Advanced Features**: Real-time sync, conflict resolution, advanced sharing

---

# 🚀 Phased Implementation Strategy

## Phase 1: Backend Foundation (Weeks 1-3)
*Foundation for all future features - must be rock solid*

### Week 1: Azure Blob Storage Setup
**Goal**: Replace localStorage with Azure Blob backend

#### 1.1 Azure Infrastructure
```javascript
// Azure Blob Service Implementation
class AzureBlobService {
    constructor(accountName, containerName, sasToken) {
        this.baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}`;
        this.sasToken = sasToken;
    }

    async uploadBlob(blobName, data, metadata = {}) {
        // Upload documents, schemas, projects to Azure
    }

    async downloadBlob(blobName) {
        // Download with automatic retry and error handling
    }

    async listBlobs(prefix = '') {
        // List user's blobs with pagination
    }
}
```

#### 1.2 Data Migration Strategy
- **Incremental approach**: New data goes to Azure, old data remains in localStorage
- **Background migration**: Gradually move existing localStorage data to Azure
- **Fallback mechanism**: If Azure fails, gracefully degrade to localStorage

#### 1.3 Container Structure
```
/users/{userId}/
├── documents/           # User's private documents
├── projects/           # User's private projects
├── schemas/            # User's private schemas
├── preferences/        # User settings and preferences
└── metadata/           # User profile and activity data

/shared/
├── templates/          # Shared templates
├── components/         # Reusable components
└── public/            # Public resources

/workspaces/{workspaceId}/
├── documents/          # Shared workspace documents
├── projects/          # Shared workspace projects
└── metadata/          # Workspace settings and permissions
```

**Deliverable**: Users can save/load documents from Azure Blob Storage
**Test Criteria**: Create document → Save to Azure → Refresh page → Document loads from Azure

### Week 2-3: Authentication & User Management
**Goal**: Replace persona system with real user authentication

#### 2.1 Authentication Architecture Decision Matrix

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **Azure AD B2C** | Enterprise-grade, GDPR compliant, social logins | Complex setup, costs at scale | Production, enterprise |
| **Azure AD** | Integrated with Azure services, SSO | Limited customization, enterprise-focused | B2B scenarios |
| **Firebase Auth** | Simple setup, good docs, free tier | Google dependency, less enterprise features | Rapid prototyping |
| **Auth0** | Feature-rich, great UX, extensive docs | Third-party dependency, costs | Professional applications |
| **Custom JWT** | Full control, no dependencies | Security complexity, maintenance overhead | Specific requirements |

**Recommendation**: Start with Azure AD B2C for production readiness and enterprise features.

#### 2.2 Complete Authentication Service Implementation

```javascript
// Core Authentication Service
class AuthService {
    constructor() {
        this.msalConfig = {
            auth: {
                clientId: process.env.AZURE_CLIENT_ID,
                authority: `https://${process.env.AZURE_TENANT}.b2clogin.com/${process.env.AZURE_TENANT}.onmicrosoft.com/${process.env.AZURE_POLICY}`,
                knownAuthorities: [`${process.env.AZURE_TENANT}.b2clogin.com`],
                redirectUri: window.location.origin
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: false
            }
        };

        this.msalInstance = new msal.PublicClientApplication(this.msalConfig);
        this.currentUser = null;
        this.tokenRefreshInterval = null;
    }

    // Login Methods
    async loginWithPopup() {
        try {
            const loginResponse = await this.msalInstance.loginPopup({
                scopes: ['openid', 'profile', 'email'],
                prompt: 'select_account'
            });

            this.currentUser = this.extractUserFromResponse(loginResponse);
            this.startTokenRefresh();
            this.notifyAuthStateChange('login', this.currentUser);

            return this.currentUser;
        } catch (error) {
            console.error('Login failed:', error);
            throw new AuthError('Login failed', error);
        }
    }

    async loginWithRedirect() {
        try {
            await this.msalInstance.loginRedirect({
                scopes: ['openid', 'profile', 'email']
            });
        } catch (error) {
            console.error('Redirect login failed:', error);
            throw new AuthError('Redirect login failed', error);
        }
    }

    // Social Login Integration
    async loginWithProvider(provider) {
        const providerMappings = {
            'google': 'google.com',
            'facebook': 'facebook.com',
            'microsoft': 'microsoft.com',
            'linkedin': 'linkedin.com'
        };

        const authority = `https://${process.env.AZURE_TENANT}.b2clogin.com/${process.env.AZURE_TENANT}.onmicrosoft.com/${process.env.AZURE_POLICY}_${provider}`;

        return await this.msalInstance.loginPopup({
            scopes: ['openid', 'profile', 'email'],
            authority: authority,
            prompt: 'select_account'
        });
    }

    // Token Management
    async getAccessToken() {
        try {
            const accounts = this.msalInstance.getAllAccounts();
            if (accounts.length === 0) {
                throw new AuthError('No authenticated accounts found');
            }

            const silentRequest = {
                scopes: ['https://graph.microsoft.com/.default'],
                account: accounts[0]
            };

            const response = await this.msalInstance.acquireTokenSilent(silentRequest);
            return response.accessToken;
        } catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                return await this.msalInstance.acquireTokenPopup(silentRequest);
            }
            throw error;
        }
    }

    async refreshToken() {
        try {
            const token = await this.getAccessToken();
            this.scheduleTokenRefresh();
            return token;
        } catch (error) {
            console.error('Token refresh failed:', error);
            await this.logout();
        }
    }

    startTokenRefresh() {
        // Refresh token 5 minutes before expiration
        const refreshInterval = 55 * 60 * 1000; // 55 minutes
        this.tokenRefreshInterval = setInterval(() => {
            this.refreshToken();
        }, refreshInterval);
    }

    // User Management
    async getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }

        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            this.currentUser = this.extractUserFromAccount(accounts[0]);
            return this.currentUser;
        }

        return null;
    }

    extractUserFromResponse(response) {
        const claims = response.idTokenClaims;
        return {
            id: claims.sub || claims.oid,
            email: claims.email || claims.preferred_username,
            name: claims.name || `${claims.given_name} ${claims.family_name}`,
            firstName: claims.given_name,
            lastName: claims.family_name,
            initials: this.generateInitials(claims.name || claims.given_name, claims.family_name),
            picture: claims.picture,
            roles: claims.roles || [],
            tenantId: claims.tid,
            loginProvider: claims.idp || 'local',
            lastLogin: new Date().toISOString(),
            preferences: {
                theme: 'light',
                language: 'en',
                notifications: true
            }
        };
    }

    generateInitials(firstName, lastName) {
        if (!firstName && !lastName) return 'U';
        return ((firstName || '').charAt(0) + (lastName || '').charAt(0)).toUpperCase();
    }

    // Session Management
    async logout() {
        try {
            this.clearTokenRefresh();
            this.currentUser = null;

            await this.msalInstance.logoutPopup({
                postLogoutRedirectUri: window.location.origin,
                mainWindowRedirectUri: window.location.origin
            });

            this.notifyAuthStateChange('logout', null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    async checkAuthState() {
        try {
            await this.msalInstance.handleRedirectPromise();
            const user = await this.getCurrentUser();

            if (user) {
                this.startTokenRefresh();
                this.notifyAuthStateChange('restored', user);
            }

            return user;
        } catch (error) {
            console.error('Auth state check failed:', error);
            return null;
        }
    }

    // Event Management
    onAuthStateChange(callback) {
        if (!this.authStateListeners) {
            this.authStateListeners = [];
        }
        this.authStateListeners.push(callback);

        // Return unsubscribe function
        return () => {
            this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
        };
    }

    notifyAuthStateChange(event, user) {
        if (this.authStateListeners) {
            this.authStateListeners.forEach(callback => {
                callback(event, user);
            });
        }

        // Emit custom event
        window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { event, user }
        }));
    }

    // Utility Methods
    isAuthenticated() {
        return this.currentUser !== null;
    }

    hasRole(role) {
        return this.currentUser?.roles?.includes(role) || false;
    }

    canAccess(resource, action) {
        if (!this.isAuthenticated()) return false;

        // Implement your authorization logic here
        return true;
    }

    clearTokenRefresh() {
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
            this.tokenRefreshInterval = null;
        }
    }
}

// Custom Error Classes
class AuthError extends Error {
    constructor(message, originalError = null) {
        super(message);
        this.name = 'AuthError';
        this.originalError = originalError;
    }
}
```

#### 2.3 Authentication UI Components

```javascript
// Login Component
class LoginComponent {
    constructor(authService) {
        this.authService = authService;
        this.element = null;
    }

    render() {
        return `
            <div class="auth-modal" id="loginModal">
                <div class="auth-modal-content">
                    <div class="auth-header">
                        <img src="assets/logos/cleansheet-logo.svg" alt="Cleansheet" class="auth-logo">
                        <h2>Welcome to Cleansheet Professional</h2>
                        <p>Sign in to access your workspace and collaborate with your team</p>
                    </div>

                    <div class="auth-body">
                        <!-- Social Login Options -->
                        <div class="social-login-section">
                            <button class="social-login-btn microsoft" onclick="authService.loginWithProvider('microsoft')">
                                <i class="fab fa-microsoft"></i>
                                Continue with Microsoft
                            </button>
                            <button class="social-login-btn google" onclick="authService.loginWithProvider('google')">
                                <i class="fab fa-google"></i>
                                Continue with Google
                            </button>
                            <button class="social-login-btn linkedin" onclick="authService.loginWithProvider('linkedin')">
                                <i class="fab fa-linkedin"></i>
                                Continue with LinkedIn
                            </button>
                        </div>

                        <div class="auth-divider">
                            <span>or</span>
                        </div>

                        <!-- Email/Password Form -->
                        <form class="email-login-form" onsubmit="handleEmailLogin(event)">
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" required
                                       placeholder="your.email@company.com">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" required
                                       placeholder="Enter your password">
                            </div>

                            <div class="form-options">
                                <label class="checkbox-container">
                                    <input type="checkbox" name="remember" id="remember">
                                    <span class="checkmark"></span>
                                    Remember me
                                </label>
                                <a href="#" class="forgot-password-link" onclick="showForgotPassword()">
                                    Forgot password?
                                </a>
                            </div>

                            <button type="submit" class="primary-login-btn">
                                Sign In
                            </button>
                        </form>

                        <!-- Sign Up Link -->
                        <div class="auth-footer">
                            <p>Don't have an account?
                               <a href="#" onclick="showSignUp()" class="signup-link">Sign up for free</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    show() {
        if (!this.element) {
            document.body.insertAdjacentHTML('beforeend', this.render());
            this.element = document.getElementById('loginModal');
        }
        this.element.classList.add('active');
    }

    hide() {
        if (this.element) {
            this.element.classList.remove('active');
        }
    }
}

// User Profile Component
class UserProfileComponent {
    constructor(authService) {
        this.authService = authService;
    }

    render(user) {
        return `
            <div class="user-profile-dropdown">
                <div class="user-info">
                    <div class="user-avatar">
                        ${user.picture ?
                            `<img src="${user.picture}" alt="${user.name}">` :
                            `<div class="user-initials">${user.initials}</div>`
                        }
                    </div>
                    <div class="user-details">
                        <div class="user-name">${user.name}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>

                <div class="profile-menu">
                    <a href="#" onclick="openProfileSettings()" class="profile-menu-item">
                        <i class="ph ph-user"></i>
                        Profile Settings
                    </a>
                    <a href="#" onclick="openWorkspaceSettings()" class="profile-menu-item">
                        <i class="ph ph-gear"></i>
                        Workspace Settings
                    </a>
                    <a href="#" onclick="openNotificationSettings()" class="profile-menu-item">
                        <i class="ph ph-bell"></i>
                        Notifications
                    </a>
                    <div class="profile-menu-divider"></div>
                    <a href="#" onclick="authService.logout()" class="profile-menu-item logout">
                        <i class="ph ph-sign-out"></i>
                        Sign Out
                    </a>
                </div>
            </div>
        `;
    }
}
```

#### 2.4 Security & Privacy Implementation

```javascript
// Security Service
class SecurityService {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
        this.setupSecurityHeaders();
        this.setupInputSanitization();
    }

    // CSRF Protection
    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    validateCSRFToken(token) {
        return token === this.csrfToken;
    }

    // Input Sanitization
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // XSS Prevention
    sanitizeHTML(html) {
        const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
        const allowedAttributes = ['class', 'id'];

        // Use a library like DOMPurify in production
        return html; // Placeholder - implement proper sanitization
    }

    // Rate Limiting
    setupRateLimit() {
        const rateLimitStore = new Map();

        return (endpoint, maxRequests = 60, windowMs = 60000) => {
            const now = Date.now();
            const userKey = `${endpoint}_${this.getUserId()}`;

            if (!rateLimitStore.has(userKey)) {
                rateLimitStore.set(userKey, { count: 1, resetTime: now + windowMs });
                return true;
            }

            const rateLimit = rateLimitStore.get(userKey);

            if (now > rateLimit.resetTime) {
                rateLimitStore.set(userKey, { count: 1, resetTime: now + windowMs });
                return true;
            }

            if (rateLimit.count >= maxRequests) {
                return false;
            }

            rateLimit.count++;
            return true;
        };
    }

    // Secure Storage
    secureStorage = {
        setItem: (key, value) => {
            const encrypted = this.encrypt(JSON.stringify(value));
            sessionStorage.setItem(key, encrypted);
        },

        getItem: (key) => {
            const encrypted = sessionStorage.getItem(key);
            if (!encrypted) return null;

            try {
                const decrypted = this.decrypt(encrypted);
                return JSON.parse(decrypted);
            } catch {
                return null;
            }
        },

        removeItem: (key) => {
            sessionStorage.removeItem(key);
        }
    };

    encrypt(text) {
        // Implement proper encryption - placeholder
        return btoa(text);
    }

    decrypt(encryptedText) {
        // Implement proper decryption - placeholder
        return atob(encryptedText);
    }
}

// Privacy Service
class PrivacyService {
    constructor() {
        this.consentGiven = this.loadConsentStatus();
        this.setupPrivacyCompliance();
    }

    // GDPR Compliance
    showConsentBanner() {
        if (this.consentGiven) return;

        const banner = `
            <div class="privacy-consent-banner">
                <div class="consent-content">
                    <h4>Privacy & Cookies</h4>
                    <p>We use necessary cookies to make our site work. We'd also like to set optional analytics cookies to help us improve it. <a href="/privacy-policy" target="_blank">Learn more</a></p>
                    <div class="consent-actions">
                        <button onclick="privacyService.acceptAll()" class="btn-accept-all">Accept All</button>
                        <button onclick="privacyService.acceptNecessary()" class="btn-accept-necessary">Necessary Only</button>
                        <button onclick="privacyService.showPreferences()" class="btn-preferences">Preferences</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', banner);
    }

    acceptAll() {
        this.consentGiven = {
            necessary: true,
            analytics: true,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        this.saveConsentStatus();
        this.hideConsentBanner();
        this.enableAnalytics();
    }

    acceptNecessary() {
        this.consentGiven = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        this.saveConsentStatus();
        this.hideConsentBanner();
    }

    // Data Export (GDPR Right to Data Portability)
    async exportUserData(userId) {
        const userData = {
            profile: await this.getUserProfile(userId),
            documents: await this.getUserDocuments(userId),
            preferences: await this.getUserPreferences(userId),
            activityLog: await this.getUserActivity(userId),
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(userData, null, 2)],
                             { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cleansheet-data-export-${userId}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Data Deletion (GDPR Right to be Forgotten)
    async requestDataDeletion(userId) {
        const confirmation = await this.showDeletionConfirmation();
        if (!confirmation) return;

        // Mark for deletion - actual deletion should be handled server-side
        await this.scheduleUserDeletion(userId);
        await this.authService.logout();
        this.showDeletionConfirmation();
    }
}
```

#### 2.5 Progressive Authentication Strategy

```javascript
// Progressive Authentication - Start Simple, Scale Complex
class ProgressiveAuth {
    constructor() {
        this.authLevel = 'anonymous'; // anonymous -> basic -> authenticated -> verified
        this.capabilities = new Map();
        this.setupCapabilities();
    }

    setupCapabilities() {
        this.capabilities.set('anonymous', {
            canCreate: false,
            canSave: false,
            canShare: false,
            canExport: true,
            storageType: 'temporary'
        });

        this.capabilities.set('basic', {
            canCreate: true,
            canSave: true,
            canShare: false,
            canExport: true,
            storageType: 'localStorage',
            maxDocuments: 5
        });

        this.capabilities.set('authenticated', {
            canCreate: true,
            canSave: true,
            canShare: true,
            canExport: true,
            canCollaborate: true,
            storageType: 'cloud',
            maxDocuments: 100
        });

        this.capabilities.set('verified', {
            canCreate: true,
            canSave: true,
            canShare: true,
            canExport: true,
            canCollaborate: true,
            canAdminister: true,
            storageType: 'cloud',
            maxDocuments: 'unlimited'
        });
    }

    // Gradual Capability Unlock
    promptForUpgrade(requiredCapability) {
        const currentCapabilities = this.capabilities.get(this.authLevel);

        if (!currentCapabilities[requiredCapability]) {
            this.showUpgradePrompt(requiredCapability);
            return false;
        }

        return true;
    }

    showUpgradePrompt(capability) {
        const prompts = {
            canSave: "Sign up for free to save your documents permanently",
            canShare: "Sign in to share documents with your team",
            canCollaborate: "Sign in to collaborate in real-time with others"
        };

        // Show non-blocking upgrade suggestion
        this.showToast(prompts[capability] || "Sign in to unlock more features", {
            action: "Sign In",
            callback: () => this.authService.loginWithPopup()
        });
    }
}
```

#### 2.6 User Profile System Enhancement

```javascript
// Enhanced User Profile Management
class UserProfileService {
    constructor(authService, azureBlobService) {
        this.authService = authService;
        this.azureBlobService = azureBlobService;
    }

    async loadUserProfile(userId) {
        try {
            // Try loading from Azure first
            const profile = await this.azureBlobService.downloadBlob(`users/${userId}/profile.json`);

            if (profile) {
                return this.hydrateProfile(profile);
            }

            // Fallback to creating default profile
            return await this.createDefaultProfile(userId);
        } catch (error) {
            console.error('Error loading user profile:', error);
            return await this.createDefaultProfile(userId);
        }
    }

    async saveUserProfile(profile) {
        try {
            await this.azureBlobService.uploadBlob(
                `users/${profile.id}/profile.json`,
                profile,
                {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'last-modified': new Date().toISOString()
                }
            );

            // Also update local cache
            this.cacheProfile(profile);
            return profile;
        } catch (error) {
            console.error('Error saving user profile:', error);
            throw error;
        }
    }

    hydrateProfile(profile) {
        // Add computed properties and methods
        return {
            ...profile,
            initials: this.generateInitials(profile.firstName, profile.lastName),
            displayName: profile.displayName || `${profile.firstName} ${profile.lastName}`,
            isOnline: true,
            lastSeen: new Date().toISOString(),

            // Helper methods
            hasPermission: (permission) => {
                return profile.permissions?.includes(permission) || false;
            },

            getPreference: (key, defaultValue = null) => {
                return profile.preferences?.[key] ?? defaultValue;
            },

            setPreference: (key, value) => {
                if (!profile.preferences) profile.preferences = {};
                profile.preferences[key] = value;
                return this.saveUserProfile(profile);
            }
        };
    }

    async createDefaultProfile(userId) {
        const user = await this.authService.getCurrentUser();

        const defaultProfile = {
            id: userId,
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            displayName: user.name || user.email,
            initials: user.initials || 'U',
            avatar: user.picture || null,
            role: 'user',
            permissions: ['read', 'write'],
            preferences: {
                theme: 'light',
                language: 'en',
                notifications: {
                    email: true,
                    browser: true,
                    mentions: true,
                    documents: true
                },
                privacy: {
                    profileVisible: true,
                    activityVisible: false,
                    allowAnalytics: false
                }
            },
            workspace: {
                defaultView: 'documents',
                sortBy: 'lastModified',
                groupBy: 'none'
            },
            onboarding: {
                completed: false,
                steps: {
                    profile: false,
                    firstDocument: false,
                    firstShare: false,
                    tour: false
                }
            },
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            loginCount: 1
        };

        await this.saveUserProfile(defaultProfile);
        return this.hydrateProfile(defaultProfile);
    }

    generateInitials(firstName, lastName) {
        if (!firstName && !lastName) return 'U';
        return ((firstName || '').charAt(0) + (lastName || '').charAt(0)).toUpperCase();
    }
}
```

#### 2.7 Azure Infrastructure Setup

##### Azure AD B2C Configuration Steps

1. **Create Azure AD B2C Tenant**
```bash
# Azure CLI commands for setup
az extension add --name b2c
az ad b2c tenant create \
  --resource-group cleansheet-rg \
  --tenant-name cleansheetb2c \
  --location "United States"
```

2. **Configure Identity Providers**
```javascript
// Social provider configuration
const identityProviders = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: 'openid profile email'
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    scope: 'openid profile email'
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    scope: 'r_liteprofile r_emailaddress'
  }
};
```

3. **User Flow Configuration**
```xml
<!-- Sign-up and sign-in user flow policy -->
<TrustFrameworkPolicy
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  PolicySchemaVersion="0.3.0.0"
  TenantId="cleansheetb2c.onmicrosoft.com"
  PolicyId="B2C_1_signup_signin"
  PublicPolicyUri="http://cleansheetb2c.onmicrosoft.com/B2C_1_signup_signin">

  <BasePolicy>
    <TenantId>cleansheetb2c.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId>
  </BasePolicy>

  <UserJourneys>
    <UserJourney Id="SignUpOrSignIn">
      <!-- Configure sign-up/sign-in flow with social providers -->
    </UserJourney>
  </UserJourneys>
</TrustFrameworkPolicy>
```

##### Environment Configuration
```javascript
// Environment variables for authentication
const authConfig = {
  development: {
    clientId: process.env.DEV_AZURE_CLIENT_ID,
    authority: process.env.DEV_AZURE_AUTHORITY,
    redirectUri: 'http://localhost:3000',
    scopes: ['openid', 'profile', 'email']
  },
  staging: {
    clientId: process.env.STAGING_AZURE_CLIENT_ID,
    authority: process.env.STAGING_AZURE_AUTHORITY,
    redirectUri: 'https://staging.cleansheet.info',
    scopes: ['openid', 'profile', 'email', 'https://graph.microsoft.com/.default']
  },
  production: {
    clientId: process.env.PROD_AZURE_CLIENT_ID,
    authority: process.env.PROD_AZURE_AUTHORITY,
    redirectUri: 'https://professional.cleansheet.info',
    scopes: ['openid', 'profile', 'email', 'https://graph.microsoft.com/.default']
  }
};
```

#### 2.8 Testing & Quality Assurance Strategy

##### Authentication Test Suite
```javascript
// Comprehensive authentication tests
describe('Authentication Service', () => {
  describe('Login Flow', () => {
    test('should redirect to Azure AD B2C for login', async () => {
      const authService = new AuthService(mockConfig);
      await authService.loginWithRedirect();
      expect(mockMsal.loginRedirect).toHaveBeenCalledWith(expectedScopes);
    });

    test('should handle successful login response', async () => {
      const mockResponse = { idTokenClaims: { /* mock claims */ } };
      mockMsal.handleRedirectPromise.mockResolvedValue(mockResponse);

      const user = await authService.checkAuthState();
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    test('should handle login failure gracefully', async () => {
      const mockError = new Error('Login failed');
      mockMsal.loginPopup.mockRejectedValue(mockError);

      await expect(authService.loginWithPopup()).rejects.toThrow(AuthError);
    });
  });

  describe('Token Management', () => {
    test('should refresh token before expiration', async () => {
      jest.useFakeTimers();
      const authService = new AuthService(mockConfig);

      authService.startTokenRefresh();
      jest.advanceTimersByTime(55 * 60 * 1000); // 55 minutes

      expect(mockMsal.acquireTokenSilent).toHaveBeenCalled();
    });

    test('should handle token refresh failure', async () => {
      const mockError = new msal.InteractionRequiredAuthError();
      mockMsal.acquireTokenSilent.mockRejectedValue(mockError);
      mockMsal.acquireTokenPopup.mockResolvedValue({ accessToken: 'new-token' });

      const token = await authService.getAccessToken();
      expect(token).toBe('new-token');
    });
  });

  describe('Security', () => {
    test('should sanitize user input', () => {
      const securityService = new SecurityService();
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = securityService.sanitizeInput(maliciousInput);

      expect(sanitized).not.toContain('<script>');
    });

    test('should validate CSRF tokens', () => {
      const securityService = new SecurityService();
      const validToken = securityService.csrfToken;
      const invalidToken = 'invalid-token';

      expect(securityService.validateCSRFToken(validToken)).toBe(true);
      expect(securityService.validateCSRFToken(invalidToken)).toBe(false);
    });

    test('should enforce rate limits', () => {
      const securityService = new SecurityService();
      const rateLimit = securityService.setupRateLimit();

      // Allow first 60 requests
      for (let i = 0; i < 60; i++) {
        expect(rateLimit('test-endpoint')).toBe(true);
      }

      // Block 61st request
      expect(rateLimit('test-endpoint')).toBe(false);
    });
  });
});
```

##### Performance & Load Testing
```javascript
// Performance testing for authentication flows
describe('Authentication Performance', () => {
  test('login should complete within 3 seconds', async () => {
    const startTime = Date.now();
    await authService.loginWithPopup();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(3000);
  });

  test('should handle concurrent login attempts', async () => {
    const promises = Array(10).fill().map(() => authService.loginWithPopup());
    const results = await Promise.allSettled(promises);

    const successful = results.filter(r => r.status === 'fulfilled').length;
    expect(successful).toBe(1); // Only one should succeed, others should be deduplicated
  });

  test('should cache user profile for performance', async () => {
    const profileService = new UserProfileService(authService, azureBlobService);

    const startTime1 = Date.now();
    await profileService.loadUserProfile('user-123');
    const time1 = Date.now() - startTime1;

    const startTime2 = Date.now();
    await profileService.loadUserProfile('user-123'); // Should be cached
    const time2 = Date.now() - startTime2;

    expect(time2).toBeLessThan(time1 * 0.1); // Cached should be 10x faster
  });
});
```

#### 2.9 Deployment & DevOps Integration

##### CI/CD Pipeline Configuration
```yaml
# .github/workflows/authentication.yml
name: Authentication System CI/CD

on:
  push:
    paths:
      - 'src/services/auth/**'
      - 'src/components/auth/**'
  pull_request:
    paths:
      - 'src/services/auth/**'
      - 'src/components/auth/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run authentication tests
        run: npm run test:auth
        env:
          AZURE_CLIENT_ID: ${{ secrets.TEST_AZURE_CLIENT_ID }}
          AZURE_TENANT_ID: ${{ secrets.TEST_AZURE_TENANT_ID }}

      - name: Run security audit
        run: npm audit --audit-level moderate

      - name: Test authentication flows
        run: npm run test:e2e:auth
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/professional"
          output_location: "dist"
```

##### Monitoring & Observability
```javascript
// Authentication monitoring and analytics
class AuthenticationMonitoring {
  constructor() {
    this.analytics = new AnalyticsService();
    this.errorTracking = new ErrorTrackingService();
  }

  trackLoginAttempt(provider, success, error = null) {
    this.analytics.track('auth_login_attempt', {
      provider: provider,
      success: success,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      error: error ? error.message : null
    });

    if (!success && error) {
      this.errorTracking.captureException(error, {
        context: 'authentication',
        provider: provider
      });
    }
  }

  trackUserRegistration(provider, userInfo) {
    this.analytics.track('auth_user_registration', {
      provider: provider,
      hasAvatar: !!userInfo.picture,
      timestamp: new Date().toISOString()
    });
  }

  trackTokenRefresh(success, error = null) {
    this.analytics.track('auth_token_refresh', {
      success: success,
      timestamp: new Date().toISOString(),
      error: error ? error.message : null
    });
  }

  generateAuthenticationReport() {
    return {
      totalLogins: this.getTotalLogins(),
      successRate: this.getLoginSuccessRate(),
      popularProviders: this.getPopularProviders(),
      errorRate: this.getErrorRate(),
      averageSessionDuration: this.getAverageSessionDuration()
    };
  }
}
```

#### 2.10 Security Compliance Checklist

##### OWASP Compliance
- [ ] **A01: Broken Access Control** - Role-based permissions implemented
- [ ] **A02: Cryptographic Failures** - Secure token storage, encrypted sessions
- [ ] **A03: Injection** - Input sanitization, parameterized queries
- [ ] **A04: Insecure Design** - Security by design, threat modeling
- [ ] **A05: Security Misconfiguration** - Secure defaults, minimal exposure
- [ ] **A06: Vulnerable Components** - Dependency scanning, regular updates
- [ ] **A07: Identity/Authentication Failures** - MFA support, secure session management
- [ ] **A08: Software/Data Integrity** - Code signing, secure CI/CD
- [ ] **A09: Logging/Monitoring Failures** - Comprehensive audit logs
- [ ] **A10: Server-Side Request Forgery** - Input validation, URL allowlists

##### GDPR Compliance
- [ ] **Lawful Basis** - Clear purpose for data processing
- [ ] **Data Minimization** - Only collect necessary user data
- [ ] **Consent Management** - Granular consent options
- [ ] **Right to Access** - User profile export functionality
- [ ] **Right to Rectification** - Profile editing capabilities
- [ ] **Right to Erasure** - Account deletion process
- [ ] **Data Portability** - Export in machine-readable format
- [ ] **Privacy by Design** - Default privacy settings
- [ ] **Data Protection Impact Assessment** - Risk assessment completed
- [ ] **Data Processing Record** - Documentation of data flows

**Deliverable**: Production-ready authentication system with Azure AD B2C integration
**Test Criteria**:
- [ ] Social login works with Google/Microsoft/LinkedIn
- [ ] Email/password signup and login functions correctly
- [ ] User profiles persist across sessions and devices
- [ ] Progressive authentication unlocks features appropriately
- [ ] Security measures prevent common attacks (XSS, CSRF, injection)
- [ ] GDPR compliance with consent management and data export
- [ ] Performance meets requirements (<3s login, <1s token refresh)
- [ ] Monitoring and alerting systems operational
- [ ] 99.9% authentication availability SLA met
- [ ] Security audit completed with no critical vulnerabilities

---

## Phase 2: Data Sync Architecture (Weeks 4-6)
*Enable offline-first experience and data consistency*

### Week 4: IndexedDB Migration
**Goal**: Move from localStorage to IndexedDB for better offline support

#### 4.1 IndexedDB Implementation
```javascript
// Enhanced Data Service with IndexedDB
class DataService {
    constructor() {
        this.azureService = new AzureBlobService();
        this.indexedDB = new IndexedDBService();
        this.syncQueue = new SyncQueue();
    }

    async saveDocument(doc) {
        // Save to IndexedDB immediately
        await this.indexedDB.save('documents', doc);

        // Queue for Azure sync
        this.syncQueue.add('upload', 'documents', doc.id);

        // Attempt immediate sync if online
        if (navigator.onLine) {
            await this.sync();
        }
    }

    async loadDocument(id) {
        // Try IndexedDB first (fast)
        let doc = await this.indexedDB.get('documents', id);

        // Check Azure for updates if online
        if (navigator.onLine) {
            const remoteDoc = await this.azureService.downloadBlob(`documents/${id}`);
            if (remoteDoc && remoteDoc.lastModified > doc.lastModified) {
                doc = remoteDoc;
                await this.indexedDB.save('documents', doc);
            }
        }

        return doc;
    }
}
```

**Deliverable**: Offline document editing with background sync
**Test Criteria**: Create document offline → Go online → Document syncs to Azure → Accessible from other device

### Week 5-6: Conflict Resolution System
**Goal**: Handle concurrent editing by multiple users

#### 6.1 Conflict Detection
```javascript
// Conflict Resolution Service
class ConflictResolver {
    async detectConflict(localDoc, remoteDoc) {
        if (localDoc.lastModified !== remoteDoc.lastModified) {
            return {
                type: 'concurrent_edit',
                localVersion: localDoc,
                remoteVersion: remoteDoc,
                conflictId: generateId()
            };
        }
        return null;
    }

    showConflictResolutionUI(conflict) {
        // Show modal with side-by-side comparison
        // Options: Keep Local, Keep Remote, Merge Changes
    }
}
```

**Deliverable**: Conflict resolution when multiple users edit same document
**Test Criteria**: User A edits document → User B edits same document → Both sync → Conflict resolution UI appears

---

## Phase 3: RBAC Integration (Weeks 7-10)
*Layer permission system on top of stable backend*

### Week 7-8: Core RBAC Implementation
**Goal**: Implement role-based permission system

#### 8.1 Role & Permission System (from RBAC Plan)
```javascript
// Integrate RBAC with Azure backend
const rbacRoles = {
    'owner': { permissions: ['read', 'write', 'delete', 'share', 'admin'], color: '#dc2626' },
    'editor': { permissions: ['read', 'write', 'share'], color: '#0066cc' },
    'viewer': { permissions: ['read'], color: '#6b7280' }
};

class PermissionManager {
    async canAccess(userId, resourceId, action) {
        // Check user's role and resource permissions
        const resource = await this.azureService.downloadBlob(`metadata/${resourceId}`);
        const user = await this.authService.getCurrentUser();

        // Owner always has access
        if (resource.ownerId === userId) return true;

        // Check explicit sharing
        const userPermission = resource.sharedWith?.[userId];
        if (userPermission) {
            const role = rbacRoles[userPermission];
            return role.permissions.includes(action);
        }

        return false;
    }
}
```

**Deliverable**: Working permission system with role-based access control
**Test Criteria**: Owner shares document with Editor → Editor can edit but not delete → Viewer can only view

### Week 9-10: Enhanced Sharing Interface
**Goal**: Replace alert-based sharing with comprehensive UI

#### 10.1 Advanced Share Modal (from RBAC Plan)
- Implement the full sharing modal with role selection
- Add email-based user lookup
- Integrate with Azure Blob metadata storage

**Deliverable**: Professional sharing interface with role management
**Test Criteria**: Share document with specific users and roles → Recipients receive appropriate access

---

## Phase 4: Advanced Collaboration (Weeks 11-14)
*Real-time features and advanced workflows*

### Week 11-12: Real-time Sync
**Goal**: Near-real-time collaboration experience

#### 12.1 WebSocket Integration
```javascript
// Real-time sync service
class RealtimeSync {
    constructor() {
        this.ws = new WebSocket('wss://your-websocket-endpoint');
        this.subscriptions = new Map();
    }

    subscribeToDocument(docId) {
        this.ws.send(JSON.stringify({
            type: 'subscribe',
            resource: `documents/${docId}`
        }));
    }

    onMessage(event) {
        const update = JSON.parse(event.data);
        if (update.type === 'document_updated') {
            // Show "Document updated by [user]" notification
            // Offer to reload or merge changes
        }
    }
}
```

### Week 13-14: Block-Level Permissions
**Goal**: Granular sharing at block level within documents

#### 14.1 Enhanced Block Sharing (from RBAC Plan)
- Implement block-level permission metadata
- Add permission inheritance from document to blocks
- Create block-specific sharing UI

**Deliverable**: Share individual sections/blocks of documents with different users
**Test Criteria**: Share document header with Viewer, document body with Editor → Users see appropriate sections

---

## Phase 5: Polish & Production Readiness (Weeks 15-16)
*Performance, security, and user experience refinement*

### Week 15: Performance & Security
- **Audit trail implementation**: Track all permission changes and data access
- **Performance optimization**: Lazy loading, pagination, caching strategies
- **Security hardening**: Input validation, XSS prevention, secure token handling

### Week 16: Advanced Features & Testing
- **Bulk operations**: Multi-select and batch permission changes
- **Export capabilities**: Personal data export, workspace backups
- **Comprehensive testing**: End-to-end user workflows, edge cases

---

# 🎯 Incremental Value & Testing Strategy

## Phase-by-Phase Value Delivery

### Phase 1 Value
- **Users get**: Reliable cloud storage, no data loss on browser refresh
- **Testing**: Basic CRUD operations with Azure backend

### Phase 2 Value
- **Users get**: Offline editing, automatic sync, no internet dependency for basic work
- **Testing**: Offline scenarios, concurrent editing detection

### Phase 3 Value
- **Users get**: Professional sharing capabilities, role-based collaboration
- **Testing**: Multi-user workflows, permission scenarios

### Phase 4 Value
- **Users get**: Real-time collaboration, granular control
- **Testing**: Advanced collaboration scenarios

### Phase 5 Value
- **Users get**: Production-grade platform ready for enterprise use
- **Testing**: Load testing, security audits, compliance verification

## Risk Mitigation

### Technical Risks
1. **Azure Blob latency**: Cache frequently accessed data in IndexedDB
2. **Authentication complexity**: Start with simple email/password before Azure AD
3. **Sync conflicts**: Implement automatic resolution for common cases
4. **Browser compatibility**: Progressive enhancement approach

### User Experience Risks
1. **Feature regression**: Maintain backward compatibility during migration
2. **Learning curve**: Gradual UI evolution, not revolutionary changes
3. **Performance**: Monitor and optimize at each phase

## Success Metrics

### Phase 1 Success Criteria
- [ ] 100% of new documents save to Azure
- [ ] Page refresh preserves all user data
- [ ] Zero data loss during normal operation

### Phase 2 Success Criteria
- [ ] Offline editing works for 30+ minutes
- [ ] Sync completion rate >95%
- [ ] Conflict detection catches all concurrent edits

### Phase 3 Success Criteria
- [ ] Multi-user sharing works for 5+ concurrent users
- [ ] Permission system has zero unauthorized access
- [ ] Sharing UI completion rate >90%

### Phase 4 Success Criteria
- [ ] Real-time updates appear within 5 seconds
- [ ] Block-level permissions work correctly
- [ ] Advanced features adoption >60%

---

# 🛠️ Implementation Guidelines

## Development Approach

### Incremental Integration
1. **Never break existing functionality** - New features layer on top
2. **Feature flags** - Enable/disable features during development
3. **A/B testing** - Gradual rollout of new interfaces
4. **Rollback capability** - Ability to revert to previous version

### Testing Strategy
1. **Unit tests** - Individual components and services
2. **Integration tests** - Cross-service workflows
3. **User acceptance tests** - Real user scenarios
4. **Performance tests** - Load and stress testing

### Code Organization
```
src/
├── services/
│   ├── AzureBlobService.js
│   ├── AuthService.js
│   ├── DataService.js
│   ├── SyncManager.js
│   ├── PermissionManager.js
│   └── ConflictResolver.js
├── components/
│   ├── ShareModal.js
│   ├── SyncIndicator.js
│   ├── ConflictResolutionModal.js
│   └── PermissionEditor.js
├── utils/
│   ├── storage.js
│   ├── permissions.js
│   └── sync.js
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Quality Assurance

### Code Quality
- **ESLint/Prettier**: Consistent code formatting
- **TypeScript**: Type safety for critical services
- **Code reviews**: All changes reviewed by another developer
- **Documentation**: Comprehensive API documentation

### Security Considerations
- **Input sanitization**: All user input validated and sanitized
- **HTTPS only**: All communication encrypted
- **Token security**: Secure storage and automatic refresh
- **Permission validation**: Server-side validation of all permissions

---

This plan provides a clear roadmap for transforming professional.html into a production-ready multi-user platform while ensuring each phase delivers tangible value and can be thoroughly tested before proceeding to the next level of complexity.

---

# 🎨 Professional Canvas Implementation

## Canvas Architecture Overview

The Professional Canvas serves as the central workspace interface, providing users with an intuitive D3 treemap visualization for navigating their content hierarchy, combined with powerful inventory slideout panels for CRUD operations on various document types.

### Core Components
- **D3 Treemap Visualization**: Interactive hierarchical content navigation
- **Inventory Slideouts**: Right-side panels for document type management
- **CRUD Operations**: Complete document lifecycle management
- **Real-time Collaboration**: Multi-user workspace synchronization

---

## Phase 6: Professional Canvas Foundation (Weeks 17-19)
*Build the core canvas interface with responsive D3 treemap visualization and mobile-optimized navigation*

### Week 17: Canvas Layout & Infrastructure

#### 17.1 Responsive Canvas Container Structure
Following the Production Canvas Layout specifications from CLAUDE.md with mobile and tablet adaptations:

```html
<!-- Professional Canvas Layout -->
<div id="professionalCanvas" class="canvas-container">
    <!-- Canvas Header -->
    <div class="canvas-header">
        <div class="canvas-logo">
            <img src="assets/high-resolution-logo-files/white-on-transparent.png"
                 alt="Cleansheet Professional" class="header-logo">
        </div>

        <nav class="canvas-nav">
            <!-- Mobile Menu Button -->
            <button class="mobile-menu-toggle" id="mobileMenuToggle">
                <i class="ph ph-list"></i>
            </button>

            <!-- Desktop/Tablet Navigation -->
            <div class="nav-tabs desktop-nav">
                <button class="nav-tab active" data-tab="workspace">
                    <i class="ph ph-house"></i>
                    <span class="tab-label">Workspace</span>
                </button>
                <button class="nav-tab" data-tab="documents">
                    <i class="ph ph-file-text"></i>
                    <span class="tab-label">Documents</span>
                </button>
                <button class="nav-tab" data-tab="projects">
                    <i class="ph ph-folder"></i>
                    <span class="tab-label">Projects</span>
                </button>
                <button class="nav-tab" data-tab="templates">
                    <i class="ph ph-copy"></i>
                    <span class="tab-label">Templates</span>
                </button>
                <button class="nav-tab" data-tab="workflows">
                    <i class="ph ph-flow-arrow"></i>
                    <span class="tab-label">Workflows</span>
                </button>
            </div>

            <!-- Mobile Navigation Dropdown -->
            <div class="mobile-nav-dropdown" id="mobileNavDropdown">
                <button class="mobile-nav-item active" data-tab="workspace">
                    <i class="ph ph-house"></i>
                    Workspace
                </button>
                <button class="mobile-nav-item" data-tab="documents">
                    <i class="ph ph-file-text"></i>
                    Documents
                </button>
                <button class="mobile-nav-item" data-tab="projects">
                    <i class="ph ph-folder"></i>
                    Projects
                </button>
                <button class="mobile-nav-item" data-tab="templates">
                    <i class="ph ph-copy"></i>
                    Templates
                </button>
                <button class="mobile-nav-item" data-tab="workflows">
                    <i class="ph ph-flow-arrow"></i>
                    Workflows
                </button>
            </div>
        </nav>

        <div class="user-profile-section">
            <div class="user-profile-dropdown" id="userProfileDropdown">
                <!-- User profile component from authentication system -->
            </div>
        </div>
    </div>

    <!-- Canvas Body Grid -->
    <div class="canvas-body">
        <!-- Left Panel: D3 Treemap (Desktop/Tablet) -->
        <div class="canvas-left-panel desktop-panel" id="canvasLeftPanel">
            <div class="treemap-container">
                <svg id="professionalTreemap" class="treemap-svg"></svg>
            </div>
        </div>

        <!-- Mobile Navigation Panel -->
        <div class="mobile-navigation-panel" id="mobileNavigationPanel">
            <div class="mobile-nav-sections">
                <!-- Collapsible sections for mobile -->
                <div class="collapsible-section">
                    <button class="section-header" data-section="documents">
                        <i class="ph ph-file-text"></i>
                        <span>Documents</span>
                        <i class="ph ph-caret-down section-arrow"></i>
                    </button>
                    <div class="section-content" id="documentsSection">
                        <!-- Mobile document list will be populated here -->
                    </div>
                </div>

                <div class="collapsible-section">
                    <button class="section-header" data-section="projects">
                        <i class="ph ph-folder"></i>
                        <span>Projects</span>
                        <i class="ph ph-caret-down section-arrow"></i>
                    </button>
                    <div class="section-content" id="projectsSection">
                        <!-- Mobile project list will be populated here -->
                    </div>
                </div>

                <div class="collapsible-section">
                    <button class="section-header" data-section="forms">
                        <i class="ph ph-clipboard-text"></i>
                        <span>Forms & Reports</span>
                        <i class="ph ph-caret-down section-arrow"></i>
                    </button>
                    <div class="section-content" id="formsSection">
                        <!-- Mobile forms/reports list will be populated here -->
                    </div>
                </div>

                <div class="collapsible-section">
                    <button class="section-header" data-section="workflows">
                        <i class="ph ph-flow-arrow"></i>
                        <span>Workflows & Templates</span>
                        <i class="ph ph-caret-down section-arrow"></i>
                    </button>
                    <div class="section-content" id="workflowsSection">
                        <!-- Mobile workflows/templates list will be populated here -->
                    </div>
                </div>

                <div class="collapsible-section">
                    <button class="section-header" data-section="data">
                        <i class="ph ph-table"></i>
                        <span>Data & Automation</span>
                        <i class="ph ph-caret-down section-arrow"></i>
                    </button>
                    <div class="section-content" id="dataSection">
                        <!-- Mobile tables/pipelines list will be populated here -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Panel Toggle Button (Desktop/Tablet only) -->
        <button class="panel-toggle desktop-only" id="panelToggle">
            <i class="ph ph-caret-left"></i>
        </button>

        <!-- Right Panel: Widgets and Content -->
        <div class="canvas-right-panel" id="canvasRightPanel">
            <!-- Dynamic content widgets -->
            <div class="canvas-widgets" id="canvasWidgets">
                <!-- Widgets rendered dynamically based on current tab -->
            </div>
        </div>
    </div>

    <!-- Inventory Slideout Panels -->
    <div class="inventory-slideout" id="inventorySlideout">
        <div class="slideout-header">
            <h2 class="slideout-title" id="slideoutTitle">Document Management</h2>
            <button class="slideout-close" id="slideoutClose">
                <i class="ph ph-x"></i>
            </button>
        </div>
        <div class="slideout-body" id="slideoutBody">
            <!-- Dynamic content based on document type -->
        </div>
    </div>
</div>
```

#### 17.2 Responsive Canvas CSS Framework
```css
/* Professional Canvas Layout - Mobile First */
.canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    font-family: var(--font-family-ui);
    overflow: hidden;
}

.canvas-header {
    background: var(--color-dark);
    color: white;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    height: 60px;
    flex-shrink: 0;
    position: relative;
    z-index: 1000;
}

/* Mobile Navigation */
.mobile-menu-toggle {
    display: block;
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.mobile-menu-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.desktop-nav {
    display: none;
}

.mobile-nav-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-dark);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: none;
    flex-direction: column;
    z-index: 999;
}

.mobile-nav-dropdown.active {
    display: flex;
}

.mobile-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: none;
    border: none;
    color: white;
    text-align: left;
    font-family: var(--font-family-ui);
    font-size: 14px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: background-color 0.2s;
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
    background-color: rgba(255, 255, 255, 0.1);
}

.mobile-nav-item i {
    font-size: 16px;
}

/* Canvas Body - Mobile First */
.canvas-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: var(--color-neutral-background);
    position: relative;
    overflow: hidden;
}

/* Mobile Navigation Panel */
.mobile-navigation-panel {
    display: block;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.desktop-panel {
    display: none;
}

.desktop-only {
    display: none;
}

/* Collapsible Sections for Mobile */
.collapsible-section {
    margin-bottom: 8px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: none;
    border: none;
    text-align: left;
    font-family: var(--font-family-ui);
    font-size: 16px;
    font-weight: 600;
    color: var(--color-dark);
    cursor: pointer;
    transition: background-color 0.2s;
    position: relative;
}

.section-header:hover {
    background-color: var(--color-neutral-background);
}

.section-header i:first-child {
    font-size: 20px;
    color: var(--color-primary-blue);
}

.section-header span {
    flex: 1;
}

.section-arrow {
    font-size: 16px;
    transition: transform 0.3s ease;
    color: var(--color-neutral-text);
}

.section-header[aria-expanded="true"] .section-arrow {
    transform: rotate(180deg);
}

.section-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    background: #fafafa;
}

.section-content.expanded {
    max-height: 500px;
    padding: 16px 20px;
}

/* Mobile Item List */
.mobile-item-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mobile-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: white;
    border-radius: 6px;
    border: 1px solid var(--color-neutral-border);
    cursor: pointer;
    transition: all 0.2s;
}

.mobile-item:hover,
.mobile-item:active {
    background: #f8f8f8;
    border-color: var(--color-primary-blue);
    transform: translateY(-1px);
}

.mobile-item-icon {
    width: 32px;
    height: 32px;
    background: #e3f2fd;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--color-primary-blue);
    flex-shrink: 0;
}

.mobile-item-content {
    flex: 1;
    min-width: 0;
}

.mobile-item-title {
    font-family: var(--font-family-ui);
    font-size: 14px;
    font-weight: 600;
    color: var(--color-dark);
    margin: 0 0 2px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mobile-item-meta {
    font-family: var(--font-family-body);
    font-size: 12px;
    color: var(--color-neutral-text);
    margin: 0;
}

.mobile-item-actions {
    display: flex;
    gap: 8px;
}

.mobile-action-btn {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid var(--color-neutral-border);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.mobile-action-btn:hover {
    background: var(--color-primary-blue);
    border-color: var(--color-primary-blue);
    color: white;
}

.mobile-action-btn.danger:hover {
    background: #dc2626;
    border-color: #dc2626;
    color: white;
}

/* Canvas Right Panel */
.canvas-right-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
}

/* Inventory Slideout - Mobile Optimizations */
.inventory-slideout {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 1001;
    transition: right 0.4s ease;
    display: flex;
    flex-direction: column;
}

.inventory-slideout.active {
    right: 0;
}

.slideout-header {
    padding: 16px 20px;
    background: var(--color-dark);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral-border);
    min-height: 60px;
}

.slideout-title {
    font-family: var(--font-family-ui);
    font-size: 18px;
    margin: 0;
    font-weight: 600;
}

.slideout-close {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.slideout-close:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.slideout-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: var(--color-neutral-background);
    display: flex;
    flex-direction: column;
}

/* Tablet Breakpoint (768px and up) */
@media (min-width: 768px) {
    .canvas-header {
        padding: 12px 24px;
    }

    .mobile-menu-toggle {
        display: none;
    }

    .desktop-nav {
        display: flex;
        gap: 4px;
    }

    .nav-tab {
        padding: 8px 16px;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-family: var(--font-family-ui);
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .nav-tab:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .nav-tab.active {
        background: rgba(0, 102, 204, 0.3);
        color: white;
    }

    .nav-tab i {
        font-size: 16px;
    }

    .tab-label {
        display: block;
    }

    .mobile-nav-dropdown {
        display: none !important;
    }

    .canvas-body {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 24px;
        padding: 24px;
    }

    .canvas-body.collapsed {
        grid-template-columns: 0px 1fr;
        gap: 0;
    }

    .mobile-navigation-panel {
        display: none;
    }

    .desktop-panel {
        display: block;
        background: white;
        border-radius: 12px;
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .canvas-body.collapsed .desktop-panel {
        opacity: 0;
        pointer-events: none;
    }

    .desktop-only {
        display: block;
        position: absolute;
        top: 50%;
        left: 374px;
        transform: translateY(-50%);
        z-index: 101;
        background: white;
        border: 1px solid var(--color-neutral-border);
        border-radius: 0 8px 8px 0;
        padding: 12px 8px;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        font-size: 20px;
        color: var(--color-neutral-text);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .canvas-body.collapsed .desktop-only {
        left: 0;
    }

    .desktop-only:hover {
        background: var(--color-primary-blue);
        color: white;
        border-color: var(--color-primary-blue);
    }

    .inventory-slideout {
        width: 60%;
        right: -60%;
    }

    .slideout-header {
        padding: 24px;
        min-height: auto;
    }

    .slideout-title {
        font-size: 20px;
    }

    .slideout-close {
        font-size: 32px;
        width: 32px;
        height: 32px;
    }

    .slideout-body {
        padding: 24px;
    }
}

/* Desktop Breakpoint (1024px and up) */
@media (min-width: 1024px) {
    .tab-label {
        display: block;
    }

    /* Show text labels on larger screens */
    .nav-tab {
        padding: 8px 16px;
    }
}

/* Touch Optimizations */
@media (hover: none) and (pointer: coarse) {
    /* Touch-friendly sizing */
    .section-header {
        padding: 20px;
        min-height: 60px;
    }

    .mobile-item {
        padding: 16px;
        min-height: 60px;
    }

    .mobile-action-btn {
        width: 44px;
        height: 44px;
        font-size: 16px;
    }

    .nav-tab {
        min-height: 44px;
        padding: 12px 16px;
    }

    .slideout-close {
        width: 44px;
        height: 44px;
        font-size: 28px;
    }

    /* Remove hover effects on touch devices */
    .mobile-item:hover,
    .section-header:hover,
    .mobile-action-btn:hover {
        transform: none;
        background: initial;
    }

    /* Use :active instead of :hover for touch feedback */
    .mobile-item:active {
        background: #f0f0f0;
        transform: scale(0.98);
    }

    .section-header:active {
        background-color: var(--color-neutral-background);
    }
}

/* Mobile-specific Components */
.empty-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 20px;
    color: var(--color-neutral-text);
}

.empty-section i {
    font-size: 48px;
    opacity: 0.3;
    margin-bottom: 16px;
}

.empty-section p {
    margin: 0 0 16px 0;
    font-family: var(--font-family-body);
    font-size: 14px;
}

.create-first-btn {
    padding: 12px 20px;
    background: var(--color-primary-blue);
    color: white;
    border: none;
    border-radius: 6px;
    font-family: var(--font-family-ui);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.create-first-btn:hover {
    background: var(--color-accent-blue);
}

/* Mobile Workspace Overview */
.mobile-workspace-overview {
    padding: 0;
}

.mobile-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

.mobile-stat {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 16px;
}

.mobile-stat i {
    font-size: 32px;
    color: var(--color-primary-blue);
}

.mobile-stat .stat-content {
    min-width: 0;
}

.mobile-stat .stat-number {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-dark);
    margin: 0 0 4px 0;
}

.mobile-stat .stat-label {
    font-size: 12px;
    color: var(--color-neutral-text);
    margin: 0;
}

.mobile-quick-actions {
    margin-top: 24px;
}

.mobile-quick-actions h3 {
    font-family: var(--font-family-ui);
    font-size: 18px;
    font-weight: 600;
    color: var(--color-dark);
    margin: 0 0 16px 0;
}

.mobile-action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.mobile-quick-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 16px;
    background: white;
    border: 1px solid var(--color-neutral-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    color: var(--color-neutral-text);
}

.mobile-quick-action:hover,
.mobile-quick-action:active {
    background: #f8f8f8;
    border-color: var(--color-primary-blue);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 102, 204, 0.15);
}

.mobile-quick-action i {
    font-size: 32px;
    color: var(--color-primary-blue);
}

.mobile-quick-action span {
    font-family: var(--font-family-ui);
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    color: var(--color-dark);
}

/* Accessibility improvements for mobile */
@media (max-width: 767px) {
    /* Ensure minimum touch target sizes */
    button, .mobile-item, .section-header {
        min-height: 44px;
        min-width: 44px;
    }

    /* Improve focus indicators for keyboard navigation */
    button:focus,
    .mobile-item:focus,
    .section-header:focus {
        outline: 2px solid var(--color-primary-blue);
        outline-offset: 2px;
    }

    /* Reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        .mobile-item,
        .collapsible-section,
        .mobile-quick-action {
            border-width: 2px;
        }

        .section-header,
        .mobile-item:hover {
            background: var(--color-dark);
            color: white;
        }
    }

    /* Improve text readability */
    .mobile-item-title,
    .section-header span {
        line-height: 1.4;
    }

    .mobile-item-meta {
        line-height: 1.3;
    }
}

.canvas-body.collapsed .canvas-left-panel {
    opacity: 0;
    pointer-events: none;
}

.canvas-right-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    overflow-x: hidden;
}

/* Panel Toggle Button */
.panel-toggle {
    position: absolute;
    top: 50%;
    left: 374px;
    transform: translateY(-50%);
    z-index: 101;
    background: white;
    border: 1px solid var(--color-neutral-border);
    border-radius: 0 8px 8px 0;
    padding: 12px 8px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    font-size: 20px;
    color: var(--color-neutral-text);
    cursor: pointer;
    transition: all 0.3s ease;
}

.canvas-body.collapsed .panel-toggle {
    left: 0;
}

.panel-toggle:hover {
    background: var(--color-primary-blue);
    color: white;
    border-color: var(--color-primary-blue);
}

/* Inventory Slideout */
.inventory-slideout {
    position: absolute;
    top: 0;
    right: -60%;
    width: 60%;
    height: 100%;
    background: white;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.2);
    z-index: 100;
    transition: right 0.4s ease;
    display: flex;
    flex-direction: column;
}

.inventory-slideout.active {
    right: 0;
}

.slideout-header {
    padding: 24px;
    background: var(--color-dark);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral-border);
}

.slideout-title {
    font-family: var(--font-family-ui);
    font-size: 20px;
    margin: 0;
}

.slideout-close {
    background: none;
    border: none;
    color: white;
    font-size: 32px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.2s;
}

.slideout-close:hover {
    opacity: 0.7;
}

.slideout-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: var(--color-neutral-background);
    display: flex;
    flex-direction: column;
}
```

### Week 18-19: D3 Treemap Implementation

#### 18.1 Professional Treemap Visualization
```javascript
// Professional D3 Treemap Implementation
class ProfessionalTreemap {
    constructor(containerId, data) {
        this.container = d3.select(`#${containerId}`);
        this.data = data;
        this.width = 0;
        this.height = 0;
        this.currentDepth = 0;
        this.maxDepth = 3;
        this.animationDuration = 500;

        this.setupDimensions();
        this.initializeTreemap();
        this.bindEvents();
    }

    setupDimensions() {
        const containerNode = this.container.node();
        this.width = containerNode.clientWidth;
        this.height = containerNode.clientHeight;
    }

    initializeTreemap() {
        // Clear any existing content
        this.container.selectAll("*").remove();

        // Create SVG
        this.svg = this.container
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("display", "block");

        // Create main group
        this.g = this.svg.append("g");

        // Setup treemap layout
        this.treemap = d3.treemap()
            .size([this.width, this.height])
            .padding(2)
            .round(true);

        this.render();
    }

    render() {
        // Create hierarchy
        const root = d3.hierarchy(this.data)
            .sum(d => d.size || 1)
            .sort((a, b) => b.value - a.value);

        // Apply treemap layout
        this.treemap(root);

        // Filter nodes by depth
        const visibleNodes = root.descendants().filter(d => d.depth <= this.currentDepth + 1);

        // Bind data
        const nodes = this.g.selectAll(".treemap-node")
            .data(visibleNodes, d => d.data.id);

        // Remove exiting nodes
        nodes.exit()
            .transition()
            .duration(this.animationDuration)
            .style("opacity", 0)
            .remove();

        // Enter new nodes
        const nodeEnter = nodes.enter()
            .append("g")
            .attr("class", "treemap-node")
            .style("opacity", 0);

        // Add rectangles
        nodeEnter.append("rect")
            .attr("class", "treemap-rect")
            .attr("fill", d => this.getNodeColor(d))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .attr("rx", 4)
            .on("click", (event, d) => this.handleNodeClick(event, d))
            .on("mouseover", (event, d) => this.showTooltip(event, d))
            .on("mouseout", () => this.hideTooltip());

        // Add text labels
        nodeEnter.append("text")
            .attr("class", "treemap-text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("fill", "white")
            .attr("font-family", "var(--font-family-ui)")
            .attr("font-size", d => this.getTextSize(d))
            .attr("font-weight", "600")
            .text(d => this.truncateText(d.data.name, d));

        // Add count badges for parent nodes
        nodeEnter.filter(d => d.children)
            .append("circle")
            .attr("class", "count-badge")
            .attr("fill", "rgba(0, 0, 0, 0.3)")
            .attr("r", 12);

        nodeEnter.filter(d => d.children)
            .append("text")
            .attr("class", "count-text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("fill", "white")
            .attr("font-family", "var(--font-family-ui)")
            .attr("font-size", "10px")
            .attr("font-weight", "600")
            .text(d => d.children.length);

        // Merge enter and update selections
        const nodeUpdate = nodeEnter.merge(nodes);

        // Update positions and sizes
        nodeUpdate
            .transition()
            .duration(this.animationDuration)
            .style("opacity", 1)
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        nodeUpdate.select(".treemap-rect")
            .transition()
            .duration(this.animationDuration)
            .attr("width", d => Math.max(0, d.x1 - d.x0))
            .attr("height", d => Math.max(0, d.y1 - d.y0));

        nodeUpdate.select(".treemap-text")
            .transition()
            .duration(this.animationDuration)
            .attr("x", d => (d.x1 - d.x0) / 2)
            .attr("y", d => (d.y1 - d.y0) / 2);

        nodeUpdate.select(".count-badge")
            .attr("cx", d => (d.x1 - d.x0) - 20)
            .attr("cy", 20);

        nodeUpdate.select(".count-text")
            .attr("x", d => (d.x1 - d.x0) - 20)
            .attr("y", 20);
    }

    getNodeColor(d) {
        const colors = {
            'documents': '#0066cc',
            'projects': '#16a34a',
            'templates': '#7c3aed',
            'forms': '#dc2626',
            'reports': '#ea580c',
            'workflows': '#0891b2',
            'pipelines': '#4338ca',
            'tables': '#059669'
        };

        // Use parent's type for color consistency
        const type = d.data.type || (d.parent && d.parent.data.type) || 'documents';
        return colors[type] || '#6b7280';
    }

    getTextSize(d) {
        const area = (d.x1 - d.x0) * (d.y1 - d.y0);
        if (area > 10000) return '14px';
        if (area > 5000) return '12px';
        return '10px';
    }

    truncateText(text, d) {
        const maxLength = this.getMaxTextLength(d);
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    }

    getMaxTextLength(d) {
        const width = d.x1 - d.x0;
        if (width > 150) return 20;
        if (width > 100) return 15;
        if (width > 60) return 10;
        return 8;
    }

    handleNodeClick(event, d) {
        if (d.data.type && d.data.items) {
            // Open inventory slideout for this document type
            this.openInventorySlideout(d.data.type, d.data.items);
        } else if (d.children && d.depth < this.maxDepth) {
            // Navigate deeper into hierarchy
            this.currentDepth = d.depth;
            this.render();
        } else if (d.data.id) {
            // Open individual document/item
            this.openDocument(d.data);
        }
    }

    openInventorySlideout(type, items) {
        const slideout = document.getElementById('inventorySlideout');
        const title = document.getElementById('slideoutTitle');
        const body = document.getElementById('slideoutBody');

        // Set title based on type
        const titles = {
            'documents': 'Document Management',
            'projects': 'Project Management',
            'templates': 'Template Library',
            'forms': 'Form Builder',
            'reports': 'Report Generator',
            'workflows': 'Workflow Designer',
            'pipelines': 'Pipeline Manager',
            'tables': 'Table Editor'
        };

        title.textContent = titles[type] || 'Content Management';

        // Load appropriate inventory component
        this.loadInventoryComponent(type, items, body);

        // Show slideout
        slideout.classList.add('active');
    }

    loadInventoryComponent(type, items, container) {
        // This will be implemented in the next phase
        container.innerHTML = `
            <div class="inventory-placeholder">
                <h3>Coming Soon: ${type.charAt(0).toUpperCase() + type.slice(1)} Management</h3>
                <p>CRUD interface for ${type} will be implemented here.</p>
                <div class="item-count">${items ? items.length : 0} items available</div>
            </div>
        `;
    }

    showTooltip(event, d) {
        // Implement tooltip showing node details
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "treemap-tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "8px 12px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", "1000");

        tooltip.html(`
            <strong>${d.data.name}</strong><br/>
            Type: ${d.data.type || 'Category'}<br/>
            ${d.children ? `Children: ${d.children.length}` : 'Size: ' + (d.data.size || 1)}
        `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px")
        .transition()
        .duration(200)
        .style("opacity", 1);

        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
                .remove();
        }
    }

    bindEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupDimensions();
            this.svg
                .attr("width", this.width)
                .attr("height", this.height);
            this.treemap.size([this.width, this.height]);
            this.render();
        });

        // Handle slideout close
        document.getElementById('slideoutClose').addEventListener('click', () => {
            document.getElementById('inventorySlideout').classList.remove('active');
        });

        // Handle panel toggle
        document.getElementById('panelToggle').addEventListener('click', () => {
            const canvasBody = document.querySelector('.canvas-body');
            canvasBody.classList.toggle('collapsed');

            const icon = document.querySelector('#panelToggle i');
            if (canvasBody.classList.contains('collapsed')) {
                icon.className = 'ph ph-caret-right';
            } else {
                icon.className = 'ph ph-caret-left';
            }
        });
    }

    // Navigation methods
    zoomToNode(nodeId) {
        // Find and focus on specific node
        const targetNode = this.findNodeById(this.data, nodeId);
        if (targetNode) {
            this.currentDepth = targetNode.depth;
            this.render();
        }
    }

    resetView() {
        this.currentDepth = 0;
        this.render();
    }

    findNodeById(node, targetId) {
        if (node.id === targetId) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = this.findNodeById(child, targetId);
                if (found) return found;
            }
        }
        return null;
    }

    // Data management
    updateData(newData) {
        this.data = newData;
        this.render();
    }

    addNode(parentId, newNode) {
        const parent = this.findNodeById(this.data, parentId);
        if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(newNode);
            this.render();
        }
    }

    removeNode(nodeId) {
        this.removeNodeRecursive(this.data, nodeId);
        this.render();
    }

    removeNodeRecursive(node, targetId) {
        if (node.children) {
            node.children = node.children.filter(child => {
                if (child.id === targetId) return false;
                this.removeNodeRecursive(child, targetId);
                return true;
            });
        }
    }
}
```

#### 18.2 Sample Data Structure
```javascript
// Professional workspace data structure
const professionalWorkspaceData = {
    name: "Professional Workspace",
    id: "workspace-root",
    type: "workspace",
    children: [
        {
            name: "Documents",
            id: "documents",
            type: "documents",
            size: 15,
            children: [
                {
                    name: "Rich Text Documents",
                    id: "rich-text-docs",
                    type: "documents",
                    size: 8,
                    items: [
                        { id: "doc-1", name: "Project Proposal", type: "rich-text", lastModified: "2024-01-15" },
                        { id: "doc-2", name: "Meeting Notes", type: "rich-text", lastModified: "2024-01-14" },
                        { id: "doc-3", name: "Requirements Document", type: "rich-text", lastModified: "2024-01-13" }
                    ]
                },
                {
                    name: "Block Documents",
                    id: "block-docs",
                    type: "documents",
                    size: 7,
                    items: [
                        { id: "block-1", name: "System Architecture", type: "block", blocks: 12 },
                        { id: "block-2", name: "User Stories", type: "block", blocks: 8 },
                        { id: "block-3", name: "Technical Specs", type: "block", blocks: 15 }
                    ]
                }
            ]
        },
        {
            name: "Projects",
            id: "projects",
            type: "projects",
            size: 12,
            children: [
                {
                    name: "Active Projects",
                    id: "active-projects",
                    type: "projects",
                    size: 8,
                    items: [
                        { id: "proj-1", name: "Website Redesign", status: "in-progress", team: 4 },
                        { id: "proj-2", name: "API Integration", status: "planning", team: 2 },
                        { id: "proj-3", name: "Mobile App", status: "in-progress", team: 6 }
                    ]
                },
                {
                    name: "Completed Projects",
                    id: "completed-projects",
                    type: "projects",
                    size: 4,
                    items: [
                        { id: "proj-4", name: "Database Migration", status: "completed", team: 3 }
                    ]
                }
            ]
        },
        {
            name: "Forms & Reports",
            id: "forms-reports",
            type: "forms",
            size: 10,
            children: [
                {
                    name: "Forms",
                    id: "forms",
                    type: "forms",
                    size: 6,
                    items: [
                        { id: "form-1", name: "Employee Onboarding", fields: 12, responses: 24 },
                        { id: "form-2", name: "Project Feedback", fields: 8, responses: 15 },
                        { id: "form-3", name: "Time Tracking", fields: 6, responses: 156 }
                    ]
                },
                {
                    name: "Reports",
                    id: "reports",
                    type: "reports",
                    size: 4,
                    items: [
                        { id: "report-1", name: "Monthly Performance", charts: 5, pages: 12 },
                        { id: "report-2", name: "Budget Analysis", charts: 3, pages: 8 }
                    ]
                }
            ]
        },
        {
            name: "Templates & Workflows",
            id: "templates-workflows",
            type: "templates",
            size: 8,
            children: [
                {
                    name: "Templates",
                    id: "templates",
                    type: "templates",
                    size: 5,
                    items: [
                        { id: "template-1", name: "Project Brief Template", uses: 12 },
                        { id: "template-2", name: "Meeting Minutes Template", uses: 34 },
                        { id: "template-3", name: "Status Report Template", uses: 18 }
                    ]
                },
                {
                    name: "Workflows",
                    id: "workflows",
                    type: "workflows",
                    size: 3,
                    items: [
                        { id: "workflow-1", name: "Content Approval", steps: 4, active: true },
                        { id: "workflow-2", name: "Project Handoff", steps: 6, active: true }
                    ]
                }
            ]
        },
        {
            name: "Data & Automation",
            id: "data-automation",
            type: "tables",
            size: 6,
            children: [
                {
                    name: "Tables",
                    id: "tables",
                    type: "tables",
                    size: 4,
                    items: [
                        { id: "table-1", name: "Employee Directory", rows: 156, columns: 8 },
                        { id: "table-2", name: "Project Budgets", rows: 24, columns: 12 },
                        { id: "table-3", name: "Client Contacts", rows: 89, columns: 6 }
                    ]
                },
                {
                    name: "Pipelines",
                    id: "pipelines",
                    type: "pipelines",
                    size: 2,
                    items: [
                        { id: "pipeline-1", name: "Data Processing", stages: 5, runs: 45 },
                        { id: "pipeline-2", name: "Report Generation", stages: 3, runs: 23 }
                    ]
                }
            ]
        }
    ]
};
```

#### 18.3 Mobile Navigation Manager
```javascript
// Mobile Navigation Manager - Replaces D3 treemap on mobile devices
class MobileNavigationManager {
    constructor(dataService, authService) {
        this.dataService = dataService;
        this.authService = authService;
        this.workspaceData = null;
        this.expandedSections = new Set();

        this.bindEvents();
    }

    initialize(workspaceData) {
        this.workspaceData = workspaceData;
        this.renderMobileSections();
    }

    bindEvents() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileNavDropdown();
            });
        }

        // Mobile navigation items
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('mobile-nav-item')) {
                const tab = event.target.dataset.tab;
                this.switchTab(tab);
                this.closeMobileNavDropdown();
            }
        });

        // Section headers (collapsible)
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('section-header') ||
                event.target.closest('.section-header')) {
                const header = event.target.classList.contains('section-header') ?
                    event.target : event.target.closest('.section-header');
                this.toggleSection(header);
            }
        });

        // Mobile item clicks
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('mobile-item') ||
                event.target.closest('.mobile-item')) {
                const item = event.target.classList.contains('mobile-item') ?
                    event.target : event.target.closest('.mobile-item');
                this.handleMobileItemClick(item);
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (event) => {
            const navDropdown = document.getElementById('mobileNavDropdown');
            const menuToggle = document.getElementById('mobileMenuToggle');

            if (navDropdown && navDropdown.classList.contains('active') &&
                !navDropdown.contains(event.target) &&
                !menuToggle.contains(event.target)) {
                this.closeMobileNavDropdown();
            }
        });
    }

    toggleMobileNavDropdown() {
        const dropdown = document.getElementById('mobileNavDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    closeMobileNavDropdown() {
        const dropdown = document.getElementById('mobileNavDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    switchTab(tabName) {
        // Update mobile nav active states
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update desktop nav active states
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.nav-tab[data-tab="${tabName}"]`)?.classList.add('active');

        // Update content
        this.showTabContent(tabName);
    }

    showTabContent(tabName) {
        const rightPanel = document.getElementById('canvasRightPanel');
        if (!rightPanel) return;

        switch (tabName) {
            case 'workspace':
                this.showWorkspaceOverview(rightPanel);
                break;
            case 'documents':
                this.expandSection('documents');
                break;
            case 'projects':
                this.expandSection('projects');
                break;
            case 'templates':
                this.expandSection('workflows'); // Templates are in workflows section
                break;
            case 'workflows':
                this.expandSection('workflows');
                break;
        }
    }

    renderMobileSections() {
        if (!this.workspaceData || !this.workspaceData.children) return;

        // Get mobile sections container
        const sectionsContainer = document.querySelector('.mobile-nav-sections');
        if (!sectionsContainer) return;

        // Clear existing content
        sectionsContainer.innerHTML = '';

        // Group data by section type
        const sections = this.groupDataBySections(this.workspaceData.children);

        // Render each section
        Object.entries(sections).forEach(([sectionKey, sectionData]) => {
            this.renderSection(sectionsContainer, sectionKey, sectionData);
        });
    }

    groupDataBySections(children) {
        const sections = {
            documents: { name: 'Documents', icon: 'file-text', items: [] },
            projects: { name: 'Projects', icon: 'folder', items: [] },
            forms: { name: 'Forms & Reports', icon: 'clipboard-text', items: [] },
            workflows: { name: 'Workflows & Templates', icon: 'flow-arrow', items: [] },
            data: { name: 'Data & Automation', icon: 'table', items: [] }
        };

        children.forEach(category => {
            if (category.type === 'documents') {
                sections.documents.items.push(...this.flattenCategoryItems(category));
            } else if (category.type === 'projects') {
                sections.projects.items.push(...this.flattenCategoryItems(category));
            } else if (category.type === 'forms') {
                sections.forms.items.push(...this.flattenCategoryItems(category));
            } else if (category.type === 'templates' || category.type === 'workflows') {
                sections.workflows.items.push(...this.flattenCategoryItems(category));
            } else if (category.type === 'tables' || category.type === 'pipelines') {
                sections.data.items.push(...this.flattenCategoryItems(category));
            }
        });

        return sections;
    }

    flattenCategoryItems(category) {
        const items = [];

        if (category.children) {
            category.children.forEach(subCategory => {
                if (subCategory.items) {
                    items.push(...subCategory.items.map(item => ({
                        ...item,
                        categoryType: category.type,
                        subCategory: subCategory.name
                    })));
                }
            });
        } else if (category.items) {
            items.push(...category.items.map(item => ({
                ...item,
                categoryType: category.type
            })));
        }

        return items;
    }

    renderSection(container, sectionKey, sectionData) {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'collapsible-section';
        sectionElement.innerHTML = `
            <button class="section-header" data-section="${sectionKey}" aria-expanded="false">
                <i class="ph ph-${sectionData.icon}"></i>
                <span>${sectionData.name}</span>
                <i class="ph ph-caret-down section-arrow"></i>
            </button>
            <div class="section-content" id="${sectionKey}Section">
                ${this.renderSectionItems(sectionData.items, sectionKey)}
            </div>
        `;

        container.appendChild(sectionElement);
    }

    renderSectionItems(items, sectionType) {
        if (!items || items.length === 0) {
            return `
                <div class="empty-section">
                    <i class="ph ph-plus-circle"></i>
                    <p>No ${sectionType} yet</p>
                    <button class="create-first-btn" onclick="mobileNavManager.createFirstItem('${sectionType}')">
                        Create First ${sectionType.charAt(0).toUpperCase() + sectionType.slice(1, -1)}
                    </button>
                </div>
            `;
        }

        return `
            <div class="mobile-item-list">
                ${items.map(item => this.renderMobileItem(item, sectionType)).join('')}
            </div>
        `;
    }

    renderMobileItem(item, sectionType) {
        const icon = this.getItemIcon(item, sectionType);
        const meta = this.getItemMeta(item, sectionType);

        return `
            <div class="mobile-item" data-item-id="${item.id}" data-item-type="${item.type || sectionType}">
                <div class="mobile-item-icon">
                    <i class="ph ph-${icon}"></i>
                </div>
                <div class="mobile-item-content">
                    <div class="mobile-item-title">${item.name}</div>
                    <div class="mobile-item-meta">${meta}</div>
                </div>
                <div class="mobile-item-actions">
                    <button class="mobile-action-btn" onclick="event.stopPropagation(); mobileNavManager.editItem('${item.id}', '${item.type || sectionType}')">
                        <i class="ph ph-pencil"></i>
                    </button>
                    <button class="mobile-action-btn" onclick="event.stopPropagation(); mobileNavManager.shareItem('${item.id}', '${item.type || sectionType}')">
                        <i class="ph ph-share"></i>
                    </button>
                    <button class="mobile-action-btn danger" onclick="event.stopPropagation(); mobileNavManager.deleteItem('${item.id}', '${item.type || sectionType}')">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getItemIcon(item, sectionType) {
        const iconMap = {
            'rich-text': 'file-text',
            'block': 'squares-four',
            'project': 'folder',
            'form': 'clipboard-text',
            'report': 'chart-bar',
            'template': 'copy',
            'workflow': 'flow-arrow',
            'table': 'table',
            'pipeline': 'pipeline'
        };

        return iconMap[item.type] || iconMap[sectionType] || 'file';
    }

    getItemMeta(item, sectionType) {
        // Return contextual metadata based on item type
        if (item.lastModified) {
            const date = new Date(item.lastModified);
            const timeAgo = this.getTimeAgo(date);

            if (item.subCategory) {
                return `${item.subCategory} • ${timeAgo}`;
            }
            return timeAgo;
        }

        if (item.subCategory) {
            return item.subCategory;
        }

        return 'No description';
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }

    toggleSection(headerElement) {
        const sectionKey = headerElement.dataset.section;
        const content = headerElement.nextElementSibling;
        const arrow = headerElement.querySelector('.section-arrow');
        const isExpanded = headerElement.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            // Collapse
            content.classList.remove('expanded');
            headerElement.setAttribute('aria-expanded', 'false');
            this.expandedSections.delete(sectionKey);
        } else {
            // Expand
            content.classList.add('expanded');
            headerElement.setAttribute('aria-expanded', 'true');
            this.expandedSections.add(sectionKey);
        }
    }

    expandSection(sectionKey) {
        const header = document.querySelector(`[data-section="${sectionKey}"]`);
        if (header && header.getAttribute('aria-expanded') !== 'true') {
            this.toggleSection(header);
        }
    }

    handleMobileItemClick(itemElement) {
        const itemId = itemElement.dataset.itemId;
        const itemType = itemElement.dataset.itemType;

        // Open item in inventory slideout
        this.openInventoryForItem(itemId, itemType);
    }

    openInventoryForItem(itemId, itemType) {
        // Find the appropriate inventory component type
        const componentType = this.getInventoryComponentType(itemType);

        // Trigger slideout opening (this would integrate with the main canvas manager)
        if (window.canvasManager) {
            window.canvasManager.showInventoryComponent(componentType, [], itemType);
            document.getElementById('inventorySlideout').classList.add('active');

            // If editing specific item, trigger edit mode
            setTimeout(() => {
                if (window.canvasManager.activeInventoryComponent?.editItem) {
                    window.canvasManager.activeInventoryComponent.editItem(itemId);
                }
            }, 300);
        }
    }

    getInventoryComponentType(itemType) {
        const typeMap = {
            'rich-text': 'documents',
            'block': 'documents',
            'project': 'projects',
            'form': 'forms',
            'report': 'reports',
            'template': 'templates',
            'workflow': 'workflows',
            'table': 'tables',
            'pipeline': 'pipelines'
        };

        return typeMap[itemType] || 'documents';
    }

    // Action methods
    createFirstItem(sectionType) {
        const componentType = this.getInventoryComponentType(sectionType);

        if (window.canvasManager) {
            window.canvasManager.showInventoryComponent(componentType, []);
            document.getElementById('inventorySlideout').classList.add('active');

            setTimeout(() => {
                if (window.canvasManager.activeInventoryComponent?.createNew) {
                    window.canvasManager.activeInventoryComponent.createNew();
                }
            }, 300);
        }
    }

    editItem(itemId, itemType) {
        this.openInventoryForItem(itemId, itemType);
    }

    shareItem(itemId, itemType) {
        // Implement sharing functionality
        console.log('Sharing item:', itemId, itemType);
        this.showToast('Sharing feature coming soon', 'info');
    }

    async deleteItem(itemId, itemType) {
        const confirmed = confirm('Are you sure you want to delete this item?');
        if (!confirmed) return;

        try {
            await this.dataService.deleteItem(itemType + 's', itemId);
            this.showToast('Item deleted successfully', 'success');

            // Refresh the mobile sections
            setTimeout(() => this.refreshMobileSections(), 500);
        } catch (error) {
            console.error('Error deleting item:', error);
            this.showToast('Failed to delete item', 'error');
        }
    }

    showWorkspaceOverview(container) {
        // Show mobile-optimized workspace overview
        container.innerHTML = `
            <div class="mobile-workspace-overview">
                <div class="overview-stats mobile-stats">
                    <div class="stat-card mobile-stat">
                        <i class="ph ph-file-text"></i>
                        <div class="stat-content">
                            <div class="stat-number">${this.getDocumentCount()}</div>
                            <div class="stat-label">Documents</div>
                        </div>
                    </div>
                    <div class="stat-card mobile-stat">
                        <i class="ph ph-folder"></i>
                        <div class="stat-content">
                            <div class="stat-number">${this.getProjectCount()}</div>
                            <div class="stat-label">Projects</div>
                        </div>
                    </div>
                </div>

                <div class="mobile-quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="mobile-action-grid">
                        <button class="mobile-quick-action" onclick="mobileNavManager.createFirstItem('documents')">
                            <i class="ph ph-file-plus"></i>
                            <span>New Document</span>
                        </button>
                        <button class="mobile-quick-action" onclick="mobileNavManager.createFirstItem('projects')">
                            <i class="ph ph-folder-plus"></i>
                            <span>New Project</span>
                        </button>
                        <button class="mobile-quick-action" onclick="mobileNavManager.createFirstItem('forms')">
                            <i class="ph ph-clipboard-text"></i>
                            <span>New Form</span>
                        </button>
                        <button class="mobile-quick-action" onclick="mobileNavManager.createFirstItem('tables')">
                            <i class="ph ph-table"></i>
                            <span>New Table</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async refreshMobileSections() {
        try {
            // Reload workspace data
            const userId = this.authService.getCurrentUser()?.id;
            if (userId) {
                this.workspaceData = await this.dataService.getUserWorkspace(userId);
                this.renderMobileSections();
            }
        } catch (error) {
            console.error('Error refreshing mobile sections:', error);
        }
    }

    getDocumentCount() {
        if (!this.workspaceData?.children) return 0;
        const docCategory = this.workspaceData.children.find(c => c.type === 'documents');
        return docCategory?.size || 0;
    }

    getProjectCount() {
        if (!this.workspaceData?.children) return 0;
        const projCategory = this.workspaceData.children.find(c => c.type === 'projects');
        return projCategory?.size || 0;
    }

    showToast(message, type) {
        if (window.CleansheetCore?.utils?.showToast) {
            window.CleansheetCore.utils.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Static method to detect if mobile navigation should be used
    static shouldUseMobileNavigation() {
        return window.innerWidth < 768;
    }
}

// Global mobile navigation manager instance
let mobileNavManager;

// Initialize mobile navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (MobileNavigationManager.shouldUseMobileNavigation()) {
        // Initialize mobile navigation manager
        // This will be integrated with the main canvas manager
    }
});

// Handle window resize to switch between mobile and desktop views
window.addEventListener('resize', () => {
    const isMobile = MobileNavigationManager.shouldUseMobileNavigation();
    const body = document.body;

    if (isMobile) {
        body.classList.add('mobile-view');
        body.classList.remove('desktop-view');
    } else {
        body.classList.add('desktop-view');
        body.classList.remove('mobile-view');
    }
});
```

**Deliverable**: Interactive D3 treemap visualization with responsive mobile navigation and inventory slideout triggers
**Test Criteria**:
- [ ] **Desktop/Tablet (≥768px)**: D3 treemap renders with proper proportions and colors
- [ ] **Desktop/Tablet**: Click navigation works for different node types
- [ ] **Desktop/Tablet**: Panel toggle button collapses/expands left navigation
- [ ] **Mobile (<768px)**: Collapsible sections display correctly with smooth animations
- [ ] **Mobile**: Touch-friendly item lists with 60px minimum touch targets
- [ ] **Mobile**: Hamburger menu toggles navigation dropdown
- [ ] **Mobile**: Swipe gestures work on collapsible sections (iOS Safari)
- [ ] **All devices**: Slideout panels adapt to screen size (100% width on mobile, 60% on tablet/desktop)
- [ ] **All devices**: CRUD operations work identically across form factors
- [ ] **Performance**: Smooth 60fps animations on mobile devices
- [ ] **Performance**: Memory usage remains stable with large datasets on mobile
- [ ] **Touch**: No hover states interfere with touch interactions
- [ ] **Touch**: Active states provide appropriate visual feedback
- [ ] **Responsive**: Layout transitions smoothly between breakpoints during device rotation

#### Mobile & Tablet Integration Summary

**Responsive Strategy:**
- **Mobile (<768px)**: Replaces D3 treemap with collapsible table sections, full-width slideouts, hamburger navigation
- **Tablet (≥768px)**: Uses desktop D3 treemap layout with touch-optimized interactions and 60% slideout width
- **Desktop (≥1024px)**: Full desktop experience with hover states and keyboard shortcuts

**Key Mobile Features:**
- Touch-friendly collapsible sections with smooth animations
- Minimum 44px touch targets for accessibility compliance
- Swipe-enabled scrolling with `-webkit-overflow-scrolling: touch`
- Mobile-optimized workspace overview with 2x2 action grid
- Responsive inventory management with identical CRUD operations across devices
- Progressive Web App ready with service worker support

**Technical Implementation:**
- `MobileNavigationManager` class handles mobile-specific interactions
- `ProfessionalCanvasManager` automatically switches between mobile/desktop modes
- Responsive CSS with mobile-first approach and progressive enhancement
- Touch gesture support and reduced motion preferences
- High contrast mode and accessibility improvements

---

## Phase 7: Inventory Management System (Weeks 20-23)
*Implement comprehensive CRUD operations for all document types*

### Week 20-21: Core CRUD Framework

#### 20.1 Inventory Component Architecture
```javascript
// Base Inventory Component
class InventoryComponent {
    constructor(type, container, dataService, authService) {
        this.type = type;
        this.container = container;
        this.dataService = dataService;
        this.authService = authService;
        this.items = [];
        this.selectedItems = new Set();
        this.sortBy = 'lastModified';
        this.sortOrder = 'desc';
        this.filterText = '';
        this.viewMode = 'grid'; // 'grid' or 'list'
    }

    async render() {
        this.container.innerHTML = `
            <div class="inventory-header">
                <div class="inventory-controls">
                    <div class="search-section">
                        <div class="search-input-container">
                            <i class="ph ph-magnifying-glass search-icon"></i>
                            <input type="text" class="search-input" placeholder="Search ${this.type}..."
                                   value="${this.filterText}" id="inventorySearch">
                        </div>
                    </div>

                    <div class="view-controls">
                        <div class="sort-controls">
                            <select class="sort-select" id="sortBy">
                                <option value="lastModified">Last Modified</option>
                                <option value="name">Name</option>
                                <option value="size">Size</option>
                                <option value="created">Created</option>
                            </select>
                            <button class="sort-order-btn" id="sortOrder" title="Sort Order">
                                <i class="ph ph-arrow-down"></i>
                            </button>
                        </div>

                        <div class="view-mode-controls">
                            <button class="view-mode-btn active" data-mode="grid" title="Grid View">
                                <i class="ph ph-grid-four"></i>
                            </button>
                            <button class="view-mode-btn" data-mode="list" title="List View">
                                <i class="ph ph-list"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="action-bar">
                    <button class="primary-action-btn" id="createNew">
                        <i class="ph ph-plus"></i>
                        New ${this.getTypeName()}
                    </button>

                    <div class="bulk-actions" id="bulkActions" style="display: none;">
                        <span class="selection-count" id="selectionCount">0 selected</span>
                        <button class="bulk-action-btn" id="bulkShare">
                            <i class="ph ph-share"></i>
                            Share
                        </button>
                        <button class="bulk-action-btn" id="bulkMove">
                            <i class="ph ph-folder"></i>
                            Move
                        </button>
                        <button class="bulk-action-btn danger" id="bulkDelete">
                            <i class="ph ph-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <div class="inventory-body">
                <div class="inventory-grid" id="inventoryGrid">
                    <!-- Items will be rendered here -->
                </div>

                <div class="inventory-empty" id="inventoryEmpty" style="display: none;">
                    <div class="empty-state">
                        <i class="ph ph-${this.getEmptyIcon()}" style="font-size: 48px; opacity: 0.3;"></i>
                        <h3>No ${this.type} found</h3>
                        <p>Create your first ${this.getTypeName()} to get started.</p>
                        <button class="primary-action-btn" onclick="this.createNew()">
                            <i class="ph ph-plus"></i>
                            Create ${this.getTypeName()}
                        </button>
                    </div>
                </div>
            </div>

            <!-- CRUD Modal Container -->
            <div class="crud-modal" id="crudModal" style="display: none;">
                <div class="modal-overlay" onclick="this.closeCrudModal()"></div>
                <div class="modal-content" id="modalContent">
                    <!-- Dynamic content based on operation -->
                </div>
            </div>
        `;

        await this.loadItems();
        this.bindEvents();
        this.renderItems();
    }

    async loadItems() {
        try {
            this.items = await this.dataService.getItemsByType(this.type);
            this.applyFilters();
        } catch (error) {
            console.error(`Error loading ${this.type}:`, error);
            this.showError(`Failed to load ${this.type}`);
        }
    }

    renderItems() {
        const grid = this.container.querySelector('#inventoryGrid');
        const empty = this.container.querySelector('#inventoryEmpty');

        if (this.filteredItems.length === 0) {
            grid.style.display = 'none';
            empty.style.display = 'flex';
            return;
        }

        grid.style.display = 'grid';
        empty.style.display = 'none';

        // Apply view mode class
        grid.className = `inventory-grid ${this.viewMode}-view`;

        grid.innerHTML = this.filteredItems.map(item => this.renderItem(item)).join('');
    }

    renderItem(item) {
        const isSelected = this.selectedItems.has(item.id);

        return `
            <div class="inventory-item ${isSelected ? 'selected' : ''}" data-id="${item.id}">
                <div class="item-selector">
                    <input type="checkbox" class="item-checkbox" ${isSelected ? 'checked' : ''}
                           onchange="this.toggleSelection('${item.id}')">
                </div>

                <div class="item-icon">
                    <i class="ph ph-${this.getItemIcon(item)}"></i>
                </div>

                <div class="item-content">
                    <div class="item-header">
                        <h4 class="item-title" title="${item.name}">${item.name}</h4>
                        <div class="item-actions">
                            <button class="item-action-btn" onclick="this.editItem('${item.id}')" title="Edit">
                                <i class="ph ph-pencil"></i>
                            </button>
                            <button class="item-action-btn" onclick="this.shareItem('${item.id}')" title="Share">
                                <i class="ph ph-share"></i>
                            </button>
                            <button class="item-action-btn" onclick="this.duplicateItem('${item.id}')" title="Duplicate">
                                <i class="ph ph-copy"></i>
                            </button>
                            <button class="item-action-btn danger" onclick="this.deleteItem('${item.id}')" title="Delete">
                                <i class="ph ph-trash"></i>
                            </button>
                        </div>
                    </div>

                    <div class="item-metadata">
                        ${this.renderItemMetadata(item)}
                    </div>

                    <div class="item-description">
                        <p>${item.description || 'No description available.'}</p>
                    </div>

                    <div class="item-footer">
                        <div class="item-tags">
                            ${(item.tags || []).map(tag => `<span class="item-tag">${tag}</span>`).join('')}
                        </div>

                        <div class="item-stats">
                            <span class="item-stat">
                                <i class="ph ph-clock"></i>
                                ${this.formatDate(item.lastModified)}
                            </span>
                            ${this.renderAdditionalStats(item)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Virtual methods to be overridden by specific types
    getTypeName() {
        return this.type.charAt(0).toUpperCase() + this.type.slice(1, -1);
    }

    getEmptyIcon() {
        const icons = {
            'documents': 'file-text',
            'projects': 'folder',
            'templates': 'copy',
            'forms': 'clipboard-text',
            'reports': 'chart-bar',
            'workflows': 'flow-arrow',
            'pipelines': 'pipeline',
            'tables': 'table'
        };
        return icons[this.type] || 'file';
    }

    getItemIcon(item) {
        // Default icon based on type, can be overridden
        return this.getEmptyIcon();
    }

    renderItemMetadata(item) {
        return `
            <div class="metadata-row">
                <span class="metadata-label">Created:</span>
                <span class="metadata-value">${this.formatDate(item.created)}</span>
            </div>
            <div class="metadata-row">
                <span class="metadata-label">Size:</span>
                <span class="metadata-value">${this.formatSize(item.size)}</span>
            </div>
        `;
    }

    renderAdditionalStats(item) {
        return '';
    }

    // CRUD Operations
    async createNew() {
        this.showCrudModal('create', null);
    }

    async editItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            this.showCrudModal('edit', item);
        }
    }

    async duplicateItem(itemId) {
        try {
            const item = this.items.find(i => i.id === itemId);
            if (item) {
                const duplicatedItem = {
                    ...item,
                    id: this.generateId(),
                    name: `${item.name} (Copy)`,
                    created: new Date().toISOString(),
                    lastModified: new Date().toISOString()
                };

                await this.dataService.createItem(this.type, duplicatedItem);
                await this.loadItems();
                this.renderItems();
                this.showSuccess(`${this.getTypeName()} duplicated successfully`);
            }
        } catch (error) {
            console.error('Error duplicating item:', error);
            this.showError('Failed to duplicate item');
        }
    }

    async deleteItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;

        const confirmed = await this.showConfirmation(
            `Delete ${this.getTypeName()}`,
            `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
            'Delete',
            'danger'
        );

        if (confirmed) {
            try {
                await this.dataService.deleteItem(this.type, itemId);
                await this.loadItems();
                this.renderItems();
                this.showSuccess(`${this.getTypeName()} deleted successfully`);
            } catch (error) {
                console.error('Error deleting item:', error);
                this.showError('Failed to delete item');
            }
        }
    }

    async shareItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            this.showShareModal(item);
        }
    }

    showCrudModal(mode, item) {
        const modal = this.container.querySelector('#crudModal');
        const content = modal.querySelector('#modalContent');

        content.innerHTML = this.renderCrudForm(mode, item);
        modal.style.display = 'flex';

        // Focus first input
        setTimeout(() => {
            const firstInput = content.querySelector('input, textarea, select');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    renderCrudForm(mode, item) {
        // This will be overridden by specific component types
        return `
            <div class="modal-header">
                <h3>${mode === 'create' ? 'Create' : 'Edit'} ${this.getTypeName()}</h3>
                <button class="modal-close" onclick="this.closeCrudModal()">
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="modal-body">
                <form class="crud-form" id="crudForm">
                    <div class="form-group">
                        <label for="itemName">Name *</label>
                        <input type="text" id="itemName" name="name" required
                               value="${item?.name || ''}" placeholder="Enter ${this.getTypeName()} name">
                    </div>

                    <div class="form-group">
                        <label for="itemDescription">Description</label>
                        <textarea id="itemDescription" name="description" rows="3"
                                  placeholder="Enter description (optional)">${item?.description || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="itemTags">Tags</label>
                        <input type="text" id="itemTags" name="tags"
                               value="${(item?.tags || []).join(', ')}"
                               placeholder="Enter tags separated by commas">
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="secondary-btn" onclick="this.closeCrudModal()">
                    Cancel
                </button>
                <button type="submit" class="primary-btn" onclick="this.saveCrudForm('${mode}', '${item?.id || ''}')">
                    ${mode === 'create' ? 'Create' : 'Update'} ${this.getTypeName()}
                </button>
            </div>
        `;
    }

    async saveCrudForm(mode, itemId) {
        const form = this.container.querySelector('#crudForm');
        const formData = new FormData(form);

        try {
            const itemData = {
                name: formData.get('name'),
                description: formData.get('description'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                type: this.type.slice(0, -1), // Remove 's' from plural
                lastModified: new Date().toISOString()
            };

            if (mode === 'create') {
                itemData.id = this.generateId();
                itemData.created = new Date().toISOString();
                await this.dataService.createItem(this.type, itemData);
                this.showSuccess(`${this.getTypeName()} created successfully`);
            } else {
                itemData.id = itemId;
                await this.dataService.updateItem(this.type, itemId, itemData);
                this.showSuccess(`${this.getTypeName()} updated successfully`);
            }

            this.closeCrudModal();
            await this.loadItems();
            this.renderItems();
        } catch (error) {
            console.error(`Error saving ${this.type}:`, error);
            this.showError(`Failed to save ${this.getTypeName()}`);
        }
    }

    closeCrudModal() {
        const modal = this.container.querySelector('#crudModal');
        modal.style.display = 'none';
    }

    // Utility methods
    generateId() {
        return 'item_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    formatSize(size) {
        if (!size) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return size.toFixed(1) + ' ' + units[unitIndex];
    }

    showSuccess(message) {
        // Integrate with existing toast system
        if (window.CleansheetCore?.utils?.showToast) {
            window.CleansheetCore.utils.showToast(message, 'success');
        } else {
            console.log('SUCCESS:', message);
        }
    }

    showError(message) {
        if (window.CleansheetCore?.utils?.showToast) {
            window.CleansheetCore.utils.showToast(message, 'error');
        } else {
            console.error('ERROR:', message);
        }
    }

    async showConfirmation(title, message, actionText, actionType = 'primary') {
        return new Promise((resolve) => {
            // Simple confirmation for now, can be enhanced with modal
            const confirmed = confirm(`${title}\n\n${message}`);
            resolve(confirmed);
        });
    }
}
```

### Week 22-23: Specialized Document Type Components

#### 22.1 Rich Text Document Component
```javascript
class RichTextDocumentComponent extends InventoryComponent {
    constructor(container, dataService, authService) {
        super('documents', container, dataService, authService);
        this.editorInstance = null;
    }

    getItemIcon(item) {
        return 'file-text';
    }

    renderItemMetadata(item) {
        return `
            ${super.renderItemMetadata(item)}
            <div class="metadata-row">
                <span class="metadata-label">Word Count:</span>
                <span class="metadata-value">${item.wordCount || 0} words</span>
            </div>
        `;
    }

    renderAdditionalStats(item) {
        return `
            <span class="item-stat">
                <i class="ph ph-text-aa"></i>
                ${item.wordCount || 0}w
            </span>
            <span class="item-stat">
                <i class="ph ph-eye"></i>
                ${item.views || 0}
            </span>
        `;
    }

    renderCrudForm(mode, item) {
        return `
            <div class="modal-header">
                <h3>${mode === 'create' ? 'Create' : 'Edit'} Document</h3>
                <button class="modal-close" onclick="this.closeCrudModal()">
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="modal-body rich-text-form">
                <form class="crud-form" id="crudForm">
                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label for="itemName">Document Title *</label>
                            <input type="text" id="itemName" name="name" required
                                   value="${item?.name || ''}" placeholder="Enter document title">
                        </div>

                        <div class="form-group flex-1">
                            <label for="docTemplate">Template</label>
                            <select id="docTemplate" name="template">
                                <option value="">No Template</option>
                                <option value="memo">Memo Template</option>
                                <option value="report">Report Template</option>
                                <option value="proposal">Proposal Template</option>
                                <option value="meeting">Meeting Notes</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="itemDescription">Description</label>
                        <textarea id="itemDescription" name="description" rows="2"
                                  placeholder="Brief description of the document">${item?.description || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="richTextEditor">Content</label>
                        <div class="rich-text-toolbar">
                            <button type="button" class="toolbar-btn" onclick="this.formatText('bold')" title="Bold">
                                <i class="ph ph-text-b"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="this.formatText('italic')" title="Italic">
                                <i class="ph ph-text-italic"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="this.formatText('underline')" title="Underline">
                                <i class="ph ph-text-underline"></i>
                            </button>
                            <div class="toolbar-separator"></div>
                            <button type="button" class="toolbar-btn" onclick="this.formatText('insertOrderedList')" title="Numbered List">
                                <i class="ph ph-list-numbers"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="this.formatText('insertUnorderedList')" title="Bullet List">
                                <i class="ph ph-list-bullets"></i>
                            </button>
                            <div class="toolbar-separator"></div>
                            <button type="button" class="toolbar-btn" onclick="this.insertLink()" title="Insert Link">
                                <i class="ph ph-link"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="this.insertImage()" title="Insert Image">
                                <i class="ph ph-image"></i>
                            </button>
                        </div>
                        <div class="rich-text-editor" id="richTextEditor" contenteditable="true"
                             data-placeholder="Start writing your document content..."
                             style="min-height: 200px; border: 1px solid #e5e5e7; padding: 12px; border-radius: 6px;">
                            ${item?.content || ''}
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label for="itemTags">Tags</label>
                            <input type="text" id="itemTags" name="tags"
                                   value="${(item?.tags || []).join(', ')}"
                                   placeholder="document, draft, important">
                        </div>

                        <div class="form-group flex-1">
                            <label for="docPriority">Priority</label>
                            <select id="docPriority" name="priority">
                                <option value="low" ${item?.priority === 'low' ? 'selected' : ''}>Low</option>
                                <option value="medium" ${item?.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="high" ${item?.priority === 'high' ? 'selected' : ''}>High</option>
                                <option value="urgent" ${item?.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <div class="footer-left">
                    <span class="word-count" id="wordCount">0 words</span>
                </div>
                <div class="footer-right">
                    <button type="button" class="secondary-btn" onclick="this.saveDraft('${mode}', '${item?.id || ''}')">
                        <i class="ph ph-floppy-disk"></i>
                        Save Draft
                    </button>
                    <button type="button" class="secondary-btn" onclick="this.closeCrudModal()">
                        Cancel
                    </button>
                    <button type="submit" class="primary-btn" onclick="this.saveCrudForm('${mode}', '${item?.id || ''}')">
                        ${mode === 'create' ? 'Create' : 'Update'} Document
                    </button>
                </div>
            </div>
        `;
    }

    formatText(command) {
        document.execCommand(command, false, null);
        this.updateWordCount();
    }

    insertLink() {
        const url = prompt('Enter the URL:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    insertImage() {
        const url = prompt('Enter the image URL:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    }

    updateWordCount() {
        const editor = document.getElementById('richTextEditor');
        const counter = document.getElementById('wordCount');
        if (editor && counter) {
            const text = editor.textContent || editor.innerText || '';
            const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            counter.textContent = `${wordCount} words`;
        }
    }

    async saveDraft(mode, itemId) {
        const form = this.container.querySelector('#crudForm');
        const formData = new FormData(form);
        const editor = document.getElementById('richTextEditor');

        try {
            const itemData = {
                name: formData.get('name') + ' (Draft)',
                description: formData.get('description'),
                content: editor.innerHTML,
                template: formData.get('template'),
                priority: formData.get('priority'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                wordCount: this.getWordCount(editor),
                status: 'draft',
                type: 'rich-text',
                lastModified: new Date().toISOString()
            };

            if (mode === 'create') {
                itemData.id = this.generateId();
                itemData.created = new Date().toISOString();
                await this.dataService.createItem('documents', itemData);
                this.showSuccess('Draft saved successfully');
            } else {
                itemData.id = itemId;
                await this.dataService.updateItem('documents', itemId, itemData);
                this.showSuccess('Draft updated successfully');
            }

            await this.loadItems();
            this.renderItems();
        } catch (error) {
            console.error('Error saving draft:', error);
            this.showError('Failed to save draft');
        }
    }

    getWordCount(editor) {
        const text = editor.textContent || editor.innerText || '';
        return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    }
}
```

#### 22.2 Block Document Component
```javascript
class BlockDocumentComponent extends InventoryComponent {
    constructor(container, dataService, authService) {
        super('documents', container, dataService, authService);
    }

    getItemIcon(item) {
        return 'squares-four';
    }

    renderItemMetadata(item) {
        return `
            ${super.renderItemMetadata(item)}
            <div class="metadata-row">
                <span class="metadata-label">Blocks:</span>
                <span class="metadata-value">${item.blocks?.length || 0} blocks</span>
            </div>
        `;
    }

    renderAdditionalStats(item) {
        return `
            <span class="item-stat">
                <i class="ph ph-squares-four"></i>
                ${item.blocks?.length || 0}
            </span>
            <span class="item-stat">
                <i class="ph ph-users"></i>
                ${item.collaborators?.length || 1}
            </span>
        `;
    }

    renderCrudForm(mode, item) {
        return `
            <div class="modal-header">
                <h3>${mode === 'create' ? 'Create' : 'Edit'} Block Document</h3>
                <button class="modal-close" onclick="this.closeCrudModal()">
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="modal-body block-document-form">
                <form class="crud-form" id="crudForm">
                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label for="itemName">Document Title *</label>
                            <input type="text" id="itemName" name="name" required
                                   value="${item?.name || ''}" placeholder="Enter document title">
                        </div>

                        <div class="form-group flex-1">
                            <label for="docType">Document Type</label>
                            <select id="docType" name="docType">
                                <option value="standard">Standard Document</option>
                                <option value="specification">Technical Specification</option>
                                <option value="requirements">Requirements Document</option>
                                <option value="design">Design Document</option>
                                <option value="manual">User Manual</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="itemDescription">Description</label>
                        <textarea id="itemDescription" name="description" rows="2"
                                  placeholder="Brief description of the document">${item?.description || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Document Blocks</label>
                        <div class="blocks-container" id="blocksContainer">
                            ${this.renderBlocks(item?.blocks || [])}
                        </div>
                        <button type="button" class="add-block-btn" onclick="this.addBlock()">
                            <i class="ph ph-plus"></i>
                            Add Block
                        </button>
                    </div>

                    <div class="form-row">
                        <div class="form-group flex-1">
                            <label for="itemTags">Tags</label>
                            <input type="text" id="itemTags" name="tags"
                                   value="${(item?.tags || []).join(', ')}"
                                   placeholder="spec, documentation, technical">
                        </div>

                        <div class="form-group flex-1">
                            <label for="accessLevel">Access Level</label>
                            <select id="accessLevel" name="accessLevel">
                                <option value="public" ${item?.accessLevel === 'public' ? 'selected' : ''}>Public</option>
                                <option value="internal" ${item?.accessLevel === 'internal' ? 'selected' : ''}>Internal</option>
                                <option value="restricted" ${item?.accessLevel === 'restricted' ? 'selected' : ''}>Restricted</option>
                                <option value="confidential" ${item?.accessLevel === 'confidential' ? 'selected' : ''}>Confidential</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="secondary-btn" onclick="this.previewDocument('${mode}', '${item?.id || ''}')">
                    <i class="ph ph-eye"></i>
                    Preview
                </button>
                <button type="button" class="secondary-btn" onclick="this.closeCrudModal()">
                    Cancel
                </button>
                <button type="submit" class="primary-btn" onclick="this.saveCrudForm('${mode}', '${item?.id || ''}')">
                    ${mode === 'create' ? 'Create' : 'Update'} Document
                </button>
            </div>
        `;
    }

    renderBlocks(blocks) {
        return blocks.map((block, index) => `
            <div class="document-block" data-index="${index}">
                <div class="block-header">
                    <div class="block-handle">
                        <i class="ph ph-dots-six"></i>
                    </div>
                    <select class="block-type-select" name="blockType_${index}">
                        <option value="heading" ${block.type === 'heading' ? 'selected' : ''}>Heading</option>
                        <option value="paragraph" ${block.type === 'paragraph' ? 'selected' : ''}>Paragraph</option>
                        <option value="list" ${block.type === 'list' ? 'selected' : ''}>List</option>
                        <option value="code" ${block.type === 'code' ? 'selected' : ''}>Code Block</option>
                        <option value="image" ${block.type === 'image' ? 'selected' : ''}>Image</option>
                        <option value="table" ${block.type === 'table' ? 'selected' : ''}>Table</option>
                        <option value="callout" ${block.type === 'callout' ? 'selected' : ''}>Callout</option>
                    </select>
                    <button type="button" class="remove-block-btn" onclick="this.removeBlock(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
                <div class="block-content">
                    <textarea name="blockContent_${index}" rows="3" placeholder="Enter block content..."
                              class="block-textarea">${block.content || ''}</textarea>
                </div>
            </div>
        `).join('');
    }

    addBlock() {
        const container = document.getElementById('blocksContainer');
        const index = container.children.length;

        const blockHtml = `
            <div class="document-block" data-index="${index}">
                <div class="block-header">
                    <div class="block-handle">
                        <i class="ph ph-dots-six"></i>
                    </div>
                    <select class="block-type-select" name="blockType_${index}">
                        <option value="paragraph" selected>Paragraph</option>
                        <option value="heading">Heading</option>
                        <option value="list">List</option>
                        <option value="code">Code Block</option>
                        <option value="image">Image</option>
                        <option value="table">Table</option>
                        <option value="callout">Callout</option>
                    </select>
                    <button type="button" class="remove-block-btn" onclick="this.removeBlock(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
                <div class="block-content">
                    <textarea name="blockContent_${index}" rows="3" placeholder="Enter block content..."
                              class="block-textarea"></textarea>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', blockHtml);
    }

    removeBlock(index) {
        const block = document.querySelector(`[data-index="${index}"]`);
        if (block) {
            block.remove();
            this.reindexBlocks();
        }
    }

    reindexBlocks() {
        const blocks = document.querySelectorAll('.document-block');
        blocks.forEach((block, newIndex) => {
            block.setAttribute('data-index', newIndex);

            // Update form field names
            const typeSelect = block.querySelector('.block-type-select');
            const contentTextarea = block.querySelector('.block-textarea');
            const removeBtn = block.querySelector('.remove-block-btn');

            typeSelect.name = `blockType_${newIndex}`;
            contentTextarea.name = `blockContent_${newIndex}`;
            removeBtn.onclick = () => this.removeBlock(newIndex);
        });
    }

    previewDocument(mode, itemId) {
        // Create a preview modal showing the rendered document
        const form = this.container.querySelector('#crudForm');
        const formData = new FormData(form);

        const blocks = this.extractBlocksFromForm(formData);
        const previewHtml = this.renderDocumentPreview({
            name: formData.get('name'),
            description: formData.get('description'),
            blocks: blocks
        });

        // Show preview in a new modal
        this.showPreviewModal(previewHtml);
    }

    extractBlocksFromForm(formData) {
        const blocks = [];
        let index = 0;

        while (formData.has(`blockType_${index}`)) {
            blocks.push({
                type: formData.get(`blockType_${index}`),
                content: formData.get(`blockContent_${index}`)
            });
            index++;
        }

        return blocks;
    }

    renderDocumentPreview(doc) {
        return `
            <div class="document-preview">
                <header class="preview-header">
                    <h1>${doc.name}</h1>
                    <p class="document-description">${doc.description}</p>
                </header>

                <div class="preview-content">
                    ${doc.blocks.map(block => this.renderBlockPreview(block)).join('')}
                </div>
            </div>
        `;
    }

    renderBlockPreview(block) {
        switch (block.type) {
            case 'heading':
                return `<h2 class="preview-heading">${block.content}</h2>`;
            case 'paragraph':
                return `<p class="preview-paragraph">${block.content}</p>`;
            case 'list':
                const items = block.content.split('\n').filter(item => item.trim());
                return `<ul class="preview-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
            case 'code':
                return `<pre class="preview-code"><code>${block.content}</code></pre>`;
            case 'callout':
                return `<div class="preview-callout">${block.content}</div>`;
            default:
                return `<div class="preview-block">${block.content}</div>`;
        }
    }

    showPreviewModal(content) {
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.remove()"></div>
            <div class="modal-content preview-modal-content">
                <div class="modal-header">
                    <h3>Document Preview</h3>
                    <button class="modal-close" onclick="this.closest('.preview-modal').remove()">
                        <i class="ph ph-x"></i>
                    </button>
                </div>
                <div class="modal-body preview-modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button type="button" class="secondary-btn" onclick="this.closest('.preview-modal').remove()">
                        Close Preview
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }
}
```

#### 22.3 Additional Specialized Components

```javascript
// Table Component
class TableComponent extends InventoryComponent {
    constructor(container, dataService, authService) {
        super('tables', container, dataService, authService);
    }

    getItemIcon(item) {
        return 'table';
    }

    renderItemMetadata(item) {
        return `
            ${super.renderItemMetadata(item)}
            <div class="metadata-row">
                <span class="metadata-label">Rows:</span>
                <span class="metadata-value">${item.rows || 0}</span>
            </div>
            <div class="metadata-row">
                <span class="metadata-label">Columns:</span>
                <span class="metadata-value">${item.columns || 0}</span>
            </div>
        `;
    }

    renderCrudForm(mode, item) {
        return `
            <div class="modal-header">
                <h3>${mode === 'create' ? 'Create' : 'Edit'} Table</h3>
                <button class="modal-close" onclick="this.closeCrudModal()">
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="modal-body table-form">
                <form class="crud-form" id="crudForm">
                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label for="itemName">Table Name *</label>
                            <input type="text" id="itemName" name="name" required
                                   value="${item?.name || ''}" placeholder="Employee Directory">
                        </div>
                        <div class="form-group flex-1">
                            <label for="tableType">Table Type</label>
                            <select id="tableType" name="tableType">
                                <option value="data">Data Table</option>
                                <option value="lookup">Lookup Table</option>
                                <option value="reporting">Reporting Table</option>
                                <option value="configuration">Configuration</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="itemDescription">Description</label>
                        <textarea id="itemDescription" name="description" rows="2"
                                  placeholder="Describe the table's purpose">${item?.description || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Table Structure</label>
                        <div class="table-structure">
                            <div class="structure-row">
                                <div class="structure-label">
                                    <label for="initialRows">Initial Rows</label>
                                    <input type="number" id="initialRows" name="initialRows"
                                           value="${item?.rows || 10}" min="1" max="1000">
                                </div>
                                <div class="structure-label">
                                    <label for="initialColumns">Initial Columns</label>
                                    <input type="number" id="initialColumns" name="initialColumns"
                                           value="${item?.columns || 5}" min="1" max="50">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Column Definitions</label>
                        <div class="columns-container" id="columnsContainer">
                            ${this.renderColumnDefinitions(item?.columnDefs || [])}
                        </div>
                        <button type="button" class="add-column-btn" onclick="this.addColumn()">
                            <i class="ph ph-plus"></i>
                            Add Column
                        </button>
                    </div>

                    <div class="form-row">
                        <div class="form-group flex-1">
                            <label for="itemTags">Tags</label>
                            <input type="text" id="itemTags" name="tags"
                                   value="${(item?.tags || []).join(', ')}"
                                   placeholder="data, employee, directory">
                        </div>
                        <div class="form-group flex-1">
                            <label for="permissions">Permissions</label>
                            <select id="permissions" name="permissions">
                                <option value="read-write">Read & Write</option>
                                <option value="read-only">Read Only</option>
                                <option value="restricted">Restricted Access</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="secondary-btn" onclick="this.openTableEditor('${item?.id || ''}')">
                    <i class="ph ph-table"></i>
                    Table Editor
                </button>
                <button type="button" class="secondary-btn" onclick="this.closeCrudModal()">
                    Cancel
                </button>
                <button type="submit" class="primary-btn" onclick="this.saveCrudForm('${mode}', '${item?.id || ''}')">
                    ${mode === 'create' ? 'Create' : 'Update'} Table
                </button>
            </div>
        `;
    }

    renderColumnDefinitions(columnDefs) {
        return columnDefs.map((col, index) => `
            <div class="column-definition" data-index="${index}">
                <div class="column-row">
                    <input type="text" name="colName_${index}" placeholder="Column Name"
                           value="${col.name || ''}" style="flex: 2;">
                    <select name="colType_${index}" style="flex: 1;">
                        <option value="text" ${col.type === 'text' ? 'selected' : ''}>Text</option>
                        <option value="number" ${col.type === 'number' ? 'selected' : ''}>Number</option>
                        <option value="date" ${col.type === 'date' ? 'selected' : ''}>Date</option>
                        <option value="boolean" ${col.type === 'boolean' ? 'selected' : ''}>Boolean</option>
                        <option value="email" ${col.type === 'email' ? 'selected' : ''}>Email</option>
                    </select>
                    <button type="button" class="remove-column-btn" onclick="this.removeColumn(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    addColumn() {
        const container = document.getElementById('columnsContainer');
        const index = container.children.length;

        const columnHtml = `
            <div class="column-definition" data-index="${index}">
                <div class="column-row">
                    <input type="text" name="colName_${index}" placeholder="Column Name" style="flex: 2;">
                    <select name="colType_${index}" style="flex: 1;">
                        <option value="text" selected>Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="boolean">Boolean</option>
                        <option value="email">Email</option>
                    </select>
                    <button type="button" class="remove-column-btn" onclick="this.removeColumn(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', columnHtml);
    }

    removeColumn(index) {
        const column = document.querySelector(`[data-index="${index}"]`);
        if (column) {
            column.remove();
        }
    }

    openTableEditor(tableId) {
        // Open full table editor interface
        this.showSuccess('Table Editor opening... (Feature in development)');
    }
}

// Form Builder Component
class FormComponent extends InventoryComponent {
    constructor(container, dataService, authService) {
        super('forms', container, dataService, authService);
    }

    getItemIcon(item) {
        return 'clipboard-text';
    }

    renderItemMetadata(item) {
        return `
            ${super.renderItemMetadata(item)}
            <div class="metadata-row">
                <span class="metadata-label">Fields:</span>
                <span class="metadata-value">${item.fields || 0}</span>
            </div>
            <div class="metadata-row">
                <span class="metadata-label">Responses:</span>
                <span class="metadata-value">${item.responses || 0}</span>
            </div>
        `;
    }

    renderCrudForm(mode, item) {
        return `
            <div class="modal-header">
                <h3>${mode === 'create' ? 'Create' : 'Edit'} Form</h3>
                <button class="modal-close" onclick="this.closeCrudModal()">
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="modal-body form-builder">
                <form class="crud-form" id="crudForm">
                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label for="itemName">Form Title *</label>
                            <input type="text" id="itemName" name="name" required
                                   value="${item?.name || ''}" placeholder="Employee Onboarding Form">
                        </div>
                        <div class="form-group flex-1">
                            <label for="formType">Form Type</label>
                            <select id="formType" name="formType">
                                <option value="survey">Survey</option>
                                <option value="application">Application</option>
                                <option value="feedback">Feedback</option>
                                <option value="registration">Registration</option>
                                <option value="contact">Contact Form</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="itemDescription">Form Description</label>
                        <textarea id="itemDescription" name="description" rows="2"
                                  placeholder="Brief description shown to form users">${item?.description || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Form Fields</label>
                        <div class="form-fields-container" id="formFieldsContainer">
                            ${this.renderFormFields(item?.formFields || [])}
                        </div>
                        <div class="field-types-palette">
                            <button type="button" class="field-type-btn" onclick="this.addFormField('text')">
                                <i class="ph ph-text-aa"></i> Text
                            </button>
                            <button type="button" class="field-type-btn" onclick="this.addFormField('textarea')">
                                <i class="ph ph-text-align-left"></i> Textarea
                            </button>
                            <button type="button" class="field-type-btn" onclick="this.addFormField('select')">
                                <i class="ph ph-list"></i> Select
                            </button>
                            <button type="button" class="field-type-btn" onclick="this.addFormField('radio')">
                                <i class="ph ph-radio-button"></i> Radio
                            </button>
                            <button type="button" class="field-type-btn" onclick="this.addFormField('checkbox')">
                                <i class="ph ph-check-square"></i> Checkbox
                            </button>
                            <button type="button" class="field-type-btn" onclick="this.addFormField('date')">
                                <i class="ph ph-calendar"></i> Date
                            </button>
                            <button type="button" class="field-type-btn" onclick="this.addFormField('email')">
                                <i class="ph ph-envelope"></i> Email
                            </button>
                            <button type="button" class="field-type-btn" onclick="this.addFormField('number')">
                                <i class="ph ph-hash"></i> Number
                            </button>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group flex-1">
                            <label for="itemTags">Tags</label>
                            <input type="text" id="itemTags" name="tags"
                                   value="${(item?.tags || []).join(', ')}"
                                   placeholder="survey, onboarding, feedback">
                        </div>
                        <div class="form-group flex-1">
                            <label for="formStatus">Status</label>
                            <select id="formStatus" name="status">
                                <option value="draft" ${item?.status === 'draft' ? 'selected' : ''}>Draft</option>
                                <option value="active" ${item?.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="closed" ${item?.status === 'closed' ? 'selected' : ''}>Closed</option>
                                <option value="archived" ${item?.status === 'archived' ? 'selected' : ''}>Archived</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="secondary-btn" onclick="this.previewForm('${item?.id || ''}')">
                    <i class="ph ph-eye"></i>
                    Preview Form
                </button>
                <button type="button" class="secondary-btn" onclick="this.closeCrudModal()">
                    Cancel
                </button>
                <button type="submit" class="primary-btn" onclick="this.saveCrudForm('${mode}', '${item?.id || ''}')">
                    ${mode === 'create' ? 'Create' : 'Update'} Form
                </button>
            </div>
        `;
    }

    renderFormFields(formFields) {
        return formFields.map((field, index) => `
            <div class="form-field-definition" data-index="${index}" data-type="${field.type}">
                <div class="field-header">
                    <div class="field-icon">
                        <i class="ph ph-${this.getFieldIcon(field.type)}"></i>
                    </div>
                    <div class="field-details">
                        <input type="text" name="fieldLabel_${index}" value="${field.label || ''}"
                               placeholder="Field Label" class="field-label-input">
                        <div class="field-settings">
                            <label>
                                <input type="checkbox" name="fieldRequired_${index}"
                                       ${field.required ? 'checked' : ''}> Required
                            </label>
                        </div>
                    </div>
                    <button type="button" class="remove-field-btn" onclick="this.removeFormField(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
                ${this.renderFieldOptions(field, index)}
            </div>
        `).join('');
    }

    getFieldIcon(type) {
        const icons = {
            'text': 'text-aa',
            'textarea': 'text-align-left',
            'select': 'list',
            'radio': 'radio-button',
            'checkbox': 'check-square',
            'date': 'calendar',
            'email': 'envelope',
            'number': 'hash'
        };
        return icons[type] || 'text-aa';
    }

    renderFieldOptions(field, index) {
        if (field.type === 'select' || field.type === 'radio') {
            return `
                <div class="field-options">
                    <label>Options (one per line):</label>
                    <textarea name="fieldOptions_${index}" rows="3"
                              placeholder="Option 1\nOption 2\nOption 3">${(field.options || []).join('\n')}</textarea>
                </div>
            `;
        }
        return '';
    }

    addFormField(type) {
        const container = document.getElementById('formFieldsContainer');
        const index = container.children.length;

        const fieldHtml = `
            <div class="form-field-definition" data-index="${index}" data-type="${type}">
                <div class="field-header">
                    <div class="field-icon">
                        <i class="ph ph-${this.getFieldIcon(type)}"></i>
                    </div>
                    <div class="field-details">
                        <input type="text" name="fieldLabel_${index}" value=""
                               placeholder="Field Label" class="field-label-input">
                        <div class="field-settings">
                            <label>
                                <input type="checkbox" name="fieldRequired_${index}"> Required
                            </label>
                        </div>
                    </div>
                    <button type="button" class="remove-field-btn" onclick="this.removeFormField(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
                ${this.renderFieldOptions({type: type, options: []}, index)}
            </div>
        `;

        container.insertAdjacentHTML('beforeend', fieldHtml);
    }

    removeFormField(index) {
        const field = document.querySelector(`[data-index="${index}"]`);
        if (field) {
            field.remove();
        }
    }

    previewForm(formId) {
        this.showSuccess('Form Preview opening... (Feature in development)');
    }
}

// Report Generator Component
class ReportComponent extends InventoryComponent {
    constructor(container, dataService, authService) {
        super('reports', container, dataService, authService);
    }

    getItemIcon(item) {
        return 'chart-bar';
    }

    renderItemMetadata(item) {
        return `
            ${super.renderItemMetadata(item)}
            <div class="metadata-row">
                <span class="metadata-label">Charts:</span>
                <span class="metadata-value">${item.charts || 0}</span>
            </div>
            <div class="metadata-row">
                <span class="metadata-label">Pages:</span>
                <span class="metadata-value">${item.pages || 1}</span>
            </div>
        `;
    }

    renderCrudForm(mode, item) {
        return `
            <div class="modal-header">
                <h3>${mode === 'create' ? 'Create' : 'Edit'} Report</h3>
                <button class="modal-close" onclick="this.closeCrudModal()">
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="modal-body report-builder">
                <form class="crud-form" id="crudForm">
                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label for="itemName">Report Title *</label>
                            <input type="text" id="itemName" name="name" required
                                   value="${item?.name || ''}" placeholder="Monthly Performance Report">
                        </div>
                        <div class="form-group flex-1">
                            <label for="reportType">Report Type</label>
                            <select id="reportType" name="reportType">
                                <option value="dashboard">Dashboard</option>
                                <option value="analytical">Analytical</option>
                                <option value="operational">Operational</option>
                                <option value="compliance">Compliance</option>
                                <option value="financial">Financial</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="itemDescription">Report Description</label>
                        <textarea id="itemDescription" name="description" rows="2"
                                  placeholder="What insights does this report provide?">${item?.description || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Data Sources</label>
                        <div class="data-sources-container" id="dataSourcesContainer">
                            ${this.renderDataSources(item?.dataSources || [])}
                        </div>
                        <button type="button" class="add-source-btn" onclick="this.addDataSource()">
                            <i class="ph ph-plus"></i>
                            Add Data Source
                        </button>
                    </div>

                    <div class="form-group">
                        <label>Report Sections</label>
                        <div class="report-sections-container" id="reportSectionsContainer">
                            ${this.renderReportSections(item?.sections || [])}
                        </div>
                        <div class="section-types-palette">
                            <button type="button" class="section-type-btn" onclick="this.addReportSection('chart')">
                                <i class="ph ph-chart-bar"></i> Chart
                            </button>
                            <button type="button" class="section-type-btn" onclick="this.addReportSection('table')">
                                <i class="ph ph-table"></i> Table
                            </button>
                            <button type="button" class="section-type-btn" onclick="this.addReportSection('text')">
                                <i class="ph ph-text-aa"></i> Text
                            </button>
                            <button type="button" class="section-type-btn" onclick="this.addReportSection('metric')">
                                <i class="ph ph-hash"></i> Metric
                            </button>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group flex-1">
                            <label for="itemTags">Tags</label>
                            <input type="text" id="itemTags" name="tags"
                                   value="${(item?.tags || []).join(', ')}"
                                   placeholder="performance, monthly, kpi">
                        </div>
                        <div class="form-group flex-1">
                            <label for="refreshFrequency">Refresh Frequency</label>
                            <select id="refreshFrequency" name="refreshFrequency">
                                <option value="manual">Manual</option>
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="secondary-btn" onclick="this.previewReport('${item?.id || ''}')">
                    <i class="ph ph-eye"></i>
                    Preview Report
                </button>
                <button type="button" class="secondary-btn" onclick="this.closeCrudModal()">
                    Cancel
                </button>
                <button type="submit" class="primary-btn" onclick="this.saveCrudForm('${mode}', '${item?.id || ''}')">
                    ${mode === 'create' ? 'Create' : 'Update'} Report
                </button>
            </div>
        `;
    }

    renderDataSources(dataSources) {
        return dataSources.map((source, index) => `
            <div class="data-source" data-index="${index}">
                <div class="source-row">
                    <select name="sourceType_${index}" style="flex: 1;">
                        <option value="table" ${source.type === 'table' ? 'selected' : ''}>Table</option>
                        <option value="api" ${source.type === 'api' ? 'selected' : ''}>API</option>
                        <option value="file" ${source.type === 'file' ? 'selected' : ''}>File</option>
                        <option value="form" ${source.type === 'form' ? 'selected' : ''}>Form Responses</option>
                    </select>
                    <input type="text" name="sourceName_${index}" placeholder="Source Name"
                           value="${source.name || ''}" style="flex: 2;">
                    <button type="button" class="remove-source-btn" onclick="this.removeDataSource(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderReportSections(sections) {
        return sections.map((section, index) => `
            <div class="report-section" data-index="${index}" data-type="${section.type}">
                <div class="section-header">
                    <i class="ph ph-${this.getSectionIcon(section.type)}"></i>
                    <input type="text" name="sectionTitle_${index}" value="${section.title || ''}"
                           placeholder="Section Title" class="section-title-input">
                    <button type="button" class="remove-section-btn" onclick="this.removeReportSection(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
                <div class="section-config">
                    ${this.renderSectionConfig(section, index)}
                </div>
            </div>
        `).join('');
    }

    getSectionIcon(type) {
        const icons = {
            'chart': 'chart-bar',
            'table': 'table',
            'text': 'text-aa',
            'metric': 'hash'
        };
        return icons[type] || 'square';
    }

    renderSectionConfig(section, index) {
        switch (section.type) {
            case 'chart':
                return `
                    <select name="chartType_${index}">
                        <option value="bar" ${section.chartType === 'bar' ? 'selected' : ''}>Bar Chart</option>
                        <option value="line" ${section.chartType === 'line' ? 'selected' : ''}>Line Chart</option>
                        <option value="pie" ${section.chartType === 'pie' ? 'selected' : ''}>Pie Chart</option>
                        <option value="scatter" ${section.chartType === 'scatter' ? 'selected' : ''}>Scatter Plot</option>
                    </select>
                `;
            case 'table':
                return `<input type="text" name="tableColumns_${index}" value="${section.columns || ''}" placeholder="Column names (comma-separated)">`;
            case 'metric':
                return `<input type="text" name="metricFormula_${index}" value="${section.formula || ''}" placeholder="Calculation formula">`;
            default:
                return `<textarea name="sectionContent_${index}" rows="2" placeholder="Section content">${section.content || ''}</textarea>`;
        }
    }

    addDataSource() {
        const container = document.getElementById('dataSourcesContainer');
        const index = container.children.length;

        const sourceHtml = `
            <div class="data-source" data-index="${index}">
                <div class="source-row">
                    <select name="sourceType_${index}" style="flex: 1;">
                        <option value="table">Table</option>
                        <option value="api">API</option>
                        <option value="file">File</option>
                        <option value="form">Form Responses</option>
                    </select>
                    <input type="text" name="sourceName_${index}" placeholder="Source Name" style="flex: 2;">
                    <button type="button" class="remove-source-btn" onclick="this.removeDataSource(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', sourceHtml);
    }

    removeDataSource(index) {
        const source = document.querySelector(`[data-index="${index}"]`);
        if (source) {
            source.remove();
        }
    }

    addReportSection(type) {
        const container = document.getElementById('reportSectionsContainer');
        const index = container.children.length;

        const sectionHtml = `
            <div class="report-section" data-index="${index}" data-type="${type}">
                <div class="section-header">
                    <i class="ph ph-${this.getSectionIcon(type)}"></i>
                    <input type="text" name="sectionTitle_${index}" value=""
                           placeholder="Section Title" class="section-title-input">
                    <button type="button" class="remove-section-btn" onclick="this.removeReportSection(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
                <div class="section-config">
                    ${this.renderSectionConfig({type: type}, index)}
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', sectionHtml);
    }

    removeReportSection(index) {
        const section = document.querySelector(`[data-index="${index}"]`);
        if (section) {
            section.remove();
        }
    }

    previewReport(reportId) {
        this.showSuccess('Report Preview opening... (Feature in development)');
    }
}

// Workflow Designer Component
class WorkflowComponent extends InventoryComponent {
    constructor(container, dataService, authService) {
        super('workflows', container, dataService, authService);
    }

    getItemIcon(item) {
        return 'flow-arrow';
    }

    renderItemMetadata(item) {
        return `
            ${super.renderItemMetadata(item)}
            <div class="metadata-row">
                <span class="metadata-label">Steps:</span>
                <span class="metadata-value">${item.steps || 0}</span>
            </div>
            <div class="metadata-row">
                <span class="metadata-label">Status:</span>
                <span class="metadata-value">${item.active ? 'Active' : 'Inactive'}</span>
            </div>
        `;
    }

    renderCrudForm(mode, item) {
        return `
            <div class="modal-header">
                <h3>${mode === 'create' ? 'Create' : 'Edit'} Workflow</h3>
                <button class="modal-close" onclick="this.closeCrudModal()">
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="modal-body workflow-builder">
                <form class="crud-form" id="crudForm">
                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label for="itemName">Workflow Name *</label>
                            <input type="text" id="itemName" name="name" required
                                   value="${item?.name || ''}" placeholder="Content Approval Workflow">
                        </div>
                        <div class="form-group flex-1">
                            <label for="workflowType">Workflow Type</label>
                            <select id="workflowType" name="workflowType">
                                <option value="approval">Approval</option>
                                <option value="review">Review</option>
                                <option value="processing">Processing</option>
                                <option value="notification">Notification</option>
                                <option value="automation">Automation</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="itemDescription">Workflow Description</label>
                        <textarea id="itemDescription" name="description" rows="2"
                                  placeholder="Describe what this workflow accomplishes">${item?.description || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label>Workflow Steps</label>
                        <div class="workflow-steps-container" id="workflowStepsContainer">
                            ${this.renderWorkflowSteps(item?.workflowSteps || [])}
                        </div>
                        <button type="button" class="add-step-btn" onclick="this.addWorkflowStep()">
                            <i class="ph ph-plus"></i>
                            Add Step
                        </button>
                    </div>

                    <div class="form-group">
                        <label>Triggers</label>
                        <div class="triggers-container">
                            <div class="trigger-row">
                                <select name="triggerType" style="flex: 1;">
                                    <option value="manual">Manual Start</option>
                                    <option value="document">Document Created</option>
                                    <option value="form">Form Submitted</option>
                                    <option value="schedule">Scheduled</option>
                                    <option value="api">API Call</option>
                                </select>
                                <input type="text" name="triggerCondition" placeholder="Trigger condition"
                                       value="${item?.triggerCondition || ''}" style="flex: 2;">
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group flex-1">
                            <label for="itemTags">Tags</label>
                            <input type="text" id="itemTags" name="tags"
                                   value="${(item?.tags || []).join(', ')}"
                                   placeholder="approval, content, review">
                        </div>
                        <div class="form-group flex-1">
                            <label for="workflowStatus">Status</label>
                            <select id="workflowStatus" name="active">
                                <option value="true" ${item?.active ? 'selected' : ''}>Active</option>
                                <option value="false" ${!item?.active ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="secondary-btn" onclick="this.testWorkflow('${item?.id || ''}')">
                    <i class="ph ph-play"></i>
                    Test Workflow
                </button>
                <button type="button" class="secondary-btn" onclick="this.closeCrudModal()">
                    Cancel
                </button>
                <button type="submit" class="primary-btn" onclick="this.saveCrudForm('${mode}', '${item?.id || ''}')">
                    ${mode === 'create' ? 'Create' : 'Update'} Workflow
                </button>
            </div>
        `;
    }

    renderWorkflowSteps(steps) {
        return steps.map((step, index) => `
            <div class="workflow-step" data-index="${index}">
                <div class="step-header">
                    <div class="step-number">${index + 1}</div>
                    <input type="text" name="stepName_${index}" value="${step.name || ''}"
                           placeholder="Step Name" class="step-name-input">
                    <select name="stepType_${index}" class="step-type-select">
                        <option value="approval" ${step.type === 'approval' ? 'selected' : ''}>Approval</option>
                        <option value="review" ${step.type === 'review' ? 'selected' : ''}>Review</option>
                        <option value="notification" ${step.type === 'notification' ? 'selected' : ''}>Notification</option>
                        <option value="action" ${step.type === 'action' ? 'selected' : ''}>Action</option>
                        <option value="condition" ${step.type === 'condition' ? 'selected' : ''}>Condition</option>
                    </select>
                    <button type="button" class="remove-step-btn" onclick="this.removeWorkflowStep(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
                <div class="step-config">
                    <textarea name="stepConfig_${index}" rows="2" placeholder="Step configuration...">${step.config || ''}</textarea>
                </div>
            </div>
        `).join('');
    }

    addWorkflowStep() {
        const container = document.getElementById('workflowStepsContainer');
        const index = container.children.length;

        const stepHtml = `
            <div class="workflow-step" data-index="${index}">
                <div class="step-header">
                    <div class="step-number">${index + 1}</div>
                    <input type="text" name="stepName_${index}" value=""
                           placeholder="Step Name" class="step-name-input">
                    <select name="stepType_${index}" class="step-type-select">
                        <option value="approval">Approval</option>
                        <option value="review">Review</option>
                        <option value="notification">Notification</option>
                        <option value="action">Action</option>
                        <option value="condition">Condition</option>
                    </select>
                    <button type="button" class="remove-step-btn" onclick="this.removeWorkflowStep(${index})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
                <div class="step-config">
                    <textarea name="stepConfig_${index}" rows="2" placeholder="Step configuration..."></textarea>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', stepHtml);
    }

    removeWorkflowStep(index) {
        const step = document.querySelector(`[data-index="${index}"]`);
        if (step) {
            step.remove();
            this.renumberSteps();
        }
    }

    renumberSteps() {
        const steps = document.querySelectorAll('.workflow-step');
        steps.forEach((step, index) => {
            step.setAttribute('data-index', index);
            step.querySelector('.step-number').textContent = index + 1;
        });
    }

    testWorkflow(workflowId) {
        this.showSuccess('Workflow test starting... (Feature in development)');
    }
}
```

**Deliverable**: Complete inventory management system with CRUD operations for multiple document types
**Test Criteria**:
- [ ] All document types (rich text, block, forms, reports, etc.) have functional CRUD interfaces
- [ ] Create, edit, duplicate, and delete operations work correctly
- [ ] Bulk operations (select multiple, bulk delete/share/move) function properly
- [ ] Search and filtering work across all inventory types
- [ ] Form validation prevents invalid data entry
- [ ] Preview functionality shows accurate document rendering
- [ ] Specialized components (tables, forms, reports, workflows) have type-specific features
- [ ] Form builders include drag-and-drop field creation
- [ ] Report builders support multiple chart types and data sources
- [ ] Workflow designer allows step-by-step process creation

---

## Phase 8: Integration & Production Readiness (Weeks 24-26)
*Complete system integration with authentication, sharing, and real-time collaboration*

### Week 24: Component Integration & Navigation

#### 24.1 Canvas Component Manager
```javascript
// Professional Canvas Manager - Orchestrates all components
class ProfessionalCanvasManager {
    constructor() {
        this.authService = new AuthService();
        this.dataService = new DataService('api'); // Production API backend
        this.treemap = null;
        this.mobileNavManager = null;
        this.activeInventoryComponent = null;
        this.componentRegistry = new Map();
        this.currentUser = null;
        this.isMobileView = false;

        this.initializeComponents();
        this.bindEvents();
        this.setupResponsiveHandling();
    }

    async initialize() {
        // Initialize authentication
        this.currentUser = await this.authService.checkAuthState();
        if (!this.currentUser) {
            this.showLoginModal();
            return;
        }

        // Setup user interface
        this.setupUserProfile();

        // Load workspace data
        const workspaceData = await this.loadWorkspaceData();

        // Initialize navigation based on screen size
        this.initializeNavigation(workspaceData);

        // Setup component registry
        this.registerComponents();

        // Initialize default view
        this.showWorkspaceView();
    }

    initializeNavigation(workspaceData) {
        this.isMobileView = MobileNavigationManager.shouldUseMobileNavigation();

        if (this.isMobileView) {
            // Initialize mobile navigation
            this.mobileNavManager = new MobileNavigationManager(this.dataService, this.authService);
            this.mobileNavManager.initialize(workspaceData);

            // Set global reference for mobile navigation
            window.mobileNavManager = this.mobileNavManager;
        } else {
            // Initialize desktop treemap
            this.treemap = new ProfessionalTreemap('professionalTreemap', workspaceData);
        }
    }

    setupResponsiveHandling() {
        // Handle responsive view changes
        window.addEventListener('resize', () => {
            const isMobile = MobileNavigationManager.shouldUseMobileNavigation();

            if (isMobile !== this.isMobileView) {
                this.isMobileView = isMobile;

                // Switch between mobile and desktop navigation
                if (isMobile && !this.mobileNavManager) {
                    this.initializeMobileNavigation();
                } else if (!isMobile && !this.treemap) {
                    this.initializeDesktopNavigation();
                }

                // Update body classes
                document.body.classList.toggle('mobile-view', isMobile);
                document.body.classList.toggle('desktop-view', !isMobile);

                // Close any open modals/slideouts during transition
                this.closeAllModals();
            }
        });

        // Set initial body classes
        document.body.classList.toggle('mobile-view', this.isMobileView);
        document.body.classList.toggle('desktop-view', !this.isMobileView);
    }

    async initializeMobileNavigation() {
        if (this.mobileNavManager) return;

        const workspaceData = await this.loadWorkspaceData();
        this.mobileNavManager = new MobileNavigationManager(this.dataService, this.authService);
        this.mobileNavManager.initialize(workspaceData);
        window.mobileNavManager = this.mobileNavManager;
    }

    async initializeDesktopNavigation() {
        if (this.treemap) return;

        const workspaceData = await this.loadWorkspaceData();
        this.treemap = new ProfessionalTreemap('professionalTreemap', workspaceData);
    }

    closeAllModals() {
        // Close inventory slideout
        const slideout = document.getElementById('inventorySlideout');
        if (slideout) {
            slideout.classList.remove('active');
        }

        // Close mobile nav dropdown
        const dropdown = document.getElementById('mobileNavDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }

        // Close any other modals
        document.querySelectorAll('.modal, .advanced-sharing-modal, .import-modal').forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }

    initializeComponents() {
        // Register all component types
        this.componentRegistry.set('documents', {
            'rich-text': RichTextDocumentComponent,
            'block': BlockDocumentComponent
        });
        this.componentRegistry.set('tables', TableComponent);
        this.componentRegistry.set('forms', FormComponent);
        this.componentRegistry.set('reports', ReportComponent);
        this.componentRegistry.set('workflows', WorkflowComponent);
        this.componentRegistry.set('pipelines', PipelineComponent);
        this.componentRegistry.set('templates', TemplateComponent);
    }

    async loadWorkspaceData() {
        try {
            const userId = this.currentUser.id;
            return await this.dataService.getUserWorkspace(userId);
        } catch (error) {
            console.error('Error loading workspace:', error);
            return this.getDefaultWorkspaceData();
        }
    }

    getDefaultWorkspaceData() {
        // Return sample data structure for new users
        return {
            name: `${this.currentUser.firstName}'s Workspace`,
            id: `workspace-${this.currentUser.id}`,
            type: "workspace",
            children: [
                {
                    name: "Documents",
                    id: "documents",
                    type: "documents",
                    size: 0,
                    children: []
                },
                {
                    name: "Projects",
                    id: "projects",
                    type: "projects",
                    size: 0,
                    children: []
                }
            ]
        };
    }

    setupUserProfile() {
        const userProfileComponent = new UserProfileComponent(this.authService);
        const profileContainer = document.getElementById('userProfileDropdown');
        profileContainer.innerHTML = userProfileComponent.render(this.currentUser);
    }

    showInventoryComponent(type, items, subtype = null) {
        const slideoutBody = document.getElementById('slideoutBody');

        // Determine component class
        let ComponentClass;
        if (subtype && this.componentRegistry.has(type) &&
            typeof this.componentRegistry.get(type) === 'object') {
            ComponentClass = this.componentRegistry.get(type)[subtype];
        } else {
            ComponentClass = this.componentRegistry.get(type);
        }

        if (!ComponentClass) {
            console.error(`No component registered for type: ${type}, subtype: ${subtype}`);
            return;
        }

        // Clean up existing component
        if (this.activeInventoryComponent) {
            this.activeInventoryComponent = null;
        }

        // Create and render new component
        this.activeInventoryComponent = new ComponentClass(
            slideoutBody,
            this.dataService,
            this.authService
        );

        this.activeInventoryComponent.render();
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Authentication state changes
        this.authService.onAuthStateChange((event, user) => {
            if (event === 'logout') {
                this.handleLogout();
            } else if (event === 'login') {
                this.currentUser = user;
                this.initialize();
            }
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.showQuickCreateModal();
                        break;
                    case 'k':
                        e.preventDefault();
                        this.showGlobalSearch();
                        break;
                    case '/':
                        e.preventDefault();
                        this.showCommandPalette();
                        break;
                }
            }
        });

        // Window events
        window.addEventListener('beforeunload', (e) => {
            // Save any pending changes
            if (this.activeInventoryComponent?.hasUnsavedChanges?.()) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        });
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content based on tab
        switch (tabName) {
            case 'workspace':
                this.showWorkspaceView();
                break;
            case 'documents':
                this.showDocumentsView();
                break;
            case 'projects':
                this.showProjectsView();
                break;
            case 'templates':
                this.showTemplatesView();
                break;
            case 'workflows':
                this.showWorkflowsView();
                break;
            default:
                this.showWorkspaceView();
        }
    }

    showWorkspaceView() {
        const widgetsContainer = document.getElementById('canvasWidgets');
        widgetsContainer.innerHTML = `
            <div class="workspace-overview">
                <div class="overview-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="ph ph-file-text"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.getDocumentCount()}</div>
                            <div class="stat-label">Documents</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="ph ph-folder"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.getProjectCount()}</div>
                            <div class="stat-label">Projects</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="ph ph-users"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.getCollaboratorCount()}</div>
                            <div class="stat-label">Collaborators</div>
                        </div>
                    </div>
                </div>

                <div class="recent-activity">
                    <h3>Recent Activity</h3>
                    <div class="activity-list" id="activityList">
                        <!-- Activity items will be loaded here -->
                    </div>
                </div>

                <div class="quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-buttons">
                        <button class="quick-action-btn" onclick="canvasManager.createNewDocument()">
                            <i class="ph ph-file-plus"></i>
                            New Document
                        </button>
                        <button class="quick-action-btn" onclick="canvasManager.createNewProject()">
                            <i class="ph ph-folder-plus"></i>
                            New Project
                        </button>
                        <button class="quick-action-btn" onclick="canvasManager.showTemplateLibrary()">
                            <i class="ph ph-copy"></i>
                            Browse Templates
                        </button>
                        <button class="quick-action-btn" onclick="canvasManager.importData()">
                            <i class="ph ph-upload"></i>
                            Import Data
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.loadRecentActivity();
    }

    async loadRecentActivity() {
        try {
            const activities = await this.dataService.getRecentActivity(this.currentUser.id, 10);
            const activityList = document.getElementById('activityList');

            if (activities.length === 0) {
                activityList.innerHTML = `
                    <div class="no-activity">
                        <i class="ph ph-clock"></i>
                        <p>No recent activity</p>
                    </div>
                `;
                return;
            }

            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="ph ph-${this.getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-description">${activity.description}</div>
                        <div class="activity-time">${this.formatRelativeTime(activity.timestamp)}</div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    getActivityIcon(type) {
        const icons = {
            'document_created': 'file-plus',
            'document_updated': 'pencil',
            'document_shared': 'share',
            'project_created': 'folder-plus',
            'form_submitted': 'clipboard-text',
            'report_generated': 'chart-bar'
        };
        return icons[type] || 'clock';
    }

    formatRelativeTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        return time.toLocaleDateString();
    }

    // Statistics methods
    getDocumentCount() {
        return this.treemap?.data?.children?.find(c => c.type === 'documents')?.size || 0;
    }

    getProjectCount() {
        return this.treemap?.data?.children?.find(c => c.type === 'projects')?.size || 0;
    }

    getCollaboratorCount() {
        // This would be calculated from shared documents and projects
        return 3; // Placeholder
    }

    // Quick action methods
    async createNewDocument() {
        this.showInventoryComponent('documents', [], 'rich-text');
        document.getElementById('inventorySlideout').classList.add('active');
        // Trigger create new action
        setTimeout(() => {
            if (this.activeInventoryComponent?.createNew) {
                this.activeInventoryComponent.createNew();
            }
        }, 300);
    }

    async createNewProject() {
        this.showInventoryComponent('projects', []);
        document.getElementById('inventorySlideout').classList.add('active');
        setTimeout(() => {
            if (this.activeInventoryComponent?.createNew) {
                this.activeInventoryComponent.createNew();
            }
        }, 300);
    }

    showTemplateLibrary() {
        this.switchTab('templates');
        this.showInventoryComponent('templates', []);
        document.getElementById('inventorySlideout').classList.add('active');
    }

    importData() {
        // Show import dialog
        this.showImportDialog();
    }

    showImportDialog() {
        const modal = document.createElement('div');
        modal.className = 'import-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Import Data</h3>
                    <button class="modal-close" onclick="this.closest('.import-modal').remove()">
                        <i class="ph ph-x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="import-options">
                        <div class="import-option" onclick="this.selectImportType('csv')">
                            <i class="ph ph-file-csv"></i>
                            <h4>CSV/Excel Files</h4>
                            <p>Import tabular data from spreadsheets</p>
                        </div>
                        <div class="import-option" onclick="this.selectImportType('json')">
                            <i class="ph ph-file-text"></i>
                            <h4>JSON Data</h4>
                            <p>Import structured data from JSON files</p>
                        </div>
                        <div class="import-option" onclick="this.selectImportType('documents')">
                            <i class="ph ph-folder"></i>
                            <h4>Document Folder</h4>
                            <p>Bulk import documents from a folder</p>
                        </div>
                        <div class="import-option" onclick="this.selectImportType('api')">
                            <i class="ph ph-cloud-arrow-down"></i>
                            <h4>External API</h4>
                            <p>Connect to external data sources</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    handleLogout() {
        // Clear workspace data
        this.treemap = null;
        this.activeInventoryComponent = null;
        this.currentUser = null;

        // Clear sensitive data from memory
        if (this.dataService.clearCache) {
            this.dataService.clearCache();
        }

        // Redirect to login
        this.showLoginModal();
    }

    showLoginModal() {
        const loginComponent = new LoginComponent(this.authService);
        loginComponent.show();
    }

    showQuickCreateModal() {
        // Implementation for Ctrl+N quick create
        this.showSuccess('Quick Create (Ctrl+N) - Feature in development');
    }

    showGlobalSearch() {
        // Implementation for Ctrl+K global search
        this.showSuccess('Global Search (Ctrl+K) - Feature in development');
    }

    showCommandPalette() {
        // Implementation for Ctrl+/ command palette
        this.showSuccess('Command Palette (Ctrl+/) - Feature in development');
    }

    showSuccess(message) {
        if (window.CleansheetCore?.utils?.showToast) {
            window.CleansheetCore.utils.showToast(message, 'success');
        } else {
            console.log('SUCCESS:', message);
        }
    }
}

// Initialize the canvas when the page loads
let canvasManager;
document.addEventListener('DOMContentLoaded', async () => {
    canvasManager = new ProfessionalCanvasManager();
    await canvasManager.initialize();
});
```

### Week 25: Real-time Collaboration & Sharing

#### 25.1 Real-time Collaboration System
```javascript
// Real-time Collaboration Manager
class CollaborationManager {
    constructor(authService, dataService) {
        this.authService = authService;
        this.dataService = dataService;
        this.websocket = null;
        this.activeCollaborators = new Map();
        this.documentSubscriptions = new Set();

        this.initializeWebSocket();
    }

    initializeWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/collaboration`;

        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = () => {
            console.log('Collaboration WebSocket connected');
            this.authenticateConnection();
        };

        this.websocket.onmessage = (event) => {
            this.handleWebSocketMessage(JSON.parse(event.data));
        };

        this.websocket.onclose = () => {
            console.log('Collaboration WebSocket disconnected, attempting reconnect...');
            setTimeout(() => this.initializeWebSocket(), 5000);
        };

        this.websocket.onerror = (error) => {
            console.error('Collaboration WebSocket error:', error);
        };
    }

    authenticateConnection() {
        const message = {
            type: 'auth',
            token: this.authService.getAccessToken(),
            userId: this.authService.getCurrentUser()?.id
        };
        this.send(message);
    }

    subscribeToDocument(documentId) {
        if (this.documentSubscriptions.has(documentId)) return;

        this.documentSubscriptions.add(documentId);

        const message = {
            type: 'subscribe',
            documentId: documentId
        };
        this.send(message);
    }

    unsubscribeFromDocument(documentId) {
        if (!this.documentSubscriptions.has(documentId)) return;

        this.documentSubscriptions.delete(documentId);

        const message = {
            type: 'unsubscribe',
            documentId: documentId
        };
        this.send(message);
    }

    sendDocumentChange(documentId, change) {
        const message = {
            type: 'document_change',
            documentId: documentId,
            change: change,
            timestamp: new Date().toISOString()
        };
        this.send(message);
    }

    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'user_joined':
                this.handleUserJoined(message);
                break;
            case 'user_left':
                this.handleUserLeft(message);
                break;
            case 'document_change':
                this.handleDocumentChange(message);
                break;
            case 'cursor_move':
                this.handleCursorMove(message);
                break;
            case 'document_locked':
                this.handleDocumentLocked(message);
                break;
            case 'document_unlocked':
                this.handleDocumentUnlocked(message);
                break;
        }
    }

    handleUserJoined(message) {
        const { userId, documentId, userInfo } = message;

        if (!this.activeCollaborators.has(documentId)) {
            this.activeCollaborators.set(documentId, new Map());
        }

        this.activeCollaborators.get(documentId).set(userId, {
            ...userInfo,
            joinedAt: new Date().toISOString(),
            isActive: true
        });

        this.showCollaboratorNotification(`${userInfo.name} joined the document`, 'info');
        this.updateCollaboratorIndicators(documentId);
    }

    handleUserLeft(message) {
        const { userId, documentId } = message;

        const docCollaborators = this.activeCollaborators.get(documentId);
        if (docCollaborators && docCollaborators.has(userId)) {
            const user = docCollaborators.get(userId);
            this.showCollaboratorNotification(`${user.name} left the document`, 'info');
            docCollaborators.delete(userId);
            this.updateCollaboratorIndicators(documentId);
        }
    }

    handleDocumentChange(message) {
        const { documentId, change, userId } = message;

        // Don't process our own changes
        if (userId === this.authService.getCurrentUser()?.id) return;

        // Apply the change to the document
        this.applyDocumentChange(documentId, change);

        // Show change indicator
        this.showChangeNotification(change);
    }

    applyDocumentChange(documentId, change) {
        // Find the active editor for this document
        const activeEditor = document.querySelector(`[data-document-id="${documentId}"]`);
        if (!activeEditor) return;

        // Apply change based on change type
        switch (change.type) {
            case 'text_insert':
                this.applyTextInsert(activeEditor, change);
                break;
            case 'text_delete':
                this.applyTextDelete(activeEditor, change);
                break;
            case 'block_add':
                this.applyBlockAdd(activeEditor, change);
                break;
            case 'block_remove':
                this.applyBlockRemove(activeEditor, change);
                break;
            case 'attribute_change':
                this.applyAttributeChange(activeEditor, change);
                break;
        }
    }

    updateCollaboratorIndicators(documentId) {
        const collaborators = this.activeCollaborators.get(documentId);
        if (!collaborators) return;

        const indicatorContainer = document.querySelector('.collaborator-indicators');
        if (!indicatorContainer) return;

        indicatorContainer.innerHTML = Array.from(collaborators.values()).map(user => `
            <div class="collaborator-indicator" title="${user.name}">
                <div class="collaborator-avatar" style="background-color: ${user.color}">
                    ${user.initials}
                </div>
                <div class="collaborator-cursor" data-user-id="${user.id}"></div>
            </div>
        `).join('');
    }

    showCollaboratorNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `collaboration-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="ph ph-users"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showChangeNotification(change) {
        const changeType = change.type.replace('_', ' ');
        const userName = change.userName || 'Someone';

        const notification = document.createElement('div');
        notification.className = 'change-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="ph ph-pencil"></i>
                <span>${userName} made a ${changeType}</span>
            </div>
            <div class="notification-actions">
                <button onclick="this.acceptChange()" class="accept-btn">Accept</button>
                <button onclick="this.rejectChange()" class="reject-btn">Reject</button>
            </div>
        `;

        const container = document.querySelector('.change-notifications') || document.body;
        container.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
    }

    send(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(message));
        }
    }

    // Conflict resolution
    handleConflict(localChange, remoteChange) {
        // Simple last-write-wins for now
        // In production, implement operational transform
        if (new Date(remoteChange.timestamp) > new Date(localChange.timestamp)) {
            return remoteChange;
        }
        return localChange;
    }
}

// Enhanced Sharing Modal
class AdvancedSharingModal {
    constructor(authService, item) {
        this.authService = authService;
        this.item = item;
    }

    show() {
        const modal = document.createElement('div');
        modal.className = 'advanced-sharing-modal';
        modal.innerHTML = this.renderModal();

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        this.bindEvents(modal);
        this.loadCurrentSharing();
    }

    renderModal() {
        return `
            <div class="modal-overlay" onclick="this.remove()"></div>
            <div class="modal-content sharing-modal-content">
                <div class="modal-header">
                    <h3>Share "${this.item.name}"</h3>
                    <button class="modal-close" onclick="this.closest('.advanced-sharing-modal').remove()">
                        <i class="ph ph-x"></i>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="sharing-tabs">
                        <button class="sharing-tab active" data-tab="people">
                            <i class="ph ph-users"></i>
                            People
                        </button>
                        <button class="sharing-tab" data-tab="link">
                            <i class="ph ph-link"></i>
                            Link Sharing
                        </button>
                        <button class="sharing-tab" data-tab="permissions">
                            <i class="ph ph-lock"></i>
                            Permissions
                        </button>
                    </div>

                    <div class="sharing-content">
                        <div class="sharing-panel active" data-panel="people">
                            <div class="user-search">
                                <div class="search-input-container">
                                    <i class="ph ph-magnifying-glass"></i>
                                    <input type="text" placeholder="Search for people..." id="userSearch">
                                </div>
                                <div class="search-results" id="userSearchResults"></div>
                            </div>

                            <div class="shared-with-list" id="sharedWithList">
                                <div class="sharing-item owner">
                                    <div class="user-info">
                                        <div class="user-avatar">
                                            ${this.getCurrentUserAvatar()}
                                        </div>
                                        <div class="user-details">
                                            <div class="user-name">${this.authService.getCurrentUser().name}</div>
                                            <div class="user-email">${this.authService.getCurrentUser().email}</div>
                                        </div>
                                    </div>
                                    <div class="user-role">
                                        <span class="role-badge owner">Owner</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="sharing-panel" data-panel="link">
                            <div class="link-sharing-section">
                                <div class="link-toggle">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="linkSharingEnabled">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <div class="toggle-label">
                                        <strong>Link sharing</strong>
                                        <p>Anyone with the link can view this item</p>
                                    </div>
                                </div>

                                <div class="share-link-container" id="shareLinkContainer" style="display: none;">
                                    <div class="share-link">
                                        <input type="text" id="shareLink" readonly>
                                        <button class="copy-btn" onclick="this.copyShareLink()">
                                            <i class="ph ph-copy"></i>
                                        </button>
                                    </div>

                                    <div class="link-options">
                                        <select id="linkPermissions">
                                            <option value="view">Can view</option>
                                            <option value="comment">Can comment</option>
                                            <option value="edit">Can edit</option>
                                        </select>

                                        <div class="expiration-setting">
                                            <label>
                                                <input type="checkbox" id="linkExpiration">
                                                Set expiration
                                            </label>
                                            <input type="date" id="expirationDate" style="display: none;">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="sharing-panel" data-panel="permissions">
                            <div class="permissions-grid">
                                <div class="permission-section">
                                    <h4>Viewer Permissions</h4>
                                    <div class="permission-list">
                                        <label class="permission-item">
                                            <input type="checkbox" id="allowDownload" checked>
                                            Allow downloading
                                        </label>
                                        <label class="permission-item">
                                            <input type="checkbox" id="allowPrinting" checked>
                                            Allow printing
                                        </label>
                                        <label class="permission-item">
                                            <input type="checkbox" id="allowCopying" checked>
                                            Allow copying content
                                        </label>
                                    </div>
                                </div>

                                <div class="permission-section">
                                    <h4>Editor Permissions</h4>
                                    <div class="permission-list">
                                        <label class="permission-item">
                                            <input type="checkbox" id="allowSharing">
                                            Allow sharing with others
                                        </label>
                                        <label class="permission-item">
                                            <input type="checkbox" id="allowRoleChanges">
                                            Allow changing roles
                                        </label>
                                        <label class="permission-item">
                                            <input type="checkbox" id="allowDeletion">
                                            Allow deletion
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="secondary-btn" onclick="this.closest('.advanced-sharing-modal').remove()">
                        Cancel
                    </button>
                    <button class="primary-btn" onclick="this.saveSharing()">
                        Save Sharing Settings
                    </button>
                </div>
            </div>
        `;
    }

    bindEvents(modal) {
        // Tab switching
        modal.querySelectorAll('.sharing-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Link sharing toggle
        const linkToggle = modal.querySelector('#linkSharingEnabled');
        linkToggle.addEventListener('change', (e) => {
            const container = modal.querySelector('#shareLinkContainer');
            container.style.display = e.target.checked ? 'block' : 'none';

            if (e.target.checked) {
                this.generateShareLink();
            }
        });

        // User search
        const userSearch = modal.querySelector('#userSearch');
        userSearch.addEventListener('input', this.debounce((e) => {
            this.searchUsers(e.target.value);
        }, 300));

        // Expiration date toggle
        const expirationToggle = modal.querySelector('#linkExpiration');
        expirationToggle.addEventListener('change', (e) => {
            const dateInput = modal.querySelector('#expirationDate');
            dateInput.style.display = e.target.checked ? 'block' : 'none';
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.sharing-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content panels
        document.querySelectorAll('.sharing-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.querySelector(`[data-panel="${tabName}"]`).classList.add('active');
    }

    async searchUsers(query) {
        if (query.length < 2) {
            document.getElementById('userSearchResults').innerHTML = '';
            return;
        }

        try {
            const users = await this.dataService.searchUsers(query);
            this.renderUserSearchResults(users);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    }

    renderUserSearchResults(users) {
        const resultsContainer = document.getElementById('userSearchResults');

        if (users.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No users found</div>';
            return;
        }

        resultsContainer.innerHTML = users.map(user => `
            <div class="user-result" onclick="this.addUserToSharing('${user.id}')">
                <div class="user-avatar">
                    ${user.picture ?
                        `<img src="${user.picture}" alt="${user.name}">` :
                        `<div class="user-initials">${user.initials}</div>`
                    }
                </div>
                <div class="user-details">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
                <button class="add-user-btn">
                    <i class="ph ph-plus"></i>
                </button>
            </div>
        `).join('');
    }

    async addUserToSharing(userId) {
        try {
            const user = await this.dataService.getUser(userId);
            const defaultRole = 'viewer';

            await this.dataService.shareItem(this.item.id, userId, defaultRole);
            this.addUserToList(user, defaultRole);

            // Clear search
            document.getElementById('userSearch').value = '';
            document.getElementById('userSearchResults').innerHTML = '';

        } catch (error) {
            console.error('Error adding user to sharing:', error);
            this.showError('Failed to add user');
        }
    }

    addUserToList(user, role) {
        const list = document.getElementById('sharedWithList');
        const userItem = document.createElement('div');
        userItem.className = 'sharing-item';
        userItem.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">
                    ${user.picture ?
                        `<img src="${user.picture}" alt="${user.name}">` :
                        `<div class="user-initials">${user.initials}</div>`
                    }
                </div>
                <div class="user-details">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
            <div class="user-role">
                <select class="role-select" onchange="this.updateUserRole('${user.id}', this.value)">
                    <option value="viewer" ${role === 'viewer' ? 'selected' : ''}>Can view</option>
                    <option value="editor" ${role === 'editor' ? 'selected' : ''}>Can edit</option>
                    <option value="admin" ${role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
                <button class="remove-user-btn" onclick="this.removeUserFromSharing('${user.id}')">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        `;

        list.appendChild(userItem);
    }

    generateShareLink() {
        const baseUrl = window.location.origin;
        const shareToken = this.generateShareToken();
        const shareLink = `${baseUrl}/shared/${this.item.id}?token=${shareToken}`;

        document.getElementById('shareLink').value = shareLink;
    }

    generateShareToken() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    copyShareLink() {
        const linkInput = document.getElementById('shareLink');
        linkInput.select();
        document.execCommand('copy');

        this.showSuccess('Link copied to clipboard');
    }

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
    }

    showSuccess(message) {
        // Use existing toast system
        if (window.CleansheetCore?.utils?.showToast) {
            window.CleansheetCore.utils.showToast(message, 'success');
        }
    }

    showError(message) {
        if (window.CleansheetCore?.utils?.showToast) {
            window.CleansheetCore.utils.showToast(message, 'error');
        }
    }
}
```

### Week 26: Performance Optimization & Deployment

#### 26.1 Performance Optimization Strategy
```javascript
// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];
        this.setupPerformanceObserver();
        this.setupResourceMonitoring();
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Monitor long tasks
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) { // Tasks longer than 50ms
                        console.warn('Long task detected:', entry.duration, 'ms');
                        this.recordMetric('longTask', {
                            duration: entry.duration,
                            startTime: entry.startTime
                        });
                    }
                }
            });

            try {
                longTaskObserver.observe({entryTypes: ['longtask']});
                this.observers.push(longTaskObserver);
            } catch (e) {
                console.log('Long task monitoring not supported');
            }

            // Monitor layout shifts
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                if (clsValue > 0) {
                    this.recordMetric('cumulativeLayoutShift', clsValue);
                }
            });

            try {
                clsObserver.observe({entryTypes: ['layout-shift']});
                this.observers.push(clsObserver);
            } catch (e) {
                console.log('Layout shift monitoring not supported');
            }
        }
    }

    setupResourceMonitoring() {
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                this.recordMetric('memoryUsage', {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                });
            }, 30000); // Every 30 seconds
        }
    }

    recordMetric(name, value) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        this.metrics.get(name).push({
            value: value,
            timestamp: performance.now()
        });

        // Keep only last 100 entries per metric
        if (this.metrics.get(name).length > 100) {
            this.metrics.get(name).shift();
        }
    }

    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

    // Core Web Vitals measurement
    measureCoreWebVitals() {
        return new Promise((resolve) => {
            const vitals = {};

            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                vitals.lcp = lastEntry.startTime;
            }).observe({entryTypes: ['largest-contentful-paint']});

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0];
                vitals.fid = firstInput.processingStart - firstInput.startTime;
            }).observe({entryTypes: ['first-input']});

            // Cumulative Layout Shift calculated above
            vitals.cls = this.metrics.get('cumulativeLayoutShift') || 0;

            setTimeout(() => resolve(vitals), 5000);
        });
    }
}

// Lazy Loading Manager
class LazyLoadingManager {
    constructor() {
        this.intersectionObserver = null;
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.loadElement(entry.target);
                        this.intersectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before element is visible
                threshold: 0.1
            });
        }
    }

    observe(element) {
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(element);
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadElement(element);
        }
    }

    loadElement(element) {
        const type = element.dataset.lazyType;

        switch (type) {
            case 'image':
                this.loadImage(element);
                break;
            case 'component':
                this.loadComponent(element);
                break;
            case 'data':
                this.loadData(element);
                break;
        }
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }

    loadComponent(element) {
        const componentName = element.dataset.component;
        const componentProps = JSON.parse(element.dataset.props || '{}');

        // Dynamically import and render component
        import(`./components/${componentName}.js`)
            .then(module => {
                const Component = module.default;
                const instance = new Component(element, componentProps);
                instance.render();
            })
            .catch(error => {
                console.error(`Failed to load component ${componentName}:`, error);
            });
    }

    loadData(element) {
        const dataUrl = element.dataset.url;
        const dataMethod = element.dataset.method || 'GET';

        fetch(dataUrl, { method: dataMethod })
            .then(response => response.json())
            .then(data => {
                const event = new CustomEvent('dataLoaded', { detail: data });
                element.dispatchEvent(event);
            })
            .catch(error => {
                console.error(`Failed to load data from ${dataUrl}:`, error);
            });
    }
}

// Cache Manager for offline functionality
class CacheManager {
    constructor() {
        this.cacheName = 'cleansheet-professional-v1';
        this.staticAssets = [
            '/',
            '/professional.html',
            '/shared/cleansheet-core.js',
            '/shared/data-service.js',
            '/assets/high-resolution-logo-files/white-on-transparent.png'
        ];

        this.initializeServiceWorker();
    }

    async initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);

                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    async cacheStaticAssets() {
        if ('caches' in window) {
            const cache = await caches.open(this.cacheName);
            await cache.addAll(this.staticAssets);
        }
    }

    async getCachedData(key) {
        if ('caches' in window) {
            const cache = await caches.open(this.cacheName);
            const response = await cache.match(key);
            return response ? await response.json() : null;
        }
        return null;
    }

    async setCachedData(key, data) {
        if ('caches' in window) {
            const cache = await caches.open(this.cacheName);
            const response = new Response(JSON.stringify(data));
            await cache.put(key, response);
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="ph ph-download"></i>
                <span>New version available</span>
            </div>
            <div class="notification-actions">
                <button onclick="this.reloadApp()" class="update-btn">Update</button>
                <button onclick="this.dismiss()" class="dismiss-btn">Later</button>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
    }

    reloadApp() {
        window.location.reload();
    }
}

// Bundle optimization and code splitting
class ModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingPromises = new Map();
    }

    async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return Promise.resolve();
        }

        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }

        const loadPromise = this.dynamicImport(moduleName)
            .then(() => {
                this.loadedModules.add(moduleName);
                this.loadingPromises.delete(moduleName);
            })
            .catch(error => {
                console.error(`Failed to load module ${moduleName}:`, error);
                this.loadingPromises.delete(moduleName);
                throw error;
            });

        this.loadingPromises.set(moduleName, loadPromise);
        return loadPromise;
    }

    async dynamicImport(moduleName) {
        const moduleMap = {
            'rich-text-editor': () => import('./components/RichTextEditor.js'),
            'block-editor': () => import('./components/BlockEditor.js'),
            'form-builder': () => import('./components/FormBuilder.js'),
            'report-generator': () => import('./components/ReportGenerator.js'),
            'workflow-designer': () => import('./components/WorkflowDesigner.js'),
            'table-editor': () => import('./components/TableEditor.js'),
            'chart-library': () => import('./components/ChartLibrary.js'),
            'pdf-generator': () => import('./utils/PDFGenerator.js')
        };

        const importFunction = moduleMap[moduleName];
        if (!importFunction) {
            throw new Error(`Unknown module: ${moduleName}`);
        }

        return await importFunction();
    }

    preloadCriticalModules() {
        const criticalModules = ['rich-text-editor', 'block-editor'];
        return Promise.all(
            criticalModules.map(module => this.loadModule(module))
        );
    }
}
```

**Deliverable**: Complete Professional Canvas system with D3 treemap visualization, comprehensive CRUD operations, real-time collaboration, and production-ready performance optimizations

**Test Criteria**:
- [ ] Authentication system works with Azure AD B2C integration
- [ ] D3 treemap visualization renders correctly and handles user interactions
- [ ] All inventory components (documents, forms, tables, reports, workflows) function properly
- [ ] Real-time collaboration shows user presence and document changes
- [ ] Advanced sharing modal allows granular permission management
- [ ] Performance monitoring tracks Core Web Vitals and system metrics
- [ ] Lazy loading reduces initial bundle size and improves load times
- [ ] Service Worker enables offline functionality
- [ ] Code splitting loads modules on demand
- [ ] Responsive design works across all screen sizes (mobile, tablet, desktop)

---

This completes the comprehensive Professional Canvas Implementation plan. The system provides:

1. **Complete Authentication System** with Azure AD B2C integration and progressive authentication
2. **Interactive D3 Treemap** for hierarchical content navigation with click-triggered inventory slideouts
3. **Comprehensive CRUD Operations** for all document types (rich text, block documents, tables, forms, reports, workflows, pipelines, templates)
4. **Real-time Collaboration** with WebSocket-based user presence and document synchronization
5. **Advanced Sharing & Permissions** with granular role-based access control
6. **Production-Ready Performance** with lazy loading, caching, and performance monitoring
7. **Responsive Design** following the Corporate Professional design system
8. **Integration with Existing Cleansheet Infrastructure** leveraging shared services and design tokens