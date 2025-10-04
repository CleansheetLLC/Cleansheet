# Cleansheet Blog Generation Guide

**Version:** 1.0
**Last Updated:** 2025-10-03
**Purpose:** Standard operating procedures for creating new Cleansheet Library blog posts

---

## Overview

This guide provides the complete workflow for generating new blog posts in the Cleansheet Library, ensuring consistency with established tone, structure, and metadata standards.

---

## Prerequisites

Before generating a blog post, ensure you have:

1. **TONE_GUIDE.md** - Writing standards and patterns
2. **CLAUDE.md** - Project context and design system
3. **DESIGN_GUIDE.md** - Visual design specifications
4. **meta/meta.csv** - Existing metadata for reference
5. **generate_corpus_index.py** - Index regeneration script

---

## Standard Blog Generation Workflow

### Step 1: Create the Blog Post

#### A. Receive Blog Request

Blog requests should include:
- **Topic**: Subject matter and focus
- **Target Audience**: Novice, Operator, Expert, Academic
- **Career Paths**: Which paths this content supports (1-3)
- **Desired Length**: 1500-3500 words based on complexity
- **Key Concepts**: Must-cover topics and learning objectives

#### B. Generate Content Following TONE_GUIDE.md

**Opening (200 words):**
- [ ] Start with concrete scenario or "Picture this" hook
- [ ] Include vivid 2-3 sentence scene
- [ ] Present clear problem statement
- [ ] Add highlighted thesis within first 3 paragraphs
- [ ] Transition from scenario to framework

**Body Content (1500-3000 words):**
- [ ] Follow H2 structure: Foundation → Core Concepts → Detailed Techniques → Advanced Patterns → Practical Application → Conclusion
- [ ] Include code blocks every 800-1000 words (technical articles)
- [ ] Add visual breaks (divs, tables, lists) every 300-400 words
- [ ] Use custom div classes for visual hierarchy (warning-box, methodology-box, etc.)
- [ ] Ensure all code blocks have language labels and copy buttons
- [ ] Include real-world examples and role-specific guidance

**Closing (200 words):**
- [ ] Restate core thesis with new framing
- [ ] Connect to career/practical impact
- [ ] Include forward pointer to related topics
- [ ] Maintain encouraging but not prescriptive tone

#### C. Apply Corporate Professional Design

