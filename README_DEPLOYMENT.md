# Cleansheet Platform - Azure Deployment Guide

## Quick Start

1. **Enable CORS** (Required for hover effects)
   ```bash
   az storage cors add --services b --methods GET HEAD OPTIONS --origins '*' --allowed-headers '*' --exposed-headers '*' --max-age 3600 --account-name cleansheetcorpus
   ```

2. **Upload Files**
   ```bash
   # HTML files
   az storage blob upload-batch --account-name cleansheetcorpus --destination 'web' --source ./platform/web --content-type "text/html" --pattern "*.html" --overwrite

   # Corpus articles
   az storage blob upload-batch --account-name cleansheetcorpus --destination 'web/corpus' --source ./platform/web/corpus --content-type "text/html" --pattern "*.html" --overwrite

   # Assets (logo files with spaces in directory names)
   az storage blob upload-batch --account-name cleansheetcorpus --destination 'web/assets' --source ./platform/branding --content-type "image/png" --pattern "*.png" --overwrite
   ```

3. **Set Permissions**
   ```bash
   az storage container set-permission --name 'web' --public-access container --account-name cleansheetcorpus
   ```

4. **Test**
   - https://cleansheetcorpus.blob.core.windows.net/web/index.html
   - https://cleansheetcorpus.blob.core.windows.net/web/assets/High%20Resolution%20Logo%20Files/White%20on%20transparent.png

## Files in This Directory

- **FIXED_DEPLOYMENT.md** - What was fixed (no more spaces in paths!)
- **ENABLE_CORS.md** - Detailed CORS setup guide (4 methods)
- **DEPLOYMENT_CHECKLIST.md** - Complete testing checklist
- **AZURE_DEPLOYMENT.md** - Original deployment guide
- **upload-to-azure.ps1** - PowerShell upload script (from FIXED_DEPLOYMENT.md)

## Key Points

✅ **All CSS is inline** - No external CSS files to configure
✅ **All JS is inline** - No external JS files to configure
✅ **Logo references Azure path** - HTML files reference `assets/High%20Resolution%20Logo%20Files/White%20on%20transparent.png`
✅ **Favicon added** - No more 404 errors
✅ **CORS required** - For hover effects to work

## Common Issues Solved

| Error | Solution |
|-------|----------|
| 404 favicon.ico | ✅ Added favicon link to all HTML files |
| 404 logo not found | ✅ Updated paths to match Azure blob storage structure |
| Hover not working | ➡️ Enable CORS (see command above) |
| Logo not displaying | ✅ Upload branding directory to web/assets/ |

## Directory Structure

**Local:**
```
platform/
├── branding/
│   └── High Resolution Logo Files/
│       └── White on transparent.png
└── web/
    ├── index.html
    ├── corpus/
    │   └── index.html
    └── (other HTML files)
```

**Azure (web container):**
```
web/
├── index.html
├── corpus/
│   └── index.html
├── assets/
│   └── High Resolution Logo Files/
│       └── White on transparent.png
└── (other HTML files)
```

## MIME Types

Azure needs these MIME types (set via --content-type):

- `.html` → `text/html` (contains inline CSS and JS)
- `.png` → `image/png`

That's it! No CSS or JS files exist as separate files.

## Test Your Deployment

1. Open browser to your index.html URL
2. Press F12 (Developer Tools)
3. Check Console tab:
   - ✅ No 404 errors (favicon fixed)
   - ✅ No 400 errors (logo path fixed)
   - ✅ No CORS errors (if you ran CORS command)
4. Check Network tab:
   - ✅ All resources status 200
   - ✅ Google Fonts loading
   - ✅ Font Awesome loading
5. Test hover on feature cards:
   - ✅ Should see color change and lift effect

## Need Help?

See the detailed guides:
- **CORS setup** → `ENABLE_CORS.md`
- **Full checklist** → `DEPLOYMENT_CHECKLIST.md`
- **What changed** → `FIXED_DEPLOYMENT.md`
