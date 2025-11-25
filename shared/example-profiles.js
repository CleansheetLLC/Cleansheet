/**
 * Example Profiles Data
 * 
 * Contains sample data for demonstrating the Cleansheet Canvas with different personas:
 * - career-changer: Marcus Thompson (Store Manager → Analytics)
 * - product-manager: Dr. Sarah Chen (Research Scientist → Data Science)
 * - new-graduate: Alex Martinez (Computer Science Graduate)
 * 
 * Also includes example documents and diagrams for each persona.
 * 
 * This file is extracted from career-canvas.html for maintainability.
 */

// Example documents for each persona
const exampleDocuments = {
    'career-changer': [
        {
            id: 'example-doc-rm-1',
            name: 'Store Operations Playbook',
            description: 'Comprehensive guide for daily store operations, opening/closing procedures, and staff scheduling protocols.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-15T08:00:00.000Z',
            lastModified: '2024-01-15T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-doc-rm-2',
            name: 'Customer Service Training Manual',
            description: 'Training materials for new hires covering customer engagement, conflict resolution, and company policies.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-20T08:00:00.000Z',
            lastModified: '2024-01-20T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-doc-rm-3',
            name: 'Inventory Management Best Practices',
            description: 'Documentation of inventory tracking systems, reordering procedures, and loss prevention strategies.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-25T08:00:00.000Z',
            lastModified: '2024-01-25T08:00:00.000Z',
            isExample: true
        }
    ],
    'product-manager': [
        {
            id: 'example-doc-chem-1',
            name: 'Lab Safety & Compliance Protocol',
            description: 'Safety procedures, chemical handling guidelines, and regulatory compliance documentation for laboratory operations.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-15T08:00:00.000Z',
            lastModified: '2024-01-15T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-doc-chem-2',
            name: 'Experimental Procedures - Polymer Synthesis',
            description: 'Detailed methodology for polymer synthesis experiments including materials, equipment setup, and analysis techniques.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-20T08:00:00.000Z',
            lastModified: '2024-01-20T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-doc-chem-3',
            name: 'Quality Control Standards & Testing',
            description: 'Quality assurance protocols, testing procedures, and acceptance criteria for research outputs.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-25T08:00:00.000Z',
            lastModified: '2024-01-25T08:00:00.000Z',
            isExample: true
        }
    ],
    'new-graduate': [
        {
            id: 'example-doc-da-1',
            name: 'SQL Query Library & Documentation',
            description: 'Collection of reusable SQL queries for common reporting needs, with explanations and optimization notes.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-15T08:00:00.000Z',
            lastModified: '2024-01-15T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-doc-da-2',
            name: 'Dashboard Design Standards',
            description: 'Guidelines for creating effective data visualizations, color schemes, and user interface best practices.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-20T08:00:00.000Z',
            lastModified: '2024-01-20T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-doc-da-3',
            name: 'Data Cleaning & Validation Procedures',
            description: 'Step-by-step processes for data quality checks, handling missing values, and ensuring data integrity.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            content: '',
            created: '2024-01-25T08:00:00.000Z',
            lastModified: '2024-01-25T08:00:00.000Z',
            isExample: true
        }
    ]
};

// Example diagrams for each persona
const exampleDiagrams = {
    'career-changer': [
        {
            id: 'example-diag-rm-1',
            name: 'Store Layout & Customer Flow',
            description: 'Floor plan showing product placement, checkout zones, and optimal customer traffic patterns for maximum sales conversion.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-15T08:00:00.000Z',
            lastModified: '2024-01-15T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-diag-rm-2',
            name: 'Team Organization Chart',
            description: 'Organizational structure showing reporting relationships, shift schedules, and department responsibilities.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-20T08:00:00.000Z',
            lastModified: '2024-01-20T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-diag-rm-3',
            name: 'Inventory Management Process Flow',
            description: 'Workflow diagram illustrating receiving, stocking, inventory counts, and reordering processes.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-25T08:00:00.000Z',
            lastModified: '2024-01-25T08:00:00.000Z',
            isExample: true
        }
    ],
    'product-manager': [
        {
            id: 'example-diag-chem-1',
            name: 'Lab Equipment Layout',
            description: 'Laboratory floor plan showing equipment placement, safety stations, and workflow zones for optimal efficiency.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-15T08:00:00.000Z',
            lastModified: '2024-01-15T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-diag-chem-2',
            name: 'Synthesis Reaction Pathway',
            description: 'Chemical reaction scheme showing synthesis steps, intermediate compounds, and reaction conditions.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-20T08:00:00.000Z',
            lastModified: '2024-01-20T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-diag-chem-3',
            name: 'Quality Control Workflow',
            description: 'Process flowchart for sample testing, analysis methods, data validation, and approval procedures.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-25T08:00:00.000Z',
            lastModified: '2024-01-25T08:00:00.000Z',
            isExample: true
        }
    ],
    'new-graduate': [
        {
            id: 'example-diag-da-1',
            name: 'Data Pipeline Architecture',
            description: 'System architecture diagram showing data sources, ETL processes, databases, and reporting layers.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-15T08:00:00.000Z',
            lastModified: '2024-01-15T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-diag-da-2',
            name: 'Dashboard Wireframe - Sales Analytics',
            description: 'Wireframe design for executive sales dashboard with KPIs, trend charts, and drill-down capabilities.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-20T08:00:00.000Z',
            lastModified: '2024-01-20T08:00:00.000Z',
            isExample: true
        },
        {
            id: 'example-diag-da-3',
            name: 'Analysis Process Flowchart',
            description: 'Workflow showing data collection, cleaning, analysis, visualization, and stakeholder communication steps.',
            linkedType: 'none',
            linkedId: '',
            linkedName: '',
            diagramData: null,
            created: '2024-01-25T08:00:00.000Z',
            lastModified: '2024-01-25T08:00:00.000Z',
            isExample: true
        }
    ]
};

