# Azure Deployment Checklist

## Pre-Deployment: Files to Upload

### File Inventory (No External CSS!)
✅ **All CSS is inline in HTML files** - No separate CSS files need MIME type configuration

**HTML Files (MIME type: `text/html`)**
```
/web/index.html
/web/privacy-policy.html
/web/terms-of-service.html
/web/privacy-principles.html
/web/career-progression-navigator-mobile.html
/web/ml-pipeline-tour.html
/web/role-translator-mobile.html
/web/corpus/index.html
/web/corpus/*.html (188 article files)
```

**Image Files (MIME type: `image/png`)**
```
/branding/High Resolution Logo Files/White on transparent.png
```

**No JavaScript files to upload** - All JS is inline in HTML

**No CSS files to upload** - All CSS is inline in HTML

## Deployment Steps

### Step 1: Enable CORS (CRITICAL!)
This is the #1 reason hover effects don't work.

**Quick Method - Azure CLI:**
```bash
az storage cors add \
  --services b \
  --methods GET HEAD OPTIONS \
  --origins '*' \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600 \
  --account-name <your-storage-account-name>
```

**Detailed Instructions:** See `ENABLE_CORS.md`

### Step 2: Set Container Access Level

**Option A - Portal:**
1. Go to Storage Account → Containers
2. Select your container (usually `$web`)
3. Click "Change access level"
4. Select "Container (anonymous read access for container and blobs)"
5. Click OK

**Option B - Azure CLI:**
```bash
az storage container set-permission \
  --name '$web' \
  --public-access container \
  --account-name <your-storage-account-name>
```

### Step 3: Upload Files

**Upload HTML files with correct MIME type:**
```bash
# Upload all HTML files from web directory
az storage blob upload-batch \
  --account-name <your-storage-account-name> \
  --destination '$web' \
  --source ./platform/web \
  --content-type "text/html" \
  --pattern "*.html" \
  --overwrite

# Upload HTML files from corpus subdirectory
az storage blob upload-batch \
  --account-name <your-storage-account-name> \
  --destination '$web/corpus' \
  --source ./platform/web/corpus \
  --content-type "text/html" \
  --pattern "*.html" \
  --overwrite
```

**Upload logo image:**
```bash
# Upload branding directory
az storage blob upload-batch \
  --account-name <your-storage-account-name> \
  --destination 'branding' \
  --source ./platform/branding \
  --content-type "image/png" \
  --pattern "*.png" \
  --overwrite
```

### Step 4: Verify MIME Types

**Check a file's Content-Type:**
```bash
az storage blob show \
  --account-name <your-storage-account-name> \
  --container-name '$web' \
  --name 'index.html' \
  --query 'properties.contentSettings.contentType'
```

Should return: `"text/html"`

**Fix incorrect MIME type:**
```bash
az storage blob update \
  --account-name <your-storage-account-name> \
  --container-name '$web' \
  --name 'index.html' \
  --content-type 'text/html'
```

## Testing Checklist

### Immediate Tests (After Upload)

- [ ] **Main page loads**
  ```
  https://<storage-account>.blob.core.windows.net/$web/index.html
  ```

- [ ] **Logo displays in header**
  - Check: `https://<storage-account>.blob.core.windows.net/branding/High%20Resolution%20Logo%20Files/White%20on%20transparent.png`
  - Should display the logo image

- [ ] **Open browser DevTools (F12)**
  - Console tab: Check for errors
  - Network tab: Verify all resources load with status 200

### CSS & Hover Tests

- [ ] **Feature card hover effects work**
  - Hover over "Content Library" button
  - Should see color change and lift effect

- [ ] **Navigation button hover works**
  - Hover over "← Back to Home" links
  - Should see background color change

- [ ] **Font Awesome icons display**
  - Check for icon symbols in feature cards
  - Network tab: Verify Font Awesome CDN loads (status 200)

- [ ] **Google Fonts load**
  - Text should use Questrial (headings) and Barlow Light (body)
  - Network tab: Verify Google Fonts CDN loads

### Functional Tests

- [ ] **All internal links work**
  - Click "Content Library" → Should go to corpus/index.html
  - Click "Privacy & Terms" → Should go to privacy-principles.html
  - Click "← Back to Home" → Should return to index.html

- [ ] **Corpus library functions**
  - Search works
  - Expertise slider works
  - Tag filters work
  - Article slideout opens

- [ ] **Mobile responsive design**
  - Test on mobile device or DevTools mobile view
  - Filters collapse on mobile (corpus)
  - Home buttons don't obscure content
  - Logo scales properly

## Troubleshooting

### Logo Not Displaying

**Check in this order:**
1. URL-encoded path: `High%20Resolution%20Logo%20Files/White%20on%20transparent.png`
2. File actually uploaded: Check Azure Portal → Storage Browser
3. MIME type is `image/png`: Run blob show command above
4. Case-sensitive: Verify exact file name matches

**Quick test:**
```
https://<storage-account>.blob.core.windows.net/branding/High%20Resolution%20Logo%20Files/White%20on%20transparent.png
```
This URL should directly display the logo.

### Hover Effects Not Working

**Check in this order:**
1. ✅ CORS enabled (see Step 1)
2. ✅ HTML MIME type is `text/html`
3. ✅ Browser console shows no CORS errors
4. ✅ Container access level is public

**Common fix:**
```bash
# Re-enable CORS with OPTIONS method
az storage cors add \
  --services b \
  --methods GET HEAD OPTIONS \
  --origins '*' \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600 \
  --account-name <your-storage-account-name>
```

### CDN Resources Not Loading

**Check:**
- Google Fonts: `https://fonts.googleapis.com/css2?family=Barlow:wght@300&family=Questrial&display=swap`
- Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`

**If blocked:**
- Check firewall/network restrictions
- CORS should allow these external domains
- Try accessing CDN URLs directly in browser

## Production Recommendations

### 1. Use Custom Domain
```bash
az storage account update \
  --name <storage-account-name> \
  --custom-domain <your-domain.com>
```

### 2. Enable HTTPS
- Custom domains with HTTPS require Azure CDN
- See: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-custom-domain-name

### 3. Restrict CORS Origins
Replace `'*'` with your actual domain:
```bash
az storage cors add \
  --services b \
  --methods GET HEAD OPTIONS \
  --origins 'https://www.yoursite.com' \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600 \
  --account-name <your-storage-account-name>
```

### 4. Enable Logging
```bash
az monitor diagnostic-settings create \
  --resource <storage-account-resource-id> \
  --name 'StorageLogs' \
  --logs '[{"category": "StorageRead","enabled": true},{"category": "StorageWrite","enabled": true}]'
```

## Quick Reference Commands

**Upload everything:**
```bash
# HTML files
az storage blob upload-batch -d '$web' -s ./platform/web --pattern "*.html" --content-type "text/html" --account-name <name> --overwrite

# Images
az storage blob upload-batch -d 'branding' -s ./platform/branding --pattern "*.png" --content-type "image/png" --account-name <name> --overwrite
```

**Check CORS:**
```bash
az storage cors list --services b --account-name <name>
```

**Check access level:**
```bash
az storage container show --name '$web' --account-name <name> --query publicAccess
```

**View blob properties:**
```bash
az storage blob show --container-name '$web' --name 'index.html' --account-name <name>
```
