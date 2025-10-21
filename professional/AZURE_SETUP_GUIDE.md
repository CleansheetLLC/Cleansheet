# Azure Authentication Setup Guide
## Microsoft Entra External ID Configuration for pro.cleansheet.dev

This guide walks through setting up Microsoft Entra External ID (recommended) or Azure AD B2C for the Cleansheet Professional platform with domain-restricted admin access and multi-tenant user support.

---

## 🔥 Important: Azure AD B2C Deprecation

**Azure AD B2C is no longer available for new customers as of May 1, 2025.** Microsoft recommends using **Microsoft Entra External ID** for new implementations. This guide prioritizes the External ID approach.

---

## Phase 1: Microsoft Entra External ID Setup (Recommended)

### 1.1 Create External ID Tenant

1. **Navigate to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure subscription account

2. **Create New Tenant**
   - Search for "Microsoft Entra ID" in the search bar
   - Click "Manage tenants" → "Create"
   - Select **"External (Azure AD B2C)"** as tenant type
   - Fill in details:
     - **Organization name**: `Cleansheet Professional`
     - **Initial domain name**: `cleansheetprofessional` (or `cleansheet`)
     - **Country/Region**: Select your region
     - **Environment**: Production

3. **Tenant Configuration**
   - After creation, switch to the new tenant
   - Note the tenant details for later configuration

### 1.2 App Registration Setup

1. **Create App Registration**
   - Navigate to "App registrations" in your External ID tenant
   - Click "New registration"
   - Fill in details:
     - **Name**: `Cleansheet Professional SPA`
     - **Supported account types**:
       - Select **"Accounts in any organizational directory and personal Microsoft accounts"** (Multi-tenant)
     - **Redirect URI**:
       - Platform: **Single-page application (SPA)**
       - URI: `https://pro.cleansheet.dev/professional/callback.html`

2. **Configure Additional Redirect URIs**
   - Go to "Authentication" in your app registration
   - Add additional redirect URIs:
     - `https://pro.cleansheet.dev/professional/`
     - `http://localhost:3000/professional/callback.html` (for development)
   - **Implicit grant and hybrid flows**:
     - ☑️ Enable "ID tokens"
   - **Advanced settings**:
     - Logout URL: `https://pro.cleansheet.dev/professional/login.html`

3. **API Permissions**
   - Go to "API permissions"
   - You should see **User.Read** permission already added automatically for Microsoft Graph
   - This is normal and provides the necessary access for user authentication
   - Click "Grant admin consent" to approve this permission
   - **Note**: The OpenID Connect scopes (`openid`, `profile`, `email`) are automatically handled during authentication and don't appear as separate API permissions

4. **Record Configuration Values**

   **IMPORTANT**: You must save these values for Phase 5 configuration.

   **Where to find them:**
   - After creating your app registration, you'll be on the **Overview** page
   - Look for these values in the "Essentials" section at the top

   **Copy these exact values:**
   ```
   Application (client) ID: [Copy the GUID - looks like 12345678-1234-1234-1234-123456789abc]
   Directory (tenant) ID: [Copy the GUID - different from client ID]
   Authority: https://login.microsoftonline.com/common
   ```

   **How to copy:**
   - Click the **copy button** (📋) next to each GUID
   - Paste them into a text file for safekeeping
   - The **Application (client) ID** is what you'll use in Phase 5 as your `clientId`

   **Example format:**
   ```
   Application (client) ID: a1b2c3d4-e5f6-7890-1234-567890abcdef
   Directory (tenant) ID: 9876fedc-ba98-7654-3210-fedcba987654
   ```

### Understanding Scopes vs API Permissions

**API Permissions** (like User.Read):
- Configured in Azure Portal under "API permissions"
- Require admin consent for the application
- Grant access to specific Microsoft Graph API endpoints
- Visible and manageable through the Azure Portal interface

**OpenID Connect Scopes** (openid, profile, email):
- Requested automatically during the login process by MSAL
- Handle basic authentication and ID token enrichment
- Don't appear as separate API permissions in Azure Portal
- Standard OAuth2/OpenID Connect protocol scopes

**Your app uses both**: User.Read for Graph API access when needed, plus OpenID scopes for basic authentication and user profile information.

### 1.3 User Flow Configuration (External ID)

1. **Create User Flow**
   - Navigate to "User flows" in External ID
   - Click "New user flow"
   - Select "Sign up and sign in"
   - Choose version: **Recommended**
   - Configure:
     - **Name**: `SignUpSignIn`
     - **Identity providers**:
       - ☑️ Microsoft Account
       - ☑️ Azure Active Directory
     - **User attributes**: Name, Email Address
     - **Application claims**: Name, Email Addresses

