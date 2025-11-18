# Contextual Question Suggestions - Development Checklist

Quick reference for implementing the contextual question suggestion feature.

---

## Phase 1: Rules-Based Suggestions (3 weeks)

### Week 1: Foundation ✓

**Core Engine Files:**
- [ ] Create `/shared/context-analyzer.js`
  - [ ] `analyzeCanvas(canvasData)` - Extract context from Canvas
  - [ ] `detectIncompleteProjects()`
  - [ ] `identifySkillGaps(currentSkills, targetRole)`
  - [ ] `findUpcomingInterviews(applications)`
  - [ ] `checkResumeStatus(documents)`
  - [ ] `calculateEngagementLevel(activityLog)`
  - [ ] Unit tests for all analyzers

- [ ] Create `/shared/suggestion-templates.js`
  - [ ] Onboarding templates (6 questions)
  - [ ] Project management templates (5 questions)
  - [ ] Skill development templates (5 questions)
  - [ ] Interview prep templates (5 questions)
  - [ ] Resume/document templates (5 questions)
  - [ ] Career strategy templates (5 questions)
  - [ ] Template variable substitution function
  - [ ] Template validation tests

- [ ] Create `/shared/suggestion-engine.js`
  - [ ] `generateSuggestions(context)` - Main orchestrator
  - [ ] `evaluateTriggers(context)` - Check which rules apply
  - [ ] `rankSuggestions(suggestions, context, history)` - Priority scoring
  - [ ] `cacheSuggestions(suggestions)` - localStorage caching
  - [ ] `getCachedSuggestions()` - Retrieve cached results
  - [ ] `dismissSuggestion(suggestionId)` - User dismissal handling
  - [ ] Unit tests for all functions

**Trigger Rules:**
- [ ] Define 10+ trigger rules (JSON format)
  - [ ] Incomplete project trigger
  - [ ] Skill gap trigger
  - [ ] Upcoming interview trigger (2-7 days)
  - [ ] Resume update trigger (90+ days)
  - [ ] New user trigger (< 5 Canvas items)
  - [ ] Goal overdue trigger
  - [ ] Recent completion trigger
  - [ ] Application status change trigger
  - [ ] Career path mismatch trigger
  - [ ] Engagement drop trigger

**Priority Algorithm:**
- [ ] Implement base priority (1-10)
- [ ] Time sensitivity boost (+0 to +5)
- [ ] Recency boost (+2)
- [ ] Diversity penalty (-0.5 per repeat)
- [ ] Dismissal penalty (-10)
- [ ] Freshness boost (+1)
- [ ] Unit tests for ranking scenarios

**Caching Strategy:**
- [ ] Implement localStorage-based cache
- [ ] Cache structure: `{ lastAnalyzedContext, lastAnalysisTime, cachedSuggestions, ttl }`
- [ ] Cache validation: `isValid(currentContext)`
- [ ] Cache invalidation triggers
- [ ] TTL: 5 minutes

---

### Week 2: UI Integration ✓

**HTML Structure:**
- [ ] Modify `/career-canvas.html` AI assistant panel
- [ ] Add suggestion chips container above chat messages
- [ ] Create chip template HTML
- [ ] Add empty state placeholder
- [ ] Add loading state spinner

**CSS Styling:**
- [ ] `.suggestion-chips` container styles
  - [ ] Flex layout with wrap
  - [ ] Background: `#f5f5f7`
  - [ ] Padding: `16px`
  - [ ] Border-radius: `8px`
  - [ ] Margin-bottom: `16px`

- [ ] `.suggestion-chip` component styles
  - [ ] Flex layout (icon + text + dismiss)
  - [ ] Padding: `8px 12px`
  - [ ] Background: `white`
  - [ ] Border: `1px solid #e5e5e7`
  - [ ] Border-radius: `20px`
  - [ ] Font: Barlow, 13px
  - [ ] Transition: `all 0.2s`

- [ ] Hover state
  - [ ] Background: `#e3f2fd`
  - [ ] Border: `#0066CC`
  - [ ] Text color: `#0066CC`

- [ ] Mobile responsive styles (< 768px)
  - [ ] Smaller padding: `6px 10px`
  - [ ] Font-size: `12px`
  - [ ] Chips wrap to multiple lines

**JavaScript Integration:**
- [ ] `renderSuggestions(suggestions)` - Render chips to DOM
- [ ] `handleSuggestionClick(suggestionId)` - Click handler
  - [ ] Populate chat input with question
  - [ ] Auto-submit to assistant
  - [ ] Track click event (analytics)
