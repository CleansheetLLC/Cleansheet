# Changelog

All notable changes to the Cleansheet Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features
- Learning Plans with progress tracking
- Skills Assessment tools
- Project Gallery for portfolio showcase
- Live Collaboration with screen sharing
- Market Analytics with location-based insights
- Community Forums

---

## [1.0.0] - 2025-10-03

### Added

#### Core Platform
- Main landing page with hero section and 6 feature cards
- Corporate Professional design system with CSS custom properties
- Mobile-first responsive design (breakpoint: 768px)
- Questrial and Barlow Light typography from Google Fonts
- Font Awesome 6.4.0 icon library integration

#### Content Library
- Content library with 188+ curated technical articles
- Python-based corpus generator (`generate_corpus_index.py`)
- Advanced search functionality (titles, keywords, content)
- Expertise level filtering with slider control
- Multi-select tag filtering (14 technical topics)
- 60% slideout panel for article viewing
- Mobile-responsive with collapsible filters

#### Interactive Tools
- Career Paths navigator with network diagram
- Role Translator for skills mapping
- ML Pipeline Tour visualization
- Interactive node selection with enhanced active states
- Path selector pills for career specializations

#### Legal & Privacy
- Privacy Policy page
- Privacy Principles page
- Terms of Service page
- Consistent legal document formatting

#### Branding & Assets
- High-resolution logo files in multiple formats
- Asset organization in lowercase-with-dashes structure
- Comprehensive brand asset README
- Mobile and social media logo variants

#### Documentation
- Comprehensive README.md with platform overview
- DESIGN_GUIDE.md with complete design system specs
- CLAUDE.md for AI-assisted development context
- CONTRIBUTING.md with contribution guidelines
- CODE_OF_CONDUCT.md for community standards
- SECURITY.md with vulnerability reporting process
- LICENSE file with proprietary terms
- assets/README.md for brand asset guidelines

#### Development
- `.gitignore` for corpus and meta directories
- Python corpus generator with CSV metadata support
- Static site architecture (no server-side processing)
- Web-friendly file naming conventions

### Design System
- Primary Blue: #0066CC
- Accent Blue: #004C99
- Dark: #1a1a1a
- Neutral color palette for text and backgrounds
- Consistent spacing system (4px - 32px)
- Responsive font sizing with clamp()
- Mobile-first media queries
- WCAG 2.1 AA accessibility compliance

### Browser Support
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions, iOS and macOS)
- Mobile (iOS Safari 12+, Chrome Android 90+)

### Changed
- N/A (initial release)

### Deprecated
- N/A (initial release)

### Removed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- Input validation on search and filter features
- HTML sanitization for user-generated content
- All external resources loaded via HTTPS
- No exposed API keys or secrets in repository

---

## Release Notes

### v1.0.0 - Initial Public Release

This is the initial public release of the Cleansheet Platform. The platform is now open for community contributions while maintaining proprietary licensing.

**Highlights:**
- 📚 188+ curated technical articles
- 🎨 Complete Corporate Professional design system
- 📱 Mobile-first responsive design
- 🔍 Advanced search and filtering
- 🗺️ Interactive career path visualization
- 🔒 Comprehensive privacy policies
- 📖 Full documentation suite

**For Developers:**
- Review `DESIGN_GUIDE.md` for design standards
- Read `CONTRIBUTING.md` before submitting PRs
- Follow `CODE_OF_CONDUCT.md` for community guidelines
- Report security issues to security@cleansheet.dev

**Known Limitations:**
- Content library is read-only (no user accounts yet)
- Some interactive features show "Coming Soon"
- Future features planned for v2.0

---

## Versioning Strategy

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Incompatible API/architecture changes
- **MINOR** version (1.X.0): New features, backward-compatible
- **PATCH** version (1.0.X): Bug fixes, backward-compatible

### Pre-release Versions

- **Alpha** (1.0.0-alpha.1): Internal testing
- **Beta** (1.0.0-beta.1): Public testing
- **RC** (1.0.0-rc.1): Release candidate

---

## Unreleased Changes

### In Development

*No unreleased changes yet*

### Under Consideration

- Content Security Policy implementation
- Subresource Integrity for CDN resources
- Service Worker for offline support
- Progressive Web App (PWA) capabilities
- Internationalization (i18n) support
- Dark mode theme option

---

## Contributing to the Changelog

When submitting a pull request, please update this changelog with your changes under the "Unreleased" section. Follow these guidelines:

### Change Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features to be removed in future versions
- **Removed**: Features removed in this version
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

### Format

```markdown
### Added
- Brief description of what was added [#PR-number]

### Fixed
- Brief description of what was fixed [#PR-number]
```

### Example

```markdown
## [Unreleased]

### Added
- Dark mode theme toggle [#42]
- Keyboard shortcuts for navigation [#55]

### Fixed
- Mobile navigation collapse issue on iOS [#38]
- Search filter reset bug [#41]
```

---

## Migration Guides

### Migrating to v1.0.0

This is the initial release, no migration needed.

Future migration guides will be added here when breaking changes are introduced.

---

## Support & Questions

For questions about releases or changelog:

- **Repository**: [github.com/CleansheetLLC/Cleansheet](https://github.com/CleansheetLLC/Cleansheet)
- **Website**: [cleansheet.info](https://www.cleansheet.info)
- **Documentation**: See `README.md`, `DESIGN_GUIDE.md`, `CONTRIBUTING.md`

---

**Last Updated**: 2025-10-03

© 2025 Cleansheet LLC. All rights reserved.
