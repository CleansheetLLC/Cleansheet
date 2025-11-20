/**
 * Context Analyzer
 * Extracts Canvas data from localStorage for suggestion generation
 * Respects user privacy settings from llm_context_preferences
 */

class ContextAnalyzer {
    constructor() {
        this.currentPersona = localStorage.getItem('cleansheet_currentPersona') || 'default';
    }

    /**
     * Get user's context control preferences
     * @returns {Object} Context preferences
     */
    getContextPreferences() {
        const prefs = JSON.parse(localStorage.getItem('llm_context_preferences') || '{}');
        return {
            jobOpportunities: prefs.jobOpportunities !== false,
            experiences: prefs.experiences !== false,
            goals: prefs.goals !== false,
            portfolio: prefs.portfolio !== false,
            stories: prefs.stories !== false,
            documents: prefs.documents !== false,
            documentDetail: prefs.documentDetail || 'metadata'
        };
    }

    /**
     * Get job opportunities/applications
     * @returns {Array} Job opportunities
     */
    getJobOpportunities() {
        const prefs = this.getContextPreferences();
        if (!prefs.jobOpportunities) return [];

        try {
            const jobsKey = `jobOpportunities_${this.currentPersona}`;
            const jobs = JSON.parse(localStorage.getItem(jobsKey) || '[]');
            return jobs;
        } catch (e) {
            console.error('[Context Analyzer] Error loading jobs:', e);
            return [];
        }
    }

    /**
     * Get work experiences
     * @returns {Array} Work experiences
     */
    getExperiences() {
        const prefs = this.getContextPreferences();
        if (!prefs.experiences) return [];

        try {
            const experiences = JSON.parse(localStorage.getItem('cleansheet_experiences') || '[]');
            return experiences;
        } catch (e) {
            console.error('[Context Analyzer] Error loading experiences:', e);
            return [];
        }
    }

    /**
     * Get STAR stories
     * @returns {Array} Stories
     */
    getStories() {
        const prefs = this.getContextPreferences();
        if (!prefs.stories) return [];

        try {
            const storiesData = localStorage.getItem('cleansheet_stories') ||
                               localStorage.getItem('userStories') ||
                               localStorage.getItem('behavioralStories') ||
                               localStorage.getItem('user_stories');

            return storiesData ? JSON.parse(storiesData) : [];
        } catch (e) {
            console.error('[Context Analyzer] Error loading stories:', e);
            return [];
        }
    }

    /**
     * Get career goals
     * @returns {Array} Goals
     */
    getGoals() {
        const prefs = this.getContextPreferences();
        if (!prefs.goals) return [];

        try {
            const goals = JSON.parse(localStorage.getItem(`userGoals_${this.currentPersona}`) || '[]');
            return goals;
        } catch (e) {
            console.error('[Context Analyzer] Error loading goals:', e);
            return [];
        }
    }

    /**
     * Get portfolio items
     * @returns {Array} Portfolio items
     */
    getPortfolio() {
        const prefs = this.getContextPreferences();
        if (!prefs.portfolio) return [];

        try {
            const portfolio = JSON.parse(localStorage.getItem(`userPortfolio_${this.currentPersona}`) || '[]');
            return portfolio;
        } catch (e) {
            console.error('[Context Analyzer] Error loading portfolio:', e);
            return [];
        }
    }

    /**
     * Get projects
     * @returns {Array} Projects
     */
    getProjects() {
        const prefs = this.getContextPreferences();
        if (!prefs.portfolio) return []; // Projects are part of portfolio context

        try {
            const projects = JSON.parse(localStorage.getItem(`projects_${this.currentPersona}`) || '[]');
            return projects;
        } catch (e) {
            console.error('[Context Analyzer] Error loading projects:', e);
            return [];
        }
    }

