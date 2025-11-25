#!/usr/bin/env python3
"""
Smart function extraction using brace counting
Finds complete function blocks by searching for function names and counting braces
"""
import re

def find_function_block(lines, start_line, function_name):
    """
    Starting from a function declaration, count braces to find the complete function block.
    Returns (start_line, end_line) or None if not found.
    """
    # Look backwards a few lines to catch the function declaration
    search_start = max(0, start_line - 5)

    # Find the line with "function functionName" or "async function functionName"
    func_pattern = rf'^\s*(?:async\s+)?function\s+{re.escape(function_name)}\s*\('

    actual_start = None
    for i in range(search_start, min(start_line + 10, len(lines))):
        if re.search(func_pattern, lines[i]):
            actual_start = i
            break

    if actual_start is None:
        # Try to find it as a const/let/var declaration
        var_pattern = rf'^\s*(?:const|let|var)\s+{re.escape(function_name)}\s*='
        for i in range(search_start, min(start_line + 10, len(lines))):
            if re.search(var_pattern, lines[i]):
                actual_start = i
                break

    if actual_start is None:
        print(f"  WARNING: Could not find function declaration for {function_name} near line {start_line}")
        return None

    # Now count braces starting from the function declaration
    brace_count = 0
    in_string = False
    in_comment = False
    string_char = None

    for i in range(actual_start, len(lines)):
        line = lines[i]

        # Simple state machine for string/comment detection
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
                break  # Rest of line is comment

            # Handle strings
            if not in_comment:
                if char in ('"', "'", '`') and (j == 0 or line[j-1] != '\\'):
                    if not in_string:
                        in_string = True
                        string_char = char
                    elif char == string_char:
                        in_string = False
                        string_char = None

            # Count braces (only when not in string or comment)
            if not in_string and not in_comment:
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1

                    # Function is complete when brace count returns to 0
                    if brace_count == 0:
                        return (actual_start, i)

            j += 1

    print(f"  WARNING: Function {function_name} starting at line {actual_start} has unclosed braces")
    return None

