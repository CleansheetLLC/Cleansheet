#!/usr/bin/env python3
"""
Verify that generateAssetName closes properly at line 20482
"""

def verify_function():
    source_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas.html'

    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Start from generateAssetName declaration (line 20415, 0-indexed)
    start_line = 20414  # 0-indexed

    # Count braces starting from a baseline of 1 (we're already inside the script tag)
    brace_count = 1  # Baseline: inside <script> tag
    in_string = False
    in_comment = False
    string_char = None

    print(f"Starting at line 20415 with baseline brace count: {brace_count}")
    print(f"Line 20415: {lines[start_line].strip()[:80]}")
    print()

    for line_idx in range(start_line, min(start_line + 200, len(lines))):
        line = lines[line_idx]
        line_num = line_idx + 1  # 1-indexed

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

        # Report when we see the opening brace of the function
        if line_num == 20415 and brace_count > prev_count:
            print(f"Line {line_num}: function declaration - brace count: {prev_count} → {brace_count}")
            print(f"  {line.strip()[:100]}")
            print()

        # Report when brace count returns to baseline (function closes)
        if brace_count == 1 and prev_count == 2:
            print(f"Line {line_num}: Function closes - brace count: {prev_count} → {brace_count}")
            print(f"  {line.strip()[:100]}")
            print()
            print(f"generateAssetName function ends at line {line_num}")
            print(f"Expected end line: 20482")
            print(f"Match: {line_num == 20482}")
            break

    if brace_count != 1:
        print(f"\nWARNING: Final brace count is {brace_count}, expected 1")

if __name__ == '__main__':
    verify_function()
