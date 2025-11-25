# Career Canvas - ACTUAL Structure Analysis

**Date**: November 24, 2025
**Purpose**: Document the REAL structure of career-canvas.html before refactoring
**Status**: Analysis in Progress

---

## Executive Summary

The career-canvas.html file (55,459 lines, 3MB) is NOT a simple portfolio/job tracker. It is a sophisticated career development platform with:
- AI-powered chat assistant with multi-provider LLM support
- Multiple specialized content views (Canvas mindmap, Career Paths, Industry Roles, Library)
- Document editors (Quill for rich text, Draw.io for diagrams, LaTeX for academic documents)
- Cloud sync with Azure blob storage
- Authentication via MSAL (Microsoft Authentication Library)
- Complex data management with backup/restore/encryption

---

## Top-Level Structure

### 1. Main Navigation (Top Bar)

**Location**: Lines 7620-7761

**Primary Tabs**:
1. **Canvas** - Interactive mindmap of user's career profile
2. **Paths** - Career path exploration and guidance
3. **Industry** - Industry/role translation and discovery
4. **Library** - Curated career development content
5. **About** - Dropdown with info, white papers, privacy policy

**Right Side Elements**:
- Profile Avatar Circle (with initials)
- Profile Dropdown Menu:
  - Profile Settings
  - Prompt Builder
  - Data Management
  - Install App
  - Erasure Request

**Function**: `switchCanvasTab(tabName)`
- Switches between the 4 main content views
- Updates active state on navigation buttons
- Shows/hides corresponding content sections

---

## 2. Layout Structure

### Overall Layout
```
┌─────────────────────────────────────────────────────────┐
│  Header (Dark)                                          │
│  Logo | Canvas | Paths | Industry | Library | About    │
│                                          [Profile Icon] │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  Left Panel  │  Right Panel (Main Content Area)        │
│  (350px)     │  (Flexible width)                       │
│              │                                          │
│  AI Chat     │  - Canvas Tab Content                   │
│  Assistant   │  - Paths Tab Content                    │
│              │  - Industry Tab Content                 │
│              │  - Library Tab Content                  │
│              │                                          │
│              │  Each tab has completely different      │
│              │  content and functionality              │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Left Panel (AI Chat Assistant)

**Location**: Lines 7767-8200 (approximately)

**Components**:
1. **Header**
   - Welcome message with user name
   - Tier badge (e.g., "Seeker")

2. **Chat Header Bar**
   - "AI Career Assistant" title with robot icon
   - Provider/Model badge (clickable to change model)
   - Context Control button
   - Usage Statistics button
   - Clear Chat button
   - New Chat button

3. **Chat Messages Area**
   - Scrollable message container
   - User messages (right-aligned, blue background)
   - AI messages (left-aligned, white background)
   - Markdown rendering support
   - Code syntax highlighting
   - Streaming response support

4. **Chat Input Area**
   - Multi-line textarea
   - Send button
   - Token counter
   - Suggestion chips (contextual prompts)

**Key Functions**:
- `sendMessage()` - Sends user message to LLM
- `streamResponse()` - Handles streaming AI responses
- `renderMarkdown()` - Converts markdown to HTML
- `updateProviderBadge()` - Shows current LLM provider/model
- `openContextControlModal()` - Configure what AI can see
- `openLLMUsageModal()` - View token usage statistics

**LLM Providers Supported**:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (Gemini)

---

### Right Panel - Content Areas

The right panel completely changes based on which tab is active.

#### TAB 1: Canvas (Main View)

**Purpose**: Interactive mindmap of user's career profile

**Key Sections** (expandable tree nodes):
1. **Profile**
   - Personal Information
   - Goals (SMART goals with milestones, progress tracking)
   - Skills & Competencies
   - Certifications

2. **Portfolio**
   - Projects (with technologies, links, descriptions)
   - Achievements
   - Publications
   - Presentations

3. **Experience**
   - Work History (with STAR stories)
   - Education
   - Volunteer Work
   - Side Projects

4. **Job Search**
   - Active Applications (with status tracking)
   - Saved Jobs
   - Interview Preparation
   - Networking Contacts

5. **Documents**
   - Resumes (multiple versions)
   - Cover Letters
   - References
   - Transcripts

6. **Career Development**
   - Learning Paths
   - Mentorship
   - Professional Development
   - Industry Research

**Visualization**: D3.js tree layout with:
- Collapsible nodes
- Count badges on parent nodes
- Click to expand/collapse
- Click on leaf nodes to open slideout panels

**Key Functions**:
- `renderMindmap()` - Creates D3 visualization
- `refreshMindmap()` - Updates visualization with new data
- `toggleNode()` - Expand/collapse tree nodes
- `openNodeSlideout()` - Opens detail panel for a node

---

#### TAB 2: Paths (Career Path Explorer)

**Purpose**: Explore career paths and get guidance

**Components**:
1. **Path Selection Pills** - Clickable career path options
2. **Network Diagram** - D3 force-directed graph showing path connections
3. **Timeline View** - Career progression timeline
4. **Recommendations** - AI-suggested next steps

**Key Functions**:
- `renderCareerPaths()` - Display available paths
- `renderPathNetwork()` - D3 network visualization
- `getPathRecommendations()` - AI-powered suggestions

---

#### TAB 3: Industry (Role Translator)

**Purpose**: Translate roles across industries and discover opportunities

**Components**:
1. **Role Search** - Search for current role
2. **Industry Selector** - Choose target industry
3. **Translation Results** - Equivalent roles in target industry
4. **Skill Gap Analysis** - What skills are needed
5. **Job Market Data** - Salaries, demand, etc.

**Key Functions**:
- `translateRole()` - Maps role to equivalent in other industry
- `analyzeSkillGaps()` - Identifies missing skills
- `getMarketData()` - Fetches job market statistics

---

#### TAB 4: Library (Content Browser)

**Purpose**: Browse curated career development content

**Components**:
1. **Search Bar** - Search articles
2. **Filter Pills** - Filter by tags, career path, level
3. **Article Grid** - Cards showing articles
4. **Slideout Viewer** - Full article view (60% width)

**Data Source**: `shared/library-data.js` (189 published articles)

**Key Functions**:
- `loadLibraryArticles()` - Load articles from library-data.js
- `filterArticles()` - Apply search/filter criteria
- `openArticleSlideout()` - Show article in slideout panel

---

## 3. Slideout Panels (Right-Side Panels)

**Purpose**: Detail views that slide in from the right (60% width overlay)

**Common Structure**:
```html
<div class="slideout-panel" id="specificSlideout">
    <div class="slideout-header">
        <h2>Panel Title</h2>
        <button onclick="closeSlideout()">×</button>
    </div>
    <div class="slideout-body">
        <!-- Content specific to each panel -->
    </div>
    <div class="slideout-footer">
        <!-- Action buttons (Save, Cancel, etc.) -->
    </div>
