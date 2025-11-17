#!/bin/bash

# Cleansheet End-to-End Test Orchestration
# Deploys to Azure and runs automated browser tests

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo "================================================"
    echo "$1"
    echo "================================================"
}

# Test configuration
TEST_URL="https://cleansheetcorpus.blob.core.windows.net/web/career-canvas.html"
QUICK_DEPLOY=${1:-false}  # Use quick deploy by default

print_header "Cleansheet E2E Test Suite"
echo "Test URL: $TEST_URL"
echo "Mode: ${QUICK_DEPLOY}"
echo ""

# Step 1: Deploy to Azure
print_header "Step 1: Deploy to Azure"

if [ "$QUICK_DEPLOY" = "quick" ]; then
    print_info "Using quick deploy (main file only)..."
    ./quick-deploy.sh career-canvas.html
elif [ "$QUICK_DEPLOY" = "full" ]; then
    print_info "Using full deploy (all files)..."
    ./deploy-to-azure.sh
else
    print_warning "Skipping deploy (use 'quick' or 'full' as argument to deploy)"
fi

# Wait for Azure propagation
if [ "$QUICK_DEPLOY" != "false" ]; then
    print_info "Waiting 3 seconds for Azure propagation..."
    sleep 3
fi

# Step 2: Check if test dependencies are installed
print_header "Step 2: Check Test Dependencies"

if [ ! -d "tests/node_modules" ]; then
    print_warning "Test dependencies not installed"
    print_info "Installing Playwright and dependencies..."

    cd tests
    npm install
    npx playwright install chromium
    cd ..

    print_success "Dependencies installed!"
else
    print_info "Dependencies already installed"
fi

# Step 3: Run tests
print_header "Step 3: Run Automated Tests"

print_info "Running Playwright tests..."

cd tests

# Run tests with nice output
if npx playwright test --reporter=list; then
    print_success "All tests passed! ✓"
    EXIT_CODE=0
else
    print_error "Some tests failed ✗"
    EXIT_CODE=1
fi

cd ..

# Step 4: Summary
print_header "Test Summary"

if [ $EXIT_CODE -eq 0 ]; then
    print_success "All E2E tests passed!"
    echo ""
    print_info "Test URL: $TEST_URL"
    print_info "View test report: tests/playwright-report/index.html"
else
    print_error "Some tests failed. Check output above for details."
    print_info "View detailed report: tests/playwright-report/index.html"
    print_info "View test traces: tests/test-results/"
fi

exit $EXIT_CODE
