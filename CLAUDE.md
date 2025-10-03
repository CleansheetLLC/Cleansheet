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
- Font Awesome 6.4.0 (free version)
- Color-coded icon backgrounds (primary blue, dark, accent blue)
- Consistent rounded square containers (60px × 60px)
- All icons use white color

**Branding:**
- Logo: `white-on-transparent.png` in all dark headers
- Located: `assets/high-resolution-logo-files/`
- Responsive sizing: 60px desktop, 40px mobile

---

## Page Structure

### Main Landing Page (`index.html`)
- Hero section with tagline (no h2 title)
- 6 feature cards with Font Awesome icons:
  - Content Library (fa-book-open, primary blue)
  - Career Paths (fa-route, dark)
  - ML Pipeline Tour (fa-sitemap, accent blue)
  - Role Translator (fa-compass, primary blue)
  - Privacy & Terms (fa-shield-alt, dark)
  - Coaching & Mentorship (fa-user-friends, accent blue)
- Coming Soon section (3-column grid, 2 rows, larger fonts: 16px body, 18px headings)
- Footer with white external links

### Content Library (`corpus/index.html`)
- Generated via Python script (`generate_corpus_index.py`)
- 188+ curated articles embedded in HTML
- Left nav (#1a1a1a dark background) with white text elements:
  - "Cleansheet Library" title (white, Questrial)
  - Search functionality (titles, keywords, content) with white focus outline
  - Expertise level slider (white track and thumb)
  - Tag filtering with multi-select pills (blue #0066CC when active)
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
- Logo positioned fixed in top right corner (60px desktop, 40px mobile)

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

**Legal Documents:**
- `privacy-policy.html` - Privacy policy
- `terms-of-service.html` - Terms of service
- `privacy-principles.html` - Privacy commitments
- Consistent header with logo and "← Back to Home" link
- All use Barlow Light for body text

---

## Navigation

- **Floating Home Buttons** - Interactive pages use semi-transparent dark background with blue border
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
1. Reads `corpus/metadata.csv` (188+ articles)
2. Parses JSON fields (levels, tags, keywords)
3. Extracts unique tags (14 total)
4. Embeds all data directly in HTML (no external loading)
5. Generates complete static HTML with CSS and JavaScript

**Output:** ~810KB HTML file with embedded article data

**Usage:** `python generate_corpus_index.py`

---

## Mobile Optimizations

- Collapsible filter panel in corpus library
- Smooth CSS transitions (max-height animation)
- Floating action buttons with backdrop blur
- Touch-friendly pill selectors and sliders
- Proper viewport configuration
- iOS status bar styling

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
- LocalStorage for client-side state
- Error handling on network requests

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
- Azure Static Web Apps
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Deployment Process
1. Generate corpus library: `python generate_corpus_index.py`
2. Verify assets present: Check `assets/high-resolution-logo-files/white-on-transparent.png`
3. Test locally in browser
4. Deploy static files to hosting platform

---

## Azure Integration

Cleansheet deploys into Azure:
- **Subscriptions**: Cleansheet Prod, Cleansheet Test
- **Regions**: EastUS, EastUS2
- **Services**: Static Web Apps, ML services, storage

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

## Documentation References

- **[README.md](README.md)** - Public repository documentation
- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - Comprehensive design system and style guide
- **[assets/README.md](assets/README.md)** - Asset usage and brand guidelines
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
