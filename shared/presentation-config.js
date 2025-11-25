/**
 * Presentation Configuration - Extracted from career-canvas.html
 *
 * Contains:
 * - Font families for Reveal.js presentations
 * - Slide templates with Markdown content
 * - Template content accessor utility
 *
 * Used by: career-canvas.html (Presentation Builder)
 */

// ============================================
// Presentation Fonts
// ============================================

const PRESENTATION_FONTS = [
    { name: 'Barlow', value: 'Barlow, sans-serif' },
    { name: 'Questrial', value: 'Questrial, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { name: 'Palatino', value: 'Palatino, serif' }
];

// ============================================
// Slide Templates
// ============================================

const SLIDE_TEMPLATES = {
    title: {
        name: 'Title Slide',
        icon: 'ph-text-aa',
        content: `# Presentation Title
## Subtitle or Tagline

Your Name | Date`
    },
    content: {
        name: 'Content',
        icon: 'ph-list-bullets',
        content: `## Slide Title

- Key point 1
- Key point 2
- Key point 3

<!-- .element: class="fragment" -->
- Animated point`
    },
    twoColumn: {
        name: 'Two Column',
        icon: 'ph-columns',
        content: `## Two Column Layout

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
<div>

### Left Column
- Point 1
- Point 2

</div>
<div>

### Right Column
- Point A
- Point B

</div>
</div>`
    },
    imageText: {
        name: 'Image + Text',
        icon: 'ph-image',
        content: `## Title

<div style="display: flex; align-items: center; gap: 30px;">
<div style="flex: 1;">

- Key point 1
- Key point 2
- Key point 3

</div>
<div style="flex: 1;">

![Image Description](https://via.placeholder.com/400x300)

</div>
</div>`
    },
    quote: {
        name: 'Quote',
        icon: 'ph-quotes',
        content: `> "Insert your inspirational quote here"

— Author Name`
    },
    code: {
        name: 'Code',
        icon: 'ph-code',
        content: `## Code Example

\`\`\`javascript
function example() {
    console.log('Hello, World!');
    return true;
}
\`\`\`

Explanation of the code`
    },
    section: {
        name: 'Section Break',
        icon: 'ph-text-t',
        content: `# Section Title

---

Next Topic`
    },
    blank: {
        name: 'Blank',
        icon: 'ph-note-blank',
        content: `## New Slide

Start typing...`
    }
};

// ============================================
// Template Utilities
// ============================================

/**
 * Get template content by key
 * @param {string} templateKey - Template key (title, content, twoColumn, etc.)
 * @returns {string} Template Markdown content
 */
function getTemplateContent(templateKey) {
    return SLIDE_TEMPLATES[templateKey]?.content || SLIDE_TEMPLATES.blank.content;
}
