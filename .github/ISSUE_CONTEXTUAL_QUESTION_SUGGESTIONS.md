# Contextual Question Suggestions for AI Career Assistant

## Issue Metadata
**Labels:** `enhancement`, `ai`, `ux`, `needs-design`, `privacy-compliant`
**Milestone:** Q1 2026
**Priority:** High
**Estimated Effort:** 3-4 weeks

---

## Problem Statement

The AI career assistant in the Cleansheet Canvas currently operates as a reactive conversational interface. Users must know what questions to ask or how to leverage their career data for actionable insights. This creates friction for:

1. **New Users:** Don't understand the assistant's full capabilities or what questions are valuable to ask
2. **Returning Users:** May not think to ask about recent changes in their Canvas (new projects, skill gaps, incomplete goals)
3. **Context-Aware Guidance:** Assistant doesn't proactively suggest relevant next steps based on user's current career state
4. **Discovery:** Users may not realize the assistant can analyze relationships between their work experience, skills, and career goals

**User Impact:** Reduced engagement with the AI assistant, missed opportunities for career development insights, and underutilization of the platform's analytical capabilities.

---

## Proposed Solution

Enhance the AI career assistant with **contextual question suggestions** that appear as actionable chips/cards in the assistant panel. These suggestions are dynamically generated based on:

- **Canvas Data Context:** Work experience, projects, skills, goals, documents, forms, recent activity
- **Career State Analysis:** Skill gaps, incomplete projects, upcoming interviews, stale resume updates
- **User Behavior Patterns:** Frequently asked questions, areas of focus, career path trajectory
- **Temporal Triggers:** New Canvas entries, goal deadlines, long periods without updates

The system uses a **hybrid approach**:
- **Phase 1:** Rules-based suggestion engine (client-side, privacy-first)
- **Phase 2:** Azure OpenAI-powered intelligent suggestions (optional, privacy-compliant)

---

## User Stories

### Story 1: New User Onboarding
**As a** new user with an empty or minimal Canvas
**I want to** see helpful starter questions in the AI assistant
**So that** I understand how to begin building my career profile and what insights the assistant can provide

**Acceptance Criteria:**
- [ ] Empty Canvas shows 4-6 onboarding suggestions (e.g., "How do I get started?", "What should I add to my Canvas?")
- [ ] Suggestions are contextually relevant to new user state
- [ ] Clicking a suggestion populates the chat input and submits automatically
- [ ] Suggestions disappear after first 3 interactions or first Canvas data added
- [ ] Mobile-responsive design (chips wrap on narrow screens)

---

### Story 2: Project-Based Suggestions
**As a** user who recently added an incomplete project to my Canvas
**I want to** receive suggestions about project planning and execution
**So that** I can get targeted advice for completing my current work

**Acceptance Criteria:**
- [ ] System detects projects tagged as "incomplete" or "in-progress"
- [ ] Suggestions include: "How can I structure a project plan for [Project Name]?"
- [ ] Suggestions reference specific project titles from Canvas data
- [ ] Suggestions refresh when project status changes
- [ ] Users can dismiss suggestions (persists for 7 days)

---

### Story 3: Skill Gap Analysis
**As a** user with a defined career path and logged skills
**I want to** see suggestions about skill development opportunities
**So that** I can proactively address gaps in my career progression

**Acceptance Criteria:**
- [ ] System compares user's current skills with target role requirements (from Canvas career path selection)
- [ ] Suggestions highlight missing skills: "What skills should I develop for [Target Role]?"
- [ ] Suggestions link to relevant Cleansheet Library articles when available
- [ ] Skill gap analysis runs weekly or when Canvas skills/career path changes
- [ ] Users can mark suggestions as "not relevant" to improve future recommendations

---

### Story 4: Interview Preparation
**As a** job seeker with upcoming interviews tracked in my Canvas
**I want to** receive interview preparation suggestions
**So that** I can prepare effectively for specific roles

**Acceptance Criteria:**
- [ ] System detects job applications with status "Interview" or "Phone Screen"
- [ ] Suggestions appear 48-72 hours before scheduled interview dates
- [ ] Questions reference specific job title and company: "How should I prepare for a [Job Title] interview at [Company]?"
- [ ] Suggestions include STAR method prompts for specific experiences
- [ ] Interview-related suggestions have elevated priority (appear first)

---

### Story 5: Resume Update Nudge
**As a** user who completed a major project but hasn't updated my resume recently
**I want to** be prompted to document accomplishments
**So that** my professional materials stay current

**Acceptance Criteria:**
- [ ] System tracks last resume document modification date
- [ ] If resume not updated in 90+ days AND new completed projects exist, show suggestion
- [ ] Question format: "What accomplishments should I highlight from [Recent Project]?"
- [ ] Users can configure "nudge" frequency in settings (30/60/90/180 days)
- [ ] Suggestion links directly to resume document in Canvas

---

### Story 6: Fallback Suggestions for Active Canvases
**As a** user with a populated Canvas but no specific triggers
**I want to** see general career development suggestions
**So that** I'm reminded of the assistant's capabilities even without urgent prompts

**Acceptance Criteria:**
- [ ] System always shows 2-3 suggestions (never empty state)
- [ ] Fallback suggestions rotate daily to avoid staleness
- [ ] Suggestions drawn from: career growth strategies, networking tips, skill development
- [ ] Generic suggestions replaced immediately when contextual triggers activate
- [ ] Fallback library contains 20+ diverse questions

---

### Story 7: Privacy-Compliant Context Analysis
**As a** privacy-conscious user
**I want to** control what Canvas data is analyzed for suggestions
**So that** I maintain control over my personal information

**Acceptance Criteria:**
- [ ] All Phase 1 analysis happens client-side (no data leaves browser)
- [ ] Phase 2 (Azure OpenAI) requires explicit opt-in via settings
- [ ] Users can exclude specific Canvas sections from analysis (e.g., "Don't analyze Documents")
- [ ] Suggestion generation respects existing privacy settings (e.g., "Exclude from AI" flags)
- [ ] Privacy settings page clearly explains what data is used and how
- [ ] Data sent to Azure OpenAI is anonymized (no PII, generic identifiers)

