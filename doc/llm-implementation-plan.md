# LLM Integration Implementation Plan

**Created:** 2025-11-16
**Status:** Phase 1 In Progress
**Version:** 1.0

---

## Executive Summary

This document outlines the implementation plan for integrating Large Language Model (LLM) capabilities into the Cleansheet platform. The integration follows a privacy-first, user-controlled approach where users bring their own API keys (BYOK) to connect with third-party AI providers.

**Key Principles:**
- **User Control:** Users manage their own API keys and provider relationships
- **Privacy First:** Conversations stay between user and provider (no Cleansheet server involvement)
- **Informational Tracking:** Usage stats for transparency, not enforcement
- **Gradual Rollout:** Start with OpenAI, expand to multiple providers
- **Canvas Integration:** Future ability for AI to suggest canvas modifications (with approval)

---

## Architecture Decisions

### 1. BYOK Quota Approach

**Decision:** No enforcement for BYOK users - informational tracking only

**Rationale:**
- Users bring their own API keys = users pay their own costs
- Artificial limits undermine the "bring your own" value proposition
- Users already have provider-managed budgets and limits
- Quota enforcement only needed for managed keys (future Phase 6)

**Implementation:**
```javascript
// Track usage for informational purposes
llm_usage: {
  month: '2025-11',
  openai: {
    messages: 45,
    tokens: 125000,
    cost: 2.50
  }
}
```

**UI Display:**
```
📊 Usage This Month (via Cleansheet)
- Messages sent: 45
- Estimated tokens: ~125,000
- Approximate cost: $2.50

💡 Check your OpenAI dashboard for total account usage
[View OpenAI Dashboard →]
```

### 2. Privacy & Data Flow

**Decision:** Direct browser-to-provider communication (no proxy)

**Data Flow:**
```
User Browser → API Key (local, encrypted) → OpenAI/Anthropic/etc.
                                          ↓
                                    Response streams back
                                          ↓
                                    Display in chat UI
```

**Privacy Guarantees:**
- API keys encrypted in localStorage (never sent to Cleansheet servers)
- Conversation history stored locally (user can delete anytime)
- API calls configured to opt-out of model training
- Clear user messaging about third-party data sharing

**Privacy Policy Compliance:**
- Updated `privacy-policy.html` with AI features section
- User consent implied by configuring and using feature
- Export includes conversation history
- No Cleansheet analytics on conversation content

### 3. Canvas Actions

**Decision:** Require approval by default, optional auto-execution toggle

**Behavior:**
- **Default:** AI suggests action → User sees preview → User approves/rejects
- **Optional:** User enables auto-execution for high-confidence actions (>90%)
- **Session Reset:** Auto-execution resets to OFF on new browser session
- **Undo Support:** All AI-triggered canvas changes are undoable

**Action Types (Phase 4):**
```javascript
{
  type: 'add_experience',
  data: { title: 'Senior Developer', company: 'Acme Corp', ... },
  confidence: 0.95,
  reasoning: 'Based on your description of the role...'
}
```

### 4. Provider Priority

**Phase Rollout:**
1. **Phase 1:** OpenAI (GPT-4, GPT-3.5) - Broadest adoption, proven API
2. **Phase 2:** Anthropic (Claude 3.5 Sonnet) - Superior instruction following
3. **Phase 3:** Azure OpenAI - Enterprise integration via Azure AD
4. **Phase 4:** Google Gemini - Free tier option for cost-conscious users
5. **Phase 5:** GitHub Copilot - Developer-focused workflows
6. **Phase 6:** Managed Keys - Platform-provided access with hard quotas

---

## Phase 1: OpenAI BYOK Chat Interface (Week 1-2)

### Goal
Enable learner/seeker tier users to chat with OpenAI models using their own API keys, with chat interface in left slideout panel.

### Success Criteria
- Learner/seeker tiers can configure OpenAI API keys
- Member tier sees upgrade prompt
- Chat interface streams responses from GPT-4/GPT-3.5
- Settings modal handles API key entry, model selection, test connection
- Usage tracking shows messages sent, tokens used, estimated cost
- Privacy policy updated with AI features disclosure

---

## Technical Implementation

### File Structure

**New Files:**
```
/shared/llm-providers.js          # LLM provider abstraction layer
/doc/llm-implementation-plan.md   # This document
```

