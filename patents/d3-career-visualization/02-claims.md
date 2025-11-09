# Patent Claims: Interactive Career Portfolio Visualization System

## INDEPENDENT CLAIMS

### Claim 1 (System Claim)

A computer-implemented interactive career portfolio visualization system comprising:

a) a memory storing a bidirectional career knowledge graph data structure comprising:
   - a plurality of career experience records, each record including experience metadata and tagged competencies,
   - a plurality of narrative story records, each record linked to at least one career experience record and including competency tags that correspond to competencies in said linked career experience records,
   - a plurality of portfolio item records, each record linked to at least one narrative story record and including competency tags that correspond to competencies in said linked narrative story records,
   - bidirectional relationship data connecting said career experience records, narrative story records, and portfolio item records through said competency tags;

b) a processor configured to execute instructions to:
   - generate a hierarchical tree data structure from said bidirectional career knowledge graph using a D3.js tree layout algorithm with predetermined fixed node spacing defined by vertical and horizontal pixel dimensions,
   - initialize said hierarchical tree structure by storing all child nodes in hidden properties while displaying only parent nodes,
   - render an interactive visualization interface displaying said tree structure with expandable nodes;

c) a user interface module configured to:
   - receive user interaction input selecting a tree node for expansion,
   - automatically collapse any sibling nodes at the same hierarchical level as said selected node,
   - expand said selected node to reveal its child nodes while maintaining predetermined spacing relationships,
   - enable navigation between different entry points within said career knowledge graph including career experience records, narrative story records, and portfolio item records.

### Claim 2 (Method Claim)

A computer-implemented method for visualizing career portfolio data comprising:

a) receiving career portfolio data including:
   - career experience information with associated competency tags,
   - narrative story information with competency tags and links to career experiences,
   - portfolio item information with competency tags and links to narrative stories;

b) creating a bidirectional relationship mapping between said career experience information, narrative story information, and portfolio item information based on matching competency tags;

c) generating a hierarchical tree data structure using a D3.js library with a fixed-node layout algorithm that positions nodes according to predetermined vertical and horizontal spacing parameters rather than force-directed simulation;

d) initializing said tree data structure by:
   - creating a complete hierarchy structure including all nodes and relationships,
   - storing child nodes in hidden data properties,
   - rendering only parent-level nodes in an initial visualization state;

e) responding to user interaction by:
   - detecting selection of a tree node for expansion,
   - automatically collapsing sibling nodes at the same hierarchical level,
   - revealing child nodes of said selected node through animated transition,
   - maintaining fixed spacing relationships during expansion and collapse operations;

f) enabling multi-entry point navigation allowing users to initiate exploration from any node type within said career knowledge graph.

### Claim 3 (Computer-Readable Medium Claim)

A non-transitory computer-readable medium storing instructions that, when executed by a processor, cause the processor to perform operations comprising:

a) constructing a bidirectional career knowledge graph linking career experiences, narrative stories, and portfolio items through shared competency tagging relationships;

b) implementing a D3.js tree visualization using a nodeSize() method with fixed vertical and horizontal spacing parameters to ensure deterministic node positioning;

c) managing tree node visibility by storing complete hierarchical structure in memory while selectively displaying nodes based on user interaction state;

d) controlling node expansion through a one-level-at-a-time algorithm that automatically collapses sibling nodes when expanding a selected node;

e) providing multiple navigation entry points enabling users to begin career exploration from experience nodes, story nodes, or portfolio nodes;

f) generating competency proof chains by tracing tagged relationships from portfolio items through narrative stories to originating career experiences.

## DEPENDENT CLAIMS

### Claim 4 (Dependent on Claim 1)

The system of claim 1, wherein said D3.js tree layout algorithm includes a custom separation function that applies different spacing rules for nodes at different hierarchical depths, including closer spacing for nodes sharing the same parent and wider spacing for nodes with different parents.

### Claim 5 (Dependent on Claim 1)

The system of claim 1, wherein said competency tags create proof chains by tracking identical competency identifiers across career experience records, narrative story records, and portfolio item records, and wherein said system calculates proof chain strength based on consistency and completeness of competency evidence.

### Claim 6 (Dependent on Claim 2)

The method of claim 2, further comprising lazy loading of child nodes wherein child node data is retrieved asynchronously when a parent node is selected for expansion, thereby reducing initial data loading time for large career datasets.

### Claim 7 (Dependent on Claim 1)

The system of claim 1, wherein said user interface module includes animation transitions with predetermined duration between node expansion and collapse states, said transitions maintaining visual continuity during tree structure changes.

