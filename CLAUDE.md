# Cleansheet Platform - AI Development Context

## Project Overview
**Repository:** Cleansheet
**Type:** Enterprise-grade content curation and career development platform
**Developer:** Solo technical founder
**Scope:** Multi-modal content processing with Azure-backed scalability

This document provides context for AI-assisted development on the Cleansheet platform. It defines technical standards, design patterns, and implementation guidelines for maintaining consistency across the codebase.

---

## Architecture Overview

### Content Pipeline
The platform ingests human-reviewed, tagged content from domain-specific corpus repositories. Content flows through an automated ML pipeline that generates multi-format, multi-language deliverables.

**Flow:** Corpus repositories → ML processing → Multi-channel delivery

**Key Capabilities:**
- Multi-device format generation (mobile, tablet, web)
- International language translation
- Audio synthesis and streaming
- RAG-enhanced semantic search
- Interactive NL interfaces (learner, coach, expert)

**Delivery Channels:**
- Mobile apps (iOS/Android)
- Web portal (cleansheet.info)
- Audio streaming

### Zero Content Cost Model
- Human curation happens once in corpus repositories
- ML pipeline automates all derivative format generation
- Single source → unlimited variations
- Per-delivery cost: $0 content, only compute/storage

---

## Design System

The platform uses the **Corporate Professional** design system. See **DESIGN_GUIDE.md** for comprehensive details.

### Key Design Tokens

**Typography:**
- **Questrial** - Headings and UI elements (h1-h6)
- **Barlow Light (300 weight)** - Body text and paragraphs
- Loaded via Google Fonts

**Color Palette:**
- Primary Blue: `#0066CC`
- Accent Blue: `#004C99`
- Highlight: `#11304f` (active tabs, user avatars)
- Dark: `#1a1a1a` (headers/nav)
- Neutral Text: `#333333` / `#666666` / `#999999`
- Neutral Background: `#f5f5f7` / `#f8f8f8`
- Neutral Border: `#e5e5e7`
- Badge Background: `#e3f2fd`

**Iconography:**
- **Phosphor Icons** - Primary icon library (6,000+ icons, MIT License)
- CDN: `https://unpkg.com/@phosphor-icons/web`
- Usage: `<i class="ph ph-icon-name"></i>`
- All icons use white color on colored backgrounds
- Consistent 60×60px rounded square containers

**Branding:**
- Logo location: `assets/high-resolution-logo-files/`
- Dark headers: `white-on-transparent.png`
- Light backgrounds: `black-on-transparent.png`
- Responsive sizing: 60px desktop, 40px mobile

**Responsive Design:**
- Mobile-first approach
- Primary breakpoint: 768px
- Card grids: Multi-column (350px min) → single column on mobile
- Touch-optimized with `-webkit-overflow-scrolling: touch`

**Rebranding Pattern:**
- Use CSS custom properties (`:root` variables) for all colors
- Update generator scripts (`generate_corpus_index.py`) for generated files
- Search patterns: hex colors, `background:`, `border:`, `color:` properties
- Update interactive element states (hover, focus, active)

---

## File Organization

```
Cleansheet/
├── index.html                    # Main landing page with Canvas modal
├── learner.html                  # Modern learning app (production-ready)
├── job-seeker.html               # Job search app (pending)
├── professional.html             # Work management app (pending)
├── career-paths.html             # Career path navigator
├── experience-tagger.html        # Experience management tool
├── experience-tagger-d3.html     # D3 network reference implementation
├── role-translator.html          # Role discovery tool
├── ml-pipeline.html              # Pipeline visualization
├── privacy-policy.html           # Legal privacy commitments
├── privacy-principles.html       # Core privacy philosophy
├── terms-of-service.html         # Legal terms
├── corpus/
│   ├── index.html                # Generated library browser (1.1MB)
│   └── [article-slug].html       # 195 individual articles
├── shared/
│   ├── cleansheet-core.js        # Core utilities, design tokens
│   ├── data-service.js           # Data abstraction layer
│   ├── api-schema.js             # API contract definition
│   └── library-data.js           # Auto-generated article data (189 published)
├── assets/
│   ├── high-resolution-logo-files/
│   └── [other asset directories]
├── meta/
│   └── meta.csv                  # Article metadata (195 articles, 37 columns)
├── generate_corpus_index.py      # Unified generator (corpus + learner data)
├── seed-library-data.py          # Library data generator (called by above)
├── DESIGN_GUIDE.md               # Comprehensive design system docs
├── BLOG_GENERATION_GUIDE.md      # Blog creation workflow
├── TONE_GUIDE.md                 # Writing style guidelines
├── APPLICATION_INSIGHTS_SETUP.md # Analytics implementation guide
├── CLAUDE.md                     # This file
└── README.md                     # Public documentation
```

