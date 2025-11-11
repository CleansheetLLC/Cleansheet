# Mobile Testing Matrix for Career Canvas

**Document Version:** 1.0
**Created:** November 10, 2025
**Purpose:** Establish comprehensive testing protocol for mobile viewport implementation
**Status:** Active Testing Framework

---

## Device Testing Matrix

### Primary Test Devices (Required)

| Device | Screen Size | Viewport | OS | Browser | Priority | Status |
|--------|-------------|----------|----|---------|---------:|--------|
| **iPhone SE (3rd gen)** | 375×667 | 375px | iOS 15+ | Safari | P1 | 🔴 Required |
| **iPhone 14** | 390×844 | 390px | iOS 16+ | Safari | P1 | 🔴 Required |
| **Samsung Galaxy S21** | 360×800 | 360px | Android 12+ | Chrome | P1 | 🔴 Required |
| **iPad (9th gen)** | 768×1024 | 768px | iOS 15+ | Safari | P1 | 🔴 Required |
| **iPad Pro 11"** | 834×1194 | 834px | iOS 16+ | Safari | P2 | 🟡 Recommended |

### Secondary Test Devices (Recommended)

| Device | Screen Size | Viewport | OS | Browser | Priority | Notes |
|--------|-------------|----------|----|---------|---------:|-------|
| **iPhone 12 Mini** | 375×812 | 375px | iOS 15+ | Safari | P2 | Edge case: narrow + tall |
| **Pixel 6** | 393×851 | 393px | Android 12+ | Chrome | P2 | Google reference device |
| **Samsung Galaxy A52** | 360×800 | 360px | Android 11+ | Samsung Internet | P3 | Popular mid-range |
| **OnePlus 9** | 412×915 | 412px | Android 11+ | Chrome | P3 | Large Android screen |

### Browser Testing Requirements

| Browser | Platforms | Versions | Touch Target Testing | CSS Support | Priority |
|---------|-----------|----------|---------------------|-------------|----------|
| **Safari** | iOS, macOS | 15.0+ | ✅ Required | Full | P1 |
| **Chrome** | iOS, Android | 95.0+ | ✅ Required | Full | P1 |
| **Firefox** | Android | 95.0+ | ✅ Recommended | Full | P2 |
| **Samsung Internet** | Android | 16.0+ | ✅ Recommended | Good | P2 |
| **Edge** | Android | 95.0+ | ⚠️ Optional | Full | P3 |

---

## Touch Target Testing Protocol

### Manual Testing Checklist

#### Phase 1: Critical Touch Targets
- [ ] **Modal Close Buttons** (24+ instances)
  - [ ] Easy to tap without precision targeting
  - [ ] No accidental taps on surrounding area
  - [ ] Visual feedback on tap (active state)
  - [ ] Minimum 44×44px confirmed with developer tools

- [ ] **Story Card Actions** (30+ instances)
  - [ ] Edit and delete buttons easily distinguishable
  - [ ] Adequate spacing between clustered buttons
  - [ ] No accidental taps between adjacent buttons
  - [ ] Tap feedback immediate and clear

- [ ] **Slideout Close Buttons** (8+ instances)
  - [ ] Can be tapped in portrait and landscape
  - [ ] No interference with scroll gestures
  - [ ] Consistent behavior across all slideouts

#### Phase 2: Form Controls
- [ ] **Checkboxes** (12 instances)
  - [ ] Can be tapped consistently on first attempt
  - [ ] Label text also triggers checkbox (implicit touch area)
  - [ ] Visual state clearly indicates checked/unchecked
  - [ ] Focus ring visible during keyboard navigation

- [ ] **Select Dropdowns** (20+ instances)
  - [ ] Easy to tap and open dropdown
  - [ ] Options easily selectable on mobile
  - [ ] Native mobile controls appear where appropriate
  - [ ] No accidental selections while scrolling

#### Phase 3: Navigation Elements
- [ ] **Tab Navigation** (Tech tabs, Interview tabs)
  - [ ] All tabs reachable and tappable
  - [ ] Horizontal scrolling smooth when tabs overflow
  - [ ] Active tab clearly indicated
  - [ ] Swipe scrolling works without triggering tab selection

- [ ] **Profile Menu Items** (6 items)
  - [ ] Dropdown opens reliably on tap
  - [ ] All menu items easily selectable
  - [ ] No accidental closes when tapping menu items
  - [ ] Proper backdrop dismiss behavior

### Automated Testing Tools

