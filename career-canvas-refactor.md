# Career Canvas Refactoring Plan

## Current Status: In Progress (Phase 3 Complete)

### Accomplishments (November 24, 2025)
✅ **Phase 1**: CSS extracted into 12 organized files
✅ **Phase 2**: Persona data extracted to separate JS files
✅ **Phase 3**: Core modules created with module loader
✅ Created lean base HTML (reduced from 55,459 to ~200 lines)
✅ Set up modular architecture with lazy loading capability
✅ Created test page for verification

### Files Created
- **14 CSS files** in `career-canvas/css/`
- **4 core JS modules** in `career-canvas/js/core/`
- **1 vendor JS file** in `career-canvas/js/vendor/`
- **4 persona data files** in `career-canvas/data/personas/`
- **1 lean HTML file** in `career-canvas/index.html`
- **1 test page** in `career-canvas-test.html`

### Immediate Benefits
- Editor no longer hangs when opening files
- Can edit CSS independently without loading 3MB file
- Module system enables incremental development
- Clear separation of concerns established

## Overview
The `career-canvas.html` file has grown to 55,459 lines (3.0MB), causing significant editor performance issues and maintenance challenges. This document tracks the refactoring effort to break this monolithic file into a modular, maintainable architecture.

## Problem Statement
- **File Size**: 3.0MB monolithic HTML file with 55,459 lines
- **Editor Issues**: Hanging and performance problems when editing
- **Maintainability**: Difficult to navigate, understand, and modify
- **Duplication**: Multiple embedded templates and repeated code patterns
- **Testing**: Cannot unit test individual components
- **Performance**: 3MB initial load vs. potential 26KB critical path

## Architecture Analysis

### Current Structure Breakdown
```
career-canvas.html (55,459 lines total)
├── Head Section (~100 lines)
│   ├── Meta tags and PWA configuration
│   ├── 15+ external script dependencies
│   └── 10+ stylesheet links
├── Inline LaTeX Parser (1,528 lines)
│   └── Complete LaTeX math rendering system
├── CSS Styles (5,944 lines)
│   ├── Base styles and CSS variables (500 lines)
│   ├── Component styles (2,000+ lines)
│   ├── Responsive styles (500 lines)
│   ├── Animation/transitions (300 lines)
│   └── Feature-specific styles (2,644 lines)
├── HTML Structure (187 lines)
│   └── Container divs and modal templates
└── JavaScript (47,800 lines)
    ├── ~998 functions total
    ├── Multiple embedded data structures
    └── Inline event handlers throughout
```

### Identified Modules (998 functions organized into logical groups)

#### 1. **Authentication & Sync Module** (~50 functions)
- MSAL authentication
- Azure blob sync operations
- Session management
- User profile operations

#### 2. **Profile & Data Management** (~30 functions)
- Canvas data CRUD operations
- LocalStorage management
- Import/export functionality
- Data validation

#### 3. **LLM Integration Module** (~80 functions)
- OpenAI integration
- Anthropic integration
- Gemini integration
- Prompt templates and management
- Token counting and optimization
- Response streaming

#### 4. **Document Editors Module** (~80 functions)
- Quill editor integration
- Document save/load
- Export to DOCX/PDF
- Version management
- Collaborative features

#### 5. **Diagram & Whiteboard Module** (~85 functions)
- Draw.io integration
- Excalidraw integration
- Diagram CRUD operations
- Export/import diagrams
- Real-time collaboration

#### 6. **D3 Visualizations Module** (~70 functions)
- Canvas tree visualization
- Network diagrams
- Timeline visualizations
- Interactive tooltips
- Zoom/pan controls

#### 7. **Portfolio Management** (~100 functions)
- Project CRUD
- Asset management
- Skill tracking
- Achievement system
- Export portfolio

#### 8. **Job Tracking Module** (~60 functions)
- Job application CRUD
- Status tracking
- Interview scheduling
- Document generation
- Analytics

#### 9. **Backup & Restore Module** (~50 functions)
- Data encryption/decryption
- Backup generation
- Restore operations
- Version compatibility
- Cloud sync

#### 10. **UI State Management** (~80 functions)
- Modal management
- Tab navigation
- Slideout panels
- Toast notifications
- Loading states

#### 11. **Utility Functions** (~40 functions)
- Date formatting
- String manipulation
- Validation helpers
- Debug utilities
- Performance monitoring

