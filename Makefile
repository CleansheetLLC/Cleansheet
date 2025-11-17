# Cleansheet Development & Testing Makefile
# Provides convenient commands for deployment and testing

.PHONY: help test quick-deploy full-deploy test-quick test-full install-test-deps clean

# Default target
help:
	@echo "Cleansheet Development Commands:"
	@echo ""
	@echo "Deployment:"
	@echo "  make quick-deploy    - Fast deploy (main file only, ~5 seconds)"
	@echo "  make full-deploy     - Full deploy (all files, optimized)"
	@echo ""
	@echo "Testing:"
	@echo "  make test            - Run E2E tests (no deploy)"
	@echo "  make test-quick      - Quick deploy + run tests"
	@echo "  make test-full       - Full deploy + run tests"
	@echo "  make install-test    - Install test dependencies"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean           - Remove test artifacts"
	@echo "  make open-test-url   - Open test URL in browser"
	@echo ""

# Quick deployment (main file only)
quick-deploy:
	@echo "🚀 Quick deploying career-canvas.html..."
	./quick-deploy.sh

# Full deployment (all files)
full-deploy:
	@echo "🚀 Full deploying all files..."
	./deploy-to-azure.sh

# Run tests without deploying
test:
	@echo "🧪 Running E2E tests..."
	./test-e2e.sh false

# Quick deploy + test
test-quick:
	@echo "🚀 Quick deploy + test..."
	./test-e2e.sh quick

# Full deploy + test
test-full:
	@echo "🚀 Full deploy + test..."
	./test-e2e.sh full

# Install test dependencies
install-test:
	@echo "📦 Installing test dependencies..."
	cd tests && npm install && npx playwright install chromium

# Clean test artifacts
clean:
	@echo "🧹 Cleaning test artifacts..."
	rm -rf tests/playwright-report
	rm -rf tests/test-results
	rm -f /tmp/deploy-output.log

# Open test URL in default browser
open-test-url:
	@echo "🌐 Opening test URL..."
	xdg-open "https://cleansheetcorpus.blob.core.windows.net/web/career-canvas.html" || \
	open "https://cleansheetcorpus.blob.core.windows.net/web/career-canvas.html" || \
	echo "Please open: https://cleansheetcorpus.blob.core.windows.net/web/career-canvas.html"

# Show test report
show-report:
	@echo "📊 Opening test report..."
	cd tests && npm run report
