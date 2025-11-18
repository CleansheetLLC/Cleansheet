# Feature Request: Contextual Question Suggestions for AI Career Assistant

**Labels:** `enhancement`, `ai`, `ux`, `needs-design`, `privacy-compliant`
**Priority:** High
**Estimated Effort:** 3-4 weeks

---

## Summary

Enhance the AI career assistant in the Cleansheet Canvas with intelligent, contextual question suggestions. These suggestions appear as clickable chips above the chat interface and are dynamically generated based on the user's Canvas data (projects, skills, goals, work experience, interviews).

**Key Benefit:** Proactively guides users toward actionable career insights by suggesting relevant questions they might not think to ask.

---

## Problem Statement

The current AI assistant is purely reactive - users must know what questions to ask. This creates friction for:
- New users who don't understand the assistant's capabilities
- Returning users who miss opportunities to leverage recent Canvas changes
- All users who underutilize the platform's analytical potential

**User Impact:** Lower engagement, missed career development opportunities, underutilized AI assistant.

---

## User Stories

### 1. New User Onboarding
**As a** new user with minimal Canvas data
**I want to** see helpful starter questions
**So that** I understand how to use the AI assistant effectively

**Acceptance Criteria:**
- Empty Canvas shows 4-6 onboarding suggestions
- Clicking suggestion auto-submits question to assistant
- Suggestions disappear after initial interaction

---

### 2. Project-Based Suggestions
**As a** user with incomplete projects
**I want to** receive project-specific guidance
**So that** I can get targeted advice for my current work

**Acceptance Criteria:**
- Detects projects tagged as "incomplete" or "in-progress"
- Shows suggestion: "How can I structure a project plan for [Project Name]?"
- Updates when project status changes

---

### 3. Skill Gap Analysis
**As a** user with a defined career path
**I want to** see suggestions about skill development
**So that** I can proactively address gaps

**Acceptance Criteria:**
- Compares current skills with target role requirements
- Suggests: "What skills should I develop for [Target Role]?"
- Links to relevant Cleansheet Library articles

---

### 4. Interview Preparation
**As a** job seeker with upcoming interviews
**I want to** receive interview prep suggestions
**So that** I can prepare effectively

**Acceptance Criteria:**
- Detects applications with status "Interview" or "Phone Screen"
- Shows suggestions 48-72 hours before interview date
- References specific job title and company

---

### 5. Resume Update Nudge
**As a** user who completed projects but hasn't updated resume
**I want to** be prompted to document accomplishments
**So that** my professional materials stay current

**Acceptance Criteria:**
- Tracks last resume modification date
- Shows suggestion if 90+ days without update AND new completed projects exist
- Links directly to resume document in Canvas

---

### 6. Privacy-Compliant Context Analysis
**As a** privacy-conscious user
**I want to** control what Canvas data is analyzed
**So that** I maintain control over my information

**Acceptance Criteria:**
- Phase 1 analysis is client-side only (no data leaves browser)
- Phase 2 (Azure OpenAI) requires explicit opt-in
- Users can exclude specific Canvas sections from analysis
- Respects existing "Exclude from AI" flags
- Complies with privacy-policy.html requirements

---

## Technical Architecture

### Phase 1: Rules-Based Suggestions (3 weeks)
**Client-side processing, privacy-first approach**

**Components:**
- `/shared/context-analyzer.js` - Extracts Canvas data (projects, skills, goals, etc.)
- `/shared/suggestion-templates.js` - 30+ question templates by category
- `/shared/suggestion-engine.js` - Trigger rules, priority ranking, caching

**Suggestion Categories:**
- Onboarding (new users)
- Project management
- Skill development
- Interview preparation
- Resume/document updates
- Career strategy
- Skill gap analysis

**Trigger Rules Example:**
```javascript
{
    id: "interview-preparation-trigger",
    conditions: [
        { field: "upcomingInterviews", operator: "length_gt", value: 0 },
        { field: "upcomingInterviews[0].date", operator: "days_until", value: [2, 7] }
    ],
    suggestionTemplate: "How should I prepare for a {jobTitle} interview at {company}?",
    priority: 9
}
```

**Priority Ranking Algorithm:**
- Base priority (1-10 per suggestion)
- Time sensitivity boost (urgent interviews +5)
- Recency boost (recent Canvas changes +2)
- Diversity penalty (avoid same category repeatedly)
- Dismissal penalty (-10, effectively exclude)

---

### Phase 2: AI-Powered Suggestions (Optional, 1 week)
**Azure OpenAI integration with strict privacy controls**

**Features:**
- Generates 3 contextual suggestions using GPT-3.5-Turbo
- Anonymizes Canvas data before API call (no PII, no specific names/dates)
- Caches responses locally (24h TTL, reduce API costs)
- Opt-in only (disabled by default)

**Privacy Controls:**
```
Settings > AI Assistant > Question Suggestions

[ ] Enable AI-powered suggestions (requires Azure OpenAI)

Share with AI:
[✓] Current/target roles
[✓] Skills (generic list only)
[✓] Project categories (not specific titles)
[ ] Goals (generic types only)

Never shared: names, companies, dates, locations, salaries, content
```

---

## UI Design

### Suggestion Chip Component
**Location:** AI Assistant panel, above chat messages

