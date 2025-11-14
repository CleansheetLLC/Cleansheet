# Cleansheet User Sync & Authentication Deployment Guide

This guide walks through deploying Azure AD B2C authentication and workspace sync for the Cleansheet Career Canvas application.

## Overview

**Architecture:**
- **Azure AD B2C** - User authentication and identity management
- **Azure Functions** - SAS token generation with user-specific scoping
- **Azure Blob Storage** - Workspace data storage
  - Container: `userworkspaces` (authenticated users, read/write)
  - Container: `profileblobs` (anonymous users, write-only)
- **Client Libraries** - `cleansheet-auth.js` and `cleansheet-sync.js`

**Features:**
- Self-service user registration and sign-in
- Automatic duplicate email detection and migration on first login
- Bidirectional workspace sync with Last-Write-Wins conflict resolution
- Offline support with auto-sync when online
- User-specific SAS tokens scoped to their blob prefix
- Snapshot support for backup/restore

---

## Prerequisites

- Azure subscription with contributor access
- Azure CLI installed (`az --version`)
- Node.js 24+ installed (Node 18 reached EOL April 2025)
- Existing storage account: `storageb681`
- Git repository with Cleansheet code

---

## Phase 1: Microsoft Entra External ID Setup

**Note:** Azure AD B2C is no longer available for new tenants (sunset May 1, 2025). Microsoft Entra External ID is the modern replacement with enhanced features.

### Step 1.1: Enable External ID in Your Tenant

```bash
# Via Azure Portal
# 1. Navigate to: https://portal.azure.com
# 2. Go to Microsoft Entra ID (Azure Active Directory)
# 3. Select "External Identities" from left menu
# 4. Click "Get started" if this is your first time
# 5. Enable "Email one-time passcode" for guest users (optional)
```

**Result:** External Identities enabled in your tenant

### Step 1.2: Register Application

```bash
# In Microsoft Entra ID:
# 1. App registrations → New registration
# 2. Name: Cleansheet Career Canvas
# 3. Supported account types:
#    - "Accounts in any organizational directory and personal Microsoft accounts"
# 4. Redirect URI:
#    Platform: Single-page application (SPA)
#    URI: https://cleansheetcorpus.blob.core.windows.net/web/career-canvas.html
#
# 5. Click Register
#
# 6. Note these values (save them!):
#    - Application (client) ID: 365cb98b-a67e-48fe-ab87-4b79a91af651
#    - Directory (tenant) ID: d0c94b5c-2d4a-4dbc-8690-f7a434b2ffdb
#    - Object ID: d9659281-ab8c-4009-9f99-5fe4786b20e0
#
# 7. Under "Authentication":
#    - Add redirect URI: http://localhost:8000/career-canvas.html (for testing)
#    - Enable "ID tokens" and "Access tokens" under Implicit grant and hybrid flows
#    - Allow public client flows: Yes
#    - Click Save
#
# 8. Under "API permissions":
#    - Should already have "User.Read" (Microsoft Graph)
#    - Add: "email", "openid", "profile", "offline_access"
#    - Click "Grant admin consent for [your organization]"
#
# 9. Under "Token configuration":
#    - Click "Add optional claim"
#    - Token type: ID
#    - Add claims: email, family_name, given_name
#    - Check "Turn on the Microsoft Graph email, profile permission"
#    - Click Add
```

**Result:** App registration with Client ID and Tenant ID

### Step 1.3: Configure External User Settings

```bash
# In Microsoft Entra ID → External Identities:
# 1. User settings → External user settings
# 2. Guest user access: "Guest users have limited access..."
# 3. Guest invite settings:
#    ✓ Anyone in the organization can invite guest users
# 4. Collaboration restrictions: "Allow invitations to any domain"
# 5. Click Save
#
# Self-service sign up:
# 1. External Identities → User flows
# 2. Click "New user flow"
# 3. Select "Sign up and sign in"
# 4. Name: CleansheetSignUp
# 5. Identity providers:
#    ✓ Email with password
#    ✓ (Optional) Google, Microsoft Account
# 6. User attributes:
#    Collect: Email, Given Name, Surname
#    Return: Email, Given Name, Surname, User ID
# 7. Click Create
```

**Alternative:** Use Microsoft Authentication Library (MSAL) with simpler flow:

```bash
# For simpler implementation without user flows:
# Use MSAL.js 2.x with standard Entra ID authentication
# This provides email/password sign-up automatically
# No custom user flows needed
```

### Step 1.4: Note Configuration Values

