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
METADATA_PATH = SCRIPT_DIR / "meta" / "meta.csv"
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
<!-- Azure Application Insights -->
<script type="text/javascript">
!function(T,l,y){{var S=T.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){{var g=!1,f=!1,m={{initialize:!0,queue:[],sv:"5",version:2,config:d}};function v(e,t){{var n={{}},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{{time:function(){{var e=new Date;function t(e){{var t=""+e;return 1===t.length&&(t="0"+t),t}}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{{baseData:{{ver:2}}}}}}}}var h=d.url||y.src;if(h){{function a(e){{var t,n,a,i,r,o,s,c,u,p,l;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){{var e={{}},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){{var i=n[a].split("=");2===i.length&&(e[i[0][b]()]=i[1])}}if(!e[C]){{var r=e.endpointsuffix,o=r?e.location:null;e[C]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}}return e}}(),c=s[D]||d[D]||"",u=s[C],p=u?u+"/v2/track":d.endpointUrl,(l=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=p,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{{typeName:"SDKLoadFailed",message:n.replace(/\\./g,"-"),hasFullStack:!1,stack:n+"\\nSnippet failed to load ["+a+"] -- Telemetry is disabled\\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\\nHost: "+(S&&S.pathname||"_unknown_")+"\\nEndpoint: "+i,parsedStack:[]}}],r)),l.push(function(e,t,n,a){{var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\\"/g,"")+'"',o.properties={{endpoint:a}},i}}(0,0,t,p)),function(e,t){{if(JSON){{var n=T.fetch;if(n&&!y.useXhr)n(t,{{method:N,body:JSON.stringify(e),mode:"cors"}});else if(XMLHttpRequest){{var a=new XMLHttpRequest;a.open(N,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}}}}(l,p)}}function i(e,t){{f||setTimeout(function(){{!t&&m.core||a()}},500)}}var e=function(){{var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){{"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)}},n}}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){{l.getElementsByTagName(k)[0].parentNode.appendChild(e)}},y.ld||0)}}try{{m.cookie=l.cookie}}catch(p){{}}function t(e){{for(;e.length;)!function(t){{m[t]=function(){{var e=arguments;g||m.queue.push(function(){{m[t].apply(m,e)}})}}}}{(e.pop())}}}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={{Verbose:0,Information:1,Warning:2,Error:3,Critical:4}};var s=(d.extensionConfig||{{}}).ApplicationInsightsAnalytics||{{}};if(!0!==d[I]&&!0!==s[I]){{var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){{var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({{message:e,url:t,lineNumber:n,columnNumber:a,error:i}}),r}},d.autoExceptionInstrumented=!0}}return m}}(y.cfg);function a(){{y.onInit&&y.onInit(n)}}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({{}})):a()}}(window,document,{{
src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js",
crossOrigin: "anonymous",
cfg: {{
connectionString: "InstrumentationKey=104926d6-679a-4baa-919e-665bea6facac;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/;ApplicationId=2e7de093-fa39-4859-a48b-515db3520828"
}}
}});
</script>
<!-- End Application Insights -->

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

def main():
    print("Loading metadata...")
    articles = load_metadata()
    print(f"Loaded {len(articles)} articles")

    print("Extracting tags...")
    all_tags = extract_all_tags(articles)
    print(f"Found {len(all_tags)} unique tags")

    print("Extracting career paths...")
    all_career_paths = extract_all_career_paths(articles)
    print(f"Found {len(all_career_paths)} unique career paths")

    print("Generating HTML...")
    html = generate_html(articles, all_tags, all_career_paths)

    print(f"Writing to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Generated {OUTPUT_PATH}")
    print(f"  - {len(articles)} articles")
    print(f"  - {len(all_tags)} tags")
    print(f"  - {len(all_career_paths)} career paths")
    print(f"  - File size: {len(html):,} bytes")

if __name__ == "__main__":
    main()