// Example Profiles Data
const exampleProfiles = {
    'career-changer': {
        "userFirstName":"Marcus",
        "userLastName":"Thompson",
        "userOccupation":"Store Manager",
        "userGoals":"Transition from retail management into business analytics or operations management roles in tech companies.",
        "goals": [
            {
                "title": "Complete Google Data Analytics Professional Certificate",
                "targetDate": "2025-06-30",
                "category": "Education & Certifications",
                "milestones": ["Finish Coursera enrollment", "Complete 3 courses by March", "Build capstone project", "Earn certificate"],
                "status": "In Progress",
                "progress": 45,
                "currentMilestone": "Complete 3 courses by March",
                "completedMilestones": ["Finish Coursera enrollment"],
                "smart": {
                    "specific": "Complete all 8 courses in the Google Data Analytics Professional Certificate program on Coursera, including hands-on projects and the capstone",
                    "measurable": "Track completion of 8 courses, pass all graded assignments with 80%+ scores, complete capstone project, earn certificate",
                    "achievable": "Allocate 8-10 hours per week, leverage existing Excel skills, use retail data from current role for practice exercises",
                    "relevant": "Essential credential for transitioning from retail management to business analytics roles, demonstrates commitment to data-driven decision making",
                    "timebound": "Complete by June 30, 2025 (6 months, ~1.3 courses per month)"
                },
                "metrics": {
                    "coursesCompleted": 3,
                    "coursesTotal": 8,
                    "hoursInvested": 67,
                    "averageGrade": 87
                }
            },
            {
                "title": "Build 3 business analytics portfolio projects using real retail data",
                "targetDate": "2025-08-31",
                "category": "Portfolio Development",
                "milestones": ["Sales forecasting model", "Customer segmentation analysis", "Inventory optimization dashboard"],
                "status": "In Progress",
                "progress": 33,
                "currentMilestone": "Sales forecasting model",
                "completedMilestones": [],
                "smart": {
                    "specific": "Create three distinct analytics projects using anonymized retail data: (1) Sales forecasting using time-series analysis, (2) Customer segmentation with clustering algorithms, (3) Interactive Power BI inventory optimization dashboard",
                    "measurable": "Each project must include documentation, code/formulas, visualizations, insights, and measurable business impact. Host code on GitHub, publish dashboards online",
                    "achievable": "Use data from current Store Manager role (with proper anonymization), leverage Google certificate skills, dedicate weekends to development",
                    "relevant": "Portfolio projects demonstrate practical application of analytics skills and domain expertise in retail, addressing common interview case studies",
                    "timebound": "Complete by August 31, 2025 (one project every 2 months)"
                },
                "metrics": {
                    "projectsCompleted": 1,
                    "projectsTotal": 3,
                    "githubCommits": 47,
                    "portfolioViews": 0
                }
            },
            {
                "title": "Land Business Analyst or Operations Analyst role at tech company",
                "targetDate": "2025-12-31",
                "category": "Career Transition",
                "milestones": ["Apply to 50+ positions", "Get 5+ interviews", "Receive offer", "Negotiate compensation"],
                "status": "Not Started",
                "progress": 0,
                "currentMilestone": "Apply to 50+ positions",
                "completedMilestones": [],
                "smart": {
                    "specific": "Secure full-time Business Analyst or Operations Analyst position at a technology company (software, cloud, e-commerce) with minimum $85K salary and growth opportunities",
                    "measurable": "Apply to 50+ relevant positions, maintain 10%+ interview conversion rate, receive at least 2 offers, negotiate compensation package including base salary, benefits, and equity",
                    "achievable": "Leverage completed Google certificate, portfolio projects, 6+ years management experience, and transferable skills in operations and data analysis",
                    "relevant": "This is the primary career transition goal that all education and portfolio development activities support, enabling long-term career growth in analytics/tech",
                    "timebound": "Secure offer by December 31, 2025 (begin active job search after portfolio completion in September 2025)"
                },
                "metrics": {
                    "applicationsSubmitted": 0,
                    "applicationsTarget": 50,
                    "interviewsScheduled": 0,
                    "interviewsTarget": 5,
                    "offersReceived": 0,
                    "networkingConnections": 0
                }
            }
        ],
        "portfolio": [
            {
                "name": "Power BI Sales Performance Dashboard",
                "description": "Interactive dashboard analyzing 3 years of retail sales data across 15 store locations. Features KPI tracking, trend analysis, YoY comparisons, and predictive forecasting using Excel and Power BI.",
                "link": "",
                "technologies": ["Power BI", "Excel", "DAX", "SQL"],
                "skills": ["Data Visualization", "Business Intelligence", "Statistical Analysis", "KPI Development"],
                "competencies": ["Data Analysis", "Business Strategy", "Performance Management"]
            },
            {
                "name": "Excel VBA Inventory Optimization System",
                "description": "Automated inventory management system using Excel VBA that analyzes sales patterns, calculates optimal stock levels, and generates reorder recommendations. Reduced overstock by 22% and stockouts by 35%.",
                "link": "",
                "technologies": ["Excel VBA", "Macros", "Pivot Tables"],
                "skills": ["Programming", "Process Automation", "Data Analysis", "Problem Solving"],
                "competencies": ["Process Optimization", "Analytical Thinking", "Innovation"]
            }
        ],
        "jobOpportunities": [
            {
                "title": "Business Analyst",
                "company": "Microsoft",
                "location": "Redmond, WA",
                "url": "https://careers.microsoft.com",
                "status": "applied",
                "closeDate": "2025-02-28",
                "salary": "$85K-$110K",
                "notes": "Applied via company website. Recruiter reached out for screening call next week.",
                "todos": [
                    {"id": 1, "task": "Research Microsoft's retail partnerships", "date": "2025-01-25", "completed": false},
                    {"id": 2, "task": "Prepare STAR stories for phone screening", "date": "2025-01-27", "completed": false},
                    {"id": 3, "task": "Review SQL and data analysis concepts", "date": "2025-01-26", "completed": false}
                ],
                "skills": ["SQL", "Excel", "Data Analysis", "Business Strategy"],
                "competencies": ["Analytical Thinking", "Stakeholder Management", "Project Management"]
            },
            {
                "title": "Operations Analyst",
                "company": "Amazon",
                "location": "Seattle, WA",
                "url": "https://amazon.jobs",
                "status": "interviewing",
                "closeDate": "2025-02-15",
                "salary": "$90K-$115K",
                "notes": "First round interview completed. Waiting for second round scheduling.",
                "todos": [
                    {"id": 1, "task": "Prepare for behavioral interview round", "date": "2025-01-22", "completed": true},
                    {"id": 2, "task": "Research Amazon's Leadership Principles", "date": "2025-01-20", "completed": true},
                    {"id": 3, "task": "Prepare case study on supply chain optimization", "date": "2025-01-28", "completed": false},
                    {"id": 4, "task": "Send thank you email to interviewers", "date": "2025-01-23", "completed": false}
                ],
                "skills": ["Data Analysis", "Process Improvement", "SQL", "Python"],
                "competencies": ["Operations Management", "Problem Solving", "Strategic Thinking"]
            },
            {
                "title": "Retail Analytics Specialist",
                "company": "Target Corporate",
                "location": "Minneapolis, MN",
                "url": "https://corporate.target.com/careers",
                "status": "interested",
                "closeDate": "2025-03-15",
                "salary": "$75K-$95K",
                "notes": "Internal posting. Spoke with hiring manager at last company meeting. Strong referral from district manager.",
                "todos": [
                    {"id": 1, "task": "Update resume highlighting analytics projects", "date": "2025-01-30", "completed": false},
                    {"id": 2, "task": "Schedule informational interview with current analyst", "date": "2025-02-01", "completed": false}
                ],
                "skills": ["Retail Operations", "Data Analysis", "Power BI", "Excel"],
                "competencies": ["Retail Domain Expertise", "Data-Driven Decision Making", "Business Strategy"]
            },
            {
                "title": "Data Analyst",
                "company": "Walmart Global Tech",
                "location": "Bentonville, AR (Remote)",
                "url": "https://careers.walmart.com",
                "status": "interested",
                "closeDate": "2025-03-31",
                "salary": "$80K-$105K",
                "notes": "Role focuses on retail analytics and supply chain optimization. Aligns perfectly with my retail background.",
                "todos": [
                    {"id": 1, "task": "Complete Python for Data Analysis course", "date": "2025-02-10", "completed": false},
                    {"id": 2, "task": "Build retail forecasting project for portfolio", "date": "2025-02-20", "completed": false}
                ],
                "skills": ["Python", "SQL", "Tableau", "Statistics"],
                "competencies": ["Data Analysis", "Forecasting", "Retail Operations"]
            }
        ],
        "experiences":[{"organizationName":"Target Corporation","role":"Store Manager","location":"Minneapolis, MN","startDate":"2019-03-01","endDate":"","description":"Lead store operations for high-volume location with 85+ team members. Manage P&L, inventory, staffing, and customer experience initiatives. Increased sales by 18% and improved employee retention by 25%.","technologies":[{"name":"Excel","type":"Core"},{"name":"Power BI","type":"Peripheral"},{"name":"Workday","type":"Peripheral"},{"name":"Square POS","type":"Core"},{"name":"Kronos","type":"Peripheral"}],"keySkills":["P&L Management","Team Leadership","Inventory Management","Customer Service","Data-Driven Decision Making","Conflict Resolution","Performance Management"],"competencies":["Operations Management","Strategic Planning","Financial Analysis","Process Improvement","Change Management"],"projectTypes":["Operational Efficiency","Team Development","Sales Growth","Customer Experience Enhancement"],"internalStakeholders":["District Manager","HR Business Partner","Regional Operations Team","Loss Prevention"],"externalStakeholders":["Customers","Vendors","Local Community Organizations"],"achievements":["Increased store revenue by 18% year-over-year","Reduced employee turnover by 25%","Achieved top 10% ranking in district for customer satisfaction","Led successful holiday season with record-breaking sales"]},{"organizationName":"Target Corporation","role":"Assistant Store Manager","location":"St. Paul, MN","startDate":"2016-06-01","endDate":"2019-02-28","description":"Supported store manager in daily operations, focusing on merchandising, inventory control, and team development. Managed team of 30+ in-store fulfillment and sales associates.","technologies":[{"name":"Excel","type":"Core"},{"name":"Workday","type":"Peripheral"},{"name":"Square POS","type":"Core"}],"keySkills":["Team Leadership","Merchandising","Inventory Control","Training & Development","Problem Solving"],"competencies":["Operations Management","People Management","Process Optimization"],"projectTypes":["Operational Efficiency","Team Development","Inventory Management"],"internalStakeholders":["Store Manager","Department Supervisors","HR Team"],"externalStakeholders":["Customers","Delivery Partners"],"achievements":["Reduced inventory shrinkage by 15%","Implemented new onboarding program reducing training time by 20%","Promoted to Store Manager after 2.5 years"]},{"organizationName":"Best Buy","role":"Department Supervisor","location":"Bloomington, MN","startDate":"2014-01-15","endDate":"2016-05-31","description":"Supervised electronics department with team of 12 sales associates. Managed inventory, scheduling, and sales performance. Achieved top sales performance in region.","technologies":[{"name":"Excel","type":"Core"},{"name":"Retail Management Systems","type":"Core"}],"keySkills":["Sales Management","Team Leadership","Customer Service","Product Knowledge","Performance Coaching"],"competencies":["Team Leadership","Sales Strategy","Customer Experience Design"],"projectTypes":["Sales Growth","Team Development","Customer Experience Enhancement"],"internalStakeholders":["Assistant Store Manager","Other Department Supervisors","Sales Team"],"externalStakeholders":["Customers","Electronics Vendors"],"achievements":["Exceeded sales targets by average of 25% quarterly","Developed 3 team members who were promoted to leadership roles","Won 'Department of the Year' award 2015"]}],"stories":[{"title":"Crisis Management During System Outage","experienceIndex":0,"experienceName":"Store Manager - Target Corporation","situation":"Our store's POS system crashed during Black Friday with over 300 customers in the store and lines at every register.","task":"Maintain customer satisfaction, protect revenue, and keep my 85-person team calm during the crisis.","action":"Activated backup manual processing, assigned team roles, personally communicated with customers, set up dedicated issue station, and empowered team leads to make decisions.","result":"Processed $150K in manual transactions with zero errors, maintained 4.2/5 satisfaction score, received district commendation and three positive customer reviews.","competencies":["Crisis Management","Leadership","Customer Service","Problem Solving"],"createdAt":"2025-01-15T10:00:00.000Z","updatedAt":"2025-01-15T10:00:00.000Z"},{"title":"Leading Digital Transformation","experienceIndex":1,"experienceName":"Assistant Store Manager - Target Corporation","situation":"Corporate mandated new in-store fulfillment technology but team had limited tech experience and high resistance to change.","task":"Lead implementation, train 30+ associates, achieve 95% on-time pickup rate within 60 days.","action":"Created phased training program, identified champions, gathered daily feedback, created visual aids, tracked metrics daily, celebrated wins publicly.","result":"Achieved 97% rate in 45 days (beat target early), zero customer complaints, became model for 8 other stores, two champions promoted.","competencies":["Change Management","Training & Development","Project Management","Technology Adoption"],"createdAt":"2025-01-15T10:10:00.000Z","updatedAt":"2025-01-15T10:10:00.000Z"},{"title":"Reducing Employee Turnover Through Data","experienceIndex":2,"experienceName":"Department Supervisor - Best Buy","situation":"Electronics department had 45% annual turnover vs 32% store average, costing significant money in training and lost sales knowledge.","task":"Reduce turnover by 10+ percentage points within one year while maintaining sales performance.","action":"Analyzed exit interviews and team surveys, identified root causes (scheduling conflicts, lack of growth opportunities), implemented flexible scheduling system, created advancement paths with skills training, started monthly one-on-ones, launched peer mentorship program.","result":"Reduced turnover to 29% in 10 months (16 point improvement), saved approximately $50K in training costs, improved team engagement scores from 65% to 82%, promoted 3 team members to leadership roles, approach became model for other departments.","competencies":["Data Analysis","Process Improvement","People Management","Strategic Planning"],"createdAt":"2025-01-15T10:05:00.000Z","updatedAt":"2025-01-15T10:05:00.000Z"}]},
    'product-manager': {
        "userFirstName":"Sarah",
        "userLastName":"Chen",
        "userOccupation":"Senior Research Scientist",
        "userGoals":"Leverage analytical chemistry expertise to transition into data science and computational chemistry roles in pharmaceutical or biotech industries.",
        "goals": [
            {
                "title": "Complete Machine Learning Specialization and apply to pharmaceutical R&D",
                "targetDate": "2025-07-31",
                "category": "Skills Development",
                "milestones": ["Finish Coursera ML courses", "Build 2 pharma-focused ML projects", "Present at company tech talk"],
                "status": "In Progress",
                "progress": 60,
                "currentMilestone": "Build 2 pharma-focused ML projects",
                "completedMilestones": ["Finish Coursera ML courses"],
                "smart": {
                    "specific": "Complete Andrew Ng's Machine Learning Specialization (3 courses), build two pharmaceutical-focused ML projects (drug response prediction and molecular property prediction), present findings at Moderna's internal tech talk",
                    "measurable": "Complete all 3 courses with passing grades, build and document 2 ML models with >85% accuracy, deliver 30-minute presentation to 20+ attendees",
                    "achievable": "Leverage existing Python skills and chemistry domain knowledge, dedicate 6-8 hours weekly, use publicly available pharma datasets from ChEMBL and PubChem",
                    "relevant": "ML skills are increasingly essential for computational chemistry and data science roles in pharma, demonstrates initiative to expand beyond traditional analytical chemistry",
                    "timebound": "Complete by July 31, 2025 (7 months total: 3 months for courses, 3 months for projects, 1 month for presentation prep)"
                },
                "metrics": {
                    "coursesCompleted": 3,
                    "coursesTotal": 3,
                    "projectsCompleted": 1,
                    "projectsTotal": 2,
                    "presentationDate": "2025-07-15",
                    "modelAccuracy": 87
                }
            },
            {
                "title": "Publish computational chemistry paper in peer-reviewed journal",
                "targetDate": "2025-09-30",
                "category": "Research & Publications",
                "milestones": ["Complete data analysis", "Write manuscript", "Submit to journal", "Address reviewer comments"],
                "status": "In Progress",
                "progress": 55,
                "currentMilestone": "Write manuscript",
                "completedMilestones": ["Complete data analysis"],
                "smart": {
                    "specific": "Author and publish peer-reviewed paper on 'Machine Learning Approaches for HPLC Method Development in mRNA Analysis' in Journal of Pharmaceutical Sciences or similar Q1 journal",
                    "measurable": "Complete manuscript (5,000-7,000 words), submit to target journal, respond to peer review within 2 weeks, achieve acceptance for publication",
                    "achievable": "Leverage existing HPLC automation work and ML projects, collaborate with Moderna colleagues for co-authorship, allocate 10 hours weekly to writing",
                    "relevant": "Publications demonstrate thought leadership in computational chemistry, strengthen PhD credentials, significantly enhance competitiveness for data science roles in pharma",
                    "timebound": "Submit by June 30, achieve publication by September 30, 2025 (accounting for 8-12 week peer review cycle)"
                },
                "metrics": {
                    "manuscriptProgress": 65,
                    "wordsWritten": 3850,
                    "targetWords": 6000,
                    "coAuthors": 3,
                    "figuresCompleted": 4,
                    "figuresTotal": 6
                }
            },
            {
                "title": "Transition to Data Scientist or Computational Chemist role",
                "targetDate": "2026-03-31",
                "category": "Career Transition",
                "milestones": ["Network with 10 data scientists in pharma", "Apply to 30+ positions", "Get 3+ interviews", "Receive offer"],
                "status": "Not Started",
                "progress": 0,
                "currentMilestone": "Network with 10 data scientists in pharma",
                "completedMilestones": [],
                "smart": {
                    "specific": "Secure Senior Data Scientist or Computational Chemist position at pharmaceutical or biotech company (Pfizer, Moderna, BioNTech, Merck, Genentech) with minimum $140K salary, focusing on ML applications in drug discovery",
                    "measurable": "Network with 10+ data scientists through informational interviews, apply to 30+ relevant positions, achieve 10%+ interview rate, receive at least 2 competitive offers",
                    "achievable": "Leverage PhD, 8+ years pharma experience, ML specialization, published paper, strong Python portfolio, and internal Moderna network for referrals",
                    "relevant": "This is the culminating career goal that leverages all skill development and publication efforts, enabling transition from wet-lab analytical chemistry to computational roles with higher impact and compensation",
                    "timebound": "Begin networking September 2025, active job search January 2026, accept offer by March 31, 2026 (allows for 3-month search after publication)"
                },
                "metrics": {
                    "networkingMeetings": 0,
                    "networkingTarget": 10,
                    "applicationsSubmitted": 0,
                    "applicationsTarget": 30,
                    "interviewsScheduled": 0,
                    "interviewsTarget": 3,
                    "offersReceived": 0,
                    "linkedInConnections": 847
                }
            }
        ],
        "portfolio": [
            {
                "name": "Python HPLC Data Analysis Pipeline",
                "description": "Automated data processing pipeline for high-performance liquid chromatography (HPLC) data. Uses Python, pandas, and scikit-learn for peak detection, integration, and quality assessment. Processes 100+ samples per run with 98% accuracy.",
                "link": "https://github.com/sarahchen/hplc-analysis",
                "technologies": ["Python", "pandas", "scikit-learn", "NumPy", "matplotlib", "SciPy"],
                "skills": ["Data Processing", "Algorithm Development", "Scientific Computing", "Automation"],
                "competencies": ["Data Science", "Analytical Chemistry", "Software Development"]
            },
            {
                "name": "R Shiny Dashboard for Lab Metrics",
                "description": "Interactive dashboard built with R Shiny for real-time monitoring of laboratory performance metrics. Tracks instrument uptime, sample throughput, quality control results, and generates automated reports. Reduced manual reporting time by 10 hours/week.",
                "link": "https://github.com/sarahchen/lab-dashboard",
                "technologies": ["R", "Shiny", "ggplot2", "dplyr", "tidyverse", "plotly"],
                "skills": ["Data Visualization", "Dashboard Development", "Statistical Analysis", "Business Intelligence"],
                "competencies": ["Data Analytics", "Process Improvement", "Technical Communication"]
            }
        ],
        "jobOpportunities": [
            {
                "title": "Senior Data Scientist",
                "company": "Pfizer",
                "location": "Cambridge, MA",
                "url": "https://pfizer.wd1.myworkdayjobs.com",
                "status": "applied",
                "closeDate": "2025-02-20",
                "salary": "$140K-$170K",
                "notes": "Applied through internal referral from former colleague. Role focuses on predictive modeling for drug discovery.",
                "todos": [
                    {"id": 1, "task": "Prepare case study on pharma data analysis", "date": "2025-01-24", "completed": false},
                    {"id": 2, "task": "Review machine learning fundamentals", "date": "2025-01-23", "completed": true},
                    {"id": 3, "task": "Research Pfizer's AI/ML initiatives", "date": "2025-01-26", "completed": false}
                ],
                "skills": ["Python", "Machine Learning", "Statistical Analysis", "Data Visualization"],
                "competencies": ["Data Science", "Pharmaceutical Domain Knowledge", "Scientific Research"]
            },
            {
                "title": "Computational Chemist",
                "company": "Moderna",
                "location": "Cambridge, MA",
                "url": "https://modernatx.com/careers",
                "status": "interviewing",
                "closeDate": "2025-02-10",
                "salary": "$135K-$165K",
                "notes": "Internal opportunity. Hiring manager is familiar with my mRNA work. Technical interview scheduled for next week.",
                "todos": [
                    {"id": 1, "task": "Review molecular dynamics concepts", "date": "2025-01-21", "completed": true},
                    {"id": 2, "task": "Prepare presentation on HPLC automation project", "date": "2025-01-25", "completed": false},
                    {"id": 3, "task": "Practice Python coding exercises", "date": "2025-01-24", "completed": false},
                    {"id": 4, "task": "Send updated portfolio to hiring manager", "date": "2025-01-22", "completed": true}
                ],
                "skills": ["Python", "Molecular Modeling", "Data Analysis", "HPLC"],
                "competencies": ["Computational Chemistry", "Scientific Computing", "Drug Development"]
            },
            {
                "title": "Machine Learning Engineer - Drug Discovery",
                "company": "BioNTech",
                "location": "Mainz, Germany (Remote)",
                "url": "https://biontech.de/careers",
                "status": "interested",
                "closeDate": "2025-03-01",
                "salary": "€120K-€150K",
                "notes": "Exciting opportunity to apply ML to mRNA drug discovery. Remote-friendly with occasional travel to Germany.",
                "todos": [
                    {"id": 1, "task": "Complete deep learning specialization", "date": "2025-02-15", "completed": false},
                    {"id": 2, "task": "Build RNA structure prediction project", "date": "2025-02-28", "completed": false}
                ],
                "skills": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Bioinformatics"],
                "competencies": ["Machine Learning", "Drug Discovery", "Computational Biology"]
            },
            {
                "title": "Principal Data Analyst",
                "company": "Merck",
                "location": "Boston, MA",
                "url": "https://jobs.merck.com",
                "status": "interested",
                "closeDate": "2025-03-15",
                "salary": "$130K-$160K",
                "notes": "Hybrid analytical/computational role supporting clinical trials. Strong fit for my chemistry and data science background.",
                "todos": [
                    {"id": 1, "task": "Tailor resume for clinical trials experience", "date": "2025-02-05", "completed": false},
                    {"id": 2, "task": "Network with Merck data analysts on LinkedIn", "date": "2025-02-01", "completed": false}
                ],
                "skills": ["Statistical Analysis", "R", "Python", "Clinical Data", "Regulatory"],
                "competencies": ["Data Analysis", "Clinical Research", "Regulatory Affairs"]
            }
        ],
        "experiences":[{"organizationName":"Moderna Therapeutics","role":"Senior Research Scientist","location":"Cambridge, MA","startDate":"2020-09-01","endDate":"","description":"Lead analytical chemistry research for mRNA vaccine development. Design and execute complex analytical methods for quality control and process optimization. Collaborate with cross-functional teams on formulation development.","technologies":[{"name":"HPLC","type":"Core"},{"name":"Mass Spectrometry","type":"Core"},{"name":"Python","type":"Peripheral"},{"name":"R","type":"Peripheral"},{"name":"ChemDraw","type":"Core"},{"name":"LabVIEW","type":"Peripheral"},{"name":"JMP Statistical Software","type":"Core"},{"name":"Electronic Lab Notebook","type":"Core"},{"name":"MATLAB","type":"Peripheral"}],"keySkills":["Analytical Method Development","Data Analysis","Technical Writing","Problem Solving","Cross-Functional Collaboration","Quality Control","Statistical Analysis"],"competencies":["Scientific Research","Data Analytics","Technical Leadership","Regulatory Compliance","Project Management"],"projectTypes":["Research & Development","Method Validation","Process Optimization","Regulatory Submission"],"internalStakeholders":["Process Development Team","Quality Assurance","Regulatory Affairs","Manufacturing Operations","R&D Leadership"],"externalStakeholders":["FDA Reviewers","Equipment Vendors","Contract Research Organizations","Academic Collaborators"],"achievements":["Developed novel analytical method reducing testing time by 40%","Authored 6 peer-reviewed publications","Led successful FDA submission with zero deficiencies","Mentored 4 junior scientists","Received Moderna Innovation Award 2022"]},{"organizationName":"Pfizer Inc.","role":"Research Scientist","location":"Groton, CT","startDate":"2017-07-01","endDate":"2020-08-31","description":"Conducted analytical chemistry research supporting small molecule drug discovery. Developed and validated analytical methods for compound characterization. Collaborated with medicinal chemistry and biology teams.","technologies":[{"name":"HPLC","type":"Core"},{"name":"Mass Spectrometry","type":"Core"},{"name":"NMR Spectroscopy","type":"Core"},{"name":"ChemDraw","type":"Core"},{"name":"JMP Statistical Software","type":"Peripheral"},{"name":"Electronic Lab Notebook","type":"Core"}],"keySkills":["Analytical Chemistry","Method Development","Data Interpretation","Technical Documentation","Collaboration","Spectroscopy"],"competencies":["Scientific Research","Analytical Problem Solving","Technical Communication","Quality Systems"],"projectTypes":["Research & Development","Method Development","Compound Characterization"],"internalStakeholders":["Medicinal Chemistry Team","Biology Team","DMPK Group","Quality Control"],"externalStakeholders":["CROs","Equipment Vendors","Academic Partners"],"achievements":["Developed 15+ analytical methods for drug discovery compounds","Co-authored 4 scientific publications","Trained 8 new team members on analytical instrumentation","Contributed to 2 IND submissions"]},{"organizationName":"University of Connecticut","role":"Postdoctoral Research Associate","location":"Storrs, CT","startDate":"2015-08-01","endDate":"2017-06-30","description":"Conducted independent research in analytical chemistry. Developed novel mass spectrometry methods for metabolomics research. Mentored graduate and undergraduate students.","technologies":[{"name":"Mass Spectrometry","type":"Core"},{"name":"HPLC","type":"Core"},{"name":"R","type":"Peripheral"},{"name":"Python","type":"Peripheral"},{"name":"Origin","type":"Core"},{"name":"ChemDraw","type":"Core"}],"keySkills":["Research Design","Data Analysis","Scientific Writing","Grant Writing","Mentoring","Instrumentation"],"competencies":["Scientific Research","Independent Research","Technical Leadership","Academic Writing"],"projectTypes":["Research","Method Development","Publication"],"internalStakeholders":["Principal Investigator","Graduate Students","Department Faculty","Core Facility Staff"],"externalStakeholders":["Funding Agencies","Journal Editors","Scientific Community"],"achievements":["Published 5 first-author papers in high-impact journals","Secured $50K in independent research funding","Presented research at 3 international conferences","Mentored 6 students"]},{"organizationName":"University of California, Berkeley","role":"PhD Candidate","location":"Berkeley, CA","startDate":"2010-09-01","endDate":"2015-07-31","description":"Doctoral research in analytical chemistry focusing on mass spectrometry method development. Taught undergraduate chemistry labs and mentored undergraduates.","technologies":[{"name":"Mass Spectrometry","type":"Core"},{"name":"HPLC","type":"Core"},{"name":"MATLAB","type":"Peripheral"},{"name":"Origin","type":"Core"},{"name":"ChemDraw","type":"Core"}],"keySkills":["Research","Data Analysis","Scientific Writing","Teaching","Experimental Design"],"competencies":["Scientific Research","Critical Thinking","Technical Communication","Teaching"],"projectTypes":["Research","Teaching","Publication"],"internalStakeholders":["Thesis Advisor","Thesis Committee","Lab Members","Undergraduate Students"],"externalStakeholders":["Scientific Community","Funding Agencies"],"achievements":["Published 8 peer-reviewed papers","Received NSF Graduate Research Fellowship","Won best poster award at ACS National Meeting","Graduated with distinction"]}],"stories":[{"title":"FDA Submission with Zero Deficiencies","experienceIndex":0,"experienceName":"Senior Research Scientist - Moderna Therapeutics","situation":"Company needed to submit critical analytical data package for mRNA vaccine to FDA with extremely tight timeline during pandemic.","task":"Lead analytical characterization and compile comprehensive data package meeting all regulatory requirements within 6 weeks.","action":"Assembled cross-functional team, created detailed project plan, ran validation studies in parallel, implemented rigorous quality checks, coordinated with regulatory affairs, worked extended hours to meet deadline.","result":"Submitted complete package on time with zero deficiencies noted by FDA, contributing to accelerated approval. Received Innovation Award and became go-to person for regulatory submissions.","competencies":["Project Management","Regulatory Compliance","Technical Leadership","Attention to Detail"],"createdAt":"2025-01-15T10:00:00.000Z","updatedAt":"2025-01-15T10:00:00.000Z"},{"title":"Novel Method Reducing Testing Time 40%","experienceIndex":1,"experienceName":"Research Scientist - Pfizer Inc.","situation":"Standard HPLC method for small molecule purity testing took 45 minutes per sample, creating bottleneck in drug discovery workflow with 50+ daily samples.","task":"Develop faster analytical method without compromising data quality or regulatory requirements.","action":"Researched ultra-performance chromatography, designed new method using shorter column and optimized gradient, validated against existing method with 50+ test compounds, demonstrated equivalent performance with statistical analysis, trained discovery chemistry team.","result":"Reduced testing time to 27 minutes (40% improvement), increased daily throughput by 67%, maintained method robustness, published method in peer-reviewed journal with 200+ citations, approach adopted across Pfizer research sites.","competencies":["Innovation","Analytical Problem Solving","Technical Expertise","Process Optimization"],"createdAt":"2025-01-15T10:05:00.000Z","updatedAt":"2025-01-15T10:05:00.000Z"},{"title":"Mentoring Graduate Student to First Publication","experienceIndex":2,"experienceName":"Postdoctoral Research Associate - University of Connecticut","situation":"First-year graduate student struggled with mass spectrometry techniques and data interpretation, lacking confidence and risking dropping out of the program.","task":"Mentor student to proficiency and guide them to their first publication while managing my own research timeline.","action":"Created structured learning plan with weekly goals, scheduled regular coaching sessions, provided hands-on training on instrumentation, taught data analysis in R and Python, encouraged questions and independent thinking, gave progressively challenging projects, provided detailed feedback on writing, advocated for their work at lab meetings.","result":"Student became proficient in 5 months vs typical 10-12 months, contributed key results to collaborative study, gained confidence to present at departmental seminar, co-authored first-author publication in high-impact journal, continued to PhD with strong foundation. I was recognized with department mentorship award.","competencies":["Mentoring","Patience","Technical Communication","Leadership"],"createdAt":"2025-01-15T10:10:00.000Z","updatedAt":"2025-01-15T10:10:00.000Z"}]},
    'new-graduate': {
        "userFirstName":"Jamie",
        "userLastName":"Rodriguez",
        "userOccupation":"Software Engineering Intern",
        "userGoals":"Launch career in software development or cloud engineering, building practical skills while contributing to meaningful projects.",
        "goals": [
            {
                "title": "Land first full-time Software Engineer role at tech company",
                "targetDate": "2025-05-31",
                "category": "Career Launch",
                "milestones": ["Apply to 100+ positions", "Get 10+ interviews", "Receive 2+ offers", "Accept position"],
                "status": "In Progress",
                "progress": 35,
                "currentMilestone": "Get 10+ interviews",
                "completedMilestones": ["Apply to 100+ positions"],
                "smart": {
                    "specific": "Secure full-time Software Engineer or Cloud Engineer position at technology company (Google, Microsoft, AWS, Shopify, or similar) with minimum $100K salary, offering mentorship, growth opportunities, and modern tech stack",
                    "measurable": "Apply to 100+ relevant positions, achieve 10%+ interview conversion rate, receive at least 2 competitive offers with written compensation details, compare total compensation packages",
                    "achievable": "Leverage CS degree (3.7 GPA), internship experience, portfolio projects, open-source contributions, campus recruiting connections, and active job search during graduation semester",
                    "relevant": "First full-time role establishes career foundation and trajectory, provides income stability, offers structured learning environment for new graduate transitioning from academic to professional software development",
                    "timebound": "Accept offer by May 31, 2025 (before graduation), ideally start June/July 2025, application period January-April 2025"
                },
                "metrics": {
                    "applicationsSubmitted": 112,
                    "applicationsTarget": 100,
                    "phoneScreens": 14,
                    "technicalInterviews": 6,
                    "onsiteInterviews": 2,
                    "offersReceived": 0,
                    "targetOffers": 2
                }
            },
            {
                "title": "Contribute to open-source project and build network",
                "targetDate": "2025-04-30",
                "category": "Professional Development",
                "milestones": ["Identify project", "Make 10+ contributions", "Connect with 5 maintainers", "Present at meetup"],
                "status": "In Progress",
                "progress": 70,
                "currentMilestone": "Present at meetup",
                "completedMilestones": ["Identify project", "Make 10+ contributions", "Connect with 5 maintainers"],
                "smart": {
                    "specific": "Contribute 10+ meaningful code commits to React or ROS open-source project, build relationships with 5 project maintainers, present 'Getting Started with Open Source' talk at Austin Python/JavaScript meetup",
                    "measurable": "Track GitHub contributions (issues, PRs, code reviews), document merged pull requests, schedule 5 virtual coffee chats with maintainers, deliver 20-minute presentation to 30+ attendees",
                    "achievable": "Leverage existing React and ROS experience from portfolio projects, dedicate 5-8 hours weekly to OSS, attend local meetups monthly, join project Slack/Discord communities",
                    "relevant": "OSS contributions demonstrate real-world collaboration skills, build public technical profile, provide talking points for interviews, expand professional network beyond campus, establish online presence",
                    "timebound": "Complete by April 30, 2025 (before graduation): contributions by March 31, networking ongoing, presentation in April"
                },
                "metrics": {
                    "contributionsCompleted": 13,
                    "contributionsTarget": 10,
                    "pullRequestsMerged": 8,
                    "issuesClosed": 5,
                    "maintainerConnections": 5,
                    "meetupPresentation": null,
                    "githubStars": 47
                }
            },
            {
                "title": "Learn cloud architecture and earn AWS Solutions Architect certification",
                "targetDate": "2025-08-31",
                "category": "Skills Development",
                "milestones": ["Complete AWS training", "Build 3 cloud projects", "Pass certification exam"],
                "status": "Not Started",
                "progress": 0,
                "currentMilestone": "Complete AWS training",
                "completedMilestones": [],
                "smart": {
                    "specific": "Earn AWS Certified Solutions Architect - Associate certification (SAA-C03), complete AWS training through A Cloud Guru or AWS SkillBuilder, build three production-grade cloud projects (serverless API, containerized app, infrastructure-as-code deployment)",
                    "measurable": "Complete 40+ hours AWS training courses, pass practice exams with 80%+ scores, build and document 3 cloud projects with CI/CD pipelines, pass certification exam with 720+ score",
                    "achievable": "Leverage software engineering fundamentals and Docker experience, use AWS free tier for practice, dedicate 10 hours weekly post-graduation with full-time job income for certification costs ($150)",
                    "relevant": "Cloud skills are essential for modern software engineering roles, AWS certification significantly increases marketability and salary potential, aligns with interest in Cloud Engineer career path",
                    "timebound": "Complete by August 31, 2025 (3 months post-graduation): training by June 30, projects by July 31, certification by August 31"
                },
                "metrics": {
                    "trainingHoursCompleted": 0,
                    "trainingHoursTarget": 40,
                    "practiceExamScore": 0,
                    "projectsCompleted": 0,
                    "projectsTarget": 3,
                    "certificationScheduled": false,
                    "awsServicesUsed": 0
                }
            }
        ],
        "portfolio": [
            {
                "name": "E-Commerce Web Application (MERN Stack)",
                "description": "Full-stack e-commerce platform with product catalog, shopping cart, user authentication, payment processing (Stripe), and admin dashboard. Built with React, Node.js, Express, and MongoDB. Deployed on AWS with CI/CD pipeline.",
                "link": "https://github.com/jrodriguez/ecommerce-platform",
                "technologies": ["React", "Node.js", "Express", "MongoDB", "Stripe API", "AWS", "Docker", "Git"],
                "skills": ["Full Stack Development", "API Design", "Database Design", "Authentication", "Payment Integration"],
                "competencies": ["Software Engineering", "Web Development", "Cloud Deployment"]
            },
            {
                "name": "RoboCup Autonomous Robot Navigation System",
                "description": "Computer vision and autonomous navigation system for RoboCup competition robot. Implemented using Python, ROS, and OpenCV. Features real-time object detection, path planning, and obstacle avoidance. Led team to 3rd place finish.",
                "link": "https://github.com/ut-robotics/robocup-2024",
                "technologies": ["Python", "ROS", "OpenCV", "Linux", "C++", "Git"],
                "skills": ["Computer Vision", "Robotics", "Algorithm Development", "Team Leadership", "Systems Integration"],
                "competencies": ["Technical Leadership", "Problem Solving", "Project Management"]
            }
        ],
        "jobOpportunities": [
            {
                "title": "Junior Software Engineer",
                "company": "Google",
                "location": "Austin, TX",
                "url": "https://careers.google.com",
                "status": "applied",
                "closeDate": "2025-02-15",
                "salary": "$110K-$135K",
                "notes": "Applied through campus recruiting. Resume passed initial screening. Waiting for response on coding challenge.",
                "todos": [
                    {"id": 1, "task": "Practice LeetCode medium problems", "date": "2025-01-24", "completed": false},
                    {"id": 2, "task": "Review system design basics", "date": "2025-01-26", "completed": false},
                    {"id": 3, "task": "Prepare questions about Google's culture", "date": "2025-01-25", "completed": false}
                ],
                "skills": ["Python", "Java", "Data Structures", "Algorithms", "System Design"],
                "competencies": ["Software Engineering", "Problem Solving", "Computer Science Fundamentals"]
            },
            {
                "title": "Software Developer",
                "company": "Microsoft",
                "location": "Redmond, WA",
                "url": "https://careers.microsoft.com",
                "status": "interviewing",
                "closeDate": "2025-02-28",
                "salary": "$105K-$130K",
                "notes": "Completed phone screen. Scheduled for virtual onsite (4 rounds) next week. Excited about Azure team opportunity.",
                "todos": [
                    {"id": 1, "task": "Study Azure services overview", "date": "2025-01-23", "completed": true},
                    {"id": 2, "task": "Practice coding in VS Code environment", "date": "2025-01-25", "completed": false},
                    {"id": 3, "task": "Prepare behavioral stories using STAR", "date": "2025-01-24", "completed": false},
                    {"id": 4, "task": "Research interviewers on LinkedIn", "date": "2025-01-26", "completed": false}
                ],
                "skills": ["C#", ".NET", "Azure", "JavaScript", "SQL"],
                "competencies": ["Software Development", "Cloud Computing", "Web Development"]
            },
            {
                "title": "Cloud Engineer - Entry Level",
                "company": "Amazon Web Services",
                "location": "Seattle, WA",
                "url": "https://amazon.jobs",
                "status": "interested",
                "closeDate": "2025-03-15",
                "salary": "$100K-$125K",
                "notes": "Dream role working directly on AWS services. Requires strong systems knowledge and some cloud experience. Need to build cloud portfolio projects.",
                "todos": [
                    {"id": 1, "task": "Complete AWS Cloud Practitioner certification", "date": "2025-02-15", "completed": false},
                    {"id": 2, "task": "Build serverless application on AWS", "date": "2025-02-28", "completed": false},
                    {"id": 3, "task": "Network with AWS engineers at meetup", "date": "2025-02-10", "completed": false}
                ],
                "skills": ["AWS", "Python", "Linux", "Networking", "Distributed Systems"],
                "competencies": ["Cloud Computing", "Systems Engineering", "DevOps"]
            },
            {
                "title": "Full Stack Developer",
                "company": "Shopify",
                "location": "Remote",
                "url": "https://shopify.com/careers",
                "status": "interested",
                "closeDate": "2025-03-31",
                "salary": "$95K-$120K",
                "notes": "Remote-first company with great culture. Role focuses on Ruby/React stack. Would be great experience with e-commerce at scale.",
                "todos": [
                    {"id": 1, "task": "Learn Ruby and Rails fundamentals", "date": "2025-02-20", "completed": false},
                    {"id": 2, "task": "Contribute to Shopify open source projects", "date": "2025-02-28", "completed": false},
                    {"id": 3, "task": "Build e-commerce feature showcase", "date": "2025-03-10", "completed": false}
                ],
                "skills": ["Ruby", "Rails", "React", "JavaScript", "PostgreSQL"],
                "competencies": ["Full Stack Development", "E-Commerce", "Web Development"]
            }
        ],
        "experiences":[{"organizationName":"TechStart Accelerator","role":"Software Engineering Intern","location":"Austin, TX","startDate":"2024-06-01","endDate":"2024-08-31","description":"Summer internship building full-stack web applications for startup clients. Worked on team of 4 interns developing React-based customer portal with Node.js backend. Participated in agile development process.","technologies":[{"name":"React","type":"Core"},{"name":"Node.js","type":"Core"},{"name":"JavaScript","type":"Core"},{"name":"Git","type":"Core"},{"name":"PostgreSQL","type":"Peripheral"},{"name":"Docker","type":"Peripheral"},{"name":"AWS","type":"Peripheral"},{"name":"Jira","type":"Peripheral"}],"keySkills":["Web Development","Problem Solving","Collaboration","Code Review","Debugging","API Development"],"competencies":["Software Development","Agile Methodology","Technical Communication","Learning Agility"],"projectTypes":["Agile","Web Application Development","API Development"],"internalStakeholders":["Engineering Manager","Senior Developers","Product Manager","Other Interns"],"externalStakeholders":["Startup Clients","End Users"],"achievements":["Delivered 3 major features ahead of schedule","Reduced page load time by 30% through optimization","Received offer for full-time position post-graduation","Presented final project to company leadership"]},{"organizationName":"University of Texas at Austin","role":"Computer Science Teaching Assistant","location":"Austin, TX","startDate":"2023-08-01","endDate":"2024-05-31","description":"Teaching assistant for Introduction to Programming (CS50). Held weekly office hours, graded assignments, and mentored 25 students. Created supplemental learning materials.","technologies":[{"name":"Python","type":"Core"},{"name":"Java","type":"Core"},{"name":"Git","type":"Core"},{"name":"Linux","type":"Peripheral"}],"keySkills":["Teaching","Communication","Mentoring","Problem Solving","Patience","Code Review"],"competencies":["Technical Communication","Mentoring","Knowledge Transfer","Empathy"],"projectTypes":["Teaching","Content Development","Student Support"],"internalStakeholders":["Course Professor","Other TAs","CS Department Staff"],"externalStakeholders":["Students"],"achievements":["Maintained 4.8/5.0 student satisfaction rating","Created 10+ tutorial videos with 500+ views","Helped 5 students improve from D to B grades","Nominated for Outstanding TA Award"]},{"organizationName":"UT Austin Robotics Club","role":"Software Team Lead","location":"Austin, TX","startDate":"2022-09-01","endDate":"2024-05-31","description":"Led team of 8 students developing autonomous robot for RoboCup competition. Designed computer vision and navigation systems. Coordinated with hardware and design teams.","technologies":[{"name":"Python","type":"Core"},{"name":"ROS","type":"Core"},{"name":"OpenCV","type":"Core"},{"name":"Git","type":"Core"},{"name":"Linux","type":"Core"},{"name":"C++","type":"Peripheral"},{"name":"MATLAB","type":"Peripheral"}],"keySkills":["Team Leadership","Project Management","Computer Vision","Robotics","Problem Solving","Collaboration"],"competencies":["Technical Leadership","Project Management","Systems Integration","Team Collaboration"],"projectTypes":["Robotics","Competition","Team Project"],"internalStakeholders":["Club President","Hardware Team","Mechanical Team","Faculty Advisor"],"externalStakeholders":["RoboCup Competition Organizers","Corporate Sponsors"],"achievements":["Led team to 3rd place finish at RoboCup 2024","Secured $5000 in corporate sponsorship","Grew software team from 3 to 8 members","Published technical writeup with 1000+ downloads"]},{"organizationName":"Local Coffee Shop","role":"Barista","location":"Austin, TX","startDate":"2021-06-01","endDate":"2023-08-31","description":"Part-time barista while attending university. Provided excellent customer service, managed cash register, opened and closed shop. Trained new employees.","technologies":[{"name":"Square POS","type":"Core"},{"name":"Excel","type":"Peripheral"}],"keySkills":["Customer Service","Communication","Time Management","Multitasking","Training","Reliability"],"competencies":["Customer Service","Work Ethic","Adaptability","Interpersonal Skills"],"projectTypes":["Customer Service","Operations"],"internalStakeholders":["Shop Manager","Co-workers"],"externalStakeholders":["Customers"],"achievements":["Employee of the Month 3 times","Trained 7 new baristas","Maintained 4.9/5 customer rating","Managed peak hours independently"]},{"organizationName":"University of Texas at Austin","role":"Bachelor of Science in Computer Science","location":"Austin, TX","startDate":"2020-08-01","endDate":"2024-05-31","description":"Graduated with honors, GPA 3.7/4.0. Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems, Computer Networks, Machine Learning, Cloud Computing.","technologies":[{"name":"Python","type":"Core"},{"name":"Java","type":"Core"},{"name":"C++","type":"Peripheral"},{"name":"JavaScript","type":"Core"},{"name":"SQL","type":"Core"},{"name":"Git","type":"Core"},{"name":"Linux","type":"Core"}],"keySkills":["Programming","Algorithm Design","Data Structures","Problem Solving","Research","Academic Writing"],"competencies":["Computer Science Fundamentals","Critical Thinking","Learning Agility","Academic Excellence"],"projectTypes":["Academic Projects","Research","Coursework"],"internalStakeholders":["Professors","Classmates","Academic Advisors"],"externalStakeholders":[],"achievements":["Graduated with Honors (3.7 GPA)","Dean's List 6 semesters","Completed 5 major course projects","Member of Upsilon Pi Epsilon (CS Honor Society)"]}],"stories":[{"title":"Optimizing Application Performance","experienceIndex":0,"experienceName":"Software Engineering Intern - TechStart Accelerator","situation":"Customer portal had 8-second page load times causing user complaints and increased bounce rate.","task":"Investigate performance issues and implement optimizations to improve user experience.","action":"Used browser dev tools to profile performance, identified unnecessary API calls and unoptimized images, implemented lazy loading, added caching, optimized database queries, reduced bundle size with code splitting.","result":"Reduced page load time to 2.8 seconds (65% improvement), decreased bounce rate by 40%, received praise from client, techniques adopted as team standards.","competencies":["Problem Solving","Performance Optimization","Technical Analysis","Initiative"],"createdAt":"2025-01-15T10:00:00.000Z","updatedAt":"2025-01-15T10:00:00.000Z"},{"title":"Leading Team to RoboCup 3rd Place","experienceIndex":2,"experienceName":"Software Team Lead - UT Austin Robotics Club","situation":"Team had never placed in top 5 at RoboCup and struggled with coordination between hardware and software.","task":"Lead software development and coordinate with other teams to achieve competitive performance.","action":"Implemented agile methodology with weekly sprints, created shared documentation system, established integration testing schedule, organized joint meetings with hardware team, mentored new members, managed project timeline.","result":"Achieved 3rd place finish (team's best ever), all software modules delivered on time, grew team from 3 to 8 members, published technical writeup downloaded 1000+ times, secured $5K in sponsorship.","competencies":["Technical Leadership","Project Management","Team Collaboration","Systems Integration"],"createdAt":"2025-01-15T10:05:00.000Z","updatedAt":"2025-01-15T10:05:00.000Z"},{"title":"Helping Struggling Students Succeed","experienceIndex":1,"experienceName":"Computer Science Teaching Assistant - UT Austin","situation":"Five students in my section were failing mid-semester with D grades, risking dropping the course.","task":"Help these students improve their understanding and grades while maintaining fairness to all students.","action":"Scheduled individual meetings to understand their challenges, created personalized study plans, held extra office hours, connected them with peer study groups, provided additional practice problems, broke down complex concepts into simpler explanations.","result":"All five students improved to B grades by end of semester, received thank-you emails from students and parents, nominated for Outstanding TA Award, created supplemental materials now used by other TAs.","competencies":["Mentoring","Patience","Communication","Empathy","Problem Solving"],"createdAt":"2025-01-15T10:10:00.000Z","updatedAt":"2025-01-15T10:10:00.000Z"}]}
};


