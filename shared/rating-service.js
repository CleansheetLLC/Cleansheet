/**
 * Cleansheet Rating Service
 *
 * Handles anonymous content rating functionality for AI responses, articles, and modals.
 * Data stored in Azure Blob Storage (profileblobs) for feedback collection.
 *
 * Privacy-compliant:
 * - IP addresses are hashed (SHA-256), never stored raw
 * - No location data collected
 * - localStorage prevents duplicate votes
 */

class RatingService {
    constructor() {
        this.containerUrl = 'https://storageb681.blob.core.windows.net/profileblobs?se=2026-11-05T01%3A04Z&sp=w&spr=https&sv=2022-11-02&sr=c&sig=vBTWVGRSUjGwTB4LdLLjVc6mpnZdt/RYx0RRun8%2BW3U%3D';
        this.localStoragePrefix = 'rating_voted_';
    }

    /**
     * Hash an IP address using SHA-256 (client-side)
     * @param {string} ip - IP address to hash
     * @returns {Promise<string>} SHA-256 hash
     */
    async hashIP(ip) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(ip);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error('[RatingService] Failed to hash IP:', error);
            return 'anonymous';
        }
    }

    /**
     * Get user's IP address (best effort via public API)
     * @returns {Promise<string>} IP address or 'unknown'
     */
    async getUserIP() {
        try {
            // Try ipify API first (free, no rate limits for non-commercial)
            const response = await fetch('https://api.ipify.org?format=json', {
                timeout: 3000
            });
            const data = await response.json();
            return data.ip || 'unknown';
        } catch (error) {
            console.warn('[RatingService] Could not fetch IP:', error);
            return 'unknown';
        }
    }

    /**
     * Check if user has already voted on this object
     * @param {string} objectType - Type: 'response', 'article', or 'modal'
     * @param {string} objectId - Unique identifier for the object
     * @returns {boolean} True if already voted
     */
    hasVoted(objectType, objectId) {
        const key = `${this.localStoragePrefix}${objectType}_${objectId}`;
        return localStorage.getItem(key) !== null;
    }

    /**
     * Mark object as voted in localStorage
     * @param {string} objectType - Type: 'response', 'article', or 'modal'
     * @param {string} objectId - Unique identifier for the object
     * @param {string} rating - Rating value: 'up' or 'down'
     */
    markAsVoted(objectType, objectId, rating) {
        const key = `${this.localStoragePrefix}${objectType}_${objectId}`;
        const data = {
            rating: rating,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Get existing vote for an object (if any)
     * @param {string} objectType - Type: 'response', 'article', or 'modal'
     * @param {string} objectId - Unique identifier for the object
     * @returns {object|null} Vote data or null
     */
    getExistingVote(objectType, objectId) {
        const key = `${this.localStoragePrefix}${objectType}_${objectId}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    }

    /**
     * Generate unique response ID based on timestamp and content hash
     * @param {string} content - Response content
     * @returns {string} Unique response ID
     */
    generateResponseId(content) {
        const timestamp = Date.now();
        const contentHash = this.simpleHash(content);
        return `resp_${timestamp}_${contentHash}`;
    }

    /**
     * Simple hash function for content (non-cryptographic)
     * @param {string} str - String to hash
     * @returns {string} Hash string
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36).substring(0, 8);
    }

    /**
     * Submit a rating to Azure Blob Storage
     * @param {object} params - Rating parameters
     * @param {string} params.objectType - Type: 'response', 'article', or 'modal'
     * @param {string} params.objectId - Unique identifier for the object
     * @param {string} params.rating - Rating: 'up' or 'down'
     * @param {object} params.metadata - Additional metadata (aiModel, etc.)
     * @returns {Promise<boolean>} Success status
     */
    async submitRating({ objectType, objectId, rating, metadata = {} }) {
        try {
            // Check if already voted
            if (this.hasVoted(objectType, objectId)) {
                console.log('[RatingService] Already voted on this object');
                return false;
            }

            // Get and hash IP
            const ip = await this.getUserIP();
            const ipHash = await this.hashIP(ip);

            // Build rating data
            const ratingData = {
                objectType,
                objectId,
                rating,
                timestamp: new Date().toISOString(),
                ipHash,
                userAgent: navigator.userAgent,
                ...metadata
            };

            // Generate blob path: /ratings/[objectType]/[objectId]/[timestamp].json
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const blobPath = `ratings/${objectType}/${objectId}/${timestamp}.json`;

            // Construct blob URL with SAS token
            const baseUrl = this.containerUrl.split('?')[0];
            const sasToken = this.containerUrl.split('?')[1];
            const blobUrl = `${baseUrl}/${blobPath}?${sasToken}`;

            // Upload to blob storage
            const response = await fetch(blobUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-ms-blob-type': 'BlockBlob'
                },
                body: JSON.stringify(ratingData, null, 2)
            });

            if (!response.ok) {
                throw new Error(`Blob upload failed: ${response.status} ${response.statusText}`);
            }

            // Mark as voted in localStorage
            this.markAsVoted(objectType, objectId, rating);

            console.log('[RatingService] Rating submitted successfully:', blobPath);
            return true;

        } catch (error) {
            console.error('[RatingService] Failed to submit rating:', error);

            // Even if blob upload fails, mark as voted to prevent spam
            this.markAsVoted(objectType, objectId, rating);

            throw error;
        }
    }

    /**
     * Create rating button HTML
     * @param {string} objectType - Type: 'response', 'article', or 'modal'
     * @param {string} objectId - Unique identifier for the object
     * @param {object} metadata - Additional metadata
     * @returns {string} HTML string for rating buttons
     */
    createRatingButtons(objectType, objectId, metadata = {}) {
        const existingVote = this.getExistingVote(objectType, objectId);
        const upSelected = existingVote && existingVote.rating === 'up' ? 'selected' : '';
        const downSelected = existingVote && existingVote.rating === 'down' ? 'selected' : '';
        const disabled = existingVote ? 'disabled' : '';

        return `
            <button class="rating-btn rating-down ${downSelected}"
                    data-object-type="${objectType}"
                    data-object-id="${objectId}"
                    data-rating="down"
                    ${disabled}
                    title="Not helpful">
                <i class="ph ${downSelected ? 'ph-fill' : ''} ph-thumbs-down"></i>
            </button>
            <button class="rating-btn rating-up ${upSelected}"
                    data-object-type="${objectType}"
                    data-object-id="${objectId}"
                    data-rating="up"
                    ${disabled}
                    title="Helpful">
                <i class="ph ${upSelected ? 'ph-fill' : ''} ph-thumbs-up"></i>
            </button>
        `;
    }

    /**
     * Initialize rating buttons (attach event listeners)
     * Should be called after buttons are added to DOM
     * @param {HTMLElement} container - Container element with rating buttons
     * @param {object} metadata - Additional metadata for ratings
     */
    initializeRatingButtons(container, metadata = {}) {
        const buttons = container.querySelectorAll('.rating-btn');

        buttons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.stopPropagation();

                if (button.disabled) return;

                const objectType = button.dataset.objectType;
                const objectId = button.dataset.objectId;
                const rating = button.dataset.rating;

                try {
                    // Disable both buttons immediately
                    const siblingButtons = container.querySelectorAll('.rating-btn');
                    siblingButtons.forEach(btn => btn.disabled = true);

                    // Submit rating
                    await this.submitRating({
                        objectType,
                        objectId,
                        rating,
                        metadata
                    });

                    // Update UI - highlight selected button
                    button.classList.add('selected');
                    button.querySelector('i').classList.add('ph-fill');

                    // Show success toast
                    if (typeof showToast === 'function') {
                        showToast('Thanks for your feedback!', 'success');
                    }

                } catch (error) {
                    console.error('[RatingService] Rating submission failed:', error);

                    // Still show success (already marked in localStorage)
                    button.classList.add('selected');
                    button.querySelector('i').classList.add('ph-fill');

                    if (typeof showToast === 'function') {
                        showToast('Thanks for your feedback!', 'success');
                    }
                }
            });
        });
    }

    /**
     * Submit NPS score
     * @param {number} score - NPS score (0-10)
     * @param {object} metadata - Session context
     * @returns {Promise<boolean>} Success status
     */
    async submitNPS(score, metadata = {}) {
        const sessionId = this.getOrCreateSessionId();
        const objectId = `nps_${sessionId}`;

        return await this.submitRating({
            objectType: 'nps',
            objectId: objectId,
            rating: score.toString(),
            metadata: {
                score: score,
                npsCategory: this.categorizeNPS(score),
                ...metadata
            }
        });
    }

    /**
     * Categorize NPS score
     * @param {number} score - NPS score (0-10)
     * @returns {string} Category: 'detractor', 'passive', or 'promoter'
     */
    categorizeNPS(score) {
        if (score <= 6) return 'detractor';
        if (score <= 8) return 'passive';
        return 'promoter';
    }

    /**
     * Get or create session ID for NPS tracking
     * @returns {string} Unique session ID
     */
    getOrCreateSessionId() {
        const key = 'cleansheet_nps_session_id';
        let sessionId = localStorage.getItem(key);

        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            localStorage.setItem(key, sessionId);
        }

        return sessionId;
    }

    /**
     * Check if NPS survey should be shown
     * @returns {boolean} True if survey should appear
     */
    shouldShowNPS() {
        // Never show if user dismissed permanently
        if (localStorage.getItem('nps_never_show') === 'true') {
            return false;
        }

        // Never show if already submitted
        const sessionId = this.getOrCreateSessionId();
        if (this.hasVoted('nps', `nps_${sessionId}`)) {
            return false;
        }

        // Check session count threshold
        const sessionCount = parseInt(localStorage.getItem('canvas_session_count') || '0');
        return sessionCount >= 3;
    }
}

// Create global instance
const ratingService = new RatingService();

// Debug logging
console.log('[RatingService] Initialized successfully');
