# Cleansheet Canvas Style Guide - D3 Mindmap Visualization

## Overview

This style guide defines the visual design system for Cleansheet canvas mindmaps rendered with D3.js. All persona canvases (Personal, Professional, Learner, Seeker, Coach, Success Manager) must follow these specifications to ensure consistency across the platform.

---

## Typography

### Font Families

```css
/* Primary UI Font - Node labels, titles */
--canvas-font-primary: 'Questrial', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Body Font - Descriptions, metadata */
--canvas-font-body: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--canvas-font-body-weight: 300;

/* Monospace - Data, code, technical content */
--canvas-font-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
```

### Font Sizing

```css
/* Node Labels */
--canvas-font-root: 18px;          /* Root node */
--canvas-font-l1: 16px;            /* Level 1 children */
--canvas-font-l2: 14px;            /* Level 2 children */
--canvas-font-l3: 12px;            /* Level 3+ children */

/* Metadata & Annotations */
--canvas-font-meta: 11px;          /* Timestamps, counts, tags */
--canvas-font-tooltip: 13px;       /* Tooltip content */
```

### Font Weights

```css
--canvas-weight-root: 700;         /* Root node - bold */
--canvas-weight-branch: 600;       /* Branch nodes - semibold */
--canvas-weight-leaf: 400;         /* Leaf nodes - regular */
--canvas-weight-meta: 300;         /* Metadata - light */
```

---

## Color Palette

### Brand Colors (Cleansheet Design System)

```css
/* Primary */
--canvas-color-primary: #0066CC;       /* Primary Blue */
--canvas-color-primary-light: #3385D6; /* Hover/Active state */
--canvas-color-primary-dark: #004C99;  /* Accent Blue */

/* Neutrals */
--canvas-color-dark: #1a1a1a;          /* Text, strong emphasis */
--canvas-color-text: #333333;          /* Standard text */
--canvas-color-text-light: #666666;    /* Secondary text */
--canvas-color-text-muted: #999999;    /* Tertiary text */
--canvas-color-bg: #f5f5f7;            /* Canvas background */
--canvas-color-white: #ffffff;         /* Node backgrounds */
--canvas-color-border: #e5e5e7;        /* Borders, dividers */
```

### Node Type Colors

```css
/* Root Node */
--canvas-node-root-bg: #0066CC;
--canvas-node-root-text: #ffffff;
--canvas-node-root-border: #004C99;

/* Category/Branch Nodes */
--canvas-node-branch-bg: #ffffff;
--canvas-node-branch-text: #1a1a1a;
--canvas-node-branch-border: #0066CC;

/* Leaf/Content Nodes */
--canvas-node-leaf-bg: #f5f5f7;
--canvas-node-leaf-text: #333333;
--canvas-node-leaf-border: #e5e5e7;

/* Active/Selected State */
--canvas-node-active-bg: #0066CC;
--canvas-node-active-text: #ffffff;
--canvas-node-active-border: #004C99;
--canvas-node-active-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);

/* Hover State */
--canvas-node-hover-bg: rgba(0, 102, 204, 0.05);
--canvas-node-hover-border: #0066CC;
```

### Link/Edge Colors

```css
/* Connection Lines */
--canvas-link-default: #e5e5e7;        /* Default links */
--canvas-link-active: #0066CC;         /* Active path links */
--canvas-link-hover: #3385D6;          /* Hover state */
--canvas-link-width-default: 2px;      /* Standard width */
--canvas-link-width-active: 3px;       /* Active/selected width */
```

### Semantic Colors

```css
/* Status Indicators */
--canvas-status-success: #22c55e;      /* Complete, verified */
--canvas-status-warning: #f59e0b;      /* In progress, pending */
--canvas-status-error: #ef4444;        /* Error, blocked */
--canvas-status-info: #0066CC;         /* Information, default */

/* Priority/Importance */
--canvas-priority-high: #ef4444;       /* High priority items */
--canvas-priority-medium: #f59e0b;     /* Medium priority */
--canvas-priority-low: #94a3b8;        /* Low priority */
```

