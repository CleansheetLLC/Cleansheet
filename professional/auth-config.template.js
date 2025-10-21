/**
 * Authentication Configuration Template
 * Copy this file to auth-config.js and update with your actual Azure values
 * DO NOT commit auth-config.js to version control - add it to .gitignore
 */

const AuthConfig = {
    // =================================================================
    // STEP 1: Choose Authentication Method
    // =================================================================

    // Option A: Microsoft Entra External ID (Recommended for new implementations)
    EXTERNAL_ID: {
        clientId: 'YOUR_EXTERNAL_ID_CLIENT_ID_HERE', // From Azure App Registration
        authority: 'https://login.microsoftonline.com/common', // Multi-tenant endpoint
        knownAuthorities: ['login.microsoftonline.com'],
        scopes: ['openid', 'profile', 'email']
    },

    // Option B: Azure AD B2C (Legacy - not recommended for new projects)
    B2C: {
        clientId: 'YOUR_B2C_CLIENT_ID_HERE', // From Azure B2C App Registration
        authority: 'https://cleansheetprofessional.b2clogin.com/cleansheetprofessional.onmicrosoft.com/B2C_1_signup_signin',
        knownAuthorities: ['cleansheetprofessional.b2clogin.com'],
        scopes: ['openid', 'profile', 'email']
    },

    // =================================================================
    // STEP 2: Configure Domain Settings
    // =================================================================

    // Admin access control
    ADMIN_DOMAIN: 'cleansheet.dev', // Only users from this domain can be admins

    // Production settings
    PRODUCTION: {
        hostname: 'pro.cleansheet.dev',
        redirectUri: 'https://pro.cleansheet.dev/professional/callback.html',
        logoutRedirectUri: 'https://pro.cleansheet.dev/professional/login.html'
    },

    // Development settings
    DEVELOPMENT: {
        hostname: 'localhost',
        redirectUri: 'http://localhost:3000/professional/callback.html',
        logoutRedirectUri: 'http://localhost:3000/professional/login.html'
    },

    // =================================================================
    // STEP 3: Choose Active Configuration
    // =================================================================

    // Set to 'EXTERNAL_ID' (recommended) or 'B2C'
    ACTIVE_AUTH_METHOD: 'EXTERNAL_ID',

    // Environment detection
    isProduction: () => window.location.hostname === AuthConfig.PRODUCTION.hostname,

    // Get current configuration based on method and environment
    getCurrent: () => {
        const authMethod = AuthConfig[AuthConfig.ACTIVE_AUTH_METHOD];
        const env = AuthConfig.isProduction() ? AuthConfig.PRODUCTION : AuthConfig.DEVELOPMENT;

        return {
            ...authMethod,
            redirectUri: env.redirectUri,
            postLogoutRedirectUri: env.logoutRedirectUri,
            adminDomain: AuthConfig.ADMIN_DOMAIN,
            isProduction: AuthConfig.isProduction()
        };
    }
};

// =================================================================
// CONFIGURATION INSTRUCTIONS
// =================================================================

/*
TO SET UP YOUR AUTHENTICATION:

1. COPY THIS FILE:
   - Copy this file to 'auth-config.js'
   - Add 'auth-config.js' to your .gitignore file

2. GET YOUR AZURE VALUES:

   For External ID (Recommended):
   - Go to Azure Portal > Microsoft Entra ID > App registrations
   - Create new registration or find existing one
   - Copy the "Application (client) ID"
   - Set Redirect URIs to:
     * https://pro.cleansheet.dev/professional/callback.html
     * http://localhost:3000/professional/callback.html (for dev)

   For B2C (Legacy):
   - Go to Azure Portal > Azure AD B2C > App registrations
   - Copy the "Application (client) ID"
   - Update tenant name in authority URL

3. UPDATE VALUES:
   - Replace YOUR_EXTERNAL_ID_CLIENT_ID_HERE with actual client ID
   - Or replace YOUR_B2C_CLIENT_ID_HERE if using B2C
   - Verify ADMIN_DOMAIN is correct (cleansheet.dev)
   - Verify production hostname (pro.cleansheet.dev)

4. SET ACTIVE METHOD:
   - Set ACTIVE_AUTH_METHOD to 'EXTERNAL_ID' (recommended)
   - Or set to 'B2C' if you need to use legacy B2C

5. UPDATE YOUR CODE:
   - Import this config in your authentication files
   - Replace hardcoded values with AuthConfig.getCurrent()

EXAMPLE USAGE IN CODE:

// In your authentication service initialization:
const config = AuthConfig.getCurrent();
const authService = new MicrosoftAuthService(config);

DNS SETUP REQUIRED:
- Add CNAME record: pro.cleansheet.dev -> your-app.azurewebsites.net
- Add TXT record for domain verification
- Configure SSL certificate in Azure App Service

SECURITY NOTES:
- Never commit auth-config.js to version control
- Admin access restricted to @cleansheet.dev emails only
- Multi-tenant allows any Microsoft account for regular users
- Production redirects use HTTPS only
*/

// Make available globally (remove in production, use proper imports)
if (typeof window !== 'undefined') {
    window.AuthConfig = AuthConfig;
}