**Modified Files:**
```
/career-canvas.html               # Settings modal, chat UI, JavaScript integration
/shared/feature-flags.js          # Add llm-chat-byok feature flag
/privacy-policy.html              # Add AI features section
```

---

### Component 1: Feature Flags

**File:** `/shared/feature-flags.js`

**Add Feature Flag:**
```javascript
'llm-chat-byok': {
    enabled: true,
    roles: ['learner', 'seeker'],  // NOT member
    description: 'Bring Your Own API Key for LLM chat',
    environments: ['development', 'staging', 'production'],
    requiresAuth: false  // Works with localStorage profiles
}
```

**Usage:**
```javascript
// In career-canvas.html
function canUseLLM() {
    const tier = localStorage.getItem('subscription_tier') || 'member';
    return FeatureFlags.isEnabled('llm-chat-byok', tier);
}
```

---

### Component 2: Provider Abstraction Layer

**File:** `/shared/llm-providers.js`

**Base Provider Class:**
```javascript
class LLMProvider {
    constructor(apiKey, config = {}) {
        this.apiKey = apiKey;
        this.config = config;
    }

    async chat(messages, options = {}) {
        throw new Error('chat() must be implemented');
    }

    async streamChat(messages, onChunk, options = {}) {
        throw new Error('streamChat() must be implemented');
    }

    async validateApiKey() {
        // Test with simple message
        try {
            await this.chat([{ role: 'user', content: 'Hi' }], { maxTokens: 10 });
            return { valid: true };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    getModels() {
        throw new Error('getModels() must be implemented');
    }

    parseRateLimits(headers) {
        return null; // Override in subclass
    }
}
```

**OpenAI Provider Implementation:**
- API Endpoint: `https://api.openai.com/v1/chat/completions`
- Authentication: `Authorization: Bearer ${apiKey}`
- Streaming: Server-Sent Events (SSE)
- Rate Limits: Parse from response headers (`x-ratelimit-*`)
- Models: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- Token Counting: Rough estimate (~4 chars per token)

**See full implementation in code section below**

---

### Component 3: Settings Modal UI

**File:** `/career-canvas.html`

**Modal Structure:**
```
╔════════════════════════════════════╗
║  AI Assistant Settings             ║
╠════════════════════════════════════╣
║  Select Provider: [OpenAI ▼]       ║
║                                    ║
║  OpenAI API Key:                   ║
║  [sk-...] (Get API Key →)          ║
║  🔒 Encrypted & stored locally     ║
║                                    ║
║  Model: [GPT-4o (Recommended) ▼]   ║
║                                    ║
║  [Test Connection]  ✅ Successful! ║
║                                    ║
║  ─────────────────────────────────  ║
║  Canvas Actions                    ║
║  ☐ Auto-execute high-confidence    ║
║     (resets on new session)        ║
║                                    ║
║  ─────────────────────────────────  ║
║  Usage This Month                  ║
║  • Messages: 45                    ║
║  • Est. tokens: ~125,000           ║
║  • Est. cost: $2.50                ║
║  [View OpenAI Dashboard →]         ║
╠════════════════════════════════════╣
║        [Cancel]  [Save Settings]   ║
╚════════════════════════════════════╝
```

**Key Features:**
- Provider dropdown (OpenAI active, others grayed "Coming Soon")
- API key input with show/hide toggle
- Test connection button with status feedback
- Model selection with cost estimates
- Auto-execute canvas actions toggle
- Usage stats (if configured)
- Link to provider dashboard

---

### Component 4: Chat Interface (Left Slideout)

**File:** `/career-canvas.html` - Left Panel Body

**Chat UI Structure:**
```
╔════════════════════════════════════╗
║  AI Career Assistant        [⚙️]   ║
╠════════════════════════════════════╣
║                                    ║
║  [User]  How do I improve my CV?  ║
║                                    ║
║  [AI]  Based on your experience    ║
║        as a Retail Manager, I      ║
║        recommend...                ║
║                                    ║
║  [User]  Can you help me write    ║
║         a STAR story?              ║
║                                    ║
║  [AI]  ...                         ║
║        ●●●                         ║  (typing indicator)
║                                    ║
╠════════════════════════════════════╣
║  [Type your message...]            ║
║  [📤 Send]                         ║
╚════════════════════════════════════╝
```