#### Touch Target Validation
```javascript
// Touch Target Size Validator
function validateTouchTargets() {
  const interactiveElements = document.querySelectorAll('button, a, input, select, [role="button"], [tabindex]');
  const violations = [];

  interactiveElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const computedStyle = getComputedStyle(element);

    // Calculate effective touch target including padding
    const totalWidth = rect.width;
    const totalHeight = rect.height;

    if (totalWidth < 44 || totalHeight < 44) {
      violations.push({
        element,
        size: `${Math.round(totalWidth)}×${Math.round(totalHeight)}px`,
        selector: element.tagName.toLowerCase() + (element.id ? `#${element.id}` : '') + (element.className ? `.${element.className.split(' ')[0]}` : ''),
        location: `${Math.round(rect.left)}, ${Math.round(rect.top)}`
      });
    }
  });

  return violations;
}

// Usage: Run in browser console
console.table(validateTouchTargets());
```

#### Accessibility Testing
- [ ] **axe-core DevTools**: Automated WCAG touch target checking
- [ ] **WAVE Browser Extension**: Manual accessibility review
- [ ] **Chrome Lighthouse**: Mobile accessibility score
- [ ] **VoiceOver/TalkBack**: Screen reader navigation testing

---

## Performance Testing Matrix

### Page Load Performance

| Device Category | Target Load Time | Test Connection | Tools | Pass Criteria |
|-----------------|------------------|-----------------|-------|---------------|
| **Budget Android** | < 4 seconds | 3G (1.6Mbps) | Chrome DevTools | First Contentful Paint < 2s |
| **Mid-range Phone** | < 3 seconds | 4G (10Mbps) | WebPageTest | Largest Contentful Paint < 3s |
| **High-end Phone** | < 2 seconds | WiFi (50Mbps) | Lighthouse | Speed Index < 2s |

### Touch Response Performance
- **Target:** < 100ms from tap to visual feedback
- **Test Method:** High-speed video recording at 240fps
- **Pass Criteria:** No perceived delay in button press feedback

### Scroll Performance
- **Target:** 60fps during scroll
- **Test Method:** Chrome DevTools Performance tab
- **Pass Criteria:** No dropped frames during normal scrolling

---

## Responsive Design Testing

### Breakpoint Validation

| Breakpoint | Viewport Range | Key Tests | Expected Behavior |
|-----------|----------------|-----------|-------------------|
| **Mobile Small** | 320px - 374px | Layout integrity, text readability | Single column, touch-optimized |
| **Mobile Standard** | 375px - 479px | Component spacing, navigation | Comfortable touch targets |
| **Mobile Large** | 480px - 767px | Modal sizing, form layouts | Efficient space usage |
| **Tablet** | 768px - 1023px | Grid layouts, sidebar behavior | 2-column where appropriate |
| **Desktop** | 1024px+ | Full feature set | Multi-column, hover states |

### Orientation Testing
- [ ] **Portrait Mode**: Primary layout testing
- [ ] **Landscape Mode**: Alternative layout validation
- [ ] **Orientation Change**: Smooth transition, no layout breaks
- [ ] **Dynamic Height**: Address bar hide/show behavior

---

## User Experience Testing Scenarios

### Critical User Journeys

#### 1. New User Mobile Onboarding
**Scenario**: First-time user completes profile setup on mobile
- [ ] Profile avatar tap works reliably
- [ ] Form fields easy to complete on small screen
- [ ] Required field validation clear and actionable
- [ ] Success states properly communicated

#### 2. Experience Entry
**Scenario**: User adds new work experience on mobile
- [ ] "Add Experience" button easy to find and tap
- [ ] Form modal opens full-screen on mobile
- [ ] All form controls meet touch target requirements
- [ ] Date pickers use native mobile controls
- [ ] Form submission provides clear feedback

#### 3. Content Creation
**Scenario**: User creates story or portfolio item
- [ ] Content type selection clear on mobile
- [ ] Text editor toolbar accessible and usable
- [ ] Save/cancel actions clearly distinguished
- [ ] Auto-save provides user confidence

#### 4. File Management
**Scenario**: User organizes files in Projects view
- [ ] Projects sidebar accessible on mobile
- [ ] File actions (rename, delete, share) easy to access
- [ ] File type recognition clear in mobile layout
- [ ] Bulk operations possible on mobile

#### 5. Interview Preparation
**Scenario**: User prepares for interview on mobile
- [ ] Interview types easy to select
- [ ] Practice questions readable and actionable
- [ ] Timer controls accessible during practice
- [ ] Results and feedback clearly presented

### Usability Success Criteria
- [ ] **Task Completion**: 95% of test scenarios completed successfully
- [ ] **Error Recovery**: Users can recover from mistakes without help
- [ ] **Efficiency**: Mobile tasks take <150% of desktop time
- [ ] **Satisfaction**: Post-test survey rating >4/5
- [ ] **Accessibility**: All interactions possible with screen reader

---

## Test Environment Setup

### Development Testing
```bash
# Local development server with mobile debugging
npm install -g browsersync
browser-sync start --server --files "*.html, *.css, *.js" --port 3000