</div>
```

**Major Slideouts Identified**:

1. **Profile Slideout** - Edit personal information
2. **Goal Slideout** - Add/edit SMART goals with milestones
3. **Project Slideout** - Add/edit portfolio projects
4. **Experience Slideout** - Add/edit work experience
5. **Story Slideout** - Add/edit STAR stories
6. **Job Application Slideout** - Track job applications
7. **Document Slideout** - Edit documents with rich text editors
8. **Diagram Slideout** - Create/edit diagrams with Draw.io
9. **Article Slideout** - View library articles
10. **Interview Prep Slideout** - Interview preparation tools

**Key Functions**:
- `openSlideout(slideoutId)` - Generic open function
- `closeSlideout(slideoutId)` - Generic close function
- `saveSlideoutData(slideoutId)` - Save data from slideout
- Individual save functions for each type

---

## 4. Modal Dialogs

**Purpose**: Full-screen or centered overlays for various functions

**Major Modals Identified**:

1. **Profile Settings Modal** - Edit user profile
2. **Prompt Builder Modal** - Configure AI prompt template
3. **Data Management Modal** - Backup/restore/export data
4. **Context Control Modal** - Configure what AI can access
5. **LLM Usage Modal** - View token usage and costs
6. **Model Selector Modal** - Choose LLM provider and model
7. **API Key Manager Modal** - Configure LLM API keys
8. **Subscription Modal** - View membership tiers
9. **Install App Modal** - PWA installation instructions
10. **Erasure Request Modal** - GDPR data deletion request
11. **About Modal** - About Cleansheet Canvas
12. **Export Options Modal** - Export data in various formats
13. **Cloud Sync Modal** - Configure Azure blob sync
14. **Quick Start Modal** - Load example profiles

**Key Functions**:
- `openModal(modalId)` - Generic open
- `closeModal(modalId)` - Generic close
- Many specific functions for each modal

---

## 5. Document Editors

### Quill Rich Text Editor

**Purpose**: Edit documents (resumes, cover letters, etc.)

**Location**: Integrated in document slideouts

**Features**:
- Rich text formatting (bold, italic, underline)
- Lists (ordered, unordered)
- Headers
- Links
- Images
- Code blocks

**Key Functions**:
- `initQuillEditor(containerId)` - Initialize Quill instance
- `getQuillContent()` - Get HTML content
- `setQuillContent(html)` - Set content
- `exportDocx()` - Convert to Word document

---

### Draw.io Diagram Editor

**Purpose**: Create flowcharts, diagrams, architecture diagrams

**Implementation**: iFrame embedding with postMessage communication

**Location**: Diagram slideout

**Features**:
- Full draw.io functionality
- Save diagrams as XML
- Export as PNG/SVG
- Link diagrams to projects/experiences

**Key Functions**:
- `openDiagramEditor(diagramId)` - Open editor
- `saveDiagram()` - Save diagram XML
- `exportDiagram(format)` - Export diagram

---

### LaTeX Document Editor

**Purpose**: Create academic documents, papers, CVs

**Implementation**: Custom LaTeX parser (SimpleLatex) + KaTeX for math

**Location**: Document slideout with LaTeX option

**Features**:
- LaTeX syntax support
- Math rendering with KaTeX
- CV templates (altacv class)
- Export to PDF

**Key Functions**:
- `SimpleLatex.parse()` - Parse LaTeX
- `SimpleLatex.render()` - Render to HTML
- `exportLatexPdf()` - Export to PDF

---

## 6. Data Management

### Data Structure

**Primary Storage**: localStorage (demo mode)

**Storage Keys**:
```javascript
// User profile
careerCanvas_profile_${personaName}

