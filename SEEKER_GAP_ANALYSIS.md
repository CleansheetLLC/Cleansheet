# Cleansheet Job Seeker Features: Gap Analysis vs. Major Job Boards

**Document Date:** October 30, 2025
**Analysis Scope:** Cleansheet Canvas Job Seeker vs. Indeed, LinkedIn, Glassdoor, ZipRecruiter, Monster
**File Analyzed:** `/home/paulg/git/Cleansheet/canvas-tour.html`
**Status:** Complete

---

## Executive Summary

Cleansheet Canvas provides unique **career development** features (STAR story builder, portfolio showcase, fit scoring, visual canvas) but lacks core **job search** functionality (no job listings, company research, salary data, employer connections).

### Key Finding

**Cleansheet is NOT a job board competitor—it's a career development and application management platform that should COMPLEMENT job boards, not replace them.**

### Strategic Recommendation

**Position Cleansheet as "Career Canvas"** - the preparation and organization layer between job seekers and job boards. Integrate via browser extension and APIs rather than building a 350M-job database.

---

## Part 1: What Cleansheet Has Today

### Current Features (canvas-tour.html)

✅ **Job Opportunities Tracking (Manual Entry)**
- Status workflow: Interested → Applied → Interviewing → Offer/Rejected
- Application materials linking (resumes, cover letters)
- Job fit scoring (Skills + Competencies + Experience match with percentage)
- Close date tracking, notes, skills/competencies tagging
- Card view, table view, detail slideout

✅ **Application Materials Management**
- Multiple resume versions (e.g., "v3.2 - Analytics Focus", "v4.1 - New Grad SWE")
- Job-specific cover letters
- LinkedIn profile tracking ("85% Complete")
- ATS optimization flagging
- Version control, format tracking (DOCX, PDF, HTML)

✅ **STAR Story Builder (Unique)**
- Situation/Task/Action/Result framework
- Competency tagging (Problem Solving, Leadership, Technical, etc.)
- Experience linking (from career history)
- Story library with examples per persona

✅ **Portfolio Projects**
- Tech stack tagging
- Achievements/highlights
- Project URLs
- GitHub import (planned)

✅ **Career Experience Timeline**
- Work history with dates, roles, organizations
- Technology categorization (Core vs. Peripheral)
- Achievements per role
- Education tracking
- LinkedIn import (planned)

✅ **Skills & Goals Tracking**
- Core vs. Peripheral skill classification
- Proficiency levels (Beginner → Expert)
- Learning goals with progress (e.g., "SQL: Codecademy 40% done")
- Career transition goals (e.g., "Retail Manager → Business Analyst by Q2 2025")

✅ **Visual D3 Canvas Interface**
- Tree navigation with collapsible nodes
- 4 pre-built personas with realistic example data
- Single-view access to all career dimensions

---

## Part 2: Competitor Features Comparison

### Critical Gaps (Must-Have for Basic Job Seeker Tool)

| Feature | Cleansheet | Indeed | LinkedIn | Glassdoor | ZipRecruiter |
|---------|-----------|--------|----------|-----------|--------------|
| **Job search engine** | ❌ None | ✅ 350M+ jobs | ✅ Network-driven | ✅ Partner w/Indeed | ✅ AI matching |
| **Company database** | ❌ None | ⚠️ Basic | ✅ Company pages | ✅ 2.8M companies | ⚠️ Basic |
| **Salary data** | ❌ Free-text only | ✅ Crowdsourced | ✅ Premium $39.99/mo | ✅ Free extensive | ❌ None |
| **Employer connections** | ❌ None | ✅ One-click apply | ✅ Easy Apply, InMail | ❌ None | ✅ AI invitations |
| **Mobile app** | ❌ Web only | ✅ iOS/Android | ✅ iOS/Android | ✅ iOS/Android | ✅ iOS/Android |

### High Priority Gaps (Important for Competitive Parity)

| Feature | Cleansheet | Competitors |
|---------|-----------|-------------|
| **AI-powered features** | ⚠️ Mock interface only | ✅ Indeed Career Scout (2025), ZipRecruiter Phil AI, LinkedIn Writing Assistant |
| **ATS resume scanning** | ⚠️ Flag only, no scoring | ✅ Third-party tools (Jobscan $49/mo) |
| **Resume builder** | ❌ Upload/paste only | ✅ Monster, third-party (Resume.io, Zety) |
| **Application analytics** | ⚠️ Fit score only | ✅ Indeed Premium: employer views, response times; LinkedIn Premium: profile views |
| **Learning integration** | ❌ Manual goals only | ✅ LinkedIn Premium: 16K+ courses |
| **Networking** | ❌ None | ✅ LinkedIn core feature (950M+ users) |

