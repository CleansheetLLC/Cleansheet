/**
 * Simple Onboarding Modal - Step 1
 * Shows three options on first load (buttons non-functional)
 */

class SimpleOnboardingModal {
    constructor() {
        this.modalElement = null;
    }

    /**
     * Check if modal should be shown
     * Only show if no cleansheet_onboarding_completed flag
     */
    shouldShow() {
        return !localStorage.getItem('cleansheet_onboarding_completed');
    }

    /**
     * Show the modal
     */
    show() {
        if (!this.shouldShow()) {
            console.log('[Simple Onboarding] Already completed, skipping');
            return;
        }

        console.log('[Simple Onboarding] Showing modal');

        // Create modal
        this.modalElement = this.createModal();
        document.body.appendChild(this.modalElement);

        // Show with animation
        setTimeout(() => {
            this.modalElement.classList.add('active');
        }, 10);

        // Add event listeners
        this.attachListeners();
    }

    /**
     * Create modal HTML
     */
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'simpleOnboardingModal';
        modal.className = 'simple-onboarding-modal';

        modal.innerHTML = `
            <div class="simple-onboarding-overlay"></div>
            <div class="simple-onboarding-content">
                <h1 style="font-family: var(--font-family-ui); font-size: 28px; margin: 0 0 8px 0; color: var(--color-dark); text-align: center;">
                    Welcome to Cleansheet Canvas
                </h1>
                <p style="font-family: var(--font-family-body); font-size: 14px; margin: 0 0 32px 0; color: var(--color-neutral-text); text-align: center;">
                    How would you like to get started?
                </p>

                <div class="simple-onboarding-buttons">
                    <button class="simple-onboarding-btn" data-action="blank">
                        <i class="ph ph-file-plus"></i>
                        <span>Start with Blank Canvas</span>
                    </button>

                    <button class="simple-onboarding-btn" data-action="import">
                        <i class="ph ph-upload-simple"></i>
                        <span>Import from Backup</span>
                    </button>

                    <button class="simple-onboarding-btn" data-action="examples">
                        <i class="ph ph-user-list"></i>
                        <span>Explore Examples</span>
                    </button>
                </div>

                <div id="exampleProfilesContainer" class="example-profiles-container" style="display: none;">
                    <div class="example-profiles-grid">
                        <button class="example-profile-card" data-profile="retail-manager">
                            <div class="example-profile-icon" style="background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);">
                                <i class="ph ph-arrows-clockwise" style="color: #9333ea; font-size: 24px;"></i>
                            </div>
                            <div class="example-profile-name">Marcus Thompson</div>
                            <div class="example-profile-role">Store Manager → Analytics</div>
                        </button>

                        <button class="example-profile-card" data-profile="research-scientist">
                            <div class="example-profile-icon" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);">
                                <i class="ph ph-flask" style="color: #2563eb; font-size: 24px;"></i>
                            </div>
                            <div class="example-profile-name">Dr. Sarah Chen</div>
                            <div class="example-profile-role">Research Scientist</div>
                        </button>

                        <button class="example-profile-card" data-profile="new-graduate">
                            <div class="example-profile-icon" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);">
                                <i class="ph ph-graduation-cap" style="color: #059669; font-size: 24px;"></i>
                            </div>
                            <div class="example-profile-name">Jamie Rodriguez</div>
                            <div class="example-profile-role">CS Graduate</div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.addStyles();

        return modal;
    }

    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('simpleOnboardingStyles')) return;

        const style = document.createElement('style');
        style.id = 'simpleOnboardingStyles';
        style.textContent = `
            .simple-onboarding-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .simple-onboarding-modal.active {
                opacity: 1;
            }

