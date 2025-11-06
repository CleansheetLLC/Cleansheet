// Seed Example Documents for Three Personas
// Run this script in the browser console to create example documents

const personaDocuments = {
    'retail-manager': [
        {
            name: 'Store Operations Playbook',
            description: 'Comprehensive guide for daily store operations, opening/closing procedures, and staff scheduling protocols.',
            content: ''
        },
        {
            name: 'Customer Service Training Manual',
            description: 'Training materials for new hires covering customer engagement, conflict resolution, and company policies.',
            content: ''
        },
        {
            name: 'Inventory Management Best Practices',
            description: 'Documentation of inventory tracking systems, reordering procedures, and loss prevention strategies.',
            content: ''
        }
    ],
    'research-chemist': [
        {
            name: 'Lab Safety & Compliance Protocol',
            description: 'Safety procedures, chemical handling guidelines, and regulatory compliance documentation for laboratory operations.',
            content: ''
        },
        {
            name: 'Experimental Procedures - Polymer Synthesis',
            description: 'Detailed methodology for polymer synthesis experiments including materials, equipment setup, and analysis techniques.',
            content: ''
        },
        {
            name: 'Quality Control Standards & Testing',
            description: 'Quality assurance protocols, testing procedures, and acceptance criteria for research outputs.',
            content: ''
        }
    ],
    'data-analyst': [
        {
            name: 'SQL Query Library & Documentation',
            description: 'Collection of reusable SQL queries for common reporting needs, with explanations and optimization notes.',
            content: ''
        },
        {
            name: 'Dashboard Design Standards',
            description: 'Guidelines for creating effective data visualizations, color schemes, and user interface best practices.',
            content: ''
        },
        {
            name: 'Data Cleaning & Validation Procedures',
            description: 'Step-by-step processes for data quality checks, handling missing values, and ensuring data integrity.',
            content: ''
        }
    ]
};

function seedDocumentsForPersona(persona) {
    console.log(`\n=== Seeding documents for ${persona} ===`);

    // Get existing experiences and portfolio items
    const experiencesKey = `userExperiences_${persona}`;
    const portfolioKey = `userPortfolio_${persona}`;
    const documentsKey = `interview_documents_${persona}`;

    const experiences = JSON.parse(localStorage.getItem(experiencesKey) || '[]');
    const portfolio = JSON.parse(localStorage.getItem(portfolioKey) || '[]');
    const existingDocuments = JSON.parse(localStorage.getItem(documentsKey) || '[]');

    console.log(`Found ${experiences.length} experiences and ${portfolio.length} portfolio items`);

    if (experiences.length === 0 && portfolio.length === 0) {
        console.warn(`No experiences or portfolio items found for ${persona}. Creating unlinked documents.`);
    }

    const allLinkableItems = [
        ...experiences.map(exp => ({ type: 'experience', id: exp.id, name: `${exp.title || exp.role} at ${exp.company}` })),
        ...portfolio.map(item => ({ type: 'portfolio', id: item.id, name: item.name || item.title }))
    ];

    const documents = personaDocuments[persona];
    const newDocuments = [];

    documents.forEach((doc, index) => {
        // Pick a random linkable item or create unlinked
        let linkedType = 'none';
        let linkedId = '';
        let linkedName = '';

        if (allLinkableItems.length > 0) {
            const randomItem = allLinkableItems[Math.floor(Math.random() * allLinkableItems.length)];
            linkedType = randomItem.type;
            linkedId = randomItem.id;
            linkedName = randomItem.name;
        }

        const now = new Date().toISOString();
        const newDoc = {
            id: (Date.now() + index).toString(),
            name: doc.name,
            description: doc.description,
            linkedType: linkedType,
            linkedId: linkedId,
            linkedName: linkedName,
            content: doc.content,
            created: now,
            lastModified: now
        };

        newDocuments.push(newDoc);
        console.log(`✓ Created: ${doc.name} ${linkedType !== 'none' ? `(linked to ${linkedType}: ${linkedName})` : '(unlinked)'}`);
    });

    // Add to existing documents
    const allDocuments = [...existingDocuments, ...newDocuments];
    localStorage.setItem(documentsKey, JSON.stringify(allDocuments));

    console.log(`✓ Saved ${newDocuments.length} new documents for ${persona}`);
    return newDocuments.length;
}

// Seed all three personas
function seedAllDocuments() {
    console.log('🌱 Seeding example documents for all personas...\n');

    let totalCreated = 0;
    const personas = ['retail-manager', 'research-chemist', 'data-analyst'];

    personas.forEach(persona => {
        totalCreated += seedDocumentsForPersona(persona);
    });

    console.log(`\n✅ Complete! Created ${totalCreated} total documents across ${personas.length} personas.`);
    console.log('\nTo view documents, switch to each persona and open Interview Preparation > Documents');
}

// Run the seeding
seedAllDocuments();