Use the standard HTML template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Article Title] - Cleansheet</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300&family=Questrial&display=swap" rel="stylesheet">
    <style>
        /* Cleansheet Design System - Corporate Professional */
        :root {
            --color-primary-blue: #0066CC;
            --color-accent-blue: #004C99;
            --color-dark: #1a1a1a;
            --color-neutral-text: #333333;
            --color-neutral-text-light: #666666;
            --color-neutral-text-muted: #999999;
            --color-neutral-background: #f5f5f7;
            --color-neutral-border: #e5e5e7;
            --color-neutral-white: #ffffff;
            --font-family-ui: 'Questrial', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            --font-family-body: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            --font-family-mono: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-family-body);
            font-weight: 300;
            line-height: 1.6;
            color: var(--color-neutral-text);
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: var(--color-neutral-background);
        }

        h1 {
            font-family: var(--font-family-ui);
            font-size: clamp(24px, 4vw, 32px);
            color: var(--color-dark);
            margin-bottom: 20px;
            line-height: 1.2;
        }

        h2 {
            font-family: var(--font-family-ui);
            color: var(--color-primary-blue);
            font-size: clamp(20px, 3.5vw, 24px);
            margin-top: 30px;
            margin-bottom: 15px;
        }

        h3 {
            font-family: var(--font-family-ui);
            color: var(--color-accent-blue);
            font-size: clamp(16px, 3vw, 20px);
            margin-top: 25px;
            margin-bottom: 10px;
        }

        h4 {
            font-family: var(--font-family-ui);
            color: var(--color-neutral-text);
            font-size: clamp(14px, 2.5vw, 18px);
            margin-top: 20px;
            margin-bottom: 8px;
            font-weight: 600;
        }

        p {
            margin-bottom: 15px;
            font-size: clamp(14px, 2.5vw, 16px);
        }

        ul, ol {
            margin-bottom: 15px;
            padding-left: 25px;
        }

        li {
            margin-bottom: 8px;
        }

        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: var(--font-family-mono);
            font-size: clamp(12px, 2.2vw, 14px);
            color: #c7254e;
            border: 1px solid var(--color-neutral-border);
        }

        .code-block {
            position: relative;
            background: #1e1e1e;
            border-radius: 8px;
            margin: 20px 0;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .code-header {
            background: #2d2d30;
            color: #cccccc;
            padding: 10px 15px;
            font-size: clamp(11px, 2vw, 12px);
            border-bottom: 1px solid #404040;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: var(--font-family-ui);
        }

        .code-language {
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .copy-button {
            background: var(--color-primary-blue);
            color: white;
            border: none;
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
            font-family: var(--font-family-ui);
            font-weight: 600;
        }

        .copy-button:hover {
            background: var(--color-accent-blue);
            transform: translateY(-1px);
        }

        .copy-button:active {
            transform: translateY(0);
        }

        .copy-button.copied {
            background: #28a745;
        }

        .code-content {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 15px;
            overflow-x: auto;
            font-family: var(--font-family-mono);
            font-size: clamp(12px, 2.2vw, 14px);
            line-height: 1.6;
            white-space: pre;
            margin: 0;
            -webkit-overflow-scrolling: touch;
        }

        .highlight {
            background: #fff3cd;
            padding: 2px 4px;
            border-radius: 3px;
            color: var(--color-neutral-text);
        }

        blockquote {
            border-left: 4px solid var(--color-primary-blue);
            margin: 20px 0;
            padding: 15px 20px;
            background: var(--color-neutral-white);
            border-radius: 0 4px 4px 0;
        }

        .warning-box, .info-box, .success-box {
            padding: 15px;
            margin: 20px 0;
            border-radius: 6px;
            border-left: 4px solid;
        }

        .warning-box {
            background: #fff5f5;
            border-color: #dc3545;
            color: #721c24;
        }

        .info-box {
            background: #e3f2fd;
            border-color: var(--color-primary-blue);
            color: #004085;
        }

        .success-box {
            background: #f0fff0;
            border-color: #28a745;
            color: #155724;
        }

        @media (max-width: 768px) {
            body {
                padding: 20px 15px;
            }

            h1 {
                margin-top: 10px;
            }

            .code-header {
                padding: 8px 12px;
            }

            .code-content {
                padding: 12px;
                font-size: 13px;
            }

            .copy-button {
                padding: 4px 8px;
                font-size: 10px;
            }
        }
    </style>
</head>
<body>
    <h1>[Article Title]</h1>

    <!-- Article content here -->

    <script>
        // Copy to clipboard functionality
        async function copyToClipboard(button) {
            const codeBlock = button.closest('.code-block');
            const codeContent = codeBlock.querySelector('.code-content');
            const text = codeContent.textContent;

            try {
                await navigator.clipboard.writeText(text);
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                button.textContent = 'Failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        }

        // Add copy buttons to all code blocks on page load
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.code-block').forEach(block => {
                if (!block.querySelector('.copy-button')) {
                    const header = block.querySelector('.code-header');
                    if (header) {
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'copy-button';
                        copyBtn.textContent = 'Copy';
                        copyBtn.onclick = function() { copyToClipboard(this); };
                        header.appendChild(copyBtn);
                    }
                }
            });
        });
    </script>
