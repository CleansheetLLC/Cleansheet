# Calendar View and Integration Feature

**Labels:** `enhancement`, `feature`, `needs-design`, `needs-backend`, `high-priority`

**Milestone:** Q1 2026 - Professional Canvas Enhancement

**Assignee:** TBD

**Estimated Effort:** 8-10 weeks (Backend + Frontend + Testing)

---

## Problem Statement

Cleansheet Professional users need a unified calendar view to manage their work commitments, meetings, and career development activities across multiple calendar platforms. Currently, users must switch between Cleansheet and external calendar applications, creating friction and reducing engagement with the platform's career management features.

**User Impact:**
- Fragmented workflow between Cleansheet and external calendars
- No visibility into schedule conflicts when planning professional development activities
- Manual effort to coordinate meetings, projects, and learning goals
- Missed opportunities to link calendar events with career development milestones

**Business Value:**
- Increased user engagement through unified workspace experience
- Competitive differentiation via multi-platform calendar integration
- Foundation for AI-powered scheduling recommendations
- Enhanced data insights for success manager coaching workflows

---

## Proposed Solution

Implement a comprehensive calendar system within the Cleansheet platform that provides:
1. Native calendar view component (monthly, weekly, daily views)
2. Two-way sync with Microsoft Calendar (Outlook) and Google Calendar
3. Event CRUD operations within Cleansheet interface
4. Intelligent conflict detection and resolution
5. Integration with existing Professional Canvas persona features

**High-Level Approach:**
- OAuth 2.0 authentication for secure calendar access
- Azure-backed calendar service with rate limiting and caching
- Progressive enhancement: view-only → full CRUD → AI recommendations
- Privacy-first design aligned with cleansheet.info/privacy-policy.html

---

## User Stories

### Epic: Calendar View Component

#### Story 1: Basic Calendar View
**As a** Professional Canvas user
**I want to** view my schedule in monthly, weekly, and daily formats
**So that** I can quickly understand my time commitments at different granularities

**Acceptance Criteria:**
- [ ] Calendar widget displays in Professional Canvas right panel (matches production layout specs)
- [ ] Three view modes: Month (default), Week, Day
- [ ] View switcher buttons with active state styling (Corporate Professional design system)
- [ ] Events display with title, time, and color-coded source indicator (Google/Microsoft/Cleansheet)
- [ ] Month view shows 6-week grid with abbreviated day names
- [ ] Week view shows 7-day grid with hourly slots (8am-6pm default, expandable)
- [ ] Day view shows single day with 30-minute time slots
- [ ] Navigation controls: Previous/Next period, Today button
- [ ] Current date highlighting with visual distinction
- [ ] Responsive design: collapses to mobile-friendly view at 768px breakpoint
- [ ] Loading states during data fetch with skeleton UI
- [ ] Empty state messaging when no events exist

**Technical Considerations:**
- Use vanilla JavaScript (no external calendar libraries)
- Leverage existing CSS variables from Corporate Professional design system
- Implement date manipulation utilities in `shared/cleansheet-core.js`
- Store view preference in localStorage for session persistence
- Optimize rendering for 100+ events without performance degradation

---

#### Story 2: Calendar Event Details
**As a** Professional Canvas user
**I want to** click on calendar events to view full details
**So that** I can see meeting descriptions, attendees, and locations without leaving Cleansheet

**Acceptance Criteria:**
- [ ] Clicking event opens slideout panel (60% width, matches existing slideout pattern)
- [ ] Event details display: Title, Date/Time, Description, Location, Attendees, Source (Google/Microsoft)
- [ ] Meeting link displayed as clickable button (opens in new tab)
- [ ] Attendee avatars with initials (matches existing avatar pattern in canvas-tour.html)
- [ ] Response status indicator (Accepted, Tentative, Declined, No Response)
- [ ] Edit/Delete buttons visible only for events user owns or can modify
- [ ] "Open in [Google/Microsoft]" external link button
- [ ] Close button in slideout header (white X icon)
- [ ] Slideout scrollable when content exceeds viewport height
- [ ] Keyboard navigation: Esc to close, Tab through interactive elements

**Technical Considerations:**
- Reuse existing slideout component architecture from canvas-tour.html
- Parse and sanitize HTML in event descriptions (XSS protection)
- Handle timezone conversion for multi-timezone teams
- Cache event details to minimize API calls

---

### Epic: Calendar Authentication

#### Story 3: Microsoft Calendar OAuth Connection
**As a** Professional Canvas user
**I want to** connect my Microsoft/Outlook calendar to Cleansheet
**So that** I can view and manage my work meetings within the platform

**Acceptance Criteria:**
- [ ] "Connect Microsoft Calendar" button in Calendar Settings
- [ ] OAuth 2.0 authorization flow with Microsoft Identity Platform
- [ ] Consent screen explains requested permissions (Calendars.Read, Calendars.ReadWrite)
- [ ] Token stored securely in Azure Key Vault (backend), reference ID in localStorage
- [ ] Token refresh handled automatically before expiration
- [ ] Success toast notification after connection: "Microsoft Calendar connected successfully"
- [ ] Account indicator shows connected email address and profile photo
- [ ] "Disconnect" button with confirmation modal
- [ ] Error handling for declined consent, network failures, expired tokens
- [ ] Retry logic with exponential backoff for transient failures

**Technical Considerations:**
- Microsoft Graph API endpoints: `/me/calendars`, `/me/events`
- Use MSAL.js library for OAuth flow (verify MIT license compliance)
- Backend endpoint: `POST /api/v1/calendar/connect/microsoft` to exchange auth code for tokens
- Store refresh tokens server-side only (never expose to client)
- Implement token rotation strategy per Microsoft best practices
- Log authentication events to Azure Application Insights (anonymized user IDs)

**Security Requirements:**
- Validate redirect URI matches registered app configuration
- Implement CSRF protection with state parameter in OAuth flow
- Use PKCE (Proof Key for Code Exchange) for additional security
- Enforce HTTPS for all OAuth redirects
- Rate limit authentication attempts (5 attempts per 15 minutes per IP)

---