Save these values for later configuration:

```bash
# Entra External ID Configuration (save these!)
TENANT_ID=__________ (from App Registration → Overview)
CLIENT_ID=__________ (from App Registration → Overview)
AUTHORITY=https://login.microsoftonline.com/YOUR_TENANT_ID
# or for multi-tenant:
AUTHORITY=https://login.microsoftonline.com/common
```

---

## Phase 2: Storage Container Setup

### Step 2.1: Create User Workspaces Container

```bash
# Run the provided setup script
cd /home/paulg/git/Cleansheet
./azure-setup-userworkspaces.sh

# Or manually:
az storage container create \
  --name userworkspaces \
  --account-name storageb681 \
  --resource-group storage \
  --public-access off
```

### Step 2.2: Configure CORS (if needed)

```bash
# Allow web app to access blob storage
az storage cors add \
  --services b \
  --methods GET PUT POST DELETE OPTIONS \
  --origins 'https://www.cleansheet.info' 'http://localhost:8000' \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600 \
  --account-name storageb681
```

**Result:** Container `userworkspaces` created

---

## Phase 3: Azure Function Deployment

### Step 3.1: Create Function App

```bash
# Create Function App with Node.js 24 runtime
az functionapp create \
  --name cleansheet-functions \
  --resource-group Storage \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 24 \
  --functions-version 4 \
  --storage-account storageb681

# Enable CORS for web app
az functionapp cors add \
  --name cleansheet-functions \
  --resource-group Storage \
  --allowed-origins 'https://cleansheetcorpus.blob.core.windows.net' 'http://localhost:8000'
```

### Step 3.2: Configure Function App Settings

```bash
# Get storage account key
STORAGE_KEY=$(az storage account keys list \
  --account-name storageb681 \
  --resource-group storage \
  --query '[0].value' -o tsv)

# Set application settings
az functionapp config appsettings set \
  --name cleansheet-functions \
  --resource-group Storage \
  --settings \
    STORAGE_ACCOUNT_NAME=storageb681 \
    STORAGE_ACCOUNT_KEY="$STORAGE_KEY" \
    TENANT_ID="d0c94b5c-2d4a-4dbc-8690-f7a434b2ffdb" \
    CLIENT_ID="365cb98b-a67e-48fe-ab87-4b79a91af651"
```

### Step 3.3: Deploy Function Code

```bash
cd /home/paulg/git/Cleansheet/azure-functions

# Install dependencies
npm install

# Deploy to Azure
func azure functionapp publish cleansheet-functions --javascript

# Verify deployment
curl https://cleansheet-functions.azurewebsites.net/api/user/sas-token

# Should return 401 (expected - no auth token provided)
```

**Result:** Function app deployed at `https://cleansheet-functions.azurewebsites.net`

---

## Phase 4: Client Integration

### Step 4.1: Add Scripts to career-canvas.html

Add before closing `</head>` tag:

```html
<!-- Microsoft Authentication Library (MSAL) -->
<script src="https://cdn.jsdelivr.net/npm/@azure/msal-browser@2.38.0/lib/msal-browser.min.js"></script>

<!-- Cleansheet Authentication & Sync -->
<script src="shared/cleansheet-auth-msal.js"></script>
<script src="shared/cleansheet-sync.js"></script>
```

### Step 4.2: Initialize Authentication

Add after page load in career-canvas.html:

```javascript
// Initialize auth and sync
let cleansheetAuth, cleansheetSync;

// Configuration
const authConfig = {
    clientId: 'YOUR_CLIENT_ID_HERE',
    tenantId: 'YOUR_TENANT_ID_HERE',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID_HERE',
    // Or for multi-tenant: authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin + '/career-canvas.html',
    tokenEndpoint: 'https://cleansheet-functions.azurewebsites.net/api/user/sas-token'
};

// Initialize auth (MSAL-based)
cleansheetAuth = new CleansheetAuth(authConfig);

// Initialize sync
cleansheetSync = new CleansheetSync(cleansheetAuth, {
    storageAccount: 'storageb681',
    containerName: 'userworkspaces',
    anonymousContainer: 'profileblobs',
    autoSyncInterval: 60000 // 60 seconds
});

// Handle redirect callback on page load
window.addEventListener('load', async () => {
    // Check if returning from B2C authentication
    const authenticated = await cleansheetAuth.handleRedirectCallback();

    if (authenticated) {
        console.log('✓ User authenticated:', cleansheetAuth.getUser());

        // Initialize sync (includes migration check)
        await cleansheetSync.initialize();

        // Update UI to show authenticated state
        showAuthenticatedUI();
    } else if (cleansheetAuth.isAuthenticated()) {
        // Already authenticated from previous session
        await cleansheetSync.initialize();
        showAuthenticatedUI();
    } else {
        // Not authenticated
        showAnonymousUI();
    }
});

// Event listeners
cleansheetAuth.addEventListener('signin', async (user) => {
    console.log('User signed in:', user.email);
    await cleansheetSync.initialize();
    showAuthenticatedUI();
});

cleansheetAuth.addEventListener('signout', () => {
    console.log('User signed out');
    cleansheetSync.stopAutoSync();
    showAnonymousUI();
});

cleansheetSync.addEventListener('migration_available', async (data) => {
    const migrate = confirm(
        `We found ${data.blobCount} previous profile(s) for your email. ` +
        `Would you like to import this data into your account?`
    );

    if (migrate) {
        await cleansheetSync.migrateAnonymousProfile();
    }
});

cleansheetSync.addEventListener('sync_complete', (data) => {
    console.log(`✓ Sync ${data.direction} complete`);
    // Show toast notification
    showToast(`Workspace synced ${data.direction}`, 'success');
});

cleansheetSync.addEventListener('sync_error', (data) => {
    console.error(`Sync ${data.direction} failed:`, data.error);
    showToast(`Sync failed: ${data.error.message}`, 'error');
});
```

### Step 4.3: Add UI Components

Add authentication UI to canvas header:

```html
<!-- In canvas header -->
<div id="authUI" style="display: flex; align-items: center; gap: 12px;">
    <!-- Anonymous state -->
    <div id="anonymousUI" style="display: none;">
        <button onclick="cleansheetAuth.signIn()" class="auth-button">
            <i class="ph ph-sign-in"></i> Sign In
        </button>
    </div>

    <!-- Authenticated state -->
    <div id="authenticatedUI" style="display: none;">
        <div class="sync-status" id="syncStatus">
            <i class="ph ph-check-circle"></i> Synced
        </div>
        <div class="user-menu">
            <button class="user-button" onclick="toggleUserMenu()">
                <i class="ph ph-user-circle"></i>
                <span id="userName"></span>
            </button>
            <div class="user-dropdown" id="userDropdown" style="display: none;">
                <div class="user-email" id="userEmail"></div>
                <button onclick="cleansheetSync.syncUp()">
                    <i class="ph ph-cloud-arrow-up"></i> Sync Now
                </button>
                <button onclick="cleansheetAuth.signOut()">
                    <i class="ph ph-sign-out"></i> Sign Out
                </button>
            </div>
        </div>
    </div>
</div>

<script>
function showAnonymousUI() {
    document.getElementById('anonymousUI').style.display = 'block';
    document.getElementById('authenticatedUI').style.display = 'none';
}

function showAuthenticatedUI() {
    const user = cleansheetAuth.getUser();
    document.getElementById('anonymousUI').style.display = 'none';
    document.getElementById('authenticatedUI').style.display = 'flex';
    document.getElementById('userName').textContent = user.givenName || user.name;
    document.getElementById('userEmail').textContent = user.email;
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}
</script>
```

---

## Phase 5: Testing

### Step 5.1: Test Authentication

1. Open `http://localhost:8000/career-canvas.html` (or deploy to cleansheet.info)
2. Click "Sign In" button
3. Should redirect to B2C sign-up page
4. Create account with email/password
5. Should redirect back to career-canvas.html
6. Should see authenticated UI with user name

### Step 5.2: Test Sync

```javascript
// In browser console:

// Check authentication
cleansheetAuth.isAuthenticated()
// → true

// Check user
cleansheetAuth.getUser()
// → { id: "...", email: "...", name: "..." }

// Manual sync up
await cleansheetSync.syncUp()
// → Should upload 9 collection blobs

// Check Azure Storage
// Navigate to: portal.azure.com → storageb681 → userworkspaces
// Should see folder: {userId}/workspace/
```

### Step 5.3: Test Migration

```javascript
// In browser console:

// Check for anonymous profile
await cleansheetSync.checkMigrationStatus()
// → { needed: true/false, blobCount: N, ... }

// Migrate if available
await cleansheetSync.migrateAnonymousProfile()
// → Should merge anonymous data into authenticated workspace
```

### Step 5.4: Test Multi-Device Sync

1. Sign in on Device A
2. Make changes (add experience, etc.)
3. Changes should auto-sync after 60 seconds
4. Sign in on Device B with same account
5. Should see changes from Device A