---

## Phase 2: Azure AD B2C Setup (Alternative/Fallback)

**Use this only if External ID is not available or suitable for your needs.**

### 2.1 Create B2C Tenant

1. **Create Azure AD B2C Tenant**
   - In Azure portal, search "Azure AD B2C"
   - Click "Create a B2C tenant"
   - Choose "Create new Azure AD B2C Tenant"
   - Fill details:
     - **Organization name**: `Cleansheet Professional`
     - **Initial domain**: `cleansheetprofessional`
     - **Country/Region**: Your region
     - **Subscription**: Your Azure subscription
     - **Resource group**: Create new or use existing

### 2.2 B2C App Registration

1. **Register Application**
   - Switch to your B2C tenant
   - Navigate to "App registrations" → "New registration"
   - Configure:
     - **Name**: `Cleansheet Professional`
     - **Account types**: "Accounts in any identity provider or organizational directory"
     - **Redirect URI**:
       - Type: **Single-page application (SPA)**
       - URL: `https://pro.cleansheet.dev/professional/callback.html`

2. **Configure Authentication**
   - Add redirect URIs:
     - `https://pro.cleansheet.dev/professional/`
     - `http://localhost:3000/professional/callback.html`
   - Enable implicit flow: ☑️ ID tokens
   - Logout URL: `https://pro.cleansheet.dev/professional/login.html`

### 2.3 User Flows (B2C)

1. **Create Sign-up/Sign-in Flow**
   - Navigate to "User flows" → "New user flow"
   - Select "Sign up and sign in" → "Recommended"
   - Name: `B2C_1_signup_signin`
   - **Identity providers**:
     - ☑️ Microsoft Account
     - ☑️ Azure Active Directory
   - **Multifactor authentication**: Optional/Off
   - **User attributes**: Given name, Surname, Email Address
   - **Application claims**: Given Name, Surname, Email Addresses

---

## Phase 3: Azure App Service Setup

### 3.1 Create Azure App Service

1. **Navigate to App Services**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Search for "App Services" and select it
   - Click "Create" → "Web App"

2. **Basic Configuration**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `cleansheet-professional` (or choose from options below)
   - **Publish**: Code
   - **Runtime stack**: Node.js (Latest LTS) or Static Web App
   - **Operating System**: Windows or Linux
   - **Region**: Choose closest to your users

**App Name Options:**
- `cleansheet-professional` → `cleansheet-professional.azurewebsites.net`
- `cleansheet-pro` → `cleansheet-pro.azurewebsites.net`
- `pro-cleansheet` → `pro-cleansheet.azurewebsites.net`

3. **Pricing Tier**
   - **Development**: Free (F1) for testing
   - **Production**: Basic (B1) or higher for custom domains and SSL

4. **Review and Create**
   - Verify all settings
   - Click "Create" and wait for deployment

### 3.2 Deploy Static Files (Optional - for testing)

1. **Upload Professional Platform Files**
   - Use Azure portal "Advanced Tools" → Kudu
   - Or use FTP/Git deployment
   - Upload your professional platform HTML/CSS/JS files

---

## Phase 4: Domain Configuration

### 4.1 Get Domain Verification Values

**IMPORTANT**: You need these exact values for GoDaddy DNS setup.

1. **Navigate to Your App Service**
   - Go to your newly created App Service
   - Click on "Custom domains" in the left sidebar

2. **Add Custom Domain**
   - Click "Add custom domain"
   - Enter: `pro.cleansheet.dev`
   - **DO NOT** click "Validate" yet

3. **Copy the Required DNS Records**
   Azure will display:
   ```
   CNAME record:
   Name: pro
   Value: cleansheet-professional.azurewebsites.net

   TXT record:
   Name: asuid.pro
   Value: [LONG-VERIFICATION-STRING-LIKE-ABC123DEF456...]
   ```

**Example verification ID format:**
```
asuid.pro → 1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B
```

### 4.2 GoDaddy DNS Setup

**Log into GoDaddy DNS Management:**

1. **Add CNAME Record**
   ```
   Type: CNAME
   Name: pro
   Value: cleansheet-professional.azurewebsites.net
   TTL: 1 hour
   ```
   *Use your actual App Service name from Step 3.1*

2. **Add TXT Record (Domain Verification)**
   ```
   Type: TXT
   Name: asuid.pro
   Value: [Paste the exact verification string from Azure]
   TTL: 1 hour
   ```

