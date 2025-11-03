#!/usr/bin/env python3
"""
Fix cleansheet-canvas-*.json files that have empty role and organizationName fields.
This script reads each experience's description to infer missing data.
"""

import json
import glob
import os
import re

# Mapping of descriptions to likely roles/companies based on your profile data
def infer_role_and_company(exp, index):
    """Infer role and company from description and other context."""
    description = exp.get('description', '').lower()
    location = exp.get('location', '')

    # Dell Technologies / NativeEdge experiences
    if 'dell' in description or 'vxrail' in description or 'automation platform' in description or 'nativeedge' in description or 'multi-cloud orchestration' in description:
        company = 'Dell Technologies'

        if 'fleet management' in description or 'automation platform' in description:
            role = 'Director of Product Management'
        elif 'nativeedge' in description or 'multi-cloud orchestration' in description:
            role = 'Product Manager - NativeEdge'
        elif 'vxrail' in description or 'day 1 experience' in description:
            role = 'Product Manager - VxRail'
        elif 'openhci' in description or 'as hub' in description:
            role = 'Product Manager - OpenHCI'
        elif 'converged infrastructure' in description:
            role = 'Technology Business Consultant'
        else:
            role = 'Product Manager'

    # EMC / Federal / Dataline experiences
    elif 'emc' in description or 'vnx' in description or 'clariion' in description or 'federal' in description or 'dataline' in description or 'presales engineer' in description or ('presales' in description and 'federal' in description):
        # Could be EMC or Federal Dataline
        if 'dataline' in description or ('federal' in description and 'dataline' in location.lower()):
            company = 'Federal Dataline'
            role = 'Senior Solutions Architect'
        else:
            company = 'EMC'

            if 'business consultant' in description or 'converged' in description:
                role = 'Technology Business Consultant'
            elif 'vnx' in description:
                role = 'Technical Marketing Engineer'
            elif 'presales' in description or 'dr and performance' in description:
                role = 'Senior Presales Engineer'
            else:
                role = 'Senior Consultant'

    # SAIC experiences
    elif 'saic' in description or 'remote sensing' in description or 'arpanet' in description or 'mlops' in description or 'autonomous event detection' in description or 'dod' in description or 'nuclear non-proliferation' in description:
        company = 'SAIC'

        if 'systems administration manager' in description or 'devops' in description:
            role = 'Systems Administration Manager'
        elif 'mlops' in description or 'autonomous event detection' in description:
            role = 'Machine Learning Engineer'
        elif 'nuclear' in description or 'non-proliferation' in description:
            role = 'Technical Analyst'
        elif 'infrastructure' in description:
            role = 'Infrastructure Engineer'
        else:
            role = 'Systems Administrator'

    # Cleansheet
    elif 'cleansheet' in description or 'founder' in description or 'technical learning' in description:
        company = 'Cleansheet LLC'
        role = 'Solo Technical Founder'

    # LAZ Parking
    elif 'laz parking' in description or 'full-stack developer' in description or 'quality control intern' in description:
        company = 'LAZ Parking'

        if 'full-stack' in description:
            role = 'Full-Stack Developer Intern'
        elif 'quality control' in description or 'bank reconciliation' in description:
            role = 'Quality Control Intern'
        else:
            role = 'Intern'

    # Bentley experiences
    elif 'bentley' in description or 'club rugby' in description or 'investment group' in description:
        company = 'Bentley University'

        if 'rugby' in description:
            role = 'E-Board Member'
        elif 'investment' in description:
            role = 'Member'
        else:
            role = 'Student'

    # Camp counselor
    elif 'camp' in description or 'eisner' in description:
        company = 'URJ Eisner Camp'
        role = 'Camp Counselor'

    # Fenway Health
    elif 'fenway' in description or 'healthcare navigator' in description:
        company = 'Fenway Health'
        role = 'Healthcare Navigator'

    # Moderna
    elif 'moderna' in description or 'mrna' in description:
        company = 'Moderna Therapeutics'
        role = 'Senior Research Scientist'

    # Pfizer
    elif 'pfizer' in description:
        company = 'Pfizer Inc.'
        role = 'Research Scientist'

    # Target
    elif 'target' in description:
        company = 'Target Corporation'

        if 'store manager' in description:
            role = 'Store Manager'
        elif 'assistant' in description:
            role = 'Assistant Store Manager'
        else:
            role = 'Department Supervisor'

    # Mist.io
    elif 'mist.io' in description or ('ceo' in description and 'co-founder' in description):
        company = 'mist.io'
        role = 'CEO & Co-Founder'

    # unweb.me
    elif 'unweb.me' in description or 'co-founded unweb' in description:
        company = 'unweb.me'
        role = 'Co-Founder & CTO'

    # COSMOS / European projects
    elif 'cosmos' in description or 'european project' in description:
        company = 'COSMOS Project'
        role = 'Technical Manager'

    # Archaeological / Zoni / NTUA
    elif 'archeological' in description or 'archaeological' in description or 'zoni' in description or 'ntua' in description or 'technical operations and infrastructure' in description:
        if 'ntua' in description or 'technical operations' in description:
            company = 'NTUA'
            role = 'Technical Operations Manager'
        else:
            company = 'Archaeological Research'
            role = 'Technical Engineer'

    # DISMA / Natural hazard management
    elif 'disma' in description or 'natural hazard' in description:
        company = 'DISMA Project'
        role = 'Research Engineer'

    # Camera calibration research
    elif 'calibration of commercial cameras' in description or 'camera calibration' in description:
        company = 'Research Institute'
        role = 'Research Engineer'

    # Olympic facilities construction
    elif 'olympic' in description or 'tennis courts' in description:
        company = 'Olympic Construction'
        role = 'Assistant Construction Engineer'

    # Default fallback
    else:
        company = exp.get('organizationName') or exp.get('company') or 'Unknown Company'
        role = exp.get('role') or exp.get('title') or 'Unknown Role'

    return role, company


def fix_json_file(filepath):
    """Fix a single JSON file."""
    print(f"Processing: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    fixed_count = 0

    if 'experiences' in data:
        for i, exp in enumerate(data['experiences']):
            role = exp.get('role', '').strip()
            org = exp.get('organizationName', '').strip()

            # If either is missing or unknown, try to infer
            if not role or not org or 'Unknown' in role or 'Unknown' in org:
                inferred_role, inferred_company = infer_role_and_company(exp, i)

                if not role or 'Unknown' in role:
                    exp['role'] = inferred_role
                    fixed_count += 1
                    print(f"  Fixed role [{i}]: {inferred_role}")

                if not org or 'Unknown' in org:
                    exp['organizationName'] = inferred_company
                    fixed_count += 1
                    print(f"  Fixed company [{i}]: {inferred_company}")

    if fixed_count > 0:
        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  ✓ Fixed {fixed_count} fields\n")
    else:
        print(f"  ✓ No fixes needed\n")

    return fixed_count


def main():
    """Fix all cleansheet-canvas-*.json files in Downloads."""
    downloads_dir = os.path.expanduser('~/Downloads')
    pattern = os.path.join(downloads_dir, 'cleansheet-canvas-*.json')
    files = glob.glob(pattern)

    if not files:
        print(f"No files found matching: {pattern}")
        return

    print(f"Found {len(files)} files to process\n")

    total_fixes = 0
    for filepath in sorted(files):
        total_fixes += fix_json_file(filepath)

    print(f"\n{'='*60}")
    print(f"SUMMARY: Fixed {total_fixes} total fields across {len(files)} files")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
