#!/bin/bash
# Azure Blob Storage setup for authenticated user workspaces
# Creates userworkspaces container in existing storageb681 account

set -e  # Exit on error

STORAGE_ACCOUNT="storageb681"
CONTAINER_NAME="userworkspaces"
RESOURCE_GROUP="Storage"  # Adjust if different

echo "=========================================="
echo "Cleansheet User Workspaces Container Setup"
echo "=========================================="
echo ""
echo "Storage Account: $STORAGE_ACCOUNT"
echo "Container: $CONTAINER_NAME"
echo "Resource Group: $RESOURCE_GROUP"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Install from: https://aka.ms/InstallAzureCLIDeb"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Run: az login"
    exit 1
fi

echo "✓ Azure CLI authenticated"
echo ""

# Create container for authenticated user workspaces
echo "Creating container: $CONTAINER_NAME"
az storage container create \
    --name $CONTAINER_NAME \
    --account-name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --public-access off \
    --fail-on-exist

if [ $? -eq 0 ]; then
    echo "✓ Container created successfully"
else
    echo "⚠ Container may already exist"
fi

echo ""
echo "=========================================="
echo "Container Setup Complete"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Deploy Azure Function for SAS token generation"
echo "2. Configure CORS if needed:"
echo "   az storage cors add \\"
echo "     --services b \\"
echo "     --methods GET PUT POST DELETE OPTIONS \\"
echo "     --origins 'https://www.cleansheet.info' 'http://localhost:8000' \\"
echo "     --allowed-headers '*' \\"
echo "     --exposed-headers '*' \\"
echo "     --max-age 3600 \\"
echo "     --account-name $STORAGE_ACCOUNT"
echo ""
echo "Container: $CONTAINER_NAME is ready for use"
