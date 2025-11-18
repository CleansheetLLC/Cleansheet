# Playwright Test Suite Requirements - Cleansheet Platform

**Issue:** GitHub #24 - Complete playwright testing suite
**Date:** 2025-11-18
**QA Engineer:** Claude (AI Test Engineer)
**Status:** Requirements Analysis Complete

---

## Executive Summary

This document provides a comprehensive analysis of the current Playwright test coverage for the Cleansheet platform and defines requirements for complete test coverage across all features, including the new Chatbot Creator functionality.

### Current State
- **Test Files:** 7 spec files (50 test cases)
- **Coverage Focus:** Data management, encryption, API key configuration, backup/restore
- **Primary Page Under Test:** `career-canvas.html`
- **Test Infrastructure:** Well-established with fixtures, helpers, and page objects

### Critical Findings
1. **Strong encryption/security coverage** - Critical API key encryption thoroughly tested
2. **Comprehensive data management testing** - Backup/restore workflows well-covered
3. **Major gaps in UI/UX testing** - Landing page, learner app, career tools not tested
4. **No accessibility testing** - WCAG 2.1 AA compliance not verified
5. **No responsive design testing** - Mobile breakpoint (768px) not validated
6. **New chatbot features not tested** - GitHub issues #10-#16, #25-#27 require test coverage

### Recommendation
**Split GitHub Issue #24 into 8 focused issues** organized by feature area and test type. This approach enables:
- Parallel development by multiple contributors
- Clear acceptance criteria per feature
- Incremental progress tracking
- Prioritization based on risk and user impact

---

## Table of Contents