3. **Wait for DNS Propagation**
   - Changes can take up to 48 hours
   - Check status with: `nslookup pro.cleansheet.dev`

### 4.3 Complete Azure Domain Setup

1. **Return to Azure Custom Domains**
   - After DNS records are added (wait 10-30 minutes)
   - Click "Validate" in the Add Custom Domain dialog
   - If successful, click "Add custom domain"

2. **SSL Certificate**
   - After domain is verified and added
   - Click "Add binding" next to your domain
   - Select "SNI SSL"
   - Choose "App Service Managed Certificate" (free)
   - Click "Add binding"

3. **Verify HTTPS**
   - Test `https://pro.cleansheet.dev`
   - Should redirect from HTTP automatically

---

## Phase 5: Code Configuration

### 5.0 Locating Your Client ID

**Prerequisites**: You need your **Application (client) ID** from Phase 1.2.4 to complete this phase.

**If you saved it during Phase 1 ✅** - Skip to 5.1

**If you need to find it again 🔍** - Follow these steps:

1. **Navigate to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - **CRITICAL**: Switch to your **External ID tenant** (not your main subscription)
   - Use the tenant switcher in the top-right corner
   - Look for tenant named "Cleansheet Professional" or "cleansheetprofessional"

2. **Find Your App Registration**
   - Search for "App registrations" in the search bar
   - Click on "App registrations"
   - You should see your app: **"Cleansheet Professional SPA"**
   - Click on it to open

3. **Copy Your Client ID**
   - You'll be on the **Overview** page
   - In the "Essentials" section, find:
     ```
     Application (client) ID: a1b2c3d4-e5f6-7890-1234-567890abcdef
     ```
   - Click the **copy button** (📋) next to the GUID
   - This is your `clientId` for the configuration below

**Common Issues:**
- **"I don't see any app registrations"** → You're in the wrong tenant, switch to External ID tenant
- **"I see multiple tenants"** → Choose the External ID tenant (name like "Cleansheet Professional")
- **"No app named Cleansheet Professional SPA"** → You need to complete Phase 1 first

### 5.1 Create Production Configuration File

**Step 1: Create auth-config.js from template**

In your `professional/` directory:

```bash
# Navigate to professional directory
cd professional/

# Copy template to production config
cp auth-config.template.js auth-config.js
```

**Step 2: Update auth-config.js with your actual values**

Open `auth-config.js` in your text editor and replace:

```javascript
// REPLACE THIS CLIENT ID with your actual value from Phase 1.2.4 or Section 5.0 above
clientId: '[YOUR_APPLICATION_CLIENT_ID_FROM_AZURE]'

// For External ID (recommended), use:
ACTIVE_AUTH_METHOD: 'EXTERNAL_ID'

// Your domain is already correct:
adminDomain: 'cleansheet.dev'
```

**Example completed configuration:**
```javascript
const authConfig = {
    EXTERNAL_ID: {
        clientId: '12345678-1234-1234-1234-123456789abc', // Your actual GUID
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'https://pro.cleansheet.dev/professional/callback.html',
        scopes: ['openid', 'profile', 'email'],
        knownAuthorities: ['login.microsoftonline.com']
    },
    // ... rest of configuration
    ACTIVE_AUTH_METHOD: 'EXTERNAL_ID',
    adminDomain: 'cleansheet.dev'
};
```

### 5.2 Verify Admin Domain Validation

The admin domain validation is already implemented in `microsoft-auth.js` at line 87-89:

```javascript
// File: professional/microsoft-auth.js (line 87-89)
checkAdminRole(user) {
    const email = user.username || user.idTokenClaims?.email || '';
    return email.endsWith('@cleansheet.dev');
}
```

**✅ No changes needed** - this function already enforces strict `@cleansheet.dev` domain checking.

### 5.3 Deploy Files to Azure App Service

**Option A: Azure Portal Upload (Quick Start)**

1. **Access Kudu Console**
   - Go to your Azure App Service in portal.azure.com
   - Click "Advanced Tools" → "Go"
   - This opens the Kudu console

2. **Upload Files**
   - Navigate to `/site/wwwroot/`
   - Upload all files from your `professional/` directory:
     - `login.html`
     - `callback.html`
     - `professional.html`
     - `admin.html`
     - `auth-config.js` (your production config)
     - `config-loader.js`
     - `microsoft-auth.js`
     - `auth-manager.js`

**Option B: Git Deployment (Recommended for ongoing updates)**

1. **Initialize Git in Azure**
   - Go to your App Service → "Deployment Center"
   - Choose "Local Git" as source
   - Copy the Git clone URL

