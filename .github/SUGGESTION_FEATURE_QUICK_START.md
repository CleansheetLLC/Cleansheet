# Quick Start: Contextual Question Suggestions Feature

This is a 2-minute overview for stakeholders. For complete details, see the full PRD.

---

## What We're Building

**Smart question chips** that appear in the AI Career Assistant panel, suggesting relevant questions based on the user's Canvas data.

### Before
```
┌─────────────────────────────┐
│  AI Career Assistant        │
├─────────────────────────────┤
│  [Empty chat]               │
│                             │
│  User must think of         │
│  questions to ask...        │
│                             │
├─────────────────────────────┤
│  Type your message... [Send]│
└─────────────────────────────┘
```

### After
```
┌─────────────────────────────┐
│  AI Career Assistant        │
├─────────────────────────────┤
│  💡 Suggested Questions:   │
│                             │
│  [How can I structure a    │×│
│   project plan for X?]     │
│                             │
│  [What skills should I     │×│
│   develop for Y role?]     │
│                             │
├─────────────────────────────┤
│  [Previous chat messages]   │
├─────────────────────────────┤
│  Type your message... [Send]│
└─────────────────────────────┘
```

---

## Key Features

### Intelligent Context Analysis
- Analyzes user's Canvas data (projects, skills, goals, interviews, documents)
- Detects patterns: incomplete projects, skill gaps, upcoming interviews, stale resumes
- Generates 3-4 highly relevant question suggestions

### Click-to-Ask
- User clicks suggestion → Question auto-submits to AI assistant
- No typing required for common scenarios
- Reduces friction, increases engagement

### Privacy-First Design
- **Phase 1:** All analysis happens in browser (no data transmission)
- **Phase 2:** Optional AI enhancement (opt-in only, anonymized data)
- Users control what Canvas sections are analyzed

### Smart Prioritization
- Urgent items (interviews in 2-3 days) ranked highest
- Recent Canvas changes prioritized
- Diverse suggestions (avoid repetition)
- Dismissed suggestions hidden for 7 days

---

## Example Scenarios

### 1. New User (Empty Canvas)
**Detects:** Canvas has < 5 items
**Suggests:**
- "How do I get started building my career canvas?"
- "What information should I add first?"
- "How can the AI assistant help me?"

### 2. Incomplete Project
**Detects:** Project tagged as "in-progress" or "incomplete"
**Suggests:**
- "How can I structure a project plan for Migration to Microservices?"
- "What skills will I develop working on this project?"

### 3. Upcoming Interview
**Detects:** Job application with status "Interview" in 2-7 days
**Suggests:**
- "How should I prepare for a Senior Developer interview at TechCorp?"
- "What STAR examples showcase my React experience?"

### 4. Skill Gap
**Detects:** User has target role "Senior Full Stack Developer" but missing Docker, Kubernetes skills
**Suggests:**
- "What skills should I develop for Senior Full Stack Developer?"
- "How can I learn Docker and Kubernetes effectively?"

### 5. Stale Resume
**Detects:** Resume not updated in 90+ days AND completed project recently
**Suggests:**
- "What accomplishments should I highlight from API Redesign project?"
- "How should I update my resume with my latest experience?"

---

## Technical Approach

### Phase 1: Rules-Based (3 weeks, privacy-first)
```
Canvas Data → Context Analyzer → Trigger Rules → Priority Ranker → UI Display
(localStorage)  (JavaScript)      (30+ templates)  (Smart scoring)  (Chips)
```

**How It Works:**
1. Extract Canvas data (projects, skills, goals, etc.)
2. Evaluate trigger rules (e.g., "Has incomplete projects?")
3. Generate questions from templates (e.g., "How can I structure a project plan for {projectName}?")
4. Rank by priority (urgent + recent + diverse)
5. Display top 3-4 as clickable chips

**Privacy:** 100% client-side, no external API calls.

### Phase 2: AI-Powered (1 week, optional enhancement)
```
Canvas Data → Anonymize → Azure OpenAI → Cache → Merge with Rules → Display
              (Remove PII)  (GPT-3.5)      (24h)   (Hybrid system)
```

**How It Works:**
1. User opts in via Settings
2. Anonymize Canvas data (no names, companies, dates)
3. Send generic context to Azure OpenAI
4. Generate 3 personalized suggestions
5. Cache for 24 hours (reduce API costs)
6. Merge with rules-based suggestions

**Privacy:** Opt-in only, strict anonymization, user-controlled data sharing.

---

## Success Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Click-Through Rate | > 25% | Suggestions are relevant and compelling |
| Assistant Engagement | +30% | More conversations = more value delivered |
| Feature Adoption | 60% | Users find it useful, use repeatedly |
| Dismissal Rate | < 30% | Suggestions aren't annoying or irrelevant |

---

## Implementation Timeline

### Phase 1: Rules-Based (3 weeks)
- **Week 1:** Build core engine (context analysis, templates, rules)
- **Week 2:** UI integration (chips component, click/dismiss handlers)
- **Week 3:** Testing, beta launch (50 users), refinement

### Phase 2: AI-Powered (1 week, optional)
- **Week 4:** Azure OpenAI integration, privacy controls, hybrid system

### Rollout (5 weeks)
- **Weeks 5-6:** Beta testing (50 users)
- **Weeks 7-10:** Limited release (500 users, A/B testing)
- **Weeks 11-12:** Gradual rollout (25% → 50% → 75% → 100%)

