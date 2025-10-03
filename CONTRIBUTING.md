# Contributing to Cleansheet Platform

Thank you for your interest in contributing to Cleansheet! We welcome contributions from the community while maintaining our proprietary licensing model.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Contribution Workflow](#contribution-workflow)
5. [Code Standards](#code-standards)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Bugs](#reporting-bugs)
8. [Suggesting Enhancements](#suggesting-enhancements)
9. [License Agreement](#license-agreement)

---

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports:
- **Check existing issues** to avoid duplicates
- **Use the latest version** to confirm the bug still exists
- **Collect information** about your environment

When creating a bug report, include:
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS version
- Console errors (if applicable)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues:
- Use a clear, descriptive title
- Provide detailed description of the proposed feature
- Explain why this enhancement would be useful
- Include mockups or examples (if applicable)

### Code Contributions

We accept contributions for:
- Bug fixes
- Performance improvements
- Documentation improvements
- Accessibility enhancements
- New features (after discussion)
- Test coverage improvements

---

## Development Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.8+ (for corpus generation)
- Git
- Text editor or IDE (VS Code recommended)

### Local Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/Cleansheet.git
   cd Cleansheet
   ```

2. **Set up upstream remote**
   ```bash
   git remote add upstream https://github.com/CleansheetLLC/Cleansheet.git
   ```

3. **Open in browser**
   ```bash
   # Open index.html directly in your browser
   open index.html  # macOS
   start index.html # Windows
   ```

4. **Generate corpus (if needed)**
   ```bash
   python generate_corpus_index.py
   ```

---

## Contribution Workflow

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes

### 2. Make Your Changes

- Follow code standards in [`DESIGN_GUIDE.md`](DESIGN_GUIDE.md)
- Test across supported browsers
- Verify mobile responsiveness
- Update documentation as needed

### 3. Commit Your Changes

```bash
git add .
git commit -m "Brief description of changes"
```

Commit message format:
```
[component] Brief description

Longer explanation if needed (optional)

- Bullet points for specific changes
- Reference issues: Fixes #123
```

Examples:
- `[design] Update color palette to Corporate Professional`
- `[fix] Resolve mobile navigation collapse issue`
- `[docs] Add asset usage guidelines to DESIGN_GUIDE`

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Open a Pull Request

- Go to your fork on GitHub
- Click "Compare & pull request"
- Fill out the PR template
- Link related issues
- Request review

---

## Code Standards

### Design System Compliance

All contributions must adhere to the design system defined in [`DESIGN_GUIDE.md`](DESIGN_GUIDE.md):

**Required:**
1. Use CSS custom properties (`:root` variables)
2. Follow Corporate Professional color palette
3. Use Questrial (headings) and Barlow Light (body)
4. Implement mobile-first responsive design (breakpoint: 768px)
5. Include proper accessibility attributes (WCAG 2.1 AA)
6. Use lowercase-with-dashes for file/asset names

### HTML Standards

```html
<!-- Semantic HTML5 -->
<header>, <main>, <section>, <footer>, <nav>, <article>

<!-- Proper heading hierarchy -->
<h1> → <h2> → <h3> (never skip levels)

<!-- Alt text on all images -->
<img src="..." alt="Descriptive text">

<!-- Required meta tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### CSS Standards

```css
/* Use CSS variables */
:root {
    --color-primary-blue: #0066CC;
    --font-family-ui: 'Questrial', sans-serif;
}

/* Mobile-first media queries */
.element { /* mobile styles */ }

@media (min-width: 768px) {
    .element { /* desktop styles */ }
}

/* BEM-like naming */
.feature-card { }
.feature-card__title { }
.feature-card--active { }
```

### JavaScript Standards

```javascript
// Vanilla JS preferred
document.querySelector('.element');

// Event delegation for dynamic content
document.addEventListener('click', (e) => {
    if (e.target.matches('.dynamic-element')) {
        // Handle click
    }
});

// Error handling
try {
    // Code that might fail
} catch (error) {
    console.error('Error:', error);
}

// Use camelCase for variables/functions
const myVariable = 'value';
function myFunction() { }
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines in `DESIGN_GUIDE.md`
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if applicable)
- [ ] No console warnings or errors
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile (responsive)
- [ ] Accessibility verified (keyboard navigation, screen readers)
- [ ] No breaking changes (or discussed with maintainers)

### PR Description Template

```markdown
## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Related Issues
Fixes #123, Relates to #456

## How Has This Been Tested?
- Browser: Chrome 120, Firefox 119, Safari 17
- Devices: Desktop (1920x1080), Mobile (375x667)
- Test cases: ...

## Screenshots (if applicable)
Before/After images or GIFs

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested across browsers
- [ ] Mobile responsive
```

### Review Process

1. **Automated checks** (if configured) must pass
2. **Code review** by at least one maintainer
3. **Approval** from maintainer required
4. **Merge** by maintainers only

### After Your PR is Merged

- Delete your feature branch
- Update your fork's main branch
- Celebrate! 🎉

```bash
git checkout main
git pull upstream main
git push origin main
git branch -d feature/your-feature-name
```

---

## Reporting Bugs

### Security Vulnerabilities

**DO NOT** open a public issue for security vulnerabilities.

Instead, email: **security@cleansheet.dev**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Regular Bugs

Use GitHub Issues with the following information:

**Bug Report Template:**
```markdown
## Bug Description
Clear description of what the bug is

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11, macOS 14]
- Browser: [e.g., Chrome 120, Safari 17]
- Device: [e.g., Desktop, iPhone 14]
- Screen size: [e.g., 1920x1080, 375x667]

## Screenshots
If applicable

## Console Errors
If applicable

## Additional Context
Any other relevant information
```

---

## Suggesting Enhancements

Enhancement suggestions are welcome! Use GitHub Issues:

**Enhancement Template:**
```markdown
## Feature Description
Clear description of the proposed feature

## Problem It Solves
What problem does this address?

## Proposed Solution
How should this work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, or references

## Impact
- User benefit: ...
- Technical complexity: Low/Medium/High
- Breaking changes: Yes/No
```

---

## License Agreement

**Important:** By contributing to this repository, you agree that:

1. Your contributions will become part of the proprietary Cleansheet platform
2. You grant Cleansheet LLC a perpetual, worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your contributions
3. You retain copyright to your contributions but grant Cleansheet LLC the rights described above
4. You have the right to submit the contribution and grant these rights
5. Your contributions are provided "as-is" without warranties

See [LICENSE](LICENSE) for full terms.

---

## Getting Help

If you need help:

- **Documentation**: Read `DESIGN_GUIDE.md` and `CLAUDE.md`
- **Issues**: Search existing GitHub issues
- **Discussions**: Start a GitHub discussion for questions
- **Website**: Visit [cleansheet.info](https://www.cleansheet.info)

---

## Recognition

Contributors will be recognized in:
- GitHub contributor graph
- Release notes (for significant contributions)
- README acknowledgments (for major features)

---

## Code Review Guidelines

### For Contributors

When requesting review:
- Provide context in PR description
- Highlight areas needing special attention
- Respond promptly to feedback
- Be open to suggestions

### For Reviewers

When reviewing:
- Be respectful and constructive
- Focus on code, not the person
- Explain reasoning for changes
- Approve when standards are met

---

## Questions?

Don't hesitate to ask! We're here to help:

- **Repository**: [github.com/CleansheetLLC/Cleansheet](https://github.com/CleansheetLLC/Cleansheet)
- **Website**: [cleansheet.info](https://www.cleansheet.info)
- **Issues**: Use GitHub Issues for questions

---

**Thank you for contributing to Cleansheet!** 🎉

Every contribution, no matter how small, helps make Cleansheet better for everyone.