#### Story 4: Google Calendar OAuth Connection
**As a** Professional Canvas user
**I want to** connect my Google Calendar to Cleansheet
**So that** I can consolidate personal and work schedules in one view

**Acceptance Criteria:**
- [ ] "Connect Google Calendar" button in Calendar Settings
- [ ] OAuth 2.0 authorization flow with Google Identity Platform
- [ ] Consent screen explains requested permissions (calendar.readonly, calendar.events)
- [ ] Token stored securely in Azure Key Vault (backend), reference ID in localStorage
- [ ] Token refresh handled automatically before expiration
- [ ] Success toast notification after connection: "Google Calendar connected successfully"
- [ ] Account indicator shows connected email address and profile photo
- [ ] "Disconnect" button with confirmation modal
- [ ] Support for multiple Google accounts (work and personal)
- [ ] Error handling for declined consent, network failures, quota exceeded

**Technical Considerations:**
- Google Calendar API v3: `/calendars`, `/events`
- Use Google Sign-In JavaScript library (verify Apache 2.0 license)
- Backend endpoint: `POST /api/v1/calendar/connect/google` to exchange auth code for tokens
- Handle incremental authorization if user initially granted read-only access
- Respect Google API quotas (10,000 requests/day default, implement caching)
- Log authentication events to Azure Application Insights (anonymized user IDs)

**Security Requirements:**
- Validate redirect URI matches registered OAuth client ID
- Implement CSRF protection with state parameter
- Use HTTPS for all OAuth redirects
- Store client secrets in Azure Key Vault (never in code)
- Rate limit authentication attempts (5 attempts per 15 minutes per IP)

---

### Epic: Calendar Synchronization

#### Story 5: Two-Way Calendar Sync
**As a** Professional Canvas user
**I want to** my calendar events to sync bidirectionally with Google/Microsoft
**So that** changes made in Cleansheet or external calendars stay consistent

**Acceptance Criteria:**
- [ ] Initial sync pulls all events from last 30 days and next 180 days
- [ ] Incremental sync runs every 5 minutes when user active on canvas
- [ ] Background sync pauses when browser tab inactive (reduce API calls)
- [ ] Sync status indicator shows: Syncing, Up to date, Error (with timestamp)
- [ ] Manual "Sync Now" button with debounce (prevent rapid clicks)
- [ ] Events created in Cleansheet appear in external calendar within 1 minute
- [ ] Events modified in external calendar reflect in Cleansheet within 5 minutes
- [ ] Event deletions propagate bidirectionally with tombstone tracking
- [ ] Recurring events handled correctly (series vs. single instance modifications)
- [ ] Timezone conversions accurate across all sync operations
- [ ] Conflict resolution: external calendar is source of truth (Cleansheet updates to match)

**Technical Considerations:**
- Use delta queries (Microsoft Graph) and sync tokens (Google Calendar) for efficiency
- Store last sync timestamp per calendar source in database
- Implement webhook subscriptions for real-time updates (Microsoft push notifications, Google push notifications)
- Backend service: Azure Functions with Timer Trigger for scheduled sync
- Database schema: `calendar_events` table with source, external_id, last_modified fields
- Handle API rate limits with exponential backoff (Microsoft: 10k req/10min, Google: 10k req/day)
- Cache frequently accessed events in Redis (Azure Cache for Redis)
- Queue system for event updates (Azure Service Bus for reliable delivery)

**Performance Requirements:**
- Initial sync completes within 30 seconds for 500 events
- Incremental sync processes 50 updates within 5 seconds
- UI remains responsive during background sync operations
- Database queries optimized with indexes on user_id, event_date, external_id

---

#### Story 6: Calendar Selection and Filtering
**As a** Professional Canvas user
**I want to** choose which calendars to display from my connected accounts
**So that** I can focus on relevant meetings and hide personal/irrelevant calendars

**Acceptance Criteria:**
- [ ] Calendar Settings panel lists all available calendars from connected accounts
- [ ] Each calendar has toggle switch: Show/Hide
- [ ] Calendar name, color indicator, and source icon (Google/Microsoft) displayed
- [ ] Toggle state persists across sessions (stored in user preferences)
- [ ] Changes apply immediately to calendar view without page refresh
- [ ] Default behavior: all calendars shown on initial connection
- [ ] "Select All" and "Deselect All" quick actions
- [ ] Calendar color customization (optional, nice-to-have)
- [ ] Filter by event type: Meetings, All-Day Events, Out of Office, Reminders
- [ ] Search/filter calendars by name when user has 10+ calendars

**Technical Considerations:**
- Store preferences in `user_calendar_preferences` table (user_id, calendar_id, visible, color)
- Fetch calendar list during OAuth connection: Microsoft `/me/calendars`, Google `/users/me/calendarList`
- Update DataService in `shared/data-service.js` with calendar preference methods
- Filter events client-side for immediate UI response, server-side for data queries

---

### Epic: Event Management

#### Story 7: Create Calendar Event
**As a** Professional Canvas user
**I want to** create new calendar events directly in Cleansheet
**So that** I can schedule meetings without switching to external applications

**Acceptance Criteria:**
- [ ] "New Event" button prominently displayed in calendar widget header
- [ ] Modal form opens with fields: Title (required), Date (required), Start Time (required), End Time (required), Description, Location, Attendees, Calendar Selection
- [ ] Date picker with keyboard navigation (arrow keys, Enter to select)
- [ ] Time picker with 15-minute increments (default: next available hour)
- [ ] Calendar dropdown lists all connected calendars where user has write permission
- [ ] Attendees field with autocomplete from user's contacts (optional enhancement)
- [ ] "All-Day Event" checkbox collapses time pickers
- [ ] Form validation: End time must be after start time, title < 255 characters
- [ ] Submit button disabled during API request with loading spinner
- [ ] Success toast: "Event created successfully" with link to view event
- [ ] Error handling: Conflicts, permission denied, network failures
- [ ] Cancel button closes modal with unsaved changes confirmation