// Goals
careerCanvas_goals_${personaName}

// Portfolio projects
careerCanvas_portfolio_${personaName}

// Work experiences
careerCanvas_experiences_${personaName}

// STAR stories
careerCanvas_stories_${personaName}

// Job applications
careerCanvas_jobs_${personaName}

// Documents
careerCanvas_documents_${personaName}

// Diagrams
careerCanvas_diagrams_${personaName}

// AI chat history
careerCanvas_chatHistory_${personaName}

// LLM settings
careerCanvas_llmSettings

// API keys (encrypted)
careerCanvas_apiKeys
```

---

### Backup & Restore System

**Location**: Data Management Modal

**Features**:
1. **Export Backup**
   - Full backup (all data + API keys)
   - Canvas-only backup (no API keys)
   - Encrypted with password
   - JSON file download

2. **Import Backup**
   - Upload JSON file
   - Password prompt for encrypted files
   - Merge or replace existing data
   - Validation and error handling

3. **Export Formats**
   - JSON (full data)
   - CSV (for specific data types)
   - DOCX (for documents)
   - PDF (for documents)

**Key Functions**:
- `exportBackup(includeKeys)` - Create backup file
- `importBackup(file, password)` - Restore from backup
- `encryptBackup(data, password)` - Encrypt with AES
- `decryptBackup(encrypted, password)` - Decrypt backup

---

### Cloud Sync (Azure Blob Storage)

**Status**: Disabled by default (Issue #3)

**Implementation**:
- Azure MSAL authentication
- SAS token generation via Azure Function
- Blob storage for user data
- Sync up/down/full functions

**Key Functions**:
- `forceSyncUp()` - Push local to cloud
- `forceSyncDown()` - Pull cloud to local
- `forceFullSync()` - Bi-directional sync

---

## 7. LLM Integration

### Multi-Provider Support

**Providers**:
1. **OpenAI**
   - Models: gpt-4, gpt-4-turbo, gpt-3.5-turbo
   - API endpoint: https://api.openai.com/v1/chat/completions

2. **Anthropic**
   - Models: claude-3-opus, claude-3-sonnet, claude-3-haiku
   - API endpoint: https://api.anthropic.com/v1/messages

3. **Google**
   - Models: gemini-pro, gemini-pro-vision
   - API endpoint: https://generativelanguage.googleapis.com/v1beta/models

---

### API Key Management

**Location**: `shared/cleansheet-crypto.js`

**Features**:
- Encrypted storage of API keys
- Multiple provider keys stored simultaneously
- Device-specific encryption keys
- Backup/restore with re-encryption

**Key Functions**:
- `storeApiKey(provider, key)` - Encrypt and store
- `getApiKey(provider)` - Decrypt and retrieve
- `deleteApiKey(provider)` - Remove key
- `hasApiKey(provider)` - Check if key exists

---

### Context Control

**Purpose**: Let users control what data the AI can access

**Granular Controls**:
- ☑ Profile information
- ☑ Goals
- ☑ Portfolio projects
- ☑ Work experience
- ☑ STAR stories
- ☑ Job applications
- ☑ Documents
- ☑ Chat history

**Implementation**: Checkboxes in Context Control Modal

**Key Function**: `buildAIContext()` - Assembles context based on selected options

---

### Prompt Management

**Location**: Prompt Builder Modal

**Features**:
- System prompt configuration
- Template variables: {name}, {occupation}, {goals}
- Save/load prompt templates
- Preview generated prompt

**Default System Prompt**:
```
You are a professional career coach and advisor.
Help the user with their career development, job search,
and professional growth. Be encouraging, specific, and actionable.
```

---

## 8. Critical JavaScript Functions

### Initialization Functions

```javascript
// Main initialization
window.addEventListener('load', async () => {
    await initializeCanvas();
    loadUserProfile();
    renderMindmap();
    initializeLLM();
});