</body>
</html>
```

#### D. Quality Check

Run through the quality checklist:

**Opening (First 200 words):**
- [ ] Concrete scenario or vivid example
- [ ] Clear problem statement
- [ ] Highlighted thesis within first 3 paragraphs
- [ ] Transition from scenario to framework

**Body Content:**
- [ ] H2 sections follow logical progression
- [ ] Each major concept introduced before applied
- [ ] Visual elements (divs) every 3-4 paragraphs
- [ ] Code blocks include explanatory comments
- [ ] Real-world examples ground abstract concepts
- [ ] Role-specific guidance included

**Technical Content:**
- [ ] Concepts explained before implementation
- [ ] Code examples are complete and runnable
- [ ] Trade-offs and alternatives discussed
- [ ] Production considerations addressed
- [ ] Security/performance implications noted

**Closing (Last 200 words):**
- [ ] Core thesis restated with new framing
- [ ] Career/practical impact emphasized
- [ ] Forward pointer to related topics
- [ ] Encouraging but not prescriptive tone

**Technical Quality:**
- [ ] All code blocks have language labels
- [ ] Copy buttons present on all code blocks
- [ ] Highlighting used sparingly (2-3 times per article)
- [ ] Custom divs used appropriately
- [ ] Mobile-responsive (tested at 768px breakpoint)

#### E. Save to Corpus

Save the HTML file to:
```
C:\Users\galja\github\CleansheetLLC\Cleansheet\corpus\[slug].html
```

**Filename conventions:**
- Use lowercase with hyphens: `advanced-graphql-patterns.html`
- Be descriptive but concise (3-6 words)
- Avoid special characters, use only `a-z`, `0-9`, and `-`

---

### Step 2: Append Metadata to meta.csv

#### A. Generate Metadata Fields

Create a new CSV row with all required fields:

**Required Fields:**

1. **PartitionKey**: `BlogPost` (always)
2. **RowKey**: `[filename-without-extension]` (e.g., `advanced-graphql-patterns`)
3. **Audience_Level**: JSON array `["Novice", "Operator", "Expert", "Academic"]` (select 2-3)
4. **Audience_Level@type**: `String`
5. **Comprehensive_Abstract**: 400-600 words covering all topics
6. **Comprehensive_Abstract@type**: `String`
7. **Created_Date**: ISO 8601 format `2025-10-03T14:30:00Z`
8. **Created_Date@type**: `String`
9. **Detailed_Summary**: 150-250 words overview
10. **Detailed_Summary@type**: `String`
11. **Executive_Summary**: 1-2 sentence value proposition
12. **Executive_Summary@type**: `String`
13. **FileKey**: `[filename].html` (e.g., `advanced-graphql-patterns.html`)
14. **FileKey@type**: `String`
15. **ID**: Generate new GUID (use Python `uuid.uuid4()`)
16. **ID@type**: `Guid`
17. **Keywords**: JSON array of 25-40 relevant keywords
18. **Keywords@type**: `String`
19. **Learner_Blogs**: `/blog/[slug]` (e.g., `/blog/advanced-graphql-patterns`)
20. **Learner_Blogs@type**: `String`
21. **Overview_Summary**: 2-3 sentence overview for cards
22. **Overview_Summary@type**: `String`
23. **Owner**: `e2146571-600d-4c05-b6e5-d3d9bac15af8` (standard owner ID)
24. **Owner@type**: `Guid`
25. **Publish_Date**: ISO 8601 format `2025-10-03T14:30:00Z`
26. **Publish_Date@type**: `String`
27. **Status**: `PUBLISHED`
28. **Status@type**: `String`
29. **Subtitle**: Brief subtitle (5-10 words)
30. **Subtitle@type**: `String`
31. **Tags**: JSON array from standard tags (select 2-4)
32. **Tags@type**: `String`
33. **Title**: Full article title
34. **Title@type**: `String`
35. **Updated_Date**: ISO 8601 format `2025-10-03T14:30:00Z`
36. **Updated_Date@type**: `String`
37. **Career_Paths**: JSON array of 1-3 relevant career paths

**Standard Tags** (choose 2-4):
- AI/ML
- Analytics
- Architecture
- Career
- Design
- DevOps
- Frontend
- Project Management
- Security

**Career Paths** (choose 1-3):
- Citizen Developer
- Cloud Computing
- Project Management
- Cloud Operations
- Network Operations
- Security Operations
- Full Stack Developer
- AI/ML
- Analytics

#### B. Generate Summaries

**Executive Summary (1-2 sentences):**
```
Master [main topic] including [key concept 1], [key concept 2], and [key concept 3] for [outcome].
```

**Overview Summary (2-3 sentences):**
```
[Topic] addresses [problem]. This guide covers [main areas]. Learn [specific skills/knowledge].
```

**Detailed Summary (150-250 words):**
- Overview of main topics
- Key concepts and techniques
- Practical applications
- What readers will learn
- Target audience benefit

**Comprehensive Abstract (400-600 words):**
- Comprehensive overview of all topics
- Technical depth and specifics
- Strategic importance
- Advanced patterns discussed
- Edge cases and considerations
- Production implications

#### C. Generate Keywords

Extract 25-40 keywords from:
- Article title words
- All H2 and H3 headings
- Key technical terms
- Tool/technology names
- Methodologies mentioned
- Common search terms

Format as JSON array:
```json
["keyword1", "keyword2", "keyword3", ...]
```

#### D. Append to CSV

**Method 1: Python Script**

```python
import csv
import uuid
from datetime import datetime

