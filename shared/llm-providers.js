/**
 * LLM Provider Abstraction Layer
 *
 * Provides a unified interface for interacting with various LLM providers
 * (OpenAI, Anthropic, Azure OpenAI, Google Gemini, etc.)
 *
 * @version 1.0
 * @date 2025-11-16
 */

// ============================================
// Base LLM Provider Class
// ============================================

class LLMProvider {
    constructor(apiKey, config = {}) {
        this.apiKey = apiKey;
        this.config = config;
    }

    /**
     * Send a chat message and get a complete response
     * @param {Array} messages - Array of message objects { role: 'user'|'assistant'|'system', content: string }
     * @param {Object} options - Optional parameters (model, maxTokens, temperature, etc.)
     * @returns {Promise<Object>} - { content: string, usage: object, rateLimits: object }
     */
    async chat(messages, options = {}) {
        throw new Error('chat() must be implemented by subclass');
    }

    /**
     * Send a chat message and stream the response
     * @param {Array} messages - Array of message objects
     * @param {Function} onChunk - Callback for each content chunk
     * @param {Object} options - Optional parameters
     * @returns {Promise<Object>} - { rateLimits: object }
     */
    async streamChat(messages, onChunk, options = {}) {
        throw new Error('streamChat() must be implemented by subclass');
    }

