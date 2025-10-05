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
**Library**: Phosphor Icons (MIT License, 6,000+ icons)

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
```

**Usage**:
```html
<!-- Icon with class syntax -->
<i class="ph ph-book-open"></i>
<i class="ph ph-map-trifold"></i>
<i class="ph ph-compass"></i>
```

**Migration from Font Awesome**: All pages now use Phosphor Icons for consistency and broader icon selection.

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
- `fa-book-open` - Content, library
- `fa-route` - Career paths, progression
- `fa-compass` - Navigation, discovery
- `fa-sitemap` - Architecture, pipeline
- `fa-shield-alt` - Security, privacy
- `fa-user-friends` - Coaching, mentorship

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

/* Count badges (used in Canvas modal) */
.count-badge {
    background: #e3f2fd;  /* Light blue */
    color: #1a1a1a;       /* Dark gray text */
    font-weight: 600;
    /* NO border/stroke - fill only */
}
```

### D3 Network Navigation
**Reference implementation**: `experience-tagger-d3.html`

A force-directed network navigation component using D3.js for visualizing career path relationships.

#### Dependencies
```html
<script src="https://d3js.org/d3.v7.min.js"></script>
```

#### Component Structure
```html
<div class="nav-section">
    <div id="d3-nav-container"></div>
</div>
```

#### Styling
```css
.nav-section {
    background: var(--color-dark);
    padding: 24px 16px;
    border-bottom: 1px solid var(--color-neutral-border);
}

#d3-nav-container {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    height: 200px;  /* Compact height for header navigation */
}

/* Links between nodes */
.nav-link {
    stroke: rgba(255, 255, 255, 0.4);
    stroke-width: 1;
    fill: none;
}

.nav-link.active {
    stroke: var(--color-primary-blue);
    stroke-width: 2;
}

/* Node rectangles */
.nav-node rect {
    stroke: none;  /* No outline by default */
    cursor: pointer;
    transition: all 0.3s;
    rx: 6;  /* Rounded corners */
    ry: 6;
}

/* Node types */
.nav-node.primary rect {
    fill: var(--color-primary-blue);
}

.nav-node.secondary rect {
    fill: var(--color-accent-blue);
}

.nav-node.tertiary rect {
    fill: #d3d3d3;  /* Non-clickable nodes */
}

/* Active/selected node */
.nav-node.active rect {
    fill: var(--color-accent-blue);
    stroke: var(--color-primary-blue);
    stroke-width: 3;
    filter: drop-shadow(0 0 8px var(--color-primary-blue));
}

/* Node labels */
.nav-node text {
    fill: white;
    font-family: var(--font-family-ui);
    font-size: 10px;
    font-weight: 600;
    text-anchor: middle;
    pointer-events: none;
    user-select: none;
}

.nav-node.tertiary text {
    fill: #333333;  /* Dark text for gray nodes */
}
```

#### Data Structure
```javascript
const navigationData = {
    nodes: [
        {
            id: 'node1',
            label: 'Display Name',
            tier: 'primary',  // 'primary', 'secondary', or 'tertiary'
            url: '#',  // Set to null for non-clickable nodes
            x: 0.30,  // Position as percentage (0.0 - 1.0)
            y: 0.50
        }
    ],
    links: [
        { source: 'node1', target: 'node2' }
    ]
};
```

#### Key Features
- **Fixed positioning**: Nodes use percentage-based x/y coordinates for consistent layout
- **Gentle forces**: Low force strength maintains initial positioning while preventing overlap
- **Three-tier system**: Primary (clickable blue), Secondary (accent blue), Tertiary (gray, non-clickable)
- **Hover effects**: Drop-shadow on hover for visual feedback
- **Active states**: Selected nodes show blue outline and glow
- **Responsive**: Adjusts to container width, compact 200px height for header navigation
- **Draggable nodes**: Optional - can be disabled by removing drag behavior

#### Rectangle Sizing
```javascript
// Primary tier: 100px × 30px
// Secondary tier: 90px × 28px
// Tertiary tier: 100px × 26px

node.append('rect')
    .attr('width', d => d.tier === 'primary' ? 100 : d.tier === 'secondary' ? 90 : 100)
    .attr('height', d => d.tier === 'primary' ? 30 : d.tier === 'secondary' ? 28 : 26)
    .attr('x', d => (d.tier === 'primary' ? -50 : d.tier === 'secondary' ? -45 : -50))
    .attr('y', d => (d.tier === 'primary' ? -15 : d.tier === 'secondary' ? -14 : -13));
```

#### Best Practices
1. **Limit nodes**: 10-15 nodes maximum for readability in compact space
2. **Use percentages**: Position nodes using 0.0-1.0 range for responsive layout
3. **Visual hierarchy**: Use tertiary tier for context-only nodes (non-interactive)
4. **Contrast**: White text on blue nodes, dark text on gray nodes
5. **Compact layout**: Keep y-values between 0.12 and 0.88 to avoid clipping
6. **Clean design**: No outlines on default state, only show on active selection

