#!/usr/bin/env python3
"""
Robust brace counting that properly handles strings, templates, and comments
"""

def count_braces_in_function():
    source_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas.html'

    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Start from generateAssetName (line 20415, 0-indexed 20414)
    start_line = 20414

    brace_count = 0
    in_string = False
    in_template = False
    in_comment = False
    string_char = None

    print("Counting braces in generateAssetName function")
    print("=" * 80)
    print()

    for line_idx in range(start_line, min(start_line + 100, len(lines))):
        line = lines[line_idx]
        line_num = line_idx + 1

        prev_count = brace_count
        open_count = 0
        close_count = 0

        j = 0
        while j < len(line):
            char = line[j]

            # Handle multi-line comments (/* */)
            if not in_string and not in_template and j < len(line) - 1 and line[j:j+2] == '/*':
                in_comment = True
                j += 2
                continue
            if in_comment and j < len(line) - 1 and line[j:j+2] == '*/':
                in_comment = False
                j += 2
                continue

            # Skip single-line comments (//)
            if not in_string and not in_template and not in_comment and j < len(line) - 1 and line[j:j+2] == '//':
                break  # Rest of line is comment

            # Handle strings (with proper escaping)
            if not in_comment:
                # Check for backtick (template literal)
                if char == '`' and (j == 0 or line[j-1] != '\\'):
                    in_template = not in_template
                    continue

                # Regular strings (' or ")
                if char in ('"', "'") and (j == 0 or line[j-1] != '\\') and not in_template:
                    if not in_string:
                        in_string = True
                        string_char = char
                    elif char == string_char:
                        in_string = False
                        string_char = None

            # Count braces (only when not in string, template, or comment)
            if not in_string and not in_template and not in_comment:
                if char == '{':
                    brace_count += 1
                    open_count += 1
                elif char == '}':
                    brace_count -= 1
                    close_count += 1

            j += 1

        # Print lines with brace changes
        if open_count > 0 or close_count > 0:
            marker = ""
            if brace_count == 0 and prev_count == 1:
                marker = "  ← FUNCTION CLOSES"

            status = f"str={in_string} tpl={in_template} cmt={in_comment}"
            print(f"Line {line_num:5d}: [{prev_count}→{brace_count}] +{open_count}/-{close_count}  {status}{marker}")
            print(f"  {line.rstrip()[:100]}")
            print()

        # Stop when brace count returns to 0
        if brace_count == 0 and prev_count == 1:
            print("=" * 80)
            print(f"Function closes at line {line_num}")
            print(f"Expected: line 20482")
            print(f"Match: {line_num == 20482}")
            return

    print("=" * 80)
    print(f"ERROR: Function did not close within {min(100, len(lines) - start_line)} lines")
    print(f"Final brace count: {brace_count} (expected 0)")
    print(f"State: string={in_string}, template={in_template}, comment={in_comment}")

if __name__ == '__main__':
    count_braces_in_function()