---

### Story 8: Suggestion Interaction Tracking
**As a** product manager
**I want to** understand which suggestions users engage with
**So that** I can optimize suggestion relevance over time

**Acceptance Criteria:**
- [ ] Track suggestion impressions (shown to user)
- [ ] Track suggestion clicks (user submitted question)
- [ ] Track suggestion dismissals (user closed suggestion)
- [ ] Track suggestion categories (onboarding, project, skill-gap, interview, etc.)
- [ ] Analytics are anonymized and aggregated (compliant with privacy-policy.html)
- [ ] Dashboard shows top-performing suggestions and categories
- [ ] No user-identifiable data stored (only aggregate metrics)

---

## Technical Specifications

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  AI Assistant Panel                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Suggested Questions (Chips)                   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │   │
│  │  │Question 1│ │Question 2│ │Question 3│ ...    │   │
│  │  └──────────┘ └──────────┘ └──────────┘        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Chat Messages (Existing)                       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Input Field (Existing)                         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**Phase 1: Rules-Based Engine (Client-Side)**
```
Canvas Data (localStorage)
    ↓
Context Analyzer (JavaScript)
    ↓
Rule Engine (Trigger Conditions)
    ↓
Suggestion Generator (Template Filling)
    ↓
Priority Ranker (Relevance Scoring)
    ↓
UI Renderer (Chip Display)
```

**Phase 2: AI-Powered Suggestions (Optional)**
```
Canvas Data (Anonymized Summary)
    ↓
Azure OpenAI API (Suggestion Generation)
    ↓
Local Suggestion Cache (Reduce API calls)
    ↓
Merge with Rules-Based Suggestions
    ↓
Priority Ranker
    ↓
UI Renderer
```

### Component Structure

**New Files to Create:**
```
/shared/
  ├── suggestion-engine.js          # Core suggestion logic
  ├── context-analyzer.js           # Canvas data analysis
  └── suggestion-templates.js       # Question templates by category

/career-canvas.html
  └── (Modifications to existing assistant widget section)
```

### Context Analyzer Logic

**Canvas Data Points to Extract:**

```javascript
{
    // Work Experience
    totalExperience: 5,  // years
    currentRole: "Software Developer",
    targetRole: "Senior Full Stack Developer",
    recentJobChange: false,  // within 90 days

    // Skills
    documentedSkills: ["JavaScript", "React", "Node.js"],
    skillGaps: ["Docker", "Kubernetes"],  // based on career path

    // Projects
    activeProjects: 3,
    incompleteProjects: ["Migration to Microservices"],
    recentCompletions: ["API Redesign"],  // within 30 days
    projectsSinceLastResumeUpdate: 2,

    // Goals
    activeGoals: 5,
    overdueGoals: 1,
    goalCategories: ["skill-development", "certification"],

    // Job Search
    activeApplications: 8,
    upcomingInterviews: [
        { company: "TechCorp", role: "Senior Developer", date: "2025-11-25" }
    ],
    pendingOffers: 0,

    // Documents
    lastResumeUpdate: "2025-08-15",  // 90+ days ago
    documentTypes: ["resume", "cover-letter", "portfolio"],

    // Activity
    lastCanvasUpdate: "2025-11-17",
    newEntriesThisWeek: 3,
    engagementLevel: "high",  // based on update frequency

    // Assistant History
    conversationCount: 15,
    topTopics: ["interview-prep", "skill-development"],
    lastConversation: "2025-11-16"
}
```

### Suggestion Template Structure

```javascript
{
    id: "incomplete-project-planning",
    category: "project-management",
    priority: 7,  // 1-10 scale
    triggers: [
        { field: "incompleteProjects", operator: "length_gt", value: 0 }
    ],
    template: "How can I structure a project plan for {projectName}?",
    variables: ["projectName"],
    dismissible: true,
    dismissDuration: 7,  // days
    frequency: "once-per-project"
}
```

### UI Component Specification

**Suggestion Chip Component:**
```html
<div class="suggestion-chips">
    <button class="suggestion-chip" data-suggestion-id="..." data-category="...">
        <i class="ph ph-lightbulb"></i>
        <span>How can I structure a project plan for Migration to Microservices?</span>
        <i class="ph ph-x dismiss-chip"></i>
    </button>
    <!-- More chips... -->
</div>
```

**CSS Styling:**
```css
.suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px;
    background: #f5f5f7;
    border-radius: 8px;
    margin-bottom: 16px;
}

.suggestion-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #e5e5e7;
    border-radius: 20px;
    font-family: var(--font-family-body);
    font-size: 13px;
    color: #333333;
    cursor: pointer;
    transition: all 0.2s;
}

.suggestion-chip:hover {
    background: #e3f2fd;
    border-color: #0066CC;
    color: #0066CC;
}

.suggestion-chip i.ph-lightbulb {
    color: #0066CC;
    font-size: 16px;
}

.suggestion-chip i.dismiss-chip {
    opacity: 0.5;
    margin-left: 4px;
}

.suggestion-chip i.dismiss-chip:hover {
    opacity: 1;
    color: #dc2626;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .suggestion-chips {
        padding: 12px;
    }

    .suggestion-chip {
        font-size: 12px;
        padding: 6px 10px;
    }
}
```

### Suggestion Categories & Templates

**1. Onboarding (New Users)**
```javascript
const onboardingTemplates = [
    "How do I get started building my career canvas?",
    "What information should I add first to my profile?",
    "How can the AI assistant help me with career development?",
    "What's the best way to organize my work experience?",
    "How do I set meaningful career goals?",
    "Can you explain how the Cleansheet Canvas works?"
];
```