# Prepare new row
new_row = {
    'PartitionKey': 'BlogPost',
    'RowKey': 'your-article-slug',
    'Audience_Level': '["Operator", "Expert"]',
    'Audience_Level@type': 'String',
    'Comprehensive_Abstract': 'Your 400-600 word abstract...',
    'Comprehensive_Abstract@type': 'String',
    'Created_Date': datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
    'Created_Date@type': 'String',
    'Detailed_Summary': 'Your 150-250 word summary...',
    'Detailed_Summary@type': 'String',
    'Executive_Summary': 'Your 1-2 sentence summary...',
    'Executive_Summary@type': 'String',
    'FileKey': 'your-article-slug.html',
    'FileKey@type': 'String',
    'ID': str(uuid.uuid4()),
    'ID@type': 'Guid',
    'Keywords': '["keyword1", "keyword2", ...]',
    'Keywords@type': 'String',
    'Learner_Blogs': '/blog/your-article-slug',
    'Learner_Blogs@type': 'String',
    'Overview_Summary': 'Your 2-3 sentence overview...',
    'Overview_Summary@type': 'String',
    'Owner': 'e2146571-600d-4c05-b6e5-d3d9bac15af8',
    'Owner@type': 'Guid',
    'Publish_Date': datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
    'Publish_Date@type': 'String',
    'Status': 'PUBLISHED',
    'Status@type': 'String',
    'Subtitle': 'Your subtitle',
    'Subtitle@type': 'String',
    'Tags': '["DevOps", "Architecture"]',
    'Tags@type': 'String',
    'Title': 'Your Article Title',
    'Title@type': 'String',
    'Updated_Date': datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
    'Updated_Date@type': 'String',
    'Career_Paths': '["Cloud Operations", "DevOps"]'
}

# Read existing CSV
with open('meta/meta.csv', 'r', encoding='utf-8', newline='') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    fieldnames = reader.fieldnames

# Append new row
rows.append(new_row)