**Technical Considerations:**
- POST to Microsoft Graph: `/me/calendars/{id}/events`
- POST to Google Calendar API: `/calendars/{calendarId}/events`
- Backend endpoint: `POST /api/v1/calendar/events` routes to appropriate provider
- Validate timezone consistency with user's profile settings
- Handle recurring event creation (optional in MVP, required for full feature)
- Check calendar write permissions before showing "New Event" button

**Privacy Considerations:**
- Event data stored transiently in Azure database (30-day retention for sync purposes)
- No event content used for analytics or AI training (privacy-policy.html compliance)
- Attendee email addresses never shared with third parties

---

#### Story 8: Edit and Delete Calendar Events
**As a** Professional Canvas user
**I want to** modify or remove calendar events I created
**So that** I can correct mistakes and cancel meetings without leaving Cleansheet

**Acceptance Criteria:**
- [ ] Edit button visible in event details slideout for owned events
- [ ] Edit modal pre-populates all existing event data
- [ ] All fields editable except: Source calendar (immutable after creation)
- [ ] "Save Changes" button with loading state during API request
- [ ] Success toast: "Event updated successfully"
- [ ] Changes sync to external calendar within 30 seconds
- [ ] Delete button shows confirmation modal: "Delete event? This cannot be undone."
- [ ] Recurring event edit offers: "This event only" or "All events in series"
- [ ] Error handling: Event no longer exists, permission denied, network failures
- [ ] Optimistic UI updates (change appears immediately, rolls back on failure)

**Technical Considerations:**
- PATCH to Microsoft Graph: `/me/events/{id}`
- PUT to Google Calendar API: `/calendars/{calendarId}/events/{eventId}`
- Backend endpoint: `PATCH /api/v1/calendar/events/{id}` routes to appropriate provider
- Implement optimistic locking to prevent conflicting simultaneous edits
- Handle recurring event modifications per provider-specific logic
- Delete uses soft-delete pattern: mark as deleted, cleanup after sync confirmation

**Security Requirements:**
- Verify user owns event or has delegated permissions before allowing edits
- Log all modification events to audit trail (Azure Application Insights)
- Rate limit edit operations (10 edits per minute per user)

---

### Epic: Conflict Detection

#### Story 9: Scheduling Conflict Warnings
**As a** Professional Canvas user
**I want to** see warnings when creating events that conflict with existing meetings
**So that** I can avoid double-booking myself

**Acceptance Criteria:**
- [ ] When creating/editing event, check for time conflicts across all visible calendars
- [ ] Warning banner displays above form: "Conflict with [Event Title] at [Time]"
- [ ] Click warning to view conflicting event details in modal
- [ ] Allow proceeding with conflicting event (soft warning, not blocking)
- [ ] Conflict detection accounts for travel time buffers (optional, configurable)
- [ ] Highlight conflicting time slots in red on calendar view
- [ ] Suggest alternative times based on free/busy analysis (optional enhancement)

**Technical Considerations:**
- Client-side conflict detection for immediate feedback
- Server-side validation before final event creation
- Query free/busy information: Microsoft `/me/calendar/getSchedule`, Google `/freeBusy`
- Cache free/busy data for 5 minutes to reduce API calls
- Handle timezone edge cases (overlapping events in different timezones)

---

### Epic: Offline and Error Handling

#### Story 10: Offline Mode Support
**As a** Professional Canvas user
**I want to** view my calendar when offline
**So that** I can reference my schedule without internet connectivity

**Acceptance Criteria:**
- [ ] Last synced calendar data persists in IndexedDB (90-day retention)
- [ ] Offline indicator displays in calendar header: "Viewing cached data (last synced: [timestamp])"
- [ ] View-only mode when offline (no create/edit/delete operations)
- [ ] "Retry Sync" button attempts reconnection when network available
- [ ] Offline changes queue for sync when connection restored (optional enhancement)
- [ ] Service worker caches calendar UI assets for offline rendering

**Technical Considerations:**
- Use IndexedDB for structured calendar data storage (not localStorage due to size limits)
- Implement service worker with Cache API for HTML/CSS/JS assets
- Network detection: `navigator.onLine` and `online`/`offline` event listeners
- Display staleness indicator if cached data > 24 hours old

---

#### Story 11: Comprehensive Error Handling
**As a** Professional Canvas user
**I want to** see clear error messages when calendar operations fail
**So that** I understand what went wrong and how to resolve issues

**Acceptance Criteria:**
- [ ] Network failures show: "Connection lost. Retrying in [X] seconds..."
- [ ] Authentication errors redirect to re-authentication flow with explanation
- [ ] Permission errors show: "Calendar permission denied. Please reconnect [Provider]."
- [ ] API quota exceeded shows: "Calendar sync paused due to rate limits. Will resume at [Time]."
- [ ] Server errors show: "Something went wrong. Our team has been notified. [Error ID]"
- [ ] Retry button on transient errors (network, timeouts)
- [ ] Error details logged to Azure Application Insights with anonymized user context
- [ ] User-friendly language (no technical jargon or stack traces)

**Technical Considerations:**
- Error codes mapped to user-friendly messages in `shared/cleansheet-core.js`
- Exponential backoff for retries: 1s, 2s, 4s, 8s, 16s (max 5 retries)
- Circuit breaker pattern: stop retrying after 5 consecutive failures, require manual retry
- Correlate frontend errors with backend logs via correlation IDs
- Monitor error rates in Azure Application Insights dashboards

---

## Technical Implementation

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Cleansheet Frontend                      │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Calendar View  │  │ Event Modal  │  │ Settings Panel  │ │
│  │  Component     │  │  Component   │  │                 │ │
│  └────────┬───────┘  └──────┬───────┘  └────────┬────────┘ │
│           │                  │                    │          │
│           └──────────────────┴────────────────────┘          │
│                              │                               │
│                   ┌──────────▼──────────┐                    │
│                   │  Calendar Service   │                    │
│                   │ (shared/calendar-   │                    │
│                   │      service.js)    │                    │
│                   └──────────┬──────────┘                    │
└─────────────────────────────┼────────────────────────────────┘
                              │
                     HTTPS (REST API)
                              │