**2. Project Management**
```javascript
const projectTemplates = [
    "How can I structure a project plan for {projectName}?",
    "What are best practices for documenting {projectName}?",
    "How should I prioritize tasks in {projectName}?",
    "What skills will I develop working on {projectName}?",
    "How can I showcase {projectName} on my resume?"
];
```

**3. Skill Development**
```javascript
const skillTemplates = [
    "What skills should I develop for {targetRole}?",
    "How can I learn {missingSkill} effectively?",
    "What's the fastest path to becoming a {targetRole}?",
    "How do I demonstrate {skill} proficiency to employers?",
    "What certifications complement my {skill} experience?"
];
```

**4. Interview Preparation**
```javascript
const interviewTemplates = [
    "How should I prepare for a {jobTitle} interview at {company}?",
    "What STAR examples showcase my {skill} experience?",
    "What questions should I ask in my {company} interview?",
    "How can I explain my career transition to {targetRole}?",
    "What salary range should I expect for {jobTitle}?"
];
```

**5. Resume & Documents**
```javascript
const documentTemplates = [
    "What accomplishments should I highlight from {recentProject}?",
    "How should I update my resume with my latest experience?",
    "What keywords should I include for {targetRole} positions?",
    "How can I tailor my resume for {company}?",
    "What's the best format for a {targetRole} resume?"
];
```

**6. Career Strategy**
```javascript
const careerTemplates = [
    "What's my next career move after {currentRole}?",
    "How can I transition from {currentRole} to {targetRole}?",
    "What's holding me back from reaching {careerGoal}?",
    "How do I build a personal brand in {industry}?",
    "What networking strategies work for {targetRole} positions?"
];
```

**7. Skill Gap Analysis**
```javascript
const skillGapTemplates = [
    "I notice you're missing {missingSkill} for {targetRole}. Want to create a learning plan?",
    "Your profile shows strong {skill1} but limited {skill2}. Should we explore that?",
    "You completed {project} recently - did you gain new skills to document?",
    "Your {careerPath} trajectory suggests learning {suggestedSkill}. Interested?"
];
```

### Trigger Rules System

**Rule Definition Structure:**
```javascript
{
    id: "interview-preparation-trigger",
    name: "Upcoming Interview Detected",
    enabled: true,
    conditions: [
        {
            type: "and",
            rules: [
                { field: "upcomingInterviews", operator: "length_gt", value: 0 },
                { field: "upcomingInterviews[0].date", operator: "days_until", value: [2, 7] }
            ]
        }
    ],
    suggestionTemplateIds: ["interview-prep-specific", "star-examples", "company-research"],
    priority: 9,  // High priority
    maxSuggestions: 2
}
```

**Operator Types:**
```javascript
const operators = {
    "length_gt": (arr, val) => arr.length > val,
    "length_eq": (arr, val) => arr.length === val,
    "exists": (field) => field !== null && field !== undefined,
    "days_since": (date, range) => {
        const days = Math.floor((Date.now() - new Date(date)) / (1000*60*60*24));
        return days >= range[0] && days <= range[1];
    },
    "days_until": (date, range) => {
        const days = Math.floor((new Date(date) - Date.now()) / (1000*60*60*24));
        return days >= range[0] && days <= range[1];
    },
    "contains": (arr, val) => arr.includes(val),
    "not_contains": (arr, val) => !arr.includes(val),
    "equals": (a, b) => a === b,
    "not_equals": (a, b) => a !== b
};
```

### Priority Ranking Algorithm

```javascript
function rankSuggestions(suggestions, canvasContext, userHistory) {
    return suggestions.map(suggestion => {
        let score = suggestion.basePriority;  // 1-10

        // Time sensitivity boost
        if (suggestion.category === 'interview-prep' && canvasContext.upcomingInterviews.length > 0) {
            const daysUntil = getDaysUntil(canvasContext.upcomingInterviews[0].date);
            if (daysUntil <= 3) score += 5;  // Urgent
            else if (daysUntil <= 7) score += 3;  // Important
        }

        // Recency boost (prefer suggestions for recent Canvas changes)
        if (suggestion.relatedEntity && wasUpdatedRecently(suggestion.relatedEntity)) {
            score += 2;
        }

        // Diversity penalty (avoid showing same category repeatedly)
        const categoryFrequency = userHistory.recentSuggestionCategories.filter(
            cat => cat === suggestion.category
        ).length;
        score -= categoryFrequency * 0.5;

        // Engagement history boost
        if (userHistory.highEngagementCategories.includes(suggestion.category)) {
            score += 1;
        }

        // Dismissal penalty
        if (userHistory.dismissedSuggestions.includes(suggestion.id)) {
            score -= 10;  // Effectively exclude
        }

        // Freshness boost (never shown before)
        if (!userHistory.shownSuggestions.includes(suggestion.id)) {
            score += 1;
        }

        return { ...suggestion, computedScore: score };
    })
    .sort((a, b) => b.computedScore - a.computedScore)
    .slice(0, 4);  // Top 4 suggestions
}
```

### Caching Strategy

**Cache Structure:**
```javascript
const suggestionCache = {
    lastAnalyzedContext: {},  // Hash of Canvas data
    lastAnalysisTime: 1700000000000,  // Timestamp
    cachedSuggestions: [],  // Generated suggestions
    ttl: 300000,  // 5 minutes

    // Check if cache is valid
    isValid: function(currentContext) {
        const contextChanged = this.hashContext(currentContext) !== this.lastAnalyzedContext;
        const cacheExpired = Date.now() - this.lastAnalysisTime > this.ttl;
        return !contextChanged && !cacheExpired;
    },

    // Generate hash of Canvas data
    hashContext: function(context) {
        return JSON.stringify({
            projects: context.activeProjects,
            skills: context.documentedSkills,
            interviews: context.upcomingInterviews.length,
            lastUpdate: context.lastCanvasUpdate
        });
    }
};
```