### Medium Priority Gaps

- ❌ No job board integrations (manual copy from Indeed/LinkedIn)
- ❌ No interview scheduling integration (calendar widget exists, no sync)
- ❌ No document uploads (upload feature "coming soon")
- ❌ No collaborative features (coach/mentor feedback)
- ❌ No email integration (Gmail parsing for application updates)
- ❌ No portfolio screenshots/previews (URL field only)

---

## Part 3: Cleansheet's Unique Strengths

### What Competitors DON'T Have

✅ **STAR Story Builder with Competency Tagging**
- Comprehensive Situation/Task/Action/Result framework
- Experience linking, competency tagging, reusable story library
- LinkedIn Premium has "Interview Prep" but no STAR story management

✅ **Integrated Portfolio + Experience + Job Fit**
- Unified view: projects → experience → applications → fit score
- LinkedIn has profile + jobs but no portfolio project management
- GitHub has projects but no job tracking

✅ **Visual D3 Canvas Navigation**
- Tree interface vs. list/feed/table UIs (all competitors)
- Single-view access to all career dimensions

✅ **Application Materials Version Control**
- Multiple resume versions (v3.2, v4.1, etc.) linked to specific jobs
- Job-specific cover letters
- LinkedIn/Indeed/ZipRecruiter store single resume only

✅ **Job Fit Scoring with Transparency**
- Overall % match with dimensional breakdown
- Skills Match, Competencies Match, Experience Alignment
- Color-coded visual scoring
- Indeed Premium shows "comparison" but no transparent algorithm

✅ **Skills Gap Tracking for Career Transitions**
- Core vs. Peripheral classification
- Proficiency tracking (Beginner → Expert)
- Learning goals with progress milestones
- Supports career pivots (e.g., Retail Manager → Business Analyst)

---

## Part 4: Strategic Recommendations

### Positioning Strategy: Complement, Not Compete

**DON'T SAY:** "Cleansheet is a job board"
**DO SAY:** "Cleansheet is your career canvas—organize applications, prepare for interviews, and showcase your growth"

**Analogy:**
- **Job Boards = Grocery Stores** (where you find opportunities)
- **Cleansheet = Meal Planning App** (where you organize, prepare, and track)

### Integration Strategy: Partner with Job Boards

**Critical Decision:** Build job search OR integrate with existing platforms?

**Recommendation:** **INTEGRATE, DON'T BUILD**

Building requires:
- Employer partnerships (Indeed has 10M+)
- Job scraping infrastructure (legal risks)
- Company database (Glassdoor has 2.8M companies, 60M+ reviews)
- Ongoing maintenance (stale jobs, duplicates)

**Integration Approach:**

**Phase 1: Browser Extension (Quick Win)**
- Chrome/Firefox extension: "Save to Cleansheet" from Indeed, LinkedIn, Glassdoor
- One-click import: title, company, location, salary, description
- LLM parsing of job description → extract skills/competencies

**Phase 2: API Partnerships (Strategic)**
- **Glassdoor API:** Company reviews, salary data, interview questions
- **LinkedIn API:** OAuth for Easy Apply, profile import
- **Indeed API:** Apply for API access (if available)

**Phase 3: Email Integration (If No APIs)**
- Gmail API: Parse application confirmations, interview invites, rejections
- Auto-update job status (Applied → Interviewing → Offer/Rejected)

---

## Part 5: Phased Roadmap

### PHASE 1 (MVP+): Basic Integration & AI (3-6 months)

**Goal:** Make Cleansheet viable for power users

**Features:**
1. **Browser Extension** - Save jobs from Indeed/LinkedIn/Glassdoor
2. **Document Upload** - PDF/DOCX resume upload
3. **AI Resume Optimization** - Claude API for resume vs. job analysis, ATS scoring
4. **AI STAR Story Generation** - Generate stories from experience + competency
5. **Networking Contacts** - Add "Contacts" node (name, company, relationship, notes)
6. **Mobile Responsiveness** - Optimize canvas for tablet/mobile

**Success Metrics:**
- 100 users saving 10+ jobs/week via extension
- 50 users generating AI-optimized resumes
- 25 users creating 5+ STAR stories

### PHASE 2 (Integration): Connect to Ecosystem (6-12 months)

**Goal:** Integrate into users' existing workflows