// Subscription tier configuration
const subscriptionTiers = {
    'member': {
        level: 0,
        availableNodes: ['Career Experience', 'Interview Prep'],
        availableFeatures: []  // Technical tab NOT available for members
    },
    'learner': {
        level: 1,
        availableNodes: ['Career Experience', 'Interview Prep', 'Goals', 'Portfolio'],
        availableFeatures: []  // Technical tab NOT available for learners
    },
    'seeker': {
        level: 2,
        availableNodes: ['Career Experience', 'Interview Prep', 'Goals', 'Portfolio', 'Job Opportunities'],
        availableFeatures: ['Technical']  // Technical tab only available for seekers
    }
};

// Persona data for D3 mindmap structure
const personaData = {
    'default': {
        name: 'User',
        goal: '',
        children: [
            { name: 'Job Opportunities', tier: 'seeker', count: 0, children: [] },
            { name: 'Career Experience', tier: 'member', count: 0, children: [] },
            { name: 'Goals', tier: 'learner', count: 0, children: [] },
            { name: 'Portfolio', tier: 'learner', count: 0, children: [] },
            { name: 'Interview Prep', tier: 'member', count: 0, children: [] }
        ]
    },
    'career-changer': {
        name: 'Marcus Thompson',
        goal: 'Store Manager → Analytics',
        children: [
            { name: 'Job Opportunities', tier: 'seeker', count: 0, children: [] },
            { name: 'Career Experience', tier: 'member', count: 0, children: [] },
            { name: 'Goals', tier: 'learner', count: 0, children: [] },
            { name: 'Portfolio', tier: 'learner', count: 0, children: [] },
            { name: 'Interview Prep', tier: 'member', count: 0, children: [] }
        ]
    },
    'product-manager': {
        name: 'Dr. Sarah Chen',
        goal: 'Research Scientist → Data Science',
        children: [
            { name: 'Job Opportunities', tier: 'seeker', count: 0, children: [] },
            { name: 'Career Experience', tier: 'member', count: 0, children: [] },
            { name: 'Goals', tier: 'learner', count: 0, children: [] },
            { name: 'Portfolio', tier: 'learner', count: 0, children: [] },
            { name: 'Interview Prep', tier: 'member', count: 0, children: [] }
        ]
    },
    'new-graduate': {
        name: 'Jamie Rodriguez',
        goal: 'CS Graduate → Software Engineering',
        children: [
            { name: 'Job Opportunities', tier: 'seeker', count: 0, children: [] },
            { name: 'Career Experience', tier: 'member', count: 0, children: [] },
            { name: 'Goals', tier: 'learner', count: 0, children: [] },
            { name: 'Portfolio', tier: 'learner', count: 0, children: [] },
            { name: 'Interview Prep', tier: 'member', count: 0, children: [] }
        ]
    }
};