**Cache Invalidation Triggers:**
- Canvas data changes (new project, skill, goal, etc.)
- User dismisses suggestion
- User submits question
- 5 minutes elapsed since last analysis
- User navigates away from Canvas and returns

### Azure OpenAI Integration (Phase 2)

**API Request Format:**
```javascript
async function generateAISuggestions(canvasContext, userProfile) {
    const anonymizedContext = anonymizeContext(canvasContext);

    const prompt = `
You are a career development assistant. Based on the following career profile, suggest 3 specific, actionable questions the user might want to ask about their career development.

Profile Summary:
- Current Role: ${anonymizedContext.currentRole}
- Target Role: ${anonymizedContext.targetRole}
- Skills: ${anonymizedContext.skills.join(', ')}
- Recent Activity: ${anonymizedContext.recentActivity}
- Active Goals: ${anonymizedContext.goalCount}

Return ONLY a JSON array of 3 question strings. Be specific and reference their actual data where appropriate.
Example format: ["How can I develop [skill] for [role]?", "What should I prioritize in [project]?", ...]
`;

    const response = await fetch('/api/azure-openai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: prompt,
            maxTokens: 200,
            temperature: 0.7
        })
    });

    const suggestions = await response.json();
    return parseSuggestions(suggestions);
}

function anonymizeContext(context) {
    // Remove all PII before sending to AI
    return {
        currentRole: context.currentRole || "Professional",
        targetRole: context.targetRole || "Next Career Step",
        skills: context.documentedSkills.slice(0, 5),  // Only top 5
        recentActivity: context.newEntriesThisWeek > 0 ? "Active updates" : "Stable profile",
        goalCount: context.activeGoals || 0,
        // NO: names, companies, dates, specific project titles, locations
    };
}
```

**Privacy Controls:**
```javascript
const aiSuggestionsSettings = {
    enabled: false,  // Default OFF (opt-in)
    allowedDataPoints: [
        "currentRole",      // User chooses what to share
        "targetRole",
        "skills",
        "projectCategories"  // Categories only, not names
    ],
    excludedDataPoints: [
        "companyNames",
        "personalNames",
        "dates",
        "locations",
        "salaryInfo",
        "specificProjectTitles"
    ],
    cacheAIResponses: true,
    cacheExpiry: 86400000  // 24 hours
};
```

---

## Privacy & Security Considerations

### Data Protection Requirements

**Client-Side Processing (Phase 1):**
- ✅ All context analysis happens in browser JavaScript
- ✅ No Canvas data transmitted to external services
- ✅ Suggestions generated from local templates
- ✅ User interaction tracking stored in localStorage only
- ✅ Aggregate analytics sent to Azure Application Insights (anonymized)

**Azure OpenAI Integration (Phase 2):**
- ⚠️ Requires explicit user opt-in (disabled by default)
- ✅ Only anonymized, generic context sent to API
- ✅ PII removed: names, companies, dates, locations
- ✅ User controls which data categories are shared
- ✅ API responses cached locally (reduce API calls)
- ✅ All data transmission over HTTPS
- ✅ Compliance with privacy-policy.html and privacy-principles.html

### Privacy Settings UI

**Location:** Canvas Settings → AI Assistant → Question Suggestions

**Controls:**
```
[ ] Enable AI-powered question suggestions (requires Azure OpenAI)
    ⓘ When disabled, suggestions use local rules only. No data leaves your device.

Share with AI Assistant:
[✓] Current and target roles
[✓] Skills and competencies
[✓] Project categories (generic, not specific titles)
[ ] Active goals (generic types only)
[ ] Document types (e.g., "resume", not content)
[ ] Interview statuses (e.g., "upcoming", not companies)

Never shared:
• Company names
• Personal names
• Specific dates
• Locations
• Salary information
• Project/document content
```

### Compliance Checklist

- [ ] ✅ No third-party analytics (only Azure Application Insights)
- [ ] ✅ No behavioral profiling for advertising
- [ ] ✅ No cross-site tracking
- [ ] ✅ No data sharing with partners/advertisers
- [ ] ✅ No use of user data for AI training (explicit Azure OpenAI policy)
- [ ] ✅ User data anonymized before Azure API calls
- [ ] ✅ Explicit opt-in required for AI features
- [ ] ✅ Users can delete all suggestion history
- [ ] ✅ Clear documentation of data usage in privacy policy

---

## Testing Requirements

### Unit Tests

**Context Analyzer Tests:**
```javascript
describe('Context Analyzer', () => {
    test('detects incomplete projects', () => {
        const context = analyzeCanvas(mockCanvasData);
        expect(context.incompleteProjects).toContain('Migration Project');
    });

    test('identifies skill gaps based on career path', () => {
        const context = analyzeCanvas(mockCanvasWithCareerPath);
        expect(context.skillGaps).toContain('Docker');
    });

    test('calculates days since last resume update', () => {
        const context = analyzeCanvas(mockCanvasWithResume);
        expect(context.daysSinceResumeUpdate).toBeGreaterThan(90);
    });
});
```

**Trigger Rules Tests:**
```javascript
describe('Trigger Rules Engine', () => {
    test('activates interview prep trigger 48-72 hours before interview', () => {
        const context = { upcomingInterviews: [{ date: '2025-11-20' }] };
        const triggers = evaluateTriggers(context);
        expect(triggers).toContainRule('interview-preparation-trigger');
    });

    test('does not activate skill gap trigger if no career path set', () => {
        const context = { targetRole: null, documentedSkills: ['JavaScript'] };
        const triggers = evaluateTriggers(context);
        expect(triggers).not.toContainRule('skill-gap-analysis');
    });
});
```