┌─────────────────────────────▼────────────────────────────────┐
│                   Azure Backend Services                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │          Calendar API Gateway (Azure Functions)        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ /connect     │  │ /events      │  │ /sync       │  │  │
│  │  │ /disconnect  │  │ /calendars   │  │ /webhooks   │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │  │
│  └─────────┼──────────────────┼──────────────────┼─────────┘  │
│            │                  │                  │            │
│  ┌─────────▼──────────────────▼──────────────────▼─────────┐  │
│  │         Calendar Sync Service (Azure Functions)         │  │
│  │  • Token Management        • Rate Limiting              │  │
│  │  • Webhook Subscriptions   • Error Handling             │  │
│  └─────────┬─────────────────────────────────────┬─────────┘  │
│            │                                     │            │
│  ┌─────────▼─────────┐               ┌──────────▼─────────┐  │
│  │  Azure SQL DB     │               │  Azure Cache for   │  │
│  │  • Events         │               │  Redis (Event      │  │
│  │  • Preferences    │               │  cache, free/busy) │  │
│  │  • Sync State     │               └────────────────────┘  │
│  └───────────────────┘                                       │
│            │                                                 │
│  ┌─────────▼─────────┐               ┌────────────────────┐ │
│  │  Azure Key Vault  │               │  Azure Service Bus │ │
│  │  (OAuth tokens,   │               │  (Event queue for  │ │
│  │   API secrets)    │               │   async sync)      │ │
│  └───────────────────┘               └────────────────────┘ │
└────────────────┬──────────────────────────────────┬──────────┘
                 │                                  │
        ┌────────▼────────┐              ┌─────────▼─────────┐
        │ Microsoft Graph │              │ Google Calendar   │
        │      API        │              │       API v3      │
        └─────────────────┘              └───────────────────┘
```

### Frontend Components

**File Structure:**
```
shared/
├── calendar-service.js      # Calendar API client, sync logic
├── calendar-view.js         # Calendar rendering (month/week/day)
├── calendar-events.js       # Event CRUD operations
├── calendar-oauth.js        # OAuth flow handlers
└── cleansheet-core.js       # Extended with date utilities
```

**Key Functions:**

```javascript
// shared/calendar-service.js
class CalendarService {
    constructor(dataService) {
        this.dataService = dataService;
        this.syncInterval = null;
    }

    async connectMicrosoft() { /* OAuth flow */ }
    async connectGoogle() { /* OAuth flow */ }
    async syncCalendars() { /* Two-way sync */ }
    async getEvents(startDate, endDate, calendars) { /* Fetch events */ }
    async createEvent(eventData) { /* Create event */ }
    async updateEvent(eventId, eventData) { /* Update event */ }
    async deleteEvent(eventId) { /* Delete event */ }
    async detectConflicts(eventData) { /* Conflict detection */ }
    startAutoSync(intervalMs) { /* Background sync */ }
    stopAutoSync() { /* Stop sync */ }
}

// shared/calendar-view.js
class CalendarView {
    constructor(containerId, calendarService) {
        this.container = document.getElementById(containerId);
        this.calendarService = calendarService;
        this.currentView = 'month'; // 'month' | 'week' | 'day'
        this.currentDate = new Date();
    }

    render() { /* Render calendar UI */ }
    renderMonthView() { /* Month grid */ }
    renderWeekView() { /* Week grid */ }
    renderDayView() { /* Day grid */ }
    handleEventClick(event) { /* Open event details */ }
    navigateNext() { /* Next period */ }
    navigatePrevious() { /* Previous period */ }
    navigateToday() { /* Jump to today */ }
}

// shared/calendar-events.js
function openEventModal(eventId) { /* Event details slideout */ }
function openEventForm(eventData) { /* Create/edit form modal */ }
function validateEventForm(formData) { /* Client-side validation */ }
function showConflictWarning(conflicts) { /* Conflict UI */ }
```

### Backend API Endpoints

**Base URL:** `/api/v1/calendar`

#### Authentication Endpoints
- `POST /connect/microsoft` - Exchange auth code for Microsoft tokens
- `POST /connect/google` - Exchange auth code for Google tokens
- `POST /disconnect/{provider}` - Revoke tokens and remove connection
- `GET /connections` - List active calendar connections

#### Calendar Endpoints
- `GET /calendars` - List all calendars from connected accounts
- `PATCH /calendars/{id}/preferences` - Update calendar visibility/color

#### Event Endpoints
- `GET /events?start={date}&end={date}&calendars={ids}` - Get events in date range
- `GET /events/{id}` - Get single event details
- `POST /events` - Create new event
- `PATCH /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event
- `GET /events/conflicts?start={time}&end={time}` - Check conflicts

#### Sync Endpoints
- `POST /sync/now` - Trigger manual sync
- `GET /sync/status` - Get sync status and last sync time
- `POST /webhooks/microsoft` - Microsoft push notification endpoint
- `POST /webhooks/google` - Google push notification endpoint

### Database Schema

**Table: `calendar_connections`**
```sql
CREATE TABLE calendar_connections (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL,
    provider VARCHAR(20) NOT NULL, -- 'microsoft' | 'google'
    account_email VARCHAR(255) NOT NULL,
    token_key_vault_id VARCHAR(255) NOT NULL, -- Reference to Azure Key Vault secret
    refresh_token_key_vault_id VARCHAR(255),
    expires_at DATETIME2,
    scopes TEXT,
    created_at DATETIME2 DEFAULT GETDATE(),
    last_sync_at DATETIME2,
    sync_status VARCHAR(20), -- 'active' | 'error' | 'paused'
    UNIQUE(user_id, provider, account_email)
);
```

**Table: `calendar_sources`**
```sql
CREATE TABLE calendar_sources (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    connection_id UNIQUEIDENTIFIER NOT NULL,
    external_calendar_id VARCHAR(255) NOT NULL,
    calendar_name VARCHAR(255),
    calendar_color VARCHAR(7), -- Hex color
    is_primary BIT DEFAULT 0,
    is_visible BIT DEFAULT 1,
    has_write_permission BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (connection_id) REFERENCES calendar_connections(id) ON DELETE CASCADE,
    UNIQUE(connection_id, external_calendar_id)
);
```

