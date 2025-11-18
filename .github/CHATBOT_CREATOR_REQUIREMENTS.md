# Feature Requirements: Cleansheet Profile Chatbot Creator

**Epic:** Enable users to create and publish AI-powered chatbots based on their Cleansheet profile data

**Priority:** High
**Status:** Requirements Definition
**Target Release:** TBD
**Owner:** Product/Engineering

---

## Executive Summary

Allow Cleansheet users to create, configure, and publish AI-powered chatbots that represent their professional profile, experiences, skills, and career knowledge. Users control what information the chatbot exposes, receive a shareable URL, and maintain full privacy control over their data.

**Strategic Value:**
- Enables passive professional networking (chatbot answers questions while user is unavailable)
- Demonstrates platform capabilities to recruiters, hiring managers, and professional contacts
- Creates viral growth opportunity through shareable chatbot links
- Differentiates Cleansheet from static portfolio platforms

**Business Impact:**
- Increased user engagement and platform stickiness
- Enhanced value proposition for premium/coach tiers
- Viral growth mechanism through chatbot sharing
- Data-driven insights into what professional information is most valuable

---

## Table of Contents

1. [User Stories](#user-stories)
2. [Minimum Data Requirements](#minimum-data-requirements)
3. [Feature Flow](#feature-flow)
4. [Privacy and Compliance Requirements](#privacy-and-compliance-requirements)
5. [Technical Requirements](#technical-requirements)
6. [UX Requirements](#ux-requirements)
7. [Success Metrics](#success-metrics)
8. [Implementation Phases](#implementation-phases)
9. [Open Questions](#open-questions)
10. [Dependencies and Risks](#dependencies-and-risks)

---

## User Stories

### Epic User Story

**As a** Cleansheet user
**I want to** create an AI chatbot based on my professional profile
**So that** recruiters, hiring managers, and professional contacts can learn about my experience, skills, and career interests 24/7 without requiring my direct availability

### Detailed User Stories

#### Story 1: Chatbot Creation
**As a** user with a complete profile
**I want to** create a chatbot that represents my professional identity
**So that** I can share it with my network and potential employers

**Acceptance Criteria:**
- [ ] User accesses "Create Chatbot" feature from profile dashboard
- [ ] System validates minimum profile data requirements (see Minimum Data Requirements)
- [ ] System displays profile completeness indicator and missing data guidance
- [ ] User can proceed to chatbot configuration only if minimum thresholds are met
- [ ] System provides clear error messages for incomplete profiles with actionable next steps

**Technical Notes:**
- Backend validation to prevent API manipulation
- Frontend validation for immediate user feedback
- Profile completeness calculation stored and cached for performance

---

#### Story 2: Chatbot Configuration
**As a** user creating a chatbot
**I want to** control what information the chatbot can share
**So that** I maintain privacy and only expose information I'm comfortable sharing

**Acceptance Criteria:**
- [ ] User can toggle inclusion/exclusion of profile data categories:
  - Work experiences (by employer or role)
  - Skills and competencies
  - Projects and portfolio items
  - Career goals and interests
  - Education and certifications
  - Documents (selected subset)
  - Contact information (email, LinkedIn, GitHub)
- [ ] User can set chatbot personality/tone (Professional, Friendly, Technical, Executive)
- [ ] User can configure chatbot behavior rules:
  - Never share personal contact info
  - Always mention availability status
  - Emphasize specific skills or experiences
  - Redirect to external portfolio/website
- [ ] User can preview chatbot configuration before publishing
- [ ] Configuration is saved as draft (can edit before publishing)

**Technical Notes:**
- Configuration stored as JSON schema in database
- Granular permissions system for data access
- Configuration version history for rollback capability

---

#### Story 3: Chatbot Preview and Testing
**As a** user configuring a chatbot
**I want to** test how the chatbot responds before publishing
**So that** I can ensure it accurately represents me and respects my privacy boundaries

**Acceptance Criteria:**
- [ ] User can interact with chatbot in preview mode before publishing
- [ ] Preview mode uses actual profile data but doesn't log conversations
- [ ] User can ask test questions and evaluate responses
- [ ] User can iterate on configuration based on preview behavior
- [ ] System provides example test questions relevant to user's profile
- [ ] Preview indicates which data sources chatbot is using for each response

**Technical Notes:**
- Preview mode uses ephemeral chatbot instance (not persisted)
- Response citations show which profile data was referenced
- Test conversation history not stored permanently

---

#### Story 4: Chatbot Publishing
**As a** user satisfied with chatbot configuration
**I want to** publish my chatbot and receive a shareable URL
**So that** I can distribute it to my professional network

**Acceptance Criteria:**
- [ ] User can publish chatbot with one-click action
- [ ] System generates unique, user-friendly URL (e.g., `cleansheet.info/chat/username`)
- [ ] System provides multiple sharing options:
  - Direct link copy
  - QR code generation
  - LinkedIn post template
  - Email signature HTML snippet
  - Embeddable widget code (for personal websites)
- [ ] User receives confirmation email with chatbot URL and analytics dashboard link
- [ ] Published chatbot is immediately accessible to public (or restricted audience based on settings)

**Technical Notes:**
- URL slug validation and collision handling
- Custom domain support (future: chat.johnsmith.com)
- Analytics tracking code embedded in chatbot interface

---

#### Story 5: Chatbot Management
**As a** user with a published chatbot
**I want to** monitor usage, update configuration, and pause/unpublish as needed
**So that** I maintain control over my chatbot's availability and behavior

**Acceptance Criteria:**
- [ ] User can view chatbot analytics dashboard:
  - Total conversations and unique visitors
  - Most asked questions (aggregated, anonymized)
  - Peak usage times and traffic sources
  - Conversation duration and engagement metrics
- [ ] User can update chatbot configuration:
  - Edit data permissions
  - Update personality/tone
  - Modify behavioral rules
  - Changes take effect within 5 minutes
- [ ] User can pause chatbot (displays "Currently unavailable" message)
- [ ] User can unpublish chatbot (URL returns 404 or redirect)
- [ ] User can delete chatbot permanently (requires confirmation, irreversible)

**Technical Notes:**
- Real-time analytics pipeline (Azure Application Insights integration)
- Configuration updates use blue-green deployment pattern
- Soft delete for unpublished chatbots (30-day retention for recovery)

---

#### Story 6: Chatbot Visitor Experience
**As a** visitor to a Cleansheet chatbot
**I want to** ask questions and learn about the profile owner
**So that** I can evaluate them as a professional contact, candidate, or collaborator

**Acceptance Criteria:**
- [ ] Visitor accesses chatbot URL without authentication required
- [ ] Chatbot displays welcome message with profile owner's name and tagline
- [ ] Visitor can type questions in natural language
- [ ] Chatbot responds within 3 seconds with relevant, accurate information
- [ ] Chatbot includes citations/references to source data (e.g., "Based on my experience at Company X...")
- [ ] Chatbot handles out-of-scope questions gracefully (e.g., "I don't have information about that, but you can contact me at...")
- [ ] Visitor can rate chatbot responses (thumbs up/down)
- [ ] Visitor can request to connect directly (triggers notification to profile owner)
- [ ] Chatbot interface is mobile-responsive and accessible (WCAG 2.1 AA)

**Technical Notes:**
- No visitor authentication required (public access)
- Rate limiting to prevent abuse (10 messages per 5 minutes per IP)
- Bot detection and CAPTCHA for suspicious traffic
- Conversation history NOT stored (privacy-first approach)

---

#### Story 7: Insufficient Profile Data
**As a** user with an incomplete profile
**I want to** understand what information I need to provide before creating a chatbot
**So that** I can complete my profile and unlock chatbot creation

**Acceptance Criteria:**
- [ ] User attempting to create chatbot sees profile completeness indicator
- [ ] System displays checklist of minimum requirements with completion status:
  - ✓ At least 2 work experiences (with descriptions)
  - ✗ At least 5 skills tagged
  - ✓ Professional bio/summary (min 100 characters)
  - ✗ At least 1 project or portfolio item
- [ ] System provides "Complete Profile" button linking to relevant sections
- [ ] User can save chatbot as draft even with incomplete profile
- [ ] System sends reminder notification when profile becomes sufficiently complete
- [ ] User can request early access exception (reviewed by Cleansheet team)

**Technical Notes:**
- Real-time profile completeness calculation
- Progressive disclosure: show nearest requirements first
- Email notification when profile crosses completion threshold

---

## Minimum Data Requirements

To ensure chatbot quality and user satisfaction, the following minimum data thresholds must be met before publishing:

### Required Data (Blocking)

| Data Category | Minimum Requirement | Validation Rule | Rationale |
|---------------|---------------------|-----------------|-----------|
| **Professional Summary** | 100-500 characters | Non-empty, min length 100 | Provides conversational context about user's background |
| **Work Experiences** | 2 experiences with descriptions | Each experience must have: company, role, dates, description (min 50 chars) | Core professional identity; enables "Tell me about your experience at X" questions |
| **Skills** | 5 distinct skills | Non-empty skill names | Enables skill-based questions ("Do you have experience with Python?") |
| **Career Goals** | At least 1 goal or interest | Min 50 characters | Provides forward-looking context for opportunities |

### Recommended Data (Non-blocking, but warned)

| Data Category | Recommendation | Warning Message | Enhancement Value |
|---------------|----------------|-----------------|-------------------|
| **Projects** | 1+ projects with descriptions | "Adding projects helps showcase your work" | Enables detailed technical discussions |
| **Education** | Degree or certification | "Education info helps establish credibility" | Provides academic background context |
| **Documents** | Resume or portfolio PDF | "Sharing documents gives visitors more detail" | Enables "Can I see your resume?" questions |
| **Contact Info** | Email or LinkedIn | "Contact info helps visitors reach you" | Enables connection requests |

### Data Quality Validation

Beyond minimum quantity, system validates data quality:

- **No placeholder text:** Reject entries like "Lorem ipsum", "TBD", "N/A"
- **Reasonable length:** Flag descriptions under 30 characters as potentially incomplete
- **Date validation:** Start dates before end dates, no future end dates for completed roles
- **Skill uniqueness:** Deduplicate similar skills (e.g., "JavaScript" vs "Javascript")

### Progressive Profile Completion

System encourages ongoing profile improvement:

- **Chatbot Quality Score:** Display score (1-100) based on profile completeness
- **Improvement Suggestions:** "Your chatbot could answer 37% more questions if you add..."
- **Unlock Advanced Features:** Premium chatbot features (custom domain, analytics) require 80+ score

---

## Feature Flow

### 1. Chatbot Creation Flow

```
User Profile Dashboard
    ↓
[Create Chatbot] Button (Persona Canvas or Settings)
    ↓
Profile Completeness Check
    ├─→ INCOMPLETE: Show requirements checklist → [Complete Profile] button
    └─→ COMPLETE: Proceed to configuration
         ↓
Chatbot Configuration Screen
    ├─ Data Permissions (toggles for each data category)
    ├─ Personality Selection (Professional / Friendly / Technical / Executive)
    ├─ Behavioral Rules (checkboxes and text inputs)
    ├─ Advanced Settings (rate limiting, allowed domains, geo-restrictions)
    └─ Preview Panel (live chatbot test interface)
         ↓
[Preview Chatbot] Button → Test conversation modal
    ├─ Iterate on configuration
    └─ Satisfied with behavior
         ↓
[Publish Chatbot] Button
    ↓
Publishing Screen
    ├─ Generate unique URL slug (editable)
    ├─ Confirm data sharing consent
    └─ [Confirm and Publish]
         ↓
Success Screen
    ├─ Display shareable URL
    ├─ QR code
    ├─ Sharing templates
    └─ [Go to Analytics Dashboard]
```

### 2. Chatbot Management Flow

```
User Dashboard
    ↓
[My Chatbot] Section
    ├─ Status: Published / Paused / Draft
    ├─ URL: cleansheet.info/chat/username [Copy]
    ├─ Analytics Summary (conversations, visitors, top questions)
    └─ Actions:
         ├─ [View Analytics]
         ├─ [Edit Configuration]
         ├─ [Pause / Unpublish]
         └─ [Delete Chatbot]
```

### 3. Visitor Chatbot Interaction Flow

```
Visitor accesses: cleansheet.info/chat/username
    ↓
Chatbot Landing Page
    ├─ Profile owner's name, photo, tagline
    ├─ Welcome message: "Hi! I'm [Name]'s AI assistant. Ask me anything about my experience, skills, or projects."
    └─ Chat interface (text input, send button)
         ↓
Visitor types question: "Tell me about your Python experience"
    ↓
Chatbot processes query
    ├─ Retrieve relevant profile data (work experiences, projects, skills)
    ├─ Generate contextual response via LLM
    └─ Include citations: "I've used Python extensively at [Company X] where I..."
         ↓
Display response with:
    ├─ Response text
    ├─ Citations (links to source data)
    ├─ Suggested follow-up questions
    └─ Rate response (👍/👎)
         ↓
Visitor can:
    ├─ Continue conversation
    ├─ [Contact Owner] button → Opens contact modal
    └─ Exit (conversation not saved)
```

---

## Privacy and Compliance Requirements

### CRITICAL: Privacy Policy Alignment

All chatbot features MUST comply with `/home/paulg/git/Cleansheet/privacy-policy.html` and `/home/paulg/git/Cleansheet/privacy-principles.html`.

### Privacy Principles Applied to Chatbot

#### 1. No User Data for AI Training
**Policy Commitment:** "Your content and personal data are NEVER used to train our AI/LLM models."

**Implementation:**
- [ ] Chatbot conversations with visitors are NOT logged or stored beyond session duration
- [ ] Profile data used for chatbot responses is NOT used to train or fine-tune LLM models
- [ ] API calls to LLM providers (Azure OpenAI, Anthropic, etc.) explicitly opt out of training
- [ ] System architecture diagram must show clear separation between user data and model training pipelines
- [ ] Third-party LLM provider contracts must explicitly prohibit training on Cleansheet data

**Validation:**
- Quarterly audit of LLM provider data retention policies
- Automated testing to verify no conversation persistence beyond session
- Legal review of all LLM provider agreements

---

#### 2. User Control Over Data Sharing
**Policy Commitment:** "User controls what profile information is exposed to the chatbot"

**Implementation:**
- [ ] Granular permissions system: user can toggle visibility of each data category
- [ ] Default configuration is privacy-preserving (only basic info shared)
- [ ] User must explicitly opt-in to share sensitive data (contact info, documents)
- [ ] Configuration changes take effect immediately (no delayed updates)
- [ ] User can revoke chatbot at any time without data persistence

**Required Consent Flow:**
```
Before publishing chatbot:
    ↓
Display consent modal:
    "By publishing this chatbot, you authorize Cleansheet to:
    - Share selected profile data with chatbot visitors
    - Use your data to generate conversational responses
    - Collect anonymized analytics on chatbot usage

    You retain the right to:
    - Update data sharing settings at any time
    - Pause or unpublish your chatbot
    - Delete all chatbot data permanently

    Your conversations are NOT stored, and your data is NOT used for AI training."

    [Cancel] [I Understand, Publish Chatbot]
```

---

#### 3. No Third-Party Data Sharing
**Policy Commitment:** "We categorically do not share user data with partners, advertisers, or third parties"

**Implementation:**
- [ ] Chatbot conversations are NOT sent to third-party analytics platforms
- [ ] Visitor data (IP addresses, browser fingerprints) is NOT stored or shared
- [ ] LLM provider API calls include only necessary profile data, no PII
- [ ] No advertising, tracking pixels, or behavioral profiling in chatbot interface
- [ ] Chatbot embeds use first-party cookies only (no third-party tracking)

**Prohibited:**
- ❌ Google Analytics on chatbot pages
- ❌ Facebook Pixel or social media tracking
- ❌ Third-party chatbot platforms (Intercom, Drift, etc.)
- ❌ Data sharing with recruiters or job boards without explicit user consent
- ❌ Selling or licensing chatbot conversation data

---

#### 4. Anonymized Analytics Only
**Policy Commitment:** "Anonymized analytics cookies" are allowed

**Implementation:**
- [ ] Analytics collected via first-party Azure Application Insights only
- [ ] Aggregated metrics stored: conversation count, unique visitors, peak usage times
- [ ] Question themes analyzed in aggregate (not individual conversations)
- [ ] No personally identifiable visitor data retained (IP addresses anonymized)
- [ ] User can opt-out of analytics collection (disable tracking for their chatbot)

**Allowed Analytics:**
- ✅ Total number of conversations
- ✅ Unique visitors (anonymized cookie ID, not trackable across sites)
- ✅ Most common question themes (e.g., "30% of questions about Python skills")
- ✅ Average conversation duration
- ✅ Traffic sources (direct, LinkedIn, email, etc.)

**Prohibited Analytics:**
- ❌ Individual conversation transcripts
- ❌ Visitor identity or contact information
- ❌ Cross-site tracking or behavioral profiling
- ❌ Linking visitor activity to external profiles

---

#### 5. Data Deletion and Portability
**Policy Commitment:** "User can revoke/delete published chatbots at any time"

**Implementation:**
- [ ] One-click chatbot deletion from dashboard
- [ ] Confirmation modal: "This action is permanent. Your chatbot URL will become unavailable."
- [ ] Complete data deletion within 90 days (per privacy policy)
- [ ] User can export chatbot configuration and analytics before deletion (JSON format)
- [ ] Deleted chatbot URLs return 404 or redirect to Cleansheet homepage

**Data Export Format:**
```json
{
  "chatbot_id": "usr_abc123_chatbot_v1",
  "created_at": "2025-11-01T10:00:00Z",
  "published_at": "2025-11-02T14:30:00Z",
  "deleted_at": null,
  "configuration": {
    "personality": "Professional",
    "data_permissions": {
      "work_experiences": true,
      "skills": true,
      "projects": true,
      "contact_info": false
    }
  },
  "analytics": {
    "total_conversations": 127,
    "unique_visitors": 89,
    "avg_conversation_duration_seconds": 142,
    "top_question_themes": ["Python skills", "Project experience", "Availability"]
  }
}
```

---

#### 6. Visitor Privacy
**Policy Commitment:** Respect visitor privacy even if they are not Cleansheet users

**Implementation:**
- [ ] No visitor authentication required (public chatbot access)
- [ ] No visitor data collection beyond session cookies
- [ ] No email capture or contact forms without visitor consent
- [ ] Clear privacy notice on chatbot page: "This conversation is not recorded"
- [ ] Rate limiting and bot detection without persistent visitor tracking

**Visitor-Facing Privacy Notice:**
```
Privacy Notice (displayed at bottom of chatbot interface):
"This AI assistant shares information from [Name]'s Cleansheet profile.
Your conversation is not recorded or stored.
Learn more about Cleansheet privacy: [Link to privacy policy]"
```

---

### Compliance Checklist

Before feature launch, all items must be verified:

- [ ] **Legal Review:** Privacy policy updated to explicitly cover chatbot feature
- [ ] **Security Audit:** Penetration testing and vulnerability assessment completed
- [ ] **Data Flow Diagram:** Documented and reviewed showing all data touchpoints
- [ ] **LLM Provider Contracts:** Verified no training clauses, data retention policies documented
- [ ] **Consent Flows:** User consent modals tested and legally reviewed
- [ ] **GDPR Compliance:** Right to deletion, data portability, and access verified
- [ ] **CCPA Compliance:** California consumer rights implemented (if applicable)
- [ ] **Accessibility:** WCAG 2.1 AA compliance for chatbot interface
- [ ] **Terms of Service:** Updated to include chatbot acceptable use policy

---

## Technical Requirements

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Cleansheet Platform                       │
│                                                               │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │  User Profile   │────────▶│ Chatbot Config  │           │
│  │  (Data Service) │         │   (New Service) │           │
│  └─────────────────┘         └─────────────────┘           │
│          │                            │                      │
│          │                            ▼                      │
│          │                   ┌─────────────────┐           │
│          └──────────────────▶│  Chatbot Engine │           │
│                               │ (Azure Function)│           │
│                               └─────────────────┘           │
│                                        │                      │
└────────────────────────────────────────┼──────────────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────┐
                         │   Azure OpenAI Service    │
                         │ (LLM Inference, no train) │
                         └───────────────────────────┘
```

### Frontend Requirements

#### New Files
- **`chatbot-creator.html`** - Chatbot configuration interface
- **`chatbot-embed.html`** - Public chatbot interface for visitors
- **`shared/chatbot-service.js`** - Chatbot management API client
- **`shared/chatbot-embed-widget.js`** - Embeddable chatbot widget for external sites

#### Updates to Existing Files
- **`index.html`** - Add "Create Chatbot" card in Persona Canvas
- **`learner.html`** - Add "My Chatbot" section in profile dashboard
- **`shared/data-service.js`** - Add chatbot CRUD methods
- **`shared/api-schema.js`** - Add chatbot API endpoints

#### Chatbot Configuration UI Components
- Profile completeness indicator (progress bar + checklist)
- Data permission toggles (granular per category)
- Personality selector (radio buttons: Professional / Friendly / Technical / Executive)
- Behavioral rules builder (checkboxes + text inputs)
- Live preview panel (embedded chatbot test interface)
- URL slug editor (with validation and collision detection)
- Sharing tools (copy link, QR code, embed code, social templates)

#### Chatbot Embed UI Components
- Welcome message with profile owner's name and photo
- Chat message list (visitor and chatbot messages)
- Text input with send button (mobile-optimized)
- Response citations (links to source data)
- Suggested follow-up questions (clickable pills)
- Rate response buttons (thumbs up/down)
- Contact owner modal (trigger notification)
- Privacy notice footer

---

### Backend Requirements

#### New API Endpoints (add to `shared/api-schema.js`)

```javascript
chatbot: {
    // Check if user profile meets minimum requirements
    validateProfile: {
        method: 'GET',
        path: '/chatbot/validate-profile',
        response: {
            isValid: 'boolean',
            completeness: 'number', // 0-100 score
            missing: 'array', // List of missing requirements
            warnings: 'array' // List of recommended improvements
        }
    },

    // Create new chatbot configuration
    create: {
        method: 'POST',
        path: '/chatbot',
        body: {
            urlSlug: 'string', // Desired URL (e.g., 'john-smith')
            personality: 'string', // 'professional' | 'friendly' | 'technical' | 'executive'
            dataPermissions: 'object', // { work_experiences: true, skills: true, ... }
            behavioralRules: 'object', // { never_share_contact: true, ... }
            status: 'string' // 'draft' | 'published'
        },
        response: {
            chatbotId: 'string',
            publicUrl: 'string', // e.g., 'cleansheet.info/chat/john-smith'
            embedCode: 'string' // HTML snippet for embedding
        }
    },

    // Update chatbot configuration
    update: {
        method: 'PUT',
        path: '/chatbot/:id',
        body: {
            personality: 'string',
            dataPermissions: 'object',
            behavioralRules: 'object',
            status: 'string' // 'draft' | 'published' | 'paused'
        }
    },

    // Get chatbot configuration
    get: {
        method: 'GET',
        path: '/chatbot/:id',
        response: {
            chatbotId: 'string',
            userId: 'string',
            urlSlug: 'string',
            publicUrl: 'string',
            personality: 'string',
            dataPermissions: 'object',
            behavioralRules: 'object',
            status: 'string',
            createdAt: 'string',
            publishedAt: 'string',
            lastModifiedAt: 'string'
        }
    },

    // Delete chatbot
    delete: {
        method: 'DELETE',
        path: '/chatbot/:id',
        response: {
            success: 'boolean',
            deletedAt: 'string'
        }
    },

    // Get chatbot analytics
    analytics: {
        method: 'GET',
        path: '/chatbot/:id/analytics',
        params: {
            startDate: 'string', // ISO 8601 date
            endDate: 'string'
        },
        response: {
            totalConversations: 'number',
            uniqueVisitors: 'number',
            avgConversationDuration: 'number',
            topQuestionThemes: 'array', // [{ theme: 'Python skills', count: 45 }, ...]
            trafficSources: 'object', // { direct: 50, linkedin: 30, email: 20 }
            peakUsageTimes: 'array' // [{ hour: 14, count: 23 }, ...]
        }
    },

    // Public endpoint: Get chatbot by URL slug (unauthenticated)
    getBySlug: {
        method: 'GET',
        path: '/chat/:urlSlug',
        response: {
            chatbotId: 'string',
            ownerName: 'string',
            ownerPhoto: 'string',
            welcomeMessage: 'string',
            personality: 'string',
            availableData: 'array' // List of data categories chatbot can access
        }
    },

    // Public endpoint: Send message to chatbot (unauthenticated)
    sendMessage: {
        method: 'POST',
        path: '/chat/:urlSlug/message',
        body: {
            message: 'string',
            conversationId: 'string' // Session-only ID, not persisted
        },
        response: {
            response: 'string',
            citations: 'array', // [{ text: 'Based on my role at Company X', source: 'work_experience_123' }, ...]
            suggestedQuestions: 'array', // ['What projects have you worked on?', ...]
            conversationId: 'string'
        }
    }
}
```

#### Database Schema

**New Table: `chatbots`**

| Column | Type | Description |
|--------|------|-------------|
| `chatbot_id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to users table |
| `url_slug` | VARCHAR(100) | Unique, URL-safe identifier (e.g., 'john-smith') |
| `personality` | ENUM | 'professional', 'friendly', 'technical', 'executive' |
| `data_permissions` | JSONB | Granular data sharing settings |
| `behavioral_rules` | JSONB | Custom chatbot behavior rules |
| `status` | ENUM | 'draft', 'published', 'paused', 'deleted' |
| `created_at` | TIMESTAMP | Creation timestamp |
| `published_at` | TIMESTAMP | First publication timestamp |
| `last_modified_at` | TIMESTAMP | Last update timestamp |
| `deleted_at` | TIMESTAMP | Soft delete timestamp |

**Indexes:**
- Unique index on `url_slug` (for fast public chatbot lookup)
- Index on `user_id` (for user's chatbot management)
- Index on `status` (for filtering published chatbots)

---

**New Table: `chatbot_analytics` (Aggregate only, no conversation logs)**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `chatbot_id` | UUID | Foreign key to chatbots table |
| `date` | DATE | Analytics aggregation date |
| `total_conversations` | INTEGER | Total conversations on this date |
| `unique_visitors` | INTEGER | Unique anonymized visitors on this date |
| `avg_conversation_duration` | INTEGER | Average duration in seconds |
| `top_question_themes` | JSONB | Array of {theme, count} objects |
| `traffic_sources` | JSONB | Object with source counts {direct, linkedin, email, etc.} |

**Indexes:**
- Index on `chatbot_id, date` (for time-series analytics queries)

---

#### Azure Services Integration

**Azure OpenAI Service (Primary LLM Provider)**
- Model: GPT-4 or GPT-4-turbo (latest stable version)
- Deployment: Dedicated instance for Cleansheet (not shared)
- Configuration:
  - Temperature: 0.7 (balanced creativity and consistency)
  - Max tokens: 500 (concise responses)
  - System prompt: Includes user's profile context and behavioral rules
  - Opt-out of training: Explicitly configured in deployment settings

**Azure Functions (Chatbot Engine)**
- Function: `chatbot-message-handler`
  - Trigger: HTTP POST to `/chat/:urlSlug/message`
  - Process:
    1. Validate rate limiting (10 messages per 5 min per IP)
    2. Retrieve chatbot configuration and user profile data
    3. Build contextualized prompt with relevant profile information
    4. Call Azure OpenAI API
    5. Post-process response (extract citations, generate follow-up questions)
    6. Return response to visitor (no conversation persistence)
  - Timeout: 30 seconds
  - Concurrency: Auto-scale based on load

**Azure Application Insights (Analytics)**
- Custom events tracked:
  - `ChatbotMessageSent` (anonymized visitor ID, chatbot ID, question theme)
  - `ChatbotResponseRated` (chatbot ID, rating: positive/negative)
  - `ChatbotContactRequest` (chatbot ID, triggers notification to profile owner)
- No PII logged: IP addresses anonymized, conversation content NOT logged

**Azure Blob Storage (Optional: Chatbot Assets)**
- Store QR codes generated for chatbot URLs
- Store social sharing images (Open Graph metadata)

---

#### LLM Prompt Engineering

**System Prompt Template:**
```
You are an AI assistant representing [USER_NAME], a professional with expertise in [PRIMARY_SKILLS].
Your role is to answer questions about [USER_NAME]'s background, experience, and career interests based ONLY on the profile data provided below.

**Profile Context:**
[WORK_EXPERIENCES]
[SKILLS]
[PROJECTS]
[CAREER_GOALS]
[EDUCATION]

**Behavioral Rules:**
- Always speak in first person as if you are [USER_NAME]
- Only share information explicitly provided in the profile data
- If asked about information not in the profile, respond: "I don't have that information in my profile, but you can reach out to me directly at [CONTACT_METHOD]"
- [CUSTOM_RULES_FROM_USER_CONFIG]

**Tone:** [PERSONALITY] (Professional, Friendly, Technical, or Executive)

Now respond to the following question from a visitor:
[VISITOR_MESSAGE]
```

**Response Post-Processing:**
- Extract citations: Identify which profile data was referenced (e.g., "Based on my role at Company X")
- Generate follow-up questions: Use visitor's question to suggest 3 related questions
- Validate response: Ensure no hallucinated information or out-of-scope content

---

#### Rate Limiting and Abuse Prevention

**Visitor Rate Limits (per IP address):**
- 10 messages per 5-minute window
- 50 messages per 24-hour window
- Exceeding limits returns HTTP 429 with retry-after header

**Bot Detection:**
- CAPTCHA challenge after 3 rapid messages (< 5 seconds apart)
- Block known bot user agents and IPs
- Require JavaScript execution (no API-only access)

**Cost Controls:**
- Per-chatbot daily budget: Max 100 conversations per day (prevents runaway costs)
- Owner notification when 80% of daily budget consumed
- Upgrade to premium tier for unlimited conversations

---

### Data Service Updates

**File:** `shared/data-service.js`

Add new methods:

```javascript
// Chatbot Methods
async validateProfileForChatbot() {
    if (this.mode === 'api') {
        return this.backend.get('/chatbot/validate-profile');
    }

    // localStorage implementation
    const experiences = await this.backend.get('cleansheet-experiences') || [];
    const skills = await this.backend.get('cleansheet-skills') || [];
    const projects = await this.backend.get('cleansheet-projects') || [];
    const profile = await this.backend.get('user-profile') || {};

    const requirements = {
        professionalSummary: (profile.bio || '').length >= 100,
        workExperiences: experiences.filter(e => e.description?.length >= 50).length >= 2,
        skills: skills.length >= 5,
        careerGoals: (profile.careerGoals || '').length >= 50
    };

    const completeness = (Object.values(requirements).filter(Boolean).length / 4) * 100;

    return {
        isValid: Object.values(requirements).every(Boolean),
        completeness,
        missing: Object.entries(requirements).filter(([k, v]) => !v).map(([k]) => k),
        warnings: []
    };
}

async createChatbot(config) {
    if (this.mode === 'api') {
        return this.backend.post('/chatbot', config);
    }

    const chatbot = {
        chatbotId: this.backend.generateId(),
        ...config,
        createdAt: new Date().toISOString(),
        publicUrl: `cleansheet.info/chat/${config.urlSlug}`
    };
    await this.backend.set('user_chatbot', chatbot);
    return chatbot;
}

async getChatbot() {
    if (this.mode === 'api') {
        return this.backend.get('/chatbot');
    }

    return await this.backend.get('user_chatbot');
}

async updateChatbot(updates) {
    if (this.mode === 'api') {
        return this.backend.put('/chatbot', updates);
    }

    const chatbot = await this.getChatbot();
    if (chatbot) {
        const updated = {
            ...chatbot,
            ...updates,
            lastModifiedAt: new Date().toISOString()
        };
        await this.backend.set('user_chatbot', updated);
        return updated;
    }
    return null;
}

async deleteChatbot() {
    if (this.mode === 'api') {
        return this.backend.delete('/chatbot');
    }

    await this.backend.delete('user_chatbot');
    return { success: true };
}
```

---

## UX Requirements

### Design System Compliance

All chatbot UI must follow Cleansheet Corporate Professional design system:

- **Fonts:** Questrial (headings/UI), Barlow Light 300 (body text)
- **Colors:**
  - Primary Blue: `#0066CC`
  - Accent Blue: `#004C99`
  - Dark: `#1a1a1a` (headers)
  - Neutral Text: `#333333`
  - Neutral Background: `#f5f5f7`
  - Neutral Border: `#e5e5e7`
- **Icons:** Phosphor Icons (CDN: unpkg.com/@phosphor-icons/web)
- **Spacing:** CSS variables (--spacing-xs to --spacing-xxxl)
- **Responsive:** Mobile-first, primary breakpoint 768px

### Chatbot Creator Interface

**Page:** `chatbot-creator.html`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Header (Dark bg, Cleansheet logo, "Create Chatbot")   │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ Profile Completeness Indicator                   │   │
│  │ ██████████████░░░░ 75% Complete                 │   │
│  │ ✓ Professional summary                          │   │
│  │ ✓ 3 work experiences                            │   │
│  │ ✓ 8 skills                                       │   │
│  │ ✗ Career goals (required)                       │   │
│  │ [Complete Profile →]                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Configuration                                    │   │
│  │                                                  │   │
│  │ Chatbot URL:                                     │   │
│  │ cleansheet.info/chat/ [____________] [Check]    │   │
│  │                                                  │   │
│  │ Data Permissions:                                │   │
│  │ ☑ Work experiences    ☑ Skills                  │   │
│  │ ☑ Projects            ☐ Contact info             │   │
│  │ ☑ Career goals        ☐ Documents               │   │
│  │                                                  │   │
│  │ Personality:                                     │   │
│  │ ◉ Professional  ○ Friendly  ○ Technical         │   │
│  │                                                  │   │
│  │ Behavioral Rules:                                │   │
│  │ ☑ Never share personal contact info            │   │
│  │ ☑ Always mention I'm available for freelance   │   │
│  │ ☐ Emphasize leadership experience              │   │
│  │                                                  │   │
│  │ [Preview Chatbot] [Save Draft] [Publish]        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Live Preview                                     │   │
│  │ ┌─────────────────────────────────────────────┐ │   │
│  │ │ Hi! I'm John's AI assistant. Ask me         │ │   │
│  │ │ anything about my experience...             │ │   │
│  │ │                                             │ │   │
│  │ │ [Type your question here...]   [Send]       │ │   │
│  │ └─────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### Chatbot Embed Interface

**Page:** `chatbot-embed.html` (Public, no authentication)

**Layout (Desktop):**
```
┌─────────────────────────────────────────────────────────┐
│  ┌───────┐                                              │
│  │ Photo │  John Smith                                  │
│  └───────┘  Software Engineer | Python Expert          │
│                                                          │
│  Hi! I'm John's AI assistant. Ask me anything about    │
│  my experience, skills, or projects. I'm here to help! │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │  👤 Visitor: Tell me about your Python exp      │   │
│  │                                                  │   │
│  │  🤖 John's Assistant:                           │   │
│  │  I've been working with Python for 5 years...   │   │
│  │  [Based on: Experience at Company X →]          │   │
│  │                                                  │   │
│  │  Suggested questions:                            │   │
│  │  • What projects have you built with Python?    │   │
│  │  • Do you have experience with Django?          │   │
│  │                                                  │   │
│  │  👍 👎                                            │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌───────────────────────────────────────────┐         │
│  │ Type your question...             [Send]  │         │
│  └───────────────────────────────────────────┘         │
│                                                          │
│  [Contact John Directly]                                │
│                                                          │
│  Privacy: This conversation is not recorded.            │
│  Learn more: Cleansheet Privacy Policy                 │
└─────────────────────────────────────────────────────────┘
```

**Mobile-Responsive Adjustments:**
- Single-column layout
- Collapsible profile header (save vertical space)
- Full-width message bubbles
- Bottom-fixed input bar
- Touch-optimized send button (larger target area)

---

### Interaction Patterns

**Message Bubbles:**
- Visitor messages: Right-aligned, light blue background (#e3f2fd)
- Chatbot messages: Left-aligned, white background with border
- Timestamps: Small, muted text below each message (optional)

**Citations:**
- Inline links: "[Based on my role at Company X →]"
- Click to expand: Shows full profile data excerpt in modal
- Hover effect: Underline on hover

**Suggested Questions:**
- Pill-shaped buttons below chatbot response
- Click to auto-fill input and send
- Max 3 suggestions per response

**Response Rating:**
- Thumbs up/down icons (Phosphor: ph-thumbs-up, ph-thumbs-down)
- Fade to muted color after selection
- No undo (single-vote per message)

**Contact Owner Button:**
- Primary action button (blue background)
- Opens modal with:
  - Email input (visitor provides their contact)
  - Message textarea (optional note to profile owner)
  - [Send Connection Request] button
  - Sends notification to profile owner via Cleansheet platform

---

### Loading and Error States

**Loading States:**
- Message sending: Chatbot typing indicator (animated dots)
- Chatbot response: "Thinking..." with spinner
- Configuration save: "Saving..." overlay

**Error States:**
- Rate limit exceeded: "You've reached the message limit. Please try again in [X] minutes."
- Chatbot unavailable: "This chatbot is currently unavailable. Please try again later."
- Network error: "Connection lost. Please check your internet and try again."
- Invalid input: "Please enter a message before sending."

**Empty States:**
- No chatbot created: "You haven't created a chatbot yet. [Create Chatbot] to get started."
- Incomplete profile: "Complete your profile to unlock chatbot creation."

---

### Accessibility Requirements

**WCAG 2.1 AA Compliance:**
- [ ] Keyboard navigation: All interactive elements accessible via Tab/Enter
- [ ] Screen reader support: ARIA labels on all UI components
- [ ] Color contrast: All text meets 4.5:1 ratio (7:1 for large text)
- [ ] Focus indicators: Visible focus outlines on all interactive elements
- [ ] Alt text: All images and icons have descriptive alt text
- [ ] Form labels: All inputs have associated labels
- [ ] Error messages: Accessible and announced to screen readers

**Mobile Accessibility:**
- [ ] Touch targets: Minimum 44×44px for all tappable elements
- [ ] Zoom support: Page scales correctly up to 200%
- [ ] Orientation support: Works in portrait and landscape

---

## Success Metrics

### Primary KPIs (Critical Success Factors)

| Metric | Target | Measurement Method | Business Impact |
|--------|--------|-------------------|-----------------|
| **Chatbot Adoption Rate** | 30% of active users create a chatbot within 3 months | Track `chatbot_created` events in Application Insights | Indicates feature value and user engagement |
| **Chatbot Publish Rate** | 70% of created chatbots are published (not abandoned as drafts) | Ratio of published to total chatbots | Indicates configuration UX quality and user confidence |
| **Chatbot Engagement** | Average 5+ conversations per published chatbot in first month | Sum conversations / total published chatbots | Indicates chatbot utility and shareability |
| **Visitor Retention** | 40% of chatbot visitors ask 3+ questions | Track message count per conversation ID | Indicates chatbot response quality and helpfulness |

---

### Secondary KPIs (Feature Health)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Chatbot response time | < 3 seconds for 95th percentile | Azure Function execution duration |
| Chatbot uptime | 99.5% availability | Azure service health monitoring |
| Configuration completion rate | 80% of users complete config without abandoning | Funnel analysis (start → publish) |
| Profile completion after prompt | 50% of incomplete users complete profile after seeing requirements | Track profile updates after `create_chatbot_blocked` event |
| Visitor contact requests | 10% of visitors click "Contact Owner" | Track `contact_request_clicked` events |

---

### User Satisfaction Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Positive response rating | 70% thumbs up vs. thumbs down | Ratio of positive to total ratings |
| Chatbot creator NPS | 40+ (Promoters - Detractors) | Post-publish in-app survey |
| Support ticket volume | < 5% of chatbot creators submit support requests | Zendesk/support system tracking |

---

### Business Impact Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Viral coefficient | 1.2 (each chatbot brings 1.2 new platform visitors) | Track new user signups with referrer = chatbot URL |
| Premium tier conversion | 15% of chatbot creators upgrade to premium | Track subscription changes after chatbot creation |
| Profile completeness lift | 25% increase in profile data completeness | Compare profile metrics before/after chatbot feature launch |
| User retention | 20% higher 90-day retention for chatbot creators vs. non-creators | Cohort analysis |

---

### Analytics Dashboard

**User-Facing Dashboard (Per Chatbot):**
- Total conversations (last 7 days, 30 days, all time)
- Unique visitors (anonymized count)
- Most asked questions (top 10 themes, aggregated)
- Response ratings (thumbs up/down ratio)
- Traffic sources (direct, LinkedIn, email, other)
- Peak usage times (hour-of-day heatmap)

**Internal Analytics (Product Team):**
- Feature adoption funnel:
  - Profile completeness check → Config start → Config complete → Publish → Active (1+ conversation)
- Drop-off analysis:
  - % abandoning at each funnel stage
  - Common reasons for incomplete profiles
- Cost analysis:
  - Azure OpenAI API costs per chatbot conversation
  - Per-user monthly compute costs
- Quality metrics:
  - % chatbots with 0 conversations (dead chatbots)
  - Average response rating across all chatbots
  - Abuse reports (spam, inappropriate content)

---

## Implementation Phases

### Phase 1: MVP (Minimum Viable Product)
**Timeline:** 8-10 weeks
**Goal:** Launch basic chatbot creation with core functionality

#### Sprint 1-2: Profile Validation & Configuration UI (2 weeks)
**Deliverables:**
- [ ] Profile completeness calculation algorithm
- [ ] Requirements checklist UI (frontend)
- [ ] Chatbot configuration page (`chatbot-creator.html`)
- [ ] Data permission toggles and personality selector
- [ ] URL slug validation and collision detection
- [ ] Save as draft functionality

**Acceptance Criteria:**
- User can access "Create Chatbot" from profile dashboard
- System correctly validates minimum profile data
- User can configure data permissions and personality
- Configuration saves to localStorage or API
- URL slug is validated for uniqueness

---

#### Sprint 3-4: Chatbot Engine & LLM Integration (2 weeks)
**Deliverables:**
- [ ] Azure OpenAI Service deployment and configuration
- [ ] Azure Function: `chatbot-message-handler`
- [ ] Prompt engineering and system prompt templates
- [ ] Response post-processing (citations, follow-up questions)
- [ ] Rate limiting and abuse prevention
- [ ] Error handling and fallback responses

**Acceptance Criteria:**
- Chatbot engine processes visitor messages and returns responses
- Responses reference actual profile data (no hallucinations)
- Citations correctly link to source profile data
- Rate limiting prevents abuse (10 messages per 5 min)
- Error states handled gracefully

---

#### Sprint 5-6: Public Chatbot Interface & Publishing (2 weeks)
**Deliverables:**
- [ ] Chatbot embed page (`chatbot-embed.html`)
- [ ] Public API endpoint: `/chat/:urlSlug`
- [ ] Welcome message and profile owner display
- [ ] Message input/output UI
- [ ] Response rating (thumbs up/down)
- [ ] Mobile-responsive design
- [ ] Publish workflow (consent modal, URL generation)

**Acceptance Criteria:**
- Visitor can access chatbot via public URL
- Visitor can send messages and receive responses
- UI is mobile-responsive and accessible
- Visitor can rate responses
- Publishing workflow includes consent confirmation

---

#### Sprint 7-8: Analytics & Management Dashboard (2 weeks)
**Deliverables:**
- [ ] Chatbot analytics table (database schema)
- [ ] Azure Application Insights event tracking
- [ ] User-facing analytics dashboard
- [ ] Chatbot management UI (pause, edit, delete)
- [ ] Email notifications (chatbot published, contact request)
- [ ] QR code generation for chatbot URL

**Acceptance Criteria:**
- User can view chatbot usage statistics
- User can pause, edit, or delete chatbot
- Analytics update in near real-time (< 5 min delay)
- Email notifications sent correctly

---

#### Sprint 9-10: Testing, Polish, & Launch Prep (2 weeks)
**Deliverables:**
- [ ] End-to-end testing (creation, publishing, visitor interaction)
- [ ] Accessibility audit and fixes (WCAG 2.1 AA)
- [ ] Performance optimization (response time < 3 sec)
- [ ] Legal review (privacy policy update, consent flows)
- [ ] Documentation (user guide, support articles)
- [ ] Beta launch to 50 internal users

**Acceptance Criteria:**
- All primary user flows tested and bug-free
- Accessibility compliance verified
- Privacy policy updated and legally approved
- Beta testers successfully create and share chatbots
- Support documentation complete

---

### Phase 2: Enhancements (Post-MVP)
**Timeline:** 12-16 weeks (staged releases)

#### Enhancement 1: Advanced Configuration (4 weeks)
- [ ] Custom welcome messages
- [ ] Behavioral rule builder (if-then logic)
- [ ] Response tone customization (formal vs. casual)
- [ ] Multi-language support (chatbot responds in visitor's language)
- [ ] Whitelisted/blacklisted questions (never answer X, always answer Y)

#### Enhancement 2: Embed Widget (3 weeks)
- [ ] Embeddable chatbot widget for personal websites
- [ ] Widget customization (colors, position, size)
- [ ] JavaScript SDK for widget integration
- [ ] WordPress plugin (one-click embed)

#### Enhancement 3: Premium Features (4 weeks)
- [ ] Custom domain support (chat.johnsmith.com)
- [ ] Unlimited conversations (remove daily limits)
- [ ] Advanced analytics (conversation transcripts export)
- [ ] A/B testing (test multiple personality configurations)
- [ ] Chatbot team accounts (multiple chatbots per organization)

#### Enhancement 4: AI Improvements (3 weeks)
- [ ] Context retention across sessions (optional, user-controlled)
- [ ] Proactive suggestions ("Based on your question, you might also be interested in...")
- [ ] Voice input/output (speech-to-text, text-to-speech)
- [ ] Visual responses (show relevant portfolio images, project screenshots)

#### Enhancement 5: Integration & Automation (4 weeks)
- [ ] LinkedIn integration (auto-update chatbot with LinkedIn changes)
- [ ] Calendar integration (chatbot can schedule meetings)
- [ ] CRM integration (log chatbot interactions in Salesforce, HubSpot)
- [ ] Zapier integration (trigger workflows on chatbot events)

---

### Phase 3: Scale & Optimization (Post-Launch)
**Timeline:** Ongoing

#### Performance Optimization
- [ ] CDN distribution for chatbot embeds (reduce latency)
- [ ] Caching layer for profile data (reduce database load)
- [ ] LLM response caching (reuse responses for similar questions)
- [ ] Auto-scaling rules for Azure Functions (handle traffic spikes)

#### Cost Optimization
- [ ] Tiered LLM models (cheaper models for simple questions)
- [ ] Intelligent routing (detect question complexity, route to appropriate model)
- [ ] Conversation deduplication (detect repeat visitors, optimize context)

#### Security Hardening
- [ ] Advanced bot detection (ML-based traffic analysis)
- [ ] DDoS protection (Azure Front Door integration)
- [ ] Content moderation (block inappropriate visitor messages)
- [ ] Abuse reporting (allow chatbot owners to flag malicious visitors)

---

## Open Questions

### Product & Strategy Questions

1. **Freemium vs. Premium:**
   - Should chatbot creation be a free feature for all users, or premium-only?
   - If free, what limitations? (e.g., max 50 conversations/month, basic analytics only)
   - What premium features justify upgrade? (custom domain, unlimited conversations, advanced analytics)

2. **Branding:**
   - Should chatbot interface display "Powered by Cleansheet" badge?
   - Can users remove branding in premium tier?
   - How prominent should Cleansheet branding be in embed widget?

3. **Content Moderation:**
   - How do we handle inappropriate visitor messages to chatbots?
   - Should profile owners be able to review and block specific visitors?
   - What's the process for reporting abusive chatbot usage?

4. **Multi-Chatbot Support:**
   - Can users create multiple chatbots with different configurations (e.g., one for recruiting, one for freelancing)?
   - How do we manage multiple chatbots in the UI?
   - Pricing implications for multi-chatbot accounts?

5. **LLM Provider Strategy:**
   - Azure OpenAI only, or support multiple providers (Anthropic Claude, Google Gemini)?
   - Allow users to BYOK (Bring Your Own Key) for LLM providers?
   - How do we handle LLM provider downtime or rate limits?

---

### Technical Questions

1. **Conversation Persistence:**
   - Current design: conversations NOT stored (privacy-first)
   - User request: "I want to review past conversations with my chatbot"
   - Solution: Opt-in conversation logging with clear consent and data retention limits?

2. **Context Window Management:**
   - How many messages of context do we provide to LLM? (e.g., last 5 messages)
   - How do we handle long conversations that exceed token limits?
   - Should we summarize older messages to maintain context?

3. **Profile Data Synchronization:**
   - When user updates profile, how quickly does chatbot reflect changes?
   - Real-time sync, or scheduled refresh (e.g., every 5 minutes)?
   - How do we handle version conflicts if user updates profile mid-conversation?

4. **Scalability:**
   - What's the expected peak load? (concurrent chatbot conversations)
   - Azure Function scaling limits and cost implications?
   - When do we need dedicated infrastructure vs. serverless?

5. **Backup & Disaster Recovery:**
   - What happens if user accidentally deletes chatbot?
   - Soft delete retention period (30 days? 90 days?)
   - Backup strategy for chatbot configurations?

---

### UX & Design Questions

1. **Profile Completeness Thresholds:**
   - Are current minimum requirements too strict or too lenient?
   - Should requirements vary by user persona (e.g., developers need projects, managers need experience)?
   - How do we balance quality (comprehensive chatbots) vs. adoption (lower barriers)?

2. **Chatbot Personality:**
   - Are 4 personality presets sufficient (Professional, Friendly, Technical, Executive)?
   - Should users be able to define custom personality traits (e.g., "humorous", "concise")?
   - How do we train users on what each personality means?

3. **Citation UX:**
   - Current design: inline citations as links
   - Alternative: tooltip on hover with profile excerpt?
   - Should citations be optional (user can disable)?

4. **Visitor Onboarding:**
   - How do we teach visitors how to interact with chatbot?
   - Suggested starter questions vs. free-form input?
   - Tutorial overlay for first-time visitors?

5. **Mobile Experience:**
   - Full-screen chatbot vs. bottom sheet overlay?
   - Should chatbot work within Cleansheet app or require separate page?
   - Native app integration (iOS/Android) feasible?

---

### Privacy & Compliance Questions

1. **GDPR Compliance:**
   - How do we handle EU visitors to chatbots?
   - Cookie consent banner required for chatbot embeds?
   - Data processing agreements with LLM providers (Azure OpenAI) GDPR-compliant?

2. **CCPA Compliance:**
   - Do California users have right to know what data chatbot shares?
   - How do we provide "Do Not Sell My Personal Information" option?

3. **Children's Privacy:**
   - Platform age limit is 18+, but what if visitor is a minor?
   - How do we enforce age restrictions on public chatbot pages?

4. **Right to be Forgotten:**
   - If user deletes Cleansheet account, how do we handle published chatbot?
   - Automatic chatbot deletion, or allow transfer to new account?

5. **Third-Party Embeds:**
   - If user embeds chatbot on external website, who is responsible for compliance?
   - Do we need terms requiring embed sites to have privacy policies?

---

### Business Questions

1. **Pricing Model:**
   - Freemium: Free tier with limitations + Premium tier for power users?
   - Usage-based: Charge per conversation or per visitor?
   - Subscription: Monthly fee for unlimited chatbot usage?

2. **Go-to-Market Strategy:**
   - Beta launch to existing users first, or open to new signups?
   - Target audience: Job seekers, freelancers, consultants, or all professionals?
   - Marketing channels: LinkedIn ads, product hunts, influencer partnerships?

3. **Competitive Positioning:**
   - How do we differentiate from Linktree, Carrd, and other bio link tools?
   - Positioning: "AI-powered professional profile" vs. "smart bio link"?
   - Unique value proposition messaging?

4. **Revenue Projections:**
   - Expected conversion rate to premium tier?
   - Average revenue per user (ARPU) target?
   - Break-even point (cost of LLM inference vs. revenue)?

5. **Partnership Opportunities:**
   - Integrate with recruiting platforms (LinkedIn, Indeed)?
   - White-label chatbot solution for enterprises?
   - API access for third-party developers?

---

## Dependencies and Risks

### External Dependencies

| Dependency | Risk Level | Mitigation Strategy | Impact if Unavailable |
|------------|-----------|---------------------|----------------------|
| **Azure OpenAI Service** | HIGH | Contract with SLA, multi-region deployment, fallback to alternative LLM provider | Chatbots non-functional, feature unusable |
| **Azure Functions** | MEDIUM | Auto-scaling, health monitoring, fallback to Azure App Service | Slow response times, potential downtime |
| **Azure Application Insights** | LOW | Graceful degradation, log to file storage if unavailable | Analytics unavailable, feature still usable |
| **Phosphor Icons CDN** | LOW | Self-host icons as fallback, use built-in browser SVG | UI degraded, functionality intact |

---

### Internal Dependencies

| Dependency | Owner | Status | Blocking Phase |
|------------|-------|--------|---------------|
| **User Profile Data Model** | Engineering | Complete | Phase 1, Sprint 1 |
| **Data Service API** | Engineering | In Progress | Phase 1, Sprint 2 |
| **Design System (Corporate Professional)** | Design | Complete | All Phases |
| **Privacy Policy Update** | Legal | Not Started | Phase 1, Sprint 9 (Blocking) |
| **Azure Infrastructure Setup** | DevOps | Not Started | Phase 1, Sprint 3 (Blocking) |

---

### Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **LLM Hallucinations** | HIGH | HIGH | Strict system prompts, post-processing validation, citation requirements, user feedback loop |
| **LLM Cost Overruns** | MEDIUM | HIGH | Rate limiting, daily budgets per chatbot, tiered LLM models, caching layer |
| **Abuse & Spam** | MEDIUM | MEDIUM | CAPTCHA, bot detection, rate limiting, abuse reporting, IP blocking |
| **Slow Response Times** | MEDIUM | HIGH | Azure Function auto-scaling, CDN for static assets, LLM response caching, performance monitoring |
| **Data Privacy Breach** | LOW | CRITICAL | No conversation logging, encryption at rest/in transit, security audits, penetration testing |
| **URL Slug Collisions** | LOW | LOW | Validation before publish, suggest alternatives, allow custom slugs |

---

### Business Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **Low Adoption** | MEDIUM | HIGH | User research before launch, beta testing, iterative improvements based on feedback |
| **Poor Chatbot Quality** | MEDIUM | HIGH | Strict profile completeness requirements, personality presets, user testing, feedback loop |
| **Negative User Feedback** | LOW | MEDIUM | Beta launch, phased rollout, responsive support, rapid bug fixes |
| **Competitive Threat** | MEDIUM | MEDIUM | Unique positioning (privacy-first, career-focused), continuous innovation, premium features |
| **Regulatory Compliance Issues** | LOW | CRITICAL | Legal review before launch, privacy policy updates, GDPR/CCPA compliance verification |

---

### Compliance Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **GDPR Violation** | LOW | CRITICAL | EU visitor consent, data retention limits, right to deletion, DPA with LLM provider |
| **CCPA Violation** | LOW | HIGH | California visitor notice, opt-out mechanism, data transparency |
| **Privacy Policy Misalignment** | MEDIUM | CRITICAL | Legal review, explicit chatbot section in privacy policy, user consent flows |
| **LLM Training on User Data** | LOW | CRITICAL | Azure OpenAI contract review, explicit opt-out configuration, audit trail |

---

## Success Criteria for MVP Launch

Before launching to general availability, ALL criteria must be met:

### Functional Completeness
- [ ] User can create chatbot with minimum profile data
- [ ] User can configure data permissions and personality
- [ ] User can preview chatbot before publishing
- [ ] User can publish chatbot and receive shareable URL
- [ ] Visitor can access chatbot and have conversations
- [ ] Visitor can rate responses (thumbs up/down)
- [ ] User can view analytics dashboard
- [ ] User can pause, edit, or delete chatbot

### Quality Assurance
- [ ] Zero critical bugs in production
- [ ] < 5 medium-severity bugs in backlog
- [ ] 95th percentile response time < 3 seconds
- [ ] 99.5% uptime during beta period
- [ ] WCAG 2.1 AA accessibility compliance verified
- [ ] Mobile responsiveness tested on iOS and Android

### Privacy & Legal
- [ ] Privacy policy updated with chatbot section
- [ ] Legal review completed and approved
- [ ] Consent flows tested and functional
- [ ] Azure OpenAI contract verified (no training clause)
- [ ] GDPR compliance checklist completed
- [ ] CCPA compliance checklist completed

### User Validation
- [ ] 50 beta users successfully create and publish chatbots
- [ ] 70%+ beta users report satisfaction (NPS 40+)
- [ ] 100+ visitor conversations logged (aggregated analytics)
- [ ] 60%+ positive response ratings (thumbs up)
- [ ] < 10% beta users submit critical feedback

### Business Readiness
- [ ] Pricing model finalized (freemium vs. premium)
- [ ] Marketing materials prepared (landing page, blog post, video demo)
- [ ] Support documentation complete (user guide, FAQ, troubleshooting)
- [ ] Customer support team trained on chatbot feature
- [ ] Analytics dashboard operational (track adoption and engagement)

---

## Appendix

### Related Documents
- **Cleansheet Privacy Policy:** `/home/paulg/git/Cleansheet/privacy-policy.html`
- **Cleansheet Privacy Principles:** `/home/paulg/git/Cleansheet/privacy-principles.html`
- **Design System Guide:** `/home/paulg/git/Cleansheet/DESIGN_GUIDE.md`
- **API Schema:** `/home/paulg/git/Cleansheet/shared/api-schema.js`
- **Data Service:** `/home/paulg/git/Cleansheet/shared/data-service.js`

### Glossary
- **Chatbot:** AI-powered conversational interface representing a user's professional profile
- **Profile Owner:** Cleansheet user who creates and manages a chatbot
- **Visitor:** External person interacting with a published chatbot (not a Cleansheet user)
- **Configuration:** Settings controlling chatbot behavior (personality, data permissions, rules)
- **Citation:** Reference to source profile data used in chatbot response
- **URL Slug:** Unique identifier in chatbot URL (e.g., 'john-smith' in cleansheet.info/chat/john-smith)
- **Personality:** Predefined tone and style of chatbot responses (Professional, Friendly, Technical, Executive)
- **Data Permissions:** User-controlled toggles determining what profile data chatbot can access

### Contact
- **Product Owner:** TBD
- **Engineering Lead:** TBD
- **Design Lead:** TBD
- **Legal/Privacy:** TBD

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Status:** Requirements Definition Complete, Awaiting Approval