1. [Current Test Coverage Analysis](#current-test-coverage-analysis)
2. [Gap Analysis by Feature](#gap-analysis-by-feature)
3. [Recommended Test Scenarios](#recommended-test-scenarios)
4. [Issue Breakdown Strategy](#issue-breakdown-strategy)
5. [Implementation Priority](#implementation-priority)
6. [Test Infrastructure Needs](#test-infrastructure-needs)

---

## Current Test Coverage Analysis

### ✅ What's Currently Tested (50 Tests)

#### 00-smoke (2 tests)
- ✅ Page loads without authentication errors
- ✅ localStorage accessibility

#### 01-data-management (27 tests)
**Backup Export (10 tests)**
- ✅ Export full backup with encrypted API keys
- ✅ Export backup without API keys (safe sharing)
- ✅ Export API keys only
- ✅ Include all canvas data types
- ✅ Generate valid filename with timestamp
- ✅ Verify JSON structure completeness
- ✅ Handle large datasets near localStorage quota
- ✅ Verify encryption in exported files

**Backup Restore (12 tests)**
- ✅ Restore full backup with correct password
- ✅ Fail gracefully with incorrect password
- ✅ Enforce password retry limit (3 attempts)
- ✅ Restore backup without API keys
- ✅ Restore API keys only
- ✅ Handle overwrite mode (replace all data)
- ✅ Handle merge/update mode (combine data)
- ✅ Handle backwards compatibility with old formats
- ✅ Handle case sensitivity bug (regression)
- ✅ Transition from empty to populated state
- ✅ Handle NO_KEYS_FOUND error gracefully
- ✅ Verify decryption and re-encryption

**Data Integrity (6 tests)**
- ✅ Preserve experience data structure
- ✅ Maintain canvas tree structure and hierarchy
- ✅ Preserve user profile completeness
- ✅ Maintain entity relationships (documents ↔ assets)
- ✅ Enforce atomic transactions (all-or-nothing)
- ✅ Prevent data leakage between operations

**Encryption Validation (9 tests)**
- ✅ Never store API keys in plaintext
- ✅ Verify password encryption in backups
- ✅ Verify backup file integrity
- ✅ Handle case sensitivity in provider names
- ✅ Verify encryption after page reload
- ✅ Verify different ciphertext for same plaintext (nonce)
- ✅ Detect and reject corrupted encrypted data
- ✅ Verify API keys not exposed in DOM/console
- ✅ Maintain encryption across export/import cycle

#### 02-api-keys (11 tests)
**API Key Configuration (9 tests)**
- ✅ Add new API key and verify encryption
- ✅ Delete API key and remove from storage
- ✅ Switch between multiple providers
- ✅ Support all three providers (OpenAI, Anthropic, Gemini)
- ✅ Update model selection for provider
- ✅ Validate API key format before storing
- ✅ Prevent duplicate provider entries
- ✅ Preserve API keys when updating profile data
- ✅ Handle missing or corrupted config gracefully

**API Key Backup/Restore (8 tests)**
- ✅ Export keys-only backup with password protection
- ✅ Restore keys-only backup without affecting canvas data
- ✅ Handle device transfer with key re-encryption
- ✅ Merge keys when restoring to device with existing keys
- ✅ Overwrite keys when restoring in overwrite mode
- ✅ Preserve active provider during keys-only restore
- ✅ Handle empty keys backup (no providers configured)
- ✅ Prevent plaintext API keys in keys-only backups

### Test Infrastructure Assets
**Fixtures:**
- `canvas-fixtures.js` - Reusable test setup states

**Helpers:**
- `crypto-helpers.js` - Encryption validation utilities
- `storage-helpers.js` - localStorage management
- `backup-file-helpers.js` - Backup file operations
- `modal-helpers.js` - Modal interaction helpers

**Page Objects:**
- `ApiKeyManagerPage.js` - API key management UI
- `BackupRestorePage.js` - Backup/restore workflows

---

## Gap Analysis by Feature

### ❌ Critical Gaps (Not Tested)

#### Landing Page (index.html)
**0 tests | Risk: HIGH | User Impact: HIGH**
- ❌ 8 feature cards load and are clickable
- ❌ Canvas modal opens and displays D3 tree visualization
- ❌ Persona selector (4 personas: Retail Manager, Research Chemist, New Graduate, Data Analyst)
- ❌ D3 tree interactions (expand/collapse nodes, count badges, text truncation)
- ❌ Personal Canvas slideout (60% width, green accent, recipes/finance systems)
- ❌ Floating Home button navigation
- ❌ Mobile responsive design (cards stack, Canvas adapts)

#### Learner App (learner.html)
**0 tests | Risk: HIGH | User Impact: HIGH**
- ❌ Tab navigation (Home/Library)
- ❌ Article search and filtering
- ❌ Article card display (189 articles)
- ❌ Bookmark functionality
- ❌ Article slideout viewer (60% width)
- ❌ Filter by tags (20 tags) and career paths (9 paths)
- ❌ Search debouncing and performance
- ❌ Mobile responsive design (single column layout)

#### Career Paths (career-paths.html)
**0 tests | Risk: MEDIUM | User Impact: MEDIUM**
- ❌ D3 network diagram loads
- ❌ Path selector pills
- ❌ Timeline visualization
- ❌ Node interactions (hover, click)
- ❌ Mobile responsiveness

#### Experience Tagger (experience-tagger.html)
**0 tests | Risk: MEDIUM | User Impact: MEDIUM**
- ❌ Card grid displays experiences
- ❌ Add/edit/delete experience
- ❌ JSON import functionality
- ❌ JSON export functionality
- ❌ localStorage persistence
- ❌ Form validation

#### Role Translator (role-translator.html)
**0 tests | Risk: MEDIUM | User Impact: MEDIUM**
- ❌ Skills mapping interface
- ❌ Role translation functionality
- ❌ Data persistence

#### Corpus Library (corpus/index.html)
**0 tests | Risk: LOW | User Impact: MEDIUM**
- ❌ Traditional library browser loads (195 articles)
- ❌ Left nav filters work
- ❌ Slideout viewer (60% width)
- ❌ Search functionality
- ❌ Article content rendering

#### Accessibility (All Pages)
**0 tests | Risk: HIGH | Compliance: CRITICAL**
- ❌ WCAG 2.1 AA compliance (keyboard navigation, screen readers, color contrast)
- ❌ Focus indicators on interactive elements
- ❌ ARIA labels and semantic HTML
- ❌ Form field labels and error announcements
- ❌ Alt text on images/icons

#### Responsive Design (All Pages)
**0 tests | Risk: HIGH | User Impact: HIGH**
- ❌ Mobile breakpoint (≤768px) behavior
- ❌ Card grid adaptations (multi-column → single column)
- ❌ Touch target sizes (min 44×44px)
- ❌ Viewport scaling (up to 200%)
- ❌ Orientation support (portrait/landscape)

#### Chatbot Creator (NEW - GitHub #10-#16, #25-#27)
**0 tests | Risk: HIGH | User Impact: HIGH**
- ❌ Profile completeness validation
- ❌ Wizard-based personality interview (7 steps)
- ❌ Data permissions configuration (toggles per category)
- ❌ Chatbot preview mode (test conversations)
- ❌ URL slug validation and collision detection
- ❌ Publish workflow (consent modal, URL generation)
- ❌ Analytics dashboard (conversations, visitors, top questions)
- ❌ Chatbot management (pause, edit, delete)
- ❌ Public embed interface (visitor experience)
- ❌ Rate limiting (10 messages per 5 min)
- ❌ Soft/hard message limits (20/25 messages)
- ❌ Profile sync (5-minute updates)
- ❌ Multi-chatbot D3 mindmap navigation
- ❌ Claude Haiku integration (mock responses in tests)

#### Privacy & Compliance
**0 tests | Risk: CRITICAL | Compliance: REQUIRED**
- ❌ No third-party tracking scripts loaded
- ❌ Azure Application Insights anonymization
- ❌ Cookie consent flows (if applicable)
- ❌ Privacy policy links present
- ❌ Data deletion workflows (right to be forgotten)

---

## Recommended Test Scenarios

### 1. Landing Page Tests (index.html) - 15 tests

**Critical Path (5 tests)**
```javascript
test('should display 8 feature cards with correct titles and icons', async ({ page }) => {
  // Verify all feature cards present: Learner, Job Seeker, Professional, Career Paths, etc.
});

test('should open Canvas modal when clicking feature card', async ({ page }) => {
  // Click Canvas card, verify modal opens, D3 tree renders
});

test('should display 4 persona options in Canvas selector', async ({ page }) => {
  // Verify Retail Manager, Research Chemist, New Graduate, Data Analyst
});

test('should expand/collapse D3 tree nodes with ONE second-level node at a time', async ({ page }) => {
  // Verify toggle behavior, count badges, text truncation
});

test('should navigate to feature pages via cards', async ({ page }) => {
  // Click Learner card → navigates to learner.html
});
```

**Secondary Features (5 tests)**
```javascript
test('should open Personal Canvas slideout with green accent', async ({ page }) => {
  // 60% width, dark header, scrollable body, recipes/finance systems
});

test('should display floating Home button with hover effects', async ({ page }) => {
  // Fixed position, dark translucent, blue hover
});

test('should display D3 tree with proper node sizing and spacing', async ({ page }) => {
  // nodeSize([60, 220]), dynamic SVG sizing, scrollable
});

test('should show count badges on D3 tree nodes', async ({ page }) => {
  // Verify badge display, count accuracy
});

test('should truncate long text in D3 nodes (50 char, 2 lines)', async ({ page }) => {
  // Verify ellipsis on overflow
});
```

**Responsive Design (3 tests)**
```javascript
test('should stack feature cards in single column on mobile (≤768px)', async ({ page }) => {
  // Set viewport to 375×667, verify card layout
});

test('should adapt Canvas modal for mobile viewport', async ({ page }) => {
  // Full-screen modal, collapsible sections
});

test('should display mobile-optimized floating Home button', async ({ page }) => {
  // Smaller size (40px), adjusted positioning
});
```

**Accessibility (2 tests)**
```javascript
test('should support keyboard navigation for feature cards', async ({ page }) => {
  // Tab through cards, Enter to activate
});

test('should provide ARIA labels for Canvas modal and D3 tree', async ({ page }) => {
  // Screen reader announcements, semantic structure
});
```

---

### 2. Learner App Tests (learner.html) - 18 tests

**Critical Path (6 tests)**
```javascript
test('should display tab navigation (Home/Library) and switch tabs', async ({ page }) => {
  // Click Library tab, verify content changes
});

test('should display 189 published articles in card grid', async ({ page }) => {
  // Verify article count, card structure
});

test('should filter articles by search query', async ({ page }) => {
  // Type "Python", verify filtered results
});

test('should filter articles by tag selection', async ({ page }) => {
  // Select "Cloud" tag, verify filtered articles
});

test('should open article in 60% slideout viewer', async ({ page }) => {
  // Click article card, verify slideout opens, content loads
});

test('should bookmark/unbookmark articles', async ({ page }) => {
  // Click bookmark icon, verify localStorage persistence
});
```

**Search & Filter (5 tests)**
```javascript
test('should debounce search input (avoid excessive filtering)', async ({ page }) => {
  // Type rapidly, verify debouncing (300ms delay)
});

test('should filter by multiple tags simultaneously', async ({ page }) => {
  // Select "Cloud" + "DevOps", verify intersection
});

test('should filter by career path', async ({ page }) => {
  // Select "Cloud Computing", verify relevant articles
});

test('should clear filters and show all articles', async ({ page }) => {
  // Click "Clear Filters", verify full list restored
});

test('should handle no results state gracefully', async ({ page }) => {
  // Search for nonsense, verify "No articles found" message
});
```

**Data Integrity (3 tests)**
```javascript
test('should load article data from shared/library-data.js', async ({ page }) => {
  // Verify articles array loaded, 189 published entries
});

test('should persist bookmark state across page reloads', async ({ page }) => {
  // Bookmark article, reload, verify still bookmarked
});

test('should maintain scroll position when closing slideout', async ({ page }) => {
  // Scroll to article #50, open/close slideout, verify position preserved
});
```

**Responsive Design (2 tests)**
```javascript
test('should display single-column card grid on mobile (≤768px)', async ({ page }) => {
  // Set viewport to 375×667, verify card stacking
});

test('should make slideout full-width on mobile', async ({ page }) => {
  // Mobile slideout should be 100% width, not 60%
});
```

**Accessibility (2 tests)**
```javascript
test('should support keyboard navigation for article cards', async ({ page }) => {
  // Tab through cards, Enter to open slideout
});

test('should announce filter changes to screen readers', async ({ page }) => {
  // Verify ARIA live regions for filter updates
});
```

---

### 3. Career Tools Tests (career-paths.html, experience-tagger.html, role-translator.html) - 12 tests

**Career Paths (4 tests)**
```javascript
test('should render D3 network diagram with career path nodes', async ({ page }) => {
  // Verify force-directed graph, 9 career paths
});

test('should display path selector pills and filter diagram', async ({ page }) => {
  // Click "Cloud Computing" pill, verify diagram highlights
});

test('should show career timeline visualization', async ({ page }) => {
  // Verify timeline component, milestone markers
});

test('should handle node interactions (hover, click)', async ({ page }) => {
  // Hover node → tooltip, click → expand details
});
```

**Experience Tagger (5 tests)**
```javascript
test('should display experience card grid', async ({ page }) => {
  // Verify card layout, add/edit/delete buttons
});

test('should add new experience via modal form', async ({ page }) => {
  // Fill form, submit, verify card added to grid
});

test('should import experiences from JSON', async ({ page }) => {
  // Upload JSON file, verify experiences populated
});

test('should export experiences to JSON', async ({ page }) => {
  // Click export, verify JSON download, validate structure
});

test('should persist experiences in localStorage', async ({ page }) => {
  // Add experience, reload, verify persistence
});
```

**Role Translator (3 tests)**
```javascript
test('should load skills mapping interface', async ({ page }) => {
  // Verify UI elements present
});

test('should translate role based on skills input', async ({ page }) => {
  // Input skills, verify role suggestions
});

test('should persist translation results', async ({ page }) => {
  // Save translation, reload, verify data retained
});
```

---

### 4. Chatbot Creator Tests (NEW) - 35 tests

**Profile Validation (5 tests)**
```javascript
test('should validate minimum profile requirements before chatbot creation', async ({ page }) => {
  // Incomplete profile → show requirements checklist
});

test('should calculate profile completeness score (0-100)', async ({ page }) => {
  // Verify score calculation logic
});

test('should identify missing required data (experiences, skills, summary, goals)', async ({ page }) => {
  // Display specific missing items
});

test('should allow proceeding to configuration when requirements met', async ({ page }) => {
  // Complete profile → "Create Chatbot" button enabled
});

test('should provide "Complete Profile" links to relevant sections', async ({ page }) => {
  // Click link → navigate to experience form
});
```

**Wizard-Based Personality Interview (7 steps) (8 tests)**
```javascript
test('should display Step 1: Communication Style question', async ({ page }) => {
  // Verify textarea (500 chars), examples provided
});

test('should display Step 2: Interaction Preferences question', async ({ page }) => {
  // Verify textarea, examples
});

test('should display Step 3: Professional Tone question', async ({ page }) => {
  // Verify textarea, examples
});

test('should display Step 4: Emphasis Areas question', async ({ page }) => {
  // Checkbox list + custom textarea
});

test('should display Step 5: Conversation Boundaries question', async ({ page }) => {
  // Textarea for "never discuss" topics
});

test('should navigate between wizard steps (Back/Next)', async ({ page }) => {
  // Verify step navigation, progress indicator
});

test('should save wizard responses as draft (auto-save)', async ({ page }) => {
  // Type response, verify localStorage/API save
});

test('should generate personality summary from wizard responses', async ({ page }) => {
  // Complete wizard, verify summary displayed
});
```

**Configuration UI (6 tests)**
```javascript
test('should display data permission toggles (6 categories)', async ({ page }) => {
  // Work experiences, Skills, Projects, Career goals, Education, Documents, Contact info
});

test('should toggle data permissions and save configuration', async ({ page }) => {
  // Toggle Skills off, verify saved state
});

test('should validate URL slug (uniqueness, format)', async ({ page }) => {
  // Enter "john-smith", verify availability check
});

test('should suggest alternative URL slugs on collision', async ({ page }) => {
  // Slug taken → suggest "john-smith-2"
});

test('should display preview panel with live chatbot test interface', async ({ page }) => {
  // Verify preview iframe/panel visible
});

test('should save configuration as draft (can edit before publishing)', async ({ page }) => {
  // Save draft, reload, verify config restored
});
```

**Publishing Workflow (4 tests)**
```javascript
test('should display consent modal before publishing', async ({ page }) => {
  // Verify consent text, "I Understand, Publish Chatbot" button
});

test('should generate unique chatbot URL on publish', async ({ page }) => {
  // Publish → verify URL: cleansheet.info/chat/{slug}
});

test('should provide sharing tools (copy link, QR code, social templates)', async ({ page }) => {
  // Verify sharing UI elements
});

test('should send confirmation email with chatbot URL', async ({ page }) => {
  // Mock email service, verify email sent
});
```

**Chatbot Management (5 tests)**
```javascript
test('should display analytics dashboard (conversations, visitors, top questions)', async ({ page }) => {
  // Verify dashboard UI, data visualization
});

test('should allow updating chatbot configuration', async ({ page }) => {
  // Edit data permissions, verify changes saved
});

test('should pause chatbot (displays "Currently unavailable" message)', async ({ page }) => {
  // Pause → verify status change, visitor sees unavailable message
});

test('should unpublish chatbot (URL returns 404)', async ({ page }) => {
  // Unpublish → verify URL inaccessible
});

test('should delete chatbot permanently (requires confirmation)', async ({ page }) => {
  // Delete → confirm modal → verify chatbot removed
});
```

**Public Embed Interface (5 tests)**
```javascript
test('should load chatbot embed page without authentication', async ({ page }) => {
  // Access /chat/{slug} → no login required
});

test('should display welcome message with profile owner name/photo', async ({ page }) => {
  // Verify chatbot greeting, owner info
});

test('should send message and receive chatbot response', async ({ page }) => {
  // Type "Tell me about your Python experience" → verify response
});

test('should display response citations (links to source data)', async ({ page }) => {
  // Verify "[Based on: Experience at Company X →]" links
});

test('should display suggested follow-up questions', async ({ page }) => {
  // Verify 3 suggested questions below response
});
```

**Rate Limiting & Security (2 tests)**
```javascript
test('should enforce rate limit (10 messages per 5 minutes per IP)', async ({ page }) => {
  // Send 11 messages rapidly → verify HTTP 429 error
});

test('should enforce soft limit (20 messages) with warning', async ({ page }) => {
  // Send 20 messages → verify warning displayed
});
```

**Profile Sync (2 tests)**
```javascript
test('should detect profile updates mid-conversation (5-minute sync)', async ({ page }) => {
  // Update profile → verify chatbot context refreshed within 5 min
});

test('should inject notification when profile is updated mid-chat', async ({ page }) => {
  // Verify "Profile updated on {timestamp}" message to visitor
});
```

---

### 5. Accessibility Tests (All Pages) - 12 tests

**Keyboard Navigation (4 tests)**
```javascript
test('should support Tab navigation through all interactive elements', async ({ page }) => {
  // Tab through buttons, links, form inputs → verify focus order
});

test('should activate elements with Enter/Space keys', async ({ page }) => {
  // Enter on button → trigger action, Space on checkbox → toggle
});

test('should trap focus within modals when open', async ({ page }) => {
  // Open modal, Tab → focus stays within modal, Esc to close
});

test('should provide skip-to-content link for screen readers', async ({ page }) => {
  // Verify skip link present, navigates to main content
});
```

**Screen Reader Support (4 tests)**
```javascript
test('should provide ARIA labels on all icons and buttons', async ({ page }) => {
  // Verify aria-label on icon-only buttons
});

test('should announce dynamic content changes (ARIA live regions)', async ({ page }) => {
  // Filter articles → announce "Showing X results"
});

test('should use semantic HTML (nav, main, article, section)', async ({ page }) => {
  // Verify proper heading hierarchy (h1 → h2 → h3)
});

test('should provide accessible form labels and error messages', async ({ page }) => {
  // Verify <label> for each <input>, errors announced to screen readers
});
```

**Color Contrast (2 tests)**
```javascript
test('should meet WCAG 2.1 AA color contrast ratios (4.5:1)', async ({ page }) => {
  // Analyze page colors, verify contrast compliance
});

test('should display visible focus indicators (min 2px outline)', async ({ page }) => {
  // Tab through elements, verify focus outlines visible
});
```

**Mobile Accessibility (2 tests)**
```javascript
test('should provide touch targets min 44×44px on mobile', async ({ page }) => {
  // Verify button sizes on mobile viewport
});

test('should support viewport scaling up to 200%', async ({ page }) => {
  // Zoom to 200%, verify content reflows, no horizontal scroll
});
```

---

### 6. Responsive Design Tests (All Pages) - 10 tests

**Breakpoint Behavior (4 tests)**
```javascript
test('should stack card grids in single column on mobile (≤768px)', async ({ page }) => {
  // index.html feature cards, learner.html article cards
});

test('should adapt navigation for mobile (hamburger menu)', async ({ page }) => {
  // Verify mobile nav pattern if applicable
});

test('should make slideout panels full-width on mobile', async ({ page }) => {
  // learner.html, corpus/index.html slideouts
});

test('should adjust D3 visualizations for mobile viewports', async ({ page }) => {
  // career-paths.html, Canvas modal D3 trees
});
```

**Touch Optimization (2 tests)**
```javascript
test('should provide adequate spacing between touch targets (min 8px)', async ({ page }) => {
  // Verify tap target spacing
});

test('should support touch gestures (swipe, pinch-zoom)', async ({ page }) => {
  // Verify -webkit-overflow-scrolling: touch
});
```

**Orientation Support (2 tests)**
```javascript
test('should display correctly in portrait orientation', async ({ page }) => {
  // Set viewport to 375×667 (portrait)
});

test('should display correctly in landscape orientation', async ({ page }) => {
  // Set viewport to 667×375 (landscape)
});
```

**Performance (2 tests)**
```javascript
test('should load assets efficiently on 3G connection', async ({ page }) => {
  // Throttle network, verify page load < 5 seconds
});

test('should lazy-load images below the fold', async ({ page }) => {
  // Verify images load as user scrolls
});
```

---

### 7. Privacy & Compliance Tests - 8 tests

**Third-Party Tracking (3 tests)**
```javascript
test('should NOT load Google Analytics or third-party analytics', async ({ page }) => {
  // Scan network requests, verify no ga.js, gtag.js
});

test('should NOT load Facebook Pixel or social media trackers', async ({ page }) => {
  // Verify no fbevents.js, twitter pixel
});

test('should use Azure Application Insights with anonymization', async ({ page }) => {
  // Verify AI script loaded, anonymizeIp: true
});
```

**Cookie Compliance (2 tests)**
```javascript
test('should display cookie consent banner if required by GDPR', async ({ page }) => {
  // Check if cookie banner appears (depends on implementation)
});

test('should use only essential and anonymized analytics cookies', async ({ page }) => {
  // Verify no third-party cookies set
});
```

**Privacy Policy (2 tests)**
```javascript
test('should display privacy policy link in footer', async ({ page }) => {
  // Verify link to privacy-policy.html
});

test('should display privacy notice on chatbot embed pages', async ({ page }) => {
  // Verify "This conversation is not recorded" message
});
```

**Data Deletion (1 test)**
```javascript
test('should provide data deletion request mechanism', async ({ page }) => {
  // Verify erasure request form in career-canvas.html user menu
});
```

---

### 8. Performance & Error Handling Tests - 10 tests

**Performance (5 tests)**
```javascript
test('should load index.html within 2 seconds on cable connection', async ({ page }) => {
  // Verify page load time
});

test('should render learner.html with 189 articles in < 1 second', async ({ page }) => {
  // Verify initial render performance
});

test('should debounce search to avoid excessive re-renders', async ({ page }) => {
  // Verify debounce (300ms delay)
});

test('should handle large datasets near localStorage quota (5MB)', async ({ page }) => {
  // Existing test in backup-export.spec.js covers this
});

test('should lazy-load D3 visualizations on viewport entry', async ({ page }) => {
  // Verify D3 trees render on demand
});
```

**Error Handling (5 tests)**
```javascript
test('should display user-friendly error when network fails', async ({ page }) => {
  // Simulate offline, verify error message
});

test('should handle corrupted localStorage data gracefully', async ({ page }) => {
  // Inject malformed JSON, verify no crash
});

test('should handle missing image assets (broken links)', async ({ page }) => {
  // Verify alt text displayed, no broken image icons
});

test('should handle API rate limit errors from LLM providers', async ({ page }) => {
  // Mock HTTP 429 from OpenAI → verify user-facing message
});

test('should handle chatbot URL slug not found (404)', async ({ page }) => {
  // Access /chat/nonexistent → verify 404 page
});
```

---

## Issue Breakdown Strategy

### Recommendation: Split GitHub Issue #24 into 8 Issues

**Rationale:**
- Enables parallel development by multiple contributors
- Clear acceptance criteria per feature area
- Incremental progress tracking
- Prioritization based on risk and user impact
- Aligns with Cleansheet's modular architecture

---

### Issue #24.1: Landing Page & Canvas Modal Tests
**Priority:** HIGH | **Estimated Tests:** 15 | **Risk:** HIGH

**Scope:**
- Feature cards (8 cards)
- Canvas modal with D3 tree visualization
- Persona selector (4 personas)
- Personal Canvas slideout
- Floating Home button
- Responsive design (mobile ≤768px)
- Accessibility (keyboard nav, ARIA labels)

**Acceptance Criteria:**
- [ ] All 15 tests pass on Chromium
- [ ] D3 tree interactions verified (expand/collapse, count badges)
- [ ] Mobile viewport (375×667) tested
- [ ] Keyboard navigation functional

**Files to Create:**
- `tests/specs/03-landing-page/feature-cards.spec.js`
- `tests/specs/03-landing-page/canvas-modal.spec.js`
- `tests/specs/03-landing-page/personal-canvas.spec.js`
- `tests/specs/03-landing-page/responsive-landing.spec.js`
- `tests/helpers/d3-tree-helpers.js`
- `tests/page-objects/CanvasModalPage.js`

---

### Issue #24.2: Learner App Tests (learner.html)
**Priority:** HIGH | **Estimated Tests:** 18 | **Risk:** HIGH

**Scope:**
- Tab navigation (Home/Library)
- Article search and filtering (189 articles)
- Tag and career path filters
- Bookmark functionality
- Slideout viewer (60% width)
- Search debouncing
- Responsive design (single column on mobile)
- Accessibility (keyboard nav, screen readers)

**Acceptance Criteria:**
- [ ] All 18 tests pass on Chromium
- [ ] Search performance validated (debouncing)
- [ ] Bookmark persistence verified
- [ ] Mobile slideout (100% width) tested

**Files to Create:**
- `tests/specs/04-learner-app/tab-navigation.spec.js`
- `tests/specs/04-learner-app/article-search.spec.js`
- `tests/specs/04-learner-app/article-filtering.spec.js`
- `tests/specs/04-learner-app/bookmarks.spec.js`
- `tests/specs/04-learner-app/slideout-viewer.spec.js`
- `tests/specs/04-learner-app/responsive-learner.spec.js`
- `tests/page-objects/LearnerAppPage.js`

---

### Issue #24.3: Career Tools Tests (career-paths, experience-tagger, role-translator)
**Priority:** MEDIUM | **Estimated Tests:** 12 | **Risk:** MEDIUM

**Scope:**
- Career Paths: D3 network diagram, path selector pills, timeline
- Experience Tagger: Card grid, add/edit/delete, JSON import/export
- Role Translator: Skills mapping, role translation

**Acceptance Criteria:**
- [ ] All 12 tests pass on Chromium
- [ ] D3 network diagram interactions verified
- [ ] JSON import/export functional
- [ ] localStorage persistence tested

**Files to Create:**
- `tests/specs/05-career-tools/career-paths.spec.js`
- `tests/specs/05-career-tools/experience-tagger.spec.js`
- `tests/specs/05-career-tools/role-translator.spec.js`
- `tests/page-objects/CareerPathsPage.js`
- `tests/page-objects/ExperienceTaggerPage.js`

---

### Issue #24.4: Chatbot Creator - Profile Validation & Wizard
**Priority:** HIGH | **Estimated Tests:** 13 | **Risk:** HIGH

**Scope:**
- Profile completeness validation (4 requirements)
- Wizard-based personality interview (7 steps)
- Data permissions configuration
- URL slug validation

**Acceptance Criteria:**
- [ ] All 13 tests pass on Chromium
- [ ] Profile completeness score calculation verified
- [ ] Wizard step navigation functional
- [ ] URL slug collision detection tested

**Files to Create:**
- `tests/specs/06-chatbot-creator/profile-validation.spec.js`
- `tests/specs/06-chatbot-creator/personality-wizard.spec.js`
- `tests/specs/06-chatbot-creator/configuration-ui.spec.js`
- `tests/page-objects/ChatbotCreatorPage.js`
- `tests/helpers/chatbot-helpers.js`

---

### Issue #24.5: Chatbot Creator - Publishing & Management
**Priority:** HIGH | **Estimated Tests:** 11 | **Risk:** HIGH

**Scope:**
- Publishing workflow (consent modal, URL generation)
- Analytics dashboard
- Chatbot management (pause, edit, delete)
- Sharing tools (QR code, social templates)

**Acceptance Criteria:**
- [ ] All 11 tests pass on Chromium
- [ ] Consent modal verified
- [ ] Analytics dashboard data displayed
- [ ] Delete confirmation workflow tested

**Files to Create:**
- `tests/specs/06-chatbot-creator/publishing-workflow.spec.js`
- `tests/specs/06-chatbot-creator/analytics-dashboard.spec.js`
- `tests/specs/06-chatbot-creator/chatbot-management.spec.js`
- `tests/page-objects/ChatbotAnalyticsPage.js`

---

### Issue #24.6: Chatbot Creator - Public Embed & Security
**Priority:** HIGH | **Estimated Tests:** 9 | **Risk:** CRITICAL

**Scope:**
- Public embed interface (visitor experience)
- Message sending/receiving (mock Claude API)
- Response citations and suggestions
- Rate limiting (10 messages per 5 min)
- Soft/hard limits (20/25 messages)
- Profile sync (5-minute updates)

**Acceptance Criteria:**
- [ ] All 9 tests pass on Chromium
- [ ] Rate limiting enforced (HTTP 429)
- [ ] Soft limit warning displayed at 20 messages
- [ ] Hard limit blocks at 25 messages
- [ ] Profile update notification injected

**Files to Create:**
- `tests/specs/06-chatbot-creator/public-embed.spec.js`
- `tests/specs/06-chatbot-creator/rate-limiting.spec.js`
- `tests/specs/06-chatbot-creator/profile-sync.spec.js`
- `tests/page-objects/ChatbotEmbedPage.js`
- `tests/helpers/claude-api-mock.js`

---

### Issue #24.7: Accessibility & Responsive Design (All Pages)
**Priority:** HIGH | **Estimated Tests:** 22 | **Risk:** HIGH (Compliance)

**Scope:**
- WCAG 2.1 AA compliance (keyboard nav, screen readers, color contrast)
- Mobile breakpoint behavior (≤768px)
- Touch optimization (min 44×44px targets)
- Orientation support (portrait/landscape)
- Focus indicators and ARIA labels

**Acceptance Criteria:**
- [ ] All 22 tests pass on Chromium
- [ ] Keyboard navigation functional on all pages
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Mobile viewports tested (375×667)
- [ ] Touch targets meet minimum size

**Files to Create:**
- `tests/specs/07-accessibility/keyboard-navigation.spec.js`
- `tests/specs/07-accessibility/screen-reader-support.spec.js`
- `tests/specs/07-accessibility/color-contrast.spec.js`
- `tests/specs/07-accessibility/mobile-accessibility.spec.js`
- `tests/specs/08-responsive-design/breakpoint-behavior.spec.js`
- `tests/specs/08-responsive-design/touch-optimization.spec.js`
- `tests/specs/08-responsive-design/orientation-support.spec.js`
- `tests/helpers/accessibility-helpers.js` (Axe-core integration)

---

### Issue #24.8: Privacy, Performance & Error Handling
**Priority:** MEDIUM | **Estimated Tests:** 18 | **Risk:** CRITICAL (Compliance)

**Scope:**
- Third-party tracking verification (no GA, FB Pixel)
- Azure Application Insights anonymization
- Cookie compliance
- Privacy policy links
- Data deletion mechanism
- Page load performance
- Network error handling
- Corrupted data handling

**Acceptance Criteria:**
- [ ] All 18 tests pass on Chromium
- [ ] No third-party trackers detected
- [ ] Privacy policy links present on all pages
- [ ] Page load times < 2 seconds
- [ ] Error states display user-friendly messages

**Files to Create:**
- `tests/specs/09-privacy-compliance/third-party-tracking.spec.js`
- `tests/specs/09-privacy-compliance/cookie-compliance.spec.js`
- `tests/specs/09-privacy-compliance/privacy-policy.spec.js`
- `tests/specs/10-performance/page-load-times.spec.js`
- `tests/specs/10-performance/debouncing.spec.js`
- `tests/specs/11-error-handling/network-errors.spec.js`
- `tests/specs/11-error-handling/data-corruption.spec.js`
- `tests/helpers/network-helpers.js`

---

## Implementation Priority

### Phase 1: Critical Path (3-4 weeks)
**Goal:** Ensure core user journeys are bug-free

1. **Issue #24.1: Landing Page & Canvas Modal** (Week 1)
   - Risk: HIGH | User Impact: HIGH
   - First impression, navigation gateway

2. **Issue #24.2: Learner App Tests** (Week 2)
   - Risk: HIGH | User Impact: HIGH
   - Primary user-facing app, 189 articles

3. **Issue #24.7: Accessibility & Responsive Design** (Week 3-4)
   - Risk: HIGH (Compliance) | User Impact: HIGH
   - WCAG 2.1 AA required, mobile users critical

### Phase 2: New Features (4-6 weeks)
**Goal:** Validate new chatbot functionality before launch

4. **Issue #24.4: Chatbot Creator - Profile Validation & Wizard** (Week 5)
   - Risk: HIGH | User Impact: HIGH
   - New feature, complex wizard workflow

5. **Issue #24.5: Chatbot Creator - Publishing & Management** (Week 6)
   - Risk: HIGH | User Impact: HIGH
   - Analytics, management UI

6. **Issue #24.6: Chatbot Creator - Public Embed & Security** (Week 7-8)
   - Risk: CRITICAL | User Impact: HIGH
   - Rate limiting, security critical

### Phase 3: Secondary Features & Compliance (2-3 weeks)
**Goal:** Complete coverage, ensure compliance

7. **Issue #24.3: Career Tools Tests** (Week 9)
   - Risk: MEDIUM | User Impact: MEDIUM
   - Supporting tools, less critical

8. **Issue #24.8: Privacy, Performance & Error Handling** (Week 10-11)
   - Risk: CRITICAL (Compliance) | User Impact: MEDIUM
   - Privacy policy compliance, error resilience

---

## Test Infrastructure Needs

### New Helpers Required

#### accessibility-helpers.js
```javascript
// Integrate Axe-core for automated accessibility testing
class AccessibilityHelpers {
  static async runAxeAudit(page) {
    // Run axe-core, return violations
  }

  static async verifyColorContrast(page, selector) {
    // Calculate color contrast ratio
  }

  static async verifyKeyboardNavigation(page) {
    // Simulate Tab key presses, verify focus order
  }
}
```

#### d3-tree-helpers.js
```javascript
// Helper functions for D3 tree/network interactions
class D3TreeHelpers {
  static async expandNode(page, nodeId) {
    // Click node to expand, wait for animation
  }

  static async verifyCountBadge(page, nodeId, expectedCount) {
    // Verify badge display and count
  }

  static async verifyTextTruncation(page, nodeId, maxChars) {
    // Verify ellipsis on overflow
  }
}
```

#### chatbot-helpers.js
```javascript
// Chatbot-specific test utilities
class ChatbotHelpers {
  static async validateProfileCompleteness(page) {
    // Calculate score, identify missing data
  }

  static async mockClaudeApiResponse(page, response) {
    // Intercept Claude API calls, return mock response
  }

  static async enforceRateLimit(page, messageCount) {
    // Send N messages rapidly, verify rate limit
  }
}
```

#### network-helpers.js
```javascript
// Network throttling, offline simulation
class NetworkHelpers {
  static async simulateOffline(page) {
    // Set offline mode
  }

  static async throttleNetwork(page, profile) {
    // Throttle to 3G, 4G, etc.
  }

  static async interceptRequest(page, url, response) {
    // Mock API responses
  }
}
```

### New Page Objects Required

#### LearnerAppPage.js
```javascript
class LearnerAppPage {
  constructor(page) { this.page = page; }

  async navigateToLibrary() { /* ... */ }
  async searchArticles(query) { /* ... */ }
  async filterByTag(tag) { /* ... */ }
  async bookmarkArticle(articleId) { /* ... */ }
  async openArticleSlideout(articleId) { /* ... */ }
}
```

#### ChatbotCreatorPage.js
```javascript
class ChatbotCreatorPage {
  constructor(page) { this.page = page; }

  async validateProfile() { /* ... */ }
  async completePersonalityWizard(responses) { /* ... */ }
  async configureDataPermissions(permissions) { /* ... */ }
  async setUrlSlug(slug) { /* ... */ }
  async previewChatbot() { /* ... */ }
  async publishChatbot() { /* ... */ }
}
```

#### ChatbotEmbedPage.js
```javascript
class ChatbotEmbedPage {
  constructor(page) { this.page = page; }

  async sendMessage(message) { /* ... */ }
  async rateResponse(rating) { /* ... */ }
  async clickSuggestedQuestion(question) { /* ... */ }
  async contactOwner(email, message) { /* ... */ }
}
```

### Fixture Enhancements Required

#### chatbot-fixtures.js
```javascript
// Pre-configured chatbot states for testing
export const chatbotFixtures = {
  completeProfile: { /* ... */ },
  incompleteProfile: { /* ... */ },
  publishedChatbot: { /* ... */ },
  pausedChatbot: { /* ... */ }
};
```

### External Tools to Integrate

1. **Axe-core** - Automated accessibility testing
   - Install: `npm install --save-dev axe-playwright`
   - Usage: Inject axe-core, run audits, assert no violations

2. **Playwright Network Throttling** - Performance testing
   - Built-in: `page.route()` for request interception
   - Built-in: `page.emulateMedia()` for device emulation

3. **Visual Regression (Optional)** - Screenshot comparison
   - Install: `npm install --save-dev @playwright/test`
   - Usage: `await expect(page).toHaveScreenshot('landing-page.png')`

---

## Test Execution Strategy

### Local Development
```bash
# Run all tests
npx playwright test

# Run specific issue
npx playwright test tests/specs/03-landing-page

# Run with UI mode (debugging)
npx playwright test --ui

# Run specific test
npx playwright test -g "should display 8 feature cards"

# Generate HTML report
npx playwright test --reporter=html
```

### CI/CD Integration
```yaml
# .github/workflows/playwright-tests.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: tests/playwright-report/
```

### Multi-Browser Testing
```javascript
// playwright.config.js
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 12'] } }
]
```

---

## Success Metrics

### Quantitative Metrics
- **Test Coverage:** 130+ tests across 8 feature areas
- **Pass Rate:** 100% on Chromium (Phase 1)
- **Cross-Browser:** 95%+ pass rate on Firefox, WebKit (Phase 3)
- **Execution Time:** < 10 minutes for full suite
- **Accessibility:** 0 critical violations on axe-core audits

### Qualitative Metrics
- **Bug Detection:** Catch regressions before production
- **Developer Confidence:** Clear test coverage for all features
- **User Impact:** Prevent critical bugs in user journeys
- **Compliance:** WCAG 2.1 AA, privacy policy alignment verified

---

## Risk Mitigation

### High-Risk Areas
1. **Chatbot Creator** - Complex new feature, Claude API integration
   - Mitigation: Comprehensive mocking, rate limiting tests

2. **Accessibility Compliance** - Legal/regulatory requirement
   - Mitigation: Automated axe-core audits, manual testing

3. **Data Encryption** - Already well-tested (50 existing tests)
   - Mitigation: Maintain existing coverage, add regression tests

4. **Third-Party Tracking** - Privacy policy violation risk
   - Mitigation: Network request scanning, no GA/FB Pixel

### Medium-Risk Areas
1. **D3 Visualizations** - Complex interactions, timing-sensitive
   - Mitigation: Proper wait strategies, animation timeouts

2. **Mobile Responsiveness** - Multiple breakpoints, touch gestures
   - Mitigation: Device emulation, multiple viewport tests

3. **Performance** - Large datasets (189 articles, 195 corpus)
   - Mitigation: Performance budgets, lazy loading verification

---

## Next Steps

### Immediate Actions
1. **Review this requirements document** with product/engineering team
2. **Create 8 GitHub issues** from breakdown in this document
3. **Assign ownership** for each issue
4. **Set up CI/CD** for automated test execution

### Phase 1 Kickoff (Week 1)
1. **Install Axe-core** for accessibility testing
2. **Create base helpers** (d3-tree-helpers.js, accessibility-helpers.js)
3. **Implement Issue #24.1** (Landing Page tests)
4. **Establish test review process** (peer review, coverage reports)

### Long-Term
1. **Visual regression testing** (optional, Phase 4)
2. **Performance monitoring** integration (Azure Application Insights)
3. **E2E test suite maintenance** (update tests as features evolve)
4. **Cross-browser CI** (add Firefox/WebKit to GitHub Actions)

---

## Appendix

### Reference Documents
- **CLAUDE.md** - Cleansheet platform architecture and standards
- **DESIGN_GUIDE.md** - Corporate Professional design system
- **CHATBOT_CREATOR_REQUIREMENTS.md** - New chatbot feature specs
- **privacy-policy.html** - Privacy commitments (compliance testing)
- **privacy-principles.html** - Core privacy philosophy

### Test File Naming Convention
```
tests/
  specs/
    00-smoke/                 # Sanity checks
    01-data-management/       # Backup, restore, encryption
    02-api-keys/              # API key management
    03-landing-page/          # index.html tests
    04-learner-app/           # learner.html tests
    05-career-tools/          # career-paths, experience-tagger, role-translator
    06-chatbot-creator/       # NEW: Chatbot creation, management, embed
    07-accessibility/         # WCAG 2.1 AA compliance
    08-responsive-design/     # Mobile breakpoints
    09-privacy-compliance/    # Third-party tracking, cookies
    10-performance/           # Load times, debouncing
    11-error-handling/        # Network errors, data corruption
```

### Glossary
- **Axe-core:** Open-source accessibility testing engine
- **WCAG 2.1 AA:** Web Content Accessibility Guidelines, Level AA
- **D3.js:** Data visualization library (used in Canvas, career paths)
- **Playwright:** End-to-end testing framework
- **Fixture:** Pre-configured test state (e.g., fully configured canvas)
- **Helper:** Reusable test utility function
- **Page Object:** Class representing a page with interaction methods
- **Mock:** Simulated API response for testing

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Author:** Claude (AI Test Engineer)
**Status:** Requirements Analysis Complete, Awaiting Review
