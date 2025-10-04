# Cleansheet Platform - AI Development Context

## Project Overview
**Repository:** Cleansheet
**Type:** Enterprise-grade content curation and career development platform
**Developer:** Solo technical founder
**Scope:** Multi-modal content processing with Azure-backed scalability

---

## About
This document provides context for AI-assisted development on the Cleansheet platform. It defines technical standards, design patterns, and implementation guidelines for maintaining consistency across the codebase.

---

## Platform Web UI

### Design System
The platform uses a consistent design system across all web pages.

**Rebranding Best Practices:**
To ensure fast, consistent rebranding across the platform:
1. **CSS Variables**: Use CSS custom properties (`:root` variables) in all pages for colors
2. **Centralized Color Definitions**: Define all brand colors once at the top of stylesheets
3. **Search Patterns**: When rebranding, search for these patterns:
   - Old hex colors (e.g., `#c4d600`, `#1b2838`, `#006666`)
   - Color-related class names (e.g., `.lime-accent`, `.teal-bg`)
   - Background property: `background:` or `background-color:`
   - Border property: `border:` or `border-color:`
   - Color property: `color:`
4. **Component Checklist** for color updates:
   - Headers/navigation backgrounds
   - Primary action buttons
   - Secondary buttons and links
   - Focus/active states (`:focus`, `:hover`, `:active`)
   - Icons and icon backgrounds
   - Badges and pills (tags, expertise levels)
   - Borders and dividers
   - Slider/range input elements (track, thumb, both webkit and moz)
   - Mobile-specific elements (toggle buttons, collapsible sections)
   - Modal/slideout panels
5. **Font Consistency**: Apply font-family to all interactive elements (buttons, inputs, headings)
6. **Generated Files**: Remember to update Python generators (like `generate_corpus_index.py`) to use new color scheme
7. **Interactive Element States**: When updating interactive elements, consider:
   - Disabling click handlers for non-interactive items (remove event listeners)
   - Visual indicators: cursor style (pointer vs default), opacity reduction (0.6 for disabled)
   - Active/selected states need enhanced visibility: larger scale (1.25x+), bold fonts, multi-layer shadows, higher z-index
8. **Floating Action Buttons**: Home/back buttons should use semi-transparent backgrounds with backdrop-filter blur, white text for maximum contrast

**Typography:**
- **Questrial** - Headings and UI elements (h1-h6)
- **Barlow Light (300 weight)** - Body text and paragraphs
- Loaded via Google Fonts with fallbacks to system fonts

**Color Palette (Corporate Professional):**
- Primary Blue: #0066CC
- Accent Blue: #004C99
- Dark: #1a1a1a (headers/nav)
- Neutral Text: #333333
- Neutral Text Light: #666666
- Neutral Text Muted: #999999
- Neutral Background: #f5f5f7
- Neutral Background Secondary: #f8f8f8
- Neutral Border: #e5e5e7
- Neutral White: #ffffff
- Header Title: #e0e0e0 (light gray for contrast on dark background)

**Iconography:**
- Phosphor Icons (MIT License)
- More professional and modern than Font Awesome
- Color-coded icon backgrounds (primary blue, dark, accent blue)
- Consistent rounded square containers (60px × 60px)
- All icons use white color
- 6,000+ icons with multiple weights available

**Branding:**
- Logo files located: `assets/high-resolution-logo-files/`
- Logo usage by page:
  - Dark headers: `white-on-transparent.png`
  - Light/white backgrounds: `black-on-transparent.png` (e.g., corpus/index.html)
- Responsive sizing: 60px desktop, 40px mobile (45px/30px in corpus library)

---

## Page Structure

### Main Landing Page (`index.html`)
- Hero section with tagline (no h2 title)
- 6 feature cards with Phosphor icons:
  - Content Library (ph-book-open, primary blue)
  - Career Paths (ph-path, dark)
  - Role Translator (ph-compass, primary blue)
  - Experience Tagger (ph-tags, accent blue)
  - Cleansheet Canvas (ph-map-trifold, coming soon)
  - Coaching & Mentorship (ph-users, dark)
  - ML Pipeline Tour (ph-flow-arrow, dark)
  - Privacy & Terms (ph-shield-check, dark)