---

## Page Inventory

| Page | Purpose | Key Features | Status |
|------|---------|--------------|--------|
| `index.html` | Main landing | 8 feature cards, Canvas modal with D3 tree, Personal Canvas slideout | Complete |
| `learner.html` | Learning app | Tab nav (Home/Library), 189 articles, search/filter, bookmarks | Production-ready |
| `job-seeker.html` | Job search | Application tracking, material generation | Pending |
| `professional.html` | Work management | Projects, documents, forms, reports | Pending |
| `corpus/index.html` | Traditional library | 195 articles, left nav filters, 60% slideout viewer | Generated |
| `career-paths.html` | Career navigator | Network diagram, path selector pills, timeline | Complete |
| `experience-tagger.html` | Experience tool | Card grid, JSON import/export, localStorage | Complete |
| `experience-tagger-d3.html` | D3 reference | Force-directed graph, 3-tier nodes, percentage positioning | Reference impl |
| `role-translator.html` | Role discovery | Skills mapping interface | Complete |
| `ml-pipeline.html` | Pipeline tour | Workflow diagram visualization | Complete |
| `privacy-policy.html` | Legal | Privacy commitments (**CRITICAL for compliance**) | Complete |
| `privacy-principles.html` | Legal | Core privacy philosophy | Complete |
| `terms-of-service.html` | Legal | Terms of service | Complete |

---

## Shared Infrastructure

**Location:** `shared/` directory
**Purpose:** Reusable components for all Cleansheet apps (learner, job-seeker, professional)

**Files:**
- `cleansheet-core.js` - Design tokens, utility functions (formatDate, debounce, sanitizeHTML, showToast)
- `data-service.js` - Unified CRUD interface supporting localStorage (demo) or REST API (production)
- `api-schema.js` - Complete API contract for backend implementation
- `library-data.js` - Auto-generated article data (189 published articles from corpus)

**Usage Pattern:**
```html
<script src="shared/cleansheet-core.js"></script>
<script src="shared/data-service.js"></script>
<script src="shared/library-data.js"></script>

<script>
  const dataService = new DataService('localStorage'); // or 'api'
  const articles = await dataService.getArticles({ search: 'AI' });
  CleansheetCore.utils.showToast('Articles loaded!', 'success');
</script>
```

**Data Service Backends:**
- `localStorage` - Client-side storage for demos
- `api` - REST API for production (see `api-schema.js` for endpoints)

---

## Key UI Patterns

### Cleansheet Canvas (D3 Tree Visualization)
- **Location:** `index.html` modal with persona selector
- **Technology:** D3.js v7 tree layout with `.nodeSize([60, 220])` for fixed spacing
- **Pattern:** ONE second-level node expanded at a time, toggle `children` ↔ `_children`
- **Critical:** Call `d3.hierarchy(data)` FIRST, THEN hide children manually
- **Features:** Count badges, text truncation (50 char, 2 lines), collapsible right panel
- **Personas:** Retail Manager, Research Chemist, New Graduate, Data Analyst