function initializeCanvas() {
    // Load persona data
    // Set up event listeners
    // Initialize UI components
}

function loadUserProfile() {
    // Load from localStorage or use default
    // Populate UI with user data
}
```

---

### Canvas Navigation Functions

```javascript
function switchCanvasTab(tabName) {
    // Hide all tab content areas
    // Show selected tab content
    // Update active button state
    // Load tab-specific data
}

function openCanvasModal() {
    // Show the canvas modal
    // Initialize if first time
}

function closeCanvasModal() {
    // Hide the canvas modal
}
```

---

### Data CRUD Functions

```javascript
// Goals
function addGoal(goalData) { }
function updateGoal(goalId, goalData) { }
function deleteGoal(goalId) { }
function getGoals() { }

// Portfolio
function addProject(projectData) { }
function updateProject(projectId, projectData) { }
function deleteProject(projectId) { }
function getProjects() { }

// Experiences
function addExperience(expData) { }
function updateExperience(expId, expData) { }
function deleteExperience(expId) { }
function getExperiences() { }

// Jobs
function addJobApplication(jobData) { }
function updateJobApplication(jobId, jobData) { }
function deleteJobApplication(jobId) { }
function getJobApplications() { }

// Documents
function addDocument(docData) { }
function updateDocument(docId, docData) { }
function deleteDocument(docId) { }
function getDocuments() { }

// Diagrams
function addDiagram(diagramData) { }
function updateDiagram(diagramId, diagramData) { }
function deleteDiagram(diagramId) { }
function getDiagrams() { }
```

---

### D3 Visualization Functions

```javascript
function renderMindmap() {
    // Create D3 tree layout
    // Render nodes and links
    // Add interactivity
}

function refreshMindmap() {
    // Update visualization with new data
}

function toggleNode(nodeId) {
    // Expand/collapse tree node
}

function updateNodeCounts() {
    // Update count badges on nodes
}
```

---

### LLM Functions

```javascript
async function sendMessage() {
    // Get user message
    // Build AI context
    // Call appropriate provider API
    // Stream or return response
}

async function callOpenAI(messages) {
    // OpenAI-specific API call
}

async function callAnthropic(messages) {
    // Anthropic-specific API call
}

async function callGemini(messages) {
    // Gemini-specific API call
}

function streamResponse(reader) {
    // Handle streaming response chunks
}

function renderMarkdown(text) {
    // Convert markdown to HTML with marked.js
    // Sanitize with DOMPurify
}
```

---

## 9. External Dependencies

### JavaScript Libraries

1. **D3.js v7** - Data visualizations
   - Tree layouts (mindmap)
   - Force-directed graphs (career paths)
   - Sankey diagrams

2. **Quill.js** - Rich text editor
   - Document editing
   - Resume creation

3. **Marked.js** - Markdown parsing
   - AI chat messages
   - Article rendering

4. **DOMPurify** - HTML sanitization
   - Security for user-generated content

5. **KaTeX** - Math rendering
   - LaTeX math expressions

6. **MSAL Browser** - Microsoft authentication
   - Azure AD authentication
   - Cloud sync authentication

7. **Phosphor Icons** - Icon library
   - UI icons throughout

8. **Reveal.js** - Presentations
   - Create presentation slides

9. **html-docx-js** - DOCX export
   - Convert HTML to Word documents

---

### CSS Dependencies

1. **Google Fonts**
   - Questrial (headings)
   - Barlow Light (body text)

2. **Quill Snow Theme** - Editor styling

3. **Reveal.js White Theme** - Presentation styling

---

## 10. Data Flow Architecture

### User Data Flow

```
User Interaction
    ↓
UI Component (Button/Form)
    ↓
JavaScript Function (add/update/delete)
    ↓
LocalStorage Update
    ↓
