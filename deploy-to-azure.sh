#!/bin/bash

# Cleansheet Azure Blob Storage Deployment Script
# Syncs static website files to Azure Blob Storage

set -e  # Exit on any error

# ============================================
# CONFIGURATION
# ============================================

# Azure Storage Account settings (EDIT THESE)
STORAGE_ACCOUNT="cleansheetcorpus"  # Your storage account name
CONTAINER_NAME="web"              # Default container for static websites
RESOURCE_GROUP="Storage"      # Your resource group name

# Local repository path
REPO_DIR="/home/paulg/git/Cleansheet"

# Files and directories to exclude from sync
EXCLUDE_PATTERNS=(
    ".git/*"
    ".gitignore"
    "node_modules/*"
    "*.md"
    ".claude/*"
    "deploy-to-azure.sh"
    "*.py"
    "meta/*"
    "lexical-bundle/*"
    ".vscode/*"
    "*.swp"
    "*.bak"
    "*~"
)

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

check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check if Azure CLI is installed
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi
    print_info "Azure CLI is installed: $(az --version | head -n 1)"

    # Check if logged in to Azure
    if ! az account show &> /dev/null; then
        print_error "Not logged in to Azure. Run: az login"
        exit 1
    fi
    print_info "Logged in to Azure: $(az account show --query name -o tsv)"

    # Check if repository directory exists
    if [ ! -d "$REPO_DIR" ]; then
        print_error "Repository directory not found: $REPO_DIR"
        exit 1
    fi
    print_info "Repository directory found: $REPO_DIR"

    print_success "All prerequisites met!"
}

verify_storage_account() {
    print_header "Verifying Storage Account"

    # Check if storage account exists
    if ! az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        print_error "Storage account '$STORAGE_ACCOUNT' not found in resource group '$RESOURCE_GROUP'"
        print_info "Create one with: az storage account create --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --location eastus --sku Standard_LRS --kind StorageV2"
        exit 1
    fi

    print_info "Storage account '$STORAGE_ACCOUNT' verified"

    # Check if container exists and has public access
    ACCOUNT_KEY=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$STORAGE_ACCOUNT" \
        --query "[0].value" -o tsv)

    if ! az storage container exists \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --name "$CONTAINER_NAME" \
        --query "exists" -o tsv | grep -q "true"; then
        print_info "Container '$CONTAINER_NAME' does not exist. Creating it..."
        az storage container create \
            --account-name "$STORAGE_ACCOUNT" \
            --account-key "$ACCOUNT_KEY" \
            --name "$CONTAINER_NAME" \
            --public-access blob \
            --output none
        print_success "Container created with public blob access"
    else
        print_info "Container '$CONTAINER_NAME' exists"
    fi
}

build_exclude_params() {
    EXCLUDE_PARAMS=""
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        EXCLUDE_PARAMS="$EXCLUDE_PARAMS --exclude-pattern \"$pattern\""
    done
    echo "$EXCLUDE_PARAMS"
}

sync_files() {
    print_header "Syncing Files to Azure Blob Storage"

    cd "$REPO_DIR"

    print_info "Source: $REPO_DIR"
    print_info "Destination: $STORAGE_ACCOUNT/$CONTAINER_NAME"
    print_info "Excluding patterns: ${EXCLUDE_PATTERNS[*]}"

    # Get storage account key
    ACCOUNT_KEY=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$STORAGE_ACCOUNT" \
        --query "[0].value" -o tsv)

    # Sync files using az storage blob upload-batch
    print_info "Starting file upload..."

    # Upload with proper content types and cache control
    az storage blob upload-batch \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --destination "$CONTAINER_NAME" \
        --source "$REPO_DIR" \
        --pattern "*" \
        --content-cache-control "public, max-age=3600" \
        --overwrite true \
        --no-progress

    print_success "Files synced successfully!"
}

set_content_types() {
    print_header "Setting Content Types"

    # Get storage account key
    ACCOUNT_KEY=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$STORAGE_ACCOUNT" \
        --query "[0].value" -o tsv)

    # Set content type for HTML files
    print_info "Setting content-type for HTML files..."
    az storage blob update-batch \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --source "$CONTAINER_NAME" \
        --pattern "*.html" \
        --content-type "text/html; charset=utf-8" 2>/dev/null || true

    # Set content type for CSS files
    print_info "Setting content-type for CSS files..."
    az storage blob update-batch \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --source "$CONTAINER_NAME" \
        --pattern "*.css" \
        --content-type "text/css; charset=utf-8" 2>/dev/null || true

    # Set content type for JavaScript files
    print_info "Setting content-type for JavaScript files..."
    az storage blob update-batch \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --source "$CONTAINER_NAME" \
        --pattern "*.js" \
        --content-type "application/javascript; charset=utf-8" 2>/dev/null || true

    print_success "Content types set successfully!"
}

get_website_url() {
    print_header "Deployment Complete"

    # Get blob endpoint
    BLOB_ENDPOINT=$(az storage account show \
        --name "$STORAGE_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --query "primaryEndpoints.blob" -o tsv)

    # Construct the full container URL
    CONTAINER_URL="${BLOB_ENDPOINT}${CONTAINER_NAME}"

    print_success "Files deployed successfully!"
    echo ""
    echo "Blob Container URL: $CONTAINER_URL"
    echo "Example file URL:   ${CONTAINER_URL}/index.html"
    echo ""
    print_info "Note: Files in this container are publicly accessible."
    print_info "Access any file directly: ${CONTAINER_URL}/path/to/file.html"
}

# ============================================
# MAIN EXECUTION
# ============================================

main() {
    print_header "Cleansheet Azure Deployment"
    echo "Starting deployment at $(date)"

    check_prerequisites
    verify_storage_account
    sync_files
    set_content_types
    get_website_url

    echo ""
    print_success "Deployment completed successfully at $(date)"
}

# Run main function
main