            .simple-onboarding-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
            }

            .simple-onboarding-content {
                position: relative;
                width: 90%;
                max-width: 480px;
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .simple-onboarding-buttons {
                display: flex;
                flex-direction: column;
                gap: 12px;
                width: 100%;
            }

            .simple-onboarding-btn {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
                background: white;
                border: 2px solid var(--color-neutral-border);
                border-radius: 12px;
                font-family: var(--font-family-ui);
                font-size: 15px;
                font-weight: 600;
                color: var(--color-dark);
                cursor: pointer;
                transition: all 0.2s;
                width: 100%;
            }

            .simple-onboarding-btn i {
                font-size: 24px;
                color: var(--color-primary-blue);
            }

            .simple-onboarding-btn:hover {
                border-color: var(--color-primary-blue);
                background: #f8f9fa;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
            }

            .simple-onboarding-btn:active {
                transform: translateY(0);
            }

            /* Example profiles container (inline) */
            .example-profiles-container {
                width: 100%;
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid var(--color-neutral-border);
            }

            .example-profiles-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                width: 100%;
            }

            .example-profile-card {
                background: white;
                border: 2px solid var(--color-neutral-border);
                border-radius: 12px;
                padding: 16px 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .example-profile-card:hover {
                border-color: var(--color-primary-blue);
                box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
                transform: translateY(-2px);
            }

            .example-profile-card:active {
                transform: translateY(0);
            }

            .example-profile-icon {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .example-profile-name {
                font-family: var(--font-family-ui);
                font-size: 13px;
                font-weight: 600;
                color: var(--color-dark);
                text-align: center;
            }

            .example-profile-role {
                font-family: var(--font-family-body);
                font-size: 11px;
                color: var(--color-neutral-text);
                text-align: center;
                line-height: 1.3;
            }

            @media (max-width: 768px) {
                .simple-onboarding-content {
                    padding: 24px;
                }

                .example-profiles-grid {
                    grid-template-columns: 1fr;
                    gap: 10px;
                }

                .example-profile-card {
                    padding: 20px 16px;
                    flex-direction: row;
                    justify-content: flex-start;
                    gap: 16px;
                }

                .example-profile-icon {
                    flex-shrink: 0;
                }

                .example-profile-name,
                .example-profile-role {
                    text-align: left;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Attach event listeners
     */
    attachListeners() {
        // Button clicks
        const buttons = this.modalElement.querySelectorAll('.simple-onboarding-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                console.log('[Simple Onboarding] Button clicked:', action);

                if (action === 'blank') {
                    this.handleBlankCanvas();
                } else if (action === 'import') {
                    this.handleImportBackup();
                } else if (action === 'examples') {
                    this.handleExploreExamples();
                } else {
                    // Other buttons not yet implemented
                    alert(`"${btn.textContent.trim()}" button clicked!\n\nThis button will be functional in the next step.`);
                }
            });
        });

        // Profile card clicks
        const profileCards = this.modalElement.querySelectorAll('.example-profile-card');
        profileCards.forEach(card => {
            card.addEventListener('click', () => {
                const profile = card.getAttribute('data-profile');
                console.log('[Simple Onboarding] Profile selected:', profile);
                this.loadExampleProfile(profile);
            });
        });
    }

    /**
     * Handle "Start with Blank Canvas" button
     */
    handleBlankCanvas() {
        console.log('[Simple Onboarding] Starting with blank canvas');

        // Mark onboarding as completed
        this.markCompleted();

        // Set left panel (AI Assistant) to collapsed for new users
        localStorage.setItem('leftPanelCollapsed', 'true');

        // Close the onboarding modal
        this.close();

        // Wait for modal to close, then open Canvas and start tour
        setTimeout(() => {
            // Open Canvas modal
            if (typeof openCanvasModal === 'function') {
                openCanvasModal();
            }

            // Wait a bit for Canvas to open, then start tour
            setTimeout(() => {
                if (typeof restartTour === 'function') {
                    restartTour();
                }
            }, 500);
        }, 400);
    }

    /**
     * Handle "Import from Backup" button
     */
    handleImportBackup() {
        console.log('[Simple Onboarding] Import from backup clicked');

        // Show attractive confirmation modal
        this.showImportConfirmationModal();
    }

    /**
     * Handle "Explore Examples" button
     */
    handleExploreExamples() {
        console.log('[Simple Onboarding] Explore examples clicked');

        const container = this.modalElement.querySelector('#exampleProfilesContainer');
        if (container) {
            // Toggle visibility
            if (container.style.display === 'none') {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        }
    }

    /**
     * Load an example profile
     */
    loadExampleProfile(profileType) {
        console.log('[Simple Onboarding] Loading example profile:', profileType);

        // Get sample data in import format
        const importData = this.createSampleData(profileType);

        // Mark onboarding as completed
        this.markCompleted();

        // Set flag to start tour at step 2 (step 1 in 0-indexed array)
        localStorage.setItem('cleansheet_tour_start_step', '1');

        // Set left panel (AI Assistant) to collapsed for examples
        localStorage.setItem('leftPanelCollapsed', 'true');

        // Set example profile flag
        localStorage.setItem('cleansheet_example_profile', profileType);

        // Close the onboarding modal
        this.close();

        // Wait for modal to close, then use existing import function
        setTimeout(() => {
            // Use the existing import mechanism
            if (typeof window !== 'undefined' && window.pendingImportData !== undefined && typeof processImportWithMode === 'function') {
                console.log('[Simple Onboarding] Using existing import mechanism');
                window.pendingImportData = importData;
                processImportWithMode(true); // true = overwrite mode
            } else {
                console.error('[Simple Onboarding] Import functions not available, falling back to manual load');
                // Fallback: manually save and open Canvas
                this.saveSampleDataManually(importData);

                setTimeout(() => {
                    if (typeof openCanvasModal === 'function') {
                        openCanvasModal();
                    }
                    setTimeout(() => {
                        if (typeof restartTour === 'function') {
                            restartTour();
                        }
                    }, 500);
                }, 400);
            }
        }, 400);
    }

    /**
     * Create sample data for example profile in import format
     */
    createSampleData(profileType) {
        const profiles = {
            'retail-manager': {
                userFirstName: 'Marcus',
                userLastName: 'Thompson',
                userOccupation: 'Store Manager',
                userGoals: 'Transition to Data Analytics role leveraging retail insights',
                userEmail: '',
                experiences: [
                    {
                        id: 'exp_' + Date.now() + '_1',
                        role: 'Store Manager',
                        organizationName: 'RetailCorp',
                        location: 'Seattle, WA',
                        startDate: '2018-03',
                        endDate: '',
                        description: 'Managing daily operations of high-volume retail store with 50+ employees and $10M annual revenue',
                        technologies: ['Excel', 'POS Systems', 'Inventory Management Software', 'Tableau'],
                        careerPaths: ['Analytics', 'Project Management'],
                        skills: ['Team Leadership', 'Data Analysis', 'Operations Management', 'Budget Planning'],
                        achievements: ['Increased store revenue by 25%', 'Reduced inventory costs by 15%', 'Improved employee retention by 30%']
                    },
                    {
                        id: 'exp_' + Date.now() + '_2',
                        role: 'Assistant Manager',
                        organizationName: 'RetailCorp',
                        location: 'Seattle, WA',
                        startDate: '2015-06',
                        endDate: '2018-02',
                        description: 'Supported store operations, managed inventory, and analyzed sales data',
                        technologies: ['Excel', 'POS Systems', 'Inventory Software'],
                        careerPaths: ['Project Management', 'Analytics'],
                        skills: ['Team Leadership', 'Inventory Management', 'Customer Service', 'Data Analysis'],
                        achievements: ['Led successful holiday season campaigns', 'Reduced stock-outs by 40%']
                    },
                    {
                        id: 'exp_' + Date.now() + '_3',
                        role: 'Sales Associate',
                        organizationName: 'MegaMart',
                        location: 'Portland, OR',
                        startDate: '2013-01',
                        endDate: '2015-05',
                        description: 'Provided excellent customer service and maintained sales floor',
                        technologies: ['POS Systems'],
                        careerPaths: ['Project Management'],
                        skills: ['Customer Service', 'Sales', 'Team Collaboration'],
                        achievements: ['Top sales performer 6 quarters in a row', 'Employee of the month 4 times']
                    }
                ],
                behavioralStories: [
                    {
                        id: 'story_' + Date.now() + '_1',
                        title: 'Inventory Crisis Recovery',
                        situation: 'Supply chain disruption caused critical inventory shortages',
                        task: 'Maintain sales while managing limited inventory',
                        action: 'Implemented data-driven reorder system and alternative supplier strategy',
                        result: 'Reduced stock-outs by 60% and maintained revenue targets',
                        skills: ['Problem Solving', 'Data Analysis', 'Vendor Management']
                    },
                    {
                        id: 'story_' + Date.now() + '_2',
                        title: 'Team Transformation',
                        situation: 'High employee turnover affecting store performance',
                        task: 'Improve retention and team morale',
                        action: 'Developed mentorship program and performance incentives',
                        result: 'Reduced turnover by 45% and improved customer satisfaction scores',
                        skills: ['Leadership', 'Change Management', 'Employee Development']
                    }
                ],
                goals: [
                    {
                        id: 'goal_' + Date.now() + '_1',
                        title: 'Complete Data Analytics Certification',
                        description: 'Earn Google Data Analytics Professional Certificate',
                        targetDate: '2025-06-30',
                        status: 'in_progress',
                        category: 'Education'
                    },
                    {
                        id: 'goal_' + Date.now() + '_2',
                        title: 'Build Analytics Portfolio',
                        description: 'Create 5 retail analytics case studies showcasing data visualization skills',
                        targetDate: '2025-09-30',
                        status: 'not_started',
                        category: 'Portfolio'
                    }
                ],
                portfolio: [
                    {
                        id: 'portfolio_' + Date.now() + '_1',
                        name: 'Retail Sales Dashboard',
                        description: 'Interactive Tableau dashboard analyzing 3 years of sales data',
                        type: 'Data Visualization',
                        technologies: ['Tableau', 'Excel', 'SQL'],
                        url: '',
                        completedDate: '2024-12-15'
                    }
                ],
                jobOpportunities: [
                    {
                        id: 'job_' + Date.now() + '_1',
                        title: 'Data Analyst',
                        company: 'TechRetail Inc',
                        location: 'Seattle, WA',
                        type: 'Full-time',
                        status: 'applied',
                        url: 'https://example.com/job1',
                        appliedDate: '2024-11-15',
                        notes: 'Strong match - retail analytics focus'
                    },
                    {
                        id: 'job_' + Date.now() + '_2',
                        title: 'Business Intelligence Analyst',
                        company: 'RetailAnalytics Co',
                        location: 'Remote',
                        type: 'Full-time',
                        status: 'interviewing',
                        url: 'https://example.com/job2',
                        appliedDate: '2024-11-10',
                        notes: 'Second round interview scheduled'
                    }
                ]
            },
            'research-scientist': {
                userFirstName: 'Sarah',
                userLastName: 'Chen',
                userOccupation: 'Research Scientist',
                userGoals: 'Lead groundbreaking research in materials science and mentor next generation of scientists',
                userEmail: '',
                experiences: [
                    {
                        id: 'exp_' + Date.now() + '_1',
                        role: 'Senior Research Scientist',
                        organizationName: 'National Research Institute',
                        location: 'Boston, MA',
                        startDate: '2020-01',
                        endDate: '',
                        description: 'Leading materials science research team investigating novel nanomaterials for energy applications',
                        technologies: ['Python', 'MATLAB', 'R', 'TensorFlow', 'Lab Equipment', 'Spectroscopy Tools'],
                        careerPaths: ['Analytics', 'AI/ML'],
                        skills: ['Research Design', 'Data Analysis', 'Scientific Writing', 'Lab Management', 'Grant Writing', 'Team Leadership'],
                        achievements: ['Published 12 peer-reviewed papers', 'Secured $3.5M in research funding', 'Led team of 8 researchers']
                    },
                    {
                        id: 'exp_' + Date.now() + '_2',
                        role: 'Postdoctoral Researcher',
                        organizationName: 'MIT Materials Lab',
                        location: 'Cambridge, MA',
                        startDate: '2017-09',
                        endDate: '2019-12',
                        description: 'Conducted independent research on carbon nanotube applications',
                        technologies: ['Python', 'MATLAB', 'Lab Equipment', 'Electron Microscopy'],
                        careerPaths: ['Analytics'],
                        skills: ['Experimental Design', 'Data Analysis', 'Scientific Writing', 'Collaboration'],
                        achievements: ['Published 5 first-author papers', 'Awarded prestigious fellowship', 'Filed 2 patent applications']
                    },
                    {
                        id: 'exp_' + Date.now() + '_3',
                        role: 'Graduate Research Assistant',
                        organizationName: 'Stanford University',
                        location: 'Stanford, CA',
                        startDate: '2012-09',
                        endDate: '2017-06',
                        description: 'PhD research in materials engineering and nanotechnology',
                        technologies: ['MATLAB', 'Lab Equipment', 'Simulation Software'],
                        careerPaths: ['Analytics'],
                        skills: ['Research', 'Data Analysis', 'Technical Writing', 'Teaching'],
                        achievements: ['Completed PhD dissertation', 'Published 6 papers', 'Teaching Assistant for 4 courses']
                    }
                ],
                behavioralStories: [
                    {
                        id: 'story_' + Date.now() + '_1',
                        title: 'Breakthrough Discovery',
                        situation: 'Research hitting plateau with conventional approaches',
                        task: 'Find innovative solution to improve material properties',
                        action: 'Applied machine learning to predict optimal synthesis conditions',
                        result: 'Achieved 40% improvement in material performance, leading to Nature publication',
                        skills: ['Innovation', 'Data Science', 'Problem Solving', 'Interdisciplinary Collaboration']
                    },
                    {
                        id: 'story_' + Date.now() + '_2',
                        title: 'Grant Funding Success',
                        situation: 'Lab needed significant funding for new equipment',
                        task: 'Secure major research grant in competitive environment',
                        action: 'Developed compelling proposal with clear commercial applications',
                        result: 'Secured $2M NSF grant (10% acceptance rate)',
                        skills: ['Grant Writing', 'Strategic Planning', 'Communication', 'Project Management']
                    }
                ],
                goals: [
                    {
                        id: 'goal_' + Date.now() + '_1',
                        title: 'Publish in Top-Tier Journal',
                        description: 'Submit manuscript to Nature Materials on novel synthesis method',
                        targetDate: '2025-08-31',
                        status: 'in_progress',
                        category: 'Research'
                    },
                    {
                        id: 'goal_' + Date.now() + '_2',
                        title: 'Secure R01 Grant',
                        description: 'Apply for NIH R01 grant for next phase of research',
                        targetDate: '2025-11-30',
                        status: 'not_started',
                        category: 'Funding'
                    },
                    {
                        id: 'goal_' + Date.now() + '_3',
                        title: 'Mentor Graduate Students',
                        description: 'Take on 2 PhD students as primary advisor',
                        targetDate: '2025-09-01',
                        status: 'in_progress',
                        category: 'Leadership'
                    }
                ],
                portfolio: [
                    {
                        id: 'portfolio_' + Date.now() + '_1',
                        name: 'ML-Driven Materials Discovery Platform',
                        description: 'Python-based machine learning pipeline for predicting material properties',
                        type: 'Research Project',
                        technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Jupyter'],
                        url: '',
                        completedDate: '2024-10-20'
                    },
                    {
                        id: 'portfolio_' + Date.now() + '_2',
                        name: 'Nanomaterials Characterization Database',
                        description: 'Comprehensive database of experimental results with visualization tools',
                        type: 'Data Project',
                        technologies: ['Python', 'PostgreSQL', 'Plotly', 'Dash'],
                        url: '',
                        completedDate: '2024-06-15'
                    }
                ],
                jobOpportunities: [
                    {
                        id: 'job_' + Date.now() + '_1',
                        title: 'Senior Research Scientist',
                        company: 'Advanced Materials Corp',
                        location: 'Cambridge, MA',
                        type: 'Full-time',
                        status: 'interested',
                        url: 'https://example.com/job1',
                        appliedDate: '',
                        notes: 'Industry position with higher salary and resources'
                    }
                ]
            },
            'new-graduate': {
                userFirstName: 'Jamie',
                userLastName: 'Rodriguez',
                userOccupation: 'Recent CS Graduate',
                userGoals: 'Launch career as Full Stack Software Developer and build meaningful products',
                userEmail: '',
                experiences: [
                    {
                        id: 'exp_' + Date.now() + '_1',
                        role: 'Software Engineering Intern',
                        organizationName: 'Tech Startup Inc',
                        location: 'San Francisco, CA',
                        startDate: '2024-06',
                        endDate: '2024-09',
                        description: 'Developed full-stack web applications and contributed to production codebase serving 100K+ users',
                        technologies: ['JavaScript', 'React', 'Node.js', 'Express', 'Git', 'MongoDB', 'AWS'],
                        careerPaths: ['Full Stack Developer', 'Cloud Computing'],
                        skills: ['Web Development', 'Problem Solving', 'Team Collaboration', 'Agile', 'Code Review'],
                        achievements: ['Built 5 production features', 'Improved page load time by 40%', 'Received return offer']
                    },
                    {
                        id: 'exp_' + Date.now() + '_2',
                        role: 'Teaching Assistant',
                        organizationName: 'University Computer Science Dept',
                        location: 'Berkeley, CA',
                        startDate: '2023-08',
                        endDate: '2024-05',
                        description: 'Assisted professor with Data Structures course, held office hours and graded assignments',
                        technologies: ['Python', 'Java', 'Git'],
                        careerPaths: ['Full Stack Developer'],
                        skills: ['Teaching', 'Communication', 'Problem Solving', 'Mentoring'],
                        achievements: ['Helped 50+ students succeed', 'Created supplemental learning materials', 'Rated 4.8/5 by students']
                    },
                    {
                        id: 'exp_' + Date.now() + '_3',
                        role: 'Coding Bootcamp Instructor',
                        organizationName: 'Code Academy Summer Camp',
                        location: 'Berkeley, CA',
                        startDate: '2023-06',
                        endDate: '2023-08',
                        description: 'Taught Python programming to high school students',
                        technologies: ['Python', 'Game Development', 'Web Development'],
                        careerPaths: ['Full Stack Developer'],
                        skills: ['Teaching', 'Communication', 'Curriculum Design', 'Patience'],
                        achievements: ['Taught 30 students', 'Developed engaging curriculum', 'All students completed final projects']
                    }
                ],
                behavioralStories: [
                    {
                        id: 'story_' + Date.now() + '_1',
                        title: 'Performance Optimization Win',
                        situation: 'User dashboard had slow load times affecting UX',
                        task: 'Improve dashboard performance without major refactoring',
                        action: 'Implemented lazy loading, code splitting, and optimized database queries',
                        result: 'Reduced load time from 8s to 3s, improved user satisfaction scores by 35%',
                        skills: ['Performance Optimization', 'Problem Solving', 'Web Development', 'Data Analysis']
                    },
                    {
                        id: 'story_' + Date.now() + '_2',
                        title: 'First Production Feature',
                        situation: 'Assigned first major feature as intern',
                        task: 'Build user notification system from scratch',
                        action: 'Designed system architecture, implemented backend/frontend, wrote tests',
                        result: 'Deployed on time with 95% test coverage, now used by 100K+ users',
                        skills: ['Full Stack Development', 'System Design', 'Testing', 'Project Management']
                    }
                ],
                goals: [
                    {
                        id: 'goal_' + Date.now() + '_1',
                        title: 'Land Full-Time Developer Role',
                        description: 'Secure full-time position at product-focused tech company',
                        targetDate: '2025-03-31',
                        status: 'in_progress',
                        category: 'Career'
                    },
                    {
                        id: 'goal_' + Date.now() + '_2',
                        title: 'Build 3 Portfolio Projects',
                        description: 'Create and deploy 3 full-stack applications showcasing different skills',
                        targetDate: '2025-02-28',
                        status: 'in_progress',
                        category: 'Portfolio'
                    },
                    {
                        id: 'goal_' + Date.now() + '_3',
                        title: 'Contribute to Open Source',
                        description: 'Make meaningful contributions to 2 popular open source projects',
                        targetDate: '2025-06-30',
                        status: 'not_started',
                        category: 'Development'
                    }
                ],
                portfolio: [
                    {
                        id: 'portfolio_' + Date.now() + '_1',
                        name: 'Task Management App',
                        description: 'Full-stack MERN app with real-time collaboration features',
                        type: 'Web Application',
                        technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
                        url: 'https://github.com/jrodriguez/task-app',
                        completedDate: '2024-11-10'
                    },
                    {
                        id: 'portfolio_' + Date.now() + '_2',
                        name: 'Weather Dashboard',
                        description: 'React app with weather forecasts and historical data visualization',
                        type: 'Web Application',
                        technologies: ['React', 'TypeScript', 'Chart.js', 'Weather API'],
                        url: 'https://github.com/jrodriguez/weather-dash',
                        completedDate: '2024-09-20'
                    },
                    {
                        id: 'portfolio_' + Date.now() + '_3',
                        name: 'API Rate Limiter',
                        description: 'Open-source Node.js middleware for API rate limiting',
                        type: 'Library',
                        technologies: ['Node.js', 'Redis', 'TypeScript', 'Jest'],
                        url: 'https://github.com/jrodriguez/rate-limiter',
                        completedDate: '2024-10-15'
                    }
                ],
                jobOpportunities: [
                    {
                        id: 'job_' + Date.now() + '_1',
                        title: 'Junior Software Engineer',
                        company: 'Tech Startup Inc',
                        location: 'San Francisco, CA',
                        type: 'Full-time',
                        status: 'offer_received',
                        url: 'https://example.com/job1',
                        appliedDate: '2024-10-01',
                        notes: 'Return offer from internship - decision pending'
                    },
                    {
                        id: 'job_' + Date.now() + '_2',
                        title: 'Full Stack Developer',
                        company: 'Growing Startup',
                        location: 'Remote',
                        type: 'Full-time',
                        status: 'applied',
                        url: 'https://example.com/job2',
                        appliedDate: '2024-11-05',
                        notes: 'Exciting product company building social platform'
                    },
                    {
                        id: 'job_' + Date.now() + '_3',
                        title: 'Software Engineer',
                        company: 'Enterprise Corp',
                        location: 'New York, NY',
                        type: 'Full-time',
                        status: 'interviewing',
                        url: 'https://example.com/job3',
                        appliedDate: '2024-11-01',
                        notes: 'Phone screen completed, waiting for technical interview'
                    }
                ]
            }
        };

        const data = profiles[profileType];
        if (!data) {
            console.error('[Simple Onboarding] Unknown profile type:', profileType);
            return null;
        }

        console.log('[Simple Onboarding] Sample data created for', profileType);
        return data;
    }

    /**
     * Fallback method to manually save data if import function not available
     */
    saveSampleDataManually(importData) {
        console.log('[Simple Onboarding] Using fallback manual save');

        // Save profile data
        const profile = {
            firstName: importData.userFirstName,
            lastName: importData.userLastName,
            profession: importData.userOccupation,
            goal: importData.userGoals,
            email: importData.userEmail || ''
        };
        localStorage.setItem('cleansheet_profile', JSON.stringify(profile));

        // Save experiences
        localStorage.setItem('cleansheet_experiences', JSON.stringify(importData.experiences || []));

        // Save stories
        const stories = importData.behavioralStories || [];
        localStorage.setItem('cleansheet_stories', JSON.stringify(stories));
        localStorage.setItem('behavioralStories', JSON.stringify(stories));

        // Save goals
        localStorage.setItem('userGoals_default', JSON.stringify(importData.goals || []));

        // Save portfolio
        localStorage.setItem('userPortfolio_default', JSON.stringify(importData.portfolio || []));

        // Save job opportunities
        localStorage.setItem('jobOpportunities_default', JSON.stringify(importData.jobOpportunities || []));

        console.log('[Simple Onboarding] All sample data saved manually');
    }

    /**
     * Show import confirmation modal
     */
    showImportConfirmationModal() {
        const modal = document.createElement('div');
        modal.className = 'import-confirmation-modal';
        modal.innerHTML = `
            <div class="import-confirmation-overlay"></div>
            <div class="import-confirmation-content">
                <div class="import-confirmation-icon">
                    <i class="ph ph-upload-simple"></i>
                </div>
                <h2 style="font-family: var(--font-family-ui); font-size: 24px; font-weight: 600; color: var(--color-dark); margin: 0 0 12px 0; text-align: center;">
                    Import from Backup
                </h2>
                <p style="font-family: var(--font-family-body); font-size: 14px; color: var(--color-neutral-text); line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                    Restore your Career Canvas from a previously exported backup file
                </p>

                <div class="import-steps">
                    <div class="import-step">
                        <div class="import-step-number">1</div>
                        <div class="import-step-text">Select your backup JSON file</div>
                    </div>
                    <div class="import-step">
                        <div class="import-step-number">2</div>
                        <div class="import-step-text">All data will be restored (overwrites existing)</div>
                    </div>
                    <div class="import-step">
                        <div class="import-step-number">3</div>
                        <div class="import-step-text">Page refreshes with your imported data</div>
                    </div>
                </div>

                <div class="import-confirmation-buttons">
                    <button class="import-cancel-btn" id="importCancelBtn">
                        <i class="ph ph-x"></i>
                        <span>Cancel</span>
                    </button>
                    <button class="import-confirm-btn" id="importConfirmBtn">
                        <i class="ph ph-check"></i>
                        <span>Continue</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addImportModalStyles();

        // Animate in
        setTimeout(() => modal.classList.add('active'), 10);

        // Attach button handlers
        document.getElementById('importCancelBtn').addEventListener('click', () => {
            console.log('[Simple Onboarding] Import cancelled by user');
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        document.getElementById('importConfirmBtn').addEventListener('click', () => {
            console.log('[Simple Onboarding] Import confirmed');

            // Remove confirmation modal
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);

            // Mark onboarding as completed (so it doesn't show again after reload)
            this.markCompleted();

            // Close onboarding modal
            this.close();

            // Wait for modals to close, then trigger import
            setTimeout(() => {
                // Call the existing restore function from career-canvas.html
                if (typeof handleRestoreFromModal === 'function') {
                    console.log('[Simple Onboarding] Calling handleRestoreFromModal');
                    handleRestoreFromModal('overwrite');
                } else {
                    console.error('[Simple Onboarding] handleRestoreFromModal function not available');
                    alert('Import function not available. Please try from Data Management after opening Canvas.');
                }
            }, 700);
        });
    }

    /**
     * Add import confirmation modal styles
     */
    addImportModalStyles() {
        if (document.getElementById('importConfirmationStyles')) return;

        const style = document.createElement('style');
        style.id = 'importConfirmationStyles';
        style.textContent = `
            .import-confirmation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .import-confirmation-modal.active {
                opacity: 1;
            }

            .import-confirmation-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }

            .import-confirmation-content {
                position: relative;
                width: 90%;
                max-width: 500px;
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .import-confirmation-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, var(--color-primary-blue) 0%, var(--color-accent-blue) 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 24px;
                box-shadow: 0 8px 24px rgba(0, 102, 204, 0.3);
            }

            .import-confirmation-icon i {
                font-size: 40px;
                color: white;
            }

            .import-steps {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 32px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 12px;
            }

            .import-step {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .import-step-number {
                width: 32px;
                height: 32px;
                background: var(--color-primary-blue);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-family-ui);
                font-size: 14px;
                font-weight: 600;
                flex-shrink: 0;
            }

            .import-step-text {
                font-family: var(--font-family-body);
                font-size: 14px;
                color: var(--color-dark);
                line-height: 1.5;
            }

            .import-confirmation-buttons {
                display: flex;
                gap: 12px;
                width: 100%;
            }

            .import-cancel-btn,
            .import-confirm-btn {
                flex: 1;
                padding: 14px 24px;
                border: none;
                border-radius: 10px;
                font-family: var(--font-family-ui);
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .import-cancel-btn {
                background: white;
                border: 2px solid var(--color-neutral-border);
                color: var(--color-neutral-text);
            }

            .import-cancel-btn:hover {
                border-color: #dc2626;
                color: #dc2626;
                background: #fef2f2;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
            }

            .import-confirm-btn {
                background: linear-gradient(135deg, var(--color-primary-blue) 0%, var(--color-accent-blue) 100%);
                color: white;
            }

            .import-confirm-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(0, 102, 204, 0.4);
            }

            .import-cancel-btn:active,
            .import-confirm-btn:active {
                transform: translateY(0);
            }

            .import-cancel-btn i,
            .import-confirm-btn i {
                font-size: 18px;
            }

            @media (max-width: 768px) {
                .import-confirmation-content {
                    padding: 32px 24px;
                }

                .import-confirmation-icon {
                    width: 64px;
                    height: 64px;
                }

                .import-confirmation-icon i {
                    font-size: 32px;
                }

                .import-confirmation-buttons {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Mark onboarding as completed
     */
    markCompleted() {
        localStorage.setItem('cleansheet_onboarding_completed', 'true');
        console.log('[Simple Onboarding] Marked as completed');
    }

    /**
     * Close modal
     */
    close() {
        if (this.modalElement) {
            this.modalElement.classList.remove('active');
            setTimeout(() => {
                this.modalElement.remove();
                this.modalElement = null;
            }, 300);
        }
    }

    /**
     * Reset for testing
     */
    static reset() {
        localStorage.removeItem('cleansheet_onboarding_completed');
        console.log('[Simple Onboarding] Reset - reload page to see modal again');
    }
}

// Export
if (typeof window !== 'undefined') {
    window.SimpleOnboardingModal = SimpleOnboardingModal;
}