# Write back
with open('meta/meta.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
```

**Method 2: Manual Entry**

Open meta.csv in a text editor and append the new row, ensuring:
- All fields are in correct order
- JSON arrays are properly quoted
- Commas in content are within quoted fields
- No trailing commas

#### E. Validate Metadata

After appending, validate:

```bash
# Check row count increased
wc -l meta/meta.csv

# Verify new entry exists
grep "your-article-slug" meta/meta.csv

# Validate JSON fields (Python)
python -c "import csv, json; rows = list(csv.DictReader(open('meta/meta.csv', encoding='utf-8'))); r = rows[-1]; json.loads(r['Keywords']); json.loads(r['Tags']); json.loads(r['Career_Paths']); print('Valid!')"
```

---

### Step 3: Regenerate Index

#### A. Run Index Generator

Execute the corpus index generator:

```bash
cd C:\Users\galja\github\CleansheetLLC\Cleansheet
python generate_corpus_index.py
```

This script will:
1. Read all entries from meta/meta.csv
2. Generate the corpus/index.html with:
   - Search functionality
   - Tag filtering
   - Expertise level slider
   - Article cards with metadata
3. Embed all article metadata in the HTML

#### B. Verify Index Generation

Check that:
- [ ] corpus/index.html was updated (check file timestamp)
- [ ] New article appears in the library
- [ ] Search finds the article by title/keywords
- [ ] Tags are correct and filterable
- [ ] Expertise level badge displays correctly
- [ ] Article link works

#### C. Test Generated Index

Open corpus/index.html in browser and verify:
1. **Search works**: Type article title, verify it appears
2. **Filters work**: Select tags, verify article shows/hides correctly
3. **Expertise slider works**: Adjust slider, verify filtering
4. **Card display**: Check title, tags, expertise level, summary
5. **Link works**: Click card, verify article opens in slideout panel
6. **Mobile responsive**: Test at 768px width

---

## Post-Generation Checklist

After completing all three steps:

### Content Quality
- [ ] Article follows TONE_GUIDE.md patterns
- [ ] Opening has concrete scenario hook
- [ ] Code blocks include comments and copy buttons
- [ ] Visual hierarchy with divs every 3-4 paragraphs
- [ ] Conclusion restates thesis and provides next steps
- [ ] Mobile-responsive design verified

### Metadata Quality
- [ ] All 37 CSV fields populated
- [ ] JSON arrays properly formatted (Keywords, Tags, Audience_Level, Career_Paths)
- [ ] GUID generated for ID field
- [ ] ISO 8601 dates for Created/Published/Updated
- [ ] FileKey matches actual filename
- [ ] Career paths accurately reflect content (1-3 paths)

### Integration
- [ ] HTML file saved to corpus/ directory
- [ ] Metadata appended to meta.csv
- [ ] Index regenerated successfully
- [ ] Article appears in library search
- [ ] All filters work correctly
- [ ] Links function properly

---

## Common Pitfalls to Avoid

### Content Issues
❌ **Don't**: Start with dry technical definitions
✅ **Do**: Open with relatable scenario or concrete example

❌ **Don't**: Put code before explaining concepts
✅ **Do**: Explain concept → describe use case → show code → explain significance

❌ **Don't**: Use emoji unless user explicitly requests
✅ **Do**: Maintain professional technical tone throughout

❌ **Don't**: Create new div classes
✅ **Do**: Use established classes (warning-box, info-box, success-box, etc.)

### Metadata Issues
❌ **Don't**: Forget to escape commas in CSV fields
✅ **Do**: Quote fields containing commas: `"value, with, commas"`

❌ **Don't**: Use single quotes in JSON arrays
✅ **Do**: Use double quotes: `["item1", "item2"]`

❌ **Don't**: Assign to all 9 career paths
✅ **Do**: Select 1-3 most relevant paths based on content focus

❌ **Don't**: Forget to run index generator
✅ **Do**: Always regenerate index after adding metadata

### File Naming Issues
❌ **Don't**: Use spaces or underscores: `my article.html` or `my_article.html`
✅ **Do**: Use hyphens: `my-article.html`

❌ **Don't**: Use uppercase: `MyArticle.html`
✅ **Do**: Use lowercase: `my-article.html`

---

## Templates and Scripts

### Quick Start Template Script

Create a new blog post with this Python script:

```python
#!/usr/bin/env python3
"""
Quick blog post creator for Cleansheet Library
"""
import csv
import uuid
import sys
from datetime import datetime
from pathlib import Path

def create_blog_post(slug, title, subtitle, tags, career_paths, audience_levels):
    """Create new blog post with metadata"""

    # Validate inputs
    if not slug or not title:
        print("Error: slug and title are required")
        sys.exit(1)

    # Paths
    corpus_dir = Path(__file__).parent / 'corpus'
    meta_file = Path(__file__).parent / 'meta' / 'meta.csv'
    html_file = corpus_dir / f'{slug}.html'

    # Check if file already exists
    if html_file.exists():
        print(f"Error: {html_file} already exists")
        sys.exit(1)

    # Generate HTML template
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Cleansheet</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300&family=Questrial&display=swap" rel="stylesheet">
    <style>
        /* Include full Corporate Professional CSS here */
    </style>
</head>
<body>
    <h1>{title}</h1>

    <!-- TODO: Add article content -->

    <script>
        /* Include copy-to-clipboard JavaScript here */
    </script>
</body>
</html>'''

    # Generate metadata row
    now = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    new_row = {
        'PartitionKey': 'BlogPost',
        'RowKey': slug,
        'Audience_Level': str(audience_levels),
        'Audience_Level@type': 'String',
        'Comprehensive_Abstract': 'TODO: Add 400-600 word abstract',
        'Comprehensive_Abstract@type': 'String',
        'Created_Date': now,
        'Created_Date@type': 'String',
        'Detailed_Summary': 'TODO: Add 150-250 word summary',
        'Detailed_Summary@type': 'String',
        'Executive_Summary': 'TODO: Add 1-2 sentence summary',
        'Executive_Summary@type': 'String',
        'FileKey': f'{slug}.html',
        'FileKey@type': 'String',
        'ID': str(uuid.uuid4()),
        'ID@type': 'Guid',
        'Keywords': '[]',  # TODO: Add keywords
        'Keywords@type': 'String',
        'Learner_Blogs': f'/blog/{slug}',
        'Learner_Blogs@type': 'String',
        'Overview_Summary': 'TODO: Add 2-3 sentence overview',
        'Overview_Summary@type': 'String',
        'Owner': 'e2146571-600d-4c05-b6e5-d3d9bac15af8',
        'Owner@type': 'Guid',
        'Publish_Date': now,
        'Publish_Date@type': 'String',
        'Status': 'PUBLISHED',
        'Status@type': 'String',
        'Subtitle': subtitle,
        'Subtitle@type': 'String',
        'Tags': str(tags),
        'Tags@type': 'String',
        'Title': title,
        'Title@type': 'String',
        'Updated_Date': now,
        'Updated_Date@type': 'String',
        'Career_Paths': str(career_paths)
    }

    # Write HTML file
    html_file.write_text(html_content, encoding='utf-8')
    print(f"Created: {html_file}")

    # Append to CSV
    with open(meta_file, 'r', encoding='utf-8', newline='') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames

    rows.append(new_row)

    with open(meta_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Metadata added to: {meta_file}")
    print(f"\nNext steps:")
    print(f"1. Edit content in: {html_file}")
    print(f"2. Update summaries and keywords in: {meta_file}")
    print(f"3. Run: python generate_corpus_index.py")

if __name__ == '__main__':
    # Example usage
    create_blog_post(
        slug='example-article',
        title='Example Article Title',
        subtitle='Example subtitle for the article',
        tags=['DevOps', 'Architecture'],
        career_paths=['Cloud Operations', 'Full Stack Developer'],
        audience_levels=['Operator', 'Expert']
    )
```

---

## Automation Opportunities

### Future Enhancements
1. **Content validation script** - Check TONE_GUIDE.md compliance
2. **Metadata validator** - Verify all JSON fields, required fields
3. **Preview generator** - Create local preview before publishing
4. **Batch processor** - Generate multiple articles from prompts
5. **SEO analyzer** - Check keyword density, readability scores

---

## Version History

**v1.0 (2025-10-03)**
- Initial blog generation guide
- Three-step workflow established
- Quality checklists defined
- Templates and examples provided

---

## References

- **TONE_GUIDE.md** - Writing patterns and style
- **CLAUDE.md** - Project context and standards
- **DESIGN_GUIDE.md** - Visual design specifications
- **meta/meta.csv** - Metadata schema reference
- **generate_corpus_index.py** - Index generator script

---

**Maintained by**: Cleansheet LLC
**Questions**: Reference existing corpus articles for examples
**Updates**: Refine based on generation experience and feedback