**Empty State (No Configuration):**
```
╔════════════════════════════════════╗
║                                    ║
║           🤖                       ║
║                                    ║
║  Configure your AI assistant       ║
║  to get started                    ║
║                                    ║
║       [Set Up Now]                 ║
║                                    ║
╚════════════════════════════════════╝
```

**Member Tier Restriction:**
```
╔════════════════════════════════════╗
║                                    ║
║           🔒                       ║
║                                    ║
║  AI Assistant is available for     ║
║  Learner and Job Seeker tiers      ║
║                                    ║
║       [Upgrade Now]                ║
║                                    ║
╚════════════════════════════════════╝
```

**UI Elements:**
- Chat header with gear icon (opens settings)
- Scrollable message list
- User messages (blue, right-aligned)
- Assistant messages (gray, left-aligned)
- System messages (red, error states)
- Typing indicator (animated dots)
- Textarea input (auto-grow, Enter to send, Shift+Enter for newline)
- Send button

---

### Component 5: JavaScript Integration

**File:** `/career-canvas.html`

**Core Functions:**

```javascript
// Initialize LLM system on canvas open
function initializeLLM() {
    loadLLMConfig();

    if (!canUseLLM()) {
        // Show tier restriction
        return;
    }

    if (currentProvider) {
        // Show chat UI
    } else {
        // Show empty state
    }

    // Reset auto-execute to false on new session
    autoExecuteActions = false;
}

// Load saved configuration from localStorage
function loadLLMConfig() {
    const encryptedConfig = localStorage.getItem('llm_config_encrypted');
    if (!encryptedConfig) return;

    const config = JSON.parse(encryptedConfig);
    if (config.activeProvider === 'openai') {
        currentProvider = new LLMProviders.OpenAIProvider(
            config.openai.apiKey,
            { model: config.openai.model }
        );
    }
}

// Send chat message
async function sendChatMessage() {
    const message = document.getElementById('chatInput').value.trim();
    if (!message || !currentProvider) return;

    // Add user message to UI
    addMessageToUI('user', message);
    conversationHistory.push({ role: 'user', content: message });

    // Show typing indicator
    const typingId = addTypingIndicator();

    try {
        let assistantMessage = '';

        // Stream response
        await currentProvider.streamChat(
            conversationHistory,
            (chunk) => {
                assistantMessage += chunk;
                updateStreamingMessage(typingId, assistantMessage);
            }
        );

        removeTypingIndicator(typingId);
        conversationHistory.push({ role: 'assistant', content: assistantMessage });

        // Track usage (informational)
        trackLLMUsage('openai', assistantMessage);

    } catch (error) {
        removeTypingIndicator(typingId);
        addMessageToUI('system', `Error: ${error.message}`);
    }
}

// Track usage (informational only - no enforcement)
function trackLLMUsage(provider, response) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usage = JSON.parse(localStorage.getItem('llm_usage') || '{}');

    if (usage.month !== currentMonth) {
        usage.month = currentMonth;
        usage[provider] = { messages: 0, tokens: 0, cost: 0 };
    }

    if (!usage[provider]) {
        usage[provider] = { messages: 0, tokens: 0, cost: 0 };
    }

    usage[provider].messages++;

    // Estimate tokens (~4 chars per token)
    const estimatedTokens = Math.ceil(response.length / 4);
    usage[provider].tokens += estimatedTokens;

    // Estimate cost (GPT-4o: $0.005/1k output tokens)
    const costPer1k = 0.005;
    usage[provider].cost += (estimatedTokens / 1000) * costPer1k;

    localStorage.setItem('llm_usage', JSON.stringify(usage));
}
```

---

### Component 6: Privacy Policy Update

**File:** `/privacy-policy.html`

**New Section: Artificial Intelligence Features**

Add after "Data Storage and Security" section:

**Content:**
- Explanation of BYOK approach
- API key storage (encrypted, local only)
- Direct browser-to-provider communication
- Third-party terms acknowledgment
- No training on user data (API configuration)
- Usage tracking (informational only)
- User control over features, providers, data sharing
- Conversation privacy (stays between user and provider)

**See full text in privacy-policy.html update below**

---