**Priority Ranking Tests:**
```javascript
describe('Priority Ranking', () => {
    test('prioritizes urgent interviews over general suggestions', () => {
        const suggestions = [
            { category: 'interview-prep', basePriority: 9 },
            { category: 'career-strategy', basePriority: 5 }
        ];
        const ranked = rankSuggestions(suggestions, mockContext, mockHistory);
        expect(ranked[0].category).toBe('interview-prep');
    });

    test('applies diversity penalty to repeated categories', () => {
        const history = { recentSuggestionCategories: ['project', 'project', 'project'] };
        const suggestions = [{ category: 'project', basePriority: 7 }];
        const ranked = rankSuggestions(suggestions, mockContext, history);
        expect(ranked[0].computedScore).toBeLessThan(7);
    });
});
```

### Integration Tests

**Canvas Integration:**
```javascript
describe('Canvas Integration', () => {
    test('suggestions update when new project added', async () => {
        const canvas = new CanvasManager();
        await canvas.addProject({ title: 'New Project', status: 'incomplete' });

        const suggestions = await getSuggestions();
        expect(suggestions).toContainQuestion('How can I structure a project plan for New Project?');
    });

    test('cache invalidates on Canvas data change', async () => {
        const initialSuggestions = await getSuggestions();
        await updateCanvasData({ addedGoal: true });
        const newSuggestions = await getSuggestions();
        expect(newSuggestions).not.toEqual(initialSuggestions);
    });
});
```

**UI Interaction Tests:**
```javascript
describe('Suggestion Chip Interactions', () => {
    test('clicking suggestion populates chat input and submits', async () => {
        render(<SuggestionChips suggestions={mockSuggestions} />);
        const chip = screen.getByText(/How can I structure a project plan/);

        fireEvent.click(chip);

        expect(chatInput.value).toBe('How can I structure a project plan for New Project?');
        expect(mockSubmitChat).toHaveBeenCalled();
    });

    test('dismissing suggestion removes it and records dismissal', async () => {
        render(<SuggestionChips suggestions={mockSuggestions} />);
        const dismissBtn = screen.getAllByTitle('Dismiss suggestion')[0];

        fireEvent.click(dismissBtn);

        expect(screen.queryByText(/How can I structure/)).not.toBeInTheDocument();
        expect(localStorage.dismissedSuggestions).toContain('suggestion-id-1');
    });
});
```

### End-to-End Tests (Playwright)

**User Journey: New User Onboarding**
```javascript
test('new user sees onboarding suggestions', async ({ page }) => {
    await page.goto('/career-canvas.html');
    await clearLocalStorage(page);

    // AI Assistant panel should show onboarding suggestions
    const suggestions = await page.locator('.suggestion-chip').all();
    expect(suggestions.length).toBeGreaterThanOrEqual(3);

    const firstSuggestion = suggestions[0];
    expect(await firstSuggestion.textContent()).toContain('How do I get started');

    // Click suggestion
    await firstSuggestion.click();

    // Chat input should be populated and message sent
    await expect(page.locator('.chat-message.assistant')).toBeVisible();
});
```

**User Journey: Interview Preparation**
```javascript
test('shows interview prep suggestions for upcoming interviews', async ({ page }) => {
    await page.goto('/career-canvas.html');

    // Add job application with upcoming interview
    await addJobApplication(page, {
        company: 'TechCorp',
        role: 'Senior Developer',
        status: 'Interview',
        interviewDate: addDays(new Date(), 3)
    });

    // Refresh suggestions
    await page.reload();

    // Should see interview-specific suggestion
    const interviewSuggestion = await page.locator('.suggestion-chip')
        .filter({ hasText: /prepare for a Senior Developer interview/ })
        .first();

    expect(interviewSuggestion).toBeVisible();
    expect(await interviewSuggestion.textContent()).toContain('TechCorp');
});
```

### Performance Tests

**Metrics:**
- Context analysis: < 100ms for typical Canvas (100+ items)
- Suggestion generation: < 200ms (rules-based)
- Suggestion generation: < 2000ms (AI-powered, with caching)
- UI render: < 50ms for 4 suggestions
- Cache hit rate: > 80% for repeated analysis

**Load Testing:**
```javascript
test('handles large Canvas efficiently', () => {
    const largeCanvas = generateMockCanvas({
        projects: 50,
        skills: 100,
        goals: 30,
        applications: 40
    });

    const startTime = performance.now();
    const context = analyzeCanvas(largeCanvas);
    const suggestions = generateSuggestions(context);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(300);  // 300ms max
    expect(suggestions.length).toBeGreaterThan(0);
});
```

---

## Success Metrics

### Primary Metrics (KPIs)

**Engagement:**
- **Suggestion Click-Through Rate:** Target > 25% (users click at least 1 suggestion per session)
- **Assistant Interaction Increase:** Target 30% increase in messages sent vs. pre-feature baseline
- **Session Duration:** Target 15% increase in time spent in Canvas

**User Satisfaction:**
- **Feature Adoption Rate:** Target 60% of active users interact with suggestions within 30 days
- **Repeat Usage:** Target 40% of users click suggestions in 3+ sessions
- **Dismissal Rate:** Target < 30% (users find suggestions relevant, not annoying)

### Secondary Metrics

**Suggestion Quality:**
- **Category Distribution:** Ensure diverse suggestions (no single category > 40% of impressions)
- **Freshness Score:** 50%+ of suggestions should be unique (not seen in last 7 days)
- **Contextual Accuracy:** Manual review of 100 suggestions confirms 90%+ use correct Canvas data

**Technical Performance:**
- **Cache Hit Rate:** > 80% (efficient suggestion reuse)
- **Analysis Latency:** < 100ms (p95)
- **UI Render Time:** < 50ms (p95)

**Privacy Compliance:**
- **Opt-In Rate (AI):** Track what % of users enable Phase 2 AI suggestions
- **Data Sharing Settings:** Track which Canvas sections users exclude from analysis
- **Privacy Incidents:** 0 (no PII leaks, no unauthorized data transmission)

### Analytics Implementation

