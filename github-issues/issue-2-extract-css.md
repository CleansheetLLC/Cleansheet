# Extract CSS styles from career-canvas.html (400KB reduction)

## Problem
Multiple CSS style blocks in career-canvas.html are consuming ~400KB (13% of the total 3MB file size), mixing presentation with structure and making the file harder to maintain.

## Current State
- Multiple `<style>` blocks scattered throughout the file
- First major block: Lines 1662-9764 (~8,100 lines)
- Additional style blocks at lines 31382, 31523, 31658, and others
- Total CSS: ~400KB across multiple blocks
- Impact: Makes style updates difficult and contributes to file size issues

## Proposed Solution
Extract all CSS to a dedicated stylesheet:

```html
<!-- In career-canvas.html <head> -->
<link rel="stylesheet" href="career-canvas.css">
```

## Implementation Steps
1. Create new file `career-canvas.css`
2. Extract all content from `<style>` tags
3. Consolidate and deduplicate CSS rules
4. Remove redundant styles
5. Organize CSS into logical sections:
   - Base styles and resets
   - Layout and grid systems
   - Component styles (modals, cards, buttons)
   - D3 visualization styles
   - Media queries
6. Replace all `<style>` blocks with single stylesheet link
7. Test all visual components

## Expected Benefits
- Reduce career-canvas.html by ~400KB (13% reduction)
- Separate concerns (structure vs presentation)
- Enable CSS caching by browser
- Easier style maintenance and updates
- Potential for CSS minification in production

## CSS Organization Structure
```css
/* career-canvas.css */

/* 1. Base Styles */
:root { /* CSS Variables */ }

/* 2. Layout */
.canvas-container { }
.canvas-grid { }

/* 3. Components */
.modal { }
.card { }
.slideout { }

/* 4. D3 Visualization */
.node { }
.link { }

/* 5. Media Queries */
@media (max-width: 768px) { }
```

## Testing Required
- Visual regression testing of all components
- Mobile responsive design verification
- D3 visualization styling
- Modal and slideout animations
- Print styles if applicable

## Priority
MEDIUM - Significant file size reduction and improved maintainability.

## Related Issues
- Part of career-canvas.html modularization effort
- Depends on: None
- Blocks: None