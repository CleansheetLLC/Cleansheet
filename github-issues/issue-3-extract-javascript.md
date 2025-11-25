# Extract JavaScript functions from career-canvas.html (1MB reduction)

## Problem
Over 1,000 JavaScript functions in career-canvas.html are consuming ~1MB (33% of the total 3MB file size), creating a monolithic file that's difficult to maintain and debug.

## Current State
- Function count: 1,075 function definitions
- Size: ~1MB of JavaScript code
- Location: Embedded in `<script>` tags throughout the file
- Issues: No code organization, difficult debugging, no code reuse

## Proposed Solution
Extract JavaScript to modular files:

```html
<!-- In career-canvas.html -->
<script src="career-canvas-core.js"></script>
<script src="career-canvas-d3.js"></script>
<script src="career-canvas-modals.js"></script>
<script src="career-canvas-data.js"></script>
```

## Implementation Steps
1. Analyze and categorize functions by purpose
2. Create modular JavaScript files:
   - `career-canvas-core.js` - Initialization, utilities, event handlers
   - `career-canvas-d3.js` - D3 visualization and mindmap functions
   - `career-canvas-modals.js` - Modal and slideout management
   - `career-canvas-data.js` - Data operations, CRUD functions
3. Handle dependencies between modules
4. Implement proper module pattern or ES6 modules
5. Remove inline `<script>` blocks from HTML
6. Test all interactive functionality

## Function Categories (Preliminary Analysis)
```javascript
// career-canvas-core.js (~250 functions)
- Initialization functions
- Utility functions (debounce, formatDate, etc.)
- Event listeners and handlers
- View mode management

// career-canvas-d3.js (~200 functions)
- D3 tree visualization
- Node manipulation
- Zoom and pan controls
- Badge updates

// career-canvas-modals.js (~300 functions)
- Modal show/hide
- Slideout panels
- Quick Start modal
- Tour functionality
- Form handlers

// career-canvas-data.js (~325 functions)
- CRUD operations
- LocalStorage management
- Data validation
- Import/export functions
```

## Module Structure Example
```javascript
// career-canvas-core.js
const CanvasCore = (function() {
    'use strict';

    // Private variables
    let currentPersona = 'default';

    // Public API
    return {
        init: function() { },
        setPersona: function(persona) { },
        getPersona: function() { }
    };
})();

// Or using ES6 modules
export class CanvasCore {
    constructor() { }
    init() { }
}
```

## Expected Benefits
- Reduce career-canvas.html by ~1MB (33% reduction)
- Enable code organization and reuse
- Improve debugging with proper stack traces
- Allow for unit testing
- Enable JavaScript minification
- Potential for lazy loading non-critical functions

## Testing Required
- All interactive features must work as before
- Check for broken event listeners
- Verify proper function scope and closures
- Test initialization order dependencies
- Browser compatibility testing

## Challenges
- Function interdependencies need mapping
- Global variable usage needs refactoring
- Event listener attachment timing
- Maintaining backward compatibility

## Priority
MEDIUM-HIGH - Major file size reduction and significantly improved maintainability.

## Related Issues
- Depends on: exampleProfiles extraction (some functions reference it)
- Part of career-canvas.html modularization effort