**Table: `calendar_events`**
```sql
CREATE TABLE calendar_events (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    calendar_source_id UNIQUEIDENTIFIER NOT NULL,
    external_event_id VARCHAR(255) NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    location VARCHAR(500),
    start_time DATETIME2 NOT NULL,
    end_time DATETIME2 NOT NULL,
    is_all_day BIT DEFAULT 0,
    timezone VARCHAR(100),
    organizer_email VARCHAR(255),
    attendees TEXT, -- JSON array
    recurrence_rule TEXT, -- iCal RRULE format
    is_recurring BIT DEFAULT 0,
    response_status VARCHAR(20), -- 'accepted' | 'tentative' | 'declined' | 'none'
    last_modified_external DATETIME2,
    last_synced_at DATETIME2,
    is_deleted BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (calendar_source_id) REFERENCES calendar_sources(id) ON DELETE CASCADE,
    UNIQUE(calendar_source_id, external_event_id),
    INDEX idx_user_date (user_id, start_time, end_time),
    INDEX idx_calendar_date (calendar_source_id, start_time)
);
```

**Table: `sync_state`**
```sql
CREATE TABLE sync_state (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    connection_id UNIQUEIDENTIFIER NOT NULL,
    last_sync_token VARCHAR(1000), -- Provider-specific delta token
    last_full_sync_at DATETIME2,
    last_incremental_sync_at DATETIME2,
    sync_error_count INT DEFAULT 0,
    last_error_message TEXT,
    last_error_at DATETIME2,
    FOREIGN KEY (connection_id) REFERENCES calendar_connections(id) ON DELETE CASCADE
);
```

### API Integration Specifications

#### Microsoft Graph API

**Authentication:**
- OAuth 2.0 with MSAL.js
- Scopes: `Calendars.Read`, `Calendars.ReadWrite`, `User.Read`
- Tenant: Common (multi-tenant support)

**Key Endpoints:**
- `GET /me/calendars` - List calendars
- `GET /me/calendarView?startDateTime={start}&endDateTime={end}` - Get events
- `POST /me/calendars/{id}/events` - Create event
- `PATCH /me/events/{id}` - Update event
- `DELETE /me/events/{id}` - Delete event
- `GET /me/calendar/getSchedule` - Free/busy information
- `POST /subscriptions` - Create webhook subscription

**Rate Limits:**
- 10,000 requests per 10 minutes per app
- Implement exponential backoff on 429 responses

**Delta Queries:**
- Use delta links for incremental sync
- Example: `GET /me/calendarView/delta?startDateTime={start}`

#### Google Calendar API v3

**Authentication:**
- OAuth 2.0 with Google Sign-In
- Scopes: `https://www.googleapis.com/auth/calendar.readonly`, `https://www.googleapis.com/auth/calendar.events`

**Key Endpoints:**
- `GET /users/me/calendarList` - List calendars
- `GET /calendars/{calendarId}/events?timeMin={start}&timeMax={end}` - Get events
- `POST /calendars/{calendarId}/events` - Create event
- `PUT /calendars/{calendarId}/events/{eventId}` - Update event
- `DELETE /calendars/{calendarId}/events/{eventId}` - Delete event
- `POST /freeBusy` - Free/busy information
- `POST /channels` - Create push notification channel

**Rate Limits:**
- 10,000 requests per day (default quota)
- 100 requests per 100 seconds per user
- Implement exponential backoff on 403 rate limit exceeded

**Sync Tokens:**
- Use `syncToken` parameter for incremental sync
- Example: `GET /calendars/{id}/events?syncToken={token}`

### Caching Strategy

**Redis Cache Structure:**
```
calendar:events:{userId}:{start}:{end} -> JSON array of events (TTL: 5 minutes)
calendar:freebusy:{userId}:{date} -> Free/busy data (TTL: 5 minutes)
calendar:calendars:{userId} -> List of calendars (TTL: 1 hour)
calendar:sync:{connectionId} -> Sync status (TTL: 1 hour)
```

**Cache Invalidation:**
- Event CRUD operations invalidate relevant `calendar:events:*` keys
- Calendar preference changes invalidate `calendar:calendars:*` keys
- Sync operations update all related cache entries

### Webhook Implementation

**Microsoft Graph Webhooks:**
1. Create subscription: `POST /subscriptions` with notification URL
2. Receive notifications at: `POST /api/v1/calendar/webhooks/microsoft`
3. Validate notification: Check `validationToken` header
4. Process change notifications: Fetch updated events via delta query
5. Renew subscriptions before expiration (max 4230 minutes)

**Google Calendar Push Notifications:**
1. Create channel: `POST /calendars/{id}/events/watch`
2. Receive notifications at: `POST /api/v1/calendar/webhooks/google`
3. Validate notification: Verify `X-Goog-Channel-Token` header
4. Process change notifications: Sync calendar using syncToken
5. Renew channels before expiration (max 7 days, recommend 3 days)

---

## Security Requirements

### Authentication & Authorization
- [ ] All API endpoints require valid JWT token in Authorization header
- [ ] JWT tokens expire after 1 hour, refresh tokens valid for 30 days
- [ ] OAuth tokens stored exclusively in Azure Key Vault, never in database or client
- [ ] Token references (Key Vault IDs) stored in database, not actual tokens
- [ ] Implement least-privilege access: users can only access own calendar data
- [ ] Validate calendar/event ownership before allowing modifications
- [ ] Rate limiting on all endpoints: 100 requests per minute per user

### Data Protection
- [ ] All data transmission over HTTPS (TLS 1.3)
- [ ] Event data encrypted at rest in Azure SQL (Transparent Data Encryption enabled)
- [ ] Redis cache uses TLS connection with authentication
- [ ] Implement data retention policy: delete events 90 days after deletion from external calendar
- [ ] No sensitive event data logged (titles, descriptions, attendees)
- [ ] Anonymize user identifiers in Application Insights logs

### Privacy Compliance
- [ ] Comply with privacy-policy.html: No data sharing with third parties
- [ ] No event content used for analytics or AI model training
- [ ] Event data stored only for synchronization purposes (transient storage)
- [ ] User can delete all calendar data: "Disconnect" removes all cached events
- [ ] GDPR compliance: Export user calendar data, delete on request
- [ ] Clear consent language in OAuth screens: explain data usage

