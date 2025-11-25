# Extract exampleProfiles object from career-canvas.html (1.5MB reduction)

## Problem
The `exampleProfiles` object in career-canvas.html is consuming 1.5MB (49% of the total 3MB file size), making the file difficult to edit and causing performance issues with development tools.

## Current State
- Location: Lines 24394-52966 in career-canvas.html
- Size: 1,565,098 bytes (1.5MB)
- Content: ~28,500 lines of example profile data
- Impact: Causes Edit tool to hang when processing the file

## Proposed Solution
Extract the `exampleProfiles` object to a separate JavaScript file:

```javascript
// example-profiles.js
window.exampleProfiles = {
    'retail-manager': { ... },
    'research-chemist': { ... },
    'new-graduate': { ... },
    'data-analyst': { ... }
};
```

## Implementation Steps
1. Create new file `example-profiles.js`
2. Move lines 24394-52966 to the new file
3. Wrap in `window.exampleProfiles = { ... }`
4. Add script tag in career-canvas.html: `<script src="example-profiles.js"></script>`
5. Test Quick Start modal functionality

## Expected Benefits
- Reduce career-canvas.html from 3.0MB to 1.5MB (50% reduction)
- Eliminate Edit tool hanging issues for this section
- Make example profiles easier to maintain and update
- Improve page load performance

## Testing Required
- Verify Quick Start modal "Try an Example Profile" functionality
- Test all four example profiles load correctly
- Ensure no JavaScript errors in console
- Confirm file size reduction

## Priority
HIGH - This single change will cut the file size in half and significantly improve developer experience.

## Related Issues
- Follows pattern established with persona-data.js extraction
- Part of larger refactoring effort to modularize career-canvas.html