2. **Deploy from your local machine**
   ```bash
   # In your professional/ directory
   git init
   git add .
   git commit -m "Initial professional platform deployment"
   git remote add azure <your-azure-git-url>
   git push azure main
   ```

### 5.4 Add auth-config.js to .gitignore

**CRITICAL SECURITY STEP**: Prevent committing production secrets to version control.

Create or update `.gitignore` in your repository root:

```gitignore
# Authentication configuration with production secrets
professional/auth-config.js

# Other common excludes
node_modules/
.env
*.log
.DS_Store
```

### 5.5 Test the Configuration

**Local Testing (Optional)**

Before deploying, you can test locally:

```bash
# Serve files locally on localhost:3000
npx http-server professional/ -p 3000

# Open browser to:
http://localhost:3000/login.html
```

**Production Testing (After deployment)**

1. **Visit your login page**: `https://pro.cleansheet.dev/professional/login.html`

2. **Test admin login**:
   - Login with an `@cleansheet.dev` account
   - Should redirect to `admin.html`
   - Should see admin privileges

3. **Test multi-tenant user login**:
   - Login with a Microsoft personal account or other organization
   - Should redirect to `professional.html`
   - Should NOT have admin access

**Verification checklist:**
- [ ] Login page loads without JavaScript errors
- [ ] Redirect to Microsoft authentication works
- [ ] Successful login redirects back to your app
- [ ] Admin users see admin panel
- [ ] Regular users see professional dashboard
- [ ] Logout functionality works

---

## Configuration Values Reference

### External ID Configuration
```javascript
// Replace these placeholder values in your code files:
clientId: '[APPLICATION_ID_FROM_APP_REGISTRATION]'
authority: 'https://login.microsoftonline.com/common'
redirectUri: 'https://pro.cleansheet.dev/professional/callback.html'
knownAuthorities: ['login.microsoftonline.com']
```

### B2C Configuration (Alternative)
```javascript
// Replace these placeholder values:
clientId: '[APPLICATION_ID_FROM_B2C_REGISTRATION]'
authority: 'https://cleansheetprofessional.b2clogin.com/cleansheetprofessional.onmicrosoft.com/B2C_1_signup_signin'
redirectUri: 'https://pro.cleansheet.dev/professional/callback.html'
knownAuthorities: ['cleansheetprofessional.b2clogin.com']
```

---

## Testing Checklist

### DNS and Hosting
- [ ] `pro.cleansheet.dev` resolves to Azure App Service
- [ ] HTTPS certificate is active and valid
- [ ] All redirect URIs work correctly

### Authentication Flow
- [ ] Admin login works with @cleansheet.dev accounts
- [ ] Multi-tenant user login works with Microsoft accounts
- [ ] Proper role-based routing (admin → admin.html, user → professional.html)
- [ ] Logout functionality works correctly

### Security Validation
- [ ] Non-cleansheet.dev accounts cannot access admin panel
- [ ] Token validation is working correctly
- [ ] HTTPS is enforced for all authentication flows

---

## Troubleshooting

### Common Issues

**1. "AADB2C90205: This application does not have sufficient permissions"**
- Ensure User.Read permission is granted in API permissions
- Click "Grant admin consent" for the User.Read permission
- OpenID Connect scopes (openid, profile, email) are handled automatically

**2. "AADB2C90051: No suitable identity provider was found"**
- Check identity provider configuration in user flows
- Verify Microsoft Account provider is enabled

**3. "Invalid redirect_uri"**
- Verify redirect URI exactly matches what's configured
- Ensure HTTPS is used for production URIs

**4. Domain verification failing**
- Check CNAME record propagation (use dig or nslookup)
- Verify TXT record is correctly set for domain verification

**5. "Cannot find Client ID" / "App registration not visible"**
- **Wrong tenant**: Ensure you're in the External ID tenant, not your main Azure subscription
- **Tenant switching**: Use the tenant switcher (profile icon) in top-right of Azure Portal
- **App not created**: Complete Phase 1.2 (App Registration Setup) first
- **Correct tenant name**: Look for "Cleansheet Professional" or "cleansheetprofessional"
- **Navigation path**: Azure Portal → Switch Tenant → App registrations → Cleansheet Professional SPA → Overview

### Support Resources
- [Microsoft Entra External ID Documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/)
- [Azure App Service Custom Domains](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain)
- [GoDaddy DNS Management](https://www.godaddy.com/help/manage-dns-records-680)

---

**Next Steps**: After completing the Azure configuration, update the code files with your actual configuration values and test the complete authentication flow.