### Security Testing
- [ ] Penetration testing of OAuth flows (CSRF, token leakage)
- [ ] Input validation testing: XSS, SQL injection on event fields
- [ ] API fuzzing: test error handling with malformed requests
- [ ] Load testing: verify rate limiting under high traffic
- [ ] Audit logging: track all authentication, authorization, data modification events

---

## Testing Requirements

### Unit Tests
- [ ] Calendar view rendering (month/week/day layouts)
- [ ] Date manipulation utilities (timezone conversions, recurring events)
- [ ] Event CRUD validation logic
- [ ] Conflict detection algorithm
- [ ] OAuth token refresh logic
- [ ] Cache invalidation logic
- [ ] Error handling and retry mechanisms

**Target Coverage:** 85% code coverage for all new modules

### Integration Tests
- [ ] OAuth flow end-to-end (Microsoft and Google)
- [ ] Calendar sync: create event in external calendar, verify sync to Cleansheet
- [ ] Calendar sync: modify event in Cleansheet, verify update in external calendar
- [ ] Webhook processing: simulate Microsoft/Google webhook, verify event update
- [ ] Conflict detection: create overlapping events, verify warning displayed
- [ ] Offline mode: disable network, verify cached data loads
- [ ] Token expiration: force token expiration, verify automatic refresh

### Performance Tests
- [ ] Initial sync with 500 events completes in < 30 seconds
- [ ] Incremental sync with 50 updates completes in < 5 seconds
- [ ] Calendar view renders 200 events in < 2 seconds
- [ ] API response time (P95) < 500ms for all endpoints
- [ ] Concurrent users: 1,000 simultaneous calendar syncs without degradation

### Security Tests
- [ ] OAuth CSRF protection: verify state parameter validation
- [ ] Token leakage: confirm tokens never appear in logs, responses, client-side storage
- [ ] Authorization bypass: attempt to access other users' events (should fail)
- [ ] XSS in event fields: inject scripts in title/description (should be sanitized)
- [ ] SQL injection: test malicious input in search/filter parameters

### User Acceptance Tests
- [ ] Connect Microsoft Calendar and view events in Cleansheet
- [ ] Connect Google Calendar and view events in Cleansheet
- [ ] Create new event in Cleansheet, confirm appears in external calendar
- [ ] Edit event in external calendar, confirm updates in Cleansheet
- [ ] Delete event in Cleansheet, confirm removed from external calendar
- [ ] Disconnect calendar, confirm events removed from Cleansheet
- [ ] Navigate month/week/day views, verify correct date ranges
- [ ] Filter calendars by visibility, verify events show/hide correctly
- [ ] Create overlapping event, confirm conflict warning appears
- [ ] Offline mode: disable network, verify cached calendar loads

---

## Success Metrics

### Engagement Metrics
- **Primary KPI:** 60% of active Professional Canvas users connect at least one calendar within 30 days of feature launch
- Calendar view opened by 80% of users with connected calendars (weekly active users)
- Average session time on Professional Canvas increases by 25%
- Events created in Cleansheet: 5+ per user per month (power users)

### Technical Metrics
- Sync success rate > 99.5% (excluding user-initiated disconnections)
- API error rate < 0.5% of all requests
- P95 API response time < 500ms
- Calendar view load time < 2 seconds (with 200 events)
- Webhook processing latency < 30 seconds (external change to Cleansheet update)

### User Satisfaction
- Feature satisfaction rating > 4.2/5.0 (in-app survey)
- Support tickets related to calendar sync < 2% of active users per month
- Calendar feature mentioned positively in 20% of user feedback (NPS surveys)

### Business Metrics
- Retention: Users with connected calendars have 35% higher 90-day retention vs. non-connected users
- Expansion: Calendar feature drives 15% increase in Premium tier upgrades (if applicable)
- Competitive positioning: Calendar integration cited as differentiation factor in 30% of enterprise sales calls

---

## Dependencies

### Internal Dependencies
- **Cleansheet Canvas Infrastructure** (canvas-tour.html, canvas-tour-pro.html) - Widget container, slideout panels
- **Design System** (DESIGN_GUIDE.md) - Corporate Professional styling, color palette, typography
- **Data Service** (shared/data-service.js) - Extended for calendar-specific CRUD operations
- **API Schema** (shared/api-schema.js) - New endpoints for calendar operations
- **Authentication System** - JWT token validation, user session management

### External Dependencies
- **Microsoft Graph API** - Calendars.Read, Calendars.ReadWrite permissions
- **Google Calendar API v3** - calendar.readonly, calendar.events scopes
- **MSAL.js (Microsoft)** - OAuth library for Microsoft authentication (MIT License)
- **Google Sign-In JavaScript Library** - OAuth library for Google authentication (Apache 2.0 License)
- **Azure Key Vault** - Token storage and secret management
- **Azure SQL Database** - Calendar and event data storage
- **Azure Cache for Redis** - Event caching and performance optimization
- **Azure Service Bus** - Event synchronization queue
- **Azure Functions** - Serverless sync and webhook processing

### Blocked By
- [ ] Backend infrastructure setup: Azure Functions, Key Vault, SQL Database
- [ ] OAuth app registration with Microsoft and Google (client IDs, secrets)
- [ ] Azure Service Bus provisioning for event queue
- [ ] Redis cache configuration and connection string

### Blocking
- [ ] AI-powered scheduling recommendations (depends on calendar data)
- [ ] Success Manager coaching insights (depends on calendar integration)
- [ ] Job Seeker interview scheduling (reuses calendar infrastructure)

---

## Risks and Mitigations

### Technical Risks

**Risk:** API rate limits from Microsoft/Google cause sync delays or failures
- **Impact:** High - Users see stale calendar data, miss important events
- **Likelihood:** Medium - Heavy users with many calendars may hit limits
- **Mitigation:**
  - Implement aggressive caching (5-minute TTL for events, 1-hour for calendar list)
  - Use delta queries and sync tokens for incremental updates
  - Throttle sync frequency: 5-minute intervals, pause when tab inactive
  - Provide manual "Sync Now" button for user-initiated sync
  - Monitor API quota usage in Azure Application Insights dashboards