def extract_functions_smart():
    """
    Extract functions using smart search and brace counting
    """
    source_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas.html'
    output_dir = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas'

    # Read source file
    print("Reading source file...")
    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print(f"Source file has {len(lines)} lines")

    # Define function groups - just the function names and which module they belong to
    function_groups = {
        'cc-utils.js': [
            'updateSyncStatusInfo',
            'showLocalStorageDiagnostics',
            'updateCloudSyncButton',
            'checkForOldData',
            'initializeNPS',
            'showNPSSurvey',
            'closeNPS',
            'postponeNPS',
            'calculateDaysActive',
            'getUsedFeatures',
            'initializeSuggestionSystem',
            'refreshSuggestions',
            'renderSuggestions',
            'dismissSuggestion',
            'loadExampleProfile',
            'getFilteredPersonaData',
        ],

        'cc-ui.js': [
            'openMemberTierInfoModal',
            'closeMemberTierInfoModal',
            'openSignOutModal',
            'closeSignOutModal',
            'openSupportModal',
            'closeSupportModal',
            'hideAllContentSections',
            'animateSlideoutTransition',
            'getCurrentSubscriptionTier',
            'applyViewportForTier',
            'shouldShowNode',
            'shouldShowFeature',
            'updateFeatureVisibility',
            'switchViewMode',
            'openClearChatModal',
            'closeClearChatModal',
            'showPremiumAlert',
            'openCanvasModal',
            'closeCanvasModal',
            'showProjectsView',
            'loadProjectStructure',
            'saveProjectStructure',
            'renderFolderTree',
            'navigateToFolder',
            'renderBreadcrumb',
            'renderFileTable',
            'createNewFolder',
            'toggleProjectsSidebar',
            'loadJobSearchView',
            'renderJobBoard',
            'renderAlertCard',
            'updateExperienceCount',
            'updateGoalsCount',
            'updateJobOpportunitiesCount',
        ],

        'cc-llm.js': [
            'canUseLLM',
            'updateProviderBadge',
            'getCurrentProvider',
            'getCurrentModelForProvider',
            'buildCorpusContext',
            'gatherUserContext',
            'formatUserContext',
            'buildEnhancedSystemPrompt',
            'estimateTokens',
            'getModelContextWindow',
            'calculateTokenBudget',
            'trimContextToFit',
            'addMessageToUI',
            'detectConversationContext',
            'generateAssetName',
            'showAssetSavedToast',
            'addTypingIndicator',
            'updateStreamingMessage',
            'removeTypingIndicator',
            'trackLLMUsage',
            'getCanvasContext',
            'getCleansheetPlatformContext',
            'getCareerGuidanceData',
            'getConversationStorageKey',
            'saveConversationHistory',
            'clearChatHistory',
            'exportChatHistory',
            'confirmClearChatHistory',
            'showAddKeyModal',
            'closeAddKeyModal',
            'toggleDocumentDetailOptions',
            'closeLLMSettingsModal',
            'openModelSelector',
            'closeModelSelector',
            'populateModelSelector',
            'openLLMUsageModal',
            'openContextControlModal',
            'saveContextControlSettings',
        ],

        'cc-data.js': [
            'loadProfile',
            'saveProfile',
            'updateProfileDisplay',
            'loadUserGoals',
            'saveUserGoals',
            'addGoal',
            'saveGoal',
            'deleteGoal',
            'addPortfolioProject',
            'savePortfolioProject',
            'deletePortfolioProject',
            'loadUserProjects',
            'saveUserProjects',
            'loadUserExperiences',
            'saveUserExperiences',
            'addExperienceRecord',
            'saveExperience',
            'deleteExperienceRecord',
            'loadJobOpportunities',
            'addJobOpportunity',
            'saveJob',
            'deleteJob',
            'loadUserJobs',
            'saveUserJobs',
            'addDocument',
            'saveDocumentMetadata',
            'deleteDocumentById',
            'loadDocuments',
            'saveDocument',
            'deleteDocument',
            'addDiagram',
            'saveDiagramMetadata',
            'deleteDiagramById',
            'loadDiagrams',
            'loadAllAssets',
            'deleteAssetByTypeAndId',
            'saveUnifiedAsset',
        ],

        'cc-viz.js': [
            'toggleJobSearchSankey',
            'initializeJobSearchSankey',
        ],

        'cc-editors.js': [
            'loadDocumentTypeCards',
            'addDocumentBlock',
            'saveDrawioDiagram',
            'saveLatexDocuments',
            'saveLaTexDocumentSilently',
        ],
    }

    # Find each function in the source file
    print("\nSearching for functions in source file...")

    function_locations = {}

    for module, func_names in function_groups.items():
        function_locations[module] = []

        for func_name in func_names:
            # Search for the function
            pattern = rf'^\s*(?:async\s+)?function\s+{re.escape(func_name)}\s*\('

            found = False
            for i, line in enumerate(lines):
                if re.search(pattern, line):
                    # Found it! Now find the complete block
                    block = find_function_block(lines, i, func_name)
                    if block:
                        function_locations[module].append({
                            'name': func_name,
                            'start': block[0],
                            'end': block[1]
                        })
                        print(f"  ✓ {func_name}: lines {block[0]+1}-{block[1]+1}")
                        found = True
                        break

            if not found:
                print(f"  ✗ {func_name}: NOT FOUND")

    # Extract each module
    print("\n" + "="*70)
    print("EXTRACTING MODULES")
    print("="*70)

    for module, functions in function_locations.items():
        if not functions:
            print(f"\nSkipping {module} (no functions found)")
            continue

        output_path = f"{output_dir}/{module}"
        print(f"\nExtracting {module}...")
        print(f"  Functions: {len(functions)}")

        with open(output_path, 'w', encoding='utf-8') as out:
            # Write header
            out.write(f"/**\n")
            out.write(f" * {module}\n")
            out.write(f" * Extracted from career-canvas.html\n")
            out.write(f" * Functions: {', '.join(f['name'] for f in functions)}\n")
            out.write(f" */\n\n")

            # Extract each function
            for func in functions:
                out.write(f"// ============================================\n")
                out.write(f"// {func['name']} (lines {func['start']+1}-{func['end']+1})\n")
                out.write(f"// ============================================\n\n")

                # Write the complete function
                for i in range(func['start'], func['end'] + 1):
                    out.write(lines[i])

                out.write("\n\n")

        print(f"  ✓ Created {module}")

    print("\n" + "="*70)
    print("EXTRACTION COMPLETE")
    print("="*70)

if __name__ == '__main__':
    extract_functions_smart()