**Events to Track (Anonymized):**
```javascript
// Suggestion Impression
trackEvent('suggestion_shown', {
    suggestionId: 'hashed-id',
    category: 'interview-prep',
    priority: 9,
    sessionId: 'anonymous-session-id',
    timestamp: Date.now()
});

// Suggestion Interaction
trackEvent('suggestion_clicked', {
    suggestionId: 'hashed-id',
    category: 'interview-prep',
    sessionId: 'anonymous-session-id',
    timestamp: Date.now()
});

// Suggestion Dismissal
trackEvent('suggestion_dismissed', {
    suggestionId: 'hashed-id',
    category: 'career-strategy',
    sessionId: 'anonymous-session-id',
    timestamp: Date.now()
});

// Canvas Context Summary (Aggregate)
trackEvent('canvas_context_analyzed', {
    projectCount: 5,
    skillCount: 12,
    goalCount: 3,
    hasUpcomingInterviews: true,
    hasIncompleteProjects: true,
    sessionId: 'anonymous-session-id',
    timestamp: Date.now()
});
```

**Dashboard Views:**
- Suggestion CTR by category (bar chart)
- Suggestion dismissal rate over time (line chart)
- Top 10 most-clicked suggestions (table)
- Canvas context distributions (pie chart: new users vs. active vs. power users)
- AI opt-in rate trend (line chart, Phase 2 only)

---

## Implementation Phases

### Phase 1: Rules-Based Suggestions (3 weeks)

**Week 1: Foundation**
- [ ] Create `/shared/context-analyzer.js` with Canvas data extraction
- [ ] Create `/shared/suggestion-templates.js` with 30+ question templates
- [ ] Create `/shared/suggestion-engine.js` with trigger rules and priority ranking
- [ ] Implement caching strategy (localStorage-based)
- [ ] Write unit tests for all components

**Week 2: UI Integration**
- [ ] Design and implement suggestion chip component in career-canvas.html
- [ ] Add suggestion click handler (populate chat input + submit)
- [ ] Add suggestion dismissal handler (localStorage persistence)
- [ ] Integrate with existing AI assistant panel
- [ ] Implement mobile-responsive design
- [ ] Add loading states and empty states

**Week 3: Testing & Refinement**
- [ ] Write integration tests (Canvas data changes trigger re-analysis)
- [ ] Write Playwright E2E tests (user journeys)
- [ ] Performance testing (large Canvas scenarios)
- [ ] Accessibility audit (keyboard navigation, screen readers)
- [ ] Beta testing with 10-20 internal users
- [ ] Refine suggestion templates based on feedback

### Phase 2: AI-Powered Suggestions (4 weeks)

**Week 4-5: Azure OpenAI Integration**
- [ ] Create `/api/azure-openai/suggestions` endpoint (or client-side SDK)
- [ ] Implement context anonymization function
- [ ] Build prompt engineering templates for suggestion generation
- [ ] Implement API response caching (localStorage, 24h TTL)
- [ ] Add error handling and fallback to rules-based suggestions
- [ ] Write unit tests for anonymization and API calls

**Week 6: Privacy Controls**
- [ ] Design privacy settings UI in Canvas Settings panel
- [ ] Implement opt-in/opt-out toggle for AI suggestions
- [ ] Implement granular data sharing controls (checkboxes for Canvas sections)
- [ ] Add "What data is shared?" info tooltip with clear explanations
- [ ] Update privacy-policy.html with AI suggestion feature disclosure
- [ ] Write tests for privacy controls (verify no data leaks)

**Week 7: Hybrid System & Testing**
- [ ] Merge rules-based and AI-powered suggestions (single priority queue)
- [ ] Implement diversity algorithm (ensure mix of both sources)
- [ ] A/B testing framework (50% rules-only, 50% hybrid)
- [ ] Write integration tests for hybrid system
- [ ] Playwright E2E tests for privacy settings workflow
- [ ] Performance testing (API latency, cache effectiveness)

**Week 8: Analytics & Rollout**
- [ ] Implement anonymized analytics tracking (Azure Application Insights)
- [ ] Create analytics dashboard (suggestion engagement metrics)
- [ ] Beta testing with 50 users (opt-in for Phase 2)
- [ ] Gather feedback on AI suggestion quality
- [ ] Refine AI prompts based on feedback
- [ ] Final QA and production deployment

---

## Design Mockups (Description)

### Desktop Layout (1440px+)

**AI Assistant Panel - Before Feature:**
```
┌────────────────────────────────────────┐
│  AI Career Assistant            [...]  │  ← Header
├────────────────────────────────────────┤
│                                        │
│  [Previous chat messages...]           │
│                                        │
│  User: How do I prepare for interviews?│
│                                        │
│  Assistant: Here are some tips...     │
│                                        │
├────────────────────────────────────────┤
│  Type your message...           [Send] │  ← Input
└────────────────────────────────────────┘
```

**AI Assistant Panel - After Feature:**
```
┌────────────────────────────────────────┐
│  AI Career Assistant            [...]  │  ← Header
├────────────────────────────────────────┤
│  💡 Suggested Questions:              │  ← NEW SECTION
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ 💡 How can I structure a project│  │  ← Chip 1
│  │    plan for Migration Project?  │×││
│  └─────────────────────────────────┘  │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ 💡 What skills should I develop │  │  ← Chip 2
│  │    for Senior Developer?        │×││
│  └─────────────────────────────────┘  │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ 💡 How should I prepare for a   │  │  ← Chip 3
│  │    Senior Dev interview at...   │×││
│  └─────────────────────────────────┘  │
│                                        │
├────────────────────────────────────────┤
│  [Previous chat messages...]           │
│                                        │
│  User: How do I prepare for interviews?│
│                                        │
│  Assistant: Here are some tips...     │
│                                        │
├────────────────────────────────────────┤
│  Type your message...           [Send] │
└────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

**Compact Suggestion Chips:**
```
┌──────────────────────────┐
│  AI Assistant      [...]  │
├──────────────────────────┤
│  💡 Suggestions:         │
│                          │
│  ┌────────────────────┐ │
│  │ 💡 Structure plan │×││ ← Chip wraps to 2 lines
│  │    for Migration... │ │
│  └────────────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │ 💡 Develop skills │×││
│  │    for Senior Dev   │ │
│  └────────────────────┘ │
│                          │
├──────────────────────────┤
│  [Chat messages...]      │
├──────────────────────────┤
│  Type...          [Send] │
└──────────────────────────┘
```

### Interaction States

**Hover State (Desktop):**
- Chip background: `#e3f2fd` (light blue)
- Border: `#0066CC` (primary blue)
- Text color: `#0066CC`
- Lightbulb icon: Slightly larger (1.1x scale)
- Cursor: Pointer