---

### D3 Tree Visualization (Canvas Modal)
**Implementation**: `index.html` - Cleansheet Canvas modal

A tree-based mindmap visualization using D3.js for navigating career resources with expand/collapse functionality.

#### Dependencies
```html
<script src="https://d3js.org/d3.v7.min.js"></script>
```

#### Modal Structure
```html
<div class="canvas-modal" id="canvasModal">
    <div class="canvas-modal-content">
        <div class="canvas-modal-header">
            <div class="persona-selector">
                <button class="persona-btn active" data-persona="retail-manager">
                    Marcus Thompson
                </button>
                <!-- More persona buttons -->
            </div>
            <button class="close-btn" onclick="closeCanvas()">×</button>
        </div>
        <div class="canvas-modal-body" id="canvasBody">
            <div class="mindmap-container">
                <div id="mindmap"></div>
            </div>
            <div class="right-panel">
                <!-- Calendar and AI Assistant widgets -->
            </div>
        </div>
    </div>
</div>
```

#### Styling
```css
.canvas-modal {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.85);
    z-index: 10000;
    display: none;
}

.canvas-modal.active { display: flex; }

.canvas-modal-content {
    width: 95vw; height: 95vh;
    background: white;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
}

.canvas-modal-body {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 350px;  /* Expanded */
    gap: 24px;
    transition: grid-template-columns 0.3s ease;
    overflow: hidden;
    min-height: 0;
}

.canvas-modal-body.collapsed {
    grid-template-columns: 1fr 0px;  /* Collapsed */
    gap: 0;
}

.mindmap-container {
    overflow: auto;
    background: var(--color-neutral-background);
    border-radius: 8px;
}

/* Tree nodes */
.tree-node rect {
    fill: white;
    stroke: #ddd;
    stroke-width: 1;
    rx: 6;
    ry: 6;
}

.tree-node.root rect {
    fill: white;
    stroke: var(--color-primary-blue);
    stroke-width: 2;
}

.tree-node.child rect {
    fill: var(--color-primary-blue);
}

.tree-node.grandchild rect {
    fill: white;
}

.tree-node text {
    font-family: var(--font-family-ui);
    font-size: 13px;
    fill: #333;
    text-anchor: middle;
    pointer-events: none;
}

.tree-node.child text {
    fill: white;
    font-weight: 600;
}

/* Tree links */
.tree-link {
    fill: none;
    stroke: #999;
    stroke-width: 2;
}

/* Count badges */
.count-badge-circle {
    fill: #e3f2fd;  /* Light blue */
}

.count-badge-text {
    fill: #1a1a1a;  /* Dark gray */
    font-size: 11px;
    font-weight: 600;
    text-anchor: middle;
    pointer-events: none;
}
```

#### D3 Tree Implementation

**Key Pattern: Use `.nodeSize()` for fixed spacing**
```javascript
// CORRECT: Fixed node spacing
const treeLayout = d3.tree()
    .nodeSize([60, 220]);  // [vertical, horizontal] spacing in pixels

// WRONG: Dynamic scaling
const treeLayout = d3.tree()
    .size([height, width]);  // Nodes compress when tree expands
```

**Hierarchy Creation with Collapse**
```javascript
// Step 1: Create hierarchy with FULL data first
const root = d3.hierarchy(mindmapData);
root.x0 = height / 2;
root.y0 = 0;

// Step 2: Manually collapse grandchildren (hide initially)
if (root.children) {
    root.children.forEach(child => {
        if (child.children) {
            child._children = child.children;  // Store for later
            child.children = null;              // Hide initially
        }
    });
}
```

**CRITICAL**: Never pre-hide children before calling `d3.hierarchy()`. D3 needs to see the full data structure first.

**Toggle Node Function**
```javascript
function toggleNode(d) {
    if (!d._children && !d.children) return;

    // If opening this node
    if (d._children) {
        // Close any other open second-level nodes
        root.children.forEach(child => {
            if (child !== d && child.children) {
                child._children = child.children;
                child.children = null;
            }
        });

        // Open this node
        d.children = d._children;
        d._children = null;
    } else {
        // Close this node
        d._children = d.children;
        d.children = null;
    }

    update(d);  // Redraw tree
}
```

**Text Truncation**
```javascript
function wrapText(text, maxWidth, maxLines = 999) {
    const words = text.text().split(/\s+/).reverse();
    let line = [];
    let lineNumber = 0;
    let lineHeight = 1.1;
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy')) || 0;
    let tspan = text.text(null).append('tspan')
        .attr('x', 0).attr('y', y).attr('dy', dy + 'em');

    let word;
    while (word = words.pop()) {
        if (lineNumber >= maxLines) break;

        line.push(word);
        tspan.text(line.join(' '));

        if (tspan.node().getComputedTextLength() > maxWidth) {
            line.pop();

            // Add ellipsis if this is the last line
            if (lineNumber === maxLines - 1 && words.length > 0) {
                tspan.text(line.join(' ') + '...');
            } else {
                tspan.text(line.join(' '));
            }

            line = [word];
            tspan = text.append('tspan')
                .attr('x', 0)
                .attr('y', y)
                .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                .text(word);
        }
    }
}
```