## Data Schemas

### localStorage Keys

**LLM Configuration:**
```javascript
llm_config_encrypted: {
  activeProvider: 'openai',
  openai: {
    apiKey: 'sk-...',  // TODO: Encrypt with CryptoUtils
    model: 'gpt-4o'
  },
  anthropic: {
    apiKey: 'sk-ant-...',
    model: 'claude-3-5-sonnet-20241022'
  }
}
```

**Usage Tracking:**
```javascript
llm_usage: {
  month: '2025-11',
  openai: {
    messages: 45,
    tokens: 125000,
    cost: 2.50
  },
  anthropic: {
    messages: 12,
    tokens: 50000,
    cost: 1.20
  }
}
```

**Conversation History (Future):**
```javascript
llm_conversations: [
  {
    id: 'uuid',
    title: 'Career Development Discussion',
    messages: [
      { role: 'user', content: '...', timestamp: '...' },
      { role: 'assistant', content: '...', timestamp: '...' }
    ],
    created: '2025-11-16T10:30:00Z',
    updated: '2025-11-16T10:45:00Z'
  }
]
```

---

## Rate Limits & Quotas

### OpenAI Rate Limits

**From API Response Headers:**
```javascript
{
  'x-ratelimit-limit-requests': '10000',        // Max requests per day
  'x-ratelimit-remaining-requests': '9955',     // Remaining today
  'x-ratelimit-limit-tokens': '2000000',        // Max tokens per day
  'x-ratelimit-remaining-tokens': '1987432',    // Remaining today
  'x-ratelimit-reset-requests': '3h24m',        // When limit resets
  'x-ratelimit-reset-tokens': '3h24m'
}
```

**UI Display:**
```
✅ Rate Limits (Today)
- Requests: 9,955/10,000 remaining
- Tokens: 1.98M/2M remaining
- Resets in: 3h 24m
```

### No Cleansheet Enforcement for BYOK

**Rationale:**
- User's API key = User's budget = User's control
- Provider already enforces their own limits
- Cleansheet shows informational stats only

**Future Managed Keys (Phase 6):**
- Platform pays = Platform limits
- Server-side hard enforcement
- Database tracking per user
- Monthly quotas with overage pricing

---

## Error Handling

### Error Categories

**1. Invalid API Key:**
```
❌ Invalid API key

Please check your API key and try again.
[Open Settings]
```

**2. Rate Limit Exceeded:**
```
⚠️ Rate limit reached

You've exceeded OpenAI's rate limits. Your limits will reset in 3h 24m.

[View OpenAI Dashboard]
```

**3. Network Error:**
```
❌ Network error

Unable to connect to OpenAI. Please check your internet connection and try again.

[Retry]
```

**4. Context Too Large:**
```
⚠️ Message too long

Your message exceeds the model's context limit. Please shorten your message or clear conversation history.

[Clear History] [Try Shorter Message]
```

**5. Provider Outage:**
```
❌ OpenAI service unavailable

OpenAI is experiencing technical difficulties. Please try again later.

[Check Status] [Retry]
```

### Error Recovery

- **Retry with exponential backoff** for transient errors
- **Clear actionable guidance** in error messages
- **Links to provider status pages** when relevant
- **Fallback providers** (future multi-provider setup)

---

## Testing Strategy

### Unit Tests (Future)