- [ ] `handleSuggestionDismiss(suggestionId)` - Dismiss handler
  - [ ] Remove chip from DOM (fade-out animation)
  - [ ] Store dismissal in localStorage
  - [ ] Track dismissal event (analytics)
  - [ ] Show toast: "Suggestion dismissed"
- [ ] `refreshSuggestions()` - Manual refresh function
- [ ] Hook into Canvas data change events
  - [ ] Debounce analysis (5 second delay)
  - [ ] Invalidate cache
  - [ ] Re-render suggestions

**Event Listeners:**
- [ ] Click on chip → Submit question
- [ ] Click on dismiss icon → Remove chip
- [ ] Keyboard: Tab (focus), Enter (submit), Escape (dismiss)
- [ ] Canvas data change → Debounced refresh

**Animations:**
- [ ] Fade-in animation for new suggestions (300ms)
- [ ] Fade-out animation for dismissed chips (300ms)
- [ ] Respect `prefers-reduced-motion`

---

### Week 3: Testing & Refinement ✓

**Unit Tests:**
- [ ] Context analyzer tests (10+ test cases)
  - [ ] Detects incomplete projects
  - [ ] Identifies skill gaps
  - [ ] Finds upcoming interviews
  - [ ] Calculates days since resume update
  - [ ] Handles empty Canvas gracefully
  - [ ] Handles malformed data

- [ ] Trigger rules tests (10+ test cases)
  - [ ] Interview trigger activates 2-7 days before
  - [ ] Skill gap trigger requires career path
  - [ ] Resume trigger requires 90+ days + new projects
  - [ ] New user trigger shows onboarding
  - [ ] Multiple triggers can activate simultaneously

- [ ] Priority ranking tests (5+ test cases)
  - [ ] Urgent interviews ranked highest
  - [ ] Diversity penalty applied correctly
  - [ ] Dismissals excluded
  - [ ] Fresh suggestions boosted

**Integration Tests:**
- [ ] Canvas integration (5+ test cases)
  - [ ] Adding project triggers new suggestion
  - [ ] Updating project status changes suggestions
  - [ ] Cache invalidates on data change
  - [ ] Debouncing prevents excessive analysis

- [ ] UI integration (5+ test cases)
  - [ ] Chips render correctly
  - [ ] Click submits question to chat
  - [ ] Dismiss removes chip and stores dismissal
  - [ ] Empty state shows when no suggestions

**E2E Tests (Playwright):**
- [ ] New user journey
  - [ ] Clear localStorage
  - [ ] Open Canvas
  - [ ] Verify onboarding suggestions appear
  - [ ] Click suggestion
  - [ ] Verify chat message sent

- [ ] Interview prep journey
  - [ ] Add job application with interview date (3 days out)
  - [ ] Verify interview suggestion appears
  - [ ] Verify suggestion includes company and role
  - [ ] Dismiss suggestion
  - [ ] Verify not shown again

- [ ] Project suggestion journey
  - [ ] Add incomplete project
  - [ ] Verify project-specific suggestion appears
  - [ ] Mark project complete
  - [ ] Verify suggestion disappears

**Performance Tests:**
- [ ] Large Canvas analysis (100+ items) < 300ms
- [ ] Suggestion generation < 200ms
- [ ] UI render < 50ms
- [ ] Cache hit rate > 80% (repeated analysis)

**Accessibility Audit:**
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces suggestions
- [ ] Focus indicator visible (2px outline)
- [ ] Color contrast > 4.5:1
- [ ] `aria-label` on all interactive elements

**Beta Testing:**
- [ ] Recruit 50 beta users (25 internal, 25 external)
- [ ] Prepare beta feedback survey
  - [ ] Were suggestions relevant? (1-5 scale)
  - [ ] Did you find value in suggestions? (Yes/No)
  - [ ] Which suggestions did you click?
  - [ ] Which suggestions were irrelevant?
  - [ ] Open feedback (text)
- [ ] Monitor analytics dashboard
  - [ ] Suggestion impressions
  - [ ] Click-through rate
  - [ ] Dismissal rate
  - [ ] Category distribution
- [ ] Iterate on templates based on feedback

---

## Phase 2: AI-Powered Suggestions (1 week, optional)

### Azure OpenAI Integration ✓

