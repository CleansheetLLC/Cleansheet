/**
 * Suggestion Engine
 * Generates contextual question suggestions based on Canvas analysis
 * Phase 1: Rules-based suggestions (Onboarding + Interview Prep)
 */

class SuggestionEngine {
    constructor(contextAnalyzer) {
        this.contextAnalyzer = contextAnalyzer;
        this.dismissedSuggestions = this.loadDismissedSuggestions();
        this.lastAnalysis = null;
    }

    /**
     * Load dismissed suggestions from localStorage
     * @returns {Object} Map of suggestion ID to dismissal timestamp
     */
    loadDismissedSuggestions() {
        try {
            const dismissed = JSON.parse(localStorage.getItem('cleansheet_dismissed_suggestions') || '{}');
            // Clean up old dismissals (older than 7 days)
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            Object.keys(dismissed).forEach(id => {
                if (dismissed[id] < sevenDaysAgo) {
                    delete dismissed[id];
                }
            });
            return dismissed;
        } catch (e) {
            console.error('[Suggestion Engine] Error loading dismissed suggestions:', e);
            return {};
        }
    }

    /**
     * Save dismissed suggestions to localStorage
     */
    saveDismissedSuggestions() {
        try {
            localStorage.setItem('cleansheet_dismissed_suggestions', JSON.stringify(this.dismissedSuggestions));
        } catch (e) {
            console.error('[Suggestion Engine] Error saving dismissed suggestions:', e);
        }
    }

    /**
     * Dismiss a suggestion for 7 days
     * @param {string} suggestionId Suggestion ID
     */
    dismissSuggestion(suggestionId) {
        this.dismissedSuggestions[suggestionId] = Date.now();
        this.saveDismissedSuggestions();
        console.log('[Suggestion Engine] Dismissed suggestion:', suggestionId);
    }

    /**
     * Check if a suggestion is dismissed
     * @param {string} suggestionId Suggestion ID
     * @returns {boolean} True if dismissed
     */
    isDismissed(suggestionId) {
        return !!this.dismissedSuggestions[suggestionId];
    }

    /**
     * Onboarding suggestion templates (for empty or minimal Canvas)
     */
    getOnboardingSuggestions(analysis) {
        const suggestions = [];

        if (analysis.isEmpty) {
            suggestions.push({
                id: 'onboarding-getting-started',
                category: 'onboarding',
                text: 'How do I get started with the Cleansheet Canvas?',
                priority: 10
            });

            suggestions.push({
                id: 'onboarding-what-to-add',
                category: 'onboarding',
                text: 'What information should I add to my Canvas first?',
                priority: 9
            });

            suggestions.push({
                id: 'onboarding-ai-assistant',
                category: 'onboarding',
                text: 'How can the AI assistant help with my career?',
                priority: 8
            });

            suggestions.push({
                id: 'onboarding-job-search',
                category: 'onboarding',
                text: 'How do I use the Canvas for job searching?',
                priority: 7
            });
        } else if (analysis.totalItems > 0 && analysis.totalItems < 5) {
            // Minimal data - encourage more content
            if (analysis.counts.experiences === 0) {
                suggestions.push({
                    id: 'onboarding-add-experience',
                    category: 'onboarding',
                    text: 'How should I document my work experience?',
                    priority: 8
                });
            }

            if (analysis.counts.stories === 0 && analysis.counts.experiences > 0) {
                suggestions.push({
                    id: 'onboarding-add-stories',
                    category: 'onboarding',
                    text: 'What are STAR stories and how do I create them?',
                    priority: 8
                });
            }

            if (analysis.counts.goals === 0) {
                suggestions.push({
                    id: 'onboarding-set-goals',
                    category: 'onboarding',
                    text: 'How do I set and track career goals?',
                    priority: 7
                });
            }
        }

        return suggestions;
    }

