#!/usr/bin/env python3
"""
Generate corpus index.html from metadata.csv
Regenerates the library browser interface on demand.
"""

import csv
import json
from pathlib import Path
from datetime import datetime

# Paths
SCRIPT_DIR = Path(__file__).parent
CORPUS_DIR = SCRIPT_DIR / "corpus"
METADATA_PATH = SCRIPT_DIR.parent.parent.parent / "corpora" / "metadata.csv"
OUTPUT_PATH = CORPUS_DIR / "index.html"

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

            articles.append(row)

    return articles

def extract_all_tags(articles):
    """Extract unique tags from all articles"""
    tags = set()
    for article in articles:
        tags.update(article.get('tags', []))
    return sorted(tags)

def generate_html(articles, all_tags):
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
    <link rel="icon" type="image/png" href="../assets/High%20Resolution%20Logo%20Files/White%20on%20transparent.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300&family=Questrial&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
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
            background: #f5f5f7;
            overflow: hidden;
        }}

        /* Left Navigation */
        .left-nav {{
            width: 320px;
            background: #1b2838;
            color: white;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            flex-shrink: 0;
        }}

        .nav-header {{
            padding: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
        }}

        .nav-header-text {{
            flex: 1;
        }}

        .nav-header h1 {{
            font-family: 'Questrial', sans-serif;
            font-size: 20px;
            margin-bottom: 8px;
            color: #c4d600;
        }}

        .nav-header p {{
            font-size: 12px;
            color: rgba(255,255,255,0.7);
        }}

        .nav-header-logo {{
            height: 50px;
            width: auto;
        }}

        @media (max-width: 768px) {{
            .nav-header-logo {{
                height: 35px;
            }}
        }}

        .back-home-link {{
            display: inline-block;
            margin-top: 12px;
            padding: 8px 16px;
            background: rgba(196, 214, 0, 0.2);
            color: #c4d600;
            text-decoration: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s;
            border: 1px solid rgba(196, 214, 0, 0.3);
        }}

        .back-home-link:hover {{
            background: rgba(196, 214, 0, 0.3);
            border-color: rgba(196, 214, 0, 0.5);
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
            color: white;
            font-size: 14px;
        }}

        .search-input::placeholder {{
            color: rgba(255,255,255,0.5);
        }}

        .search-input:focus {{
            outline: 2px solid #c4d600;
            background: rgba(255,255,255,0.15);
        }}

        /* Expertise Level Slider */
        .expertise-section {{
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }}

        .expertise-section h3 {{
            font-size: 14px;
            margin-bottom: 12px;
            color: rgba(255,255,255,0.9);
        }}

        .expertise-levels {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 10px;
            color: rgba(255,255,255,0.6);
        }}

        .slider-container {{
            position: relative;
            padding: 10px 0;
        }}

        .range-slider {{
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            position: relative;
        }}

        .range-track {{
            position: absolute;
            height: 4px;
            background: #c4d600;
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
            background: #c4d600;
            cursor: pointer;
            pointer-events: all;
            border: 2px solid #1b2838;
        }}

        .range-input::-moz-range-thumb {{
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #c4d600;
            cursor: pointer;
            pointer-events: all;
            border: 2px solid #1b2838;
        }}

        /* Tags Section */
        .tags-section {{
            padding: 16px 20px;
            flex: 1;
            overflow-y: auto;
        }}

        .tags-section h3 {{
            font-size: 14px;
            margin-bottom: 12px;
            color: rgba(255,255,255,0.9);
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
            background: #c4d600;
            border-color: #c4d600;
            color: #1b2838;
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
            background: white;
            border-bottom: 1px solid #e5e5e7;
        }}

        .results-header h2 {{
            font-family: 'Questrial', sans-serif;
            font-size: 24px;
            color: #1b2838;
            margin-bottom: 8px;
        }}

        .results-count {{
            font-size: 14px;
            color: #6e6e73;
        }}

        .results-list {{
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }}

        .article-card {{
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.2s;
        }}

        .article-card:hover {{
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }}

        .article-title {{
            font-size: 18px;
            font-weight: 600;
            color: #1b2838;
            margin-bottom: 8px;
        }}

        .article-subtitle {{
            font-size: 14px;
            color: #6e6e73;
            margin-bottom: 12px;
        }}

        .article-summary {{
            font-size: 13px;
            color: #6e6e73;
            line-height: 1.5;
            margin-bottom: 12px;
        }}

        .article-meta {{
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #86868b;
        }}

        .article-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 12px;
        }}

        .article-tag {{
            padding: 4px 10px;
            background: #f5f5f7;
            border-radius: 12px;
            font-size: 11px;
            color: #1b2838;
        }}

        .expertise-badge {{
            display: inline-block;
            padding: 4px 8px;
            background: #006666;
            color: white;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }}

        .no-results {{
            text-align: center;
            padding: 60px 20px;
            color: #6e6e73;
        }}

        .loading {{
            text-align: center;
            padding: 60px 20px;
            color: #6e6e73;
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
            background: white;
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
            border-bottom: 1px solid #e5e5e7;
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
            font-size: 20px;
            color: #1b2838;
            margin: 0;
        }}

        .slideout-header-actions {{
            display: flex;
            gap: 12px;
            align-items: center;
        }}

        .add-to-plan-button {{
            padding: 10px 20px;
            background: #c4d600;
            color: #1b2838;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: not-allowed;
            opacity: 0.7;
            white-space: nowrap;
            transition: all 0.2s;
        }}

        .add-to-plan-button:hover {{
            opacity: 0.8;
        }}

        .close-button {{
            width: 32px;
            height: 32px;
            border: none;
            background: #f5f5f7;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #1b2838;
            transition: all 0.2s;
            flex-shrink: 0;
        }}

        .close-button:hover {{
            background: #e5e5e7;
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
            background: #c4d600;
            color: #1b2838;
            border: none;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
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

            .results-list {{
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
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
    <div class="left-nav">
        <div class="nav-header">
            <div class="nav-header-text">
                <h1>Cleansheet Library</h1>
                <p>Technical Content Corpus</p>
                <a href="../index.html" class="back-home-link">← Back to Home</a>
            </div>
            <img src="../assets/High%20Resolution%20Logo%20Files/White%20on%20transparent.png" alt="Cleansheet Logo" class="nav-header-logo">
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
        let minLevel = 0;
        let maxLevel = 4;
        const levelMap = {{ 'Neophyte': 0, 'Novice': 1, 'Operator': 2, 'Expert': 3, 'Academic': 4 }};
        const levelNames = ['Neophyte', 'Novice', 'Operator', 'Expert', 'Academic'];

        // Initialize
        function init() {{
            console.log('Loaded articles:', allArticles.length);
            extractAndDisplayTags();
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

def main():
    print("Loading metadata...")
    articles = load_metadata()
    print(f"Loaded {len(articles)} articles")

    print("Extracting tags...")
    all_tags = extract_all_tags(articles)
    print(f"Found {len(all_tags)} unique tags")

    print("Generating HTML...")
    html = generate_html(articles, all_tags)

    print(f"Writing to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Generated {OUTPUT_PATH}")
    print(f"  - {len(articles)} articles")
    print(f"  - {len(all_tags)} tags")
    print(f"  - File size: {len(html):,} bytes")

if __name__ == "__main__":
    main()

