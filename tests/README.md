# Cleansheet Career Canvas - E2E Test Suite

## Overview

Comprehensive Playwright-based test suite with **special emphasis on encryption workflows** to prevent data loss and security vulnerabilities.

**Test Infrastructure Status**: ✅ **PHASE 1 FOUNDATION COMPLETE**

## Architecture

```
tests/
├── fixtures/
│   ├── canvas-fixtures.js         # Reusable test setups
│   └── backup-samples/             # Sample backup files for testing
│       ├── full-backup-with-keys.json
│       ├── backup-without-keys.json
│       └── api-keys-only.json
├── helpers/
│   ├── crypto-helpers.js          # 🔐 Encryption validation utilities
│   ├── storage-helpers.js         # localStorage operations
│   └── modal-helpers.js           # Modal/slideout interactions
├── page-objects/
│   ├── BackupRestorePage.js       # Backup/restore workflows
│   └── ApiKeyManagerPage.js       # API key management
├── specs/
│   ├── 01-data-management/
│   │   └── encryption-validation.spec.js  # 🔐 CRITICAL security tests
│   ├── 02-api-keys/               # (Ready for implementation)
│   ├── 03-canvas/                 # (Ready for implementation)
│   └── 05-integration/            # (Ready for implementation)
└── playwright.config.js           # Enhanced configuration
```

## Quick Start

### 1. Install Dependencies

```bash
cd tests
npm install
npx playwright install chromium
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npx playwright test specs/01-data-management/encryption-validation.spec.js

# Run in headed mode (see browser)
npx playwright test --headed

# Run with UI mode (interactive debugging)
npx playwright test --ui

# Run against local development server
LOCAL_TEST=1 npx playwright test
```

### 3. View Test Report

```bash
npx playwright show-report playwright-report
```

## Test Categories

### 🔐 Phase 1: Encryption & Security (HIGHEST PRIORITY)

**Status**: Foundation complete, 8 critical tests implemented

**Tests Implemented**:
- ✅ NEVER store API keys in plaintext
- ✅ Verify password encryption in backups
- ✅ Validate backup file integrity
- ✅ Handle case sensitivity (regression test)
- ✅ Verify encryption persists across reloads
- ✅ Verify different ciphertext for same plaintext (nonce)
- ✅ Detect and reject corrupted encrypted data
- ✅ Verify API keys not exposed in DOM/console

**Why Critical**: Data loss and security breaches can occur if encryption fails.

### Phase 1b: Backup/Restore (IN PROGRESS)

**Next Tests** (7 remaining):
- Export full backup with encrypted API keys
- Export backup WITHOUT API keys
- Export API keys only
- Restore with correct/incorrect password
- Password retry limit (3 attempts)
- Overwrite vs merge modes
- Backwards compatibility

### Phase 1c: Data Integrity (PENDING)

**Tests Needed** (6 tests):
- All experience data preserved
- Canvas tree structure maintained
- User profile completeness
- Entity relationships (documents ↔ assets)
- localStorage consistency
- Atomic transactions

### Phase 2: API Key Management (PENDING)

**Tests Needed** (17 tests):
- Add/delete/switch providers
- Model selection
- Connection testing
- Copy to clipboard
- Key backup/restore workflows

### Phase 3: Canvas Navigation (PENDING)

**Tests Needed** (7 tests):
- Open canvas modal
- Expand/collapse nodes
- Navigate personas
- Panel interactions
- D3 rendering

## Key Features

### 🔒 Security-First Design

All encryption tests follow zero-trust principles:
- ✅ Verify NO plaintext keys in localStorage
- ✅ Scan all storage for API key patterns
- ✅ Validate encryption characteristics (Base64, length)
- ✅ Test nonce/IV usage for encryption uniqueness
- ✅ Verify no exposure in DOM or console

### 🔧 Reusable Test Fixtures

```javascript
import { test, expect } from '../../fixtures/canvas-fixtures.js';

// Clean slate
test('my test', async ({ cleanCanvas }) => {
  // Starts with empty localStorage
});

// Pre-populated data
test('my test', async ({ canvasWithData }) => {
  const { page, mockData } = canvasWithData;
  // Has 5 experiences, profile, canvas tree
});

// With API keys configured
test('my test', async ({ canvasWithApiKeys }) => {
  // Has encrypted API keys ready
});

// Fully configured
test('my test', async ({ canvasFullyConfigured }) => {
  // Has both data and API keys
});
```

### 🛠️ Helper Utilities

#### CryptoHelpers

```javascript
// Verify encryption
await CryptoHelpers.verifyApiKeyEncryption(page, 'openai');

// Scan for plaintext violations
const scan = await CryptoHelpers.verifyNoPlaintextKeys(page);

// Validate backup integrity
const integrity = CryptoHelpers.validateBackupIntegrity(backupData);

// Mock encryption for testing
const encrypted = CryptoHelpers.mockEncrypt('sk-test-key');
```

#### StorageHelpers

```javascript
// Clear all canvas data
await StorageHelpers.clearAllCanvasData(page);

// Get/set items
const data = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
await StorageHelpers.setStorageItem(page, 'key', value);

// Setup mock data
await StorageHelpers.setupMockCanvasData(page, {
  experienceCount: 5,
  withProfile: true,
  withCanvas: true
});
```

