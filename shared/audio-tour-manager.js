/**
 * AudioTourManager - Web Audio API integration for Driver.js tour narrations
 *
 * Extracted from career-canvas.html
 *
 * Features:
 * - Web Audio API context management
 * - Audio file preloading and buffering
 * - Playback controls with volume adjustment
 * - Browser autoplay policy handling
 *
 * Used by: career-canvas.html (Guided Tours)
 */

// ============================================
// AudioTourManager Class
// ============================================

class AudioTourManager {
    constructor() {
        this.audioContext = null;
        this.audioBuffers = new Map();
        this.currentSource = null;
        this.isPlaying = false;
        this.volume = 0.8;
        this.gainNode = null;

        // Audio file mappings
        this.audioMappings = {
            'welcome': 'assets/audio/tour-narrations/canvas-overview/welcome-canvas-intro-30s.mp3',
            'view-modes': 'assets/audio/tour-narrations/canvas-overview/view-mode-selector-25s.mp3',
            'mindmap-navigation': 'assets/audio/tour-narrations/ui-controls/mindmap-navigation-40s.mp3',
            'calendar-widget': 'assets/audio/tour-narrations/ui-controls/calendar-widget-30s.mp3',
            'ai-assistant': 'assets/audio/tour-narrations/ui-controls/ai-assistant-35s.mp3',
            'job-search-view': 'assets/audio/tour-narrations/job-search/job-search-view-50s.mp3',
            'projects-view': 'assets/audio/tour-narrations/professional-tools/projects-view-45s.mp3',
            'panel-controls': 'assets/audio/tour-narrations/ui-controls/panel-controls-20s.mp3'
        };

        this.initAudioContext();
    }

    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.volume;

            // Handle browser autoplay policies
            if (this.audioContext.state === 'suspended') {
                console.log('AudioContext suspended - will resume on user interaction');
            }
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    async loadAudio(stepId, audioUrl) {
        if (!this.audioContext || this.audioBuffers.has(stepId)) {
            return;
        }

        try {
            const response = await fetch(audioUrl);
            if (!response.ok) {
                throw new Error(`Failed to load audio: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.audioBuffers.set(stepId, audioBuffer);

            console.log(`Loaded audio for step: ${stepId}`);
        } catch (error) {
            console.warn(`Failed to load audio for step ${stepId}:`, error);
        }
    }

    async preloadAllAudio() {
        const loadPromises = Object.entries(this.audioMappings).map(([stepId, audioUrl]) =>
            this.loadAudio(stepId, audioUrl)
        );

        await Promise.allSettled(loadPromises);
        console.log(`Preloaded ${this.audioBuffers.size} audio files`);
    }

    async playNarration(stepId) {
        if (!this.audioContext) {
            console.warn('AudioContext not available');
            return false;
        }

        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        // Stop current audio if playing
        this.stopAudio();

        const buffer = this.audioBuffers.get(stepId);
        if (!buffer) {
            console.warn(`No audio buffer found for step: ${stepId}`);
            return false;
        }

        try {
            this.currentSource = this.audioContext.createBufferSource();
            this.currentSource.buffer = buffer;
            this.currentSource.connect(this.gainNode);

            this.currentSource.onended = () => {
                this.isPlaying = false;
                this.currentSource = null;
            };

            this.currentSource.start();
            this.isPlaying = true;

            console.log(`Playing narration for step: ${stepId}`);
            return true;
        } catch (error) {
            console.warn(`Failed to play audio for step ${stepId}:`, error);
            return false;
        }
    }

    stopAudio() {
        if (this.currentSource && this.isPlaying) {
            try {
                this.currentSource.stop();
            } catch (error) {
                // Ignore errors when stopping already stopped sources
            }
            this.currentSource = null;
            this.isPlaying = false;
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }
    }

    getVolume() {
        return this.volume;
    }

    isAudioPlaying() {
        return this.isPlaying;
    }
}

// ============================================
// Global Instance
// ============================================

// Initialize audio manager (global singleton)
const audioTourManager = new AudioTourManager();