### Claim 8 (Dependent on Claim 2)

The method of claim 2, wherein said fixed-node layout algorithm prevents node overlap through predetermined pixel spacing that accounts for node content dimensions including text length and graphical elements.

### Claim 9 (Dependent on Claim 1)

The system of claim 1, further comprising a competency analysis module configured to identify competency development patterns across career experiences and generate competency progression visualizations showing skill advancement over time.

### Claim 10 (Dependent on Claim 2)

The method of claim 2, further comprising responsive layout adaptation wherein node spacing parameters and visibility levels are adjusted based on display device characteristics including screen width, screen height, and device type.

### Claim 11 (Dependent on Claim 1)

The system of claim 1, wherein said bidirectional relationship data includes relationship strength metrics based on frequency of competency tag matching and temporal proximity of linked career events.

### Claim 12 (Dependent on Claim 3)

The computer-readable medium of claim 3, wherein said instructions further cause the processor to implement memory management for large career datasets by maintaining a least-recently-used cache of tree nodes and evicting unused nodes when memory thresholds are exceeded.

### Claim 13 (Dependent on Claim 2)

The method of claim 2, further comprising exporting said bidirectional career knowledge graph to standardized data formats including JSON and XML for integration with external career management systems.

### Claim 14 (Dependent on Claim 1)

The system of claim 1, wherein said narrative story records include structured sections for situation, task, action, and result information, and wherein said competency tags are associated with specific sections to create granular competency-to-evidence mappings.

### Claim 15 (Dependent on Claim 2)

The method of claim 2, further comprising automatically generating suggested navigation paths based on user interaction history and competency relationship strength, said suggestions directing users toward relevant career evidence and progression patterns.

### Claim 16 (Dependent on Claim 1)

The system of claim 1, wherein said tree visualization includes visual indicators distinguishing between different node types including experience nodes, story nodes, and portfolio nodes through distinctive styling, iconography, and color coding.

### Claim 17 (Dependent on Claim 2)

The method of claim 2, further comprising competency gap analysis wherein missing competency evidence is identified by analyzing incomplete proof chains and suggesting additional narrative stories or portfolio items to strengthen competency documentation.

### Claim 18 (Dependent on Claim 1)

The system of claim 1, further comprising integration interfaces for importing career data from external sources including LinkedIn profiles, resume documents, and project management systems, said interfaces automatically generating competency tags through natural language processing of imported content.

### Claim 19 (Dependent on Claim 2)

The method of claim 2, wherein said tree node expansion includes progressive disclosure of node details wherein initial expansion shows summary information and subsequent user interaction reveals detailed information including full descriptions, metrics, and related artifacts.

### Claim 20 (Dependent on Claim 1)

The system of claim 1, further comprising a collaboration module enabling multiple users to view and annotate shared career visualizations while maintaining data privacy controls and access permissions for sensitive career information.

## CLAIM INTERPRETATION NOTES

### Claim Construction Guidelines

**"Fixed-node layout algorithm"** should be construed to mean a positioning algorithm that determines node coordinates through predetermined spacing parameters rather than iterative force simulation or physics-based calculations.

**"Bidirectional career knowledge graph"** should be construed to mean a data structure where relationships between career elements can be traversed in both forward and reverse directions, enabling navigation from experiences to evidence and from evidence back to originating experiences.

**"One-level-at-a-time expansion"** should be construed to mean a user interface behavior where expanding a tree node automatically collapses sibling nodes at the same hierarchical level to prevent simultaneous multi-branch expansion.

**"Competency proof chain"** should be construed to mean a traceable path connecting a competency tag appearing in a career experience through its demonstration in a narrative story to its evidence in a portfolio item.

**"Multi-entry point navigation"** should be construed to mean the ability to begin career exploration from any node type (experience, story, or portfolio) and navigate to related nodes regardless of hierarchical position.

### Prior Art Distinctions

These claims are distinguished from prior art by:
- The specific combination of D3.js tree visualization with career portfolio data
- The bidirectional tagging system creating proof chains
- The fixed-node approach rather than force-directed positioning
- The one-level-at-a-time expansion pattern for cognitive load management
- The integration of three distinct career data types in a single navigable structure

### Commercial Implementation Coverage

These claims are designed to cover:
- Web applications implementing the described visualization system
- Mobile applications with responsive adaptations of the tree interface
- Desktop software incorporating the career knowledge graph structure
- Cloud services providing career visualization as a service
- API integrations enabling third-party implementation of the visualization method