**Visual Design:**
```
┌─────────────────────────────────────────┐
│ 💡 Suggested Questions:                │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ 💡 How can I structure a project  │×││
│ │    plan for Migration Project?    │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ 💡 What skills should I develop   │×││
│ │    for Senior Developer?          │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**CSS Styling:**
```css
.suggestion-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #e5e5e7;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.suggestion-chip:hover {
    background: #e3f2fd;
    border-color: #0066CC;
    color: #0066CC;
}
```

**Interactions:**
- Click chip → Populate chat input → Auto-submit question
- Click dismiss (X) → Remove chip, store dismissal (7-day hide)
- Hover → Highlight with blue background
- Keyboard: Tab (focus), Enter (submit), Escape (dismiss)

---

## Privacy & Security

### Compliance Requirements
✅ **All Phase 1 processing is client-side (no external data transmission)**
✅ **Phase 2 requires explicit opt-in (default OFF)**
✅ **PII removed before Azure OpenAI API calls**
✅ **Users control which Canvas sections are analyzed**
✅ **Respects existing privacy settings ("Exclude from AI" flags)**
✅ **Complies with privacy-policy.html and privacy-principles.html**
✅ **No third-party analytics (Azure Application Insights only, anonymized)**

### Data Flow (Phase 2)
```
Canvas Data → Anonymize → Azure OpenAI API → Cache Locally → Display
              (Remove PII)   (GPT-3.5-Turbo)  (24h TTL)
```

**Never Shared with AI:**
- Company names
- Personal names
- Specific dates
- Locations
- Salary information
- Document/project content

---

## Success Metrics

### Primary KPIs
- **Suggestion Click-Through Rate:** Target > 25%
- **Assistant Interaction Increase:** Target +30% messages vs. baseline
- **Feature Adoption:** Target 60% of users interact within 30 days
- **Dismissal Rate:** Target < 30% (relevance indicator)

### Secondary Metrics
- Cache hit rate > 80%
- Analysis latency < 100ms (p95)
- Category diversity (no single category > 40%)
- AI opt-in rate (Phase 2)

### Analytics Events (Anonymized)
```javascript
trackEvent('suggestion_shown', { category, priority, sessionId });
trackEvent('suggestion_clicked', { category, sessionId });
trackEvent('suggestion_dismissed', { category, sessionId });
```

---

## Testing Requirements

### Unit Tests
- Context analyzer: Detects incomplete projects, skill gaps, interview dates
- Trigger rules: Activates correct rules based on Canvas state
- Priority ranking: Urgent items ranked higher, diversity applied

### Integration Tests
- Canvas integration: Suggestions update when data changes
- Cache invalidation: New Canvas data triggers re-analysis
- UI interactions: Click submits, dismiss removes

### E2E Tests (Playwright)
- New user sees onboarding suggestions
- Adding incomplete project triggers project-specific suggestion
- Interview date triggers interview prep suggestion
- Privacy settings correctly exclude Canvas sections

### Performance Tests
- Large Canvas (100+ items) analysis < 300ms
- Suggestion generation < 200ms (rules-based)
- Suggestion generation < 2000ms (AI-powered, with cache)

---

## Implementation Phases

### Phase 1: Rules-Based (3 weeks)
**Week 1:** Core engine (context-analyzer, suggestion-templates, suggestion-engine)
**Week 2:** UI integration (chips component, click/dismiss handlers)
**Week 3:** Testing, refinement, beta launch

### Phase 2: AI-Powered (1 week, optional)
**Week 4:** Azure OpenAI integration, privacy controls, hybrid system

### Rollout
**Beta:** 50 users, 2 weeks
**Limited Release:** 500 users, 4 weeks (A/B testing)
**Full Release:** Gradual rollout (25% → 50% → 75% → 100%)

---

## Accessibility

- Keyboard navigation (Tab, Enter, Escape)
- Screen reader support (`role="button"`, `aria-label`)
- Color contrast > 4.5:1 (WCAG 2.1 AA)
- Respect `prefers-reduced-motion`

---

## Dependencies

**Internal:**
- Canvas data structure stability
- AI assistant chat interface (input submission hooks)
- Privacy settings infrastructure
- Azure Application Insights

**External:**
- Azure OpenAI API (Phase 2 only)
- Browser localStorage

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Privacy violation | Strict anonymization, opt-in only, privacy review |
| Suggestion irrelevance | Beta testing, dismissal tracking, template refinement |
| Performance degradation | Debouncing, caching, background processing |
| AI cost overruns | Aggressive caching, rate limiting, fallback to rules |
| User fatigue | Diversity algorithm, freshness scoring, smart refresh |

---

## Open Questions

1. **Suggestion Quantity:** Show 3-4 suggestions? User-configurable?
2. **Refresh Frequency:** Every 5 minutes or manual refresh button?
3. **Dismissal Duration:** 7 days hidden? Permanent clear option?
4. **AI Default:** Opt-in (current) or opt-out?
5. **Chip Icons:** Category-specific icons or single lightbulb?

---

## Related Resources

- **White Paper:** `/whitepapers/contextual-ai-assistant.html` - Detailed technical documentation
- **CLAUDE.md:** Privacy guidelines and AI integration standards
- **Implementation File:** `/career-canvas.html` - AI assistant panel location
- **Detailed PRD:** `/.github/ISSUE_CONTEXTUAL_QUESTION_SUGGESTIONS.md` - Full specification (this document is summary)

---

## Next Steps

1. **Review & Approve:** Product, Engineering, Design, Legal/Privacy
2. **Technical Design Review:** Validate architecture, identify edge cases
3. **UI/UX Design:** Finalize chip design, interaction patterns, empty states
4. **Sprint Planning:** Break down into development tickets
5. **Beta User Recruitment:** Identify 50 early testers

---

**Created:** 2025-11-18
**Status:** Draft - Awaiting Review
**Contact:** [Feature Owner], [Tech Lead], [Designer]
