#!/usr/bin/env python3
"""
Migrate from Font Awesome to Phosphor Icons across all HTML files
"""

import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
CORPUS_DIR = SCRIPT_DIR / "corpus"

# CDN replacement
FA_CDN_PATTERN = r'<link rel="stylesheet" href="https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/[\d.]+/css/all\.min\.css">'
PHOSPHOR_CDN = '<script src="https://unpkg.com/@phosphor-icons/web"></script>'

# Icon class mappings
ICON_MAPPINGS = {
    r'class="fas fa-book-open"': 'class="ph ph-book-open"',
    r'class="fas fa-route"': 'class="ph ph-path"',
    r'class="fas fa-compass"': 'class="ph ph-compass"',
    r'class="fas fa-tags"': 'class="ph ph-tags"',
    r'class="fas fa-map"': 'class="ph ph-map-trifold"',
    r'class="fas fa-user-friends"': 'class="ph ph-users"',
    r'class="fas fa-sitemap"': 'class="ph ph-flow-arrow"',
    r'class="fas fa-shield-alt"': 'class="ph ph-shield-check"',
}

def migrate_file(file_path):
    """Migrate a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        modified = False

        # Replace CDN link
        if re.search(FA_CDN_PATTERN, content):
            content = re.sub(FA_CDN_PATTERN, PHOSPHOR_CDN, content)
            modified = True

        # Replace icon classes
        for fa_pattern, phosphor_class in ICON_MAPPINGS.items():
            if re.search(fa_pattern, content):
                content = re.sub(fa_pattern, phosphor_class, content)
                modified = True

        # Write back if modified
        if modified and content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return 'migrated'
        else:
            return 'skipped'

    except Exception as e:
        print(f"  [ERROR] {file_path}: {e}")
        return 'error'

def main():
    print("="*60)
    print("Migrating from Font Awesome to Phosphor Icons")
    print("="*60)
    print()

    stats = {'migrated': 0, 'skipped': 0, 'error': 0}

    # Root HTML files (excluding index.html which is already done)
    root_files = [
        'career-paths.html',
        'role-translator.html',
        'ml-pipeline.html',
        'experience-tagger.html',
        'privacy-policy.html',
        'privacy-principles.html',
        'terms-of-service.html'
    ]

    print("Processing root HTML files...")
    for filename in root_files:
        file_path = SCRIPT_DIR / filename
        if file_path.exists():
            print(f"  {filename}...", end=" ")
            result = migrate_file(file_path)
            stats[result] += 1
            print(f"[{result.upper()}]")

    # Process corpus files
    print("\nProcessing corpus files...")
    corpus_files = list(CORPUS_DIR.glob('*.html'))

    for file_path in corpus_files:
        result = migrate_file(file_path)
        stats[result] += 1

    print()
    print("="*60)
    print("SUMMARY")
    print("="*60)
    print(f"  Migrated: {stats['migrated']}")
    print(f"  Skipped: {stats['skipped']}")
    print(f"  Errors: {stats['error']}")
    print(f"  Total processed: {sum(stats.values())}")
    print()
    print("[OK] Migration complete!")

if __name__ == "__main__":
    main()