**Features:**
7. **Glassdoor API** - Pull company reviews, ratings, salary data, interview questions
8. **LinkedIn OAuth** - Import career experience, profile data
9. **Learning Integration** - Recommend Cleansheet Library articles for skills gaps
10. **Gmail Integration** - Parse emails for application tracking
11. **Calendar Integration** - Google Calendar API for interview scheduling
12. **Portfolio Previews** - Image uploads, screenshot previews for projects

**Success Metrics:**
- 50% users connect LinkedIn
- 30% users enable Gmail auto-tracking
- 1,000+ Glassdoor reviews accessed/week

### PHASE 3 (Differentiation): Build Moat (12-24 months)

**Goal:** Create features competitors can't replicate

**Features:**
13. **Native Mobile App** - iOS/Android with offline mode
14. **Coach Collaboration** - Share canvas, commenting, feedback workflow
15. **AI Interview Simulation** - Conversational practice with real-time feedback
16. **Recruiter Lite Platform** - Opt-in visibility to recruiters (monetization)
17. **Resume Builder** - Drag-drop visual editor with ATS templates
18. **Job Feed (Optional)** - RSS aggregator if no API partnerships

**Success Metrics:**
- 10,000+ MAU
- 1,000+ coach/mentor accounts
- 100+ recruiter subscriptions ($50/mo = $5K MRR)

---

## Part 6: Monetization Strategy

### Freemium Model

**Free Tier:**
- 10 job opportunities tracked
- 3 resume versions
- 5 STAR stories
- 3 portfolio projects
- Basic fit scoring
- Browser extension access

**Premium Tier ($9.99-19.99/mo):**
- Unlimited jobs, resumes, stories, projects
- AI resume optimization (10 generations/mo)
- AI STAR story generation (20 stories/mo)
- Advanced fit scoring with recommendations
- LinkedIn + Gmail + Calendar integrations
- Priority support

**Pro Tier ($29.99-39.99/mo):**
- Everything in Premium
- AI interview simulation (unlimited)
- Coach collaboration (share canvas, feedback)
- Recruiter profile visibility (opt-in)
- White-label branding
- API access

**Enterprise/Coach Tier ($99-299/mo):**
- Multiple client canvases (for career coaches)
- Analytics dashboard
- Branded experience
- Calendar + payment processing

### Revenue Projections

- **Year 1:** 1,000 free, 50 premium, 5 pro = $925 MRR = $11K ARR
- **Year 2:** 10,000 free, 500 premium, 50 pro, 10 enterprise = $11.25K MRR = $135K ARR
- **Year 3:** 50,000 free, 2,500 premium, 250 pro, 50 enterprise = $56K MRR = $672K ARR

---

## Part 7: Competitive Positioning

### vs. Indeed
- **Indeed Strength:** 350M+ jobs, one-click apply
- **Cleansheet Edge:** Interview prep, portfolio showcase, visual canvas

### vs. LinkedIn
- **LinkedIn Strength:** Professional networking, recruiter access
- **Cleansheet Edge:** Multiple resume versions, STAR story library, fit scoring

### vs. Glassdoor
- **Glassdoor Strength:** Company research, salary transparency
- **Cleansheet Edge:** Integrated prep (use Glassdoor data + Cleansheet stories)

### vs. ZipRecruiter
- **ZipRecruiter Strength:** AI matching, fast apply
- **Cleansheet Edge:** Deeper career development (growth tracking, not just matching)

### vs. Third-Party Tools (Huntr, Teal, JobHero)
- **Their Strength:** Application tracking Kanban boards
- **Cleansheet Edge:** STAR stories, portfolio showcase, fit scoring, visual canvas

---

## Conclusion

### Key Takeaway

**Cleansheet should NOT compete with job boards on job search. Instead, Cleansheet should become the essential "career development layer" that sits between job seekers and job boards—helping users organize applications, prepare compelling narratives, and showcase their growth.**

### Next Steps

**Immediate (Next 30 Days):**
1. Build browser extension MVP (save jobs from Indeed/LinkedIn/Glassdoor)
2. Implement document upload (PDF/DOCX)
3. Create AI resume optimization prototype (Claude API)
4. Draft API partnership proposals (Glassdoor, LinkedIn, Indeed)

**Short-Term (3-6 Months):**
- Launch Phase 1 features
- Recruit 100 beta users (career transitioners, new grads)
- Secure at least 1 API partnership
- Validate fit scoring algorithm

**Long-Term (6-24 Months):**
- Build mobile app
- Launch coach collaboration
- Explore recruiter platform
- Scale to 10K+ MAU, $100K+ ARR

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Related Documents:**
- RECRUITER_ROADMAP.md (recruiter platform roadmap)
- CLAUDE.md (platform architecture)
- canvas-tour.html (job seeker Canvas implementation)