    /**
     * Interview preparation suggestion templates
     */
    getInterviewPrepSuggestions(analysis) {
        const suggestions = [];

        // Upcoming interviews in next 7 days
        if (analysis.upcomingInterviews.length > 0) {
            const nextInterview = analysis.upcomingInterviews[0];
            const daysText = nextInterview.daysUntil === 1 ? 'tomorrow' :
                            nextInterview.daysUntil === 0 ? 'today' :
                            `in ${nextInterview.daysUntil} days`;

            suggestions.push({
                id: `interview-prep-${nextInterview.jobTitle}-${nextInterview.company}`,
                category: 'interview-prep',
                text: `How should I prepare for my ${nextInterview.jobTitle} interview at ${nextInterview.company} ${daysText}?`,
                priority: 10 + (7 - nextInterview.daysUntil), // More urgent as date approaches
                metadata: {
                    jobTitle: nextInterview.jobTitle,
                    company: nextInterview.company,
                    daysUntil: nextInterview.daysUntil
                }
            });

            // Suggest creating STAR stories if none exist
            if (analysis.counts.stories === 0) {
                suggestions.push({
                    id: `interview-stories-${nextInterview.jobTitle}`,
                    category: 'interview-prep',
                    text: `What STAR stories should I prepare for a ${nextInterview.jobTitle} interview?`,
                    priority: 9 + (7 - nextInterview.daysUntil),
                    metadata: {
                        jobTitle: nextInterview.jobTitle
                    }
                });
            }

            // Suggest researching the company
            suggestions.push({
                id: `interview-company-research-${nextInterview.company}`,
                category: 'interview-prep',
                text: `What should I know about ${nextInterview.company} before my interview?`,
                priority: 8 + (7 - nextInterview.daysUntil),
                metadata: {
                    company: nextInterview.company
                }
            });

            // Suggest questions to ask
            suggestions.push({
                id: `interview-questions-${nextInterview.jobTitle}`,
                category: 'interview-prep',
                text: `What questions should I ask in a ${nextInterview.jobTitle} interview?`,
                priority: 7 + (7 - nextInterview.daysUntil),
                metadata: {
                    jobTitle: nextInterview.jobTitle
                }
            });
        } else if (analysis.flags.hasInterviewingJobs) {
            // Has interviewing jobs but no specific upcoming dates
            const interviewingJob = analysis.interviewingJobs[0];

            suggestions.push({
                id: `interview-general-${interviewingJob.title}`,
                category: 'interview-prep',
                text: `How should I prepare for ${interviewingJob.title} interviews?`,
                priority: 7,
                metadata: {
                    jobTitle: interviewingJob.title
                }
            });

            if (analysis.counts.stories === 0) {
                suggestions.push({
                    id: `interview-stories-general-${interviewingJob.title}`,
                    category: 'interview-prep',
                    text: `What STAR stories are most effective for ${interviewingJob.title} roles?`,
                    priority: 6,
                    metadata: {
                        jobTitle: interviewingJob.title
                    }
                });
            }
        }

        // Jobs but no stories
        if (analysis.flags.hasJobsButNoStories && analysis.counts.jobs > 0) {
            suggestions.push({
                id: 'interview-stories-needed',
                category: 'interview-prep',
                text: 'How do I create compelling STAR stories for interviews?',
                priority: 6
            });
        }

        // Experiences but no stories
        if (analysis.flags.hasExperiencesButNoStories && analysis.counts.experiences > 0) {
            suggestions.push({
                id: 'interview-stories-from-experience',
                category: 'interview-prep',
                text: 'How can I turn my work experiences into STAR stories?',
                priority: 6
            });
        }

        return suggestions;
    }

    /**
     * Profile completion suggestions
     */
    getProfileCompletionSuggestions(analysis) {
        const suggestions = [];

        // Encourage adding experiences if none exist
        if (analysis.counts.experiences === 0 && !analysis.isEmpty) {
            suggestions.push({
                id: 'profile-add-experience',
                category: 'profile-completion',
                text: 'How should I document my work experience on my Canvas?',
                priority: 8
            });
        }

        // Encourage stories if have experiences but no stories
        if (analysis.counts.experiences > 0 && analysis.counts.stories === 0) {
            suggestions.push({
                id: 'profile-add-stories',
                category: 'profile-completion',
                text: 'How do I create STAR stories from my work experiences?',
                priority: 7
            });
        }

        // Encourage portfolio if have experiences but no portfolio
        if (analysis.counts.experiences > 2 && analysis.counts.portfolio === 0) {
            suggestions.push({
                id: 'profile-add-portfolio',
                category: 'profile-completion',
                text: 'What projects should I add to my portfolio?',
                priority: 6
            });
        }

        return suggestions;
    }

