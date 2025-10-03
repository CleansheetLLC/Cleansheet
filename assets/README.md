# Cleansheet Platform Assets

This directory contains all brand assets, logos, and visual resources for the Cleansheet platform.

## Directory Structure

### high-resolution-logo-files
**Primary branding assets** - Use these for all platform implementations.

**Required Files:**
- ✓ `white-on-transparent.png` - **PRIMARY** - Used for dark backgrounds (headers, navigation)
- ✓ `black-on-transparent.png` - For light backgrounds
- ✓ `original-on-transparent.png` - Full color variant
- ✓ `grayscale-on-transparent.png` - Grayscale variant
- ✓ `monochrome-on-transparent.png` - Single-color variant
- ✓ `original.png` - Full color with background
- ✓ `black-on-white.png` - For print/documents
- ✓ `white-on-transparent---scaled.png` - Optimized web version
- ✓ `white-on-transparent.xcf` - Source file (GIMP)

**Usage:**
- **Platform headers**: `White on transparent.png`
- **Favicon**: `White on transparent.png`
- **Print materials**: `Black on white.png` or vector files
- **Social media**: See `Logos for social media/` directory

### logos-for-business-tools
App icons and integration assets for:
- Slack, Microsoft Teams, Google Workspace
- Project management tools
- CRM integrations
- Business application icons

### logos-for-mobile-apps
Mobile-specific logo variants:
- iOS app icons (various sizes: 1024x1024, 512x512, etc.)
- Android app icons (various densities: mdpi, hdpi, xhdpi, etc.)
- Splash screens
- Push notification icons

### logos-for-social-media
Social platform-specific assets:
- Facebook (cover, profile)
- LinkedIn (company page, personal)
- Twitter/X (header, profile)
- Instagram (profile, story templates)
- YouTube (channel art, thumbnails)
- Open Graph images (og:image)

### printable-vector-files
High-quality vector formats for print:
- SVG (web use)
- EPS (professional printing)
- PDF (documents, presentations)
- AI (Adobe Illustrator)

**Use these for:**
- Business cards
- Letterhead
- Signage
- Merchandise
- Large format printing

### sample-logo
Example implementations showing:
- Proper spacing and clear space
- Minimum size requirements
- Usage do's and don'ts
- Color combinations
- Background applications

## Asset Usage Guidelines

### Logo Sizing

**Web (Desktop):**
- Header logo: `60px` height
- Footer logo: `40px` height
- Favicon: `32x32px` or `64x64px`

**Web (Mobile):**
- Header logo: `40px` height
- Footer logo: `30px` height

**Print:**
- Minimum size: `0.5 inches` (1.27cm) height
- Recommended: `1 inch` (2.54cm) or larger

### File Format Selection

| Use Case | Format | File Location |
|----------|--------|---------------|
| Website header/footer | PNG | `high-resolution-logo-files/white-on-transparent.png` |
| Favicon | PNG | `high-resolution-logo-files/white-on-transparent.png` |
| Print (professional) | EPS/AI | `printable-vector-files/` |
| Print (standard) | PDF | `printable-vector-files/` |
| Web (scalable) | SVG | `printable-vector-files/` |
| Social media | PNG | `logos-for-social-media/` (platform-specific) |
| Mobile app icon | PNG | `logos-for-mobile-apps/` (size-specific) |
| Business tools | PNG | `logos-for-business-tools/` (tool-specific) |

### Color Variants

**When to use each variant:**