#### 12. **Event Handlers** (~100+ functions)
- Click handlers
- Input handlers
- Drag/drop handlers
- Keyboard shortcuts
- Window events

#### 13. **API Communication** (~30 functions)
- REST API calls
- WebSocket connections
- Error handling
- Retry logic
- Response processing

#### 14. **Analytics & Metrics** (~20 functions)
- Usage tracking
- Performance metrics
- Error logging
- Feature usage
- User behavior

#### 15. **Chat & AI Features** (~50 functions)
- Chat interface
- Message management
- Context handling
- Suggestions
- Auto-completion

### Embedded Data Structures

1. **Example Personas** (4 complete profiles, ~2000 lines each)
   - Retail Manager
   - Research Chemist
   - New Graduate
   - Data Analyst

2. **Prompt Templates** (~100 templates)
   - Career guidance
   - Resume writing
   - Interview preparation
   - Skill assessment

3. **UI Templates** (20+ HTML templates)
   - Modals
   - Cards
   - Forms
   - Tooltips

## Proposed New Architecture

### File Structure
```
career-canvas/
├── index.html (26KB - lean HTML with critical CSS)
├── css/
│   ├── career-canvas-base.css (CSS variables, reset)
│   ├── career-canvas-layout.css (grid, flexbox)
│   ├── career-canvas-components.css (buttons, cards, forms)
│   ├── career-canvas-modals.css (modal styles)
│   ├── career-canvas-d3.css (visualization styles)
│   ├── career-canvas-editors.css (editor-specific)
│   ├── career-canvas-responsive.css (media queries)
│   ├── career-canvas-animations.css (transitions)
│   ├── career-canvas-themes.css (dark/light themes)
│   ├── career-canvas-print.css (print styles)
│   ├── career-canvas-utilities.css (utility classes)
│   └── career-canvas-legacy.css (backward compatibility)
├── js/
│   ├── core/
│   │   ├── career-canvas-init.js (initialization)
│   │   ├── career-canvas-config.js (configuration)
│   │   ├── career-canvas-utils.js (utilities)
│   │   ├── career-canvas-events.js (event bus)
│   │   └── career-canvas-state.js (state management)
│   ├── auth/
│   │   ├── career-canvas-auth.js (authentication)
│   │   ├── career-canvas-session.js (session management)
│   │   └── career-canvas-sync.js (cloud sync)
│   ├── data/
│   │   ├── career-canvas-storage.js (localStorage wrapper)
│   │   ├── career-canvas-api.js (API communication)
│   │   ├── career-canvas-backup.js (backup/restore)
│   │   └── career-canvas-migration.js (data migration)
│   ├── ui/
│   │   ├── career-canvas-modals.js (modal management)
│   │   ├── career-canvas-navigation.js (nav & tabs)
│   │   ├── career-canvas-slideouts.js (slideout panels)
│   │   ├── career-canvas-notifications.js (toasts/alerts)
│   │   └── career-canvas-forms.js (form handling)
│   ├── features/
│   │   ├── career-canvas-profile.js (profile management)
│   │   ├── career-canvas-portfolio.js (portfolio features)
│   │   ├── career-canvas-jobs.js (job tracking)
│   │   ├── career-canvas-skills.js (skill management)
│   │   ├── career-canvas-achievements.js (achievements)
│   │   └── career-canvas-analytics.js (analytics)
│   ├── editors/
│   │   ├── career-canvas-documents.js (document editor)
│   │   ├── career-canvas-diagrams.js (diagram editor)
│   │   ├── career-canvas-whiteboard.js (whiteboard)
│   │   └── career-canvas-presentations.js (presentations)
│   ├── visualizations/
│   │   ├── career-canvas-tree.js (D3 tree)
│   │   ├── career-canvas-network.js (network diagram)
│   │   ├── career-canvas-timeline.js (timeline)
│   │   └── career-canvas-charts.js (charts)
│   ├── llm/
│   │   ├── career-canvas-llm-core.js (LLM base)
│   │   ├── career-canvas-openai.js (OpenAI provider)
│   │   ├── career-canvas-anthropic.js (Anthropic provider)
│   │   ├── career-canvas-gemini.js (Gemini provider)
│   │   ├── career-canvas-prompts.js (prompt management)
│   │   └── career-canvas-chat.js (chat interface)
│   └── vendor/
│       └── latex-parser.js (extracted LaTeX parser)
├── data/
│   ├── personas/
│   │   ├── retail-manager.json
│   │   ├── research-chemist.json
│   │   ├── new-graduate.json
│   │   └── data-analyst.json
│   ├── templates/
│   │   ├── prompt-templates.json
│   │   └── ui-templates.json
│   └── config/
│       ├── default-settings.json
│       └── feature-flags.json
└── templates/
    ├── modal-templates.html
    ├── card-templates.html
    ├── form-templates.html
    └── widget-templates.html
```

