# Career Canvas Authentication & Sync Integration Guide

## Overview

Authentication and workspace synchronization have been integrated into `career-canvas.html`. This enables:
- ✅ Microsoft Entra ID authentication
- ✅ Cloud-based workspace storage
- ✅ Multi-device synchronization
- ✅ Secure user-specific data access

## What Was Added

### 1. Libraries (in `<head>`)

```html
<!-- MSAL Authentication -->
<script src="https://cdn.jsdelivr.net/npm/@azure/msal-browser@2.38.0/lib/msal-browser.min.js"></script>

<!-- Cleansheet Auth & Sync -->
<script src="shared/cleansheet-auth-msal.js"></script>
<script src="shared/cleansheet-sync.js"></script>
```

### 2. Configuration & Initialization (in main `<script>`)

```javascript
const authConfig = {
    clientId: '365cb98b-a67e-48fe-ab87-4b79a91af651',
    tenantId: 'd0c94b5c-2d4a-4dbc-8690-f7a434b2ffdb',
    authority: 'https://login.microsoftonline.com/d0c94b5c-2d4a-4dbc-8690-f7a434b2ffdb',
    redirectUri: window.location.origin + window.location.pathname,
    tokenEndpoint: 'https://cleansheet-functions-b6dze5ece9d4fefr.eastus2-01.azurewebsites.net/api/user/sas-token',
    storageAccount: 'storageb681',
    containerName: 'userworkspaces'
};

const auth = new CleansheetAuth(authConfig);
const sync = new CleansheetSync(auth, authConfig);
```

### 3. Global Variables

```javascript
let isAuthenticated = false;
let currentUser = null;
```

### 4. Helper Functions

- `signIn()` - Initiates Microsoft sign-in flow
- `signOut()` - Signs out user and clears session
- `updateAuthUI()` - Updates UI based on auth state (customize this!)

## How to Use

### Option 1: Add Sign-In Button to Header

Add a sign-in/out button to your existing UI:

```html
<button id="auth-button" onclick="handleAuthClick()" style="display: none;">
    Sign In with Microsoft
</button>
<span id="user-info" style="display: none;"></span>
```

Then in your JavaScript:

```javascript
function updateAuthUI() {
    const authButton = document.getElementById('auth-button');
    const userInfo = document.getElementById('user-info');

    if (isAuthenticated && currentUser) {
        authButton.textContent = 'Sign Out';
        authButton.style.display = 'inline-block';
        userInfo.textContent = currentUser.email;
        userInfo.style.display = 'inline';
    } else {
        authButton.textContent = 'Sign In with Microsoft';
        authButton.style.display = 'inline-block';
        userInfo.style.display = 'none';
    }
}

async function handleAuthClick() {
    if (isAuthenticated) {
        await signOut();
    } else {
        await signIn();
    }
}
```

### Option 2: Auto-Prompt on First Visit

Add this to the window load event handler:

```javascript
window.addEventListener('load', async () => {
    await auth.handleRedirectCallback();

    if (auth.isAuthenticated()) {
        // User is signed in
        isAuthenticated = true;
        currentUser = auth.getUser();
        await sync.initialize();
        updateAuthUI();
    } else {
        // First visit - show welcome message with sign-in option
        if (!localStorage.getItem('cleansheet_visited')) {
            // Show modal/toast asking user to sign in
            localStorage.setItem('cleansheet_visited', 'true');
        }
    }
});
```

## Replacing localStorage with Cloud Sync

### Before (localStorage only):

```javascript
// Save workspace data
const workspaceData = {
    documents: documents,
    projects: projects,
    forms: forms,
    reports: reports
};
localStorage.setItem(`workspace_${currentPersona}`, JSON.stringify(workspaceData));
```

### After (with optional cloud sync):

```javascript
// Save workspace data
const workspaceData = {
    documents: documents,
    projects: projects,
    forms: forms,
    reports: reports
};

// Always save to localStorage (instant, works offline)
localStorage.setItem(`workspace_${currentPersona}`, JSON.stringify(workspaceData));

// Also sync to cloud if authenticated
if (isAuthenticated) {
    try {
        await sync.saveWorkspace(workspaceData);
        console.log('✓ Workspace synced to cloud');
    } catch (error) {
        console.error('Sync failed:', error);
        // Continue working with localStorage
    }
}
```

### Loading Data (with cloud sync):

```javascript
async function loadWorkspaceData() {
    let workspaceData = null;

    // Try cloud sync first if authenticated
    if (isAuthenticated) {
        try {
            workspaceData = await sync.getWorkspace();
            if (workspaceData) {
                console.log('✓ Loaded workspace from cloud');
                // Also update localStorage as cache
                localStorage.setItem(`workspace_${currentPersona}`, JSON.stringify(workspaceData));
                return workspaceData;
            }
        } catch (error) {
            console.error('Cloud load failed:', error);
        }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(`workspace_${currentPersona}`);
    if (stored) {
        workspaceData = JSON.parse(stored);
        console.log('✓ Loaded workspace from localStorage');
    }

    return workspaceData || getDefaultWorkspace();
}
```