    /**
     * Get documents (metadata only for suggestion analysis)
     * @returns {Object} Document counts by type
     */
    getDocumentCounts() {
        const prefs = this.getContextPreferences();
        if (!prefs.documents) return {};

        try {
            const counts = {
                lexical: JSON.parse(localStorage.getItem(`interview_documents_${this.currentPersona}`) || '[]').length,
                diagrams: JSON.parse(localStorage.getItem(`diagrams_${this.currentPersona}`) || '[]').length,
                code: JSON.parse(localStorage.getItem(`code_${this.currentPersona}`) || '[]').length,
                markdown: JSON.parse(localStorage.getItem(`markdown_${this.currentPersona}`) || '[]').length,
                presentations: JSON.parse(localStorage.getItem(`presentations_${this.currentPersona}`) || '[]').length
            };
            return counts;
        } catch (e) {
            console.error('[Context Analyzer] Error loading document counts:', e);
            return {};
        }
    }

    /**
     * Analyze Canvas state for suggestion triggers
     * @returns {Object} Canvas analysis
     */
    analyzeCanvas() {
        const jobs = this.getJobOpportunities();
        const experiences = this.getExperiences();
        const stories = this.getStories();
        const goals = this.getGoals();
        const portfolio = this.getPortfolio();
        const projects = this.getProjects();
        const documents = this.getDocumentCounts();

        // Calculate totals
        const totalItems = jobs.length + experiences.length + stories.length +
                          goals.length + portfolio.length + projects.length;

        // Check for empty Canvas (onboarding scenario)
        const isEmpty = totalItems === 0;

        // Check for incomplete data
        const hasJobsButNoStories = jobs.length > 0 && stories.length === 0;
        const hasExperiencesButNoStories = experiences.length > 0 && stories.length === 0;

        // Interview preparation analysis
        const interviewingJobs = jobs.filter(job =>
            job.status === 'interviewing' || job.status === 'applied'
        );

        // Find upcoming interviews (from job todos)
        const upcomingInterviews = [];
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

        interviewingJobs.forEach(job => {
            if (job.todos && Array.isArray(job.todos)) {
                job.todos.forEach(todo => {
                    if (!todo.completed && todo.date) {
                        const todoDate = new Date(todo.date);
                        if (todoDate >= now && todoDate <= sevenDaysFromNow) {
                            // Check if todo is interview-related
                            const isInterviewTodo = /interview|call|screen|meeting/i.test(todo.task);
                            if (isInterviewTodo) {
                                upcomingInterviews.push({
                                    jobTitle: job.title,
                                    company: job.company,
                                    date: todoDate,
                                    task: todo.task,
                                    daysUntil: Math.ceil((todoDate - now) / (24 * 60 * 60 * 1000))
                                });
                            }
                        }
                    }
                });
            }
        });

        // Sort upcoming interviews by date
        upcomingInterviews.sort((a, b) => a.date - b.date);

        return {
            isEmpty,
            totalItems,
            counts: {
                jobs: jobs.length,
                experiences: experiences.length,
                stories: stories.length,
                goals: goals.length,
                portfolio: portfolio.length,
                projects: projects.length,
                documents: Object.values(documents).reduce((sum, count) => sum + count, 0)
            },
            flags: {
                hasJobsButNoStories,
                hasExperiencesButNoStories,
                hasInterviewingJobs: interviewingJobs.length > 0,
                hasUpcomingInterviews: upcomingInterviews.length > 0
            },
            interviewingJobs,
            upcomingInterviews
        };
    }

    /**
     * Check if Canvas data has changed since last analysis
     * @param {Object} previousAnalysis Previous analysis result
     * @returns {boolean} True if data has changed
     */
    hasDataChanged(previousAnalysis) {
        const currentAnalysis = this.analyzeCanvas();

        // Compare key metrics
        if (!previousAnalysis) return true;

        return JSON.stringify(currentAnalysis.counts) !== JSON.stringify(previousAnalysis.counts) ||
               JSON.stringify(currentAnalysis.flags) !== JSON.stringify(previousAnalysis.flags) ||
               currentAnalysis.upcomingInterviews.length !== previousAnalysis.upcomingInterviews.length;
    }
}

// Export for use in career-canvas.html
if (typeof window !== 'undefined') {
    window.ContextAnalyzer = ContextAnalyzer;
}
