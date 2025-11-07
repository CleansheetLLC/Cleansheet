# Cleansheet Azure Deployment Guide

This guide explains how to deploy the Cleansheet static website to Azure Blob Storage.

## Prerequisites

1. **Azure CLI** installed
   ```bash
   # Install Azure CLI (Ubuntu/Debian)
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

   # Verify installation
   az --version
   ```

2. **Azure Account** with an active subscription

3. **Login to Azure**
   ```bash
   az login
   ```

## Initial Azure Setup

### 1. Create Resource Group (if not exists)

```bash
az group create \
  --name cleansheet-rg \
  --location eastus
```

### 2. Create Storage Account

```bash
az storage account create \
  --name cleansheetstatic \
  --resource-group cleansheet-rg \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2
```

**Note:** Storage account names must be:
- 3-24 characters
- Lowercase letters and numbers only
- Globally unique across Azure

### 3. Enable Static Website Hosting

```bash
az storage blob service-properties update \
  --account-name cleansheetstatic \
  --static-website \
  --index-document index.html \
  --404-document 404.html
```

### 4. Configure CORS (if needed for APIs)

```bash
az storage cors add \
  --account-name cleansheetstatic \
  --services b \
  --methods GET HEAD OPTIONS \
  --origins '*' \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600
```

## Deployment

### Option 1: Using the Deployment Script (Recommended)

1. **Edit Configuration** (first time only)
   ```bash
   cd /home/paulg/git/Cleansheet
   nano deploy-to-azure.sh
   ```

   Update these variables at the top:
   ```bash
   STORAGE_ACCOUNT="cleansheetstatic"  # Your storage account name
   RESOURCE_GROUP="cleansheet-rg"      # Your resource group
   ```

2. **Run Deployment**
   ```bash
   ./deploy-to-azure.sh
   ```

### Option 2: Manual Deployment

```bash
# Get storage account key
ACCOUNT_KEY=$(az storage account keys list \
  --resource-group cleansheet-rg \
  --account-name cleansheetstatic \
  --query "[0].value" -o tsv)

# Upload files
az storage blob upload-batch \
  --account-name cleansheetstatic \
  --account-key "$ACCOUNT_KEY" \
  --destination '$web' \
  --source . \
  --pattern "*" \
  --content-cache-control "public, max-age=3600" \
  --overwrite true
```

## Get Website URL

```bash
az storage account show \
  --name cleansheetstatic \
  --resource-group cleansheet-rg \
  --query "primaryEndpoints.web" -o tsv
```

Your website will be available at: `https://cleansheetstatic.z13.web.core.windows.net/`

## Custom Domain Setup (Optional)

### 1. Map Custom Domain

```bash
az storage account update \
  --name cleansheetstatic \
  --resource-group cleansheet-rg \
  --custom-domain www.cleansheet.info
```

### 2. Add CNAME Record

Add a CNAME record in your DNS provider:
```
Type: CNAME
Name: www
Value: cleansheetstatic.z13.web.core.windows.net
```

### 3. Enable HTTPS with Azure CDN (Recommended)

```bash
# Create CDN profile
az cdn profile create \
  --name cleansheet-cdn \
  --resource-group cleansheet-rg \
  --sku Standard_Microsoft

# Create CDN endpoint
az cdn endpoint create \
  --name cleansheet \
  --profile-name cleansheet-cdn \
  --resource-group cleansheet-rg \
  --origin cleansheetstatic.z13.web.core.windows.net \
  --origin-host-header cleansheetstatic.z13.web.core.windows.net

# Add custom domain to CDN
az cdn custom-domain create \
  --endpoint-name cleansheet \
  --hostname www.cleansheet.info \
  --name cleansheet-domain \
  --profile-name cleansheet-cdn \
  --resource-group cleansheet-rg

# Enable HTTPS
az cdn custom-domain enable-https \
  --endpoint-name cleansheet \
  --name cleansheet-domain \
  --profile-name cleansheet-cdn \
  --resource-group cleansheet-rg
```

## Automated Deployment with GitHub Actions

Create `.github/workflows/deploy-azure.yml`:

```yaml
name: Deploy to Azure Blob Storage

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Upload to Blob Storage
        run: |
          az storage blob upload-batch \
            --account-name cleansheetstatic \
            --destination '$web' \
            --source . \
            --pattern "*" \
            --content-cache-control "public, max-age=3600" \
            --overwrite true

      - name: Purge CDN (if using CDN)
        run: |
          az cdn endpoint purge \
            --resource-group cleansheet-rg \
            --profile-name cleansheet-cdn \
            --name cleansheet \
            --content-paths "/*"
```

### Setup GitHub Secrets

1. Create Service Principal:
   ```bash
   az ad sp create-for-rbac \
     --name "cleansheet-github-deploy" \
     --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/cleansheet-rg \
     --sdk-auth
   ```

2. Copy the JSON output and add as GitHub secret: `AZURE_CREDENTIALS`

## Troubleshooting

### Issue: "Storage account name already exists"
Storage account names must be globally unique. Try a different name.

### Issue: "Static website not working"
1. Verify static website is enabled
2. Check that `index.html` exists in the root
3. Wait 5-10 minutes for propagation

### Issue: "CORS errors"
Add CORS rules to your storage account (see setup step 4).

### Issue: "404 errors on refresh"
For single-page apps, configure error document as `index.html`:
```bash
az storage blob service-properties update \
  --account-name cleansheetstatic \
  --static-website \
  --index-document index.html \
  --404-document index.html
```

## Monitoring and Costs

### View Storage Metrics
```bash
az monitor metrics list \
  --resource /subscriptions/{sub-id}/resourceGroups/cleansheet-rg/providers/Microsoft.Storage/storageAccounts/cleansheetstatic \
  --metric-names Transactions
```

### Estimated Costs
- Storage Account (LRS): ~$0.02/GB/month
- Bandwidth: ~$0.08/GB (outbound)
- CDN (optional): ~$0.08/GB

For a typical static website (<1GB, <10GB/month traffic):
**Total: ~$1-2/month**

## Cleanup

To delete all resources:
```bash
az group delete --name cleansheet-rg --yes --no-wait
```

## Additional Resources

- [Azure Static Website Hosting](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)
- [Azure CDN Documentation](https://docs.microsoft.com/en-us/azure/cdn/)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/)