**Risk:** OAuth token expiration/revocation causes authentication failures
- **Impact:** High - Users lose calendar access until re-authentication
- **Likelihood:** Medium - Tokens expire after inactivity or user revocation
- **Mitigation:**
  - Implement automatic token refresh 5 minutes before expiration
  - Graceful error handling: redirect to re-authentication with explanation
  - Retry logic with exponential backoff for transient failures
  - Store refresh tokens securely in Key Vault for long-term access
  - Monitor authentication error rates, alert on spikes

**Risk:** Timezone conversion errors lead to incorrect event times
- **Impact:** High - Users miss meetings or see wrong schedules
- **Likelihood:** Low - Timezone handling is complex, edge cases exist
- **Mitigation:**
  - Use ISO 8601 format for all datetime storage and transmission
  - Store timezone explicitly with each event (not just UTC offset)
  - Test with users in multiple timezones (including DST transitions)
  - Display timezone indicators in UI when viewing events
  - User preference: display in event timezone vs. user's local timezone

### Product Risks

**Risk:** Feature complexity overwhelms users, low adoption
- **Impact:** Medium - Development investment doesn't yield engagement
- **Likelihood:** Low - Calendar integration is standard in productivity tools
- **Mitigation:**
  - Progressive disclosure: show basic view first, advanced features on-demand
  - Onboarding tour using Driver.js (existing pattern in canvas-tour.html)
  - Default to month view (most familiar), hide advanced filters initially
  - Success Manager outreach: educate users on calendar benefits
  - Track feature discovery metrics, optimize based on user behavior

**Risk:** Privacy concerns discourage users from connecting calendars
- **Impact:** Medium - Lower adoption than projected
- **Likelihood:** Low - Privacy policy explicitly allows first-party integrations
- **Mitigation:**
  - Clear consent language in OAuth screens: "We sync your calendar to Cleansheet. We never share your data with third parties."
  - Link to privacy-policy.html in connection flow
  - Emphasize data retention policy: "Events stored only for sync, deleted after 90 days"
  - Provide "Disconnect" option with full data deletion confirmation
  - Transparency: show sync status, last sync time, allow manual sync

### Security Risks

**Risk:** OAuth token leakage exposes user calendar data
- **Impact:** Critical - Unauthorized access to sensitive meeting information
- **Likelihood:** Low - Tokens stored in Key Vault, not exposed to client
- **Mitigation:**
  - Never store tokens in localStorage, database, or logs
  - Use token reference IDs (Key Vault secret IDs) in database
  - Implement token rotation: refresh tokens regularly, revoke old ones
  - Security audits: penetration testing of OAuth flow
  - Monitor for unusual access patterns (geolocation, device anomalies)

**Risk:** Webhook endpoint vulnerabilities allow spoofed notifications
- **Impact:** High - Malicious actors could inject fake events
- **Likelihood:** Low - Webhooks use signed headers for verification
- **Mitigation:**
  - Validate webhook signatures: Microsoft (validationToken), Google (X-Goog-Channel-Token)
  - Implement IP allowlisting for webhook endpoints (Microsoft/Google IP ranges)
  - Rate limit webhook endpoint: 1,000 requests per minute per source
  - Log all webhook activity, alert on suspicious patterns
  - Use HTTPS with strong TLS configuration (TLS 1.3+)

### Operational Risks

**Risk:** Webhook subscriptions expire, causing sync gaps
- **Impact:** Medium - Users don't see real-time updates until next polling sync
- **Likelihood:** Medium - Subscriptions expire if not renewed (Microsoft: 4230 min, Google: 7 days)
- **Mitigation:**
  - Automated renewal: Azure Function timer trigger checks expiration daily
  - Renew subscriptions 24 hours before expiration
  - Fallback to polling sync if webhook delivery fails for 30 minutes
  - Monitor webhook health metrics: delivery success rate, latency
  - Alert on-call engineer if renewal failures exceed threshold

**Risk:** Database storage costs escalate with event data
- **Impact:** Low - Operational costs increase but remain manageable
- **Likelihood:** Medium - Heavy users with many calendars generate large datasets
- **Mitigation:**
  - Data retention policy: delete events 90 days after external deletion
  - Compress event descriptions and attendee lists (GZIP)
  - Partition SQL table by user_id for efficient archival
  - Monitor storage growth, set budget alerts in Azure Cost Management
  - Consider Azure Table Storage for cold event data (older than 30 days)

---

## Assumptions

