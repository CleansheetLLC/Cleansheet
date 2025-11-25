/**
 * LLM Configuration and Utilities - Extracted from career-canvas.html
 *
 * Contains:
 * - Provider metadata (models, pricing, icons)
 * - Conversation settings
 * - Token estimation utilities
 * - Model context window configurations
 *
 * Used by: career-canvas.html (AI Assistant)
 */

// ============================================
// Provider Metadata - Model configurations
// ============================================

const PROVIDER_METADATA = {
    openai: {
        name: 'OpenAI',
        icon: 'ph-brain',
        apiKeyPrefix: 'sk-',
        getKeyLink: 'https://platform.openai.com/api-keys',
        models: [
            { id: 'gpt-4o', name: 'GPT-4o (Recommended)', cost: '~$0.005/1k' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast & Cheap)', cost: '~$0.00015/1k' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', cost: '~$0.01/1k' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Budget)', cost: '~$0.0005/1k' }
        ],
        defaultModel: 'gpt-4o'
    },
    anthropic: {
        name: 'Anthropic',
        icon: 'ph-lightning',
        apiKeyPrefix: 'sk-ant-',
        getKeyLink: 'https://console.anthropic.com/settings/keys',
        models: [
            { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)', cost: '$3/$15 per 1M tokens' },
            { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Fast)', cost: '$0.80/$4 per 1M tokens' },
            { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (Most Capable)', cost: '$15/$75 per 1M tokens' },
            { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', cost: '$3/$15 per 1M tokens' },
            { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', cost: '$0.25/$1.25 per 1M tokens' }
        ],
        defaultModel: 'claude-3-5-sonnet-20241022'
    },
    gemini: {
        name: 'Google Gemini',
        icon: 'ph-sparkle',
        apiKeyPrefix: 'AIza',
        getKeyLink: 'https://aistudio.google.com/apikey',
        models: [
            { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)', cost: 'Fastest, Latest' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', cost: 'Fast & Efficient' },
            { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B', cost: 'High Volume' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', cost: 'Most Capable' }
        ],
        defaultModel: 'gemini-2.0-flash-exp'
    }
};

// ============================================
// Conversation Settings
// ============================================

const CONVERSATION_SETTINGS = {
    maxMessages: 100,           // Maximum messages to store
    cleanupThreshold: 80,       // Start cleanup at 80% capacity
    cleanupAmount: 25,          // Remove 25 oldest messages when cleaning
    maxStorageMB: 2,            // Max storage size in MB
    persistPerPersona: true,    // Store separately per persona
    includeInContext: 20        // Include last 20 messages in API context
};

// ============================================
// Token Estimation Utilities
// ============================================

// Note: estimateTokens() and getModelContextWindow() remain in career-canvas.html
// because they depend on runtime state (currentProvider) or have different implementations

// ============================================
// Conversation History Utilities
// ============================================

/**
 * Get storage key for conversation history (persona-specific)
 * @returns {string} Storage key
 */
function getConversationStorageKey() {
    if (CONVERSATION_SETTINGS.persistPerPersona) {
        const personaId = localStorage.getItem('selected_persona_id') || 'default';
        return `ai_conversation_history_${personaId}`;
    }
    return 'ai_conversation_history';
}

/**
 * Estimate size of conversation history in MB
 * @param {Array} history - Conversation history array
 * @returns {number} Size in MB
 */
function estimateConversationSize(history) {
    const jsonString = JSON.stringify(history);
    const sizeBytes = new Blob([jsonString]).size;
    return sizeBytes / (1024 * 1024);
}

// ============================================
// Asset Name Generation
// ============================================

/**
 * Generate contextual asset name based on content and linked context
 * Detects document type from content patterns (cover letter, interview prep, skills summary, etc.)
 * @param {string} content - The content to analyze
 * @param {Object} context - Context object with linkedType, linkedName
 * @returns {string} Generated asset name
 */
function generateAssetName(content, context) {
    try {
        const contentLower = content.toLowerCase();

        // Detect document type from content patterns
        if (contentLower.includes('dear hiring manager') ||
            contentLower.includes('cover letter') ||
            (contentLower.includes('position') && contentLower.includes('excited'))) {
            // Cover letter
            if (context.linkedType === 'opportunity' && context.linkedName) {
                const company = context.linkedName.split(' at ')[1] || 'Company';
                return `Cover Letter - ${company}`;
            }
            return 'Cover Letter';
        }

        if (contentLower.includes('interview prep') ||
            contentLower.includes('behavioral question') ||
            contentLower.includes('tell me about a time')) {
            // Interview preparation
            return 'Interview Prep - Behavioral Questions';
        }

        if (contentLower.includes('skills summary') ||
            contentLower.includes('technical skills') ||
            contentLower.includes('competencies')) {
            // Skills summary
            const skillMatch = content.match(/\b(Python|JavaScript|Java|React|Node\.js|AWS|Azure|SQL|C\+\+|Go|Rust|TypeScript)\b/i);
            if (skillMatch) {
                return `${skillMatch[1]} Skills Summary`;
            }
            return 'Skills Summary';
        }

        if (contentLower.includes('resume') || contentLower.includes('curriculum vitae')) {
            // Resume content
            return 'Resume Content';
        }

        // Try to extract first sentence as name (max 60 chars)
        const sentences = content.split(/[.!?]\s+/);
        if (sentences.length > 0 && sentences[0].trim()) {
            let firstSentence = sentences[0].trim();
            // Remove markdown formatting
            firstSentence = firstSentence.replace(/[#*_\\`[\]]/g, '');
            if (firstSentence.length > 60) {
                firstSentence = firstSentence.substring(0, 57) + '...';
            }
            return firstSentence;
        }

        // Fallback to timestamp-based name
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `AI Response - ${dateStr}`;

    } catch (error) {
        console.error('[Asset Name] Error generating asset name:', error);
        return `AI Response - ${new Date().toLocaleDateString()}`;
    }
}
