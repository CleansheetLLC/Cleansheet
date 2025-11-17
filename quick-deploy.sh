#!/bin/bash

# Cleansheet Quick Deploy - Ultra-fast deployment for testing
# Only uploads specified file(s) - perfect for rapid dev/test iterations

set -e

# Azure Storage Account settings
STORAGE_ACCOUNT="cleansheetcorpus"
CONTAINER_NAME="web"
RESOURCE_GROUP="Storage"
REPO_DIR="/home/paulg/git/Cleansheet"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Get target file/directory from argument (default: career-canvas.html)
TARGET="${1:-career-canvas.html}"

print_info "Quick Deploy - Uploading: $TARGET"

# Get storage account key
ACCOUNT_KEY=$(az storage account keys list \
    --resource-group "$RESOURCE_GROUP" \
    --account-name "$STORAGE_ACCOUNT" \
    --query "[0].value" -o tsv 2>/dev/null)

if [ -z "$ACCOUNT_KEY" ]; then
    print_warning "Not logged in to Azure. Run: az login"
    exit 1
fi

cd "$REPO_DIR"

# Check if target exists
if [ ! -e "$TARGET" ]; then
    print_warning "File/directory not found: $TARGET"
    exit 1
fi

# Upload file or directory
if [ -f "$TARGET" ]; then
    # Single file upload
    print_info "Uploading single file..."

    # Determine content type based on extension
    CONTENT_TYPE="application/octet-stream"
    case "$TARGET" in
        *.html) CONTENT_TYPE="text/html; charset=utf-8" ;;
        *.css)  CONTENT_TYPE="text/css; charset=utf-8" ;;
        *.js)   CONTENT_TYPE="application/javascript; charset=utf-8" ;;
        *.json) CONTENT_TYPE="application/json; charset=utf-8" ;;
        *.png)  CONTENT_TYPE="image/png" ;;
        *.jpg|*.jpeg) CONTENT_TYPE="image/jpeg" ;;
        *.svg)  CONTENT_TYPE="image/svg+xml" ;;
    esac

    az storage blob upload \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --container-name "$CONTAINER_NAME" \
        --name "$TARGET" \
        --file "$TARGET" \
        --content-type "$CONTENT_TYPE" \
        --content-cache-control "public, max-age=3600" \
        --overwrite true \
        --no-progress 2>&1 | grep -v "Percent complete" || true

    FILE_SIZE=$(stat -f%z "$TARGET" 2>/dev/null || stat -c%s "$TARGET" 2>/dev/null)
    FILE_SIZE_KB=$((FILE_SIZE / 1024))

    print_success "Uploaded: $TARGET (${FILE_SIZE_KB} KB)"

elif [ -d "$TARGET" ]; then
    # Directory upload
    print_info "Uploading directory..."

    az storage blob upload-batch \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --destination "$CONTAINER_NAME" \
        --source "$TARGET" \
        --pattern "*" \
        --overwrite true \
        --no-progress 2>&1 | grep -E "^(Uploading|Skipping)" || true

    print_success "Uploaded directory: $TARGET"
fi

# Show URL
BLOB_ENDPOINT=$(az storage account show \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query "primaryEndpoints.blob" -o tsv)

FILE_URL="${BLOB_ENDPOINT}${CONTAINER_NAME}/$TARGET"

echo ""
print_success "Deploy complete!"
print_info "URL: $FILE_URL"
echo ""
print_info "Tip: Use 'quick-deploy.sh shared/' to deploy a directory"
