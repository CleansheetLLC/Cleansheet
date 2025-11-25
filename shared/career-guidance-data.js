/**
 * Career Guidance Data - Extracted from career-canvas.html
 *
 * Contains comprehensive career progression data including:
 * - 9 career paths with multi-year progression (1-7 years)
 * - Job titles, skills, certifications, portfolio projects, compensation
 * - Career transition network (lateral moves, specializations, management tracks)
 * - Role translator (maps roles across 8 industry sectors)
 * - Extension points for future enhancements
 *
 * Used by: career-canvas.html (AI Assistant context), career-paths.html, role-translator.html
 */

function getCareerGuidanceData() {
    return {
        version: "1.0",
        lastUpdated: "2025-11-17",
        dataSource: "Extracted from Career Path Navigator and Role Translator tools",

        careerPaths: {
            "Citizen Developer": [
                {
                    year: 1,
                    jobTitles: ["Business Analyst", "Process Improvement Specialist", "Citizen Developer", "Digital Solutions Coordinator"],
                    skills: "Low-Code/No-Code Platform Mastery, Business Process & Data, Basic Technical Literacy",
                    certifications: ["Microsoft Power Platform Fundamentals (PL-900)", "Google AppSheet Associate Developer", "Airtable Core Certification", "Zapier Automation Expert"],
                    portfolioProjects: ["Employee onboarding app", "Automated expense reporting system", "Customer feedback dashboard", "Inventory tracking system"],
                    compensation: { hourlyMin: 35, hourlyMax: 55, annualMin: 72800, annualMax: 114400, currency: "USD", region: "US-National" }
                },
                {
                    year: 2,
                    jobTitles: ["Senior Business Analyst", "Digital Innovation Specialist", "Citizen Developer Lead", "Process Automation Manager"],
                    skills: "Advanced Platform Development, Business Intelligence & Analytics, Enterprise Integration & Governance",
                    certifications: ["Microsoft Power Platform App Maker Associate (PL-100)", "Microsoft Power BI Data Analyst Associate (PL-300)", "Salesforce Platform App Builder", "ServiceNow Certified Application Developer"],
                    portfolioProjects: ["Enterprise-wide automation platform", "Advanced Power BI analytics suite", "Salesforce customization", "Multi-platform integration"],
                    compensation: { hourlyMin: 55, hourlyMax: 85, annualMin: 114400, annualMax: 176800, currency: "USD", region: "US-National" }
                }
            ],
            "Cloud Computing": [
                {
                    year: 1,
                    jobTitles: ["Cloud Associate", "Junior Cloud Developer", "Cloud Support Specialist", "Technical Account Manager Associate"],
                    skills: "Core Cloud Services, Development & Scripting, Cloud Architecture Basics",
                    certifications: ["AWS Certified Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)", "Google Cloud Digital Leader", "CompTIA Cloud Essentials+"],
                    portfolioProjects: ["Multi-cloud personal lab", "Python automation scripts", "Simple web applications", "Cost optimization analysis"],
                    compensation: { hourlyMin: 22, hourlyMax: 35, annualMin: 45760, annualMax: 72800, currency: "USD", region: "US-National" }
                },
                {
                    year: 2,
                    jobTitles: ["Cloud Developer", "Solutions Developer", "Cloud Application Engineer", "Platform Developer"],
                    skills: "Cloud-Native Development, Data & Analytics, DevOps & Automation",
                    certifications: ["AWS Certified Developer - Associate", "Microsoft Azure Developer Associate (AZ-204)", "Google Professional Cloud Developer", "HashiCorp Certified: Terraform Associate"],
                    portfolioProjects: ["Serverless applications", "Microservices on Kubernetes", "Real-time data pipelines", "CI/CD implementation"],
                    compensation: { hourlyMin: 30, hourlyMax: 45, annualMin: 62400, annualMax: 93600, currency: "USD", region: "US-National" }
                },
                {
                    year: 3,
                    jobTitles: ["Cloud Solutions Architect", "Senior Cloud Engineer", "Cloud Consultant", "Technical Solutions Architect"],
                    skills: "Advanced Architecture, Specialized Cloud Services, Security & Compliance",
                    certifications: ["AWS Certified Solutions Architect - Professional", "Microsoft Azure Solutions Architect Expert (AZ-305)", "Google Professional Cloud Architect", "TOGAF 9 Certified"],
                    portfolioProjects: ["Enterprise-scale architecture", "Cloud migration strategies", "Zero-trust security", "AI/ML platforms"],
                    compensation: { hourlyMin: 50, hourlyMax: 75, annualMin: 104000, annualMax: 156000, currency: "USD", region: "US-National" }
                },
                {
                    year: 5,
                    jobTitles: ["Principal Cloud Architect", "Cloud Strategy Director", "Enterprise Architect", "Cloud Practice Lead"],
                    skills: "Strategic Leadership, Advanced Cloud Computing, Business & Operations",
                    certifications: ["Multiple Professional/Expert certifications", "Enterprise Architecture certifications", "PMP", "ITIL 4 Strategic Leader"],
                    portfolioProjects: ["Large-scale transformations", "Published frameworks", "Cost optimization programs", "Innovation labs"],
                    compensation: { hourlyMin: 70, hourlyMax: 100, annualMin: 145600, annualMax: 208000, currency: "USD", region: "US-National" }
                },
                {
                    year: 7,
                    jobTitles: ["Chief Technology Officer", "VP of Cloud Strategy", "Cloud Computing Director", "Principal Consultant"],
                    skills: "Executive Leadership, Advanced Expertise, Consulting & Business",
                    certifications: ["Executive education", "Board certifications", "Expert-level technical certifications", "Industry expertise"],
                    portfolioProjects: ["Enterprise transformations", "Published books/research", "Conference keynotes", "Advisory positions"],
                    compensation: { hourlyMin: 100, hourlyMax: 175, annualMin: 208000, annualMax: 364000, currency: "USD", region: "US-National" }
                }
            ],
            "Project Management": [
                {
                    year: 1,
                    jobTitles: ["Project Coordinator", "Assistant Project Manager", "Scrum Master", "Agile Coach Associate"],
                    skills: "Project Management Fundamentals, Agile & Scrum Methodologies, Communication & Leadership",
                    certifications: ["CSM (Certified ScrumMaster)", "PMI-ACP", "Google Project Management Certificate", "ITIL Foundation"],
                    portfolioProjects: ["Small to medium projects", "Scrum Master experience", "Stakeholder templates", "Process improvements"],
                    compensation: { hourlyMin: 28, hourlyMax: 45, annualMin: 58240, annualMax: 93600, currency: "USD", region: "US-National" }
                },
                {
                    year: 3,
                    jobTitles: ["Senior Project Manager", "Program Manager", "Senior Scrum Master", "Agile Delivery Manager"],
                    skills: "Advanced Project Management, Advanced Agile & Scaling, Strategic & Business Skills",
                    certifications: ["PMP", "PSM", "SAFe Program Consultant (SPC)", "Prince2 Practitioner"],
                    portfolioProjects: ["Complex multi-million programs", "Agile transformations", "Cost optimization", "Mentorship programs"],
                    compensation: { hourlyMin: 45, hourlyMax: 70, annualMin: 93600, annualMax: 145600, currency: "USD", region: "US-National" }
                }
            ],
            "Cloud Operations": [
                {
                    year: 1,
                    jobTitles: ["Cloud Support Technician", "DevOps Associate", "Infrastructure Assistant", "Cloud Administrator I"],
                    skills: "Core Cloud Platforms, Infrastructure & Monitoring, Automation & Scripting",
                    certifications: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)", "Google Cloud Digital Leader", "CompTIA Cloud+"],
                    portfolioProjects: ["Multi-cloud lab environment", "PowerShell/Bash scripts", "Monitoring dashboards", "Infrastructure automation"],
                    compensation: { hourlyMin: 20, hourlyMax: 32, annualMin: 41600, annualMax: 66560, currency: "USD", region: "US-National" }
                },
                {
                    year: 2,
                    jobTitles: ["Cloud Administrator II", "DevOps Engineer I", "Site Reliability Engineer I", "Platform Operations Analyst"],
                    skills: "Advanced Cloud Services, Infrastructure as Code, CI/CD & DevOps",
                    certifications: ["AWS Solutions Architect Associate", "Azure Administrator Associate (AZ-104)", "Google Cloud Associate Cloud Engineer", "Terraform Associate"],
                    portfolioProjects: ["Infrastructure as Code templates", "CI/CD pipelines", "Container deployments", "Cost optimization"],
                    compensation: { hourlyMin: 28, hourlyMax: 42, annualMin: 58240, annualMax: 87360, currency: "USD", region: "US-National" }
                },
                {
                    year: 3,
                    jobTitles: ["Senior DevOps Engineer", "Cloud Solutions Engineer", "Site Reliability Engineer II", "Platform Engineer"],
                    skills: "Advanced Infrastructure, Observability & Performance, Security & Compliance",
                    certifications: ["AWS Solutions Architect Professional", "Azure Solutions Architect Expert", "Google Professional Cloud Architect", "CKA"],
                    portfolioProjects: ["Production Kubernetes clusters", "Multi-region DR", "Advanced IaC", "Container security"],
                    compensation: { hourlyMin: 40, hourlyMax: 60, annualMin: 83200, annualMax: 124800, currency: "USD", region: "US-National" }
                },
                {
                    year: 5,
                    jobTitles: ["Principal Cloud Engineer", "DevOps Architect", "Platform Engineering Manager", "Cloud Solutions Architect"],
                    skills: "Leadership & Strategy, Advanced Platform Engineering, Business & Operations",
                    certifications: ["AWS Professional + Specialties", "Azure Expert + Specializations", "Google Professional + Specialties", "CKAD"],
                    portfolioProjects: ["Enterprise platforms", "Cost optimization programs", "GitOps workflows", "Developer experience platforms"],
                    compensation: { hourlyMin: 60, hourlyMax: 85, annualMin: 124800, annualMax: 176800, currency: "USD", region: "US-National" }
                },
                {
                    year: 7,
                    jobTitles: ["Principal Cloud Architect", "Head of Platform Engineering", "Cloud Practice Director", "VP of Cloud Operations"],
                    skills: "Strategic Leadership, Advanced Expertise, Consulting & Business",
                    certifications: ["Multiple Professional/Expert certifications", "Enterprise Architecture", "Executive leadership", "Industry-specific"],
                    portfolioProjects: ["Enterprise transformations", "Industry publications", "Conference speaking", "Advisory positions"],
                    compensation: { hourlyMin: 85, hourlyMax: 140, annualMin: 176800, annualMax: 291200, currency: "USD", region: "US-National" }
                }
            ],
            "Network Operations": [
                {
                    year: 1,
                    jobTitles: ["Network Technician I", "NOC Analyst", "Junior Network Administrator", "Help Desk Network Specialist"],
                    skills: "Core Networking, Monitoring & Troubleshooting, Basic Automation",
                    certifications: ["CompTIA Network+", "Cisco CCNA", "CompTIA A+", "Wireshark Certified Network Analyst"],
                    portfolioProjects: ["Home network lab", "Network monitoring dashboard", "Python automation scripts", "Network documentation"],
                    compensation: { hourlyMin: 18, hourlyMax: 28, annualMin: 37440, annualMax: 58240, currency: "USD", region: "US-National" }
                },
                {
                    year: 2,
                    jobTitles: ["Network Administrator", "NOC Engineer II", "Network Support Specialist", "Infrastructure Analyst"],
                    skills: "Advanced Networking, Advanced Monitoring, Network Automation",
                    certifications: ["Cisco CCNP Enterprise", "Juniper JNCIA/JNCIS", "F5 Certified BIG-IP Administrator", "Python Institute PCAP"],
                    portfolioProjects: ["Advanced monitoring systems", "Ansible network automation", "Multi-vendor lab environments", "Performance optimization"],
                    compensation: { hourlyMin: 25, hourlyMax: 38, annualMin: 52000, annualMax: 79040, currency: "USD", region: "US-National" }
                },
                {
                    year: 3,
                    jobTitles: ["Senior Network Engineer", "Network Architect I", "Site Reliability Engineer (Network)", "Infrastructure Engineer II"],
                    skills: "Enterprise Networking, Advanced Technologies, DevOps & Automation",
                    certifications: ["Cisco CCNP Enterprise", "VMware NSX Data Center", "AWS Advanced Networking Specialty", "Juniper JNCIP"],
                    portfolioProjects: ["Enterprise network design", "SD-WAN deployment", "Network automation frameworks", "Container networking"],
                    compensation: { hourlyMin: 40, hourlyMax: 60, annualMin: 83200, annualMax: 124800, currency: "USD", region: "US-National" }
                },
                {
                    year: 5,
                    jobTitles: ["Principal Network Engineer", "Network Solutions Architect", "Lead Infrastructure Engineer", "Network Operations Manager"],
                    skills: "Leadership & Strategy, Advanced Architecture, Emerging Technologies",
                    certifications: ["Cisco CCIE", "VMware NSX Expert", "AWS Solutions Architect Professional", "Juniper JNCIE"],
                    portfolioProjects: ["Large-scale network architecture", "Automation platforms", "Cost optimization programs", "Mentorship programs"],
                    compensation: { hourlyMin: 60, hourlyMax: 85, annualMin: 124800, annualMax: 176800, currency: "USD", region: "US-National" }
                },
                {
                    year: 7,
                    jobTitles: ["Principal Network Architect", "Director of Network Operations", "Chief Network Officer", "Network Consulting Practice Lead"],
                    skills: "Strategic Leadership, Advanced Expertise, Consulting & Business",
                    certifications: ["Multiple expert certifications", "Enterprise Architecture", "Executive leadership", "Professional consulting"],
                    portfolioProjects: ["Enterprise network transformations", "Published research", "Conference presentations", "Advisory positions"],
                    compensation: { hourlyMin: 85, hourlyMax: 140, annualMin: 176800, annualMax: 291200, currency: "USD", region: "US-National" }
                }
            ],
            "Security Operations": [
                {
                    year: 1,
                    jobTitles: ["SOC Analyst I", "Security Technician", "Incident Response Coordinator", "Cyber Defense Analyst"],
                    skills: "Core Security Tools, Operating Systems, Scripting & Automation",
                    certifications: ["CompTIA Security+", "CompTIA Network+", "(ISC)² SSCP", "SANS GIAC GSEC"],
                    portfolioProjects: ["Home security lab", "Basic SIEM dashboard", "PowerShell automation", "Incident procedures"],
                    compensation: { hourlyMin: 22, hourlyMax: 35, annualMin: 45760, annualMax: 72800, currency: "USD", region: "US-National" }
                },
                {
                    year: 2,
                    jobTitles: ["SOC Analyst II", "Security Operations Analyst", "Threat Hunter I", "Cyber Intelligence Analyst"],
                    skills: "Advanced Security Tools, Programming & Analysis, Incident Response",
                    certifications: ["GCIH", "CySA+", "GCFA", "Cloud security certifications"],
                    portfolioProjects: ["Advanced SIEM implementation", "Threat hunting playbooks", "Python automation", "Digital forensics cases"],
                    compensation: { hourlyMin: 25, hourlyMax: 38, annualMin: 52000, annualMax: 79040, currency: "USD", region: "US-National" }
                },
                {
                    year: 3,
                    jobTitles: ["Senior SOC Analyst", "Threat Hunter II", "Security Engineer I", "Incident Response Specialist"],
                    skills: "Advanced Threat Detection, Security Engineering, Advanced Programming",
                    certifications: ["GCTI", "GNFA", "OSCP", "AWS Security Specialty", "CISSP"],
                    portfolioProjects: ["Advanced threat hunting platform", "Custom security tools", "Malware analysis", "SOAR automation"],
                    compensation: { hourlyMin: 45, hourlyMax: 65, annualMin: 93600, annualMax: 135200, currency: "USD", region: "US-National" }
                },
                {
                    year: 5,
                    jobTitles: ["Lead Security Engineer", "Principal SOC Analyst", "Cyber Threat Intelligence Manager", "Security Architect I"],
                    skills: "Leadership & Strategy, Advanced Technologies, Business Skills",
                    certifications: ["CISSP", "SABSA", "CISM", "CISPA", "Advanced cloud security"],
                    portfolioProjects: ["Enterprise SOC design", "Security metrics frameworks", "ML security analytics", "Published research"],
                    compensation: { hourlyMin: 65, hourlyMax: 90, annualMin: 135200, annualMax: 187200, currency: "USD", region: "US-National" }
                },
                {
                    year: 7,
                    jobTitles: ["Principal Security Architect", "CISO", "Senior Security Consultant", "Cyber Security Director"],
                    skills: "Strategic Leadership, Advanced Expertise, Consulting & Business",
                    certifications: ["CISSP with concentrations", "SABSA", "TOGAF", "Industry-specific", "Executive leadership"],
                    portfolioProjects: ["Enterprise security transformations", "Published books/research", "Conference speaking", "Advisory positions"],
                    compensation: { hourlyMin: 90, hourlyMax: 150, annualMin: 187200, annualMax: 312000, currency: "USD", region: "US-National" }
                }
            ],
            "Full Stack Developer": [
                {
                    year: 1,
                    jobTitles: ["Junior Full Stack Developer", "Web Developer I", "Frontend Developer", "Backend Developer Associate"],
                    skills: "Core Programming & Web Technologies, Frontend Development Basics, Backend & Database Fundamentals",
                    certifications: ["W3S-JS", "W3S-REACT", "GIT-CERT", "EXPRESS-JS"],
                    portfolioProjects: ["Personal portfolio website", "Simple React applications", "Basic REST API", "Interactive web apps"],
                    compensation: { hourlyMin: 25, hourlyMax: 40, annualMin: 52000, annualMax: 83200, currency: "USD", region: "US-National" }
                },
                {
                    year: 2,
                    jobTitles: ["Full Stack Developer I", "Web Application Developer", "Software Developer", "Frontend/Backend Developer"],
                    skills: "Advanced Frontend Development, Backend & API Development, Development Practices",
                    certifications: ["META-FRONTEND", "META-REACT", "RESTAPI-CERT", "MONGODB-DEV", "AGILE-CERT"],
                    portfolioProjects: ["Full-stack CRUD applications", "React with complex state", "RESTful APIs", "Database-driven apps"],
                    compensation: { hourlyMin: 35, hourlyMax: 55, annualMin: 72800, annualMax: 114400, currency: "USD", region: "US-National" }
                },
                {
                    year: 3,
                    jobTitles: ["Senior Full Stack Developer", "Lead Developer", "Full Stack Engineer II", "Technical Lead"],
                    skills: "Advanced Full Stack Architecture, DevOps & Infrastructure, Security & Best Practices",
                    certifications: ["APC-MS", "IBM-FULLSTACK", "MYSQL-DBA", "POSTGRES-DBA", "AWS-DEV", "WEBSEC-CERT"],
                    portfolioProjects: ["Complex full-stack applications", "Microservices architecture", "Performance optimization", "Cloud deployment"],
                    compensation: { hourlyMin: 55, hourlyMax: 80, annualMin: 114400, annualMax: 166400, currency: "USD", region: "US-National" }
                },
                {
                    year: 5,
                    jobTitles: ["Principal Full Stack Developer", "Software Architect", "Technical Lead", "Engineering Manager"],
                    skills: "Leadership & Architecture, Advanced Technologies, Business & Strategy",
                    certifications: ["MS-FULLSTACK", "MEAN-STACK", "MERN-STACK", "DOCKER-CERT", "CKAD", "TYPESCRIPT"],
                    portfolioProjects: ["Enterprise-scale applications", "Multi-technology implementations", "Kubernetes applications", "Architecture documentation"],
                    compensation: { hourlyMin: 75, hourlyMax: 110, annualMin: 156000, annualMax: 228800, currency: "USD", region: "US-National" }
                },
                {
                    year: 7,
                    jobTitles: ["Director of Engineering", "Chief Technology Officer", "VP of Development", "Principal Software Architect"],
                    skills: "Strategic Leadership, Advanced Technical Expertise, Business & Consulting",
                    certifications: ["HKUST-REACT", "REDIS-CERT", "CICD-JENKINS", "GRAPHQL-CERT", "PWA-CERT", "SERVERLESS"],
                    portfolioProjects: ["Digital transformation case studies", "Open-source frameworks", "Technical thought leadership", "Strategic partnerships"],
                    compensation: { hourlyMin: 120, hourlyMax: 200, annualMin: 249600, annualMax: 416000, currency: "USD", region: "US-National" }
                }
            ],
            "AI/ML": [
                {
                    year: 1,
                    jobTitles: ["Junior Data Scientist", "ML Engineer I", "AI Associate", "Research Assistant"],
                    skills: "Core Programming, Machine Learning Basics, Tools & Platforms",
                    certifications: ["Google AI for Everyone", "AWS ML Foundations", "Microsoft Azure AI Fundamentals", "Python Institute PCAP"],
                    portfolioProjects: ["Supervised learning projects", "Data analysis with visualizations", "Kaggle competitions", "Simple ML web apps"],
                    compensation: { hourlyMin: 25, hourlyMax: 40, annualMin: 52000, annualMax: 83200, currency: "USD", region: "US-National" }
                },
                {
                    year: 2,
                    jobTitles: ["ML Engineer II", "Data Scientist", "AI Specialist", "Research Engineer"],
                    skills: "Advanced Machine Learning, Deep Learning Frameworks, MLOps Basics",
                    certifications: ["AWS ML Specialty", "Google Professional ML Engineer", "Microsoft Azure AI Engineer", "Deep Learning Specialization"],
                    portfolioProjects: ["Deep learning projects", "NLP applications", "Computer vision", "MLOps pipelines", "A/B testing"],
                    compensation: { hourlyMin: 35, hourlyMax: 55, annualMin: 72800, annualMax: 114400, currency: "USD", region: "US-National" }
                },
                {
                    year: 3,
                    jobTitles: ["Senior ML Engineer", "Principal Data Scientist", "AI Research Engineer", "ML Platform Engineer"],
                    skills: "Advanced AI/ML, MLOps & Engineering, Research & Innovation",
                    certifications: ["TensorFlow Developer", "NVIDIA DLI", "Kubernetes Administrator", "MLflow Certified", "Published papers"],
                    portfolioProjects: ["Production ML systems", "State-of-the-art implementations", "Large-scale data processing", "Custom frameworks"],
                    compensation: { hourlyMin: 55, hourlyMax: 80, annualMin: 114400, annualMax: 166400, currency: "USD", region: "US-National" }
                },
                {
                    year: 5,
                    jobTitles: ["Principal ML Engineer", "AI Platform Architect", "Head of Machine Learning", "ML Engineering Manager"],
                    skills: "Leadership & Strategy, Advanced ML Systems, Business & Product",
                    certifications: ["AWS Solutions Architect (ML focus)", "Google Professional Cloud Architect", "Azure Solutions Architect Expert", "MBA/Leadership"],
                    portfolioProjects: ["Enterprise ML platforms", "AI governance frameworks", "Successful AI products", "Industry conference presentations"],
                    compensation: { hourlyMin: 75, hourlyMax: 110, annualMin: 156000, annualMax: 228800, currency: "USD", region: "US-National" }
                },
                {
                    year: 7,
                    jobTitles: ["Chief AI Officer", "VP of AI/ML", "AI Practice Director", "Principal AI Scientist"],
                    skills: "Strategic Leadership, Advanced AI Expertise, Consulting & Business",
                    certifications: ["Multiple professional certifications", "Executive education", "Board certifications", "Industry expertise"],
                    portfolioProjects: ["Enterprise AI transformations", "Published research (NeurIPS, ICML)", "Conference speaking", "Advisory positions"],
                    compensation: { hourlyMin: 120, hourlyMax: 200, annualMin: 249600, annualMax: 416000, currency: "USD", region: "US-National" }
                }
            ],
            "Analytics": [
                {
                    year: 1,
                    jobTitles: ["Data Entry Specialist", "Junior Business Analyst", "Administrative Analyst", "Excel Specialist"],
                    skills: "Microsoft Skills, Open Source Skills",
                    certifications: ["Microsoft Excel Expert", "Microsoft SharePoint Associate", "Google Data Analytics Certificate", "Tableau Desktop Specialist"],
                    portfolioProjects: ["Public dashboards", "Automated templates", "Simple Python scripts", "Git repositories"],
                    compensation: { hourlyMin: 18, hourlyMax: 28, annualMin: 37440, annualMax: 58240, currency: "USD", region: "US-National" }
                },
                {
                    year: 2,
                    jobTitles: ["Business Analyst", "Data Analyst", "SharePoint Administrator", "Process Improvement Analyst"],
                    skills: "Microsoft Skills, Open Source Skills",
                    certifications: ["Microsoft Power BI Data Analyst Associate", "Microsoft Power Platform Fundamentals", "Tableau Desktop Certified Associate"],
                    portfolioProjects: ["Multi-source data integration", "SharePoint solutions", "Power BI reports", "Python automation", "R analysis"],
                    compensation: { hourlyMin: 25, hourlyMax: 38, annualMin: 52000, annualMax: 79040, currency: "USD", region: "US-National" }
                },
                {
                    year: 3,
                    jobTitles: ["Senior Business Analyst", "Power BI Developer", "Data Visualization Specialist", "Business Intelligence Analyst"],
                    skills: "Microsoft Skills, Open Source Skills",
                    certifications: ["Microsoft Power BI Data Analyst Associate", "Tableau Server Certified Associate", "AWS Cloud Practitioner", "Python PCAP"],
                    portfolioProjects: ["Enterprise Power BI solutions", "End-to-end analytics pipelines", "Machine learning projects", "Dockerized environments"],
                    compensation: { hourlyMin: 35, hourlyMax: 55, annualMin: 72800, annualMax: 114400, currency: "USD", region: "US-National" }
                },
                {
                    year: 5,
                    jobTitles: ["Senior Power BI Developer", "Business Intelligence Architect", "Data Analytics Manager", "Digital Transformation Specialist"],
                    skills: "Microsoft Skills, Open Source Skills",
                    certifications: ["Microsoft Power Platform Solution Architect Expert", "AWS Data Analytics Specialty", "Tableau Desktop Certified Professional"],
                    portfolioProjects: ["End-to-end Power Platform solutions", "Cloud data architectures", "ML model integration", "Infrastructure-as-code"],
                    compensation: { hourlyMin: 50, hourlyMax: 75, annualMin: 104000, annualMax: 156000, currency: "USD", region: "US-National" }
                },
                {
                    year: 7,
                    jobTitles: ["Senior Solutions Architect", "Lead Data Scientist", "Digital Analytics Director", "Independent Consultant"],
                    skills: "Microsoft & Open Source Skills",
                    certifications: ["Microsoft Azure Solutions Architect Expert", "PMP", "AWS ML Specialty", "Google Professional ML Engineer", "CAP"],
                    portfolioProjects: ["Enterprise implementations", "Thought leadership content", "Multi-platform solutions", "Open-source tools", "Client testimonials"],
                    compensation: { hourlyMin: 75, hourlyMax: 120, annualMin: 156000, annualMax: 249600, currency: "USD", region: "US-National" }
                }
            ]
        },

        careerTransitions: {
            description: "Natural career path progressions and lateral moves between technical roles",
            nodes: [
                { id: "fullstack", label: "Full Stack Dev", path: "Full Stack Developer", tier: "primary" },
                { id: "citizen", label: "Citizen Dev", path: "Citizen Developer", tier: "primary" },
                { id: "cloudops", label: "Cloud Ops", path: "Cloud Operations", tier: "primary" },
                { id: "netops", label: "Network Ops", path: "Network Operations", tier: "primary" },
                { id: "projectmgr", label: "Project Manager", path: "Project Management", tier: "primary" },
                { id: "analyst", label: "Data Analyst", path: "Analytics", tier: "primary" },
                { id: "cloudcompute", label: "Cloud Computing", path: "Cloud Computing", tier: "primary" },
                { id: "secops", label: "Security Ops", path: "Security Operations", tier: "primary" },
                { id: "aiml", label: "AI/ML Engineer", path: "AI/ML", tier: "primary" },
                { id: "productmgr", label: "Product Manager", path: null, tier: "tertiary" },
                { id: "generalmgr", label: "General Manager", path: null, tier: "tertiary" },
                { id: "busdev", label: "Bus Dev Mgr", path: null, tier: "tertiary" },
                { id: "programmgr", label: "Program Manager", path: null, tier: "tertiary" },
                { id: "trade", label: "Trade", path: null, tier: "tertiary" },
                { id: "socialsciences", label: "Social Sciences", path: null, tier: "tertiary" }
            ],
            links: [
                { source: "citizen", target: "projectmgr", type: "natural_progression" },
                { source: "citizen", target: "analyst", type: "lateral_move" },
                { source: "citizen", target: "cloudops", type: "technical_upskill" },
                { source: "citizen", target: "netops", type: "technical_upskill" },
                { source: "cloudops", target: "fullstack", type: "technical_breadth" },
                { source: "cloudops", target: "cloudcompute", type: "specialization" },
                { source: "netops", target: "secops", type: "specialization" },
                { source: "netops", target: "analyst", type: "lateral_move" },
                { source: "analyst", target: "aiml", type: "technical_upskill" },
                { source: "analyst", target: "projectmgr", type: "management_track" },
                { source: "projectmgr", target: "programmgr", type: "management_progression" },
                { source: "trade", target: "projectmgr", type: "career_pivot" },
                { source: "trade", target: "productmgr", type: "career_pivot" },
                { source: "trade", target: "citizen", type: "technical_entry" },
                { source: "productmgr", target: "programmgr", type: "management_progression" },
                { source: "productmgr", target: "projectmgr", type: "lateral_move" },
                { source: "socialsciences", target: "projectmgr", type: "career_pivot" },
                { source: "socialsciences", target: "citizen", type: "technical_entry" },
                { source: "socialsciences", target: "analyst", type: "analytics_entry" },
                { source: "busdev", target: "generalmgr", type: "executive_progression" },
                { source: "programmgr", target: "generalmgr", type: "executive_progression" }
            ]
        },

        roleTranslator: {
            description: "Maps functional roles to industry-specific job titles across 8 sectors",
            sectors: {
                "ISV": { fullName: "Independent Software Vendor", description: "Companies that develop and sell software products", examples: ["Microsoft", "Adobe", "Salesforce"] },
                "IHV": { fullName: "Independent Hardware Vendor", description: "Manufacturers of computer hardware and components", examples: ["Dell", "HP", "Cisco"] },
                "ISP": { fullName: "Internet Service Provider", description: "Providers of internet connectivity and services", examples: ["Comcast", "AT&T", "Verizon"] },
                "CSP": { fullName: "Cloud Service Provider", description: "Cloud computing infrastructure and platform providers", examples: ["AWS", "Azure", "Google Cloud"] },
                "MSP": { fullName: "Managed Service Provider", description: "Outsourced IT management and support services", examples: ["CDW", "Insight", "SHI"] },
                "VAR": { fullName: "Value Added Reseller", description: "Resellers who customize and integrate solutions", examples: ["Presidio", "World Wide Technology", "Softchoice"] },
                "Distributor": { fullName: "Distributor", description: "Wholesale suppliers of technology products", examples: ["Ingram Micro", "Tech Data", "Arrow"] },
                "Telco": { fullName: "Telecommunications", description: "Telecommunications and network service providers", examples: ["T-Mobile", "Sprint", "CenturyLink"] }
            },
            roleMappings: {
                "Project Manager": {
                    ISV: ["Software Project Manager", "Product Development PM", "Agile Project Manager"],
                    IHV: ["Hardware Project Manager", "Product Engineering PM", "Manufacturing PM"],
                    ISP: ["Network Project Manager", "Infrastructure PM", "Service Delivery PM"],
                    CSP: ["Cloud Platform PM", "Service Delivery PM", "Infrastructure PM"],
                    MSP: ["Client Project Manager", "Implementation PM", "Service Delivery PM"],
                    VAR: ["Solution Project Manager", "Implementation PM", "Customer Project Manager"],
                    Distributor: ["Channel Project Manager", "Vendor Relationship PM", "Supply Chain PM"],
                    Telco: ["Network Deployment PM", "Service Launch PM", "Infrastructure PM"]
                },
                "AI/ML Engineer": {
                    ISV: ["ML Engineer", "AI Software Engineer", "Data Scientist"],
                    IHV: ["AI Hardware Engineer", "ML Chip Designer", "Edge AI Engineer"],
                    ISP: ["Network Analytics Engineer", "Traffic Optimization ML Engineer", "Predictive Analytics Engineer"],
                    CSP: ["ML Platform Engineer", "AI Services Engineer", "MLOps Engineer"],
                    MSP: ["AI Solutions Engineer", "ML Consultant", "Data Science Consultant"],
                    VAR: ["AI Solutions Architect", "ML Pre-sales Engineer", "Data Science Specialist"],
                    Distributor: ["AI Technology Specialist", "ML Solutions Engineer", "Data Analytics Consultant"],
                    Telco: ["Network AI Engineer", "Predictive Analytics Engineer", "ML Operations Engineer"]
                },
                "Data Analyst": {
                    ISV: ["Junior Data Analyst", "Product Data Analyst", "Business Intelligence Analyst", "Senior Customer Analytics Specialist"],
                    IHV: ["Associate Analyst", "Market Research Analyst", "Product Performance Analyst", "Senior Supply Chain Analyst"],
                    ISP: ["Junior Analyst", "Network Performance Analyst", "Customer Usage Analyst", "Senior Traffic Analyst"],
                    CSP: ["Associate Data Analyst", "Cloud Metrics Analyst", "Usage Analytics Specialist", "Senior Performance Analyst"],
                    MSP: ["Junior Data Analyst", "Client Data Analyst", "Service Performance Analyst", "Senior Business Intelligence Analyst"],
                    VAR: ["Associate Analyst", "Sales Data Analyst", "Market Intelligence Analyst", "Senior Customer Analytics Specialist"],
                    Distributor: ["Junior Analyst", "Market Data Analyst", "Demand Planning Analyst", "Senior Channel Analytics Specialist"],
                    Telco: ["Associate Data Analyst", "Network Data Analyst", "Customer Analytics Specialist", "Senior Revenue Assurance Analyst"]
                },
                "Citizen Developer": {
                    ISV: ["Business Analyst Developer", "Low-Code Developer", "Workflow Automation Specialist"],
                    IHV: ["Process Automation Specialist", "Business Application Developer", "Workflow Designer"],
                    ISP: ["Service Automation Developer", "Process Improvement Specialist", "Business Systems Developer"],
                    CSP: ["Self-Service Platform Developer", "Automation Specialist", "Business Process Developer"],
                    MSP: ["Client Solutions Developer", "Process Automation Specialist", "Business Application Developer"],
                    VAR: ["Solution Configuration Specialist", "Business Process Developer", "Workflow Automation Specialist"],
                    Distributor: ["Business Process Specialist", "Automation Developer", "Self-Service Solutions Developer"],
                    Telco: ["Service Automation Specialist", "Process Optimization Developer", "Business Systems Specialist"]
                },
                "Cloud Operations": {
                    ISV: ["DevOps Engineer", "Site Reliability Engineer", "Platform Operations Engineer"],
                    IHV: ["Manufacturing Cloud Engineer", "IoT Platform Engineer", "Edge Computing Specialist"],
                    ISP: ["Network Cloud Engineer", "Service Operations Engineer", "Infrastructure Automation Engineer"],
                    CSP: ["Cloud Infrastructure Engineer", "Platform Operations Engineer", "Site Reliability Engineer"],
                    MSP: ["Cloud Services Engineer", "Infrastructure Operations Engineer", "Multi-Cloud Specialist"],
                    VAR: ["Cloud Solutions Engineer", "Infrastructure Specialist", "Cloud Operations Consultant"],
                    Distributor: ["Cloud Technology Specialist", "Infrastructure Solutions Engineer", "Cloud Platform Specialist"],
                    Telco: ["Telco Cloud Engineer", "Network Function Virtualization Engineer", "Cloud Infrastructure Specialist"]
                },
                "Cloud Computing": {
                    ISV: ["Cloud Software Architect", "SaaS Platform Engineer", "Cloud Integration Specialist"],
                    IHV: ["Cloud Hardware Specialist", "Hybrid Cloud Engineer", "Edge Cloud Specialist"],
                    ISP: ["Cloud Infrastructure Specialist", "Hybrid Network Engineer", "Multi-Cloud Architect"],
                    CSP: ["Cloud Solutions Architect", "Platform Engineer", "Cloud Security Specialist"],
                    MSP: ["Cloud Services Architect", "Multi-Cloud Consultant", "Cloud Migration Specialist"],
                    VAR: ["Cloud Solutions Architect", "Cloud Consultant", "Multi-Cloud Specialist"],
                    Distributor: ["Cloud Solutions Specialist", "Cloud Technology Consultant", "Platform Solutions Engineer"],
                    Telco: ["Telco Cloud Architect", "Network Cloud Specialist", "Edge Computing Engineer"]
                },
                "Network Operations": {
                    ISV: ["Network Infrastructure Engineer", "Application Network Specialist", "Software-Defined Networking Engineer"],
                    IHV: ["Network Hardware Engineer", "Switching/Routing Specialist", "Network Test Engineer"],
                    ISP: ["Network Operations Engineer", "NOC Engineer", "Network Performance Engineer"],
                    CSP: ["Cloud Network Engineer", "Virtual Network Specialist", "Network Security Engineer"],
                    MSP: ["Network Services Engineer", "Managed Network Specialist", "Network Security Consultant"],
                    VAR: ["Network Solutions Engineer", "Infrastructure Consultant", "Network Design Specialist"],
                    Distributor: ["Network Technology Specialist", "Infrastructure Solutions Engineer", "Network Products Specialist"],
                    Telco: ["Network Operations Engineer", "NOC Engineer", "Network Planning Engineer"]
                },
                "Security Operations": {
                    ISV: ["Application Security Engineer", "DevSecOps Engineer", "Product Security Specialist"],
                    IHV: ["Hardware Security Engineer", "Embedded Security Specialist", "IoT Security Engineer"],
                    ISP: ["Network Security Engineer", "SOC Analyst", "Cyber Threat Analyst"],
                    CSP: ["Cloud Security Engineer", "Security Architect", "Compliance Specialist"],
                    MSP: ["Security Services Engineer", "MSSP Analyst", "Security Consultant"],
                    VAR: ["Security Solutions Engineer", "Cybersecurity Consultant", "Security Specialist"],
                    Distributor: ["Security Technology Specialist", "Cybersecurity Solutions Engineer", "Security Products Specialist"],
                    Telco: ["Telecom Security Engineer", "SOC Analyst", "Security Operations Specialist"]
                },
                "Full Stack Developer": {
                    ISV: ["Junior Developer", "Full Stack Software Engineer", "Application Developer", "Senior Web Developer"],
                    IHV: ["Associate Developer", "Firmware/Software Developer", "Embedded Systems Developer", "Senior Full Stack IoT Developer"],
                    ISP: ["Junior Web Developer", "Web Services Developer", "Portal Developer", "Senior API Developer"],
                    CSP: ["Associate Developer", "Cloud Application Developer", "Platform Developer", "Senior Microservices Developer"],
                    MSP: ["Junior Solutions Developer", "Solutions Developer", "Custom Application Developer", "Senior Integration Developer"],
                    VAR: ["Associate Developer", "Solutions Developer", "Application Consultant", "Custom Development Specialist"],
                    Distributor: ["Junior Developer", "Technology Solutions Developer", "Integration Specialist", "Senior Custom Applications Developer"],
                    Telco: ["Junior Developer", "Service Platform Developer", "API Developer", "Senior Digital Services Developer"]
                }
            }
        },

        // Extension points for future enhancements
        extensions: {
            geographicMultipliers: {
                description: "Future: Region-based salary adjustments",
                example: { "US-West": 1.15, "US-Central": 1.0, "US-South": 0.95, "Canada": 1.08, "Europe": 0.85 }
            },
            emergingSkills: {
                description: "Future: Time-based skill updates with adoption rates",
                example: { skillName: "AI Prompt Engineering", addedDate: "2025-01", emerging: true, adoptionRate: "high" }
            },
            deprecatedCertifications: {
                description: "Future: Certification lifecycle management",
                example: { name: "Legacy Cert", deprecated: true, deprecatedDate: "2024-01", replacement: "New Cert v2.0" }
            },
            industryVariations: {
                description: "Future: Sector-specific career path customizations",
                example: "Different skill requirements or progressions for same role across industries"
            },
            userCustomization: {
                description: "Future: User-created or modified career paths",
                example: "Custom learning paths based on individual goals and experiences"
            }
        }
    };
}

