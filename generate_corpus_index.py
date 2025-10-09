#!/usr/bin/env python3
"""
Generate corpus index.html from metadata.csv
Regenerates the library browser interface on demand.
"""

import csv
import json
import re
import os
from pathlib import Path
from datetime import datetime

# Paths
SCRIPT_DIR = Path(__file__).parent
CORPUS_DIR = SCRIPT_DIR / "corpus"
METADATA_PATH = SCRIPT_DIR / "meta" / "meta.csv"
OUTPUT_PATH = CORPUS_DIR / "index.html"

def normalize_csv_status():
    """Normalize all Status values to 'PUBLISHED' (uppercase)"""
    rows = []
    fieldnames = None

    # Read all rows
    with open(METADATA_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            # Normalize Status field
            if row.get('Status') and row['Status'].upper() == 'PUBLISHED':
                row['Status'] = 'PUBLISHED'
            rows.append(row)

    # Write back normalized data
    with open(METADATA_PATH, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"[OK] Normalized Status field in {METADATA_PATH}")
    print(f"  Total rows: {len(rows)}")

def load_metadata():
    """Load and parse metadata.csv"""
    articles = []

    with open(METADATA_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Parse JSON fields
            try:
                row['levels'] = json.loads(row.get('Audience_Level', '[]'))
            except:
                row['levels'] = []

            try:
                row['tags'] = json.loads(row.get('Tags', '[]'))
            except:
                row['tags'] = []

            try:
                row['keywords'] = json.loads(row.get('Keywords', '[]'))
            except:
                row['keywords'] = []

            try:
                row['career_paths'] = json.loads(row.get('Career_Paths', '[]'))
            except:
                row['career_paths'] = []

            articles.append(row)

    # Reverse the list so most recently appended articles appear first
    articles.reverse()

    return articles

def extract_all_tags(articles):
    """Extract unique tags from all articles"""
    tags = set()
    for article in articles:
        tags.update(article.get('tags', []))
    return sorted(tags)

def extract_all_career_paths(articles):
    """Extract unique career paths from all articles"""
    paths = set()
    for article in articles:
        try:
            career_paths = json.loads(article.get('Career_Paths', '[]'))
            paths.update(career_paths)
        except:
            pass
    return sorted(paths)

def generate_html(articles, all_tags, all_career_paths):
    """Generate the complete HTML file"""

    # Escape for JSON embedding
    def escape_json(obj):
        return json.dumps(obj).replace('<', '\\u003c').replace('>', '\\u003e')

    articles_json = escape_json(articles)

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cleansheet Library - Technical Content Corpus</title>
    <link rel="icon" type="image/png" href="../assets/high-resolution-logo-files/white-on-transparent.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300&family=Questrial&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {{
            /* Corporate Professional Color Palette */
            --primary-blue: #0066CC;
            --accent-blue: #004C99;
            --dark: #1a1a1a;
            --neutral-text: #333333;
            --neutral-text-light: #666666;
            --neutral-text-muted: #999999;
            --neutral-bg: #f5f5f7;
            --neutral-bg-secondary: #f8f8f8;
            --neutral-border: #e5e5e7;
            --neutral-white: #ffffff;
            --header-title: #e0e0e0;
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-weight: 300;
            display: flex;
            height: 100vh;
            background: var(--neutral-bg);
            overflow: hidden;
        }}

        /* Fixed Position Logo */
        .fixed-logo {{
            position: fixed;
            top: 20px;
            right: 24px;
            height: 42px;
            width: auto;
            z-index: 500;
        }}

        @media (max-width: 768px) {{
            .fixed-logo {{
                height: 28px;
            }}
        }}

        /* Left Navigation */
        .left-nav {{
            width: 320px;
            background: var(--dark);
            color: var(--neutral-white);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            flex-shrink: 0;
        }}

        .nav-header {{
            padding: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }}

        .nav-header h1 {{
            font-family: 'Questrial', sans-serif;
            font-size: 20px;
            margin-bottom: 8px;
            color: var(--neutral-white);
        }}

        .nav-header p {{
            font-size: 12px;
            color: rgba(255,255,255,0.7);
        }}


        .back-home-link {{
            display: inline-block;
            margin-top: 12px;
            padding: 8px 16px;
            background: rgba(26, 26, 26, 0.8);
            backdrop-filter: blur(10px);
            color: var(--neutral-white);
            text-decoration: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s;
            border: 1px solid var(--neutral-white);
        }}

        .back-home-link:hover {{
            background: rgba(26, 26, 26, 0.9);
            border-color: var(--neutral-white);
        }}

        /* Search */
        .search-section {{
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }}

        .search-input {{
            width: 100%;
            padding: 10px 12px;
            border: none;
            border-radius: 6px;
            background: rgba(255,255,255,0.1);
            color: var(--neutral-white);
            font-size: 14px;
            font-family: 'Barlow', sans-serif;
            font-weight: 300;
        }}

        .search-input::placeholder {{
            color: rgba(255,255,255,0.5);
        }}

        .search-input:focus {{
            outline: 2px solid var(--primary-blue);
            background: rgba(255,255,255,0.15);
        }}

        /* Expertise Level Slider */
        .expertise-section {{
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }}

        .expertise-section h3 {{
            font-family: 'Questrial', sans-serif;
            font-size: 14px;
            margin-bottom: 12px;
            color: var(--neutral-white);
        }}

        .expertise-levels {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 10px;
            color: rgba(255,255,255,0.7);
        }}

        .slider-container {{
            position: relative;
            padding: 10px 0;
        }}

        .range-slider {{
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 2px;
            position: relative;
        }}

        .range-track {{
            position: absolute;
            height: 4px;
            background: var(--primary-blue);
            border-radius: 2px;
            top: 10px;
        }}

        .range-input {{
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            background: transparent;
            position: absolute;
            top: 10px;
            left: 0;
            pointer-events: none;
        }}

        .range-input::-webkit-slider-thumb {{
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--neutral-white);
            cursor: pointer;
            pointer-events: all;
            border: 2px solid var(--primary-blue);
        }}

        .range-input::-moz-range-thumb {{
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--neutral-white);
            cursor: pointer;
            pointer-events: all;
            border: 2px solid var(--primary-blue);
        }}

        /* Tags Section */
        .tags-section {{
            padding: 16px 20px;
            flex: 1;
            overflow-y: auto;
        }}

        .tags-section h3 {{
            font-family: 'Questrial', sans-serif;
            font-size: 14px;
            margin-bottom: 12px;
            color: var(--neutral-white);
        }}

        .tag-pills {{
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }}

        .tag-pill {{
            padding: 6px 12px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 16px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            color: rgba(255,255,255,0.8);
        }}

        .tag-pill:hover {{
            background: rgba(255,255,255,0.15);
            border-color: rgba(255,255,255,0.3);
        }}

        .tag-pill.active {{
            background: var(--primary-blue);
            border-color: var(--primary-blue);
            color: var(--neutral-white);
            font-weight: 600;
        }}

        /* Results Section */
        .results-section {{
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }}

        .results-header {{
            padding: 20px 24px;
            background: var(--neutral-white);
            border-bottom: 1px solid var(--neutral-border);
        }}

        .results-header h2 {{
            font-family: 'Questrial', sans-serif;
            font-size: 24px;
            color: var(--neutral-text);
            margin-bottom: 8px;
        }}

        .results-count {{
            font-size: 14px;
            color: var(--neutral-text-light);
        }}

        .results-list {{
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            align-content: start;
        }}

        .article-card {{
            background: var(--neutral-white);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.2s;
            height: fit-content;
        }}

        .article-card:hover {{
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }}

        .article-title {{
            font-family: 'Questrial', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: var(--neutral-text);
            margin-bottom: 8px;
        }}

        .article-subtitle {{
            font-size: 14px;
            color: var(--neutral-text-light);
            margin-bottom: 12px;
        }}

        .article-summary {{
            font-size: 13px;
            color: var(--neutral-text-light);
            line-height: 1.5;
            margin-bottom: 12px;
        }}

        .article-meta {{
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: var(--neutral-text-muted);
        }}

        .article-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 12px;
        }}

        .article-tag {{
            padding: 4px 10px;
            background: var(--neutral-bg);
            border: 1px solid var(--neutral-border);
            border-radius: 12px;
            font-size: 11px;
            color: var(--neutral-text);
        }}

        .expertise-badge {{
            display: inline-block;
            padding: 4px 8px;
            background: var(--primary-blue);
            color: var(--neutral-white);
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }}

        .no-results {{
            text-align: center;
            padding: 60px 20px;
            color: var(--neutral-text-light);
        }}

        .loading {{
            text-align: center;
            padding: 60px 20px;
            color: var(--neutral-text-light);
        }}

        /* Slideout Panel */
        .slideout-overlay {{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }}

        .slideout-overlay.active {{
            display: block;
            opacity: 1;
        }}

        .slideout-panel {{
            position: fixed;
            top: 0;
            right: -60%;
            width: 60%;
            height: 100vh;
            background: var(--neutral-white);
            box-shadow: -4px 0 16px rgba(0,0,0,0.2);
            z-index: 1001;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }}

        .slideout-panel.active {{
            right: 0;
        }}

        .slideout-header {{
            padding: 20px 24px;
            border-bottom: 1px solid var(--neutral-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            gap: 16px;
        }}

        .slideout-header-left {{
            flex: 1;
            min-width: 0;
        }}

        .slideout-header h2 {{
            font-family: 'Questrial', sans-serif;
            font-size: 20px;
            color: var(--neutral-text);
            margin: 0;
        }}

        .slideout-header-actions {{
            display: flex;
            gap: 12px;
            align-items: center;
        }}

        .add-to-plan-button {{
            padding: 10px 20px;
            background: var(--primary-blue);
            color: var(--neutral-white);
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Barlow', sans-serif;
            cursor: not-allowed;
            opacity: 0.6;
            white-space: nowrap;
            transition: all 0.2s;
        }}

        .add-to-plan-button:hover {{
            opacity: 0.7;
        }}

        .close-button {{
            width: 32px;
            height: 32px;
            border: none;
            background: var(--neutral-bg);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: var(--neutral-text);
            transition: all 0.2s;
            flex-shrink: 0;
        }}

        .close-button:hover {{
            background: var(--neutral-border);
        }}

        .slideout-content {{
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }}

        .slideout-content iframe {{
            width: 100%;
            height: 100%;
            border: none;
            min-height: 600px;
        }}

        /* Mobile Filter Toggle */
        .mobile-filter-toggle {{
            display: none;
            background: var(--primary-blue);
            color: var(--neutral-white);
            border: none;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Barlow', sans-serif;
            cursor: pointer;
            width: 100%;
            text-align: left;
            position: relative;
        }}

        .mobile-filter-toggle::after {{
            content: '▼';
            position: absolute;
            right: 20px;
            transition: transform 0.3s;
        }}

        .mobile-filter-toggle.expanded::after {{
            transform: rotate(180deg);
        }}

        .mobile-filters-container {{
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }}

        @media (max-width: 768px) {{
            body {{
                flex-direction: column;
                height: 100vh;
            }}

            .left-nav {{
                width: 100%;
                max-height: none;
                height: auto;
                flex-shrink: 0;
            }}

            .mobile-filter-toggle {{
                display: block;
            }}

            .mobile-filters-container {{
                max-height: 0;
            }}

            .mobile-filters-container.expanded {{
                max-height: 1000px;
            }}

            .tags-section {{
                max-height: 200px;
            }}

            .results-section {{
                flex: 1;
                min-height: 0;
                overflow: hidden;
            }}

            .results-header {{
                padding-right: 60px;
            }}

            .results-list {{
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                grid-template-columns: 1fr;
            }}

            .slideout-panel {{
                width: 90%;
                right: -90%;
            }}

            .slideout-header {{
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }}

            .slideout-header-actions {{
                width: 100%;
                justify-content: space-between;
            }}

            .add-to-plan-button {{
                padding: 8px 16px;
                font-size: 12px;
            }}
        }}
    </style>
</head>
<body>
    <img src="../assets/high-resolution-logo-files/black-on-transparent.png" alt="Cleansheet Logo" class="fixed-logo">

    <div class="left-nav">
        <div class="nav-header">
            <h1>Cleansheet Library</h1>
            <p>Technical Content Corpus</p>
            <a href="../index.html" class="back-home-link">← Back to Home</a>
        </div>

        <button class="mobile-filter-toggle" id="mobileFilterToggle">
            Filters & Search
        </button>

        <div class="mobile-filters-container" id="mobileFiltersContainer">
            <div class="search-section">
                <input
                    type="text"
                    class="search-input"
                    id="searchInput"
                    placeholder="Search titles, keywords, content..."
                >
            </div>

            <div class="expertise-section">
                <h3>Expertise Level</h3>
                <div class="expertise-levels">
                    <span>Neophyte</span>
                    <span>Novice</span>
                    <span>Operator</span>
                    <span>Expert</span>
                    <span>Academic</span>
                </div>
                <div class="slider-container">
                    <div class="range-slider">
                        <div class="range-track" id="rangeTrack"></div>
                    </div>
                    <input type="range" min="0" max="4" value="0" class="range-input" id="rangeMin">
                    <input type="range" min="0" max="4" value="4" class="range-input" id="rangeMax">
                </div>
            </div>

            <div class="tags-section">
                <h3>Filter by Career Path</h3>
                <div class="tag-pills" id="careerPathPills">
                    <!-- Career paths populated dynamically -->
                </div>
            </div>

            <div class="tags-section">
                <h3>Filter by Tags</h3>
                <div class="tag-pills" id="tagPills">
                    <!-- Tags populated dynamically -->
                </div>
            </div>
        </div>
    </div>

    <div class="results-section">
        <div class="results-header">
            <h2>Content Library</h2>
            <div class="results-count" id="resultsCount">Loading...</div>
        </div>
        <div class="results-list" id="resultsList">
            <div class="loading">Loading content...</div>
        </div>
    </div>

    <!-- Slideout Panel -->
    <div class="slideout-overlay" id="slideoutOverlay" onclick="closeSlideout()"></div>
    <div class="slideout-panel" id="slideoutPanel">
        <div class="slideout-header">
            <div class="slideout-header-left">
                <h2 id="slideoutTitle">Article Title</h2>
            </div>
            <div class="slideout-header-actions">
                <button class="add-to-plan-button" disabled title="Coming soon">
                    Add to My Plan (Coming Soon)
                </button>
                <button class="close-button" onclick="closeSlideout()">&times;</button>
            </div>
        </div>
        <div class="slideout-content" id="slideoutContent">
            <!-- Content loaded here -->
        </div>
    </div>

    <script>
        // Embedded data
        const allArticles = {articles_json};
        let filteredArticles = [];
        let activeTags = new Set();
        let activeCareerPaths = new Set();
        let minLevel = 0;
        let maxLevel = 4;
        const levelMap = {{ 'Neophyte': 0, 'Novice': 1, 'Operator': 2, 'Expert': 3, 'Academic': 4 }};
        const levelNames = ['Neophyte', 'Novice', 'Operator', 'Expert', 'Academic'];

        // Initialize
        function init() {{
            console.log('Loaded articles:', allArticles.length);
            extractAndDisplayCareerPaths();
            extractAndDisplayTags();
            filterAndDisplayArticles();
        }}

        // Extract all unique career paths
        function extractAndDisplayCareerPaths() {{
            const pathSet = new Set();
            allArticles.forEach(article => {{
                try {{
                    const paths = JSON.parse(article.Career_Paths || '[]');
                    paths.forEach(path => pathSet.add(path));
                }} catch (e) {{}}
            }});

            const careerPathPills = document.getElementById('careerPathPills');
            Array.from(pathSet).sort().forEach(path => {{
                const pill = document.createElement('div');
                pill.className = 'tag-pill';
                pill.textContent = path;
                pill.onclick = () => toggleCareerPath(path, pill);
                careerPathPills.appendChild(pill);
            }});
        }}

        // Toggle career path filter
        function toggleCareerPath(path, element) {{
            if (activeCareerPaths.has(path)) {{
                activeCareerPaths.delete(path);
                element.classList.remove('active');
            }} else {{
                activeCareerPaths.add(path);
                element.classList.add('active');
            }}
            filterAndDisplayArticles();
        }}

        // Extract all unique tags
        function extractAndDisplayTags() {{
            const tagSet = new Set();
            allArticles.forEach(article => {{
                article.tags.forEach(tag => tagSet.add(tag));
            }});

            const tagPills = document.getElementById('tagPills');
            Array.from(tagSet).sort().forEach(tag => {{
                const pill = document.createElement('div');
                pill.className = 'tag-pill';
                pill.textContent = tag;
                pill.onclick = () => toggleTag(tag, pill);
                tagPills.appendChild(pill);
            }});
        }}

        // Toggle tag filter
        function toggleTag(tag, element) {{
            if (activeTags.has(tag)) {{
                activeTags.delete(tag);
                element.classList.remove('active');
            }} else {{
                activeTags.add(tag);
                element.classList.add('active');
            }}
            filterAndDisplayArticles();
        }}

        // Filter and display articles
        function filterAndDisplayArticles() {{
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();

            filteredArticles = allArticles.filter(article => {{
                // Expertise level filter
                const articleLevels = article.levels.map(l => levelMap[l] || 0);
                const hasMatchingLevel = articleLevels.some(l => l >= minLevel && l <= maxLevel);
                if (!hasMatchingLevel && articleLevels.length > 0) return false;

                // Career path filter
                if (activeCareerPaths.size > 0) {{
                    try {{
                        const articlePaths = JSON.parse(article.Career_Paths || '[]');
                        const hasMatchingPath = articlePaths.some(path => activeCareerPaths.has(path));
                        if (!hasMatchingPath) return false;
                    }} catch (e) {{
                        return false;
                    }}
                }}

                // Tag filter
                if (activeTags.size > 0) {{
                    const hasMatchingTag = article.tags.some(tag => activeTags.has(tag));
                    if (!hasMatchingTag) return false;
                }}

                // Search filter
                if (searchTerm) {{
                    const searchable = [
                        article.Title,
                        article.Subtitle,
                        article.Overview_Summary,
                        article.keywords.join(' '),
                        article.tags.join(' ')
                    ].join(' ').toLowerCase();

                    if (!searchable.includes(searchTerm)) return false;
                }}

                return true;
            }});

            displayArticles();
        }}

        // Display articles
        function displayArticles() {{
            const resultsList = document.getElementById('resultsList');
            const resultsCount = document.getElementById('resultsCount');

            resultsCount.textContent = `${{filteredArticles.length}} article${{filteredArticles.length !== 1 ? 's' : ''}}`;

            if (filteredArticles.length === 0) {{
                resultsList.innerHTML = '<div class="no-results">No articles match your filters.</div>';
                return;
            }}

            resultsList.innerHTML = filteredArticles.map((article, index) => `
                <div class="article-card" onclick="openArticleSlideout(${{index}})">
                    <div class="article-title">${{article.Title}}</div>
                    ${{article.Subtitle ? `<div class="article-subtitle">${{article.Subtitle}}</div>` : ''}}
                    ${{article.levels.length > 0 ?
                        `<div class="expertise-badge">${{article.levels.join(', ')}}</div>` : ''
                    }}
                    ${{article.Overview_Summary ?
                        `<div class="article-summary">${{truncate(article.Overview_Summary, 200)}}</div>` : ''
                    }}
                    ${{article.tags.length > 0 ? `
                        <div class="article-tags">
                            ${{article.tags.map(tag => `<span class="article-tag">${{tag}}</span>`).join('')}}
                        </div>
                    ` : ''}}
                </div>
            `).join('');
        }}

        // Truncate text
        function truncate(text, maxLength) {{
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        }}

        // Open article in slideout panel
        function openArticleSlideout(index) {{
            const article = filteredArticles[index];
            const overlay = document.getElementById('slideoutOverlay');
            const panel = document.getElementById('slideoutPanel');
            const title = document.getElementById('slideoutTitle');
            const content = document.getElementById('slideoutContent');

            // Set title
            title.textContent = article.Title;

            // Load content in iframe
            content.innerHTML = `<iframe src="./${{article.FileKey}}"></iframe>`;

            // Show slideout
            overlay.classList.add('active');
            setTimeout(() => {{
                panel.classList.add('active');
            }}, 10);
        }}

        // Close slideout
        function closeSlideout() {{
            const overlay = document.getElementById('slideoutOverlay');
            const panel = document.getElementById('slideoutPanel');
            const content = document.getElementById('slideoutContent');

            panel.classList.remove('active');
            setTimeout(() => {{
                overlay.classList.remove('active');
                content.innerHTML = '';
            }}, 300);
        }}

        // Range slider handlers
        const rangeMin = document.getElementById('rangeMin');
        const rangeMax = document.getElementById('rangeMax');
        const rangeTrack = document.getElementById('rangeTrack');

        function updateRangeTrack() {{
            const min = parseInt(rangeMin.value);
            const max = parseInt(rangeMax.value);

            if (min > max) {{
                if (this.id === 'rangeMin') {{
                    rangeMax.value = min;
                }} else {{
                    rangeMin.value = max;
                }}
            }}

            minLevel = parseInt(rangeMin.value);
            maxLevel = parseInt(rangeMax.value);

            const percentMin = (minLevel / 4) * 100;
            const percentMax = (maxLevel / 4) * 100;

            rangeTrack.style.left = percentMin + '%';
            rangeTrack.style.width = (percentMax - percentMin) + '%';

            filterAndDisplayArticles();
        }}

        rangeMin.addEventListener('input', updateRangeTrack);
        rangeMax.addEventListener('input', updateRangeTrack);
        updateRangeTrack();

        // Search handler
        document.getElementById('searchInput').addEventListener('input', filterAndDisplayArticles);

        // Mobile filter toggle
        const mobileFilterToggle = document.getElementById('mobileFilterToggle');
        const mobileFiltersContainer = document.getElementById('mobileFiltersContainer');

        if (mobileFilterToggle) {{
            mobileFilterToggle.addEventListener('click', function() {{
                this.classList.toggle('expanded');
                mobileFiltersContainer.classList.toggle('expanded');
            }});
        }}

        // Initialize on load
        init();
    </script>
</body>
</html>
'''

    return html

def calculate_word_count_from_html(file_key):
    """Calculate accurate word count by reading HTML corpus file"""
    if not file_key:
        return 0

    corpus_file = CORPUS_DIR / file_key
    if not corpus_file.exists():
        return 0

    try:
        with open(corpus_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
            # Simple HTML tag removal for word counting
            text_content = re.sub(r'<[^>]+>', ' ', html_content)
            text_content = re.sub(r'\s+', ' ', text_content)
            return len(text_content.split())
    except Exception as e:
        print(f"Warning: Could not read {file_key}: {e}")
        return 0

def generate_library_data(articles):
    """Generate library data for learner.html with accurate word counts"""
    print("\n" + "="*60)
    print("Generating library data for Learner app...")
    print("="*60)

    library_articles = []

    for row in articles:
        # Only include published articles (case-insensitive)
        status = row.get('Status', '').upper()
        if status != 'PUBLISHED':
            continue

        # Parse JSON fields
        try:
            audience_levels = json.loads(row.get('Audience_Level', '[]'))
        except:
            audience_levels = []

        try:
            tags = json.loads(row.get('Tags', '[]'))
        except:
            tags = []

        try:
            keywords = json.loads(row.get('Keywords', '[]'))
        except:
            keywords = []

        try:
            career_paths = json.loads(row.get('Career_Paths', '[]'))
        except:
            career_paths = []

        # Get primary level (first one)
        level = audience_levels[0] if audience_levels else 'Operator'

        # Calculate accurate word count from corpus file
        file_key = row.get('FileKey', '')
        corpus_file_exists = bool(file_key and (CORPUS_DIR / file_key).exists())

        if corpus_file_exists:
            word_count = calculate_word_count_from_html(file_key)
        else:
            # Fallback to summary word count
            content_text = row.get('Comprehensive_Abstract', '')
            exec_summary = row.get('Executive_Summary', '')
            detailed_summary = row.get('Detailed_Summary', '')
            all_text = f"{exec_summary} {detailed_summary} {content_text}"
            word_count = len(all_text.split())

        # Calculate reading time (200 words per minute)
        reading_time = max(1, round(word_count / 200))

        # Build article object
        article = {
            'id': row.get('ID', ''),
            'title': row.get('Title', ''),
            'subtitle': row.get('Subtitle', ''),
            'content': row.get('Comprehensive_Abstract', ''),
            'executiveSummary': row.get('Executive_Summary', ''),
            'detailedSummary': row.get('Detailed_Summary', ''),
            'overviewSummary': row.get('Overview_Summary', ''),
            'tags': tags,
            'keywords': keywords,
            'level': level,
            'allLevels': audience_levels,
            'careerPaths': career_paths,
            'fileKey': file_key,
            'corpusFileExists': corpus_file_exists,
            'wordCount': word_count,
            'readingTime': reading_time,
            'createdAt': row.get('Created_Date', ''),
            'updatedAt': row.get('Updated_Date', ''),
            'publishDate': row.get('Publish_Date', '')
        }

        library_articles.append(article)

    # Generate JavaScript file
    output_js = SCRIPT_DIR / "shared" / "library-data.js"

    js_content = f"""/**
 * Cleansheet Library Data
 * Auto-generated from meta/meta.csv
 * Total articles: {len(library_articles)}
 * Generated: {os.popen('date').read().strip()}
 */

const LIBRARY_DATA = {json.dumps(library_articles, indent=2)};
const LIBRARY_VERSION = {len(library_articles)}; // Article count as version

// Function to seed localStorage with library data
function seedLibraryData() {{
    if (typeof localStorage === 'undefined') {{
        console.warn('localStorage not available');
        return;
    }}

    // Store articles and version
    localStorage.setItem('cleansheet_library_articles', JSON.stringify(LIBRARY_DATA));
    localStorage.setItem('cleansheet_library_version', LIBRARY_VERSION.toString());
    console.log(`[OK] Seeded ${{LIBRARY_DATA.length}} articles to localStorage`);
}}

// Auto-seed on load if not already seeded or version mismatch
if (typeof window !== 'undefined') {{
    const existing = localStorage.getItem('cleansheet_library_articles');
    const existingVersion = parseInt(localStorage.getItem('cleansheet_library_version') || '0');

    // Re-seed if: no data, empty array, or version mismatch (article count changed)
    if (!existing || existing === '[]' || JSON.parse(existing).length === 0 || existingVersion !== LIBRARY_VERSION) {{
        seedLibraryData();
        console.log(`[OK] Library data seeded/updated (${{LIBRARY_VERSION}} articles)`);
    }} else {{
        console.log(`[OK] Library data already exists (${{JSON.parse(existing).length}} articles)`);
    }}
}}

// Export for use in HTML pages
if (typeof window !== 'undefined') {{
    window.LIBRARY_DATA = LIBRARY_DATA;
    window.seedLibraryData = seedLibraryData;
}}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{ LIBRARY_DATA, seedLibraryData }};
}}
"""

    with open(output_js, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"[OK] Generated {output_js}")
    print(f"[OK] Total articles: {len(library_articles)}")

    # Print statistics
    levels = {}
    for article in library_articles:
        level = article['level']
        levels[level] = levels.get(level, 0) + 1

    print("\nArticles by level:")
    for level, count in sorted(levels.items()):
        print(f"  {level}: {count}")

    # Print tags
    all_tags = set()
    for article in library_articles:
        all_tags.update(article['tags'])

    print(f"\nUnique tags: {len(all_tags)}")
    print(f"Tags: {', '.join(sorted(all_tags))}")

    # Print career paths
    all_paths = set()
    for article in library_articles:
        all_paths.update(article['careerPaths'])

    print(f"\nUnique career paths: {len(all_paths)}")
    print(f"Paths: {', '.join(sorted(all_paths))}")

    # Print word count statistics
    total_words = sum(a['wordCount'] for a in library_articles)
    avg_words = total_words // len(library_articles) if library_articles else 0
    min_words = min(a['wordCount'] for a in library_articles) if library_articles else 0
    max_words = max(a['wordCount'] for a in library_articles) if library_articles else 0

    print(f"\nWord count statistics:")
    print(f"  Total words: {total_words:,}")
    print(f"  Average per article: {avg_words:,}")
    print(f"  Range: {min_words:,} - {max_words:,}")

    # Print reading time statistics
    total_minutes = sum(a['readingTime'] for a in library_articles)
    avg_minutes = total_minutes // len(library_articles) if library_articles else 0

    print(f"\nReading time statistics:")
    print(f"  Total reading time: {total_minutes:,} minutes ({total_minutes // 60} hours)")
    print(f"  Average per article: {avg_minutes} minutes")

    # Check corpus files
    with_corpus = sum(1 for a in library_articles if a['corpusFileExists'])
    print(f"\nCorpus files:")
    print(f"  Articles with corpus file: {with_corpus}/{len(library_articles)}")
    if with_corpus < len(library_articles):
        print(f"  Missing corpus files: {len(library_articles) - with_corpus}")

def main():
    print("="*60)
    print("CORPUS INDEX GENERATION")
    print("="*60)

    print("\nNormalizing CSV Status field...")
    normalize_csv_status()

    print("\nLoading metadata...")
    articles = load_metadata()
    print(f"Loaded {len(articles)} articles")

    print("\nExtracting tags...")
    all_tags = extract_all_tags(articles)
    print(f"Found {len(all_tags)} unique tags")

    print("\nExtracting career paths...")
    all_career_paths = extract_all_career_paths(articles)
    print(f"Found {len(all_career_paths)} unique career paths")

    print("\nGenerating corpus/index.html...")
    html = generate_html(articles, all_tags, all_career_paths)

    print(f"Writing to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"\n[OK] Generated {OUTPUT_PATH}")
    print(f"  - {len(articles)} articles")
    print(f"  - {len(all_tags)} tags")
    print(f"  - {len(all_career_paths)} career paths")
    print(f"  - File size: {len(html):,} bytes")

    # Generate library data for learner.html and app.html
    generate_library_data(articles)

    print("\n" + "="*60)
    print("ALL GENERATION COMPLETE")
    print("="*60)
    print("\nGenerated files:")
    print(f"  1. {OUTPUT_PATH} (corpus browser)")
    print(f"  2. shared/library-data.js (learner/app data)")
    print("\nYou can now use:")
    print("  - corpus/index.html (full library browser)")
    print("  - learner.html (modern learner interface)")
    print("  - app.html (unified app with library)")

if __name__ == "__main__":
    main()