// Example goals data with realistic current levels and improvement areas per persona
const exampleGoalsData = {
    'retail-manager': {
        improvementGoals: ['Python Programming', 'Power BI Advanced Features', 'SQL Query Optimization'],
        skills: [
            { name: 'Excel', currentLevel: 4, desiredLevel: 5 },
            { name: 'Power BI', currentLevel: 2, desiredLevel: 4 },
            { name: 'SQL', currentLevel: 2, desiredLevel: 4 },
            { name: 'Python', currentLevel: 1, desiredLevel: 3 },
            { name: 'Data Analysis', currentLevel: 3, desiredLevel: 4 }
        ],
        competencies: [
            { name: 'Leadership', currentLevel: 4, desiredLevel: 4 },
            { name: 'Operations Management', currentLevel: 4, desiredLevel: 5 },
            { name: 'Problem Solving', currentLevel: 3, desiredLevel: 4 },
            { name: 'Communication', currentLevel: 4, desiredLevel: 4 },
            { name: 'Strategic Thinking', currentLevel: 2, desiredLevel: 4 }
        ]
    },
    'field-engineer': {
        improvementGoals: ['Azure Cloud Architecture', 'Kubernetes', 'Infrastructure as Code'],
        skills: [
            { name: 'Networking', currentLevel: 4, desiredLevel: 5 },
            { name: 'Windows Server', currentLevel: 4, desiredLevel: 4 },
            { name: 'Active Directory', currentLevel: 4, desiredLevel: 4 },
            { name: 'Azure', currentLevel: 2, desiredLevel: 4 },
            { name: 'PowerShell', currentLevel: 3, desiredLevel: 4 },
            { name: 'Kubernetes', currentLevel: 1, desiredLevel: 3 },
            { name: 'Terraform', currentLevel: 1, desiredLevel: 3 }
        ],
        competencies: [
            { name: 'Technical Troubleshooting', currentLevel: 4, desiredLevel: 5 },
            { name: 'Customer Service', currentLevel: 4, desiredLevel: 4 },
            { name: 'Documentation', currentLevel: 3, desiredLevel: 4 },
            { name: 'Project Management', currentLevel: 2, desiredLevel: 3 },
            { name: 'Cloud Architecture', currentLevel: 2, desiredLevel: 4 }
        ]
    },
    'business-analyst': {
        improvementGoals: ['Machine Learning Fundamentals', 'Advanced Python', 'Data Engineering'],
        skills: [
            { name: 'SQL', currentLevel: 4, desiredLevel: 5 },
            { name: 'Excel', currentLevel: 4, desiredLevel: 4 },
            { name: 'Tableau', currentLevel: 3, desiredLevel: 4 },
            { name: 'Python', currentLevel: 2, desiredLevel: 4 },
            { name: 'R', currentLevel: 2, desiredLevel: 3 },
            { name: 'Machine Learning', currentLevel: 1, desiredLevel: 3 },
            { name: 'Data Engineering', currentLevel: 1, desiredLevel: 3 }
        ],
        competencies: [
            { name: 'Data Analysis', currentLevel: 4, desiredLevel: 5 },
            { name: 'Business Acumen', currentLevel: 4, desiredLevel: 4 },
            { name: 'Communication', currentLevel: 4, desiredLevel: 4 },
            { name: 'Statistical Analysis', currentLevel: 3, desiredLevel: 4 },
            { name: 'Stakeholder Management', currentLevel: 3, desiredLevel: 4 }
        ]
    },
    'devops-engineer': {
        improvementGoals: ['Security Best Practices', 'Cost Optimization', 'SRE Practices'],
        skills: [
            { name: 'Docker', currentLevel: 4, desiredLevel: 5 },
            { name: 'Kubernetes', currentLevel: 4, desiredLevel: 5 },
            { name: 'Terraform', currentLevel: 4, desiredLevel: 4 },
            { name: 'AWS', currentLevel: 3, desiredLevel: 4 },
            { name: 'Python', currentLevel: 3, desiredLevel: 4 },
            { name: 'Security', currentLevel: 2, desiredLevel: 4 },
            { name: 'Cost Optimization', currentLevel: 2, desiredLevel: 4 }
        ],
        competencies: [
            { name: 'Automation', currentLevel: 4, desiredLevel: 5 },
            { name: 'System Design', currentLevel: 4, desiredLevel: 4 },
            { name: 'Troubleshooting', currentLevel: 4, desiredLevel: 5 },
            { name: 'Collaboration', currentLevel: 3, desiredLevel: 4 },
            { name: 'Site Reliability', currentLevel: 3, desiredLevel: 4 }
        ]
    }
};