    /**
     * Validate API key by making a test call
     * @returns {Promise<Object>} - { valid: boolean, error?: string }
     */
    async validateApiKey() {
        try {
            await this.chat([{ role: 'user', content: 'Hi' }], { maxTokens: 10 });
            return { valid: true };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Get available models for this provider
     * @returns {Array<Object>} - Array of { id: string, name: string, costPer1k: number }
     */
    getModels() {
        throw new Error('getModels() must be implemented by subclass');
    }

    /**
     * Parse rate limit information from response headers
     * @param {Headers} headers - Fetch API Headers object
     * @returns {Object|null} - Rate limit information
     */
    parseRateLimits(headers) {
        return null; // Override in subclass
    }

    /**
     * Get provider name
     * @returns {string}
     */
    getName() {
        return this.constructor.name.replace('Provider', '');
    }
}

// ============================================
// OpenAI Provider Implementation
// ============================================

class OpenAIProvider extends LLMProvider {
    constructor(apiKey, config = {}) {
        super(apiKey, config);
        this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
        this.defaultModel = config.model || 'gpt-4o';
        this.organization = config.organization || null;
    }

    async chat(messages, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        if (this.organization) {
            headers['OpenAI-Organization'] = this.organization;
        }

        const requestBody = {
            model: options.model || this.defaultModel,
            messages: messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature !== undefined ? options.temperature : 0.7,
            stream: false
        };

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const rateLimits = this.parseRateLimits(response.headers);

        return {
            content: data.choices[0].message.content,
            usage: data.usage || null,
            rateLimits: rateLimits,
            model: data.model,
            finishReason: data.choices[0].finish_reason
        };
    }

    async streamChat(messages, onChunk, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        if (this.organization) {
            headers['OpenAI-Organization'] = this.organization;
        }

        const requestBody = {
            model: options.model || this.defaultModel,
            messages: messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature !== undefined ? options.temperature : 0.7,
            stream: true
        };

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Parse Server-Sent Events (SSE) stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();

                        if (data === '[DONE]') {
                            continue;
                        }

                        try {
                            const json = JSON.parse(data);
                            const content = json.choices[0]?.delta?.content;

                            if (content) {
                                onChunk(content);
                            }
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e, 'Line:', data);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        const rateLimits = this.parseRateLimits(response.headers);
        return { rateLimits };
    }

    parseRateLimits(headers) {
        // OpenAI rate limit headers
        // https://platform.openai.com/docs/guides/rate-limits

        const getHeader = (name) => {
            if (typeof headers.get === 'function') {
                return headers.get(name);
            }
            return headers[name] || null;
        };

        return {
            requests: {
                limit: getHeader('x-ratelimit-limit-requests'),
                remaining: getHeader('x-ratelimit-remaining-requests'),
                reset: getHeader('x-ratelimit-reset-requests')
            },
            tokens: {
                limit: getHeader('x-ratelimit-limit-tokens'),
                remaining: getHeader('x-ratelimit-remaining-tokens'),
                reset: getHeader('x-ratelimit-reset-tokens')
            }
        };
    }

    getModels() {
        return [
            {
                id: 'gpt-4o',
                name: 'GPT-4o (Recommended)',
                description: 'Most capable model, balanced performance and cost',
                costPer1k: 0.005,
                contextWindow: 128000
            },
            {
                id: 'gpt-4o-mini',
                name: 'GPT-4o Mini (Fast & Cheap)',
                description: 'Fast and affordable, good for most tasks',
                costPer1k: 0.00015,
                contextWindow: 128000
            },
            {
                id: 'gpt-4-turbo',
                name: 'GPT-4 Turbo',
                description: 'Previous generation flagship model',
                costPer1k: 0.01,
                contextWindow: 128000
            },
            {
                id: 'gpt-3.5-turbo',
                name: 'GPT-3.5 Turbo (Budget)',
                description: 'Budget-friendly, good for simple tasks',
                costPer1k: 0.0005,
                contextWindow: 16385
            }
        ];
    }

    /**
     * Estimate token count for a message (rough approximation)
     * @param {string} text - Text to estimate
     * @returns {number} - Estimated token count
     */
    estimateTokens(text) {
        // Rough estimation: ~4 characters per token
        // This is a simplified approximation. For exact counts, use tiktoken library
        return Math.ceil(text.length / 4);
    }

    /**
     * Estimate cost for a message
     * @param {number} tokens - Token count
     * @param {string} modelId - Model identifier
     * @returns {number} - Estimated cost in USD
     */
    estimateCost(tokens, modelId = null) {
        const model = this.getModels().find(m => m.id === (modelId || this.defaultModel));
        const costPer1k = model ? model.costPer1k : 0.005; // Default to GPT-4o
        return (tokens / 1000) * costPer1k;
    }
}

// ============================================
// Anthropic Provider Implementation (Stub)
// ============================================

class AnthropicProvider extends LLMProvider {
    constructor(apiKey, config = {}) {
        super(apiKey, config);
        this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
        this.defaultModel = config.model || 'claude-3-5-sonnet-20241022';
        this.apiVersion = config.apiVersion || '2023-06-01';
    }

    /**
     * Convert OpenAI-style messages to Anthropic format
     * @param {Array} messages - OpenAI-style messages
     * @returns {Object} - { system: string, messages: Array }
     */
    convertMessages(messages) {
        let systemMessage = null;
        const anthropicMessages = [];

        for (const msg of messages) {
            if (msg.role === 'system') {
                // Anthropic handles system messages separately
                systemMessage = msg.content;
            } else {
                anthropicMessages.push({
                    role: msg.role, // Anthropic uses same 'user' and 'assistant' roles
                    content: msg.content
                });
            }
        }

        return { system: systemMessage, messages: anthropicMessages };
    }

    async chat(messages, options = {}) {
        const model = options.model || this.defaultModel;
        const { system, messages: anthropicMessages } = this.convertMessages(messages);

        const requestBody = {
            model: model,
            messages: anthropicMessages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature !== undefined ? options.temperature : 0.7,
            stream: false
        };

        if (system) {
            requestBody.system = system;
        }

        const response = await fetch(`${this.baseUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': this.apiVersion
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.content || !data.content[0]) {
            throw new Error('No response from Anthropic API');
        }

        const content = data.content.map(block => block.text).join('');

        return {
            content: content,
            usage: data.usage || null,
            rateLimits: null,
            model: data.model,
            finishReason: data.stop_reason
        };
    }

    async streamChat(messages, onChunk, options = {}) {
        const model = options.model || this.defaultModel;
        const { system, messages: anthropicMessages } = this.convertMessages(messages);

        const requestBody = {
            model: model,
            messages: anthropicMessages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature !== undefined ? options.temperature : 0.7,
            stream: true
        };

        if (system) {
            requestBody.system = system;
        }

        const response = await fetch(`${this.baseUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': this.apiVersion
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Parse Server-Sent Events (SSE) stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();

                        if (data === '[DONE]') {
                            continue;
                        }

                        try {
                            const json = JSON.parse(data);

                            // Anthropic streaming events
                            if (json.type === 'content_block_delta' && json.delta?.text) {
                                onChunk(json.delta.text);
                            }
                        } catch (e) {
                            console.error('Failed to parse Anthropic SSE data:', e, 'Line:', data);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        return { rateLimits: null };
    }

    getModels() {
        return [
            {
                id: 'claude-3-5-sonnet-20241022',
                name: 'Claude 3.5 Sonnet (New)',
                description: 'Best balance of intelligence, speed, and cost',
                costPer1k: 0.003,
                contextWindow: 200000
            },
            {
                id: 'claude-3-5-haiku-20241022',
                name: 'Claude 3.5 Haiku (New)',
                description: 'Fast and efficient for most tasks',
                costPer1k: 0.0008,
                contextWindow: 200000
            },
            {
                id: 'claude-3-opus-20240229',
                name: 'Claude 3 Opus',
                description: 'Most capable model, best for complex tasks',
                costPer1k: 0.015,
                contextWindow: 200000
            },
            {
                id: 'claude-3-sonnet-20240229',
                name: 'Claude 3 Sonnet',
                description: 'Balanced performance and cost',
                costPer1k: 0.003,
                contextWindow: 200000
            },
            {
                id: 'claude-3-haiku-20240307',
                name: 'Claude 3 Haiku',
                description: 'Fastest and most affordable',
                costPer1k: 0.00025,
                contextWindow: 200000
            }
        ];
    }

    estimateTokens(text) {
        // Rough estimation (similar to OpenAI)
        return Math.ceil(text.length / 4);
    }

    estimateCost(tokens, modelId = null) {
        const model = this.getModels().find(m => m.id === (modelId || this.defaultModel));
        const costPer1k = model ? model.costPer1k : 0.003;
        return (tokens / 1000) * costPer1k;
    }
}

// ============================================
// Azure OpenAI Provider Implementation (Stub)
// ============================================

class AzureOpenAIProvider extends LLMProvider {
    constructor(apiKey, config = {}) {
        super(apiKey, config);
        this.endpoint = config.endpoint; // Required: https://{resource}.openai.azure.com/
        this.deployment = config.deployment; // Required: deployment name
        this.apiVersion = config.apiVersion || '2024-02-15-preview';
    }

    async chat(messages, options = {}) {
        throw new Error('Azure OpenAI provider not yet implemented. Coming in Phase 3.');
    }

    async streamChat(messages, onChunk, options = {}) {
        throw new Error('Azure OpenAI provider not yet implemented. Coming in Phase 3.');
    }

    getModels() {
        return [
            {
                id: 'gpt-4o',
                name: 'GPT-4o (Azure)',
                description: 'Enterprise-grade OpenAI model',
                costPer1k: 0.005,
                contextWindow: 128000
            }
        ];
    }
}

// ============================================
// Google Gemini Provider Implementation (Stub)
// ============================================

class GeminiProvider extends LLMProvider {
    constructor(apiKey, config = {}) {
        super(apiKey, config);
        this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
        this.defaultModel = config.model || 'gemini-2.0-flash-exp';
    }

    /**
     * Convert OpenAI-style messages to Gemini format
     * @param {Array} messages - OpenAI-style messages
     * @returns {Array} - Gemini-style contents
     */
    convertMessages(messages) {
        const geminiContents = [];
        let systemInstruction = null;

        for (const msg of messages) {
            if (msg.role === 'system') {
                // Gemini handles system messages separately
                systemInstruction = msg.content;
            } else {
                geminiContents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                });
            }
        }

        return { contents: geminiContents, systemInstruction };
    }

    async chat(messages, options = {}) {
        const model = options.model || this.defaultModel;
        const { contents, systemInstruction } = this.convertMessages(messages);

        const requestBody = {
            contents: contents,
            generationConfig: {
                maxOutputTokens: options.maxTokens || 1000,
                temperature: options.temperature !== undefined ? options.temperature : 0.7
            }
        };

        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `Gemini API error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('No response from Gemini API');
        }

        const content = data.candidates[0].content.parts.map(p => p.text).join('');

        return {
            content: content,
            usage: data.usageMetadata || null,
            rateLimits: null,
            model: model,
            finishReason: data.candidates[0].finishReason
        };
    }

    async streamChat(messages, onChunk, options = {}) {
        const model = options.model || this.defaultModel;
        const { contents, systemInstruction } = this.convertMessages(messages);

        const requestBody = {
            contents: contents,
            generationConfig: {
                maxOutputTokens: options.maxTokens || 1000,
                temperature: options.temperature !== undefined ? options.temperature : 0.7
            }
        };

        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const url = `${this.baseUrl}/models/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `Gemini API error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Parse Server-Sent Events (SSE) stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();

                        try {
                            const json = JSON.parse(data);
                            if (json.candidates && json.candidates[0] && json.candidates[0].content) {
                                const parts = json.candidates[0].content.parts;
                                if (parts && parts[0] && parts[0].text) {
                                    onChunk(parts[0].text);
                                }
                            }
                        } catch (e) {
                            console.error('Failed to parse Gemini SSE data:', e, 'Line:', data);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        return { rateLimits: null };
    }

    getModels() {
        return [
            {
                id: 'gemini-2.0-flash-exp',
                name: 'Gemini 2.0 Flash (Experimental)',
                description: 'Latest and fastest, experimental features',
                costPer1k: 0, // Currently free in preview
                contextWindow: 1048576 // 1M tokens
            },
            {
                id: 'gemini-1.5-flash',
                name: 'Gemini 1.5 Flash',
                description: 'Fast and efficient for most tasks',
                costPer1k: 0.000075,
                contextWindow: 1048576 // 1M tokens
            },
            {
                id: 'gemini-1.5-flash-8b',
                name: 'Gemini 1.5 Flash-8B',
                description: 'Optimized for high volume, lower cost',
                costPer1k: 0.0000375,
                contextWindow: 1048576 // 1M tokens
            },
            {
                id: 'gemini-1.5-pro',
                name: 'Gemini 1.5 Pro',
                description: 'Most capable model, best for complex tasks',
                costPer1k: 0.00125,
                contextWindow: 2097152 // 2M tokens
            }
        ];
    }

    estimateTokens(text) {
        // Rough estimation for Gemini (similar to OpenAI)
        return Math.ceil(text.length / 4);
    }

    estimateCost(tokens, modelId = null) {
        const model = this.getModels().find(m => m.id === (modelId || this.defaultModel));
        const costPer1k = model ? model.costPer1k : 0;
        return (tokens / 1000) * costPer1k;
    }
}

// ============================================
// Provider Registry
// ============================================

const LLMProviders = {
    LLMProvider,
    OpenAIProvider,
    AnthropicProvider,
    AzureOpenAIProvider,
    GeminiProvider
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.LLMProviders = LLMProviders;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LLMProviders;
}
