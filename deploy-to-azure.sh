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

    # Build exclude parameters
    EXCLUDE_PARAMS=""
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        EXCLUDE_PARAMS="$EXCLUDE_PARAMS --exclude-path \"$pattern\""
    done

    print_info "Starting incremental sync (only changed files)..."

    # Use azcopy sync for much faster incremental uploads
    # This only uploads files that have changed
    az storage blob sync \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$ACCOUNT_KEY" \
        --container "$CONTAINER_NAME" \
        --source "$REPO_DIR" \
        $EXCLUDE_PARAMS \
        --delete-destination false 2>&1 | tee /tmp/deploy-output.log

    # Count uploaded files from output
    UPLOADED=$(grep -c "Uploading" /tmp/deploy-output.log || echo "0")
    SKIPPED=$(grep -c "Skipping" /tmp/deploy-output.log || echo "0")

    print_success "Sync complete!"
    print_info "Files uploaded: $UPLOADED"
    print_info "Files skipped (unchanged): $SKIPPED"
}

set_content_types() {
    print_header "Setting Content Types"

    print_info "Content types are automatically set by az storage blob sync"
    print_info "HTML: text/html, CSS: text/css, JS: application/javascript"
    print_success "Content types configured!"
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
