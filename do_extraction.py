#!/usr/bin/env python3
"""
Extract function blocks from career-canvas.html into modular files
This preserves all code exactly as-is, just moves it to separate files
"""
import os

def read_line_range(filepath, start_line, end_line):
    """Read specific line range from a file (1-indexed, inclusive)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        # Convert to 0-indexed and slice
        return ''.join(lines[start_line - 1:end_line])

def extract_functions():
    """
    Extract function blocks from career-canvas.html into modular files
    """

    source_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas.html'
    output_dir = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas'

    # Define all extractions with line ranges
    extractions = {
        'cc-data.js': {
            'description': 'Data CRUD functions (Goals, Projects, Experiences, Jobs, Documents, Diagrams)',
            'ranges': [
                (22865, 22999, 'Profile functions'),
                (22985, 23009, 'loadProfile, saveProfile'),
                (24358, 24399, 'updateProfileDisplay'),
                (40404, 40799, 'Goals CRUD: loadUserGoals, saveUserGoals, addGoal, saveGoal, deleteGoal'),
                (40744, 41099, 'Portfolio CRUD: addPortfolioProject, savePortfolioProject, deletePortfolioProject'),
                (40932, 40999, 'Project storage: loadUserProjects, saveUserProjects'),
                (39492, 40099, 'Experience CRUD: loadUserExperiences, saveUserExperiences, addExperienceRecord, saveExperience, deleteExperienceRecord'),
                (37377, 39099, 'Job CRUD: loadJobOpportunities, addJobOpportunity, saveJob, deleteJob, job todos'),
                (37623, 37649, 'loadUserJobs, saveUserJobs'),
                (35397, 35599, 'Document CRUD: addDocument, saveDocumentMetadata, deleteDocumentById'),
                (48441, 49299, 'loadDocuments, saveDocument, deleteDocument'),
                (35228, 35399, 'Diagram CRUD: addDiagram, saveDiagramMetadata, deleteDiagramById'),
                (34963, 35099, 'loadDiagrams'),
                (29558, 30299, 'Asset management: loadAllAssets, deleteAssetByTypeAndId, saveUnifiedAsset'),
            ]
        },

        'cc-llm.js': {
            'description': 'LLM integration functions (OpenAI, Anthropic, Gemini, chat)',
            'ranges': [
                (18479, 18599, 'canUseLLM checks'),
                (18120, 18399, 'Provider and model management: updateProviderBadge, getCurrentProvider, getCurrentModelForProvider'),
                (18863, 19099, 'buildCorpusContext'),
                (19975, 21999, 'gatherUserContext, formatUserContext, buildEnhancedSystemPrompt'),
                (20675, 20999, 'getCanvasContext, getCleansheetPlatformContext, getCareerGuidanceData'),
                (19503, 19899, 'estimateTokens, getModelContextWindow, calculateTokenBudget, trimContextToFit'),
                (20033, 20699, 'addMessageToUI, detectConversationContext, generateAssetName, showAssetSavedToast'),
                (20525, 20599, 'addTypingIndicator, updateStreamingMessage, removeTypingIndicator'),
                (20683, 20799, 'trackLLMUsage'),
                (17415, 17699, 'Conversation storage: getConversationStorageKey, saveConversationHistory, clearChatHistory'),
                (17529, 17649, 'Chat history management: exportChatHistory, confirmClearChatHistory'),
                (18912, 19149, 'API key modals: showAddKeyModal, closeAddKeyModal'),
                (19105, 19199, 'LLM settings: toggleDocumentDetailOptions, closeLLMSettingsModal, toggleMonacoAutocomplete'),
                (19169, 19399, 'Model selector: openModelSelector, closeModelSelector, populateModelSelector'),
                (19395, 19499, 'Usage and context modals: openLLMUsageModal, openContextControlModal, saveContextControlSettings'),
            ]
        },

        'cc-ui.js': {
            'description': 'UI functions (modals, slideouts, navigation, filtering)',
            'ranges': [
                (15800, 15849, 'Member tier modal: openMemberTierInfoModal, closeMemberTierInfoModal'),
                (15817, 15899, 'Sign out modal: openSignOutModal, closeSignOutModal'),
                (15921, 15949, 'Support modal: openSupportModal, closeSupportModal'),
                (17529, 17599, 'Clear chat modal: openClearChatModal, closeClearChatModal'),
                (22124, 22259, 'Canvas modal: openCanvasModal, closeCanvasModal'),
                (16841, 16909, 'hideAllContentSections, animateSlideoutTransition'),
                (17152, 17249, 'switchViewMode'),
                (16904, 17099, 'Subscription: getCurrentSubscriptionTier, applyViewportForTier, shouldShowNode, shouldShowFeature, updateFeatureVisibility'),
                (22120, 22149, 'showPremiumAlert'),
                (22254, 22349, 'Projects view: showProjectsView, loadProjectStructure, saveProjectStructure'),
                (22335, 22519, 'Project tree: renderFolderTree, navigateToFolder, renderBreadcrumb, renderFileTable, createNewFolder'),
                (25110, 25149, 'toggleProjectsSidebar'),
                (27466, 27649, 'Job search: loadJobSearchView, renderJobBoard, renderAlertCard, toggleJobBoard, searchJobBoard'),
                (27361, 27399, 'Count updates: updateExperienceCount, updateGoalsCount, updateJobOpportunitiesCount'),
                (33347, 33599, 'Assets filters: populateAssetsExperienceFilter, toggleAssetsExperienceFilter, clearAssetsExperienceFilter'),
                (33830, 33949, 'Experience filter: toggleExperienceFilter, populateExperienceFilter, updateExperienceFilter, clearExperienceFilter'),
                (34037, 34229, 'Diagram filters: toggleDiagramExperienceFilter, populateDiagramExperienceFilter, etc.'),
                (34213, 34399, 'Document filters: toggleDocumentExperienceFilter, populateDocumentExperienceFilter, etc.'),
            ]
        },

        'cc-editors.js': {
            'description': 'Document editor functions (Quill, Draw.io, LaTeX)',
            'ranges': [
                (50336, 51299, 'addDocumentBlock, document editor functions'),
                (51202, 51299, 'saveDrawioDiagram'),
                (53965, 54299, 'saveLatexDocuments, saveLaTexDocumentSilently'),
                (45144, 45299, 'loadDocumentTypeCards'),
            ]
        },

        'cc-utils.js': {
            'description': 'Utility functions (formatting, validation, storage)',
            'ranges': [
                (15940, 15999, 'updateSyncStatusInfo'),
                (15970, 16029, 'showLocalStorageDiagnostics'),
                (16253, 16319, 'updateCloudSyncButton'),
                (15851, 15919, 'checkForOldData'),
                (17653, 17799, 'NPS functions: initializeNPS, showNPSSurvey, closeNPS, postponeNPS'),
                (17790, 17869, 'calculateDaysActive, getUsedFeatures'),
                (18325, 18479, 'Suggestions: initializeSuggestionSystem, refreshSuggestions, renderSuggestions, dismissSuggestion'),
                (25910, 25999, 'loadExampleProfile'),
                (17221, 17419, 'getFilteredPersonaData'),
            ]
        },

        'cc-viz.js': {
            'description': 'D3 visualization functions (mindmap, career paths, Sankey)',
            'ranges': [
                (27622, 27699, 'toggleJobSearchSankey, initializeJobSearchSankey'),
            ]
        }
    }

    # Extract each module
    for filename, config in extractions.items():
        output_path = os.path.join(output_dir, filename)

        print(f"\nExtracting {filename}...")
        print(f"  Description: {config['description']}")

        with open(output_path, 'w', encoding='utf-8') as outfile:
            # Write header
            outfile.write(f"/**\n")
            outfile.write(f" * {filename}\n")
            outfile.write(f" * {config['description']}\n")
            outfile.write(f" * \n")
            outfile.write(f" * Extracted from career-canvas.html\n")
            outfile.write(f" * All code preserved exactly as-is\n")
            outfile.write(f" */\n\n")

            # Extract each range
            for start, end, description in config['ranges']:
                print(f"    Lines {start:5d}-{end:5d}: {description}")

                # Write section header
                outfile.write(f"// ============================================\n")
                outfile.write(f"// Original lines {start}-{end}: {description}\n")
                outfile.write(f"// ============================================\n\n")

                # Extract and write code
                code = read_line_range(source_file, start, end)
                outfile.write(code)
                outfile.write("\n\n")

        print(f"  ✓ Created {filename}")

    # Print summary
    print("\n" + "="*70)
    print("EXTRACTION COMPLETE")
    print("="*70)

    total_lines = sum(
        sum(end - start for start, end, _ in config['ranges'])
        for config in extractions.values()
    )

    print(f"\nTotal lines extracted: {total_lines}")
    print(f"Remaining in main file (approx): {55459 - total_lines}")
    print("\nFiles created:")
    for filename in extractions.keys():
        print(f"  - career-canvas/{filename}")

    print("\nNext step: Create career-canvas-lean.html with script includes")

if __name__ == '__main__':
    extract_functions()
