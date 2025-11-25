#!/usr/bin/env python3
"""
Trace brace nesting from start of script tag to generateAssetName
"""

def trace_braces():
    source_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas.html'

    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Start from main script tag (line 15642)
    start_line = 15641  # 0-indexed
    end_line = 20415    # Line where generateAssetName starts

    brace_count = 0
    in_string = False
    in_comment = False
    string_char = None

    # Track where brace count increases
    nesting_changes = []

    for line_idx in range(start_line, end_line):
        line = lines[line_idx]
        line_num = line_idx + 1  # 1-indexed for display

        prev_count = brace_count

        j = 0
        while j < len(line):
            char = line[j]

            # Handle multi-line comments
            if not in_string and j < len(line) - 1 and line[j:j+2] == '/*':
                in_comment = True
                j += 2
                continue
            if in_comment and j < len(line) - 1 and line[j:j+2] == '*/':
                in_comment = False
                j += 2
                continue

            # Skip single-line comments
            if not in_string and not in_comment and j < len(line) - 1 and line[j:j+2] == '//':
                break

            # Handle strings
            if not in_comment:
                if char in ('"', "'", '`') and (j == 0 or line[j-1] != '\\'):
                    if not in_string:
                        in_string = True
                        string_char = char
                    elif char == string_char:
                        in_string = False
                        string_char = None

            # Count braces
            if not in_string and not in_comment:
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1

            j += 1

        # Track significant changes
        if brace_count != prev_count:
            # Show the actual line content
            nesting_changes.append({
                'line': line_num,
                'prev': prev_count,
                'new': brace_count,
                'content': line.strip()[:100]
            })

    print(f"Brace count at line 20415 (generateAssetName start): {brace_count}")
    print(f"\nShowing nesting levels 2-4 (most relevant):\n")

    for change in nesting_changes:
        # Only show changes that result in level 2, 3, or 4
        if change['new'] in [2, 3, 4]:
            print(f"Line {change['line']}: {change['prev']} → {change['new']}")
            print(f"  {change['content']}")
            print()

if __name__ == '__main__':
    trace_braces()