## Migration Strategy

### Phase 1: CSS Extraction (Week 1)
- [ ] Extract all CSS into separate stylesheets
- [ ] Organize by component/feature
- [ ] Add CSS bundling to build process
- [ ] Test visual regression
- [ ] Update index.html with new stylesheet links

### Phase 2: Data & Configuration (Week 2)
- [ ] Extract all persona JSON data to separate files
- [ ] Move prompt templates to JSON files
- [ ] Extract configuration constants
- [ ] Create data loading utilities
- [ ] Test data loading and caching

### Phase 3: Utility Functions (Week 2-3)
- [ ] Extract utility functions to career-canvas-utils.js
- [ ] Create event bus system for decoupling
- [ ] Extract state management functions
- [ ] Add unit tests for utilities
- [ ] Document utility APIs

### Phase 4: Core Modules (Week 3-4)
- [ ] Extract initialization and configuration
- [ ] Move authentication/sync to separate module
- [ ] Extract storage/API layer
- [ ] Create module loader system
- [ ] Test core functionality

### Phase 5: UI Components (Week 4-5)
- [ ] Extract modal management
- [ ] Move navigation/tabs to separate module
- [ ] Extract slideout panel logic
- [ ] Move notification system
- [ ] Extract form handling
- [ ] Test all UI interactions

### Phase 6: Feature Modules (Week 5-7)
- [ ] Extract profile management features
- [ ] Move portfolio functionality
- [ ] Extract job tracking features
- [ ] Move skill management
- [ ] Extract achievement system
- [ ] Test each feature module

### Phase 7: Editor Modules (Week 7-8)
- [ ] Extract document editor integration
- [ ] Move diagram editor functionality
- [ ] Extract whiteboard features
- [ ] Move presentation features
- [ ] Test all editor functionality

### Phase 8: Visualization Modules (Week 8-9)
- [ ] Extract D3 tree visualization
- [ ] Move network diagram logic
- [ ] Extract timeline features
- [ ] Move chart functionality
- [ ] Test all visualizations

### Phase 9: LLM Integration (Week 9)
- [ ] Extract LLM core functionality
- [ ] Move provider-specific implementations
- [ ] Extract prompt management
- [ ] Move chat interface
- [ ] Test all LLM features

### Phase 10: Testing & Optimization (Week 10)
- [ ] Comprehensive integration testing
- [ ] Performance testing and optimization
- [ ] Bundle optimization
- [ ] Documentation updates
- [ ] Deployment preparation

## Implementation Guidelines

### Module Pattern
```javascript
// Each module should follow this pattern
(function(window) {
    'use strict';

    // Module namespace
    const CareerCanvasModule = {
        // Public API
        init: function(config) { },
        destroy: function() { },
        // ... other public methods
    };

    // Private implementation
    function privateFunction() { }

    // Event handlers
    function handleEvent() { }

    // Export to global namespace
    window.CareerCanvasModule = CareerCanvasModule;

})(window);
```

### Event-Driven Architecture
```javascript
// Use custom events for module communication
document.addEventListener('career-canvas:profile-updated', (event) => {
    // Handle profile update
});

// Trigger events
document.dispatchEvent(new CustomEvent('career-canvas:profile-updated', {
    detail: { profileData }
}));
```

### Lazy Loading
```javascript
// Load modules on demand
async function loadModule(moduleName) {
    const module = await import(`./js/features/${moduleName}.js`);
    return module.default;
}

// Usage
const portfolioModule = await loadModule('career-canvas-portfolio');
portfolioModule.init();
```

## Performance Targets

### Current Performance
- Initial load: 3.0MB
- Time to interactive: ~1.2s
- Memory usage: ~150MB
- Editor lag: Significant