/**
 * Cleansheet Platform Context - Platform information for LLM context
 *
 * Contains subscription tiers, coaching info, privacy commitments, and legal terms.
 * Used by: career-canvas.html (AI Assistant context)
 */
function getCleansheetPlatformContext() {
    return {
        platform: {
            name: "Cleansheet",
            mission: "Career security through diverse experience (upskilling + sideskilling)",
            approach: "Navigation over content, Quality over quantity, Privacy over profit",
            status: "Experimental development (no SLAs, best-effort security)",
            contentLibrary: "189 curated articles, 9 career paths, 100% privacy-focused"
        },

        subscriptions: {
            member: {
                price: "Free (Always free)",
                features: [
                    "Career Experience Management",
                    "Behavioral Story Journal (STAR format)",
                    "LLM Prompt Generation",
                    "Local Storage (Browser-based)",
                    "Cleansheet Library Access (189 articles)",
                    "Career Path Navigator (9 career paths)",
                    "Job Role to Industry Decoder"
                ]
            },
            learner: {
                price: "Free (Limited time, normally $9/mo)",
                features: [
                    "All Member features",
                    "LLM Integration (Bring Your Own API Key)",
                    "Cleansheet Profile Service",
                    "Mobile-Responsive Viewport",
                    "Goal Management & Tracking",
                    "Centralized Portfolio Management",
                    "Diagrams & Documents",
                    "Portfolio Coaching (inquire for details)"
                ]
            },
            seeker: {
                price: "Free (Limited time, normally $19/mo)",
                features: [
                    "All Learner features",
                    "Job Opportunity Management",
                    "LLM Prompt Management",
                    "Whiteboards and Presentations",
                    "Mock Interviews (inquire for details)"
                ]
            },
            note: "All subscription tiers are FREE during preview period. No credit card required."
        },

        coaching: {
            name: "Cleansheet Quarter",
            duration: "12 weeks",
            price: "Free during preview (normally $1199)",
            description: "Structured coaching engagement with Cleansheet Success Manager",
            includes: [
                "Success Manager consultation - Initial consultation to understand career aspirations",
                "Goal Setting - Define clear, measurable objectives for the 12-week quarter",
                "Capstone Project Planning - Plan concrete projects that build real capabilities",
                "4 synchronous virtual meetings (30-45 minutes each)",
                "Personalized guidance tailored to individual objectives",
                "Asynchronous collaboration - Ongoing support between meetings"
            ],
            matching: "Success Manager matched based on your profile and goals",
            access: "Access to Cleansheet Library and comprehensive coach resources"
        },

        privacy: {
            core: "Privacy-first platform - Privacy is our top priority, not a feature",
            commitments: [
                "Ad-Free Experience - No advertising, no tracking pixels, no behavioral profiling",
                "No Data Sharing - We categorically do NOT share user data with partners, advertisers, or third parties",
                "No AI Training - Your content and interactions are NEVER used to train LLM models",
                "Anonymized Analytics Only - We only collect anonymized usage data to optimize the platform"
            ],
            byok: {
                description: "Bring Your Own API Key (BYOK) - Privacy-first LLM integration",
                howItWorks: [
                    "API keys encrypted locally in browser (AES-GCM 256-bit encryption)",
                    "Keys NEVER transmitted to Cleansheet servers",
                    "Messages sent directly from browser to AI provider (OpenAI, Anthropic, Gemini)",
                    "Cleansheet servers NOT involved in conversations",
                    "Conversation history held temporarily in browser memory during session only",
                    "Conversations automatically cleared when browser closes",
                    "Never saved to localStorage or persisted",
                    "Never transmitted to Cleansheet servers"
                ],
                userControl: "Users choose which AI provider to use and what data to share",
                supportedProviders: ["OpenAI (GPT-4o, GPT-4o mini)", "Anthropic (Claude Sonnet 4.5, Haiku 4.5, Opus 4.1)", "Google Gemini (2.0 Flash, 1.5 Pro, 1.5 Flash)"]
            },
            dataShared: {
                description: "Data shared with AI is entirely under user control",
                categories: [
                    "Career Experiences (work history, roles, skills, technologies)",
                    "Interview Stories (STAR format stories)",
                    "Career Goals (SMART goals and tracking)",
                    "Job Applications (if Job Seeker tier)",
                    "Conversation Context (current session only)"
                ]
            },
            prohibited: [
                "NO selling or renting personal information",
                "NO sharing with partners/advertisers",
                "NO using content for AI/LLM training",
                "NO targeted advertising",
                "NO cross-site tracking",
                "NO behavioral profiling for commercial purposes"
            ]
        },

        legal: {
            experimental: "Platform in experimental development status - functionality may be incomplete, unstable, or subject to change",
            warranties: "Provided AS IS with no warranties of any kind (merchantability, fitness, accuracy, security)",
            liability: "Maximum liability: $0 (zero dollars) - Users assume all risks",
            security: "Best-effort security, no absolute guarantee for experimental systems",
            userResponsibility: "Users should NOT submit highly sensitive information (SSN, financial accounts, health records)",
            dataRetention: "Account data retained during account lifetime, deleted within 90 days of account deletion"
        },

        careerPaths: [
            "Citizen Developer",
            "Cloud Computing",
            "Cloud Operations",
            "Network Operations",
            "Security Operations",
            "Project Management",
            "Full Stack Developer",
            "AI/ML Engineering",
            "Data Analytics"
        ]
    };
}