#### ModalHelpers

```javascript
// Wait for modal
await ModalHelpers.waitForModal(page, '#myModal');

// Close modal
await ModalHelpers.closeModal(page, '#myModal');

// Verify toast
await ModalHelpers.verifyToast(page, 'Success!', 'success');
```

### 📄 Page Object Models

```javascript
import { BackupRestorePage } from '../../page-objects/BackupRestorePage.js';

const backupPage = new BackupRestorePage(page);

// Export backup
const filePath = await backupPage.exportFullBackup('password123');

// Restore backup
await backupPage.restoreFromFile(filePath, 'password123');
await backupPage.waitForRestoreSuccess();
```

## Configuration

### Timeouts

- **Test timeout**: 60 seconds (encryption operations can be slow)
- **Expect timeout**: 10 seconds (D3 animations, modal transitions)
- **Navigation timeout**: 30 seconds
- **Action timeout**: 10 seconds

### Permissions

- ✅ `clipboard-read` - For API key copy testing
- ✅ `clipboard-write` - For API key copy testing

### Multi-Browser Support

**Phase 1**: Chromium only
**Phase 3**: Add Firefox and WebKit

To enable multi-browser testing, uncomment in `playwright.config.js`:

```javascript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } }
]
```

## Test Execution Modes

### 1. CI Mode

```bash
CI=1 npx playwright test
```

- Retries: 2
- Workers: 1 (serial execution)
- Full tracing on first retry

### 2. Local Development

```bash
npx playwright test
```

- Retries: 1
- Workers: 4 (parallel execution)
- Faster feedback loop

### 3. Debug Mode

```bash
npx playwright test --debug
```

- Opens Playwright Inspector
- Step through tests
- View console logs in real-time

### 4. UI Mode (Recommended for Development)

```bash
npx playwright test --ui
```

- Interactive test runner
- Time-travel debugging
- View traces and screenshots

## Debugging

### View Test Trace

```bash
npx playwright show-trace test-results/traces/trace.zip
```

### View Screenshots

Screenshots are saved to `test-results/` on failure.

### Enable Verbose Logging

```javascript
test('my test', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  // ... test code
});
```

## Sample Backup Files

Located in `fixtures/backup-samples/`:

### full-backup-with-keys.json

Complete backup including:
- 2 mock experiences
- User profile
- Canvas tree structure
- Encrypted API keys (OpenAI, Anthropic)

### backup-without-keys.json

Canvas data without API keys (safe to share).

### api-keys-only.json

API keys export only (3 providers: OpenAI, Anthropic, Gemini).

**Password for encrypted samples**: `TestPassword123`

## Next Steps

### Immediate (This Week)

1. ✅ Test infrastructure complete
2. ⏳ Implement remaining backup/restore tests (7 tests)
3. ⏳ Implement data integrity tests (6 tests)
4. ⏳ Run full encryption test suite against live app

### Phase 1 Completion (Next 2-3 Weeks)

1. Complete all backup/restore tests (12 total)
2. Complete data integrity tests (6 total)
3. Implement API key management tests (17 total)
4. Implement canvas navigation tests (7 total)
5. **Target**: ~45 tests, 80%+ core coverage

### Phase 2 (Weeks 4-5)

1. Security validation suite
2. Document management tests
3. Complex workflow tests

## Contributing

### Adding New Tests

1. Create test file in appropriate `specs/` subdirectory
2. Use fixtures from `canvas-fixtures.js`
3. Use page objects for interactions
4. Use helpers for common operations
5. Include `🔐` emoji for encryption-critical tests

### Adding New Fixtures

1. Add to `fixtures/canvas-fixtures.js`
2. Include cleanup logic
3. Document usage in this README

### Adding New Page Objects

1. Create in `page-objects/`
2. Use `ModalHelpers` for modal interactions
3. Include verification methods
4. Document in this README

## Troubleshooting

### Tests timing out

- Increase `timeout` in `playwright.config.js`
- Check for missing `await` statements
- Verify selectors are correct

### Encryption tests failing

- Clear browser cache: `await page.context().clearCookies()`
- Verify `CleansheetCrypto` is loaded: `await page.evaluate(() => typeof CleansheetCrypto)`
- Check console for encryption errors

### File download tests failing

- Ensure download promise is setup BEFORE clicking
- Check file permissions in download directory
- Verify `baseURL` is correct in config

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Cleansheet CLAUDE.md](../CLAUDE.md) - Project architecture
- [Test Plan Analysis](../tests/TEST_PLAN.md) - Comprehensive strategy

## Status Dashboard

| Category | Tests Implemented | Tests Remaining | Status |
|----------|-------------------|-----------------|--------|
| 🔐 Encryption | 8 | 0 | ✅ Complete |
| Backup/Restore | 0 | 12 | ⏳ In Progress |
| Data Integrity | 0 | 6 | ⏳ Pending |
| API Keys | 0 | 17 | ⏳ Pending |
| Canvas | 0 | 7 | ⏳ Pending |
| **TOTAL** | **8** | **42** | **🏗️ Foundation Ready** |

---

**Last Updated**: 2025-11-17
**Version**: 1.0 - Phase 1 Foundation
**Playwright Version**: ^1.49.0
