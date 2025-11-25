/**
 * Cleansheet Canvas - Persona Data Definitions
 * This file contains the persona templates for the D3 mindmap visualization.
 * Extracted from career-canvas.html to improve maintainability and reduce file size.
 */

window.personaData = {
    'default': {
        name: 'User',
        goal: '',
        children: [
            {
                name: 'Job Opportunities',
                tier: 'seeker',  // Required tier for this node
                count: 0,
                children: []
            },
            {
                name: 'Career Experience',
                tier: 'member',  // Available to all tiers
                count: 0,
                children: []
            },
            {
                name: 'Goals',
                tier: 'learner',  // Required tier for this node
                count: 0,
                children: []
            },
            {
                name: 'Portfolio',
                tier: 'learner',  // Required tier for this node
                count: 0,
                children: []
            },
            {
                name: 'Interview Prep',
                tier: 'member',  // Available to all tiers
                count: 0,
                children: []
            }
        ]
    },
    'career-changer': {
        name: 'Marcus Thompson',
        goal: 'Store Manager → Analytics',
        children: [
            {
                name: 'Job Opportunities',
                tier: 'seeker',
                count: 0,
                children: []
            },
            {
                name: 'Career Experience',
                tier: 'member',
                count: 0,
                children: []
            },
            {
                name: 'Goals',
                tier: 'learner',
                count: 0,
                children: []
            },
            {
                name: 'Portfolio',
                tier: 'learner',
                count: 0,
                children: []
            },
            {
                name: 'Interview Prep',
                tier: 'member',
                count: 0,
                children: []
            }
        ]
    },
    'product-manager': {
        name: 'Dr. Sarah Chen',
        goal: 'Research Scientist → Data Science',
        children: [
            {
                name: 'Job Opportunities',
                tier: 'seeker',
                count: 0,
                children: []
            },
            {
                name: 'Career Experience',
                tier: 'member',
                count: 0,
                children: []
            },
            {
                name: 'Goals',
                tier: 'learner',
                count: 0,
                children: []
            },
            {
                name: 'Portfolio',
                tier: 'learner',
                count: 0,
                children: []
            },
            {
                name: 'Interview Prep',
                tier: 'member',
                count: 0,
                children: []
            }
        ]
    },
    'new-graduate': {
        name: 'Jamie Rodriguez',
        goal: 'CS Graduate → Software Engineering',
        children: [
            {
                name: 'Job Opportunities',
                tier: 'seeker',
                count: 0,
                children: []
            },
            {
                name: 'Career Experience',
                tier: 'member',
                count: 0,
                children: []
            },
            {
                name: 'Goals',
                tier: 'learner',
                count: 0,
                children: []
            },
            {
                name: 'Portfolio',
                tier: 'learner',
                count: 0,
                children: []
            },
            {
                name: 'Interview Prep',
                tier: 'member',
                count: 0,
                children: []
            }
        ]
    }
};