/**
 * Canvas System Prompt - AI Assistant system prompt for Career Canvas
 *
 * Provides instructions to the LLM for handling canvas interactions,
 * understanding context data, and executing actions.
 * Used by: career-canvas.html (AI Assistant)
 */
const CANVAS_SYSTEM_PROMPT = `You are an AI assistant for Career Canvas, a career management platform.

CONTEXT PROVIDED TO YOU:
With each user message, you receive comprehensive structured data including:

**Job Opportunities:** id, title, company, status, dateApplied

**Experiences (FULL PROOF CHAIN):**
- Basic: id, role, company, location, dates, description
- Technologies: Array of technical skills/tools (e.g., Python, Excel, AWS) with proficiency levels
- Key Skills: Array of soft/professional skills (e.g., Leadership, Communication)
- Competencies: Array of competency areas (e.g., Project Management, Data Analysis)
- Achievements: Array of measurable accomplishments and outcomes

**Portfolio Projects:**
- Project name, description, and link
- Technologies, skills, and competencies demonstrated
- Created/updated dates

**STAR Stories:**
- Title and linked experience
- Situation: Context and background
- Task: Objective and challenge
- Action: Specific steps taken
- Result: Measurable outcomes
- Competencies demonstrated

**Documents (10 types):**
- Lexical documents: Rich text documents created in the platform
- LaTeX documents: Technical documents and papers
- Markdown documents: Markdown-formatted documentation
- Diagrams: Draw.io diagrams and flowcharts
- Whiteboards: Visual brainstorming and planning boards
- Presentations: Slide decks and presentation materials
- Code snippets: Code examples with language tags
- Photos: Image assets
- PDFs: Uploaded PDF documents
- Links: Web resource bookmarks
- Includes: name, description, tags, linkedType, linkedId, sharedWith, dates
- May include full content depending on user's privacy settings

**Goals:** id, title, status, targetDate

**Summary Counts:** Quick reference for all categories

This context is COMPLETE and ACCURATE. Trust this data - don't assume or hallucinate information.

**USER PRIVACY CONTROLS:** Users can choose which data types to share with you. If a data type is missing from the context, respect that the user has chosen not to share it. Never ask why data is missing or suggest the user should share more.

IMPORTANT: When asked about skills or experience with specific technologies (e.g., "How many years of Excel experience?"),
scan through ALL experiences and their technologies arrays to calculate accurate totals based on date ranges.

ABOUT CLEANSHEET PLATFORM:
You are part of Cleansheet, a privacy-first career development platform.

**Mission:** Career security through diverse experience (upskilling + sideskilling)
**Philosophy:** Navigation over content, Quality over quantity, Privacy over profit
**Status:** Experimental development (no SLAs, best-effort security)

**Current Pricing:** All features FREE during preview period (no credit card required)

**Subscription Tiers:**
- **Member (Free):** Experience management, STAR stories, Library access (189 articles), Career Path Navigator (9 career paths)
- **Learner (Free, normally $9/mo):** + LLM integration (BYOK), Goal management, Portfolio management, Documents & Diagrams, Coaching inquiries
- **Job Seeker (Free, normally $19/mo):** + Job opportunity tracking, Mock interviews, Whiteboards & Presentations

**Cleansheet Quarter Coaching:**
- **12-week coaching engagement** with Success Manager (FREE preview, normally $1199)
- Includes: Goal setting, Capstone project planning, 4 virtual meetings (30-45 min), Personalized guidance
- Success Manager matched based on profile and goals

**Privacy Commitments (CRITICAL):**
- **No AI Training:** User data NEVER used to train AI models
- **BYOK LLM:** Conversations go direct from browser to AI provider (OpenAI, Anthropic, Gemini), NOT through Cleansheet servers
- **Local Storage:** Conversation history saved locally in your browser (localStorage) for persistence across sessions. History stays on your device only—never sent to Cleansheet servers. Each persona maintains separate conversation history. Clear anytime using the Clear Chat button.
- **No Data Sharing:** No selling data, no behavioral profiling, no third-party tracking, no targeted ads
- **Anonymized Analytics:** Only anonymized usage data collected to optimize platform
- **User Control:** Users choose which AI provider to use and what career data to share

**Platform Status:**
- Experimental platform (may be incomplete, unstable, or subject to change)
- Provided AS IS with no warranties
- Best-effort security, users assume all risks

**Career Paths Available:** Citizen Developer, Cloud Computing, Cloud Operations, Network Operations, Security Operations, Project Management, Full Stack Developer, AI/ML Engineering, Data Analytics

When users ask about Cleansheet subscriptions, coaching, privacy, platform features, or pricing, provide accurate information from this context.

CAREER GUIDANCE DATA:
You have access to detailed career progression information from Cleansheet's Career Path Navigator and Role Translator tools.

**9 Career Paths with Detailed Progression (1-7 years experience):**
Each career path includes multiple experience levels with:
- Job titles (3-5 alternative titles per level)
- Required skills and competencies
- Recommended certifications (4-5 per level)
- Portfolio project examples
- Salary ranges (hourly $18-$200/hr and annual $37K-$416K, USD national average)

**Career Transitions Network:**
- Natural progressions between career paths (e.g., Citizen Developer → Project Manager)
- Lateral moves (e.g., Network Ops → Data Analyst)
- Technical upskilling paths (e.g., Citizen Developer → Cloud Operations)
- Specialization tracks (e.g., Cloud Ops → Cloud Computing)
- Management tracks (e.g., Data Analyst → Project Manager)

**Industry Context (8 Sectors):**
ISV, IHV, CSP, MSP, VAR, Distributor, ISP, Telco
- Each functional role has 3-5 sector-specific job title variations
- Understand how "Data Analyst" translates to different titles at ISVs vs CSPs vs Telcos
- Helps users understand their options across different company types

**How to Use Career Guidance Data:**

When users ask "What skills do I need for [role]?" → Reference the career path data by experience year
When users ask "How much do [job titles] make?" → Provide both hourly and annual salary ranges from the data
When users ask "What certifications should I get?" → Recommend from the appropriate career level
When users ask "What would my title be at [company type]?" → Use role translator to show sector-specific titles
When users ask "How do I transition from [X] to [Y]?" → Explain using career transition network with transition types
When users ask "What portfolio projects should I build?" → Suggest from portfolioProjects arrays for their target level
When users ask "I have X years experience, what's next?" → Look up their career year and recommend next level

**Personalized Career Guidance:**
- Compare user's experiences/technologies against career path requirements
- Identify gaps in skills, certifications, or portfolio
- Suggest concrete next steps based on current vs. target level
- Calculate years of experience from date ranges in user's experiences
- Match user's current title/role to career path levels using job titles arrays

AVAILABLE ACTIONS (use sparingly):
You can include actions in your responses using JSON code blocks:
\`\`\`json
{
  "action": "navigate",
  "params": {"view": "learner"}
}
\`\`\`

Action types:
- navigate: Switch views ONLY if user explicitly requests it {"action": "navigate", "params": {"view": "seeker"|"learner"}}
  * "seeker" = Job search view (job opportunities, applications, interview prep)
  * "learner" = Learning view (goals, portfolio, skill development)
  * Note: Other views are not yet implemented and will be blocked
- showToast: Display brief notifications {"action": "showToast", "params": {"message": "text", "type": "success"|"info"|"error"}}
- openModal: Open forms ONLY when user asks to create something {"action": "openModal", "params": {"modal": "addJob"|"addExperience"|"addStory"|"addGoal"|"addDocument", "data": {...}}}
  * For addStory: When user asks you to CREATE a story (not just open the form), you MUST generate and include the story content in the data field
  * Example with data: {"action": "openModal", "params": {"modal": "addStory", "data": {"title": "Story Title", "experience": "Exact experience name from user's data", "situation": "Describe the situation...", "task": "Describe the task...", "action": "Describe the action...", "result": "Describe the result...", "competencies": ["skill1", "skill2"]}}}
  * Example without data (only to open empty form): {"action": "openModal", "params": {"modal": "addStory"}}

CRITICAL GUIDELINES:
1. Answer questions using the context data provided - it contains everything you need
2. Only execute actions (navigate, openModal) when the user explicitly requests them
3. Don't navigate between views unless the user uses words like "switch to", "show me", "go to"
4. If you lack information to answer, ask clarifying questions - don't guess
5. Focus on providing advice and answering questions rather than taking actions
6. Be conversational and helpful, but don't proactively manipulate the interface

Your role is to assist with career advice and answer questions about the user's canvas data.`;