**Total Time:** 7-8 weeks (Phase 1 only) or 8-12 weeks (both phases)

---

## Privacy & Compliance

### What We Guarantee
✅ **Phase 1 is 100% client-side** (no data leaves user's browser)
✅ **Phase 2 is opt-in** (disabled by default)
✅ **No PII sent to Azure OpenAI** (names, companies, dates removed)
✅ **User controls data sharing** (granular privacy settings)
✅ **Compliant with privacy-policy.html** (no third-party tracking, no ads)
✅ **Anonymized analytics only** (Azure Application Insights)

### What's Never Shared with AI
❌ Company names
❌ Personal names
❌ Specific dates
❌ Locations
❌ Salary information
❌ Document/project content

---

## User Experience Flow

### 1. User Opens Canvas
- Suggestion engine analyzes Canvas data (< 100ms)
- Generates 3-4 relevant questions
- Displays chips above chat interface

### 2. User Sees Suggestions
- Chips show context-aware questions
- Each chip has lightbulb icon + question text + dismiss icon
- Hover effect: Blue highlight

### 3. User Clicks Suggestion
- Question populates chat input
- Auto-submits to AI assistant
- Chat responds with guidance
- Tracking: Record click event (anonymized)

### 4. User Dismisses Suggestion
- Clicks X icon on chip
- Chip fades out (300ms animation)
- Dismissal stored locally (hidden for 7 days)
- Toast: "Suggestion dismissed"
- Tracking: Record dismissal event (anonymized)

### 5. Suggestions Refresh
- Canvas data changes → Re-analyze context (debounced)
- Cache invalidates → New suggestions generated
- Chips update automatically (fade transition)

---

## Testing Strategy

### Unit Tests
- Context analyzer detects correct patterns
- Trigger rules activate appropriately
- Priority ranking works as expected
- Cache invalidates on data changes

### Integration Tests
- Canvas integration (data changes trigger updates)
- UI interactions (click, dismiss, keyboard nav)
- Privacy filters applied correctly

### E2E Tests (Playwright)
- New user sees onboarding suggestions
- Adding project triggers project-specific suggestion
- Interview date triggers interview prep suggestion
- Privacy settings exclude Canvas sections correctly

### Performance Tests
- Analysis < 100ms for typical Canvas (100 items)
- Suggestion generation < 200ms (rules-based)
- UI render < 50ms
- Cache hit rate > 80%

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Privacy violation | Low | Critical | Strict anonymization, opt-in, legal review |
| Irrelevant suggestions | Medium | High | Beta testing, dismissal tracking, template iteration |
| Performance issues | Low | Medium | Caching, debouncing, background processing |
| User fatigue | Medium | Medium | Diversity algorithm, smart refresh, freshness scoring |

---

## Open Questions (Need Decisions)

1. **Suggestion Quantity:** Show 3 or 4 suggestions? User-configurable?
2. **Refresh Strategy:** Auto-refresh every 5 minutes? Manual button?
3. **Dismissal Duration:** Hidden for 7 days? Permanent?
4. **AI Default:** Opt-in (current proposal) or opt-out?
5. **Category Icons:** Should chips have category-specific icons (project, skill, interview) or single lightbulb?

---

## Resources

### Documentation
- **Full PRD (52KB):** `ISSUE_CONTEXTUAL_QUESTION_SUGGESTIONS.md` - Comprehensive specification
- **Summary PRD (12KB):** `ISSUE_TEMPLATE_SUGGESTION_FEATURE.md` - GitHub issue template
- **Checklist (15KB):** `SUGGESTION_FEATURE_CHECKLIST.md` - Development checklist
- **White Paper:** `/whitepapers/contextual-ai-assistant.html` - Technical architecture
- **Implementation:** `/career-canvas.html` - Main Canvas file

### Key Files to Create
- `/shared/context-analyzer.js` - Canvas data extraction
- `/shared/suggestion-templates.js` - Question templates (30+)
- `/shared/suggestion-engine.js` - Trigger rules, priority ranking, caching

### Existing Infrastructure
- `/shared/cleansheet-core.js` - Design tokens, utilities
- `/shared/data-service.js` - Data abstraction layer
- `/privacy-policy.html` - Legal privacy commitments (must comply)

---

## Next Steps

### 1. Stakeholder Review (This Week)
- [ ] Product review and approval
- [ ] Engineering feasibility review
- [ ] Design review (UI/UX finalization)
- [ ] Legal/privacy review (compliance confirmation)

### 2. Sprint Planning (Next Week)
- [ ] Break PRD into development tickets
- [ ] Assign engineers to Phase 1 tasks
- [ ] Schedule design mockups for UI component
- [ ] Recruit beta testers (50 users)

### 3. Kickoff (Week of Nov 25)
- [ ] Sprint kickoff meeting
- [ ] Begin Week 1 development (core engine)
- [ ] Daily standups to track progress

---

## Contact

**Feature Owner:** [Name], Product Manager
**Technical Lead:** [Name], Senior Engineer
**Design Lead:** [Name], UX Designer
**Privacy Reviewer:** [Name], Legal/Compliance

**Questions?** Post in #career-canvas-ai Slack channel or GitHub Discussions.

---

**Document Version:** 1.0
**Created:** 2025-11-18
**Status:** Ready for Review
