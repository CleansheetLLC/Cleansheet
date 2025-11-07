#!/bin/bash

# Cleansheet Azure Initial Setup Script
# Run this once to create all required Azure resources

set -e

# ============================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================

STORAGE_ACCOUNT="cleansheetstatic"    # Must be globally unique, 3-24 chars, lowercase/numbers only
RESOURCE_GROUP="cleansheet-rg"
LOCATION="eastus"                     # Options: eastus, westus2, centralus, etc.

# ============================================
# DO NOT EDIT BELOW THIS LINE
# ============================================

echo "================================================"
echo "Cleansheet Azure Initial Setup"
echo "================================================"
echo ""
echo "This script will create:"
echo "  - Resource Group: $RESOURCE_GROUP"
echo "  - Storage Account: $STORAGE_ACCOUNT"
echo "  - Enable static website hosting"
echo "  - Configure CORS"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 1
fi

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "[ERROR] Azure CLI is not installed."
    echo "Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo "[ERROR] Not logged in to Azure."
    echo "Run: az login"
    exit 1
fi

echo "[INFO] Logged in as: $(az account show --query user.name -o tsv)"
echo "[INFO] Subscription: $(az account show --query name -o tsv)"
echo ""

# Create resource group
echo "[STEP 1/5] Creating resource group..."
if az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo "  Resource group already exists: $RESOURCE_GROUP"
else
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --output none
    echo "  ✓ Created resource group: $RESOURCE_GROUP"
fi

# Create storage account
echo "[STEP 2/5] Creating storage account..."
if az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo "  Storage account already exists: $STORAGE_ACCOUNT"
else
    az storage account create \
        --name "$STORAGE_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Standard_LRS \
        --kind StorageV2 \
        --output none
    echo "  ✓ Created storage account: $STORAGE_ACCOUNT"
fi

# Enable static website hosting
echo "[STEP 3/5] Enabling static website hosting..."
az storage blob service-properties update \
    --account-name "$STORAGE_ACCOUNT" \
    --static-website \
    --index-document "index.html" \
    --404-document "index.html" \
    --output none
echo "  ✓ Static website hosting enabled"

# Configure CORS
echo "[STEP 4/5] Configuring CORS..."
az storage cors add \
    --account-name "$STORAGE_ACCOUNT" \
    --services b \
    --methods GET HEAD OPTIONS \
    --origins '*' \
    --allowed-headers '*' \
    --exposed-headers '*' \
    --max-age 3600 \
    --output none 2>/dev/null || echo "  CORS already configured"
echo "  ✓ CORS configured"

# Get website URL
echo "[STEP 5/5] Getting website URL..."
WEB_ENDPOINT=$(az storage account show \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query "primaryEndpoints.web" -o tsv)

echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Storage Account: $STORAGE_ACCOUNT"
echo "Resource Group: $RESOURCE_GROUP"
echo "Website URL: $WEB_ENDPOINT"
echo ""
echo "Next steps:"
echo "  1. Edit deploy-to-azure.sh and update STORAGE_ACCOUNT and RESOURCE_GROUP"
echo "  2. Run ./deploy-to-azure.sh to deploy your website"
echo ""
echo "Full documentation: See DEPLOYMENT.md"
echo ""