### Personal Canvas (Slideout Panels)
- **Location:** `index.html` slideout for Personal persona
- **Pattern:** 60% width slideout, dark header, scrollable body
- **Features:** Recipes system (search/filter), Finance system (5 account types, hover tooltips)
- **Theme:** Green accent (`#16a34a`) for Personal mode

### D3 Network Navigation
- **Reference:** `experience-tagger-d3.html`
- **Pattern:** Force-directed graph, percentage-based positioning, 3-tier nodes
- **Nodes:** Primary (clickable), Secondary (alternative), Tertiary (non-clickable context)
- **Sizing:** 200px height for compact header sections, responsive to container width
- **See code for implementation details**

### Hover Tooltip Pattern
- Lightweight alternative to modals for forms/menus
- 200ms delay on hide prevents flickering
- Tooltip has matching enter/leave handlers to stay visible
- Sizing: 320px (menus) / 400px (forms), max-height with scroll
- See Code Standards section for implementation

### Floating Home Buttons
- Position: `fixed`, `top: 16px`, `left: 16px`
- Style: Dark translucent background with backdrop blur
- Text: "← Home" (white, Questrial 12px, weight 600)
- Hover: Blue background `rgba(0, 102, 204, 0.95)`

---

## Python Generators & Workflow

### Unified Generation Command

**Script:** `generate_corpus_index.py`
**Usage:** `python generate_corpus_index.py`

**Process:**
1. Reads `meta/meta.csv` (195+ articles, 37 columns)
2. Parses JSON fields (levels, tags, keywords, career_paths)
3. Reverses article list (newest appended entries appear first)
4. Extracts unique tags (20 total) and career paths (9 total)
5. Generates `corpus/index.html` - Traditional library browser (~1.1MB)
6. Calls `seed-library-data.py` - Generates `shared/library-data.js` (189 published)
7. Outputs both files with statistics

**Output:**
- `corpus/index.html` - Full library with 195 articles embedded
- `shared/library-data.js` - Modern app data (published articles only)

**Metadata Structure:**
- PartitionKey, RowKey, FileKey, Title, Subtitle (4-10 words)
- Executive_Summary, Overview_Summary, Detailed_Summary, Comprehensive_Abstract
- Keywords (JSON), Tags (JSON), Audience_Level (JSON), Career_Paths (JSON)
- ID, Owner, Status, dates

---

## Blog Generation Workflow

**Reference:** `BLOG_GENERATION_GUIDE.md` and `TONE_GUIDE.md`

### 3-Step Process
1. **Create blog post HTML** following TONE_GUIDE.md
   - Progressive introduction with concrete scenario
   - 2,500-3,500 words for technical deep-dives
   - Corporate Professional CSS
   - Copy-to-clipboard on code blocks
   - Visual breaks: methodology boxes, tables, blockquotes

2. **Append metadata to meta.csv**
   - Create Python script to append new entry
   - Check existing fieldnames with DictReader first
   - Handle Unicode in Windows console (use `[OK]` not `✓`)
   - Validate JSON fields (Keywords, Tags, Audience_Level, Career_Paths)

3. **Regenerate libraries**
   - Run `python generate_corpus_index.py`
   - Verifies article count, tag count, career path count
   - Updates both corpus/index.html and shared/library-data.js

### Standard Taxonomies

**Tags:** Project Management, Security, Cloud, DevOps, Career Development, Technical Skills, Professional Skills, Data Analysis, Networking, Development, Testing, Automation, System Design, Architecture

**Career Paths:** Citizen Developer, Cloud Computing, Project Management, Cloud Operations, Network Operations, Security Operations, Full Stack Developer, AI/ML, Analytics

**Audience Levels:** Neophyte, Novice, Operator, Expert, Academic

**Sectors:** ISV, IHV, ISP, CSP, MSP, VAR, Distributor, Telco

---

## Code Standards

### Naming Conventions
- **HTML files:** `kebab-case.html`
- **CSS classes:** `kebab-case`
- **CSS variables:** `--prefix-name`
- **JavaScript:** `camelCase`
- **Assets:** `lowercase-with-dashes.extension`

