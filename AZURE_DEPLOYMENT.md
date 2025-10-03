# Azure Blob Storage Deployment Guide

## Common Issues and Solutions

### Logo Images Not Loading

**Issue:** Logo images don't display when uploaded to Azure Blob Storage.

**Causes:**
1. **Spaces in file paths** - URLs with spaces need to be URL-encoded
2. **Relative paths** - `../` paths might not resolve correctly in blob storage
3. **Case sensitivity** - Azure Blob Storage is case-sensitive
4. **MIME types** - Images need correct Content-Type headers

**Solutions:**
- ✅ All logo paths now use URL encoding: `High%20Resolution%20Logo%20Files/White%20on%20transparent.png`
- Check blob properties and ensure Content-Type is set to `image/png`
- Verify file names match exactly (case-sensitive)

### Hover Effects Not Working

**Issue:** CSS hover effects don't work on buttons.

**Important Note:** ✅ **All CSS is inline in HTML files** - No external CSS files exist in this project, so MIME type issues with CSS files are NOT the problem.

**Most Likely Cause:** CORS configuration

**Solutions:**

1. **Enable CORS on the storage account** (Most Important!)
   - See `ENABLE_CORS.md` for detailed step-by-step instructions
   - Quick command:
   ```bash
   az storage cors add \
     --services b \
     --methods GET HEAD OPTIONS \
     --origins '*' \
     --allowed-headers '*' \
     --exposed-headers '*' \
     --max-age 3600 \
     --account-name <your-storage-account>
   ```

2. **Set correct MIME types when uploading:**
   - `.html` → `text/html` (contains inline CSS)
   - `.js` → `application/javascript`
   - `.png` → `image/png`
   - `.jpg` → `image/jpeg`
   - ❌ No `.css` files exist (all CSS is inline)

3. **Set blob access level:**
   - Container access level should be "Blob (anonymous read access for blobs only)"
   - Or use "Container (anonymous read access for container and blobs)"

4. **Check browser console:**
   - Open Developer Tools (F12)
   - Check Console tab for CORS errors (most common issue)
   - Check Network tab to see if HTML files are loading (should be 200 status)
   - Verify Google Fonts and Font Awesome CDN links are loading

### File Upload Commands

**Using Azure CLI:**
```bash
# Upload entire directory preserving structure
az storage blob upload-batch \
  --account-name <storage-account-name> \
  --destination '$web' \
  --source ./platform/web \
  --content-type "text/html" \
  --pattern "*.html"

az storage blob upload-batch \
  --account-name <storage-account-name> \
  --destination '$web' \
  --source ./platform/branding \
  --content-type "image/png" \
  --pattern "*.png"
```

**Using Azure Storage Explorer:**
1. Right-click container → Properties
2. Set "Public access level" to "Container"
3. Upload files
4. Select each file → Properties → Set Content-Type

### Directory Structure in Azure

Your blob container should mirror the local structure:
```
/web
  /index.html
  /privacy-policy.html
  /terms-of-service.html
  /privacy-principles.html
  /career-progression-navigator-mobile.html
  /ml-pipeline-tour.html
  /role-translator-mobile.html
  /corpus
    /index.html
    /*.html (188 article files)
/branding
  /High Resolution Logo Files
    /White on transparent.png
```

### Testing Checklist

After deployment, verify:

- [ ] Main page loads: `https://<account>.blob.core.windows.net/$web/index.html`
- [ ] Logo displays in header
- [ ] Hover effects work on feature cards
- [ ] All internal links work (navigation between pages)
- [ ] Font Awesome icons display
- [ ] Google Fonts load (Questrial and Barlow)
- [ ] Corpus library filters work
- [ ] Mobile responsive design works

### Debugging Steps

1. **Open browser developer tools (F12)**

2. **Check Console tab for errors:**
   - CORS errors → Enable CORS on storage account
   - 404 errors → File path is wrong
   - MIME type warnings → Set correct Content-Type

3. **Check Network tab:**
   - Filter by CSS - should see status 200
   - Filter by Images - logos should load with 200
   - Check Response Headers for Content-Type

4. **Check specific files:**
   ```
   https://<account>.blob.core.windows.net/$web/branding/High%20Resolution%20Logo%20Files/White%20on%20transparent.png
   ```

5. **Verify inline styles work:**
   - If inline CSS works but external doesn't → MIME type issue
   - If nothing works → CORS or access level issue

## Alternative: Use Azure CDN

For better performance and caching:

1. Create Azure CDN endpoint
2. Point origin to blob storage
3. Enable HTTPS
4. Update all URLs to use CDN endpoint

## Questions to Answer

If issues persist, check:

1. What's the exact URL you're accessing?
2. What errors appear in browser console?
3. Are CSS files returning 200 or 404?
4. What's the Content-Type header on CSS files?
5. Is the container public or requiring authentication?
