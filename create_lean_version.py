#!/usr/bin/env python3
"""
Create career-canvas-lean.html that references extracted modules
Preserves original file completely, creates new lean version
"""

def create_lean_version():
    source_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas.html'
    output_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas-lean.html'

    # Define all extracted line ranges (these will be SKIPPED in the main script)
    # These are the ranges we extracted to the modular files
    extracted_ranges = [
        # cc-utils.js
        (15851, 15919),
        (15940, 15999),
        (15970, 16029),
        (16253, 16319),

        # cc-ui.js
        (15800, 15849),
        (15817, 15899),
        (15921, 15949),
        (16841, 16909),
        (16904, 17099),
        (17152, 17249),
        (17529, 17599),
        (22120, 22149),
        (22124, 22259),
        (22254, 22349),
        (22335, 22519),
        (25110, 25149),
        (27361, 27399),
        (27466, 27649),
        (33347, 33599),
        (33830, 33949),
        (34037, 34229),
        (34213, 34399),

        # cc-llm.js
        (17415, 17699),
        (17529, 17649),
        (18120, 18399),
        (18479, 18599),
        (18863, 19099),
        (18912, 19149),
        (19105, 19199),
        (19169, 19399),
        (19395, 19499),
        (19503, 19899),
        (19975, 21999),
        (20033, 20699),
        (20525, 20599),
        (20675, 20999),
        (20683, 20799),

        # cc-utils.js (additional)
        (17653, 17799),
        (17790, 17869),
        (17221, 17419),
        (18325, 18479),
        (25910, 25999),

        # cc-data.js
        (22865, 22999),
        (22985, 23009),
        (24358, 24399),
        (29558, 30299),
        (34963, 35099),
        (35228, 35399),
        (35397, 35599),
        (37377, 39099),
        (37623, 37649),
        (39492, 40099),
        (40404, 40799),
        (40744, 41099),
        (40932, 40999),
        (48441, 49299),

        # cc-viz.js
        (27622, 27699),

        # cc-editors.js
        (45144, 45299),
        (50336, 51299),
        (51202, 51299),
        (53965, 54299),
    ]

    # Sort and merge overlapping ranges
    extracted_ranges.sort()
    merged_ranges = []
    for start, end in extracted_ranges:
        if merged_ranges and start <= merged_ranges[-1][1]:
            # Overlapping or adjacent, merge
            merged_ranges[-1] = (merged_ranges[-1][0], max(merged_ranges[-1][1], end))
        else:
            merged_ranges.append((start, end))

    print(f"Merged {len(extracted_ranges)} ranges into {len(merged_ranges)} non-overlapping ranges")

    # Read source file
    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    total_lines = len(lines)
    print(f"Source file has {total_lines} lines")

    # Write lean version
    with open(output_file, 'w', encoding='utf-8') as out:
        # Copy everything up to line 15647 (before main script tag)
        print("Writing lines 1-15647 (HTML head and body)...")
        for i in range(0, 15647):
            out.write(lines[i])

        # Add script includes for extracted modules
        print("Adding script includes for extracted modules...")
        out.write("\n")
        out.write("    <!-- Extracted JavaScript Modules -->\n")
        out.write("    <script src=\"career-canvas/cc-utils.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-ui.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-llm.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-data.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-viz.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-editors.js\"></script>\n")
        out.write("\n")

        # Now write remaining JavaScript, SKIPPING extracted ranges
        print("Writing remaining JavaScript (skipping extracted ranges)...")
        current_line = 15648  # Start after line 15647 (1-indexed becomes 0-indexed array position)
        lines_written = 0
        lines_skipped = 0

        # Convert to 0-indexed for array access
        for start, end in merged_ranges:
            # Write lines from current position up to start of extracted range
            if current_line < start:
                for i in range(current_line - 1, start - 1):  # -1 for 0-indexed
                    if i < total_lines:
                        out.write(lines[i])
                        lines_written += 1

            # Skip the extracted range
            skip_count = end - start + 1
            lines_skipped += skip_count
            print(f"  Skipping lines {start}-{end} ({skip_count} lines)")

            # Move current position past the extracted range
            current_line = end + 1

        # Write remaining lines after all extracted ranges
        print(f"Writing remaining lines from {current_line} to {total_lines}...")
        for i in range(current_line - 1, total_lines):
            out.write(lines[i])
            lines_written += 1

        print(f"\nLines written: {15647 + lines_written + 7}")  # +7 for script includes
        print(f"Lines skipped: {lines_skipped}")
        print(f"Original file: {total_lines} lines")
        print(f"Lean file: ~{15647 + lines_written + 7} lines")

    print(f"\n✓ Created {output_file}")
    print(f"\nNext step: Test career-canvas-lean.html to ensure it works identically")

if __name__ == '__main__':
    create_lean_version()
