#!/usr/bin/env python3
"""Extract persona data from career-canvas.html and save as separate JSON files"""

import json
import re
from pathlib import Path

def extract_personas():
    """Extract persona data from career-canvas.html"""

    # Read the file
    with open('career-canvas.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the exampleProfiles object
    # It starts with "const exampleProfiles = {" and ends with "};" before other const declarations
    pattern = r'const exampleProfiles = \{(.*?)\n        \};\n'
    match = re.search(pattern, content, re.DOTALL)

    if match:
        # Get the matched content
        profiles_str = '{' + match.group(1) + '}'

        # Try to extract it as valid JSON
        # We need to handle JavaScript object notation
        # Convert single quotes to double quotes for keys
        profiles_str = re.sub(r"'([^']+)':", r'"\1":', profiles_str)

        # Save the raw JavaScript for debugging
        with open('career-canvas/data/personas/raw_profiles.js', 'w', encoding='utf-8') as f:
            f.write('const exampleProfiles = ' + profiles_str + ';')

        print("Saved raw profiles JavaScript to career-canvas/data/personas/raw_profiles.js")

        # Extract each persona manually by finding the distinct personas
        personas = {
            'career-changer': 'Retail Manager transitioning to Business Analyst',
            'product-manager': 'Research Scientist transitioning to Data Science',
            'new-graduate': 'Recent Computer Science graduate entering tech',
            'data-analyst': 'Excel specialist moving to Data Analytics'
        }

        # For now, let's extract the structure from the HTML more carefully
        # Find where each persona starts and ends
        lines = content.split('\n')

        in_profiles = False
        current_persona = None
        persona_lines = {}
        brace_count = 0

        for i, line in enumerate(lines):
            if 'const exampleProfiles = {' in line:
                in_profiles = True
                continue

            if in_profiles:
                # Check if this starts a new persona
                for key in personas.keys():
                    if f"'{key}':" in line:
                        current_persona = key
                        persona_lines[key] = []
                        brace_count = 0
                        break

                if current_persona:
                    persona_lines[current_persona].append(line)

                    # Count braces to know when persona ends
                    brace_count += line.count('{') - line.count('}')

                    # If we're back to 0, this persona is complete
                    if brace_count == 0 and len(persona_lines[current_persona]) > 10:
                        current_persona = None

                # Check if we've reached the end of exampleProfiles
                if '};' in line and brace_count == 0:
                    in_profiles = False
                    break

        # Process and save each persona
        output_dir = Path('career-canvas/data/personas')
        output_dir.mkdir(parents=True, exist_ok=True)

        for persona_key, description in personas.items():
            if persona_key in persona_lines:
                # Join the lines for this persona
                persona_text = '\n'.join(persona_lines[persona_key])

                # Clean up the JavaScript to make it more JSON-like
                # Remove trailing comma and closing brace
                persona_text = persona_text.rstrip(' },\n')
                if persona_text.endswith(','):
                    persona_text = persona_text[:-1]

                # Save as a JavaScript file for now (since it contains JavaScript syntax)
                filename = f'{persona_key.replace("-", "_")}.js'
                filepath = output_dir / filename

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(f'// {description}\n')
                    f.write(f'const {persona_key.replace("-", "_")}Profile = ')
                    f.write(persona_text)
                    f.write(';\n\n')
                    f.write(f'export default {persona_key.replace("-", "_")}Profile;')

                print(f"Saved {persona_key} to {filepath}")

        return True

    return False

if __name__ == "__main__":
    if extract_personas():
        print("\nPersona extraction completed!")
    else:
        print("\nPersona extraction failed!")