# Refactor career-canvas.html architecture for maintainability

## Problem
The career-canvas.html file has grown to 3MB with 55,000+ lines, causing severe development issues:
- Edit tools hang when processing the file
- No separation of concerns (HTML, CSS, JS mixed)
- Duplicate code and function definitions
- Impossible to maintain or debug effectively
- Poor performance due to monolithic structure

## Current State
```
career-canvas.html (3.0MB, 55,456 lines)
├── HTML structure (~200KB)
├── CSS styles (~400KB, 13%)
├── exampleProfiles object (~1.5MB, 49%)
├── JavaScript functions (~1MB, 33%)
└── Tour steps and other data (~150KB, 5%)
```

## Proposed Architecture
```
career-canvas.html (~200KB)
├── career-canvas.css (~400KB)
├── persona-data.js (4KB) ✓ [Already extracted]
├── example-profiles.js (~1.5MB)
├── career-canvas-core.js (~250KB)
├── career-canvas-d3.js (~200KB)
├── career-canvas-modals.js (~300KB)
├── career-canvas-data.js (~250KB)
└── career-canvas-tour.js (~100KB)
```

## Implementation Phases

### Phase 1: Data Extraction ✓ (Partially Complete)
- [x] Extract personaData → persona-data.js
- [ ] Extract exampleProfiles → example-profiles.js (Issue #1)
- [ ] Extract tourSteps → career-canvas-tour.js

### Phase 2: Style Extraction
- [ ] Extract all CSS → career-canvas.css (Issue #2)
- [ ] Organize styles by component
- [ ] Add CSS minification for production

### Phase 3: JavaScript Modularization
- [ ] Categorize 1,075 functions (Issue #3)
- [ ] Create module structure
- [ ] Extract to separate files
- [ ] Implement module loader

### Phase 4: Build Process
- [ ] Add build script to concatenate files for production
- [ ] Implement minification
- [ ] Add source maps for debugging
- [ ] Consider webpack or rollup integration

### Phase 5: Cleanup and Optimization
- [ ] Remove duplicate functions
- [ ] Consolidate event listeners
- [ ] Optimize data structures
- [ ] Add lazy loading for non-critical components

## Success Criteria
- [ ] Main HTML file under 500KB
- [ ] No Edit tool hanging issues
- [ ] Improved page load time (<2 seconds)
- [ ] Modular, maintainable code structure
- [ ] All existing functionality preserved
- [ ] No console errors or warnings

## Benefits
1. **Developer Experience**
   - Files can be edited without tools hanging
   - Clear separation of concerns
   - Easier debugging and testing
   - Better code organization

2. **Performance**
   - Browser can cache CSS and JS separately
   - Potential for lazy loading
   - Reduced initial parse time
   - Better memory usage

3. **Maintainability**
   - Modular updates without touching other components
   - Easier to add new features
   - Version control becomes meaningful
   - Code review becomes possible

## Migration Strategy
1. Create new file structure alongside existing
2. Test each extraction thoroughly
3. Implement feature flags for gradual rollout
4. Maintain backward compatibility
5. Document all changes

## Testing Requirements
- Full regression testing after each phase
- Performance benchmarking
- Cross-browser compatibility
- Mobile responsiveness
- Memory usage profiling

## Timeline Estimate
- Phase 1: 2 days (mostly complete)
- Phase 2: 1 day
- Phase 3: 3-4 days (most complex)
- Phase 4: 1-2 days
- Phase 5: 2 days
- Testing: Ongoing

## Priority
CRITICAL - The current file structure is blocking development velocity and causing significant developer friction.

## Dependencies
- Requires all sub-issues to be completed
- May need build tooling setup
- Testing framework might be beneficial

## Long-term Considerations
- Consider migrating to a framework (React/Vue/Angular)
- Implement TypeScript for better type safety
- Add automated testing
- Consider server-side rendering for performance

## Related Issues
- #1 Extract exampleProfiles object
- #2 Extract CSS styles
- #3 Extract JavaScript functions
- Originated from: Edit tool hanging investigation