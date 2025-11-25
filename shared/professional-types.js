/**
 * Professional Content Types - Configuration data for Professional canvas sections
 *
 * Extracted from career-canvas.html
 *
 * Contains type definitions for:
 * - Forms (contact, survey, registration, etc.)
 * - Documents (proposals, contracts, presentations, etc.)
 * - Reports (sales dashboard, financial, project status, etc.)
 * - Templates (email, meeting agendas, project plans, etc.)
 * - ML Pipelines (content, document intelligence, analytics, etc.)
 * - Workflows (approval, onboarding, lead routing, etc.)
 *
 * Used by: career-canvas.html (Professional view slideouts)
 */

// ============================================
// Form Types
// ============================================

const formTypes = [
    {
        name: 'Contact Forms',
        icon: 'ph-envelope',
        description: 'Customer inquiry forms, feedback forms, and contact requests.',
        tags: ['Customer Service', 'Sales', 'Support']
    },
    {
        name: 'Survey Forms',
        icon: 'ph-chart-line',
        description: 'Employee surveys, customer satisfaction, and feedback collection.',
        tags: ['HR', 'Customer Success', 'Marketing']
    },
    {
        name: 'Registration Forms',
        icon: 'ph-user-plus',
        description: 'Event registration, account creation, and user onboarding.',
        tags: ['Events', 'Marketing', 'Operations']
    },
    {
        name: 'Application Forms',
        icon: 'ph-file-text',
        description: 'Job applications, program applications, and request forms.',
        tags: ['HR', 'Recruiting', 'Operations']
    },
    {
        name: 'Order Forms',
        icon: 'ph-shopping-cart',
        description: 'Product orders, service requests, and purchase forms.',
        tags: ['Sales', 'E-commerce', 'Operations']
    },
    {
        name: 'Feedback Forms',
        icon: 'ph-chat-circle-dots',
        description: 'Product feedback, service reviews, and suggestion forms.',
        tags: ['Product', 'Customer Success', 'Quality']
    }
];

// ============================================
// Document Types
// ============================================

const documentTypes = [
    {
        name: 'Proposals',
        icon: 'ph-file-text',
        description: 'Business proposals, project bids, and RFP responses.',
        tags: ['Business', 'Sales', 'Contracts']
    },
    {
        name: 'Contracts',
        icon: 'ph-file-doc',
        description: 'Legal agreements, NDAs, and service contracts.',
        tags: ['Legal', 'Compliance', 'Business']
    },
    {
        name: 'Presentations',
        icon: 'ph-presentation',
        description: 'Slide decks, pitch presentations, and meeting materials.',
        tags: ['Marketing', 'Sales', 'Internal']
    },
    {
        name: 'Policies',
        icon: 'ph-book',
        description: 'Company policies, procedures, and guidelines.',
        tags: ['HR', 'Compliance', 'Operations']
    },
    {
        name: 'Manuals',
        icon: 'ph-notebook',
        description: 'User guides, training materials, and documentation.',
        tags: ['Training', 'Support', 'Operations']
    },
    {
        name: 'Invoices',
        icon: 'ph-receipt',
        description: 'Billing documents, invoices, and payment records.',
        tags: ['Finance', 'Accounting', 'Business']
    }
];

// ============================================
// Report Types
// ============================================

const reportTypes = [
    {
        name: 'Sales Dashboard',
        icon: 'ph-chart-line',
        description: 'Revenue tracking, pipeline analysis, and sales performance metrics.',
        tags: ['Sales', 'Revenue', 'KPIs']
    },
    {
        name: 'Financial Reports',
        icon: 'ph-currency-dollar',
        description: 'P&L statements, balance sheets, and cash flow analysis.',
        tags: ['Finance', 'Accounting', 'Executive']
    },
    {
        name: 'Project Status',
        icon: 'ph-kanban',
        description: 'Project timelines, milestone tracking, and resource utilization.',
        tags: ['Projects', 'Operations', 'Management']
    },
    {
        name: 'Customer Analytics',
        icon: 'ph-users-three',
        description: 'Customer behavior, retention rates, and satisfaction scores.',
        tags: ['Customer Success', 'Analytics', 'Marketing']
    },
    {
        name: 'Performance Metrics',
        icon: 'ph-gauge',
        description: 'Team performance, productivity tracking, and OKR progress.',
        tags: ['HR', 'Management', 'Operations']
    },
    {
        name: 'Marketing Analytics',
        icon: 'ph-megaphone',
        description: 'Campaign performance, lead generation, and conversion rates.',
        tags: ['Marketing', 'Analytics', 'Sales']
    }
];

