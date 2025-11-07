#!/bin/bash

# Azure ProfileBlobs Container Setup Script
# Creates a write-only blob container for storing large JSON profile data
# that exceeds the 32KB Azure Table Storage limit

set -e  # Exit on any error

# ============================================
# CONFIGURATION
# ============================================

STORAGE_ACCOUNT="storageb681"
RESOURCE_GROUP="Storage"  # Adjust if different
CONTAINER_NAME="profileblobs"  # Must be lowercase (Azure requirement)
LOCATION="eastus"  # Adjust if different

# SAS Token Configuration (matching ProfileRequests table expiration)
SAS_EXPIRY="2026-11-05T01:04Z"
SAS_PERMISSIONS="w"  # Write-only (cannot read, list, or delete)

# ============================================
# FUNCTIONS
# ============================================

print_header() {
    echo ""
    echo "================================================"
    echo "$1"
    echo "================================================"
}

print_info() {
    echo "[INFO] $1"
}

print_success() {
    echo "[SUCCESS] $1"
}

print_error() {
    echo "[ERROR] $1" >&2
}

# ============================================
# MAIN EXECUTION
# ============================================

print_header "Profile Blobs Container Setup"
echo "Storage Account: $STORAGE_ACCOUNT"
echo "Container Name: $CONTAINER_NAME (lowercase required by Azure)"
echo "SAS Expiry: $SAS_EXPIRY"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed."
    echo "Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi
print_info "Azure CLI is installed"

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure."
    echo "Run: az login"
    exit 1
fi
print_info "Logged in to Azure: $(az account show --query name -o tsv)"

# Verify storage account exists
print_header "Verifying Storage Account"
if ! az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    print_error "Storage account '$STORAGE_ACCOUNT' not found in resource group '$RESOURCE_GROUP'"
    exit 1
fi
print_success "Storage account '$STORAGE_ACCOUNT' verified"

# Get storage account key
print_info "Retrieving storage account key..."
ACCOUNT_KEY=$(az storage account keys list \
    --resource-group "$RESOURCE_GROUP" \
    --account-name "$STORAGE_ACCOUNT" \
    --query "[0].value" -o tsv)

# Create ProfileBlobs container
print_header "Creating ProfileBlobs Container"
if az storage container exists \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$ACCOUNT_KEY" \
    --name "$CONTAINER_NAME" \
    --query "exists" -o tsv | grep -q "true"; then
    print_info "Container '$CONTAINER_NAME' already exists"
else
    az storage container create \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --name "$CONTAINER_NAME" \
        --public-access off \
        --output none
    print_success "Container '$CONTAINER_NAME' created with private access"
fi

# Configure CORS for browser uploads
print_header "Configuring CORS"
az storage cors add \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$ACCOUNT_KEY" \
    --services b \
    --methods PUT OPTIONS \
    --origins '*' \
    --allowed-headers '*' \
    --exposed-headers '*' \
    --max-age 3600 \
    --output none 2>/dev/null || print_info "CORS already configured"
print_success "CORS configured for browser uploads"

# Generate write-only SAS token
print_header "Generating Write-Only SAS Token"
SAS_TOKEN=$(az storage container generate-sas \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$ACCOUNT_KEY" \
    --name "$CONTAINER_NAME" \
    --permissions w \
    --expiry "$SAS_EXPIRY" \
    --https-only \
    --output tsv)

# Construct full SAS URL
BLOB_ENDPOINT=$(az storage account show \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query "primaryEndpoints.blob" -o tsv)

CONTAINER_SAS_URL="${BLOB_ENDPOINT}${CONTAINER_NAME}?${SAS_TOKEN}"

print_success "SAS token generated successfully"

# Display results
print_header "Setup Complete"
echo ""
echo "Container URL: ${BLOB_ENDPOINT}${CONTAINER_NAME}"
echo ""
echo "Write-Only SAS URL (expires $SAS_EXPIRY):"
echo "----------------------------------------"
echo "$CONTAINER_SAS_URL"
echo "----------------------------------------"
echo ""
print_info "Add this constant to career-canvas.html:"
echo ""
echo "const PROFILE_BLOB_CONTAINER_URL = '$CONTAINER_SAS_URL';"
echo ""

# Usage documentation
print_header "Usage Pattern"
cat <<EOF

Blob Naming Convention:
  {email}/{timestamp}_{randomId}.json
  Example: user@example.com/20251107120530_a3f2k9.json

Table Storage Reference:
  Add 'blobName' field to ProfileRequests entities:
  {
    PartitionKey: 'ProfileRequest',
    RowKey: '20251107120530_a3f2k9',
    requestType: 'FullProfileExport',  // Defines processing logic
    email: 'user@example.com',
    blobName: 'user@example.com/20251107120530_a3f2k9.json',
    requestDate: '2025-11-07T12:05:30Z'
  }

Upload Workflow:
  1. Generate blob name: email/timestamp_random.json
  2. Upload JSON to blob storage (PUT request)
  3. Create table entity with blobName reference
  4. Backend processes blob based on requestType

Security Model:
  - Write-only SAS token (cannot read, list, or delete)
  - 10MB size limit enforced client-side
  - HTTPS only
  - No authentication required (anonymous uploads)
  - Blobs are private (only accessible with read SAS or account key)

EOF

# Test commands
print_header "Test Commands"
cat <<EOF

Test with curl:
--------------

# Create test JSON file
cat > test-profile.json <<'TESTEOF'
{
  "requestType": "TestUpload",
  "email": "test@example.com",
  "data": {
    "experiences": [],
    "stories": [],
    "goals": []
  }
}
TESTEOF

# Upload to blob storage
BLOB_NAME="test@example.com/\$(date +%Y%m%d%H%M%S)_test123.json"
curl -X PUT \\
  "${BLOB_ENDPOINT}${CONTAINER_NAME}/\${BLOB_NAME}?${SAS_TOKEN}" \\
  -H "x-ms-blob-type: BlockBlob" \\
  -H "Content-Type: application/json" \\
  -H "x-ms-meta-email: test@example.com" \\
  -H "x-ms-meta-requestdate: \$(date -u +%Y-%m-%dT%H:%M:%SZ)" \\
  --data-binary @test-profile.json

# Check response (should be 201 Created)
# Note: You CANNOT list or read blobs with this SAS token (write-only)

# To verify upload succeeded, use account key:
az storage blob show \\
  --account-name $STORAGE_ACCOUNT \\
  --account-key "\$ACCOUNT_KEY" \\
  --container-name profileblobs \\
  --name "\$BLOB_NAME"

EOF

print_success "ProfileBlobs container setup completed successfully!"
echo ""