---

## Phase 6: Production Deployment

### Step 6.1: Update Configuration

Update `career-canvas.html` with production values:

```javascript
const authConfig = {
    clientId: 'PRODUCTION_CLIENT_ID',
    tenantId: 'PRODUCTION_TENANT_ID',
    authority: 'https://login.microsoftonline.com/PRODUCTION_TENANT_ID',
    redirectUri: 'https://www.cleansheet.info/career-canvas.html',
    tokenEndpoint: 'https://cleansheet-functions.azurewebsites.net/api/user/sas-token'
};
```

### Step 6.2: Deploy to Azure Static Web Apps

```bash
# Deploy updated career-canvas.html
git add .
git commit -m "Add authentication and sync"
git push origin main

# Azure Static Web Apps will auto-deploy from GitHub
```

### Step 6.3: Verify Production

1. Visit https://www.cleansheet.info/career-canvas.html
2. Test sign-in flow
3. Test sync operations
4. Test migration (if you have existing anonymous profiles)

---

## Monitoring & Maintenance

### Monitor Azure Function

```bash
# View function logs
az functionapp logs tail \
  --name cleansheet-functions \
  --resource-group Storage

# View metrics
az monitor metrics list \
  --resource "/subscriptions/{subscription}/resourceGroups/Storage/providers/Microsoft.Web/sites/cleansheet-functions" \
  --metric Requests
```

### Monitor Blob Storage

```bash
# View container usage
az storage blob list \
  --container-name userworkspaces \
  --account-name storageb681 \
  --query "length(@)"

# Estimate costs
az consumption usage list \
  --start-date 2025-01-01 \
  --end-date 2025-01-31 \
  --query "[?contains(instanceName, 'storageb681')]"
```

### SAS Token Renewal

SAS tokens expire after 24 hours. The client automatically refreshes tokens 5 minutes before expiry. No manual intervention needed.

### Backup Strategy

User data is automatically backed up via:
1. **Snapshots** - User-initiated snapshots in `/snapshots/manual/`
2. **Auto-snapshots** - Daily automatic snapshots in `/snapshots/auto/`
3. **Anonymous profiles** - Original anonymous uploads remain in `profileblobs` container

---

## Troubleshooting

### Issue: "Failed to generate SAS token"

**Solution:** Check Azure Function logs:
```bash
az functionapp logs tail --name cleansheet-functions --resource-group Storage
```

Common causes:
- B2C token validation failed (check tenant ID, client ID)
- Storage account key incorrect
- User not authenticated properly

### Issue: "Sync failed: 404"

**Solution:** First sync - workspace doesn't exist yet. Run `syncUp()` first.

### Issue: "Migration not detecting anonymous profile"

**Solution:** Check blob prefix matches email:
```bash
az storage blob list \
  --container-name profileblobs \
  --account-name storageb681 \
  --prefix "your-email@example.com/"
```

### Issue: "Conflict detected"

**Solution:** Last-Write-Wins resolution should handle automatically. If issues persist, manually resolve:
```javascript
// Keep local
await cleansheetSync.syncUp()

// Keep remote
await cleansheetSync.syncDown()
```

---

## Cost Estimate

**Monthly costs for 1,000 active users:**

| Service | Cost |
|---------|------|
| Azure AD B2C | $0 (first 50,000 MAU free) |
| Azure Functions | $0-5 (consumption plan) |
| Blob Storage (238KB × 1000) | $0.42 |
| Blob Transactions (1,800/user) | $12 |
| **Total** | **~$13-18/month** |

**Scaling:**
- 10,000 users: ~$130-180/month
- 100,000 users: ~$1,300-1,800/month

---

## Next Steps

1. ✅ Azure AD B2C tenant configured
2. ✅ Storage container created
3. ✅ Azure Function deployed
4. ✅ Client libraries integrated
5. ✅ Migration logic implemented
6. ✅ Conflict resolution (LWW) configured

**Production checklist:**
- [ ] Test sign-up flow end-to-end
- [ ] Test migration with real anonymous profile
- [ ] Test multi-device sync
- [ ] Set up monitoring alerts
- [ ] Document user-facing features
- [ ] Create user onboarding guide

---

## Support

For issues or questions:
- GitHub: CleansheetLLC/Cleansheet
- Documentation: See `CLAUDE.md` for architecture details
- Azure Support: https://portal.azure.com → Support

---

**Last Updated:** 2025-11-13
**Version:** 1.0