// ============================================
// Template Types
// ============================================

const templateTypes = [
    {
        name: 'Email Templates',
        icon: 'ph-envelope',
        description: 'Pre-written emails for common business communications.',
        tags: ['Communication', 'Sales', 'Support']
    },
    {
        name: 'Meeting Agendas',
        icon: 'ph-calendar-check',
        description: 'Structured agendas for meetings and planning sessions.',
        tags: ['Meetings', 'Operations', 'Management']
    },
    {
        name: 'Report Templates',
        icon: 'ph-file-chart',
        description: 'Standardized formats for recurring reports and analysis.',
        tags: ['Reporting', 'Analytics', 'Executive']
    },
    {
        name: 'Onboarding Checklists',
        icon: 'ph-user-plus',
        description: 'Step-by-step guides for employee onboarding processes.',
        tags: ['HR', 'Training', 'Operations']
    },
    {
        name: 'Project Plans',
        icon: 'ph-folder-notch',
        description: 'Project planning templates with timelines and deliverables.',
        tags: ['Projects', 'Management', 'Operations']
    },
    {
        name: 'SOP Documents',
        icon: 'ph-list-checks',
        description: 'Standard operating procedure templates for processes.',
        tags: ['Operations', 'Compliance', 'Training']
    }
];

// ============================================
// Pipeline Types (ML Pipelines)
// ============================================

const pipelineTypes = [
    {
        name: 'Cleansheet Content Pipeline',
        icon: 'ph-flow-arrow',
        description: 'AI-powered content transformation from corpus to multi-format, multi-language delivery with interactive NL interfaces.',
        tags: ['Content', 'ML Processing', 'Multi-format']
    },
    {
        name: 'Document Intelligence Pipeline',
        icon: 'ph-file-magnifying-glass',
        description: 'Extract, analyze, and classify documents using OCR, NLP, and entity recognition for automated processing.',
        tags: ['OCR', 'NLP', 'Classification']
    },
    {
        name: 'Customer Analytics Pipeline',
        icon: 'ph-chart-line-up',
        description: 'Real-time customer behavior analysis with sentiment detection, churn prediction, and recommendation generation.',
        tags: ['Analytics', 'Prediction', 'Real-time']
    },
    {
        name: 'Image Recognition Pipeline',
        icon: 'ph-image',
        description: 'Computer vision pipeline for object detection, facial recognition, and automated image tagging and categorization.',
        tags: ['Computer Vision', 'Detection', 'Tagging']
    },
    {
        name: 'Voice Processing Pipeline',
        icon: 'ph-microphone',
        description: 'Speech-to-text transcription, voice authentication, and natural language understanding for voice applications.',
        tags: ['Speech', 'Transcription', 'NLU']
    }
];

// ============================================
// Workflow Types
// ============================================

const workflowTypes = [
    {
        name: 'Approval Workflows',
        icon: 'ph-check-circle',
        description: 'Multi-level approval processes for documents and requests.',
        tags: ['Operations', 'Management', 'Compliance']
    },
    {
        name: 'Onboarding Automation',
        icon: 'ph-users',
        description: 'Automated employee onboarding with task assignments.',
        tags: ['HR', 'Operations', 'Automation']
    },
    {
        name: 'Lead Routing',
        icon: 'ph-arrow-circle-right',
        description: 'Automatic lead assignment based on criteria and availability.',
        tags: ['Sales', 'Marketing', 'Automation']
    },
    {
        name: 'Issue Escalation',
        icon: 'ph-warning-circle',
        description: 'Automatic escalation of issues based on severity and time.',
        tags: ['Support', 'Operations', 'Management']
    },
    {
        name: 'Document Review',
        icon: 'ph-file-magnifying-glass',
        description: 'Collaborative document review and feedback collection.',
        tags: ['Collaboration', 'Operations', 'Quality']
    },
    {
        name: 'Inventory Alerts',
        icon: 'ph-package',
        description: 'Automated notifications for low stock and reorder points.',
        tags: ['Inventory', 'Operations', 'Automation']
    }
];