1. **White on transparent** - Dark backgrounds (#1a1a1a, #004C99, #0066CC)
2. **Black on transparent** - Light backgrounds (#f5f5f7, #ffffff)
3. **Original (color)** - Flexible backgrounds, full brand presence
4. **Grayscale** - Monochrome materials, professional documents
5. **Black on white** - Print materials, fax, black & white documents

### Clear Space

Maintain clear space around the logo equal to **1/4 of the logo height** on all sides.

```
┌─────────────────────────┐
│                         │ ← Clear space
│    ┌─────────────┐     │
│    │    LOGO     │     │ ← Logo
│    └─────────────┘     │
│                         │ ← Clear space
└─────────────────────────┘
```

### Do's and Don'ts

**DO:**
- ✓ Use approved logo files from this directory
- ✓ Maintain aspect ratio when scaling
- ✓ Use appropriate color variant for background
- ✓ Ensure sufficient contrast
- ✓ Use vector files for print when possible

**DON'T:**
- ✗ Stretch or distort the logo
- ✗ Rotate the logo
- ✗ Change logo colors
- ✗ Add effects (drop shadow, glow, etc.)
- ✗ Place logo on busy backgrounds without proper contrast
- ✗ Use low-resolution files for print

## Implementation Examples

### HTML Usage
```html
<!-- Standard header (dark background) -->
<header style="background: #1a1a1a;">
    <img src="assets/high-resolution-logo-files/white-on-transparent.png"
         alt="Cleansheet Logo"
         class="header-logo">
</header>

<!-- Light background -->
<div style="background: #ffffff;">
    <img src="assets/high-resolution-logo-files/black-on-transparent.png"
         alt="Cleansheet Logo"
         class="logo">
</div>

<!-- Favicon -->
<link rel="icon" type="image/png"
      href="assets/high-resolution-logo-files/white-on-transparent.png">
```

### CSS Sizing
```css
.header-logo {
    height: 60px;
    width: auto;
}

@media (max-width: 768px) {
    .header-logo {
        height: 40px;
    }
}
```

## Asset Maintenance

### When to Update Assets

Update assets when:
1. **Rebranding** - Major visual identity changes
2. **Logo refresh** - Minor tweaks to existing logo
3. **New platforms** - Adding integrations or social channels
4. **Format needs** - New file formats required
5. **Quality issues** - Existing assets don't meet standards

### Update Checklist

When updating assets:
- [ ] Update all color variants (White, Black, Original, Grayscale)
- [ ] Regenerate all size variants for mobile apps
- [ ] Update social media assets
- [ ] Regenerate favicon
- [ ] Update vector files (SVG, EPS, PDF)
- [ ] Test on all pages (index, corpus, career paths, etc.)
- [ ] Update this README if usage changes
- [ ] Commit with message: `[assets] Description of changes`

### File Naming Convention

Follow this pattern for new assets:
```
[Color/Variant] on [Background].[extension]

Examples:
- White on transparent.png
- Black on blue.png
- Grayscale on transparent.svg
```

For sized variants:
```
[Variant] - [size]x[size].[extension]

Examples:
- iOS Icon - 1024x1024.png
- Twitter Profile - 400x400.png
```

## Asset Dependencies

### Current Platform Usage

**All HTML pages reference:**
- Logo: `assets/high-resolution-logo-files/white-on-transparent.png`
- Favicon: `assets/high-resolution-logo-files/white-on-transparent.png`

**Pages using assets:**
- `index.html` - Main landing page
- `career-paths.html` - Career progression tool
- `role-translator.html` - Role discovery tool
- `ml-pipeline.html` - Pipeline visualization
- `privacy-policy.html` - Legal page
- `privacy-principles.html` - Privacy commitments
- `terms-of-service.html` - Terms of service
- `corpus/index.html` - Content library

### External Dependencies

**Font Awesome 6.4.0** - Icon library
- CDN: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- Used for UI icons (not brand assets)

**Google Fonts** - Typography
- Questrial (headings)
- Barlow Light (body)
- Not brand assets, but part of visual identity

## Quality Standards

### Image Requirements

**PNG Assets:**
- Minimum resolution: 72 DPI (web), 300 DPI (print)
- Color mode: RGB (web), CMYK (print)
- Transparency: Preserved where applicable
- Compression: Optimized for web (lossless)

**Vector Assets:**
- Format: SVG (web), EPS/AI (print)
- Outlines: Text converted to outlines/paths
- Artboard: Properly sized and aligned
- Validation: No corrupt paths or invisible objects

### File Size Targets

| Asset Type | Max Size (Web) | Max Size (Print) |
|------------|----------------|------------------|
| PNG logos | 100 KB | N/A |
| SVG logos | 50 KB | N/A |
| Favicons | 20 KB | N/A |
| Social images | 200 KB | N/A |
| Print files | N/A | No limit |

## Support

For asset-related questions or requests:
- **Repository**: `CleansheetLLC/Cleansheet`
- **Design Guide**: `DESIGN_GUIDE.md`
- **Project Context**: `CLAUDE.md`

---

Last Updated: 2025-10-03
Version: 1.0