**Dismissal Interaction:**
- User hovers over dismiss icon (X)
- X changes from gray to red
- Click removes chip with fade-out animation (300ms)
- Toast notification: "Suggestion dismissed. You won't see this again for 7 days."

**Empty State (No Suggestions):**
- Show placeholder text: "No suggestions right now. Keep building your Canvas for personalized guidance!"
- Light bulb icon (muted gray)

---

## Accessibility Considerations

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- [ ] Suggestion chips are focusable (Tab key)
- [ ] Enter key triggers chip click (submits question)
- [ ] Escape key dismisses focused chip
- [ ] Focus indicator visible (2px blue outline)

**Screen Reader Support:**
- [ ] Chips have `role="button"` and `aria-label="Ask: [question text]"`
- [ ] Dismiss button has `aria-label="Dismiss suggestion"`
- [ ] Suggestion section has `aria-label="Suggested questions based on your career profile"`
- [ ] Announce suggestion updates with `aria-live="polite"` region

**Visual Accessibility:**
- [ ] Color contrast ratio > 4.5:1 (text vs. background)
- [ ] Focus states use outline, not just color
- [ ] Icons have text alternatives
- [ ] Font size minimum 13px (readable on mobile)

**Reduced Motion:**
- [ ] Respect `prefers-reduced-motion` for animations
- [ ] Disable fade-in/fade-out animations if user preference set
- [ ] Instant transitions instead

---

## Open Questions & Decisions Needed

### Product Decisions

1. **Suggestion Quantity:**
   - How many suggestions to show simultaneously? (Current proposal: 3-4)
   - Should this be user-configurable?

2. **Suggestion Refresh Frequency:**
   - How often to re-analyze Canvas and update suggestions?
   - Current proposal: Every 5 minutes or on Canvas data change
   - Should users manually refresh suggestions?

3. **Dismissal Persistence:**
   - How long should dismissed suggestions stay hidden? (Current: 7 days)
   - Should users be able to clear all dismissed suggestions?

4. **AI Opt-In Default:**
   - Should AI-powered suggestions be opt-in (current proposal) or opt-out?
   - Legal/privacy review needed

5. **Suggestion Fatigue:**
   - How to prevent users from becoming "blind" to suggestions over time?
   - Should we limit impressions per session?

### Technical Decisions

1. **Context Analysis Trigger:**
   - Real-time analysis on every Canvas change (performance concern)
   - Debounced analysis (5-second delay after last change)
   - Manual refresh button
   - **Recommendation:** Debounced + manual refresh option

2. **Storage Strategy:**
   - Where to store dismissed suggestions? (localStorage, IndexedDB, server-side?)
   - Current proposal: localStorage (client-side, no sync across devices)
   - Future: Sync via Azure Cosmos DB (requires authentication)

3. **Azure OpenAI Model:**
   - Which GPT model for suggestion generation? (GPT-4, GPT-4-Turbo, GPT-3.5-Turbo)
   - Trade-off: Cost vs. quality
   - **Recommendation:** GPT-3.5-Turbo (fast, cost-effective, sufficient for short suggestions)

4. **Internationalization:**
   - Should suggestions support multiple languages?
   - How to detect user language preference?
   - Current proposal: English-only for Phase 1, i18n in future

### Design Decisions

1. **Chip Design:**
   - Should chips have category icons? (project icon, skill icon, interview icon)
   - Should chips show priority indicators (e.g., "Urgent" badge)?
   - Current proposal: Single lightbulb icon for all, clean and simple

2. **Placement:**
   - Should suggestions appear above or below chat messages?
   - Current proposal: Above (prime position, always visible)
   - Alternative: Floating panel on the side

3. **Animation:**
   - Should new suggestions animate in? (Fade-in, slide-in, scale-in)
   - Current proposal: Subtle fade-in (300ms)
   - Respect `prefers-reduced-motion`

---

## Dependencies & Risks

### Dependencies

**Internal:**
- Canvas data structure stability (projects, skills, goals, applications)
- AI assistant chat interface (input submission hooks)
- Privacy settings infrastructure
- Azure Application Insights integration

**External:**
- Azure OpenAI API availability and rate limits (Phase 2)
- Browser localStorage reliability
- D3.js (if using visualizations in future iterations)

### Risks

**High Priority:**
1. **Privacy Violation Risk:**
   - Mitigation: Strict anonymization, opt-in only, thorough privacy review

2. **Suggestion Irrelevance:**
   - Risk: Users find suggestions annoying or irrelevant
   - Mitigation: Beta testing with real users, A/B testing, dismissal tracking

3. **Performance Degradation:**
   - Risk: Context analysis slows down Canvas interactions on large datasets
   - Mitigation: Debouncing, caching, performance testing, background processing

**Medium Priority:**
4. **AI Cost Overruns (Phase 2):**
   - Risk: Azure OpenAI API costs exceed budget with high usage
   - Mitigation: Aggressive caching, rate limiting, usage monitoring, fallback to rules-based

5. **User Fatigue:**
   - Risk: Users ignore suggestions after initial novelty wears off
   - Mitigation: Diversity algorithm, freshness scoring, smart refresh strategy

6. **Cross-Browser Compatibility:**
   - Risk: localStorage/caching issues in Safari, Firefox
   - Mitigation: Cross-browser testing, fallback strategies