**Dynamic SVG Sizing**
```javascript
function update(source) {
    const visibleNodes = root.descendants();
    const neededHeight = Math.max(height, visibleNodes.length * 60);
    const neededWidth = Math.max(width, 1000);

    svg.style('min-width', neededWidth + 'px')
       .style('min-height', neededHeight + 'px');

    // Use nodeSize for fixed spacing
    const treeLayout = d3.tree()
        .nodeSize([60, 220])
        .separation((a, b) => {
            if (a.depth === 2 && b.depth === 2) {
                return a.parent === b.parent ? 1.0 : 1.3;
            }
            return a.parent === b.parent ? 1.0 : 1.5;
        });

    const treeData = treeLayout(root);
    // ... render nodes and links
}
```

#### Node Dimensions
- **Root**: 140×60px (white background, blue border)
- **Second-level**: 180×50px (blue background, white text)
- **Third-level**: 250×40px (white background, dark text)

#### Text Constraints
- **Maximum characters**: 50 chars
- **Maximum lines**: 2 lines for third-level nodes
- **Truncation**: Ellipsis (...) on last line if exceeded
- **Line breaks**: Support `\n` for manual line breaks (e.g., job listings)

#### Data Structure
```javascript
const personaData = {
    'retail-manager': {
        name: 'Marcus Thompson',
        goal: 'Transition from retail management...',
        children: [
            {
                name: 'Job Opportunities',
                count: 5,  // Shows in badge
                children: [
                    { name: 'Operations Manager\nAmazon (Seattle, $125K)' }
                ]
            },
            {
                name: 'Portfolio',
                count: 2,
                children: [
                    { name: 'Power BI Sales Dashboard' }
                ]
            },
            {
                name: 'Interview Prep',
                count: 3,
                children: [
                    { name: 'Behavioral' },
                    { name: 'Technical' },
                    { name: 'Challenge' }
                ]
            }
        ]
    }
};
```

#### Badge Positioning
```javascript
// Count badge for second-level nodes
node.filter(d => d.depth === 1 && d.data.count)
    .each(function(d) {
        const count = d.data.count;

        // Circle
        d3.select(this.parentNode)
            .append('circle')
            .attr('class', 'count-badge-circle')
            .attr('cx', 90 - 20)  // childWidth/2 - offset
            .attr('cy', -25 + 15)  // -childHeight/2 + offset
            .attr('r', 12)
            .attr('fill', '#e3f2fd');  // Light blue, NO stroke

        // Text
        d3.select(this.parentNode)
            .append('text')
            .attr('class', 'count-badge-text')
            .attr('x', 90 - 20)
            .attr('y', -25 + 15)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('font-weight', '600')
            .attr('fill', '#1a1a1a')  // Dark gray
            .text(count);
    });
```

#### Right Panel (Collapsible)
```javascript
function toggleRightPanel() {
    const body = document.getElementById('canvasBody');
    const toggle = document.getElementById('collapseToggle');
    const icon = toggle.querySelector('i');

    rightPanelCollapsed = !rightPanelCollapsed;

    if (rightPanelCollapsed) {
        body.classList.add('collapsed');
        icon.className = 'ph ph-caret-left';
    } else {
        body.classList.remove('collapsed');
        icon.className = 'ph ph-caret-right';
    }
}
```

#### Best Practices
1. **Always use `.nodeSize()`** for tree layouts - prevents node compression on expand
2. **Create hierarchy first** - call `d3.hierarchy()` with full data before hiding children
3. **Constrain text** - set char limits (50), line limits (2), add ellipsis
4. **Dynamic sizing** - calculate SVG dimensions based on visible nodes
5. **Scrollable container** - use `overflow: auto` to handle large trees
6. **Single-node expansion** - only one second-level node open at a time
7. **Badge styling** - light blue background (#e3f2fd), dark text (#1a1a1a), NO border
8. **Smooth transitions** - 400ms duration for expand/collapse animations
9. **Panel collapse** - starts collapsed to maximize mindmap space
10. **Line break support** - use `\n` for multi-line text in job listings

#### Content Guidelines
**Portfolio**: Include only displayable artifacts (dashboards, projects, repos, publications). Exclude achievements/metrics (those belong in Career Experience).

**Interview Prep**: Simplified to three categories:
- Behavioral (questions about past experience)
- Technical (skills assessment)
- Challenge (coding/problem-solving)

These categories trigger CRUD slideout widgets for managing multiple records.

**Job Opportunities**: Format with line breaks:
```javascript
{ name: 'Job Title\nCompany (Location, Salary)' }
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
- [ ] External resources (Font Awesome, Google Fonts) loaded from CDN
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
1. **Font Awesome**: Check for updates quarterly
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
- **Icons**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`

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
