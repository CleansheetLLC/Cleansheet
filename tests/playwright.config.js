// Playwright Test Configuration - Cleansheet Career Canvas
// Enhanced for encryption testing, multi-browser support, and complex workflows

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Test directory structure
  testDir: './specs',
  testMatch: '**/*.spec.js',

  // Test timeouts (increased for complex workflows like backup/restore)
  timeout: 60000, // 60 seconds per test (encryption operations can be slow)
  expect: {
    timeout: 10000 // 10 seconds for assertions (D3 animations, modal transitions)
  },

  // Run tests in parallel
  fullyParallel: true,

  // Fail fast on CI
  forbidOnly: !!process.env.CI,

  // Retry on CI (encryption tests can be timing-sensitive)
  retries: process.env.CI ? 2 : 1,

  // Limit workers (encryption operations need stable environment)
  workers: process.env.CI ? 1 : 4,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }] // For CI integration
  ],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: 'https://cleansheetcorpus.blob.core.windows.net',

    // Collect trace on failure (critical for debugging encryption issues)
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure (helps debug complex modal interactions)
    video: 'retain-on-failure',

    // Browser viewport (desktop-first)
    viewport: { width: 1280, height: 720 },

    // User agent
    userAgent: 'CleansheetE2E/1.0',

    // Permissions (CRITICAL: clipboard needed for API key copy testing)
    permissions: ['clipboard-read', 'clipboard-write'],

    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',

    // Navigation timeout
    navigationTimeout: 30000,

    // Action timeout (for slow encryption operations)
    actionTimeout: 10000
  },

  // Multi-browser projects (Phase 1: Chromium, Phase 3: Add Firefox + WebKit)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }

    // Phase 3: Uncomment for cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] }
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] }
    // }
  ],

  // Web server configuration (for local testing)
  webServer: process.env.LOCAL_TEST ? {
    command: 'python -m http.server 8000',
    port: 8000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  } : undefined
});
