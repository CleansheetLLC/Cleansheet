# Enable CORS on Azure Blob Storage

## Method 1: Azure Portal (GUI)

### Step-by-Step:

1. **Navigate to Storage Account**
   - Go to [Azure Portal](https://portal.azure.com)
   - Find your Storage Account
   - Click on the storage account name

2. **Open CORS Settings**
   - In left sidebar, scroll down to "Settings" section
   - Click on **"Resource sharing (CORS)"**

3. **Add CORS Rule for Blob Service**
   - Click on **"Blob service"** tab at the top
   - Click **"+ Add"** button

4. **Configure CORS Rule**
   ```
   Allowed origins: *
   Allowed methods: GET, HEAD, OPTIONS
   Allowed headers: *
   Exposed headers: *
   Max age: 3600
   ```

5. **Save**
   - Click **"Save"** button at the top
   - Wait for confirmation message

## Method 2: Azure CLI

### Prerequisites:
```bash
# Install Azure CLI if not already installed
# Windows: Download from https://aka.ms/installazurecliwindows
# Or use: winget install -e --id Microsoft.AzureCLI

# Login to Azure
az login
```

### Enable CORS:
```bash
# Replace <your-storage-account-name> with your actual storage account name
az storage cors add \
  --services b \
  --methods GET HEAD OPTIONS \
  --origins '*' \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600 \
  --account-name <your-storage-account-name>
```

### For Windows PowerShell:
```powershell
az storage cors add `
  --services b `
  --methods GET HEAD OPTIONS `
  --origins '*' `
  --allowed-headers '*' `
  --exposed-headers '*' `
  --max-age 3600 `
  --account-name <your-storage-account-name>
```

### Verify CORS is enabled:
```bash
az storage cors list \
  --services b \
  --account-name <your-storage-account-name>
```

## Method 3: Azure PowerShell

```powershell
# Connect to Azure
Connect-AzAccount

# Set variables
$resourceGroupName = "your-resource-group-name"
$storageAccountName = "your-storage-account-name"

# Get storage account context
$ctx = (Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName).Context

# Create CORS rule
$CorsRules = (@{
    AllowedHeaders  = @("*");
    AllowedOrigins  = @("*");
    MaxAgeInSeconds = 3600;
    AllowedMethods  = @("Get", "Head", "Options");
    ExposedHeaders  = @("*");
})

# Set CORS rules for Blob service
Set-AzStorageCORSRule -ServiceType Blob -CorsRules $CorsRules -Context $ctx
```

## Method 4: Azure Storage Explorer

1. **Download Azure Storage Explorer**
   - Get it from: https://azure.microsoft.com/features/storage-explorer/

2. **Connect to your storage account**
   - Open Azure Storage Explorer
   - Sign in with your Azure account
   - Navigate to your storage account

3. **Configure CORS**
   - Right-click on **Blob Containers**
   - Select **"Configure CORS Settings"**
   - Add a new rule with:
     - Allowed origins: `*`
     - Allowed methods: `GET, HEAD, OPTIONS`
     - Allowed headers: `*`
     - Exposed headers: `*`
     - Max age: `3600`
   - Click **"Add"** then **"Apply"**

## What Each Setting Means:

- **Allowed origins (`*`)**: Allows requests from any domain
  - For production, replace `*` with your specific domain: `https://yourdomain.com`

- **Allowed methods (GET, HEAD, OPTIONS)**:
  - `GET` - Download files (HTML, CSS, images)
  - `HEAD` - Check if file exists
  - `OPTIONS` - Browser preflight requests

- **Allowed headers (`*`)**: Allows any request headers

- **Exposed headers (`*`)**: Allows browser to read all response headers

- **Max age (3600)**: Browser caches CORS decision for 1 hour (3600 seconds)

## Testing CORS Configuration

### Using Browser Developer Tools:
1. Open your site in browser
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Look for CORS errors (they'll appear in red)
5. After enabling CORS, refresh the page
6. CORS errors should be gone

### Using curl:
```bash
curl -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET" \
  -I https://<storage-account>.blob.core.windows.net/$web/index.html
```

Look for these headers in response:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
```

## Security Considerations

### For Production:
Replace `*` with your specific domain:

**Portal/CLI:**
```
Allowed origins: https://www.yoursite.com, https://yoursite.com
```

**CLI Command:**
```bash
az storage cors add \
  --services b \
  --methods GET HEAD OPTIONS \
  --origins 'https://www.yoursite.com' 'https://yoursite.com' \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600 \
  --account-name <your-storage-account-name>
```

### Why Restrict Origins?
- Prevents other websites from embedding your content
- Reduces bandwidth theft
- Improves security

## Troubleshooting

### CORS Still Not Working?

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh**: Ctrl+F5
3. **Try incognito/private window**
4. **Check container access level**: Should be "Container" or "Blob"
5. **Verify CORS rules saved**: Run list command to confirm

### Common Errors:

**"No 'Access-Control-Allow-Origin' header"**
- CORS not enabled or not saved properly
- Retry configuration steps

**"CORS preflight channel did not succeed"**
- OPTIONS method not allowed
- Add OPTIONS to allowed methods

**"CORS request blocked"**
- Allowed origins doesn't match your domain
- Use `*` for testing, specific domain for production

## Additional Resources

- [Azure CORS Documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services)
- [Static Website Hosting](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)
- [Configure CORS Rules](https://learn.microsoft.com/en-us/azure/storage/common/storage-cors-support)