Refresh UI Components
    ↓
Update D3 Visualizations
    ↓
(Optional) Sync to Cloud
```

### AI Chat Flow

```
User Types Message
    ↓
sendMessage()
    ↓
Build Context (buildAIContext)
    ↓
Get API Key (getApiKey)
    ↓
Call Provider API (callOpenAI/callAnthropic/callGemini)
    ↓
Stream Response (if supported)
    ↓
Render Markdown (renderMarkdown)
    ↓
Display in Chat
    ↓
Save to Chat History
```

---

## 11. Key Features Summary

### ✅ Core Features (Must Have)

1. **Canvas Mindmap** - Interactive D3 tree visualization
2. **AI Chat Assistant** - Multi-provider LLM integration
3. **Profile Management** - User profile with goals, skills, experience
4. **Portfolio Showcase** - Projects with technologies and links
5. **Job Application Tracking** - Status tracking for applications
6. **Document Management** - Multiple document types and editors
7. **Data Export/Import** - Backup and restore functionality

### 🔧 Advanced Features

8. **Career Path Explorer** - Network visualization of career paths
9. **Role Translator** - Cross-industry role mapping
10. **Content Library** - Curated articles from corpus
11. **Cloud Sync** - Azure blob storage integration
12. **LaTeX Support** - Academic document creation
13. **Diagram Editor** - Draw.io integration
14. **Context Control** - Granular AI data access control
15. **API Key Management** - Encrypted multi-provider keys

---

## 12. Refactoring Priorities

### Phase 1: Extract Foundation (Week 1-2)
- CSS to separate files ✅ (DONE)
- Core utilities (date, format, validation)
- Data access layer (localStorage wrapper)
- Event system for component communication

### Phase 2: Extract UI Components (Week 3-4)
- Modal system
- Slideout panel system
- Toast notifications
- Profile dropdown
- Navigation system

### Phase 3: Extract Data Management (Week 5-6)
- CRUD functions for each entity
- Backup/restore system
- Encryption/decryption
- Data migration utilities

### Phase 4: Extract Visualizations (Week 7-8)
- D3 mindmap module
- D3 career paths network
- Chart components

### Phase 5: Extract Editors (Week 9-10)
- Quill editor integration
- Draw.io integration
- LaTeX parser and renderer
- Document export functions

### Phase 6: Extract LLM Integration (Week 11-12)
- Provider abstractions (OpenAI, Anthropic, Gemini)
- API key management
- Context builder
- Prompt management
- Chat UI and streaming

### Phase 7: Extract Tab Content (Week 13-14)
- Canvas tab functionality
- Paths tab functionality
- Industry tab functionality
- Library tab functionality

### Phase 8: Testing & Polish (Week 15-16)
- Comprehensive testing
- Performance optimization
- Documentation
- Deployment

---

## 13. Module Dependencies Map

```
Core Foundation
    ├── Utils
    ├── Storage
    ├── Events
    └── Config

UI System
    ├── Modals
    ├── Slideouts
    ├── Notifications
    └── Navigation

Data Layer
    ├── Profile
    ├── Goals
    ├── Portfolio
    ├── Experience
    ├── Jobs
    ├── Documents
    └── Diagrams

Visualizations
    ├── D3 Mindmap
    ├── D3 Network
    └── Charts

Editors
    ├── Quill
    ├── Draw.io
    └── LaTeX

LLM System
    ├── OpenAI Provider
    ├── Anthropic Provider
    ├── Gemini Provider
    ├── Chat UI
    ├── Context Builder
    └── API Keys

Content Tabs
    ├── Canvas
    ├── Paths
    ├── Industry
    └── Library
```

---

## 14. Next Steps

1. ✅ Complete this structural analysis
2. ⏳ Create extraction priority list based on dependencies
3. ⏳ Extract one complete feature module to validate approach
4. ⏳ Test extracted module against original functionality
5. ⏳ Iterate and refine extraction process
6. ⏳ Continue with remaining modules

---

## 15. Open Questions

1. **Authentication**: How is MSAL authentication initialized and used?
2. **Cloud Sync**: What is the exact flow for Azure blob sync?
3. **Example Profiles**: Where are the 4 example personas loaded from?
4. **Subscription Tiers**: What are the tier differences (Seeker, Explorer, etc.)?
5. **Rating System**: Is there a content rating feature (mentioned in code)?
6. **Suggestion Engine**: How do contextual suggestions work?

---

**Last Updated**: November 24, 2025
**Analysis Status**: In Progress - Navigation and layout complete
**Next**: Document left panel functionality in detail