# Cleansheet Recruiter Platform - Phased Roadmap

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Timeline:** 12-18 months
**Status:** Approved

---

## Executive Summary

This roadmap defines a 12-18 month plan to build a differentiated recruiting platform that leverages Cleansheet's existing job seeker infrastructure, respects strict privacy commitments, and fills critical gaps missing from traditional ATS systems (Zoho/BambooHR/Greenhouse/Lever). The approach prioritizes **privacy-first candidate access**, **Azure-native AI integration**, and **unique value propositions** that position Cleansheet as an intelligent recruiting co-pilot rather than another database-centric ATS.

### Core Differentiation Strategy

**What Traditional ATS Systems Do Well:**
- Candidate database management
- Application workflow tracking
- Job posting distribution
- Interview scheduling
- Compliance/EEOC reporting

**Where They Fall Short (Cleansheet's Opportunity):**
- ❌ **Intelligent candidate matching** - Manual search, weak AI
- ❌ **Email automation with context** - Generic templates, no learning
- ❌ **Skill-based sourcing** - Keyword search only, no semantic understanding
- ❌ **Market intelligence** - No real-time salary/demand data
- ❌ **Candidate experience** - Black hole application process
- ❌ **Recruiter productivity** - Heavy manual work, no AI assistance

### Core Value Proposition

Cleansheet Recruiter transforms recruiting from **database management** to **intelligent candidate discovery and engagement**, leveraging:

1. **Opt-in candidate profiles** from job seekers already using Cleansheet
2. **Azure OpenAI** for intelligent matching, email generation, and candidate insights
3. **Privacy-first architecture** that builds trust with candidates
4. **ML-powered automation** that eliminates recruiter busy-work
5. **Market intelligence** integrated directly into the workflow

---

## Existing Infrastructure (Leveraged, Not Rebuilt)

### ✅ Already Available

#### 1. Candidate Data Capture (experience-tagger.html)
**Status:** Production-ready
- Captures professional experiences with skills, technologies, career paths
- JSON import/export for data portability
- localStorage-based demo with API backend ready
- Card-based UI for experience management

**Recruiter Value:**
- Rich candidate profiles already structured
- Skills taxonomy aligned with job requirements
- Career trajectory visibility
- **Zero resume parsing needed on recruiter side**

#### 2. Learning & Content System (learner.html)
**Status:** Production-ready
- 189 curated technical articles with metadata
- Search/filter by expertise level, tags, career paths
- Bookmark and progress tracking
- Reading analytics

**Recruiter Value:**
- Demonstrates candidate learning initiative
- Skills verification through content engagement
- Career path alignment signals
- Upskilling trajectory visibility

#### 3. Data Infrastructure (shared/)
**Status:** Production-ready
- **data-service.js** - Unified CRUD interface (localStorage + REST API)
- **api-schema.js** - Complete API contract definitions
- **cleansheet-core.js** - Design tokens, utilities

**Recruiter Value:**
- Backend API patterns already defined
- Easy extension to recruiter-specific endpoints
- Consistent data access layer

#### 4. Privacy Framework
**Status:** Complete, legally binding
- No third-party data sharing
- Opt-in candidate visibility model
- Anonymized analytics only
- Azure Application Insights (first-party)

**Recruiter Value:**
- Trust differentiation in market
- GDPR/CCPA compliance built-in
- Candidate willingness to share data

#### 5. Azure Infrastructure
**Status:** Active
- Application Insights for analytics
- Static Web Apps hosting
- Entra External ID authentication ready
- Azure OpenAI access available

---

## Phased Implementation

### PHASE 1: Foundation & Candidate Discovery
**Timeline:** Months 1-4 (12-14 weeks)
**Goal:** Enable recruiters to discover and evaluate opt-in candidates

#### Features to Build

**1.1 Recruiter Portal (recruiter.html)**
- Login/authentication via Azure Entra External ID
- Dashboard with key metrics (candidates, active jobs, pipeline)
- Cleansheet Canvas layout (D3 mindmap + widgets)
- Dark header with main menu (Candidates, Jobs, Pipeline, Analytics)
- Profile dropdown menu

**1.2 Candidate Opt-In System**
- Job seeker profile setting: "Visible to recruiters" toggle
- Anonymized vs. full profile options
- Privacy consent workflow
- Data sharing preferences

**1.3 Candidate Discovery & Search**
- Semantic search using Azure OpenAI embeddings
- Filters: skills, experience level, location, career path
- Skill-based matching (not just keyword search)
- Save searches and alerts
- Candidate cards with summary data

**1.4 Candidate Profile Viewer**
- Full profile slideout (60% width, Cleansheet pattern)
- Experience timeline visualization
- Skills taxonomy display
- Learning engagement metrics
- Contact information (if opted in)
- Profile strength score

**1.5 Basic Communication**
- In-platform messaging
- Email integration via Azure Communication Services
- Message templates (static, no AI yet)
- Communication history tracking

#### Azure Services Integration
- **Azure Entra External ID** - Authentication
- **Azure Cosmos DB** - Recruiter data, jobs, communications
- **Azure Cognitive Search** - Candidate search with semantic ranking
- **Azure Communication Services** - Email delivery
- **Azure OpenAI** - Semantic search embeddings

#### API Endpoints (Extend api-schema.js)
```javascript
recruiters: {
  // Candidate discovery
  searchCandidates: { method: 'POST', path: '/recruiters/candidates/search' }
  getCandidate: { method: 'GET', path: '/recruiters/candidates/:id' }
  getCandidateProfile: { method: 'GET', path: '/recruiters/candidates/:id/profile' }

  // Communication
  sendMessage: { method: 'POST', path: '/recruiters/messages' }
  getMessageHistory: { method: 'GET', path: '/recruiters/messages/:candidateId' }
}
```

#### Success Metrics
- 50+ opt-in candidates in database
- <2 second semantic search response time
- 80% recruiter satisfaction with candidate profiles
- 10+ recruiters using platform weekly

#### Competitive Gap Closed
- ✅ **Intelligent candidate matching** vs. keyword-only search (Zoho/Greenhouse)
- ✅ **Opt-in candidate pool** vs. cold outreach (LinkedIn Recruiter)
- ✅ **Rich skill profiles** vs. resume parsing only (BambooHR)

**Estimated Effort:** 12-14 weeks

---

### PHASE 2: Job Management & Pipeline
**Timeline:** Months 5-8 (14-16 weeks)
**Goal:** Enable full recruiting workflow from job posting to offer

#### Features to Build

**2.1 Job Creation & Management**
- Job creation wizard with AI assistance (Azure OpenAI)
- Job description templates by role/level
- Skills requirement tagging (aligned with candidate taxonomy)
- Salary range and benefits
- Job status (Draft, Open, Filled, Closed)
- Clone/edit existing jobs

**2.2 Job Posting Distribution**
- Integration with job boards (Indeed, LinkedIn, Glassdoor APIs)
- One-click multi-board posting
- Custom career page embeds
- Posting analytics (views, applications, sources)
- Automatic posting expiration

**2.3 Pipeline & Stage Management**
- Customizable pipeline stages (Applied → Screen → Interview → Offer → Hired)
- Drag-and-drop candidate cards
- Stage-specific actions and requirements
- Pipeline analytics and funnel visualization
- Bulk candidate operations

**2.4 Interview Scheduling (Basic)**
- Availability calendar for recruiters
- Interview slot definition
- Manual scheduling (link candidates to slots)
- Email confirmations and reminders
- Google Calendar / Outlook integration

**2.5 Notes & Collaboration**
- Recruiter notes on candidates
- @mention other recruiters
- Interview feedback forms
- Rating/scoring system
- Activity timeline

#### Azure Services Integration
- **Azure Functions** - Job board API integrations, scheduled tasks
- **Azure Storage** - Resume/document storage
- **Azure Logic Apps** - Workflow automation (stage transitions)
- **Azure OpenAI** - Job description generation, improvement suggestions

#### API Endpoints
```javascript
recruiters: {
  // Jobs
  createJob: { method: 'POST', path: '/recruiters/jobs' }
  updateJob: { method: 'PUT', path: '/recruiters/jobs/:id' }
  listJobs: { method: 'GET', path: '/recruiters/jobs' }
  postToBoards: { method: 'POST', path: '/recruiters/jobs/:id/post' }

  // Pipeline
  addCandidateToJob: { method: 'POST', path: '/recruiters/jobs/:jobId/candidates' }
  moveCandidateStage: { method: 'PUT', path: '/recruiters/pipeline/:candidateId/stage' }
  getPipeline: { method: 'GET', path: '/recruiters/jobs/:jobId/pipeline' }

  // Scheduling
  createInterview: { method: 'POST', path: '/recruiters/interviews' }
  listInterviews: { method: 'GET', path: '/recruiters/interviews' }
}
```

#### Success Metrics
- 20+ active job postings
- 100+ candidates in pipeline across all jobs
- <5 minute job creation time (with AI assistance)
- 90% recruiter satisfaction with pipeline management
- 50% reduction in manual scheduling time

#### Competitive Gap Closed
- ✅ **AI-powered job descriptions** vs. blank text boxes (Zoho/BambooHR)
- ✅ **Multi-board posting in one click** vs. manual copy-paste (Greenhouse)
- ✅ **Skills-aligned job requirements** vs. freeform text (Lever)

**Estimated Effort:** 14-16 weeks

---

### PHASE 3: AI-Powered Automation
**Timeline:** Months 9-12 (14-16 weeks)
**Goal:** Eliminate recruiter busy-work with intelligent automation

#### Features to Build

**3.1 AI Email Co-Pilot**
- Context-aware email generation (Azure OpenAI)
- Personalization using candidate profile data
- Tone adjustment (casual, professional, enthusiastic)
- Multi-language support
- A/B testing of email variants
- Engagement prediction (open rate, response rate)

**3.2 Intelligent Candidate Matching**
- Real-time matching as candidates opt-in
- Automatic job recommendations to candidates
- Match explanation (why this candidate fits)
- Reverse matching (candidates for similar roles)
- Proactive alerts ("Great candidate just joined")

**3.3 Workflow Automation Rules**
- Trigger-based actions (e.g., "Send email when candidate moves to Interview stage")
- Scheduled actions (e.g., "Send follow-up if no response in 3 days")
- Auto-rejection for unqualified candidates
- Auto-advance qualified candidates
- Bulk operations (reject all in "Applied" stage older than 30 days)

**3.4 Interview Scheduling (Automated)**
- Integration with Calendly/Microsoft Bookings
- AI-powered availability detection
- Candidate self-scheduling links
- Automatic timezone conversion
- Interview prep packets (auto-generated)

**3.5 Candidate Insights Dashboard**
- AI-generated candidate summaries
- Skill gap analysis (candidate vs. job)
- Career trajectory prediction
- Salary expectations (ML-powered)
- Flight risk assessment
- Cultural fit signals (based on learning behavior)

#### Azure Services Integration
- **Azure OpenAI** - Email generation, candidate summaries, matching logic
- **Azure Machine Learning** - Custom models for matching, prediction
- **Azure Event Grid** - Event-driven automation triggers
- **Azure Cognitive Services** - Entity extraction, sentiment analysis

#### API Endpoints
```javascript
recruiters: {
  // AI Services
  generateEmail: { method: 'POST', path: '/recruiters/ai/email' }
  analyzeCandidateMatch: { method: 'POST', path: '/recruiters/ai/match' }
  generateCandidateSummary: { method: 'GET', path: '/recruiters/ai/summary/:candidateId' }
  predictSalary: { method: 'POST', path: '/recruiters/ai/salary' }

  // Automation
  createAutomationRule: { method: 'POST', path: '/recruiters/automation/rules' }
  listRules: { method: 'GET', path: '/recruiters/automation/rules' }
  triggerBulkAction: { method: 'POST', path: '/recruiters/automation/bulk' }
}
```

#### Success Metrics
- 80% of outreach emails AI-generated
- 50% increase in email response rates
- 70% reduction in time-to-first-contact
- 90% of interviews scheduled without recruiter intervention
- 5+ automation rules per recruiter
- 60% reduction in manual candidate evaluation time

#### Competitive Gap Closed
- ✅ **Context-aware AI emails** vs. static templates (ALL competitors)
- ✅ **Proactive candidate matching** vs. passive search (Greenhouse/Lever)
- ✅ **Workflow automation** vs. manual stage management (Zoho/BambooHR)

**Estimated Effort:** 14-16 weeks

---

### PHASE 4: Offer Management & Analytics
**Timeline:** Months 13-18 (18-20 weeks)
**Goal:** Close the loop from candidate to hire, with insights

#### Features to Build

**4.1 Offer Letter Management**
- Offer letter templates by role/level
- Dynamic field population (salary, start date, etc.)
- Approval workflows (manager sign-off)
- Version history and audit trail
- Multi-currency support

**4.2 E-Signature Integration**
- Integration with DocuSign or Adobe Sign APIs
- Embedded signing experience
- Signature status tracking
- Automatic reminders for unsigned offers
- Signed document storage in Azure Blob Storage

**4.3 Compensation Workflows**
- Compensation band definition by role
- Approval chains for out-of-band offers
- Equity/bonus calculation tools
- Offer negotiation history
- Counter-offer management

**4.4 Advanced Analytics Dashboard**
- Time-to-hire metrics (by role, by recruiter)
- Source effectiveness (which job boards perform best)
- Funnel conversion rates (stage-by-stage drop-off)
- Recruiter performance leaderboard
- Cost-per-hire calculations
- Diversity hiring metrics (EEOC compliance)
- Predictive analytics (time-to-fill, offer acceptance rate)

**4.5 Market Intelligence Integration**
- Real-time salary data (integrate with Glassdoor/Payscale APIs)
- Hiring trend analysis (demand for skills)
- Geographic opportunity heatmaps
- Competitive intelligence (what other companies are hiring)
- Skill demand forecasting

**4.6 Reporting & Compliance**
- EEOC/OFCCP compliance reports
- Custom report builder
- Scheduled report delivery
- Data export (CSV, Excel, PDF)
- Audit logs for all recruiter actions

#### Azure Services Integration
- **Azure Synapse Analytics** - Data warehousing for analytics
- **Power BI Embedded** - Interactive dashboards
- **Azure Blob Storage** - Document storage
- **Azure Key Vault** - Secrets management (API keys)

#### API Endpoints
```javascript
recruiters: {
  // Offers
  createOffer: { method: 'POST', path: '/recruiters/offers' }
  sendOffer: { method: 'POST', path: '/recruiters/offers/:id/send' }
  trackOfferStatus: { method: 'GET', path: '/recruiters/offers/:id/status' }

  // Analytics
  getMetrics: { method: 'GET', path: '/recruiters/analytics/metrics' }
  getFunnelAnalysis: { method: 'GET', path: '/recruiters/analytics/funnel/:jobId' }
  getRecruiterPerformance: { method: 'GET', path: '/recruiters/analytics/performance' }

  // Market Intelligence
  getSalaryData: { method: 'GET', path: '/recruiters/market/salary' }
  getHiringTrends: { method: 'GET', path: '/recruiters/market/trends' }
}
```

#### Success Metrics
- <24 hour offer generation time
- 95% offer acceptance rate
- <2 day e-signature turnaround
- 100% recruiter usage of analytics dashboard
- 50% reduction in time-to-insight for hiring managers
- Zero compliance violations

#### Competitive Gap Closed
- ✅ **Integrated offer management** vs. external tools (Zoho/BambooHR)
- ✅ **Real-time market intelligence** vs. static data (ALL competitors)
- ✅ **Predictive analytics** vs. historical reports (Greenhouse/Lever)

**Estimated Effort:** 18-20 weeks

---

## Integration Architecture

### System Components

```
FRONTEND LAYER
├─ recruiter.html (Cleansheet Canvas)
├─ Candidate Discovery (D3 mindmap + cards)
├─ Job Management (pipeline board)
├─ Analytics Dashboard (Power BI embedded)
└─ Profile Viewer (60% slideout)

SHARED INFRASTRUCTURE
├─ shared/data-service.js (CRUD layer)
├─ shared/cleansheet-core.js (design tokens, utils)
└─ shared/api-schema.js (extended for recruiters)

API GATEWAY
└─ Azure API Management
    ├─ Rate limiting (per recruiter)
    ├─ Authentication (Entra External ID JWT validation)
    └─ Request logging (Application Insights)

BACKEND SERVICES
├─ Recruiter Service (Azure Functions - Node.js)
├─ AI/ML Service (Azure Functions - Python)
├─ Automation Service (Azure Logic Apps)
└─ Integration Service (Azure Functions)

DATA LAYER
├─ Azure Cosmos DB (Primary database)
├─ Azure Cognitive Search (Semantic search)
├─ Azure Blob Storage (Documents)
└─ Azure Synapse Analytics (Phase 4 - Analytics warehouse)

EXTERNAL INTEGRATIONS
├─ Job Boards (Indeed, LinkedIn, Glassdoor)
├─ Communication (Azure Comm Services, Twilio)
├─ E-Signature (DocuSign, Adobe Sign)
├─ Calendar (Google, Outlook)
└─ Market Data (Glassdoor, Payscale, BLS)
```

### Data Flow Examples

#### Recruiter Discovers Candidate
1. Recruiter enters search query → recruiter.html
2. POST to `/recruiters/candidates/search` via data-service.js
3. API Gateway validates JWT, checks rate limit
4. Recruiter Service generates query embedding (Azure OpenAI)
5. Cognitive Search performs semantic search (opt-in candidates only)
6. Cosmos DB enriches results with full profiles
7. Frontend renders candidate cards with skill highlights

#### AI Email Generation
1. Recruiter clicks "Generate email" → candidate profile
2. POST to `/recruiters/ai/email` with candidate ID, context
3. AI/ML Service fetches candidate profile, job description
4. Azure OpenAI (GPT-4) generates personalized email variants
5. Frontend displays 3 email options with different tones
6. Recruiter selects/edits, clicks "Send"
7. Automation Service delivers via Azure Communication Services
8. Communication record created in Cosmos DB

---

## Technology Stack Summary

### Phase 1: Foundation
- **Frontend:** Vanilla JS, D3.js v7, Phosphor Icons
- **Auth:** Azure Entra External ID
- **Backend:** Azure Functions (Node.js 18)
- **Database:** Azure Cosmos DB (SQL API)
- **Search:** Azure Cognitive Search
- **Email:** Azure Communication Services
- **Analytics:** Azure Application Insights

### Phase 2: Job Management
- **Workflow:** Azure Logic Apps
- **Storage:** Azure Blob Storage
- **Integrations:** Indeed API, LinkedIn Jobs API, Glassdoor API
- **Calendar:** Microsoft Graph API

### Phase 3: AI Automation
- **AI:** Azure OpenAI (GPT-4, text-embedding-ada-002)
- **ML:** Azure Machine Learning
- **Events:** Azure Event Grid

### Phase 4: Analytics & Offers
- **Analytics:** Azure Synapse Analytics, Power BI Embedded
- **E-Signature:** DocuSign API or Adobe Sign API
- **Market Data:** Glassdoor API, Payscale API

---

## Business Model

### Revenue Streams

1. **Subscription Tiers (SaaS)**
   - **Starter:** $99/month - 1 recruiter, 10 active jobs, 100 candidates
   - **Professional:** $299/month - 3 recruiters, 50 active jobs, 1,000 candidates
   - **Enterprise:** $999/month - Unlimited recruiters, unlimited jobs, unlimited candidates
   - **Add-ons:** AI email credits ($50/1000 emails), market intelligence ($199/month)

2. **Placement Fees (Agency Model)**
   - 15-20% of first-year salary for successful placements
   - Automatic tracking via offer acceptance events

3. **Contract Recruiting Services**
   - White-label Cleansheet for corporate recruiting teams
   - $10,000-$50,000 implementation fee
   - $5,000-$20,000/month managed service fee

### Integration with Job Seeker Workflows

- **Free for candidates** - Job seekers never pay
- **Opt-in incentive** - Priority access to Cleansheet Quarters coaching
- **Two-sided network effect** - More candidates → more recruiter value → more jobs
- **Career development** - Recruiters can sponsor upskilling (Cleansheet Quarters)

---

## Success Criteria & Market Positioning

### After Phase 1 (Month 4)
**Position:** "Intelligent candidate discovery platform"
- **vs. LinkedIn Recruiter:** Better skills matching, lower cost
- **vs. Zoho Recruit:** Smarter search, better candidate experience
- **Target:** 25 paying recruiters

### After Phase 2 (Month 8)
**Position:** "End-to-end recruiting workflow with AI"
- **vs. Greenhouse:** Faster job posting, better pipeline management
- **vs. BambooHR:** More automation, better integrations
- **Target:** 100 paying recruiters, 2,000 opt-in candidates

### After Phase 3 (Month 12)
**Position:** "AI recruiter co-pilot"
- **vs. ALL:** Context-aware AI, proactive matching
- **Unique:** 50% time savings per hire
- **Target:** 300 paying recruiters, 10,000 candidates, $50K MRR

### After Phase 4 (Month 18)
**Position:** "Intelligent recruiting platform with market intelligence"
- **vs. ALL:** Real-time analytics, predictive insights
- **Enterprise Ready:** EEOC compliance, offer management
- **Target:** 1,000 recruiters, 50,000 candidates, $200K MRR

---

## Risk Mitigation

### Technical Risks

1. **Azure OpenAI Rate Limits**
   - Mitigation: Request quota increases, implement caching, queue requests

2. **Candidate Opt-In Volume**
   - Mitigation: Incentivize opt-in, partner with bootcamps

3. **Search Performance at Scale**
   - Mitigation: Azure Cognitive Search auto-scales, pagination, caching

### Business Risks

1. **Recruiter Adoption**
   - Mitigation: Free trial, onboarding support, migration assistance

2. **Privacy Compliance**
   - Mitigation: Legal review, GDPR/CCPA checkpoints, audits

3. **Integration Maintenance**
   - Mitigation: Monitor API changes, fallback options, error handling

---

## Next Steps (Immediate)

1. ✅ **Roadmap Approved** (Complete)
2. **Validate with users** - Interview 10 recruiters to confirm gap analysis (2 weeks)
3. **Prototype Phase 1** - Build recruiter.html with mock data (2 weeks)
4. **Azure environment setup** - Provision Cosmos DB, Cognitive Search, Functions (1 week)
5. **Candidate opt-in workflow** - Add toggle to experience-tagger.html (1 week)
6. **Begin Phase 1 development** - Authentication and candidate discovery (12 weeks)

---

## Document Control

- **Version:** 1.0
- **Status:** Approved
- **Last Updated:** 2025-10-30
- **Next Review:** After Phase 1 prototype (Month 2)
- **Owner:** Cleansheet LLC
- **Related Documents:**
  - CLAUDE.md (platform architecture)
  - privacy-policy.html (privacy commitments)
  - shared/api-schema.js (API contracts)
