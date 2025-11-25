#!/usr/bin/env python3
"""
Create career-canvas-lean.html from the extracted modules
Removes extracted functions and adds script includes
"""

def create_lean_html():
    source_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas.html'
    output_file = '/mnt/c/Users/PaulGaljan/Github/Cleansheet/career-canvas-lean.html'

    # Ranges extracted by smart_extract.py (sorted)
    extracted_ranges = [
        (15794, 15799),  # openMemberTierInfoModal
        (15802, 15807),  # closeMemberTierInfoModal
        (15811, 15816),  # openSignOutModal
        (15819, 15824),  # closeSignOutModal
        (15845, 15862),  # checkForOldData
        (15915, 15925),  # openSupportModal
        (15927, 15932),  # closeSupportModal
        (15934, 15962),  # updateSyncStatusInfo
        (15964, 16022),  # showLocalStorageDiagnostics
        (16247, 16288),  # updateCloudSyncButton
        (16835, 16850),  # hideAllContentSections
        (16853, 16875),  # animateSlideoutTransition
        (16898, 16903),  # getCurrentSubscriptionTier
        (16906, 17015),  # applyViewportForTier
        (17059, 17069),  # shouldShowNode
        (17072, 17082),  # shouldShowFeature
        (17085, 17119),  # updateFeatureVisibility
        (17292, 17359),  # switchViewMode
        (17361, 17535),  # getFilteredPersonaData
        (17555, 17561),  # getConversationStorageKey
        (17618, 17639),  # saveConversationHistory
        (17664, 17666),  # clearChatHistory
        (17669, 17674),  # openClearChatModal
        (17677, 17682),  # closeClearChatModal
        (17685, 17752),  # exportChatHistory
        (17755, 17786),  # confirmClearChatHistory
        (17793, 17820),  # initializeNPS
        (17851, 17858),  # showNPSSurvey
        (17908, 17914),  # closeNPS
        (17917, 17920),  # postponeNPS
        (17930, 17940),  # calculateDaysActive
        (17943, 17992),  # getUsedFeatures
        (18003, 18109),  # buildCorpusContext
        (18115, 18154),  # gatherUserContext
        (18161, 18213),  # formatUserContext
        (18219, 18257),  # buildEnhancedSystemPrompt
        (18260, 18361),  # updateProviderBadge
        (18364, 18366),  # getCurrentProvider
        (18369, 18390),  # getCurrentModelForProvider
        (18465, 18478),  # initializeSuggestionSystem
        (18483, 18498),  # refreshSuggestions
        (18504, 18558),  # renderSuggestions
        (18601, 18615),  # dismissSuggestion
        (18618, 18627),  # canUseLLM
        (19052, 19060),  # showAddKeyModal
        (19062, 19065),  # closeAddKeyModal
        (19245, 19252),  # toggleDocumentDetailOptions
        (19255, 19257),  # closeLLMSettingsModal
        (19309, 19339),  # openModelSelector
        (19341, 19345),  # closeModelSelector
        (19347, 19479),  # populateModelSelector
        (19535, 19541),  # openLLMUsageModal
        (19549, 19573),  # openContextControlModal
        (19590, 19632),  # saveContextControlSettings
        (19643, 19648),  # estimateTokens
        (19653, 19669),  # getModelContextWindow
        (19675, 19719),  # calculateTokenBudget
        (19726, 19859),  # trimContextToFit
        (20173, 20280),  # addMessageToUI
        (20319, 20412),  # detectConversationContext
        (20415, 20482),  # generateAssetName (FIXED - now 68 lines)
        (20602, 20662),  # showAssetSavedToast
        (20665, 20689),  # addTypingIndicator
        (20692, 20730),  # updateStreamingMessage
        (20733, 20812),  # removeTypingIndicator
        (20823, 20874),  # trackLLMUsage
        (20881, 21143),  # getCanvasContext
        (21146, 21276),  # getCleansheetPlatformContext
        (21279, 21792),  # getCareerGuidanceData
        (22260, 22262),  # showPremiumAlert
        (22264, 22378),  # openCanvasModal
        (22380, 22388),  # closeCanvasModal
        (22394, 22403),  # showProjectsView
        (22405, 22469),  # loadProjectStructure
        (22471, 22473),  # saveProjectStructure
        (22475, 22481),  # renderFolderTree
        (22503, 22508),  # navigateToFolder
        (22510, 22536),  # renderBreadcrumb
        (22538, 22599),  # renderFileTable
        (22614, 22632),  # createNewFolder
        (23125, 23135),  # loadProfile
        (23137, 23172),  # saveProfile
        (24498, 24514),  # updateProfileDisplay
        (25250, 25267),  # toggleProjectsSidebar
        (26050, 26139),  # loadExampleProfile
        (27501, 27510),  # updateExperienceCount
        (27523, 27532),  # updateGoalsCount
        (27534, 27549),  # updateJobOpportunitiesCount
        (27606, 27674),  # loadJobSearchView
        (27676, 27703),  # renderJobBoard
        (27705, 27729),  # renderAlertCard
        (27762, 27776),  # toggleJobSearchSankey
        (27778, 27946),  # initializeJobSearchSankey
        (29698, 29909),  # loadAllAssets
        (30041, 30068),  # deleteAssetByTypeAndId
        (30351, 30588),  # saveUnifiedAsset
        (35103, 35229),  # loadDiagrams
        (35368, 35381),  # addDiagram
        (35443, 35488),  # saveDiagramMetadata
        (35510, 35521),  # deleteDiagramById
        (35693, 35704),  # deleteDocumentById
        (40544, 40547),  # loadUserGoals
        (40549, 40559),  # saveUserGoals
        (40676, 40682),  # addGoal
        (40709, 40741),  # saveGoal
        (40743, 40749),  # deleteGoal
        (45284, 45327),  # loadDocumentTypeCards
        (48581, 48606),  # loadDocuments
        (49397, 49401),  # saveDocument
        (49413, 49420),  # deleteDocument
        (50476, 50864),  # addDocumentBlock
        (51342, 51379),  # saveDrawioDiagram
        (54105, 54108),  # saveLatexDocuments
        (54428, 54441),  # saveLaTexDocumentSilently
    ]

    # Sort by start line
    extracted_ranges.sort()

    # Merge overlapping ranges
    merged = []
    for start, end in extracted_ranges:
        if merged and start <= merged[-1][1] + 1:
            # Overlapping or adjacent
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))

    print(f"Merged {len(extracted_ranges)} ranges into {len(merged)} non-overlapping ranges")

    # Read source
    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    total_lines = len(lines)
    print(f"Source file: {total_lines} lines")

    # Write lean version
    with open(output_file, 'w', encoding='utf-8') as out:
        # Copy up to line 15641 (before main script tag at line 15642)
        print("Writing HTML head and body (lines 1-15641)...")
        for i in range(0, 15641):
            out.write(lines[i])

        # Add script includes BEFORE the main script tag
        print("Adding script includes before main script tag...")
        out.write("\n")
        out.write("    <!-- Extracted JavaScript Modules (smart extraction with brace counting) -->\n")
        out.write("    <script src=\"career-canvas/cc-utils.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-ui.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-llm.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-data.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-viz.js\"></script>\n")
        out.write("    <script src=\"career-canvas/cc-editors.js\"></script>\n")
        out.write("\n")

        # Write remaining JavaScript, skipping extracted ranges
        print("Writing remaining JavaScript (skipping extracted functions)...")
        current_line = 15642  # Start from main script tag at line 15642
        lines_written = 0
        lines_skipped = 0

        for start, end in merged:
            # Write up to start of extracted range
            if current_line < start:
                for i in range(current_line - 1, start - 1):
                    if i < total_lines:
                        out.write(lines[i])
                        lines_written += 1

            # Skip extracted range
            skip_count = end - start + 1
            lines_skipped += skip_count
            print(f"  Skipping lines {start}-{end} ({skip_count} lines)")
            current_line = end + 1

        # Write remaining lines
        print(f"Writing remaining lines from {current_line} to {total_lines}...")
        for i in range(current_line - 1, total_lines):
            out.write(lines[i])
            lines_written += 1

        lean_total = 15641 + 7 + lines_written
        print(f"\nOriginal: {total_lines} lines")
        print(f"Skipped: {lines_skipped} lines")
        print(f"Lean version: ~{lean_total} lines ({100 * lines_skipped / total_lines:.1f}% reduction)")

    print(f"\n✓ Created {output_file}")

if __name__ == '__main__':
    create_lean_html()