### HTML
- Semantic HTML5 elements
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text on all images
- Viewport and charset meta tags

### CSS
- Use CSS variables for colors/fonts/spacing
- Mobile-first media queries (breakpoint: 768px)
- BEM-like naming conventions
- Box-sizing: border-box

### JavaScript
- Vanilla JS preferred (minimize dependencies)
- Event delegation for dynamic content
- LocalStorage for client-side state
- Error handling on network requests
- JSON import/export for data portability

### Form Design
- Suggestion chips for common inputs (hoverable examples)
- Flex layouts: Text inputs (`flex: 2`), Dropdowns (fixed width 130px), Buttons (`flex: 0 0 auto`)
- List builders with add/remove functionality
- Date linking dropdowns for chronological entry
- Modal forms with sticky header/footer

### D3.js Patterns
- **Tree Layout:** Use `.nodeSize([vertical, horizontal])` for fixed spacing (NOT `.size()`)
- **Hierarchy:** Call `d3.hierarchy(data)` FIRST with full data, THEN hide children via `_children`
- **Toggle:** Close other nodes at same level, toggle `children` ↔ `_children`, call `update()`
- **Text:** Set char limits (50), line limits (2), add ellipsis, use tspan for multi-line
- **Scrolling:** Dynamic SVG sizing, `overflow: auto` on container
- **Transitions:** 400ms duration for smooth animations

---

## Privacy and Analytics

**CRITICAL:** All technical decisions must comply with `privacy-policy.html` and `privacy-principles.html`

### Prohibited
- ❌ Third-party analytics (Google Analytics, Mixpanel, etc.)
- ❌ Tracking pixels/web beacons
- ❌ Behavioral profiling cookies
- ❌ Cross-site tracking
- ❌ Data sharing with partners/advertisers
- ❌ Using user data for AI training
- ❌ Advertising networks

### Allowed
- ✅ Anonymized usage data (cannot trace to individuals)
- ✅ Essential cookies (session, security)
- ✅ Analytics cookies (anonymized)
- ✅ First-party Azure services (Application Insights, Monitor)
- ✅ Server-side logging (anonymized)

### Recommended Analytics
**Azure Application Insights** - First-party, server-side, fully anonymized

See `APPLICATION_INSIGHTS_SETUP.md` for implementation.

**Alternative:** Self-hosted privacy-first solutions (Umami, Plausible) compliant under "anonymized analytics cookies" clause if deployed in your Azure infrastructure.

### Privacy Compliance Checklist
Before adding ANY service:
- [ ] Does it violate explicit prohibitions in privacy-policy.html?
- [ ] Does it align with privacy-principles.html?
- [ ] Does it share data with third parties?
- [ ] Does it use behavioral profiling or tracking pixels?
- [ ] Could user data be used for AI training?
- [ ] Is data truly anonymized and aggregate-only?
- [ ] Can it be self-hosted in Azure if third-party?

---

## Development Best Practices

### When Creating New Pages
1. Start with design system (CSS variables from `:root`)
2. Follow Corporate Professional color palette
3. Use Questrial/Barlow Light fonts
4. Implement mobile-first responsive design
5. Include accessibility attributes
6. Reference assets with correct paths (lowercase-with-dashes)
7. Test across browsers (Chrome, Firefox, Safari, Edge)

### When Modifying Existing Pages
1. Read existing code first to understand patterns
2. Maintain consistent naming conventions
3. Update related documentation (DESIGN_GUIDE.md)
4. Test mobile and desktop views
5. Verify asset paths after changes

### When Working with Generated Files
1. Modify the generator script, NOT the output
2. Run `python generate_corpus_index.py` after changes
3. Verify output file size and structure
4. Test interactive features (search, filters, slideout)

### When Working with D3.js
1. Use `.nodeSize()` for tree layouts (ensures static positioning)
2. Create hierarchy with full data first (never pre-hide children)
3. Implement proper expand/collapse (toggle children/_children)
4. Constrain text dimensions (char/line limits, ellipsis)
5. Make containers scrollable (dynamic SVG sizing)
6. Test with various data sizes (ensure no overflow)
7. Use D3 transitions (400ms recommended)