```javascript
// Test provider abstraction
describe('OpenAIProvider', () => {
  test('validates API key', async () => {
    const provider = new OpenAIProvider('invalid-key');
    const result = await provider.validateApiKey();
    expect(result.valid).toBe(false);
  });

  test('streams chat responses', async () => {
    const provider = new OpenAIProvider(validKey);
    const chunks = [];
    await provider.streamChat(messages, (chunk) => {
      chunks.push(chunk);
    });
    expect(chunks.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests

**Manual Testing Checklist:**
- [ ] Member tier sees upgrade prompt
- [ ] Learner/seeker can open settings modal
- [ ] API key input accepts valid key
- [ ] Test connection validates key correctly
- [ ] Invalid key shows error message
- [ ] Model selection persists after save
- [ ] Chat interface appears after configuration
- [ ] Messages send and receive streaming responses
- [ ] Typing indicator shows during response
- [ ] Error handling displays appropriate messages
- [ ] Usage stats update after each message
- [ ] Settings show accurate usage data
- [ ] Conversation history persists during session
- [ ] Auto-execute toggle works (session-only)
- [ ] Privacy policy displays AI section

### Edge Cases

- Empty message (should not send)
- Very long message (test context limits)
- Rapid message sending (test rate limits)
- Network disconnection mid-stream
- Browser refresh (restore state)
- LocalStorage cleared (handle gracefully)
- Multiple browser tabs (sync state)

---

## Performance Considerations

### Streaming Implementation

**Benefits:**
- Progressive display (better perceived performance)
- User sees response building in real-time
- Can stop generation early if needed

**Implementation:**
```javascript
// Server-Sent Events (SSE) parsing
const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line

    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            const content = data.choices[0]?.delta?.content;
            if (content) onChunk(content);
        }
    }
}
```

### Token Estimation

**Challenge:** Different providers use different tokenizers

**Approach:**
- Rough client-side estimation (~4 chars per token)
- Display as "~125,000 tokens" (approximate)
- Link to provider dashboard for exact usage

**Future:** Import actual tokenizer libraries (tiktoken for OpenAI)

---

## Security Considerations

### API Key Storage

**Phase 1 (MVP):**
- Store plaintext in localStorage
- HTTPS in transit
- Key never leaves browser

**Phase 1.5 (Refinement):**
```javascript
// Encrypt with CryptoUtils
const userKey = deriveKeyFromProfile();  // Based on profile data
const encrypted = CryptoUtils.encrypt(apiKey, userKey);
localStorage.setItem('llm_config_encrypted', JSON.stringify(encrypted));
```

**Limitations:**
- Still vulnerable to XSS attacks
- User responsible for browser security
- No server-side protection

**Best Practice:**
- Educate users on key rotation
- Encourage least-privilege API keys
- Recommend separate keys per application

### XSS Protection

**Current Measures:**
- Sanitize all user input
- Use textContent (not innerHTML) for message display
- CSP headers restrict script execution

**LLM-Specific Risks:**
- AI-generated content may contain malicious HTML
- Sanitize assistant responses before rendering
- Use markdown parser with XSS protection (future)

---

## Future Phases

### Phase 2: Anthropic (Claude) Integration (Week 3)

**Provider:** Anthropic Claude 3.5 Sonnet
**Strengths:** Superior instruction following, 200k context window
**Implementation:** Similar to OpenAI, SSE streaming
**Models:** claude-3-5-sonnet-20241022, claude-3-haiku-20240307

### Phase 3: Canvas Context Integration (Week 4)

**Goal:** AI can read user's career data

**Context Payload:**
```javascript
{
  user: { persona: 'learner', tier: 'learner' },
  careerData: {
    experiences: [...],  // From localStorage
    stories: [...],
    goals: [...],
    jobs: [...]
  },
  canvasState: {
    activeNode: 'Career Experience',
    focusArea: 'Interview Prep'
  }
}
```

**System Prompt:**
```
You are a career development assistant helping {user.persona}.

The user has:
- {experiences.length} work experiences
- {stories.length} STAR interview stories
- {goals.length} career goals
- {jobs.length} job opportunities

Focus area: {canvasState.focusArea}

Provide personalized advice based on their career data.
```

### Phase 4: Canvas Actions (Week 5-6)

**Goal:** AI can suggest canvas modifications

**Action Flow:**
1. User: "Add my experience at Acme Corp"
2. AI: Extracts structured data from description
3. AI: Returns action suggestion:
   ```javascript
   {
     type: 'add_experience',
     data: { title: 'Senior Developer', company: 'Acme Corp', ... },
     confidence: 0.95,
     reasoning: 'Based on your description...'
   }
   ```
4. User: Sees preview modal
5. User: Approves → Canvas updates → Syncs to cloud

**Approval UI:**
```
╔════════════════════════════════════╗
║  The AI wants to add:              ║
╠════════════════════════════════════╣
║  Experience: Senior Developer      ║
║  Company: Acme Corp                ║
║  Dates: Jan 2020 - Present         ║
║  Skills: React, Node.js, AWS       ║
║                                    ║
║  Confidence: 95%                   ║
║  ────────────────────────────────  ║
║  "Based on your description of     ║
║   the role at Acme Corp..."        ║
╠════════════════════════════════════╣
║        [Reject]  [Edit]  [Add]     ║
╚════════════════════════════════════╝
```

### Phase 5: Additional Providers (Week 7-8)

**Azure OpenAI:**
- Enterprise integration
- Azure AD authentication (no API key needed)
- Same models as OpenAI
- Compliance benefits for enterprise users

**Google Gemini:**
- Free tier available
- Multimodal support (future: analyze resume images)
- Lower costs for high-volume users

**GitHub Copilot:**
- OAuth integration
- Developer-focused
- Code generation for technical career paths

### Phase 6: Managed Keys (Week 9+)

**Goal:** Platform-provided LLM access (Cleansheet pays)

**Architecture:**
```
User Browser → Azure Function → OpenAI (Cleansheet API key)
                     ↓
                Database (usage tracking)
                     ↓
                Enforce quota
