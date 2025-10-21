/**
 * Configuration Loader
 * Loads authentication configuration with fallback to defaults
 */

class ConfigLoader {
    constructor() {
        this.config = null;
        this.loadConfig();
    }

    loadConfig() {
        // Try to load production config first
        if (typeof AuthConfig !== 'undefined') {
            // Production config loaded from auth-config.js
            this.config = AuthConfig.getCurrent();
            console.log('Loaded production authentication config');
        } else {
            // Fallback to template defaults for development/demo
            console.warn('No production config found, using template defaults');
            this.config = this.getTemplateDefaults();
        }
    }

    getTemplateDefaults() {
        const isProduction = window.location.hostname === 'pro.cleansheet.dev';
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        return {
            // Use placeholder values - replace with actual values from Azure
            clientId: '00000000-0000-0000-0000-000000000000',

            // External ID (recommended) - Multi-tenant support
            authority: 'https://login.microsoftonline.com/common',
            knownAuthorities: ['login.microsoftonline.com'],

            // B2C (legacy) - Uncomment these lines and comment above to use B2C
            // authority: 'https://cleansheetprofessional.b2clogin.com/cleansheetprofessional.onmicrosoft.com/B2C_1_signup_signin',
            // knownAuthorities: ['cleansheetprofessional.b2clogin.com'],

            scopes: ['openid', 'profile', 'email'],

            // Environment-specific URIs
            redirectUri: this.getRedirectUri(),
            postLogoutRedirectUri: this.getLogoutRedirectUri(),

            // Admin domain restriction
            adminDomain: 'cleansheet.dev',

            // Environment flags
            isProduction: isProduction,
            isDevelopment: isLocalhost
        };
    }

    getRedirectUri() {
        const hostname = window.location.hostname;

        if (hostname === 'pro.cleansheet.dev') {
            return 'https://pro.cleansheet.dev/professional/callback.html';
        } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return window.location.origin + '/professional/callback.html';
        } else {
            return window.location.origin + '/professional/callback.html';
        }
    }

    getLogoutRedirectUri() {
        const hostname = window.location.hostname;

        if (hostname === 'pro.cleansheet.dev') {
            return 'https://pro.cleansheet.dev/professional/login.html';
        } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return window.location.origin + '/professional/login.html';
        } else {
            return window.location.origin + '/professional/login.html';
        }
    }

    getConfig() {
        return { ...this.config };
    }

    // Validate configuration
    isConfigValid() {
        const config = this.getConfig();

        if (!config.clientId || config.clientId === '00000000-0000-0000-0000-000000000000') {
            console.warn('Authentication config: Using placeholder client ID. Update with actual value from Azure.');
            return false;
        }

        if (!config.authority || !config.adminDomain) {
            console.error('Authentication config: Missing required configuration values');
            return false;
        }

        return true;
    }

    // Get configuration instructions
    getSetupInstructions() {
        return {
            required: [
                'Copy auth-config.template.js to auth-config.js',
                'Update clientId with value from Azure App Registration',
                'Choose authentication method (External ID or B2C)',
                'Set up DNS: CNAME pro.cleansheet.dev -> your-app.azurewebsites.net',
                'Configure redirect URIs in Azure App Registration'
            ],
            optional: [
                'Update admin domain if different from cleansheet.dev',
                'Customize production hostname if not using pro.cleansheet.dev'
            ],
            azure_setup: {
                external_id: {
                    tenant_type: 'External (Azure AD B2C)',
                    authority: 'https://login.microsoftonline.com/common',
                    redirect_uris: [
                        'https://pro.cleansheet.dev/professional/callback.html',
                        'http://localhost:3000/professional/callback.html'
                    ]
                },
                b2c: {
                    tenant_type: 'Azure AD B2C',
                    authority: 'https://[tenant].b2clogin.com/[tenant].onmicrosoft.com/B2C_1_[policy]',
                    redirect_uris: [
                        'https://pro.cleansheet.dev/professional/callback.html',
                        'http://localhost:3000/professional/callback.html'
                    ]
                }
            }
        };
    }

    // Display setup status
    displaySetupStatus() {
        const isValid = this.isConfigValid();
        const config = this.getConfig();

        console.group('🔐 Authentication Setup Status');
        console.log('Environment:', config.isProduction ? '🏭 Production' : '🛠️ Development');
        console.log('Method:', config.authority.includes('microsoftonline.com') ? '✅ External ID' : '🔶 B2C');
        console.log('Client ID:', isValid ? '✅ Configured' : '⚠️ Using placeholder');
        console.log('Admin Domain:', config.adminDomain);
        console.log('Redirect URI:', config.redirectUri);

        if (!isValid) {
            console.warn('⚠️ Setup required - see AZURE_SETUP_GUIDE.md');
        } else {
            console.log('✅ Configuration looks good');
        }
        console.groupEnd();
    }
}

// Create global instance
const configLoader = new ConfigLoader();

// Display setup status in development
if (!configLoader.getConfig().isProduction) {
    configLoader.displaySetupStatus();
}

// Export for use
window.configLoader = configLoader;