---

## Spacing & Layout

### Node Dimensions

```css
/* Node Sizing */
--canvas-node-root-width: 180px;
--canvas-node-root-height: 60px;
--canvas-node-branch-width: 150px;
--canvas-node-branch-height: 50px;
--canvas-node-leaf-width: 120px;
--canvas-node-leaf-height: 40px;

/* Node Padding */
--canvas-node-padding-x: 16px;
--canvas-node-padding-y: 12px;

/* Node Borders */
--canvas-node-border-width: 2px;
--canvas-node-border-radius: 8px;
--canvas-node-root-border-radius: 12px;
```

### Spacing Between Elements

```css
/* Hierarchical Spacing */
--canvas-spacing-horizontal: 200px;    /* Horizontal distance between sibling nodes */
--canvas-spacing-vertical: 80px;       /* Vertical distance between levels */
--canvas-spacing-compact: 60px;        /* Compact view spacing */

/* Node Internal Spacing */
--canvas-spacing-xs: 4px;
--canvas-spacing-sm: 8px;
--canvas-spacing-md: 12px;
--canvas-spacing-lg: 16px;
--canvas-spacing-xl: 24px;
```

### Canvas Layout

```css
/* Overall Canvas */
--canvas-min-width: 1200px;
--canvas-min-height: 600px;
--canvas-padding: 40px;                /* Canvas edge padding */

/* Viewport */
--canvas-zoom-min: 0.5;                /* Minimum zoom level */
--canvas-zoom-max: 2.0;                /* Maximum zoom level */
--canvas-zoom-default: 1.0;            /* Default zoom */
```

---

## Structure & Behavior

### Node Hierarchy

**Root Node (Level 0)**
- Represents the canvas/project/persona
- Centered by default
- Largest size, bold typography
- Primary blue background
- White text
- Always visible, non-collapsible

**Branch Nodes (Level 1-2)**
- Categories, sections, or major groupings
- White background with blue border
- Collapsible (show/hide children)
- Toggle icon: `▼` (expanded) / `▶` (collapsed)

**Leaf Nodes (Level 3+)**
- Individual items, tasks, artifacts
- Light gray background
- Non-collapsible (no children)
- May contain metadata badges

### Interactive States

**Default State**
```css
background: var(--canvas-node-leaf-bg);
border: 2px solid var(--canvas-color-border);
opacity: 1;
cursor: pointer;
```

**Hover State**
```css
background: var(--canvas-node-hover-bg);
border-color: var(--canvas-node-hover-border);
transform: scale(1.02);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
transition: all 0.2s ease;
```

**Active/Selected State**
```css
background: var(--canvas-node-active-bg);
color: var(--canvas-node-active-text);
border-color: var(--canvas-node-active-border);
box-shadow: var(--canvas-node-active-shadow);
font-weight: 600;
```

**Collapsed Node State**
```css
opacity: 0.7;
/* Show count badge: "+5" indicating hidden children */
```

### Link/Edge Styling

**Default Link**
```javascript
{
    stroke: '#e5e5e7',
    strokeWidth: 2,
    strokeDasharray: 'none',
    fill: 'none'
}
```

**Active Path Link**
```javascript
{
    stroke: '#0066CC',
    strokeWidth: 3,
    strokeDasharray: 'none',
    fill: 'none'
}
```

**Link Types**
- **Solid**: Parent-child hierarchical relationships
- **Dashed**: Cross-references, related items
- **Curved**: Bezier curves for organic flow

### Animations & Transitions

```css
/* Node Transitions */
--canvas-transition-enter: 0.3s ease-out;
--canvas-transition-exit: 0.2s ease-in;
--canvas-transition-move: 0.4s ease-in-out;

/* Hover/Click Response */
--canvas-interaction-timing: 0.2s ease;

/* Collapse/Expand */
--canvas-expand-duration: 0.3s;
--canvas-expand-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
```

---

## Accessibility