## Sync API Reference

### CleansheetAuth Methods

```javascript
// Check if user is authenticated
auth.isAuthenticated()  // Returns: boolean

// Get current user info
auth.getUser()  // Returns: { email, name, id }

// Sign in (redirects to Microsoft login)
await auth.signIn()

// Sign out
await auth.signOut()

// Get SAS token (called automatically by sync)
await auth.getSasToken()
```

### CleansheetSync Methods

```javascript
// Initialize sync (call after authentication)
await sync.initialize()

// Save entire workspace (overwrites)
await sync.saveWorkspace(workspaceData)

// Get workspace from cloud
const data = await sync.getWorkspace()

// Upload individual blob
await sync.uploadBlob(blobName, data, contentType)

// Download individual blob
const data = await sync.downloadBlob(blobName)

// List all blobs in workspace
const blobs = await sync.listBlobs()

// Delete a blob
await sync.deleteBlob(blobName)
```

## Sync Events

Listen for sync events:

```javascript
sync.addEventListener('sync_start', (data) => {
    console.log('Sync started:', data.direction);
    // Show loading indicator
});

sync.addEventListener('sync_complete', (data) => {
    console.log('Sync complete:', data.direction);
    // Hide loading indicator
    // Update UI with synced data
});

sync.addEventListener('sync_error', (data) => {
    console.error('Sync error:', data.error);
    // Show error message to user
});
```

## Testing the Integration

### Local Testing (http://localhost:8000)

1. Start a local web server:
   ```bash
   cd /home/paulg/git/Cleansheet
   python3 -m http.server 8000
   ```

2. Open browser to: http://localhost:8000/career-canvas.html

3. Click "Sign In" (or whatever UI you added)

4. Sign in with Microsoft account

5. Open browser console - you should see:
   ```
   ✓ User authenticated: your.email@domain.com
   ✓ Workspace sync initialized
   ```

6. Make changes to your workspace data

7. Verify sync by:
   - Opening a different browser
   - Signing in with same account
   - Seeing your data appear automatically

### Production Testing (Azure Blob Storage)

Upload to blob storage and test:

```bash
az storage blob upload \
  --account-name cleansheetcorpus \
  --container-name web \
  --name career-canvas.html \
  --file /home/paulg/git/Cleansheet/career-canvas.html \
  --content-type "text/html" \
  --overwrite
```

Then visit: https://cleansheetcorpus.blob.core.windows.net/web/career-canvas.html

## Deployment Checklist

Before deploying to production:

- [ ] Test authentication flow end-to-end
- [ ] Test multi-device sync (same user, different browsers)
- [ ] Test offline mode (localStorage fallback works)
- [ ] Add sign-in/out UI elements
- [ ] Customize `updateAuthUI()` function
- [ ] Test on mobile devices
- [ ] Add error handling for network failures
- [ ] Add loading indicators for sync operations
- [ ] Update redirect URIs if using custom domain
- [ ] Document any workspace data schema changes

## Production Redirect URIs

Currently configured:
- ✅ https://cleansheetcorpus.blob.core.windows.net/web/career-canvas.html
- ✅ http://localhost:8000/career-canvas.html

To add more:

```bash
# Edit /tmp/spa-manifest.json and add your URL
az rest --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications/$(az ad app show --id 365cb98b-a67e-48fe-ab87-4b79a91af651 --query id -o tsv)" \
  --headers "Content-Type=application/json" \
  --body @/tmp/spa-manifest.json
```

## Troubleshooting

### "Redirect URI mismatch" error
- Check that the URL exactly matches what's in Entra ID app registration
- Include protocol (http:// or https://)
- Include port for localhost (e.g., :8000)

### Sync fails with 403 error
- SAS token expired (24 hour limit) - sign out and sign back in
- CORS not configured on storage account
- Check browser console for detailed error

### Authentication loops/doesn't complete
- Clear browser cache and cookies
- Check browser console for MSAL errors
- Verify clientId and tenantId in authConfig

### Data not syncing
- Check that `auth.isAuthenticated()` returns true
- Check that `sync.initialize()` completed successfully
- Verify workspace data format (must be JSON-serializable)

## Next Steps

1. **Add UI elements** for sign-in/out in your header or settings
2. **Replace localStorage** calls with sync methods (gradually)
3. **Test thoroughly** with multiple devices/browsers
4. **Add sync status indicators** (syncing, synced, error)
5. **Handle offline mode** gracefully
6. **Monitor** Azure Function costs and usage

## Support

For issues or questions:
- Check Azure Function logs in Application Insights
- Review browser console for client-side errors
- See `DEPLOYMENT_GUIDE_SYNC.md` for detailed deployment info