- Coming Soon section (3-column grid, 2 rows, larger fonts: 16px body, 18px headings)
- Footer with white external links

### Content Library (`corpus/index.html`)
- Generated via Python script (`generate_corpus_index.py`)
- 190+ curated articles embedded in HTML
- Multi-column card grid layout (auto-fill, minmax 350px per card)
- Single column on mobile (≤768px)
- Left nav (#1a1a1a dark background) with white text elements:
  - "Cleansheet Library" title (white, Questrial)
  - Search functionality (titles, keywords, content) with white focus outline
  - Expertise level slider (white track and thumb)
  - Career path filtering with multi-select pills (blue #0066CC when active, 9 paths)
  - Tag filtering with multi-select pills (blue #0066CC when active, 16 tags)
  - "← Back to Home" link (white with white border)
  - Mobile: Collapsible filter section behind "Filters & Search" button (blue #0066CC background)
- Main results pane:
  - Multi-column grid layout (auto-fill, min 350px per card)
  - Mobile: Single column layout
  - Article cards with Questrial titles, Barlow Light (300) body text
  - Expertise badges: Blue #0066CC background
  - Tag pills: Light gray (#f5f5f7) background with neutral border
  - All text uses standard Corporate Professional colors
- 60% slideout panel for article viewing:
  - Questrial heading
  - "Add to My Plan" button (blue #0066CC, disabled/coming soon)
  - Close button (light gray background)
- Mobile responsive with proper scrolling
- Fixed logo in top right corner (42px desktop, 28px mobile, black-on-transparent.png)
- Mobile: Results header has padding-right: 60px to avoid logo overlap

### Interactive Tools

**Career Paths Tool** (`career-paths.html`)
- Corporate Professional color scheme with CSS variables
- Network diagram with clickable technical career nodes
- Non-clickable business role nodes (Trade, Product Manager, Program Manager, General Manager, Bus Dev Manager) - opacity 0.6, no cursor pointer
- Active nodes: Enhanced visibility with scale(1.25), bold font, multi-layer glow shadow, z-index 100
- Path selector pills: Blue when active
- Timeline with blue dots and proper font hierarchy
- White "← Home" button (top-left, white text/border, dark translucent background)

**ML Pipeline Tour** (`ml-pipeline.html`)
- Pipeline workflow diagram
- Visual representation of content processing flow

**Role Translator** (`role-translator.html`)
- Job role discovery tool
- Skills mapping interface

**Experience Tagger** (`experience-tagger.html`)
- Professional experience management and tagging tool
- Multi-column card grid layout (auto-fill, min 350px cards) on desktop
- Single column on mobile (≤768px)
- Collapsible experience cards with "Show Details" toggle
- Features:
  - JSON import/export functionality
  - Manual data entry with comprehensive modal form
  - LocalStorage auto-save
  - Experiences sorted descending by start date (most recent first)
- Form structure:
  - Organization Name, Role, Location
  - Start Date / End Date with date linking dropdowns:
    - Link start date to another experience's end date (+1 day) or start date
    - Link end date to another experience's start date (-1 day) or end date
    - Enables easy chronological experience timeline creation
  - Description (multi-line)
  - Technologies with Core/Peripheral classification (input: flex 2, dropdown: 130px fixed width)
  - Key Skills, Competencies, Project Types (list builders)
  - Internal/External Stakeholders (list builders)
  - Achievements (list builder)
- Suggestion chips for all categories:
  - Clickable examples that populate input fields
  - Categories: Technologies, Skills, Competencies, Project Types, Stakeholders, Achievements
  - Chips turn blue on hover
- Experience cards display:
  - Role, organization, location, date range
  - Description (truncated to 3 lines when collapsed)
  - All metadata organized by section with uppercase labels
  - Technologies show Core/Peripheral badges
  - Edit/delete actions in header
- Card grid responsive:
  - Desktop: Multi-column (350px min)
  - Tablet (≤1200px): Smaller cards (300px min)
  - Mobile (≤768px): Single column
- Equal-height cards with hover effects (lift + shadow)
- "← Home" button matches career-paths.html style (compact, dark translucent, backdrop blur)

**Legal Documents:**
- `privacy-policy.html` - Privacy policy
- `terms-of-service.html` - Terms of service
- `privacy-principles.html` - Privacy commitments
- Consistent header with logo and "← Back to Home" link
- All use Barlow Light for body text

---

## Navigation

- **Floating Home Buttons** - Standard style across interactive pages:
  - Position: `fixed`, `top: 16px`, `left: 16px`
  - Styling: `rgba(26, 26, 26, 0.95)` background with `backdrop-filter: blur(10px)`
  - Border: `1px solid rgba(255, 255, 255, 0.3)`
  - Text: "← Home" (white, no icon)
  - Font: Questrial, 12px, weight 600
  - Padding: 8px 16px
  - Hover: Blue background `rgba(0, 102, 204, 0.95)`
  - z-index: 1000
  - Used in: career-paths.html, experience-tagger.html
- **Header Navigation** - Legal docs use blue-accented button in page header
- **Corpus Library** - Inline link in left nav header
- All navigation links use consistent blue accent colors

---

## Responsive Design

- Mobile-first approach
- Breakpoint: 768px
- Collapsible filters on mobile (corpus)
- Proper header clearance (60-70px top padding)
- Logo scales: 60px → 40px (mobile)
- Touch-optimized with `-webkit-overflow-scrolling: touch`

---

## Python Generator

**File:** `generate_corpus_index.py`

**Purpose:** Regenerates `corpus/index.html` from metadata.csv

**Process:**
1. Reads `meta/meta.csv` (195+ articles)
2. Parses JSON fields (levels, tags, keywords, career_paths)
3. **Reverses article list** so most recently appended articles appear first
4. Extracts unique tags (20 total) and career paths (9 total)
5. Embeds all data directly in HTML (no external loading)
6. Generates complete static HTML with CSS and JavaScript

**Output:** ~1.1MB HTML file with embedded article data

**Usage:** `python generate_corpus_index.py`

**Key Functions:**
- `load_metadata()` - Parses CSV, JSON fields, reverses list for newest-first display
- `extract_all_tags()` - Collects unique tags across all articles
- `extract_all_career_paths()` - Collects unique career paths across all articles
- `generate_html()` - Builds complete HTML with embedded article data and filtering logic

**Metadata Path:** `SCRIPT_DIR / "meta" / "meta.csv"` (37 columns including Career_Paths)

**Article Display Order:** Reversed from CSV order - most recently appended entries appear first in library

---

## Blog Generation Workflow

**Reference:** `BLOG_GENERATION_GUIDE.md` and `TONE_GUIDE.md`

### 3-Step Process
1. **Create blog post HTML** following TONE_GUIDE.md patterns
   - Progressive introduction with concrete scenario
   - 2,500-3,500 words for technical deep-dives
   - Corporate Professional CSS (copy from template)
   - Copy-to-clipboard functionality on code blocks
   - Methodology boxes, tables, blockquotes for visual breaks

2. **Append metadata to meta.csv**
   - Create Python script to append new entry
   - Required fields: PartitionKey, RowKey, FileKey, Title, Subtitle (4-10 words), Executive_Summary, Overview_Summary, Detailed_Summary, Comprehensive_Abstract, Keywords (JSON array), Tags (JSON array), Audience_Level (JSON array), Career_Paths (JSON array), ID, Owner, Status, dates
   - Use proper field names matching existing CSV structure (check with DictReader first)
   - Handle Unicode in Windows console (use [OK] not ✓)

3. **Regenerate corpus index**
   - Run `python generate_corpus_index.py`
   - Verifies article count, tag count, career path count
   - Output: ~1.1MB HTML file with all articles embedded
   - **Display order**: Newest appended articles appear first (list is reversed)

### Common Pitfalls
- **Field Name Mismatch**: Always check existing meta.csv fieldnames before creating append script
- **Subtitle Length**: Must be 4-10 words for card display consistency
- **Unicode Characters**: Windows console can't display all Unicode; use ASCII alternatives in print statements
- **JSON Formatting**: Keywords, Tags, Audience_Level, Career_Paths must be valid JSON arrays
- **Logo Paths**: Use lowercase-with-dashes format (e.g., `high-resolution-logo-files`)
- **JSX Code Blocks**: Verify closing tag order in React components (`</div></pre></div>` not `</pre></div></div>`)
- **Code Block Line Breaks**: Wrap code content in `<pre>` tags within `<div class="code-content">` for proper formatting

### Standard Tags
Project Management, Security, Cloud, DevOps, Career Development, Technical Skills, Professional Skills, Data Analysis, Networking, Development, Testing, Automation, System Design, Architecture

### Standard Career Paths
Citizen Developer, Cloud Computing, Project Management, Cloud Operations, Network Operations, Security Operations, Full Stack Developer, AI/ML, Analytics

### Audience Levels
Neophyte, Novice, Operator, Expert, Academic

---

## Mobile Optimizations

- Collapsible filter panel in corpus library
- Smooth CSS transitions (max-height animation for collapsible sections)
- Floating action buttons with backdrop blur
- Touch-friendly pill selectors and sliders
- Proper viewport configuration
- iOS status bar styling
- Card layouts collapse to single column on mobile (≤768px)
- Form inputs stack vertically on mobile

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

## Platform Features (Future Development)

### Learner Canvas
A learner-extensible 2-D mindmap of job search resources with:
- **Opportunities** - Job tracking and analysis
- **Projects** - Capstone project portfolio
- **Profile** - LinkedIn-imported experience with skill categorization
- **History** - Timeline of technical competency development

### Cleansheet Quarters
12-week coaching engagements:
- 4 synchronous virtual meetings (30-45 min each)
- Asynchronous collaboration via comments
- Capstone project delivery
- Success Manager matchmaking
- Coach/learner canvas collaboration

### Coach Resources
- Comprehensive learner profiles (self-curated)
- Pre-session checklists and agendas
- Access to Cleansheet Library content
- Live conferencing and automated bookings
- Payment processing and financial reporting

### Cleansheet Library
- Extensive library of technical learning artifacts
- Blog posts, interactive widgets, animations, videos, presentations
- Designed for 15-30 minute focused discussions
- Available without authentication
- No ads or trackers
- Coach-extensible content

---

## Technical Implementation Notes

### File Organization
```
Cleansheet/
├── index.html                    # Main landing page
├── career-paths.html             # Career navigator
├── role-translator.html          # Role discovery
├── experience-tagger.html        # Experience management tool
├── ml-pipeline.html              # Pipeline visualization
├── privacy-policy.html           # Legal
├── privacy-principles.html       # Legal
├── terms-of-service.html         # Legal
├── corpus/
│   ├── index.html                # Generated library interface
│   └── [article-slug].html       # Individual articles
├── assets/
│   ├── high-resolution-logo-files/
│   ├── logos-for-business-tools/
│   ├── logos-for-mobile-apps/
│   ├── logos-for-social-media/
│   ├── printable-vector-files/
│   └── sample-logo/
├── meta/                         # Metadata storage
├── generate_corpus_index.py     # Corpus generator
├── DESIGN_GUIDE.md              # Design system docs
├── CLAUDE.md                    # This file
└── README.md                    # Public documentation
```

### Naming Conventions
- **HTML files**: `kebab-case.html`
- **CSS classes**: `kebab-case`
- **CSS variables**: `--prefix-name`
- **JavaScript**: `camelCase`
- **Assets**: `lowercase-with-dashes.extension`

### Code Standards

**HTML:**
- Semantic HTML5 elements
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text on all images
- Viewport and charset meta tags

**CSS:**
- Use CSS variables for colors/fonts/spacing
- Mobile-first media queries (breakpoint: 768px)
- BEM-like naming conventions
- Box-sizing: border-box on all elements

**JavaScript:**
- Vanilla JS preferred (minimize dependencies)
- Event delegation for dynamic content
- LocalStorage for client-side state (e.g., experience-tagger.html)
- Error handling on network requests
- JSON import/export for data portability

**Form Design Patterns:**
- Use suggestion chips for common inputs (hoverable, clickable examples)
- Flex layouts for input groups with proper proportions:
  - Text inputs: `flex: 2` or larger for main content
  - Dropdowns/selects: Fixed width (e.g., 130px) or `flex: 0 0 auto`
  - Buttons: `flex: 0 0 auto`
- List builders with add/remove functionality
- Date linking dropdowns for chronological data entry
- Modal forms with sticky header/footer for long forms

---

## Development Best Practices

### When Creating New Pages
1. Start with design system (CSS variables from `:root`)
2. Follow Corporate Professional color palette
3. Use Questrial for headings, Barlow Light for body
4. Implement mobile-first responsive design
5. Include proper accessibility attributes
6. Reference assets with correct paths (lowercase, dashes)
7. Test across supported browsers (Chrome, Firefox, Safari, Edge)

### When Modifying Existing Pages
1. Read existing code to understand patterns
2. Maintain consistent naming conventions
3. Update related documentation (DESIGN_GUIDE.md)
4. Test mobile and desktop views
5. Verify asset paths after changes

### When Working with Generated Files
1. Modify the generator script, not the output
2. Run generator after changes: `python generate_corpus_index.py`
3. Verify output file size and structure
4. Test interactive features (search, filters, slideout)

---

## Platform Deployment

### Static Hosting
- No server-side processing required
- All content embedded in HTML
- CDN-ready for global distribution

### Recommended Hosts
- Azure Static Web Apps (currently deployed)
- Azure Blob Storage with Static Website hosting
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Deployment Process
1. Generate corpus library: `python generate_corpus_index.py`
2. Verify assets present: Check `assets/high-resolution-logo-files/white-on-transparent.png`
3. Test locally in browser
4. Deploy static files to hosting platform

### Azure Blob Storage Considerations
- Serves content over HTTPS
- External links require `target="_blank" rel="noopener noreferrer"` to prevent "refused to connect" errors
- Browser scroll restoration can cause pages to jump to middle/bottom on load
  - Solution: Set `history.scrollRestoration = 'manual'` in JavaScript
  - Add multiple `window.scrollTo(0, 0)` calls: at init, in requestAnimationFrame, and on window load
  - Change `scroll-behavior: smooth` to `scroll-behavior: auto` for immediate positioning

---

## Azure Integration

Cleansheet deploys into Azure:
- **Subscriptions**: Cleansheet Prod, Cleansheet Test
- **Regions**: EastUS, EastUS2
- **Services**: Static Web Apps, ML services, storage

---

## Context for blog generation

### Paths
- Project Manager
- AI/ML Engineer
- Data Analyst
- Citizen Developer
- Cloud Operations
- Cloud Computing
- Network Operations
- Security Operations
- Full Stack Developer
- General Manager
- Product Manager
- Program Manager
- Business Development Manager/Sales
- Technical Account Manager/Presales

### Sectors
- Independent Software Vendor (ISV)
- Independent Hardware Vendor (IHV)
- Internet Service Provider (ISP)
- Cloud Service Provider (CSP)
- Managed Service Provider (MSP)
- Value Added Reseller (VAR)
- Distributor
- Telco

---

## AI Assistant Guidelines

### When Assisting with Development
1. **Always read files** before editing to understand context
2. **Use design system** - reference DESIGN_GUIDE.md for patterns
3. **Maintain consistency** - follow existing code style and naming
4. **Update documentation** - modify relevant docs when making changes
5. **Verify paths** - ensure all asset references use lowercase-with-dashes
6. **Test responsive** - consider mobile (≤768px) and desktop views
7. **Preserve accessibility** - maintain WCAG 2.1 AA compliance

### When Editing HTML
- Use semantic tags appropriately
- Maintain proper heading hierarchy
- Include alt text on images
- Preserve viewport and charset meta tags
- Follow existing component patterns

### When Modifying CSS
- Use CSS variables for all colors, fonts, spacing
- Add mobile-first media queries
- Follow BEM-like naming conventions
- Test hover/focus/active states

### When Writing JavaScript
- Prefer vanilla JS over frameworks
- Use event delegation for dynamic content
- Handle errors gracefully
- Comment complex logic

---

## Important Reminders

### File Handling
- **NEVER** create files unless absolutely necessary
- **ALWAYS** prefer editing existing files to creating new ones
- **NEVER** proactively create documentation files unless explicitly requested

### Design Consistency
- **ALWAYS** use CSS variables from `:root`
- **ALWAYS** follow Corporate Professional color palette
- **ALWAYS** use Questrial and Barlow Light fonts
- **ALWAYS** implement mobile-first responsive design

### Asset Management
- **ALWAYS** use lowercase-with-dashes for asset filenames
- **NEVER** use spaces in filenames (use dashes instead)
- **ALWAYS** reference assets with correct paths: `assets/high-resolution-logo-files/`

### Python Generator
- **ALWAYS** modify the generator script, not the generated HTML
- **ALWAYS** run `python generate_corpus_index.py` after changes
- **VERIFY** output file integrity after generation

---

## Privacy and Analytics

### Privacy Policy Commitments

**CRITICAL**: Cleansheet has strict privacy-first commitments documented in `privacy-policy.html` and `privacy-principles.html`. **All technical decisions must comply with these commitments.**

**What is PROHIBITED:**
- ❌ **Third-party analytics services** (Google Analytics, Mixpanel, Amplitude, etc.)
- ❌ **Tracking pixels or web beacons** (Facebook Pixel, LinkedIn Insight Tag, etc.)
- ❌ **Behavioral profiling cookies** (advertising/marketing cookies)
- ❌ **Cross-site tracking** (tracking users across multiple websites)
- ❌ **Data sharing with partners/advertisers** (no external data sharing agreements)
- ❌ **Using user data for AI training** (user content never used for LLM training)
- ❌ **Advertising networks** (no display ads, no sponsored content)
- ❌ **Social media tracking** (no social network data collection)

**What is ALLOWED:**
- ✅ **Anonymized usage data** for platform optimization (cannot be traced to individuals)
- ✅ **Essential cookies** for session management, security (CSRF prevention)
- ✅ **Analytics cookies (anonymized)** for usage patterns, performance metrics, optimization
- ✅ **First-party Azure services** (Azure Application Insights, Azure Monitor)
- ✅ **Server-side logging** (Azure Blob/CDN access logs, anonymized)

### Compliant Analytics Solutions

**Recommended Approach: Azure Application Insights (Server-Side)**

**Why it's compliant:**
- First-party Azure service within your subscription (no third-party data sharing)
- Server-side tracking (no client-side cookies or tracking scripts required)
- Fully anonymized by default
- Data stays in your Azure infrastructure
- Complies with "anonymized usage data" clause

**What you get:**
- Page views, unique visitors (anonymized)
- Geographic distribution (country/region level)
- Browser/device types (aggregate data)
- Session duration and bounce rates
- Custom event tracking (button clicks, feature usage)
- Performance metrics (load times, error rates)
- Error tracking and diagnostics

**Implementation:**

See **APPLICATION_INSIGHTS_SETUP.md** for complete step-by-step guide.

**Quick Start:**
```bash
# 1. Create Application Insights resource in Azure Portal
#    - Copy Instrumentation Key (GUID format)

# 2. Run injection script to add snippet to all HTML files
python inject_application_insights.py YOUR_INSTRUMENTATION_KEY

# 3. Test locally in browser (F12 → Network → filter: applicationinsights)

# 4. Deploy to Azure Blob Storage

# 5. Monitor in Azure Portal → Application Insights → Live Metrics
```

**Files Created:**
- `inject_application_insights.py` - Automated injection script (delete after use)
- `application-insights-snippet.html` - Snippet template (reference only)
- `APPLICATION_INSIGHTS_SETUP.md` - Complete implementation guide

**What Gets Tracked:**
- Page views (anonymized)
- Geographic distribution (country/region)
- Device/browser types
- Performance metrics (load times, errors)
- Custom events (optional)

**Alternative: Self-Hosted Analytics (If More User Behavior Needed)**

If server-side metrics aren't sufficient, consider self-hosted privacy-first solutions:

1. **Umami Analytics** (self-hosted)
   - Open-source, privacy-focused
   - Deploy to Azure Container Instances
   - No cookies, GDPR compliant
   - ~2KB client script
   - All data in your PostgreSQL/MySQL database
   - Cost: ~$10-15/month

2. **Plausible Analytics** (self-hosted)
   - Privacy-first by design
   - Deploy as container to Azure
   - 1KB script, no cookies
   - Fully anonymized
   - Cost: ~$10-15/month

3. **Server Log Analytics**
   - Process Azure CDN/Blob access logs
   - 100% server-side, no client impact
   - Azure Log Analytics + custom dashboards
   - Cost: ~$0.50-2/month

**Still compliant under "anonymized analytics cookies" clause** since these tools:
- Don't share data with third parties (self-hosted in your infrastructure)
- Anonymize by default (no personal data collection)
- No cross-site tracking
- No behavioral profiling for advertising

### Privacy Compliance Checklist

Before adding ANY new service, tool, or integration:

- [ ] **Review privacy-policy.html** - Does this violate any explicit prohibition?
- [ ] **Review privacy-principles.html** - Does this align with core privacy principles?
- [ ] **Check data sharing** - Does this service share data with third parties?
- [ ] **Check cookies/tracking** - Does this add behavioral profiling or tracking pixels?
- [ ] **Check AI training** - Could user data be used to train external AI models?
- [ ] **Check anonymization** - Is collected data truly anonymized and aggregate-only?
- [ ] **Self-hosted option** - If a third-party service, can it be self-hosted in Azure?

### When Adding Analytics/Tracking

**ALWAYS ask these questions BEFORE implementation:**

1. **Is this service truly first-party or self-hosted?**
   - Azure services in your subscription → ✅ Compliant
   - Self-hosted open-source tools → ✅ Compliant
   - External SaaS (Google, Facebook, etc.) → ❌ Prohibited

2. **Does this require client-side tracking scripts?**
   - Server-side only → ✅ Preferred
   - Minimal anonymized client script (<3KB) → ⚠️ Review carefully
   - Full tracking SDK (>10KB) → ❌ Likely prohibited

3. **Can individual users be identified or tracked?**
   - Fully anonymized aggregate data → ✅ Compliant
   - Session-based (can't link across sessions) → ⚠️ Review carefully
   - User-level tracking with profiles → ❌ Prohibited

4. **Would this require privacy policy updates?**
   - Uses existing "anonymized analytics" clause → ✅ Compliant
   - Requires new "third-party sharing" disclosure → ❌ Prohibited
   - Requires cookie consent banner → ❌ Avoid (complicates UX)

### Azure Deployment Considerations

When deploying to Azure Blob Storage with custom domain:

**DNS Migration Steps:**
1. Enable Static Website Hosting in Azure Storage Account
2. Upload all content (maintain folder structure)
3. Configure Azure CDN (optional but recommended for SSL)
4. Update DNS: CNAME www → Azure CDN endpoint
5. Configure SSL via Azure managed certificates
6. Monitor Azure Blob/CDN metrics (compliant first-party analytics)

**Privacy-Compliant Monitoring:**
- Azure Application Insights (server-side telemetry)
- Azure CDN analytics (access logs, bandwidth, performance)
- Azure Monitor dashboards (uptime, errors, latency)
- No Google Analytics, no external tracking services

**See detailed migration plan** in session history for full DNS cutover procedure.

---

## Documentation References

- **[README.md](README.md)** - Public repository documentation
- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - Comprehensive design system and style guide
- **[assets/README.md](assets/README.md)** - Asset usage and brand guidelines
- **[privacy-policy.html](privacy-policy.html)** - Legal privacy commitments (MUST REVIEW before analytics changes)
- **[privacy-principles.html](privacy-principles.html)** - Core privacy philosophy (MUST COMPLY)
- **[.gitignore](.gitignore)** - Version control exclusions

---

## Contact & Support

For questions about this development context:
- **Repository**: CleansheetLLC/Cleansheet
- **Website**: [cleansheet.info](https://www.cleansheet.info)
- **Documentation**: DESIGN_GUIDE.md, README.md

---

**Last Updated:** 2025-10-03
**Version:** 1.0