### Contrast Requirements

- **WCAG 2.1 AA Compliance**: Minimum 4.5:1 contrast for text
- Root node: White text on Primary Blue (#0066CC) = 4.6:1 ✅
- Branch nodes: Dark text (#1a1a1a) on White = 16.1:1 ✅
- Leaf nodes: Dark text (#333333) on Light Gray (#f5f5f7) = 11.2:1 ✅

### Keyboard Navigation

- **Tab**: Navigate between nodes
- **Enter/Space**: Expand/collapse node
- **Arrow Keys**: Navigate tree structure
- **Escape**: Deselect/close

### Screen Reader Support

- Nodes must have `role="treeitem"`
- Use `aria-expanded` for collapsible nodes
- Use `aria-level` for hierarchy depth
- Use `aria-label` for icon-only elements

---

## D3.js Implementation Notes

### Recommended Layout

Use **D3 Tree Layout** or **D3 Force Layout** depending on use case:

**Tree Layout** (Recommended for hierarchical canvases)
```javascript
const tree = d3.tree()
    .size([width, height])
    .separation((a, b) => a.parent == b.parent ? 1 : 2);
```

**Force Layout** (For dynamic, non-hierarchical canvases)
```javascript
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(200))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));
```

### SVG Structure

```html
<svg id="canvas-container" width="100%" height="100%">
    <defs>
        <!-- Gradients, patterns, markers -->
    </defs>
    <g id="canvas-viewport">
        <g id="links-group"></g>
        <g id="nodes-group"></g>
    </g>
</svg>
```

### Node Rendering

```javascript
const node = d3.select('#nodes-group')
    .selectAll('.canvas-node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', d => `canvas-node level-${d.depth}`)
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

// Node rectangle
node.append('rect')
    .attr('width', d => getNodeWidth(d))
    .attr('height', d => getNodeHeight(d))
    .attr('rx', 8)
    .style('fill', d => getNodeFill(d))
    .style('stroke', d => getNodeStroke(d));

// Node text
node.append('text')
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .style('font-family', 'var(--canvas-font-primary)')
    .style('font-size', d => getNodeFontSize(d))
    .text(d => d.data.name);
```

---

## Persona-Specific Variations

While maintaining core design system compliance, personas may have subtle variations:

### Personal Canvas
- Focus: Simple, minimal styling
- Root node icon: 👤
- Emphasis: Productivity, organization

### Professional Canvas
- Focus: Advanced features, collaboration
- Root node icon: 💼
- Emphasis: Team sharing, complex projects

### Learner Canvas
- Focus: Educational progression
- Root node icon: 🎓
- Emphasis: Skills, courses, achievements

### Seeker Canvas
- Focus: Job search tracking
- Root node icon: 💼
- Emphasis: Opportunities, applications, interviews

### Coach Canvas
- Focus: Client management
- Root node icon: 🤝
- Emphasis: Sessions, progress tracking, resources

### Success Manager Canvas
- Focus: Portfolio oversight
- Root node icon: 📊
- Emphasis: Metrics, client health, engagement

---

## Testing Checklist

Before deploying canvas implementations:

- [ ] All colors use Cleansheet design system variables
- [ ] Typography uses Questrial (headings) and Barlow Light (body)
- [ ] Hover states respond within 0.2s
- [ ] Active/selected states are clearly visible
- [ ] Collapse/expand animations are smooth
- [ ] Links maintain proper stroke width and color
- [ ] WCAG AA contrast ratios met
- [ ] Keyboard navigation functional
- [ ] Screen reader labels present
- [ ] Mobile responsive (zoom, pan)
- [ ] No console errors
- [ ] Performance acceptable (60fps for <500 nodes)

---

## Version History

- **v1.0** (2025-10-03): Initial creation aligned with Cleansheet Design System

---

**Maintained by**: Cleansheet Development Team
**Last Updated**: 2025-10-03
**Related Documentation**: `DESIGN_GUIDE.md`, `CLAUDE.md`
