#!/usr/bin/env python3
"""
Extract functions from career-canvas.html into modular files
Preserves all code exactly as-is, just moves it to separate files
"""

def extract_function_blocks():
    """
    Map out where major function groups are located in career-canvas.html
    Based on analysis of function names and patterns
    """

    function_blocks = {
        'cc-data.js': {
            'description': 'Data CRUD functions (Goals, Projects, Experiences, Jobs, Documents, Diagrams)',
            'patterns': [
                # Profile functions
                (22865, 23000, 'Profile functions'),
                (22985, 23010, 'loadProfile, saveProfile'),
                (24358, 24400, 'updateProfileDisplay'),

                # Goals functions
                (40404, 40800, 'Goals CRUD: loadUserGoals, saveUserGoals, addGoal, saveGoal, deleteGoal'),

                # Portfolio/Projects functions
                (40744, 41100, 'Portfolio CRUD: addPortfolioProject, savePortfolioProject, deletePortfolioProject'),
                (40932, 41000, 'Project storage: loadUserProjects, saveUserProjects'),

                # Experience functions
                (39492, 40100, 'Experience CRUD: loadUserExperiences, saveUserExperiences, addExperienceRecord, saveExperience, deleteExperienceRecord'),

                # Job functions
                (37377, 39100, 'Job CRUD: loadJobOpportunities, addJobOpportunity, saveJob, deleteJob, job todos'),
                (37623, 37650, 'loadUserJobs, saveUserJobs'),

                # Document functions
                (35397, 35600, 'Document CRUD: addDocument, saveDocumentMetadata, deleteDocumentById'),
                (48441, 49300, 'loadDocuments, saveDocument, deleteDocument'),

                # Diagram functions
                (35228, 35400, 'Diagram CRUD: addDiagram, saveDiagramMetadata, deleteDiagramById'),
                (34963, 35100, 'loadDiagrams'),

                # Asset functions
                (29558, 30300, 'Asset management: loadAllAssets, deleteAssetByTypeAndId, saveUnifiedAsset'),
            ]
        },

        'cc-llm.js': {
            'description': 'LLM integration functions (OpenAI, Anthropic, Gemini, chat)',
            'patterns': [
                # LLM provider functions
                (18479, 18600, 'canUseLLM checks'),
                (18120, 18400, 'Provider and model management: updateProviderBadge, getCurrentProvider, getCurrentModelForProvider'),

                # Context building functions
                (18863, 19100, 'buildCorpusContext'),
                (19975, 22000, 'gatherUserContext, formatUserContext, buildEnhancedSystemPrompt'),
                (20675, 21000, 'getCanvasContext, getCleansheetPlatformContext, getCareerGuidanceData'),

                # Token management
                (19503, 19900, 'estimateTokens, getModelContextWindow, calculateTokenBudget, trimContextToFit'),

                # Chat functions
                (20033, 20700, 'addMessageToUI, detectConversationContext, generateAssetName, showAssetSavedToast'),
                (20525, 20600, 'addTypingIndicator, updateStreamingMessage, removeTypingIndicator'),
                (20683, 20800, 'trackLLMUsage'),

                # Conversation management
                (17415, 17700, 'Conversation storage: getConversationStorageKey, saveConversationHistory, clearChatHistory'),
                (17529, 17650, 'Chat history management: exportChatHistory, confirmClearChatHistory'),

                # Modal functions for LLM
                (18912, 19150, 'API key modals: showAddKeyModal, closeAddKeyModal'),
                (19105, 19200, 'LLM settings: toggleDocumentDetailOptions, closeLLMSettingsModal, toggleMonacoAutocomplete'),
                (19169, 19400, 'Model selector: openModelSelector, closeModelSelector, populateModelSelector'),
                (19395, 19500, 'Usage and context modals: openLLMUsageModal, openContextControlModal, saveContextControlSettings'),
            ]
        },

        'cc-viz.js': {
            'description': 'D3 visualization functions (mindmap, career paths, Sankey)',
            'patterns': [
                # Mindmap/canvas visualization
                # These are likely scattered, need to find renderMindmap and related functions

                # Job search Sankey
                (27622, 27700, 'toggleJobSearchSankey, initializeJobSearchSankey'),

                # Career paths visualization
                # Need to locate these functions
            ]
        },

        'cc-ui.js': {
            'description': 'UI functions (modals, slideouts, navigation, filtering)',
            'patterns': [
                # Modal functions
                (15800, 15850, 'Member tier modal: openMemberTierInfoModal, closeMemberTierInfoModal'),
                (15817, 15900, 'Sign out modal: openSignOutModal, closeSignOutModal'),
                (15921, 15950, 'Support modal: openSupportModal, closeSupportModal'),
                (17529, 17600, 'Clear chat modal: openClearChatModal, closeClearChatModal'),
                (22124, 22260, 'Canvas modal: openCanvasModal, closeCanvasModal'),

                # View switching
                (16841, 16910, 'hideAllContentSections, animateSlideoutTransition'),
                (17152, 17250, 'switchViewMode'),

                # Subscription and features
                (16904, 17100, 'Subscription: getCurrentSubscriptionTier, applyViewportForTier, shouldShowNode, shouldShowFeature, updateFeatureVisibility'),
                (22120, 22150, 'showPremiumAlert'),

                # Projects view
                (22254, 22350, 'Projects view: showProjectsView, loadProjectStructure, saveProjectStructure'),
                (22335, 22520, 'Project tree: renderFolderTree, navigateToFolder, renderBreadcrumb, renderFileTable, createNewFolder'),
                (25110, 25150, 'toggleProjectsSidebar'),

                # Job search view
                (27466, 27650, 'Job search: loadJobSearchView, renderJobBoard, renderAlertCard, toggleJobBoard, searchJobBoard'),

                # Count updates
                (27361, 27400, 'Count updates: updateExperienceCount, updateGoalsCount, updateJobOpportunitiesCount'),

                # Filter functions
                (33347, 33600, 'Assets filters: populateAssetsExperienceFilter, toggleAssetsExperienceFilter, clearAssetsExperienceFilter'),
                (33830, 33950, 'Experience filter: toggleExperienceFilter, populateExperienceFilter, updateExperienceFilter, clearExperienceFilter'),
                (34037, 34230, 'Diagram filters: toggleDiagramExperienceFilter, populateDiagramExperienceFilter, etc.'),
                (34213, 34400, 'Document filters: toggleDocumentExperienceFilter, populateDocumentExperienceFilter, etc.'),
            ]
        },

        'cc-editors.js': {
            'description': 'Document editor functions (Quill, Draw.io, LaTeX)',
            'patterns': [
                # Document editor
                (50336, 51300, 'addDocumentBlock, document editor functions'),
                (51202, 51300, 'saveDrawioDiagram'),

                # LaTeX functions
                (53965, 54300, 'saveLatexDocuments, saveLaTexDocumentSilently'),

                # Document type cards
                (45144, 45300, 'loadDocumentTypeCards'),
            ]
        },

        'cc-utils.js': {
            'description': 'Utility functions (formatting, validation, storage)',
            'patterns': [
                # Sync and storage utilities
                (15940, 16000, 'updateSyncStatusInfo'),
                (15970, 16030, 'showLocalStorageDiagnostics'),
                (16253, 16320, 'updateCloudSyncButton'),
                (15851, 15920, 'checkForOldData'),

                # NPS system
                (17653, 17800, 'NPS functions: initializeNPS, showNPSSurvey, closeNPS, postponeNPS'),
                (17790, 17870, 'calculateDaysActive, getUsedFeatures'),

                # Suggestion system
                (18325, 18480, 'Suggestions: initializeSuggestionSystem, refreshSuggestions, renderSuggestions, dismissSuggestion'),

                # Profile management
                (25910, 26000, 'loadExampleProfile'),
                (17221, 17420, 'getFilteredPersonaData'),
            ]
        }
    }

    return function_blocks

if __name__ == '__main__':
    blocks = extract_function_blocks()

    print("Function Extraction Map for career-canvas.html")
    print("=" * 70)
    print()

    for filename, info in blocks.items():
        print(f"FILE: {filename}")
        print(f"  Description: {info['description']}")
        print(f"  Estimated lines: {sum(end - start for start, end, _ in info['patterns'])}")
        print()
        print("  Line ranges:")
        for start, end, description in info['patterns']:
            print(f"    {start:5d} - {end:5d} : {description}")
        print()
        print()

    total_lines = sum(
        sum(end - start for start, end, _ in info['patterns'])
        for info in blocks.values()
    )
    print(f"Total estimated extracted lines: {total_lines}")
    print(f"Remaining in main file (approx): {55459 - total_lines}")