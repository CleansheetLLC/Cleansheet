# Cleansheet Platform Design & Style Guide

## Overview
This document provides comprehensive guidelines for maintaining visual consistency, code quality, and design patterns across the Cleansheet platform. All developers and designers should reference this guide when creating or modifying platform pages.

---

## Table of Contents
1. [Design System](#design-system)
2. [Typography](#typography)
3. [Color Palette](#color-palette)
4. [Branding & Assets](#branding--assets)
5. [Component Patterns](#component-patterns)
6. [Page Structure](#page-structure)
7. [Responsive Design](#responsive-design)
8. [Code Standards](#code-standards)
9. [Rebranding Guidelines](#rebranding-guidelines)

---

## Design System

### CSS Custom Properties
All pages use CSS custom properties (`:root` variables) for consistency and ease of maintenance.

```css
:root {
    /* Brand Colors */
    --color-primary-blue: #0066CC;
    --color-accent-blue: #004C99;
    --color-dark: #1a1a1a;

    /* Neutral Colors */
    --color-neutral-text: #333333;
    --color-neutral-text-light: #666666;
    --color-neutral-text-muted: #999999;
    --color-neutral-background: #f5f5f7;
    --color-neutral-background-secondary: #f8f8f8;
    --color-neutral-border: #e5e5e7;
    --color-neutral-white: #ffffff;

    /* Typography */
    --font-family-ui: 'Questrial', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-family-body: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-size-h1: clamp(28px, 4vw, 32px);
    --font-size-h2: clamp(24px, 3.5vw, 36px);
    --font-size-h3: clamp(18px, 3vw, 24px);
    --font-size-body: clamp(14px, 2.5vw, 16px);
    --font-size-small: clamp(12px, 2.2vw, 14px);

    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 20px;
    --spacing-xxl: 24px;
    --spacing-xxxl: 32px;
}
```

---

## Typography

### Font Families
Load fonts via Google Fonts CDN:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300&family=Questrial&display=swap" rel="stylesheet">
```

### Font Usage
- **Questrial**: Headings (h1-h6), UI elements, navigation, buttons
- **Barlow Light (300 weight)**: Body text, paragraphs, descriptions

### Font Hierarchy
```css
h1 {
    font-family: var(--font-family-ui);
    font-size: var(--font-size-h1);
}

h2, h3, h4, h5, h6 {
    font-family: var(--font-family-ui);
}

body, p {
    font-family: var(--font-family-body);
    font-weight: 300;
    line-height: 1.6;
}
```

---

## Color Palette

### Corporate Professional Theme

#### Primary Colors
- **Primary Blue**: `#0066CC` - Main brand color for CTAs, active states
- **Accent Blue**: `#004C99` - Secondary actions, highlights
- **Dark**: `#1a1a1a` - Headers, navigation backgrounds, strong text

#### Neutral Colors
- **Text Primary**: `#333333` - Main body text
- **Text Light**: `#666666` - Secondary text
- **Text Muted**: `#999999` - Tertiary text, placeholders
- **Background**: `#f5f5f7` - Page background
- **Background Secondary**: `#f8f8f8` - Card backgrounds
- **Border**: `#e5e5e7` - Dividers, card borders
- **White**: `#ffffff` - Cards, contrast elements
- **Header Title**: `#e0e0e0` - Light gray for contrast on dark backgrounds

### Color Application

#### Buttons
```css
/* Primary Button */
.btn-primary {
    background: var(--color-primary-blue);
    color: white;
}

/* Secondary Button */
.btn-secondary {
    background: var(--color-dark);
    color: white;
}

/* Accent Button */
.btn-accent {
    background: var(--color-accent-blue);
    color: white;
}
```

#### Interactive States
```css
/* Hover states - darken by ~10-15% */
.btn-primary:hover { background: #0052a3; }
.btn-secondary:hover { background: #333333; }

/* Disabled states - reduce opacity */
.btn-disabled {
    opacity: 0.6;
    cursor: default;
    pointer-events: none;
}

/* Active/Selected states */
.active {
    transform: scale(1.25);
    font-weight: bold;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.3),
                0 0 20px rgba(0, 102, 204, 0.4),
                0 0 30px rgba(0, 102, 204, 0.2);
    z-index: 100;
}
```

---

## Branding & Assets

### Logo Files
**Location**: `assets/high-resolution-logo-files/`

#### Available Variants
- `white-on-transparent.png` - **Primary** for dark backgrounds (headers, navigation)
- `black-on-transparent.png` - For light backgrounds
- `original-on-transparent.png` - Full color variant
- `grayscale-on-transparent.png` - Grayscale variant
- `original.png` - Full color with background

#### Logo Usage
```html
<!-- Standard header logo (dark background) -->
<img src="assets/high-resolution-logo-files/white-on-transparent.png"
     alt="Cleansheet Logo"
     class="header-logo">
```

```css
/* Logo sizing */
.header-logo {
    height: 60px;  /* Desktop */
    width: auto;
}

@media (max-width: 768px) {
    .header-logo {
        height: 40px;  /* Mobile */
    }
}
```

### Favicon
```html
<link rel="icon" type="image/png"
      href="assets/high-resolution-logo-files/white-on-transparent.png">
```

### Additional Asset Directories
- `assets/logos-for-business-tools/` - App icons, integrations
- `assets/logos-for-mobile-apps/` - Mobile app icons
- `assets/logos-for-social-media/` - Social sharing images
- `assets/printable-vector-files/` - Print-ready vector formats
- `assets/sample-logo/` - Usage examples

---

## Component Patterns

### Iconography
**Library**: Phosphor Icons (MIT License)

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
```

**Why Phosphor**: More professional and modern than Font Awesome, with consistent geometric design, 6,000+ icons in multiple weights, and better suited for corporate/professional applications.

#### Icon Containers
```css
.feature-icon {
    width: 60px;
    height: 60px;
    background: var(--color-primary-blue);
    border-radius: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: white;
}

.feature-icon.dark {
    background: var(--color-dark);
}

.feature-icon.accent {
    background: var(--color-accent-blue);
}
```

#### Standard Icons
- `ph-book-open` - Content, library
- `ph-path` - Career paths, progression
- `ph-compass` - Navigation, discovery
- `ph-flow-arrow` - Architecture, pipeline
- `ph-shield-check` - Security, privacy
- `ph-users` - Coaching, mentorship
- `ph-tags` - Tagging, organization
- `ph-map-trifold` - Canvas, mapping

**Usage Example**:
```html
<i class="ph ph-book-open"></i>
```

**Weights Available**: Regular (default), Thin, Light, Bold, Fill, Duotone

### Cards
```css
.feature-card {
    background: var(--color-neutral-white);
    border-radius: var(--spacing-md);
    padding: var(--spacing-xxxl);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border: 1px solid var(--color-neutral-border);
}

.feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
```

### Buttons & Links
```css
.feature-link {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xxl);
    background: var(--color-dark);
    color: var(--color-neutral-white);
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: var(--font-size-small);
    transition: all 0.2s;
    font-family: var(--font-family-ui);
}

.feature-link:hover {
    background: #333333;
}

.feature-link.primary {
    background: var(--color-primary-blue);
}

.feature-link.primary:hover {
    background: #0052a3;
}
```

### Floating Action Buttons
```css
.floating-home-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 12px 20px;
    background: rgba(26, 26, 26, 0.85);
    backdrop-filter: blur(10px);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    border: 2px solid var(--color-primary-blue);
    font-family: var(--font-family-ui);
    font-weight: 600;
    z-index: 1000;
    transition: all 0.2s;
}

.floating-home-btn:hover {
    background: rgba(26, 26, 26, 0.95);
    transform: translateY(-2px);
}
```

### Pills & Tags
```css
/* Filter pills (multi-select) */
.tag-pill {
    display: inline-block;
    padding: 6px 12px;
    background: #f5f5f7;
    border: 1px solid #e5e5e7;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.tag-pill.active {
    background: var(--color-primary-blue);
    color: white;
    border-color: var(--color-primary-blue);
}

/* Expertise badges */
.expertise-badge {
    background: var(--color-primary-blue);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
}
```

---

## Page Structure

### Standard Header
```html
<header>
    <div class="header-content">
        <div class="header-text">
            <h1>Page Title</h1>
            <p class="tagline">Brief description</p>
        </div>
        <img src="assets/High%20Resolution%20Logo%20Files/White%20on%20transparent.png"
             alt="Cleansheet Logo"
             class="header-logo">
    </div>
</header>
```

### Standard Footer
```html
<footer>
    <p>&copy; 2025 Cleansheet LLC. All rights reserved.</p>
    <p style="margin-top: 8px;">
        <a href="https://www.cleansheet.info">cleansheet.info</a> |
        <a href="privacy-policy.html">Privacy Policy</a> |
        <a href="terms-of-service.html">Terms of Service</a>
    </p>
</footer>
```

### Main Content Container
```html
<main>
    <section class="hero">
        <p>Hero tagline or introduction</p>
    </section>

    <section class="features">
        <!-- Content grid -->
    </section>
</main>
```

```css
main {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xxxl) var(--spacing-xxl);
}
```

---

## Responsive Design

### Breakpoint Strategy
- **Mobile-first approach**
- **Primary breakpoint**: `768px`

### Mobile Considerations
```css
@media (max-width: 768px) {
    /* Reduce padding */
    header {
        padding: var(--spacing-lg);
    }

    main {
        padding: var(--spacing-xxl) var(--spacing-lg);
    }

    /* Stack grids */
    .features {
        grid-template-columns: 1fr;
    }

    /* Reduce logo size */
    .header-logo {
        height: 40px;
    }

    /* Collapsible sections */
    .mobile-collapsible {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .mobile-collapsible.open {
        max-height: 2000px;
    }
}
```

### Touch Optimizations
```css
/* iOS momentum scrolling */
.scrollable {
    -webkit-overflow-scrolling: touch;
}

/* Touch-friendly hit areas */
button, .clickable {
    min-height: 44px;  /* Apple HIG recommendation */
    min-width: 44px;
}
```

---

## Code Standards

### HTML Best Practices
1. **Semantic HTML5** - Use appropriate tags (`<header>`, `<main>`, `<section>`, `<footer>`)
2. **Accessibility** - Include `alt` text, proper heading hierarchy
3. **Meta tags** - Always include viewport and charset
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### CSS Best Practices
1. **Use CSS variables** for all colors, fonts, spacing
2. **Mobile-first** media queries
3. **BEM-like naming** for components (`.feature-card`, `.nav-header`)
4. **Box model** - Always use `box-sizing: border-box`
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### JavaScript Best Practices
1. **Vanilla JS preferred** - Minimize dependencies
2. **Event delegation** for dynamic content
3. **LocalStorage** for client-side state (filters, preferences)
4. **Error handling** for network requests

---

## Rebranding Guidelines

### Fast Color Updates
When rebranding, follow this systematic approach:

#### 1. Update CSS Variables
Change colors once in the `:root` block - this updates most elements automatically.

#### 2. Search Patterns
Use find/replace for hard-coded colors:
- Hex colors: `#0066CC`, `#004C99`, `#1a1a1a`
- Color properties: `background:`, `background-color:`, `color:`, `border-color:`
- Class names: `.blue-accent`, `.primary-bg`

#### 3. Component Checklist
Verify color updates in:
- [ ] Headers/navigation backgrounds
- [ ] Primary action buttons (CTAs)
- [ ] Secondary buttons and links
- [ ] Focus/hover/active states (`:focus`, `:hover`, `:active`)
- [ ] Icons and icon backgrounds
- [ ] Badges and pills (tags, expertise levels)
- [ ] Borders and dividers
- [ ] Slider/range inputs (track, thumb, `-webkit-` and `-moz-` prefixes)
- [ ] Mobile-specific elements (toggle buttons, collapsible sections)
- [ ] Modal/slideout panels
- [ ] Footer links

#### 4. Interactive State Patterns
```css
/* Always update these states together */
.element { background: var(--color-primary-blue); }
.element:hover { background: #0052a3; }  /* Darker variant */
.element:active { background: #003d7a; }  /* Even darker */
.element:focus { outline: 2px solid var(--color-primary-blue); }
```

#### 5. Non-Interactive Elements
For non-interactive elements (disabled states):
```css
.non-interactive {
    opacity: 0.6;
    cursor: default;
    pointer-events: none;
}
```

#### 6. Python Generators
Update color schemes in generated files:
- `platform/web/generate_corpus_index.py` - Embedded CSS in HTML output
- Search for color hex codes in generator scripts

#### 7. Testing Checklist
After rebranding:
- [ ] Test all interactive states (hover, focus, active)
- [ ] Verify mobile responsive behavior
- [ ] Check dark mode (if applicable)
- [ ] Test contrast ratios (WCAG AA: 4.5:1 for text)
- [ ] Validate across browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on actual mobile devices

---

## File Organization

### Directory Structure
```
Cleansheet/
├── index.html                    # Main landing page
├── career-paths.html             # Career progression tool
├── role-translator.html          # Role discovery tool
├── ml-pipeline.html              # Pipeline visualization
├── privacy-policy.html           # Legal - Privacy
├── privacy-principles.html       # Privacy commitments
├── terms-of-service.html         # Legal - Terms
├── corpus/
│   ├── index.html                # Content library (generated)
│   └── [article-slug].html       # Individual articles
├── assets/
│   ├── High Resolution Logo Files/
│   │   └── White on transparent.png  # Primary logo
│   ├── Logos for business tools/
│   ├── Logos for mobile apps/
│   ├── Logos for social media/
│   ├── Printable Vector Files/
│   └── Sample logo/
├── DESIGN_GUIDE.md               # This file
└── CLAUDE.md                     # Project instructions
```

### Naming Conventions
- **HTML files**: `kebab-case.html` (e.g., `career-paths.html`)
- **CSS classes**: `kebab-case` (e.g., `.feature-card`)
- **CSS variables**: `--prefix-name` (e.g., `--color-primary-blue`)
- **JavaScript**: `camelCase` for variables and functions

---

## Accessibility

### WCAG 2.1 AA Compliance
1. **Color contrast**: Minimum 4.5:1 for text, 3:1 for large text
2. **Keyboard navigation**: All interactive elements accessible via Tab
3. **Focus indicators**: Visible focus states (`:focus` styles)
4. **Alt text**: Descriptive text for all images
5. **Heading hierarchy**: Logical structure (h1 → h2 → h3)
6. **ARIA labels**: For icon-only buttons
```html
<button aria-label="Close panel">
    <i class="fas fa-times"></i>
</button>
```

---

## Performance

### Optimization Checklist
- [ ] Fonts loaded via preconnect
- [ ] Images optimized (WebP preferred, PNG fallback)
- [ ] CSS minified in production
- [ ] JavaScript deferred when possible
- [ ] External resources (Phosphor Icons, Google Fonts) loaded from CDN
- [ ] No render-blocking resources in `<head>`

### Loading Strategy
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Async load non-critical CSS -->
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
```

---

## Browser Support

### Supported Browsers
- **Chrome/Edge**: Last 2 versions
- **Firefox**: Last 2 versions
- **Safari**: Last 2 versions (iOS and macOS)
- **Mobile**: iOS Safari 12+, Chrome Android 90+

### Progressive Enhancement
Use feature detection for modern CSS:
```css
/* Fallback */
.element {
    background: rgba(26, 26, 26, 0.85);
}

/* Enhanced for supporting browsers */
@supports (backdrop-filter: blur(10px)) {
    .element {
        backdrop-filter: blur(10px);
    }
}
```

---

## Version Control

### Git Best Practices
- Commit message format: `[component] Brief description`
- Examples:
  - `[design] Update color palette to Corporate Professional`
  - `[header] Fix logo sizing on mobile`
  - `[corpus] Regenerate index with new design system`

### Ignored Files (`.gitignore`)
- `corpus/*` - Generated content (keep directory)
- `meta/*` - Metadata files (keep directory)
- `.vscode/` - Editor settings
- `*.code-workspace` - VS Code workspaces

---

## Maintenance

### Regular Updates
1. **Phosphor Icons**: Check for updates quarterly
2. **Google Fonts**: Monitor for font updates
3. **Browser testing**: Test monthly on supported browsers
4. **Accessibility audit**: Run annually with automated tools

### Documentation Updates
Update this guide when:
- Adding new color variants
- Creating new component patterns
- Changing breakpoints or responsive behavior
- Updating brand assets
- Adding new page types

---

## Quick Reference

### Essential File Paths
- **Logo**: `assets/high-resolution-logo-files/white-on-transparent.png`
- **Favicon**: Same as logo
- **Font CDN**: `https://fonts.googleapis.com/css2?family=Barlow:wght@300&family=Questrial&display=swap`
- **Icons**: `https://unpkg.com/@phosphor-icons/web`

### Common Colors (Hex)
```
Primary Blue:    #0066CC
Accent Blue:     #004C99
Dark:            #1a1a1a
Text Primary:    #333333
Text Light:      #666666
Background:      #f5f5f7
White:           #ffffff
```

### Standard Spacing (px)
```
XS:   4px
SM:   8px
MD:  12px
LG:  16px
XL:  20px
XXL: 24px
XXXL: 32px
```

---

## Contact & Support

For questions about this design system:
- **Repository**: `CleansheetLLC/Cleansheet`
- **Documentation**: This file (`DESIGN_GUIDE.md`)
- **Project Context**: See `CLAUDE.md`

Last Updated: 2025-10-03