    /**
     * Interview stories suggestions (general, not tied to specific interviews)
     */
    getInterviewStoriesSuggestions(analysis) {
        const suggestions = [];

        // If have experiences but few or no stories, encourage STAR story creation
        if (analysis.counts.experiences > 0 && analysis.counts.stories < 3) {
            suggestions.push({
                id: 'general-star-stories',
                category: 'interview-stories',
                text: 'What are the most effective STAR stories for technical interviews?',
                priority: 7
            });
        }

        // If have jobs but no stories, suggest behavioral prep
        if (analysis.counts.jobs > 0 && analysis.counts.stories === 0) {
            suggestions.push({
                id: 'behavioral-interview-prep',
                category: 'interview-stories',
                text: 'How do I prepare for behavioral interview questions?',
                priority: 8
            });
        }

        // General interview story guidance if have some stories but could use more
        if (analysis.counts.stories >= 1 && analysis.counts.stories < 5) {
            suggestions.push({
                id: 'expand-story-library',
                category: 'interview-stories',
                text: 'How many STAR stories should I have prepared for interviews?',
                priority: 5
            });
        }

        return suggestions;
    }

    /**
     * Goal setting suggestions
     */
    getGoalSettingSuggestions(analysis) {
        const suggestions = [];

        // No goals at all
        if (analysis.counts.goals === 0 && !analysis.isEmpty) {
            suggestions.push({
                id: 'goal-setting-start',
                category: 'goal-setting',
                text: 'How do I set effective career goals?',
                priority: 7
            });
        }

        // Very few goals (1-2)
        if (analysis.counts.goals > 0 && analysis.counts.goals <= 2) {
            suggestions.push({
                id: 'goal-setting-expand',
                category: 'goal-setting',
                text: 'What types of career goals should I be setting?',
                priority: 6
            });
        }

        // Have experiences but no goals - career progression focus
        if (analysis.counts.experiences > 2 && analysis.counts.goals === 0) {
            suggestions.push({
                id: 'goal-career-progression',
                category: 'goal-setting',
                text: 'What should my next career move be based on my experience?',
                priority: 8
            });
        }

        // Have jobs but no goals - suggest job search strategy
        if (analysis.counts.jobs > 0 && analysis.counts.goals === 0) {
            suggestions.push({
                id: 'goal-job-search-strategy',
                category: 'goal-setting',
                text: 'How do I create a strategic job search plan?',
                priority: 7
            });
        }

        return suggestions;
    }

    /**
     * Generate suggestions based on Canvas analysis
     * @returns {Array} Array of suggestion objects
     */
    generateSuggestions() {
        // Analyze Canvas
        const analysis = this.contextAnalyzer.analyzeCanvas();
        this.lastAnalysis = analysis;

        console.log('[Suggestion Engine] Canvas analysis:', analysis);

        let allSuggestions = [];

        // Get onboarding suggestions
        allSuggestions = allSuggestions.concat(this.getOnboardingSuggestions(analysis));

        // Get profile completion suggestions
        allSuggestions = allSuggestions.concat(this.getProfileCompletionSuggestions(analysis));

        // Get interview stories suggestions (general)
        allSuggestions = allSuggestions.concat(this.getInterviewStoriesSuggestions(analysis));

        // Get goal setting suggestions
        allSuggestions = allSuggestions.concat(this.getGoalSettingSuggestions(analysis));

        // Get interview prep suggestions (specific interviews)
        allSuggestions = allSuggestions.concat(this.getInterviewPrepSuggestions(analysis));

        // Filter out dismissed suggestions
        allSuggestions = allSuggestions.filter(s => !this.isDismissed(s.id));

        // Sort by priority (highest first)
        allSuggestions.sort((a, b) => b.priority - a.priority);

        // Limit to top 3-4 suggestions
        const topSuggestions = allSuggestions.slice(0, 4);

        console.log('[Suggestion Engine] Generated suggestions:', topSuggestions);

        return topSuggestions;
    }

    /**
     * Check if suggestions should be refreshed
     * @returns {boolean} True if refresh needed
     */
    shouldRefresh() {
        return this.contextAnalyzer.hasDataChanged(this.lastAnalysis);
    }

    /**
     * Clear all dismissed suggestions (for testing/debugging)
     */
    clearDismissed() {
        this.dismissedSuggestions = {};
        this.saveDismissedSuggestions();
        console.log('[Suggestion Engine] Cleared all dismissed suggestions');
    }
}

// Export for use in career-canvas.html
if (typeof window !== 'undefined') {
    window.SuggestionEngine = SuggestionEngine;
}
