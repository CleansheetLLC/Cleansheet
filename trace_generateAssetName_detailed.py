#!/usr/bin/env python3
"""
Detailed trace of brace counting through generateAssetName
"""

def trace_function():
    source_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas.html'

    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Start from generateAssetName declaration
    start_line = 20414  # 0-indexed (line 20415 in 1-indexed)

    brace_count = 1  # Baseline: inside <script> tag
    in_string = False
    in_comment = False
    string_char = None

    print("Tracing generateAssetName function:")
    print("=" * 80)
    print()

    for line_idx in range(start_line, min(start_line + 70, len(lines))):
        line = lines[line_idx]
        line_num = line_idx + 1

        prev_count = brace_count
        open_braces = 0
        close_braces = 0

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
                    open_braces += 1
                elif char == '}':
                    brace_count -= 1
                    close_braces += 1

            j += 1

        # Show lines with brace changes
        if brace_count != prev_count:
            marker = ""
            if brace_count == 1:
                marker = "  ← FUNCTION CLOSES HERE"

            print(f"Line {line_num:5d}: [{prev_count}→{brace_count}] (+{open_braces}/-{close_braces}){marker}")
            print(f"  {line.rstrip()[:90]}")
            print()

        # Stop when we return to baseline
        if brace_count == 1 and prev_count > 1:
            print("=" * 80)
            print(f"Function closes at line {line_num}")
            print(f"Expected line 20482")
            break

    if brace_count != 1:
        print("=" * 80)
        print(f"WARNING: Brace count did not return to baseline!")
        print(f"Final count: {brace_count} (expected 1)")
        print(f"This means there are {brace_count - 1} unclosed braces")

if __name__ == '__main__':
    trace_function()