**API Setup:**
- [ ] Create `/api/azure-openai/suggestions` endpoint (or client SDK)
- [ ] Configure Azure OpenAI API credentials
- [ ] Set up GPT-3.5-Turbo model
- [ ] Define API rate limits (10 requests/minute per user)
- [ ] Implement error handling and fallback

**Context Anonymization:**
- [ ] `anonymizeContext(canvasData)` function
  - [ ] Remove all PII: names, companies, dates, locations, salaries
  - [ ] Generalize roles: "Software Developer" → "Professional"
  - [ ] Summarize skills: Top 5 only
  - [ ] Abstract projects: "Backend Redesign" → "Software Project"
  - [ ] Count-based metrics: activeProjects, goalCount
  - [ ] Unit tests for anonymization (verify no PII leaks)

**Prompt Engineering:**
- [ ] Define base prompt template
  ```
  You are a career development assistant. Based on this profile, suggest 3 specific questions:
  - Current Role: {currentRole}
  - Target Role: {targetRole}
  - Skills: {skills}
  - Recent Activity: {activity}
  Return JSON: ["Question 1?", "Question 2?", "Question 3?"]
  ```
- [ ] Test prompt with various profiles
- [ ] Optimize for conciseness (< 200 tokens per response)
- [ ] A/B test different prompt variations

**Caching:**
- [ ] Implement localStorage cache for AI responses
- [ ] Cache structure: `{ contextHash, aiSuggestions, timestamp, ttl }`
- [ ] TTL: 24 hours
- [ ] Cache invalidation on Canvas data change
- [ ] Reduce API calls by 80%+ (target)

**Fallback Strategy:**
- [ ] If API fails → Use rules-based suggestions
- [ ] If API slow (> 5s) → Show rules-based, replace when AI ready
- [ ] If user offline → Only rules-based
- [ ] Track fallback rate (should be < 5%)

---

### Privacy Controls ✓

**Settings UI:**
- [ ] Add "Question Suggestions" section to Canvas Settings
- [ ] Toggle: "Enable AI-powered suggestions" (default: OFF)
- [ ] Checkbox list: "Share with AI"
  - [ ] Current/target roles
  - [ ] Skills (generic list only)
  - [ ] Project categories
  - [ ] Goals (generic types only)
  - [ ] Document types
  - [ ] Interview statuses
- [ ] Info tooltip: "What data is shared?"
  - [ ] Explain anonymization
  - [ ] List what's never shared
  - [ ] Link to privacy policy

**Privacy Settings Logic:**
- [ ] `getUserPrivacySettings()` - Retrieve from localStorage
- [ ] `shouldShareDataPoint(dataPoint)` - Check if user allowed
- [ ] `filterContextByPrivacy(context, settings)` - Apply filters
- [ ] Default: All checkboxes unchecked (most private)
- [ ] Unit tests for privacy filtering

**Privacy Policy Update:**
- [ ] Add section: "AI Career Assistant - Contextual Suggestions"
- [ ] Explain data collection (opt-in)
- [ ] Clarify anonymization process
- [ ] Disclose Azure OpenAI usage
- [ ] List data never shared
- [ ] Provide opt-out instructions
- [ ] Legal review required

---

### Hybrid System ✓

**Merge Logic:**
- [ ] `mergeRulesAndAISuggestions(rules, aiSuggestions)` function
  - [ ] Deduplicate similar questions
  - [ ] Apply unified priority ranking
  - [ ] Ensure diversity (mix of both sources)
  - [ ] Limit to 4 total suggestions

**A/B Testing:**
- [ ] Set up feature flags
  - [ ] Control: No suggestions
  - [ ] Variant A: Rules-based only
  - [ ] Variant B: Hybrid (rules + AI)
- [ ] Random assignment (50% Variant A, 50% Variant B)
- [ ] Track metrics per variant
  - [ ] CTR, dismissal rate, engagement
  - [ ] AI opt-in rate (Variant B only)
- [ ] Run for 4 weeks, analyze results

**Analytics:**
- [ ] Track AI opt-in rate
- [ ] Track AI suggestion performance vs. rules-based
- [ ] Track Azure OpenAI API costs
- [ ] Track cache hit rate
- [ ] Track fallback frequency

---

## Deployment Checklist

### Pre-Deployment ✓

- [ ] All unit tests pass (100% coverage target)
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Performance benchmarks met
- [ ] Accessibility audit complete (WCAG 2.1 AA)
- [ ] Privacy review complete (legal sign-off)
- [ ] Security review (no PII leaks, API keys secure)
- [ ] Documentation complete
  - [ ] User help article
  - [ ] Developer README
  - [ ] API documentation
