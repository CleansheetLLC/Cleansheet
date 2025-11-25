#!/usr/bin/env python3
"""Extract CSS from career-canvas.html and split into organized files"""

import re
from pathlib import Path

def extract_css_sections():
    """Extract all CSS from career-canvas.html"""

    # Read the file
    with open('career-canvas.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all style blocks
    style_pattern = r'<style>(.*?)</style>'
    style_blocks = re.findall(style_pattern, content, re.DOTALL)

    print(f"Found {len(style_blocks)} style blocks")

    # Main CSS block (the largest one)
    if style_blocks:
        main_css = style_blocks[0]  # The first and largest block

        # Split into sections based on comments and structure
        sections = {
            'base': [],
            'layout': [],
            'components': [],
            'modals': [],
            'd3': [],
            'editors': [],
            'responsive': [],
            'animations': [],
            'themes': [],
            'utilities': [],
            'print': [],
            'legacy': []
        }

        # Parse the CSS
        lines = main_css.split('\n')
        current_section = 'base'
        current_block = []

        for line in lines:
            # Detect section changes based on comments or content
            if '/* Canvas' in line or '/* Cleansheet Canvas' in line:
                current_section = 'layout'
            elif '/* Modal' in line or '.modal' in line.lower():
                current_section = 'modals'
            elif '/* D3' in line or '.node' in line or '.link' in line:
                current_section = 'd3'
            elif '/* Editor' in line or '.editor' in line or '.quill' in line:
                current_section = 'editors'
            elif '@media' in line:
                current_section = 'responsive'
            elif '@keyframes' in line or 'animation' in line or 'transition' in line:
                current_section = 'animations'
            elif '/* Component' in line or '.card' in line or '.button' in line or '.btn' in line:
                current_section = 'components'
            elif '@print' in line:
                current_section = 'print'
            elif ':root' in line or '/* Brand' in line or '/* Typography' in line:
                current_section = 'base'
            elif '/* Utility' in line or '.text-' in line or '.bg-' in line:
                current_section = 'utilities'

            sections[current_section].append(line)

        # Write out the CSS files
        output_dir = Path('career-canvas/css')
        output_dir.mkdir(parents=True, exist_ok=True)

        for section_name, section_lines in sections.items():
            if section_lines:  # Only write non-empty sections
                filename = f'career-canvas-{section_name}.css'
                filepath = output_dir / filename

                # Add header comment
                header = f"""/* Career Canvas - {section_name.title()} Styles
 * Part of the Cleansheet Platform
 * Corporate Professional Design System
 */

"""
                content = header + '\n'.join(section_lines)

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

                print(f"Created {filepath} ({len(section_lines)} lines)")

        # Create main import file
        import_css = """/* Career Canvas - Main CSS Import File
 * Import this file in your HTML to load all styles
 */

/* Base styles and CSS variables */
@import url('./career-canvas-base.css');

/* Layout and grid systems */
@import url('./career-canvas-layout.css');

/* UI Components */
@import url('./career-canvas-components.css');

/* Modal styles */
@import url('./career-canvas-modals.css');

/* D3 visualization styles */
@import url('./career-canvas-d3.css');

/* Editor-specific styles */
@import url('./career-canvas-editors.css');

/* Animations and transitions */
@import url('./career-canvas-animations.css');

/* Theme variations */
@import url('./career-canvas-themes.css');

/* Utility classes */
@import url('./career-canvas-utilities.css');

/* Responsive design */
@import url('./career-canvas-responsive.css');

/* Print styles */
@import url('./career-canvas-print.css');

/* Legacy/compatibility styles */
@import url('./career-canvas-legacy.css');
"""

        with open(output_dir / 'career-canvas-main.css', 'w', encoding='utf-8') as f:
            f.write(import_css)

        print(f"Created main import file: career-canvas-main.css")

        return True

    return False

if __name__ == "__main__":
    if extract_css_sections():
        print("\nCSS extraction completed successfully!")
    else:
        print("\nCSS extraction failed!")