# Enable remote debugging for mobile devices
# Chrome: chrome://inspect/#devices
# Safari: Develop > [Device Name] > career-canvas.html
```

### Device Emulation Setup
```javascript
// Chrome DevTools Device Emulation
const devicePresets = [
  { name: 'iPhone SE', width: 375, height: 667, dpr: 2 },
  { name: 'iPhone 14', width: 390, height: 844, dpr: 3 },
  { name: 'Galaxy S21', width: 360, height: 800, dpr: 3 },
  { name: 'iPad', width: 768, height: 1024, dpr: 2 }
];

// Test each preset with touch simulation enabled
```

### Real Device Testing Network
- [ ] **BrowserStack**: Cross-platform cloud testing
- [ ] **Device Lab**: Physical device collection
- [ ] **User Testing**: Real user feedback on mobile devices
- [ ] **Internal Team**: Dogfooding with team member devices

---

## Bug Tracking & Reporting

### Issue Categories
| Category | Severity | Response Time | Examples |
|----------|----------|---------------|----------|
| **Touch Target** | High | 24 hours | Button too small to tap reliably |
| **Layout Break** | High | 24 hours | Content overflow, unreadable text |
| **Performance** | Medium | 48 hours | Slow load, janky animations |
| **Enhancement** | Low | 1 week | Convenience improvements |

### Bug Report Template
```markdown
## Mobile Bug Report

**Device**: [iPhone 14, Galaxy S21, etc.]
**Browser**: [Safari, Chrome, etc.]
**Screen Size**: [390×844, 360×800, etc.]
**Issue Category**: [Touch Target, Layout, Performance, etc.]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Screenshots**:
[Include screenshots/video if helpful]

**Touch Target Measurements**:
[Include element size if applicable]
```

---

## Testing Schedule

### Phase 1 Testing (Week 1-2)
- [ ] **Day 1-2**: Touch target audit implementation
- [ ] **Day 3-4**: Critical touch target testing
- [ ] **Day 5**: Device matrix validation - Priority 1 devices
- [ ] **Week 2**: Bug fixing and re-testing

### Phase 2 Testing (Week 3-4)
- [ ] **Day 1-2**: Breakpoint implementation testing
- [ ] **Day 3-4**: Modal and form testing
- [ ] **Day 5**: User journey testing
- [ ] **Week 2**: Performance validation

### Phase 3 Testing (Week 5-6)
- [ ] **Day 1-2**: Advanced UX pattern testing
- [ ] **Day 3-4**: Cross-browser validation
- [ ] **Day 5**: Final accessibility audit
- [ ] **Week 2**: User acceptance testing

---

## Success Metrics

### Quantitative Targets
- [ ] **Touch Target Compliance**: 100% of interactive elements ≥44×44px
- [ ] **Performance**: <3s load time on 3G
- [ ] **Accessibility**: Lighthouse mobile score >90
- [ ] **Browser Compatibility**: 95% functionality across test matrix
- [ ] **Error Rate**: <5% failed touch attempts

### Qualitative Targets
- [ ] **Usability**: Users complete tasks without frustration
- [ ] **Accessibility**: Full screen reader compatibility
- [ ] **Consistency**: Behavior matches user expectations
- [ ] **Responsiveness**: Smooth interactions across all devices
- [ ] **Visual Polish**: Professional appearance on all screens

---

## Tools and Resources

### Browser Developer Tools
- **Chrome DevTools**: Device simulation, performance profiling
- **Safari Web Inspector**: iOS-specific debugging
- **Firefox Developer Tools**: Responsive design mode

### Testing Extensions
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Visual accessibility feedback
- **Lighthouse**: Performance and accessibility auditing
- **Color Oracle**: Color blindness simulation

### Hardware Tools
- **Ruler/Measuring Tool**: Physical touch target verification
- **High-speed Camera**: Touch response timing
- **Color Meter**: Contrast ratio validation

---

## Implementation Notes

This testing matrix should be executed alongside each phase of mobile viewport implementation:

1. **Before Implementation**: Establish baseline measurements
2. **During Implementation**: Continuous testing of changed components
3. **After Implementation**: Full validation against success criteria

The matrix prioritizes real device testing over emulation where possible, as touch behavior can differ significantly between simulated and actual hardware.

**Next Steps:**
1. Acquire Priority 1 test devices
2. Set up development environment with remote debugging
3. Implement touch target audit findings
4. Begin systematic testing following this matrix

---

*This testing matrix will be updated as implementation progresses and new mobile requirements are identified.*