---

## Platform Deployment

### Static Hosting
- No server-side processing required
- All content embedded in HTML
- CDN-ready for global distribution

### Recommended Hosts
- Azure Static Web Apps (currently deployed)
- Azure Blob Storage with Static Website hosting
- Netlify / Vercel / GitHub Pages
- AWS S3 + CloudFront

### Deployment Process
1. Generate corpus library: `python generate_corpus_index.py`
2. Verify assets present: `assets/high-resolution-logo-files/white-on-transparent.png`
3. Test locally in browser
4. Deploy static files to hosting platform

### Azure Blob Storage Considerations
- Serves content over HTTPS
- External links require `target="_blank" rel="noopener noreferrer"`
- Browser scroll restoration: Set `history.scrollRestoration = 'manual'`, use `window.scrollTo(0, 0)`

---

## AI Assistant Guidelines

### Critical Reminders
- **NEVER** create files unless absolutely necessary
- **ALWAYS** prefer editing existing files over creating new ones
- **NEVER** proactively create documentation files unless requested
- **ALWAYS** read files before editing to understand context
- **ALWAYS** use design system (reference DESIGN_GUIDE.md)
- **ALWAYS** maintain consistent naming conventions
- **ALWAYS** verify asset paths use lowercase-with-dashes
- **ALWAYS** test responsive (mobile ≤768px, desktop)
- **ALWAYS** preserve accessibility (WCAG 2.1 AA)
- **ALWAYS** modify generator scripts, NOT generated HTML
- **ALWAYS** run `python generate_corpus_index.py` after meta.csv changes
- **CRITICAL** comply with privacy-policy.html before adding services

### When Editing Code
- **HTML:** Semantic tags, heading hierarchy, alt text, viewport/charset
- **CSS:** CSS variables, mobile-first media queries, BEM-like naming
- **JavaScript:** Vanilla JS preferred, event delegation, error handling

---

## Platform Features (Future Development)

### Learner Canvas
- Job tracking and analysis
- Capstone project portfolio
- LinkedIn-imported experience with skill categorization
- Timeline of technical competency development

### Cleansheet Quarters
- 12-week coaching engagements
- 4 synchronous virtual meetings (30-45 min)
- Asynchronous collaboration
- Success Manager matchmaking

### Coach Resources
- Comprehensive learner profiles
- Pre-session checklists and agendas
- Access to Cleansheet Library
- Live conferencing and automated bookings
- Payment processing and financial reporting

---

## Documentation References

- **[README.md](README.md)** - Public repository documentation
- **[DESIGN_GUIDE.md](doc/DESIGN_GUIDE.md)** - Comprehensive design system and style guide
- **[BLOG_GENERATION_GUIDE.md](doc/BLOG_GENERATION_GUIDE.md)** - Blog creation workflow
- **[TONE_GUIDE.md](TONE_GUIDE.md)** - Writing style guidelines
- **[APPLICATION_INSIGHTS_SETUP.md](doc/APPLICATION_INSIGHTS_SETUP.md)** - Analytics implementation
- **[assets/README.md](assets/README.md)** - Asset usage and brand guidelines
- **[privacy-policy.html](privacy-policy.html)** - Legal privacy commitments (**MUST REVIEW before analytics**)
- **[privacy-principles.html](privacy-principles.html)** - Core privacy philosophy (**MUST COMPLY**)
- **[.gitignore](.gitignore)** - Version control exclusions

---

## Contact & Support

- **Repository:** CleansheetLLC/Cleansheet
- **Website:** [cleansheet.info](https://www.cleansheet.info)
- **Documentation:** DESIGN_GUIDE.md, README.md

---

**Last Updated:** 2025-10-08
**Version:** 2.0 - Optimized for AI context efficiency (71% token reduction)
