# Cleansheet Platform

A privacy-first career development platform focused on upskilling and sideskilling for professional growth through diverse experience.

**Live Platform**: [cleansheet.info](https://www.cleansheet.info)

---

## Overview

Cleansheet is a static web application providing career navigation tools, curated technical content, and professional development resources. The platform helps both new and established professionals build career security through intentional skill diversity.

### Mission

In a rapidly evolving job market, career security no longer comes from mastering a single role. It comes from building **diverse experience** across multiple domains, technologies, and business contexts. Cleansheet provides the tools and guidance to help professionals develop the breadth and depth of skills that create true career resilience.

---

## Key Features

### Career Navigation Tools

- **Career Path Navigator** - Interactive D3 visualizations of 9 technical career trajectories (Citizen Developer, Cloud Computing, Cloud Operations, Network Operations, Security Operations, Project Management, Full Stack Development, AI/ML Engineering, Data Analytics)
- **Role Translator** - Decode job titles and functional roles across industry sectors (ISV, CSP, MSP, VAR, etc.)
- **Experience Tagger** - Catalog and categorize professional experiences with skills, technologies, and career trajectories
- **Project Planner** - RACI matrices, work breakdown structures, and task scheduling with hierarchical organization

### Content Library

- **189+ Curated Articles** - Technical content across all major career paths
- **Multi-Level Content** - Neophyte, Novice, Operator, Expert, and Academic audience levels
- **Advanced Search & Filtering** - By technology, career path, tags, and keywords
- **ML-Powered Delivery** - Automated multi-format generation (web, mobile, audio)

### Cleansheet Canvas (Preview)

- **Integrated Workspace** - Career management across Learner, Seeker, and Professional personas
- **D3 Tree Visualizations** - Interactive career path exploration
- **Personal Tools** - Recipe management, financial tracking, and custom widgets

---

## Technology Stack

### Frontend
- **Languages**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Visualizations**: D3.js v7 for interactive network diagrams and tree layouts
- **Icons**: Phosphor Icons (6,000+ icons, MIT License)
- **Design System**: Corporate Professional theme with CSS custom properties

### Content Pipeline
- **Generation**: Python-based ML pipeline for multi-format content delivery
- **Metadata**: CSV-based article metadata (195+ articles, 37 columns)
- **Automation**: Single-source content with unlimited format variations

### Hosting & Infrastructure
- **Platform**: Azure Static Web Apps
- **CDN**: Global content delivery
- **Analytics**: Azure Application Insights (anonymized, privacy-first)
- **CI/CD**: GitHub Actions for automated deployment

### Architecture Philosophy
- **Zero Backend**: Client-side data storage for instant responsiveness
- **Progressive Enhancement**: Works on older browsers and slow connections
- **Mobile-First**: Responsive design with 768px primary breakpoint
- **Privacy by Design**: No tracking, no ads, no data sales

---

## Repository Structure

```
Cleansheet/
├── index.html                      # Main landing page with feature cards
├── about-cleansheet.html           # Platform mission and values
├── career-paths.html               # Career progression navigator (D3 visualizations)
├── role-translator.html            # Job title decoder across sectors
├── experience-tagger.html          # Professional experience management
├── project-planner.html            # RACI matrix and WBS tool
├── canvas-tour.html                # Cleansheet Canvas preview
├── learner.html                    # Learning app (production-ready)
├── privacy-principles.html         # Core privacy philosophy
├── privacy-policy.html             # Legal privacy commitments
├── terms-of-service.html           # Platform terms
├── ml-pipeline.html                # Content pipeline visualization
│
├── shared/                         # Shared JavaScript libraries
│   ├── cleansheet-core.js         # Core utilities and design tokens
│   ├── data-service.js            # Data abstraction layer (localStorage/API)
│   ├── api-schema.js              # API contract definition
│   └── library-data.js            # Auto-generated article data (189 published)
│
├── corpus/                         # Content library
│   ├── index.html                 # Generated library browser (~1.1MB)
│   └── [article-slug].html        # Individual articles (195 total)
│
├── assets/                         # Images, logos, brand assets
│   └── high-resolution-logo-files/
│       ├── white-on-transparent.png
│       └── black-on-transparent.png
│
├── meta/                           # Content metadata
│   └── meta.csv                   # Article metadata (195 articles, 37 columns)
│
├── doc/                            # Documentation
│   ├── BLOG_GENERATION_GUIDE.md   # Content creation workflow
│   └── APPLICATION_INSIGHTS_SETUP.md
│
├── generate_corpus_index.py       # Content generation script
├── seed-library-data.py           # Library data generator
├── DESIGN_GUIDE.md                # Comprehensive design system
├── CLAUDE.md                      # AI development context
├── TONE_GUIDE.md                  # Writing style guidelines
└── CONTRIBUTING.md                # Contribution guidelines
```

---

## Getting Started

### For Users

Visit **[cleansheet.info](https://www.cleansheet.info)** to use the platform. No installation required.

### For Developers

#### Prerequisites

- Python 3.8+ (for content generation only)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- Git

#### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/CleansheetLLC/Cleansheet.git
   cd Cleansheet
   ```

2. **Open in browser**
   ```bash
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows
   start index.html
   ```

   Or use a local web server:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

3. **Make changes**
   - Edit HTML, CSS, or JavaScript files
   - Follow design system in [DESIGN_GUIDE.md](DESIGN_GUIDE.md)
   - Use Corporate Professional color palette and typography

4. **Regenerate content library** (after metadata changes)
   ```bash
   python generate_corpus_index.py
   ```
   This reads `meta/meta.csv` and generates:
   - `corpus/index.html` - Traditional library browser (195 articles)
   - `shared/library-data.js` - Modern app data (189 published)

---

## Privacy Principles

Cleansheet is built on **privacy-first principles**:

### What We DON'T Do
- ❌ No user tracking or behavioral profiling
- ❌ No advertising or data sales
- ❌ No third-party analytics services
- ❌ No cookies for tracking purposes
- ❌ No cross-site tracking or pixels
- ❌ No use of your data for AI training

### What We DO
- ✅ Anonymized usage data only (Azure Application Insights)
- ✅ Client-side storage for user preferences (localStorage)
- ✅ Open source codebase for transparency
- ✅ Essential cookies for session management only
- ✅ First-party analytics with aggregate data
- ✅ Full data export and deletion capabilities

**Read More**: [Privacy Principles](https://www.cleansheet.info/privacy-principles.html) | [Privacy Policy](https://www.cleansheet.info/privacy-policy.html)

---

## Contributing

We welcome contributions! Here's how to get involved:

### Ways to Contribute

- **Report bugs**: Use [GitHub Issues](https://github.com/CleansheetLLC/Cleansheet/issues)
- **Suggest features**: Open an issue with the `enhancement` label
- **Improve documentation**: Fix typos, clarify instructions, add examples
- **Submit code**: Follow the guidelines below

### Contribution Process

1. **Read the guidelines**: See [CONTRIBUTING.md](CONTRIBUTING.md)
2. **Review design system**: Follow patterns in [DESIGN_GUIDE.md](DESIGN_GUIDE.md)
3. **Check AI context**: Understand development patterns in [CLAUDE.md](CLAUDE.md)
4. **Fork and create a branch**: `git checkout -b feature/your-feature-name`
5. **Make your changes**: Follow existing code style and conventions
6. **Test thoroughly**: Verify on desktop and mobile browsers
7. **Submit a pull request**: Describe your changes clearly

### Contribution License

By contributing, you grant Cleansheet LLC a perpetual, worldwide, non-exclusive, royalty-free license to use your contributions. See [LICENSE](LICENSE) for full terms.

All contributions remain subject to the Cleansheet Platform License.

---

## Documentation

### Design & Development
- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - Comprehensive design system, color palette, typography, component patterns
- **[CLAUDE.md](CLAUDE.md)** - AI development context, architecture overview, file organization
- **[TONE_GUIDE.md](TONE_GUIDE.md)** - Writing style guidelines for content creation

### Content Creation
- **[BLOG_GENERATION_GUIDE.md](doc/BLOG_GENERATION_GUIDE.md)** - Blog creation workflow and standards
- **[APPLICATION_INSIGHTS_SETUP.md](doc/APPLICATION_INSIGHTS_SETUP.md)** - Analytics implementation

### Legal & Policy
- **[Privacy Principles](privacy-principles.html)** - Core privacy philosophy
- **[Privacy Policy](privacy-policy.html)** - Legal privacy commitments
- **[Terms of Service](terms-of-service.html)** - Platform terms

---

## Development Roadmap

### Current Status (Production)
- ✅ Career Path Navigator
- ✅ Role Translator
- ✅ Experience Tagger
- ✅ Project Planner
- ✅ Content Library (189 articles)
- ✅ About Cleansheet page

### In Progress
- 🚧 Cleansheet Canvas (preview available at canvas-tour.html)
- 🚧 Job Seeker tools
- 🚧 Professional workspace

### Planned Features
- 📋 Cleansheet Quarters (12-week coaching engagements)
- 📋 Community features (peer learning, mentor matching)
- 📋 Mobile apps (iOS/Android)
- 📋 Audio streaming for articles
- 📋 Multi-language support

---

## Technical Standards

### Code Quality
- **JavaScript**: Vanilla ES6+, no frameworks required
- **CSS**: CSS custom properties, mobile-first responsive design
- **HTML**: Semantic HTML5, proper heading hierarchy, alt text on images
- **Accessibility**: WCAG 2.1 AA compliance

### Naming Conventions
- **Files**: `kebab-case.html`
- **CSS classes**: `kebab-case`
- **CSS variables**: `--prefix-name`
- **JavaScript**: `camelCase`

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## License

**Source-Available under Cleansheet Platform License**

- ✅ Free to view and study the source code
- ✅ Free to use at [cleansheet.info](https://www.cleansheet.info)
- ✅ Free for personal, educational, and non-commercial purposes
- ❌ Commercial use requires separate license

See [LICENSE](LICENSE) for complete terms.

For commercial licensing inquiries, contact: [cleansheet.info](https://www.cleansheet.info)

---

## Community & Support

### Get Help
- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/CleansheetLLC/Cleansheet/issues)
- **Discussions**: Ask questions and share ideas in GitHub Discussions
- **Documentation**: Check [DESIGN_GUIDE.md](DESIGN_GUIDE.md) and [CLAUDE.md](CLAUDE.md)

### Stay Updated
- **Website**: [cleansheet.info](https://www.cleansheet.info)
- **GitHub**: [CleansheetLLC/Cleansheet](https://github.com/CleansheetLLC/Cleansheet)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

### About Cleansheet LLC

Cleansheet is developed by a solo technical founder actively working in cloud architecture, full-stack development, and ML engineering. The platform reflects real-world career development needs because it's built by someone living them.

**Mission**: Help professionals build career security through intentional diversity of experience—upskilling and sideskilling for a rapidly changing job market.

---

## Acknowledgments

### Open Source Dependencies
- **D3.js** - Data visualization library (ISC License)
- **wordcloud2.js** - HTML5 canvas word cloud library by @timdream (MIT License)
- **Phosphor Icons** - Icon library (MIT License)
- **Google Fonts** - Questrial and Barlow typefaces (Open Font License)
- **Quill** - Modern rich text editor framework (BSD 3-Clause License)
- **Monaco Editor** - Code editor by Microsoft (MIT License)
- **KaTeX** - Fast math typesetting library (MIT License)
- **Reveal.js** - HTML presentation framework (MIT License)
- **draw.io** - Diagramming and whiteboarding tool (Apache License 2.0)
- **Playwright** - End-to-end testing framework by Microsoft (Apache License 2.0)

### Inspiration
- **DugganUSA** - Build and security approach
- **Linear** - Clean, benefit-focused product design
- **Notion** - Story-driven mission communication
- **Plausible Analytics** - Privacy-first approach
- **Ghost** - Open, transparent business model

---

## Contact

**Cleansheet LLC**
📧 Via website: [cleansheet.info](https://www.cleansheet.info)
🐙 GitHub: [CleansheetLLC/Cleansheet](https://github.com/CleansheetLLC/Cleansheet)
📄 License: [LICENSE](LICENSE)

---

© 2025 Cleansheet LLC. All rights reserved.