- [ ] Feature flag configured (gradual rollout)
- [ ] Monitoring dashboards set up (Azure Application Insights)
- [ ] Error alerting configured

### Beta Deployment (50 users, 2 weeks) ✓

- [ ] Enable feature for beta users (localStorage flag)
- [ ] Send beta announcement email
- [ ] Monitor error logs daily
- [ ] Collect user feedback (survey)
- [ ] Track metrics:
  - [ ] CTR > 20% (target)
  - [ ] Dismissal rate < 40% (target)
  - [ ] 0 critical bugs
  - [ ] Positive feedback > 75%
- [ ] Iterate on templates if needed
- [ ] Fix any bugs found

### Limited Release (500 users, 4 weeks) ✓

- [ ] Enable A/B testing (50% rules, 50% hybrid)
- [ ] Monitor metrics:
  - [ ] CTR by variant
  - [ ] Engagement increase
  - [ ] AI opt-in rate (Phase 2)
  - [ ] Azure OpenAI costs
- [ ] Collect qualitative feedback
- [ ] Optimize AI prompts (Phase 2)
- [ ] Refine priority algorithm based on data

### Full Release (Gradual Rollout) ✓

- [ ] Week 1: 25% of users
- [ ] Week 2: 50% of users
- [ ] Week 3: 75% of users
- [ ] Week 4: 100% of users
- [ ] Monitor real-time:
  - [ ] Error rate < 0.1%
  - [ ] Performance latency < 100ms (p95)
  - [ ] Support ticket volume
- [ ] Communicate launch via:
  - [ ] In-app notification
  - [ ] Email announcement
  - [ ] Blog post

---

## Post-Release

### Week 1-4 ✓

- [ ] Daily monitoring of metrics
- [ ] Weekly retrospective (team review)
- [ ] User feedback analysis
- [ ] Template optimization (replace low-performing suggestions)
- [ ] Bug triage and fixes

### Month 2-3 ✓

- [ ] AI prompt optimization (Phase 2)
- [ ] Priority algorithm refinement
- [ ] Add new suggestion categories based on usage patterns
- [ ] Internationalization planning (if needed)
- [ ] Explore advanced ML models

### Month 4+ ✓

- [ ] Evaluate alternative implementations:
  - [ ] Email digest of suggestions
  - [ ] Voice-activated suggestions
  - [ ] Advanced ML (user behavior prediction)
- [ ] Continuous improvement based on data

---

## Success Criteria Summary

| Metric | Target | Measurement |
|--------|--------|-------------|
| Suggestion CTR | > 25% | (Clicks / Impressions) × 100 |
| Assistant Engagement | +30% | Messages sent vs. baseline |
| Feature Adoption | 60% | Users who clicked ≥1 suggestion |
| Dismissal Rate | < 30% | (Dismissals / Impressions) × 100 |
| Cache Hit Rate | > 80% | (Cache hits / Total analyses) × 100 |
| Analysis Latency | < 100ms | p95 latency |
| AI Opt-In Rate | Track | % users enabling Phase 2 |
| Privacy Incidents | 0 | PII leaks, unauthorized data transmission |

---

## Risk Mitigation

| Risk | Mitigation Strategy | Status |
|------|---------------------|--------|
| Privacy violation | Anonymization, opt-in, privacy review | ☐ |
| Irrelevant suggestions | Beta testing, dismissal tracking, template iteration | ☐ |
| Performance issues | Debouncing, caching, background processing | ☐ |
| AI cost overruns | Aggressive caching, rate limiting, usage monitoring | ☐ |
| User fatigue | Diversity algorithm, freshness scoring, smart refresh | ☐ |
| Browser compatibility | Cross-browser testing (Chrome, Firefox, Safari, Edge) | ☐ |

---

## Quick Links

- **Detailed PRD:** `/.github/ISSUE_CONTEXTUAL_QUESTION_SUGGESTIONS.md`
- **Summary PRD:** `/.github/ISSUE_TEMPLATE_SUGGESTION_FEATURE.md`
- **White Paper:** `/whitepapers/contextual-ai-assistant.html`
- **Canvas File:** `/career-canvas.html`
- **Privacy Policy:** `/privacy-policy.html`
- **CLAUDE.md:** Root directory (privacy guidelines)

---

**Last Updated:** 2025-11-18
**Owner:** [Feature Owner Name]