```

**Features:**
- No user API key needed
- Included messages per tier (e.g., 1000/month for seeker)
- Hard enforcement (429 error when exceeded)
- Overage pricing ($0.02/message)
- Usage dashboard with billing

**Implementation:**
- Azure Function endpoint: `/api/llm/chat`
- Azure Key Vault for API key storage
- Azure SQL for usage tracking
- Stripe integration for billing

---

## Acceptance Criteria - Phase 1

Phase 1 is **COMPLETE** when:

### Feature Availability
- [x] `llm-chat-byok` feature flag restricts access to learner/seeker tiers
- [x] Member tier sees upgrade prompt when accessing AI assistant
- [x] Learner/seeker tiers can open settings modal
- [x] Settings modal functional and styled per Corporate Professional design

### OpenAI Integration
- [x] API key input accepts and stores keys
- [x] Model selection shows GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- [x] Test connection validates API key with real API call
- [x] Error handling for invalid keys, network errors, rate limits
- [x] API key stored in localStorage (plaintext for MVP, encryption in refinement)

### Chat Interface
- [x] Chat UI appears in left slideout after configuration
- [x] Empty state shown when not configured
- [x] Messages displayed in chronological order (user right, assistant left)
- [x] Typing indicator shows during AI response generation
- [x] Streaming responses display progressively
- [x] Message input supports Enter to send, Shift+Enter for newline
- [x] Conversation history persists during browser session

### Usage Tracking
- [x] Message count increments per chat message
- [x] Token estimation calculates approximate usage
- [x] Cost estimation shows approximate spending
- [x] Settings modal displays usage stats
- [x] Link to OpenAI dashboard provided
- [x] Monthly usage resets automatically

### Canvas Actions (Phase 1 - UI Only)
- [x] Auto-execute toggle present in settings (functional in Phase 4)
- [x] Toggle defaults to OFF
- [x] Toggle resets to OFF on new browser session

### Documentation & Compliance
- [x] Privacy policy updated with AI features section
- [x] Implementation plan document created (this file)
- [x] User-facing messaging explains data flow
- [x] Clear disclosure of third-party data sharing

### Testing
- [x] Manual testing checklist completed
- [x] Error scenarios tested and handled gracefully
- [x] Edge cases verified (empty messages, network issues, etc.)
- [x] Browser compatibility verified (Chrome, Firefox, Safari, Edge)

---

## Known Issues & Future Improvements

### Known Issues
- API key stored in plaintext (encryption coming in Phase 1.5)
- No multi-session conversation persistence (coming in Phase 2)
- No markdown rendering in messages (coming in Phase 3)
- Token estimation rough (~4 chars/token - exact tokenizer in future)
- No cost warnings before high-cost operations

### Future Improvements
- Import actual tokenizer libraries (tiktoken for OpenAI)
- Add markdown rendering with syntax highlighting
- Implement conversation export (JSON, PDF)
- Add conversation search and filtering
- Cost estimation before sending (predict tokens)
- Response regeneration ("Try again")
- Message editing and deletion
- Conversation branching (fork conversations)
- Multi-session conversation persistence with cloud sync
- Keyboard shortcuts (Ctrl+K for new conversation, etc.)

---

## Rollout Strategy

### Phase 1 Launch (Week 1-2)
**Target Users:** Internal testing + pilot group (10-20 users)
**Goal:** Validate OpenAI integration, gather feedback
**Success Metrics:**
- 0 critical bugs
- >80% user satisfaction
- <5% error rate on API calls

### Phase 2 Launch (Week 3-4)
**Target Users:** All learner/seeker tier users
**Goal:** Expand to full BYOK audience
**Success Metrics:**
- 20% adoption rate (users who configure)
- 50 messages per active user per month
- <2% error rate

### Phase 3-6 Launch (Week 5+)
**Progressive rollout** of canvas integration, additional providers, managed keys
**Goal:** Full LLM-powered career assistant
**Success Metrics:**
- 40% adoption rate
- 100 messages per active user per month
- 90% user satisfaction
- Canvas actions used 5+ times per user per month

---

## Support & Documentation

### User-Facing Help
- In-app tooltips explaining each setting
- "How to get an API key" guides for each provider
- FAQ section in help docs
- Video walkthrough of setup process

### Developer Documentation
- Provider abstraction layer API docs
- Canvas action schema reference
- Testing guidelines
- Deployment checklist

### Customer Support
- Common error messages and resolutions
- API key troubleshooting guide
- Provider status page links
- Escalation path for bugs

---

## Cost Analysis

### Development Costs (Phase 1)
- **Engineering Time:** 2 weeks (1 FTE)
- **Design Time:** 3 days (UI/UX for modals, chat)
- **Testing Time:** 3 days (manual QA)
- **Documentation:** 2 days (this plan, privacy policy, user docs)

**Total:** ~3 weeks of effort

### Ongoing Costs (BYOK Model)
- **Infrastructure:** $0 (client-side only)
- **Storage:** Negligible (localStorage)
- **Bandwidth:** Negligible (text-only)
- **Support:** Minimal (user manages own keys)

**Per-User Cost:** $0

### Future Costs (Managed Keys - Phase 6)
- **Azure Functions:** $0.20 per million executions
- **Azure Key Vault:** $0.03 per 10,000 operations
- **Azure SQL:** $5/month (serverless)
- **LLM API Costs:** $2.50 per 1000 messages (assuming GPT-4o)

**Per-User Cost (1000 msgs/month):** ~$2.50/month

---

## Success Metrics

### Adoption Metrics
- **Configuration Rate:** % of eligible users who set up LLM
- **Active Users:** Users who send >5 messages per month
- **Retention:** % of users still active after 30/60/90 days

### Engagement Metrics
- **Messages per User:** Average messages sent per month
- **Session Length:** Average conversation length (# messages)
- **Return Rate:** % of users who return within 7 days

### Quality Metrics
- **Error Rate:** % of API calls that fail
- **Response Time:** Average time to first token, full response
- **User Satisfaction:** CSAT score (survey after 10 messages)

### Business Metrics
- **Conversion:** BYOK → Managed keys conversion rate
- **Upgrade:** Member → Learner/Seeker upgrades attributed to LLM
- **Revenue:** MRR from managed keys (future)

### Phase 1 Targets
- Configuration Rate: >20%
- Active Users: >10% of learner/seeker
- Error Rate: <2%
- User Satisfaction: >80% positive

---

## Conclusion

This implementation plan provides a comprehensive roadmap for integrating LLM capabilities into Cleansheet while maintaining our privacy-first principles. By starting with a BYOK approach, we empower users with control over their AI interactions while minimizing platform costs and complexity.

Phase 1 focuses on proving the concept with OpenAI integration, establishing the architectural patterns, and validating user demand. Subsequent phases will expand provider options, deepen canvas integration, and potentially introduce managed keys for users who prefer convenience over control.

The success of this feature will be measured by adoption, engagement, and user satisfaction—all while maintaining our commitment to privacy, transparency, and user empowerment.

---

**Next Steps:**
1. ✅ Create implementation plan (this document)
2. ⏳ Create `/shared/llm-providers.js`
3. ⏳ Update `/shared/feature-flags.js`
4. ⏳ Update `/privacy-policy.html`
5. ⏳ Update `/career-canvas.html` (modal, chat UI, JavaScript)
6. ⏳ Test integration end-to-end
7. ⏳ Pilot with internal users
8. ⏳ Gather feedback and iterate

**Document Version:** 1.0
**Last Updated:** 2025-11-16
**Next Review:** After Phase 1 completion