### Target Performance
- Critical path: 26KB (HTML + critical CSS)
- Time to interactive: <300ms
- Memory usage: <50MB initially
- Editor performance: Instant
- Lazy-loaded modules: Load in <100ms each

## Risk Mitigation

### Backward Compatibility
- [ ] Maintain localStorage key structure
- [ ] Support data migration from old format
- [ ] Keep URL structure unchanged
- [ ] Preserve all existing functionality

### Testing Strategy
- [ ] Unit tests for each module
- [ ] Integration tests for module interactions
- [ ] Visual regression testing for UI
- [ ] Performance testing at each phase
- [ ] User acceptance testing

### Rollback Plan
- [ ] Keep original file as career-canvas-legacy.html
- [ ] Feature flag for gradual rollout
- [ ] A/B testing capability
- [ ] Quick switch mechanism

## Success Metrics

### Technical Metrics
- [ ] Page load time reduced by 75%
- [ ] Editor performance issues eliminated
- [ ] Memory usage reduced by 66%
- [ ] Code coverage >80%
- [ ] Zero functionality regression

### Developer Experience
- [ ] Find any function in <5 seconds
- [ ] Make changes without lag
- [ ] Run unit tests in <10 seconds
- [ ] Deploy changes in <1 minute
- [ ] Clear documentation for each module

## Dependencies & Blockers

### External Dependencies
- D3.js v7 (tree visualization)
- Quill.js (document editor)
- Draw.io (diagram editor)
- Excalidraw (whiteboard)
- MSAL (authentication)
- Various LLM provider SDKs

### Internal Dependencies
- shared/cleansheet-core.js
- shared/cleansheet-auth-msal.js
- shared/cleansheet-sync.js
- shared/llm-providers.js
- persona-data.js
- example-profiles.js

### Potential Blockers
- [ ] Azure blob sync integration complexity
- [ ] LLM provider API changes
- [ ] Browser compatibility issues
- [ ] Performance on mobile devices
- [ ] Data migration complexity

## Next Steps

1. **Review and approve** this refactoring plan
2. **Set up development branch** for refactoring work
3. **Create test suite** for current functionality
4. **Begin Phase 1** with CSS extraction
5. **Set up CI/CD** for automated testing

## Notes

### Lessons Learned from Analysis
- Monolithic growth happened gradually over time
- Lack of module boundaries led to coupling
- Inline everything approach hurt maintainability
- Missing build process prevented optimization
- No clear separation of concerns

### Best Practices to Implement
- Strict module boundaries
- Event-driven communication
- Lazy loading for performance
- Clear naming conventions
- Comprehensive documentation
- Automated testing
- Performance budgets
- Regular refactoring cycles

## Tracking Progress

### Phase 1: CSS Extraction
- [x] Started: November 24, 2025
- [x] Completed: November 24, 2025
- [x] Issues: None
- [x] Notes: Successfully extracted 5,944 lines of CSS into 12 organized files

### Phase 2: Data & Configuration
- [x] Started: November 24, 2025
- [x] Completed: November 24, 2025
- [x] Issues: None
- [x] Notes: Extracted 4 persona profiles to separate JS files

### Phase 3: Utility Functions
- [x] Started: November 24, 2025
- [x] Completed: November 24, 2025
- [x] Issues: None
- [x] Notes: Created core modules (init, config, utils, state) with module loader

### Phase 4: Core Modules
- [ ] Started:
- [ ] Completed:
- [ ] Issues:
- [ ] Notes:

### Phase 5: UI Components
- [ ] Started:
- [ ] Completed:
- [ ] Issues:
- [ ] Notes:

### Phase 6: Feature Modules
- [ ] Started:
- [ ] Completed:
- [ ] Issues:
- [ ] Notes:

### Phase 7: Editor Modules
- [ ] Started:
- [ ] Completed:
- [ ] Issues:
- [ ] Notes:

### Phase 8: Visualization Modules
- [ ] Started:
- [ ] Completed:
- [ ] Issues:
- [ ] Notes:

### Phase 9: LLM Integration
- [ ] Started:
- [ ] Completed:
- [ ] Issues:
- [ ] Notes:

### Phase 10: Testing & Optimization
- [ ] Started:
- [ ] Completed:
- [ ] Issues:
- [ ] Notes:

---

**Created**: November 24, 2025
**Last Updated**: November 24, 2025
**Status**: Planning Phase
**Owner**: Cleansheet Development Team