**Low Priority:**
7. **Localization Challenges:**
   - Risk: Non-English users receive English-only suggestions
   - Mitigation: Not addressed in Phase 1, document for future

---

## Documentation Requirements

### User-Facing Documentation

**Help Article: "Understanding AI Suggestion Questions"**
- What are suggested questions?
- How are they generated?
- How to use them effectively
- How to dismiss irrelevant suggestions
- How to control privacy settings

**Privacy Policy Update:**
- Add section: "AI Career Assistant - Contextual Suggestions"
- Explain data analysis methodology
- Clarify opt-in vs. opt-out for AI-powered features
- Disclose Azure OpenAI usage (Phase 2)

### Developer Documentation

**README.md Update:**
- Add "Contextual Question Suggestions" to feature list
- Link to suggestion-engine.js documentation

**Technical Documentation:**
- `/docs/suggestion-engine.md` - Architecture and API reference
- `/docs/context-analyzer.md` - Canvas data extraction guide
- `/docs/suggestion-templates.md` - Template creation guide
- Code comments in all new JavaScript files

---

## Alternatives Considered

### Alternative 1: Search-Based Suggestions
**Description:** Instead of contextual suggestions, provide a searchable library of common career questions organized by category.

**Pros:**
- Simpler to implement (no context analysis)
- Predictable user experience
- No privacy concerns

**Cons:**
- Not personalized or contextual
- Lower engagement (users must actively search)
- Doesn't leverage Canvas data

**Decision:** Rejected. Not sufficiently differentiated from existing FAQ systems.

---

### Alternative 2: Always-On AI Analysis
**Description:** Continuously analyze Canvas data in real-time and show suggestions immediately as user types.

**Pros:**
- Maximum responsiveness
- Captures transient user intent

**Cons:**
- Performance concerns (constant analysis)
- Annoying/distracting during rapid Canvas edits
- Higher API costs (Phase 2)

**Decision:** Rejected. Too aggressive, likely to cause user fatigue.

---

### Alternative 3: Weekly Email Digest of Suggestions
**Description:** Instead of in-app suggestions, email users a weekly digest of personalized career questions.

**Pros:**
- Non-intrusive (users read on their schedule)
- Drives return visits to platform
- Easier to track engagement (email opens/clicks)

**Cons:**
- Not in-the-moment (users may not return to app)
- Requires email infrastructure and opt-in
- Disconnected from Canvas workflow

**Decision:** Considered for future enhancement, not primary implementation.

---

### Alternative 4: Voice-Activated Suggestions
**Description:** Users speak to the AI assistant, which verbally suggests questions based on voice context.

**Pros:**
- Natural conversation flow
- Accessibility benefit for vision-impaired users

**Cons:**
- Requires microphone permissions (privacy concern)
- High implementation complexity (speech-to-text, NLP)
- Not suited for all environments (open office, public spaces)

**Decision:** Rejected for Phase 1. Consider for future exploration.

---

## Rollout Plan

### Beta Phase (2 weeks)
- **Audience:** 50 internal users + 50 early adopter external users
- **Features:** Phase 1 only (rules-based suggestions)
- **Goals:**
  - Validate suggestion relevance (survey: "Were these suggestions helpful?")
  - Identify edge cases in context analysis
  - Measure baseline engagement metrics
- **Success Criteria:**
  - > 20% CTR on suggestions
  - < 40% dismissal rate
  - 0 critical bugs
  - Positive qualitative feedback (75%+ "useful" rating)

### Limited Release (4 weeks)
- **Audience:** 500 active Canvas users (randomly selected)
- **Features:** Phase 1 + Phase 2 (AI opt-in available)
- **A/B Testing:**
  - Control: No suggestions (baseline)
  - Variant A: Rules-based suggestions only
  - Variant B: Hybrid (rules + AI, for opted-in users)
- **Goals:**
  - Measure impact on assistant engagement
  - Track AI opt-in rate
  - Validate privacy controls effectiveness
  - Monitor Azure OpenAI costs

### Full Release (Gradual Rollout)
- **Week 1:** 25% of users
- **Week 2:** 50% of users
- **Week 3:** 75% of users
- **Week 4:** 100% of users
- **Monitoring:**
  - Real-time error tracking (Azure Monitor)
  - Performance metrics (latency, cache hit rate)
  - User engagement (CTR, dismissal rate, session duration)
  - Support tickets related to feature

### Post-Release
- **Week 5-8:** Gather feedback, iterate on templates
- **Month 2-3:** Optimize AI prompts (Phase 2), refine priority algorithm
- **Month 4+:** Explore alternative implementations (email digest, voice, advanced ML)

---

## Related Work & References

### Existing Cleansheet Resources
- **White Paper:** `/whitepapers/contextual-ai-assistant.html` - Comprehensive technical documentation of this feature
- **White Paper:** `/whitepapers/personal-career-chatbot-system.html` - Related AI assistant architecture
- **CLAUDE.md:** Privacy guidelines and AI integration standards
- **privacy-policy.html:** Legal privacy commitments
- **career-canvas.html:** Main implementation file

### Industry Benchmarks
- **LinkedIn:** "Jobs you may be interested in" recommendations (contextual job suggestions)
- **Grammarly:** Writing suggestions based on document context
- **Notion AI:** Contextual prompt suggestions in document editor
- **ChatGPT:** Suggested follow-up questions after responses

### Academic/Technical References
- Context-Aware Recommendation Systems (ACM RecSys)
- Privacy-Preserving Personalization (GDPR compliance patterns)
- Human-AI Interaction Patterns (Microsoft FATE)

---

## Contact & Feedback

**Feature Owner:** [Product Manager Name]
**Technical Lead:** [Engineering Lead Name]
**Design Lead:** [Designer Name]

**Feedback Channels:**
- GitHub Discussions: [Link]
- Slack: #career-canvas-ai
- User Research Sessions: [Calendar Link]

---

**Issue Created:** 2025-11-18
**Last Updated:** 2025-11-18
**Version:** 1.0
