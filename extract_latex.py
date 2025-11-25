#!/usr/bin/env python3
"""Extract SimpleLatex parser from career-canvas.html"""

def extract_latex():
    """Extract the SimpleLatex parser to vendor directory"""

    with open('career-canvas.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # The SimpleLatex object is defined from line 139 to around line 1662
    # We need to extract lines 133-1663 (the entire script block)
    start_line = 133  # Line 134 in 1-indexed = 133 in 0-indexed
    end_line = 1663   # Approximate end of the SimpleLatex definition

    latex_lines = lines[start_line:end_line]

    # Create the vendor file
    output = """/**
 * SimpleLatex Parser
 * Extracted from career-canvas.html
 * Simple LaTeX to HTML converter for basic document rendering
 */

(function(window) {
    'use strict';

"""

    # Add the extracted content (skip the <script> tags)
    for line in latex_lines:
        if '<script>' not in line and '</script>' not in line:
            output += line

    output += """
    // Export for module usage
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SimpleLatex;
    }

})(typeof window !== 'undefined' ? window : this);
"""

    # Save to vendor directory
    with open('career-canvas/js/vendor/latex-parser.js', 'w', encoding='utf-8') as f:
        f.write(output)

    print("Extracted SimpleLatex parser to career-canvas/js/vendor/latex-parser.js")

    return True

if __name__ == "__main__":
    extract_latex()