1. **User Calendar Access:** Users have permission to connect work calendars (corporate policy allows OAuth integration)
2. **API Availability:** Microsoft Graph and Google Calendar APIs remain available with current rate limits
3. **Browser Support:** Users access Cleansheet on modern browsers supporting ES6+ JavaScript (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
4. **Network Connectivity:** Users have stable internet for real-time sync (offline mode provides fallback)
5. **Azure Infrastructure:** Azure Key Vault, SQL Database, Redis, Functions, Service Bus available in East US region
6. **OAuth App Approval:** Microsoft and Google approve Cleansheet OAuth apps for production use (no verification delays)
7. **Timezone Data:** IANA timezone database remains accurate and up-to-date
8. **User Behavior:** Users check calendar view at least weekly (justifies sync infrastructure investment)
9. **Data Retention:** 90-day event retention sufficient for user needs (no requests for longer history)
10. **Privacy Compliance:** Calendar integration aligns with GDPR, CCPA, and Cleansheet privacy commitments

---

## Open Questions

### Product Questions
1. **Calendar Selection Defaults:** Should all calendars be visible by default, or only primary calendars?
   - **Recommendation:** Show all calendars initially, user can hide irrelevant ones
2. **Recurring Event Editing:** For recurring events, should we always prompt "This event only" vs. "All events"?
   - **Recommendation:** Match provider behavior (Microsoft/Google default to series edit)
3. **Travel Time Buffers:** Should conflict detection account for travel time (e.g., 15-minute buffer between meetings)?
   - **Recommendation:** Optional feature for v2, not MVP (adds complexity)
4. **Multi-Account Support:** Can users connect multiple Google accounts (work and personal)?
   - **Recommendation:** Yes, support multiple accounts per provider
5. **Event Reminders:** Should Cleansheet show/edit event reminders, or defer to external calendar?
   - **Recommendation:** Display only, don't allow editing (avoid sync complexity)

### Technical Questions
1. **Webhook vs. Polling Priority:** If webhook fails, should we immediately fall back to polling or wait?
   - **Recommendation:** Wait 30 minutes, then fall back to polling (avoid duplicate sync)
2. **Cache Invalidation Strategy:** On event modification, invalidate entire date range or just specific event?
   - **Recommendation:** Invalidate entire date range (simpler, events often span multiple days)
3. **Sync Scope:** Should initial sync include past events (e.g., last 30 days) or only future?
   - **Recommendation:** Include past 30 days for context, configurable in settings
4. **Token Storage Isolation:** Store tokens per connection or per user with provider mapping?
   - **Recommendation:** Per connection (supports multiple accounts per provider)
5. **Error Retry Budget:** How many consecutive failures before pausing sync and requiring user action?
   - **Recommendation:** 5 consecutive failures, then pause with notification

### Design Questions
1. **Calendar Color Coding:** Use provider colors (Google/Microsoft default) or Cleansheet-defined colors?
   - **Recommendation:** Use provider defaults, allow user customization
2. **Event Density Indicator:** On month view, show event count per day or list of event titles?
   - **Recommendation:** Show count badge, click to expand list (like Google Calendar)
3. **Conflict Warning Severity:** Use red error styling or yellow warning styling?
   - **Recommendation:** Yellow warning (soft warning, allow proceeding)
4. **Slideout vs. Modal:** Open event details in slideout (60% width) or center modal (fixed width)?
   - **Recommendation:** Slideout (consistent with existing canvas patterns)
5. **Mobile Responsiveness:** On mobile, collapse to single-day view only or support week/month?
   - **Recommendation:** Support all views, optimize layout for touch (larger tap targets)

---

## Timeline and Phases

### Phase 1: Foundation (Weeks 1-3)
**Goal:** OAuth authentication and basic calendar view

**Deliverables:**
- [ ] Backend: Azure Functions setup, Key Vault integration, SQL schema
- [ ] Backend: OAuth endpoints for Microsoft and Google
- [ ] Frontend: Calendar view component (month view only)
- [ ] Frontend: OAuth connection UI with success/error states
- [ ] Testing: Unit tests for OAuth flow, calendar rendering

**Success Criteria:**
- Users can connect Microsoft/Google calendars
- Month view displays synced events (read-only)

### Phase 2: Event Management (Weeks 4-6)
**Goal:** CRUD operations on calendar events

**Deliverables:**
- [ ] Backend: Event CRUD endpoints, conflict detection API
- [ ] Frontend: Event details slideout, create/edit modals
- [ ] Frontend: Week and day views
- [ ] Testing: Integration tests for event operations

**Success Criteria:**
- Users can create, edit, delete events in Cleansheet
- Changes sync to external calendars within 30 seconds
- Conflict warnings display on overlapping events

### Phase 3: Synchronization (Weeks 7-8)
**Goal:** Real-time sync with webhooks and polling

**Deliverables:**
- [ ] Backend: Webhook endpoints for Microsoft/Google push notifications
- [ ] Backend: Incremental sync with delta queries/sync tokens
- [ ] Backend: Sync service with automatic renewal of webhooks
- [ ] Frontend: Sync status indicator, manual sync button
- [ ] Testing: Performance tests for sync with 500+ events

**Success Criteria:**
- Events sync bidirectionally within 1 minute
- Webhook subscriptions renew automatically
- Sync success rate > 99%

### Phase 4: Polish and Optimization (Weeks 9-10)
**Goal:** Offline mode, error handling, performance tuning

**Deliverables:**
- [ ] Frontend: IndexedDB caching for offline mode
- [ ] Frontend: Comprehensive error handling with user-friendly messages
- [ ] Backend: Redis caching layer, query optimization
- [ ] Testing: Security testing, UAT with pilot users
- [ ] Documentation: User guide, admin documentation

**Success Criteria:**
- Calendar loads in < 2 seconds with 200 events
- Offline mode works without network
- P95 API response time < 500ms

### Phase 5: Launch and Iteration (Weeks 11+)
**Goal:** Production rollout and post-launch improvements

**Deliverables:**
- [ ] Rollout: Beta release to 10% of users
- [ ] Monitoring: Azure Application Insights dashboards, alert rules
- [ ] Rollout: Gradual rollout to 50%, then 100% of users
- [ ] Iteration: Address user feedback, bug fixes
- [ ] Enhancement: Advanced features based on usage data (recurring events, calendar sharing, AI recommendations)

**Success Criteria:**
- 60% of users connect calendar within 30 days
- Support tickets < 2% of active users
- Feature satisfaction rating > 4.2/5.0

---

## Related Issues

- **Issue #XX:** Professional Canvas v2 Infrastructure
- **Issue #XX:** AI-Powered Scheduling Assistant
- **Issue #XX:** Success Manager Coaching Insights
- **Issue #XX:** Job Seeker Interview Scheduler

---

## References

- [Microsoft Graph Calendar API Documentation](https://learn.microsoft.com/en-us/graph/api/resources/calendar)
- [Google Calendar API v3 Documentation](https://developers.google.com/calendar/api/v3/reference)
- [OAuth 2.0 Best Practices (RFC 8252)](https://datatracker.ietf.org/doc/html/rfc8252)
- [iCalendar Format (RFC 5545)](https://datatracker.ietf.org/doc/html/rfc5545)
- [Azure Key Vault Best Practices](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)
- [Cleansheet Privacy Policy](https://www.cleansheet.info/privacy-policy.html)
- [Cleansheet Design Guide](doc/DESIGN_GUIDE.md)

---

**Issue Created:** 2025-11-18
**Last Updated:** 2025-11-18
**Status:** Draft - Ready for Review
