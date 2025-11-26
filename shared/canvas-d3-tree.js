/**
 * Canvas D3 Tree - Career Canvas V2
 *
 * D3.js tree visualization for the Canvas mindmap.
 *
 * Key patterns:
 * 1. Use .nodeSize([60, 220]) NOT .size() for fixed spacing
 * 2. Create hierarchy with full data, THEN hide children
 * 3. Toggle: close siblings, open selected, call update()
 * 4. Dynamic SVG sizing based on visible nodes
 *
 * Used by: career-canvas-v2.html
 */

// ===========================================
// CONFIGURATION
// ===========================================

const D3TreeConfig = {
    // Node dimensions
    rootWidth: 140,
    rootHeight: 60,
    childWidth: 180,
    childHeight: 50,
    grandchildWidth: 250,
    grandchildHeight: 40,

    // Tree layout
    nodeSpacingVertical: 60,
    nodeSpacingHorizontal: 220,

    // Animation
    transitionDuration: 500,

    // Text limits
    maxCharsGrandchild: 50,
    maxLinesRoot: 3,
    maxLinesChild: 2,
    maxLinesGrandchild: 2
};

// Icon mapping for category nodes
const nodeIconMap = {
    // Seeker mode
    'Job Opportunities': 'ph-briefcase',
    'Career Experience': 'ph-suitcase',
    'Goals': 'ph-target',
    'Portfolio': 'ph-folder-open',
    'Interview Prep': 'ph-chats-circle',
    // Professional mode
    'Documents': 'ph-file-text',
    'Tables': 'ph-table',
    'Forms': 'ph-clipboard-text',
    'Reports': 'ph-chart-bar',
    'Templates': 'ph-note-blank',
    'Pipelines': 'ph-flow-arrow',
    'Workflows': 'ph-git-branch',
    // Learner mode
    'Learning': 'ph-book-open',
    'Skills': 'ph-lightning',
    'Certifications': 'ph-certificate',
    // Personal mode
    'Recipes': 'ph-cooking-pot',
    'Finance': 'ph-currency-dollar',
    'Shopping': 'ph-shopping-cart'
};

// ===========================================
// GLOBAL STATE
// ===========================================

let d3TreeRoot = null;
let d3TreeExpandedNode = null;
let d3TreeNodeIdCounter = 0;

// ===========================================
// DATA STRUCTURES
// ===========================================

/**
 * Get tree data for a persona based on current view mode
 * @param {string} personaId
 * @returns {Object}
 */
function getTreeDataForPersona(personaId) {
    const viewMode = typeof canvasState !== 'undefined' ? canvasState.currentViewMode : 'seeker';
    const info = typeof personaInfo !== 'undefined' ? personaInfo[personaId] : { name: personaId };

    // Base tree structure
    const baseData = {
        name: info.name + "'s Canvas",
        children: []
    };

    // Add children based on view mode
    if (viewMode === 'seeker') {
        baseData.children = [
            { name: 'Job Opportunities', count: 5, children: [
                { name: 'Senior Developer - TechCorp' },
                { name: 'Cloud Architect - Amazon' },
                { name: 'Engineering Manager - Startup' },
                { name: 'Tech Lead - FinanceApp' },
                { name: 'Solutions Architect - Consulting' }
            ]},
            { name: 'Documents', count: 8, children: [
                { name: 'Resume - Technical Focus' },
                { name: 'Resume - Leadership Focus' },
                { name: 'Cover Letter - TechCorp' },
                { name: 'Cover Letter - Amazon' }
            ]},
            { name: 'Career Experience', count: 12, children: [
                { name: 'Current Role - 3 years' },
                { name: 'Previous Role - 2 years' },
                { name: 'Education - BS Computer Science' }
            ]},
            { name: 'Goals', count: 3, children: [
                { name: 'Short-term: New role in 6 months' },
                { name: 'Mid-term: Management track' },
                { name: 'Long-term: CTO or VP Engineering' }
            ]},
            { name: 'Portfolio', count: 6, children: [
                { name: 'GitHub Projects' },
                { name: 'Case Studies' },
                { name: 'Blog Posts' }
            ]},
            { name: 'Interview Prep', count: 15, children: [
                { name: 'Behavioral Stories (STAR format)' },
                { name: 'Technical Questions' },
                { name: 'System Design Notes' }
            ]}
        ];
    } else if (viewMode === 'professional') {
        baseData.children = [
            { name: 'Documents', count: 12, children: [
                { name: 'Project Proposal Q4' },
                { name: 'Technical Specification' },
                { name: 'Meeting Notes Archive' }
            ]},
            { name: 'Tables', count: 5, children: [
                { name: 'Contacts' },
                { name: 'Project Tracker' },
                { name: 'Inventory' }
            ]},
            { name: 'Forms', count: 3, children: [
                { name: 'Expense Report' },
                { name: 'Time Sheet' }
            ]},
            { name: 'Reports', count: 4, children: [
                { name: 'Monthly Dashboard' },
                { name: 'Q3 Analysis' }
            ]},
            { name: 'Templates', count: 6, children: [
                { name: 'Email Templates' },
                { name: 'Meeting Agendas' }
            ]},
            { name: 'Pipelines', count: 2, children: [
                { name: 'Content Pipeline' },
                { name: 'Analytics Pipeline' }
            ]},
            { name: 'Workflows', count: 3, children: [
                { name: 'Approval Workflow' },
                { name: 'Onboarding' }
            ]}
        ];
    } else if (viewMode === 'learner') {
        baseData.children = [
            { name: 'Learning', count: 8, children: [
                { name: 'Active Courses' },
                { name: 'Completed Courses' },
                { name: 'Bookmarked Articles' }
            ]},
            { name: 'Skills', count: 15, children: [
                { name: 'Technical Skills' },
                { name: 'Soft Skills' },
                { name: 'Leadership' }
            ]},
            { name: 'Goals', count: 4, children: [
                { name: 'Q4 Learning Goals' },
                { name: 'Certification Plan' }
            ]},
            { name: 'Certifications', count: 3, children: [
                { name: 'AWS Solutions Architect' },
                { name: 'PMP (In Progress)' }
            ]}
        ];
    } else if (viewMode === 'personal') {
        baseData.children = [
            { name: 'Recipes', count: 25, children: [
                { name: 'Quick Meals' },
                { name: 'Special Occasions' },
                { name: 'Meal Plans' }
            ]},
            { name: 'Finance', count: 5, children: [
                { name: 'Checking Account' },
                { name: 'Savings' },
                { name: 'Investments' }
            ]},
            { name: 'Shopping', count: 3, children: [
                { name: 'Grocery List' },
                { name: 'Wish List' }
            ]}
        ];
    }

    return baseData;
}

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Initialize the D3 tree visualization
 * @param {string} personaId
 */
function initializeD3Tree(personaId) {
    const container = document.getElementById('canvas-mindmap');
    if (!container) {
        console.warn('[canvas-d3-tree] Container #canvas-mindmap not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Reset state
    d3TreeExpandedNode = null;
    d3TreeNodeIdCounter = 0;

    // Get persona-specific data
    const data = getTreeDataForPersona(personaId);
    if (!data) {
        console.warn('[canvas-d3-tree] No data for persona:', personaId);
        return;
    }

    // Create SVG
    const svg = d3.select('#canvas-mindmap')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('min-width', width + 'px')
        .style('min-height', height + 'px');

    // Create group for zoom/pan - center root
    const g = svg.append('g')
        .attr('transform', `translate(150, ${height / 2})`);

    // Create hierarchy - D3 sees all children
    d3TreeRoot = d3.hierarchy(data);
    d3TreeRoot.x0 = 0;
    d3TreeRoot.y0 = 0;

    // Collapse second-level children (hide grandchildren initially)
    if (d3TreeRoot.children) {
        d3TreeRoot.children.forEach(child => {
            if (child.children) {
                child._children = child.children;
                child.children = null;
            }
        });
    }

    // Create groups for links and nodes
    const linkGroup = g.append('g').attr('class', 'links');
    const nodeGroup = g.append('g').attr('class', 'nodes');

    // Add link styles
    addD3TreeStyles();

    // Initial render
    updateD3Tree(d3TreeRoot, svg, g, linkGroup, nodeGroup, width, height);

    console.log('[canvas-d3-tree] Initialized for persona:', personaId);
}

// ===========================================
// UPDATE FUNCTION
// ===========================================

/**
 * Update the D3 tree visualization
 */
function updateD3Tree(source, svg, g, linkGroup, nodeGroup, width, height) {
    const config = D3TreeConfig;

    // Count visible nodes
    const visibleNodes = d3TreeRoot.descendants();
    const neededHeight = Math.max(height, visibleNodes.length * config.nodeSpacingVertical);
    const neededWidth = Math.max(width, 1000);

    // Update SVG size
    svg.style('min-width', neededWidth + 'px')
       .style('min-height', neededHeight + 'px');

    // Create tree layout with FIXED node spacing
    const treeLayout = d3.tree()
        .nodeSize([config.nodeSpacingVertical, config.nodeSpacingHorizontal])
        .separation((a, b) => {
            if (a.depth === 2 && b.depth === 2) {
                return a.parent === b.parent ? 1.0 : 1.3;
            }
            return a.parent === b.parent ? 1.0 : 1.5;
        });

    const treeData = treeLayout(d3TreeRoot);
    const nodes = treeData.descendants();
    const links = treeData.links();

    // Update links
    const link = linkGroup
        .selectAll('path')
        .data(links, d => d.target.id || (d.target.id = ++d3TreeNodeIdCounter));

    const linkEnter = link.enter()
        .insert('path', 'g')
        .attr('class', 'mindmap-link')
        .attr('d', d => {
            const o = { x: source.x0, y: source.y0 };
            return diagonal(o, o, config);
        });

    const linkUpdate = linkEnter.merge(link);
    linkUpdate.transition()
        .duration(config.transitionDuration)
        .attr('d', d => diagonal(d.source, d.target, config));

    link.exit()
        .transition()
        .duration(config.transitionDuration)
        .attr('d', d => {
            const o = { x: source.x, y: source.y };
            return diagonal(o, o, config);
        })
        .remove();

    // Update nodes
    const node = nodeGroup
        .selectAll('g')
        .data(nodes, d => d.id || (d.id = ++d3TreeNodeIdCounter));

    const nodeEnter = node.enter()
        .append('g')
        .attr('class', d => `mindmap-node ${d.depth === 0 ? 'root' : d.depth === 1 ? 'child' : 'grandchild'}`)
        .attr('transform', d => `translate(${source.y0}, ${source.x0})`);

    // Add rectangles
    nodeEnter.append('rect')
        .attr('width', d => getNodeWidth(d, config))
        .attr('height', d => getNodeHeight(d, config))
        .attr('x', d => -getNodeWidth(d, config) / 2)
        .attr('y', d => -getNodeHeight(d, config) / 2);

    // Add icons for category nodes
    nodeEnter.each(function(d) {
        if (d.depth === 1) {
            const iconClass = nodeIconMap[d.data.name];
            if (iconClass) {
                d3.select(this)
                    .append('foreignObject')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('x', -config.childWidth / 2 + 8)
                    .attr('y', -10)
                    .html(`<i class="ph ${iconClass}" style="font-size: 20px; color: #0066CC;"></i>`);
            }
        }
    });

    // Add text labels
    nodeEnter.append('text')
        .attr('dy', '0.35em')
        .attr('x', 0)
        .each(function(d) {
            const text = d3.select(this);
            const label = d.data.name;

            if (d.depth === 0) {
                text.text(label);
                wrapText(text, config.rootWidth - 20, config.maxLinesRoot);
            } else if (d.depth === 1) {
                text.text(label);
                wrapText(text, config.childWidth - 20, config.maxLinesChild);
            } else {
                const maxChars = config.maxCharsGrandchild;
                const truncatedLabel = label.length > maxChars
                    ? label.substring(0, maxChars) + '...'
                    : label;
                text.text(truncatedLabel);
                wrapText(text, config.grandchildWidth - 20, config.maxLinesGrandchild);
            }
        });

    // Click handler
    nodeEnter.on('click', function(event, d) {
        event.stopPropagation();

        // Close any open dropdowns (e.g., profile menu)
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown) profileDropdown.classList.remove('active');

        // Check if mobile viewport (768px or less)
        const isMobile = window.innerWidth <= 768;

        if (d.depth === 1) {
            const nodeName = d.data.name;

            // Check for slideout nodes
            if (typeof handleNodeClick === 'function') {
                handleNodeClick(nodeName, d);
            } else {
                // Default: toggle expand/collapse
                toggleD3Node(d, svg, g, linkGroup, nodeGroup, width, height);
            }
        } else if (d.depth === 2 && isMobile) {
            // Mobile: grandchild nodes open slideouts directly
            const nodeName = d.data.name;
            if (typeof handleNodeClick === 'function') {
                handleNodeClick(nodeName, d);
            }
        }
    });

    // Update existing nodes
    const nodeUpdate = nodeEnter.merge(node);
    nodeUpdate.transition()
        .duration(config.transitionDuration)
        .attr('transform', d => `translate(${d.y}, ${d.x})`);

    // Update cursor
    const isMobile = window.innerWidth <= 768;
    nodeUpdate.style('cursor', d => {
        if (d.depth === 1 && (d.children || d._children)) {
            return 'pointer';
        }
        // On mobile, grandchild nodes are also tappable
        if (d.depth === 2 && isMobile) {
            return 'pointer';
        }
        return 'default';
    });

    // Update rect styling
    nodeUpdate.select('rect')
        .attr('class', d => {
            if (d.depth === 1) {
                return d.children ? 'expanded' : 'collapsed';
            }
            return '';
        });

    // Remove old nodes
    node.exit()
        .transition()
        .duration(config.transitionDuration)
        .attr('transform', d => `translate(${source.y}, ${source.x})`)
        .remove();

    // Store positions for transitions
    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get node width based on depth
 */
function getNodeWidth(d, config) {
    if (d.depth === 0) return config.rootWidth;
    if (d.depth === 1) return config.childWidth;
    return config.grandchildWidth;
}

/**
 * Get node height based on depth
 */
function getNodeHeight(d, config) {
    if (d.depth === 0) return config.rootHeight;
    if (d.depth === 1) return config.childHeight;
    return config.grandchildHeight;
}

/**
 * Link diagonal function (curved path)
 */
function diagonal(s, d, config) {
    const sourceX = s.y + getNodeWidth(s, config) / 2;
    const sourceY = s.x;
    const targetX = d.y - getNodeWidth(d, config) / 2;
    const targetY = d.x;

    const midX = (sourceX + targetX) / 2;
    return `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
}

/**
 * Toggle node expand/collapse (one at a time)
 */
function toggleD3Node(d, svg, g, linkGroup, nodeGroup, width, height) {
    if (!d._children && !d.children) {
        return; // No children to toggle
    }

    if (d._children) {
        // Close other open nodes
        d3TreeRoot.children.forEach(child => {
            if (child !== d && child.children) {
                child._children = child.children;
                child.children = null;
            }
        });

        // Open this node
        d.children = d._children;
        d._children = null;
        d3TreeExpandedNode = d;

        // Update canvas state
        if (typeof setExpandedNode === 'function') {
            setExpandedNode(d.data.name);
        }
    } else {
        // Close this node
        d._children = d.children;
        d.children = null;
        d3TreeExpandedNode = null;

        if (typeof setExpandedNode === 'function') {
            setExpandedNode(null);
        }
    }

    updateD3Tree(d, svg, g, linkGroup, nodeGroup, width, height);
}

/**
 * Text wrapping function
 */
function wrapText(text, maxWidth, maxLines) {
    const textNode = text.node();
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.1;
    const y = text.attr('y') || 0;

    text.text(null);
    let tspan = text.append('tspan')
        .attr('x', text.attr('x') || 0)
        .attr('y', y);

    while ((word = words.pop())) {
        if (lineNumber >= maxLines) {
            break;
        }

        line.push(word);
        tspan.text(line.join(' '));

        if (tspan.node().getComputedTextLength() > maxWidth) {
            line.pop();

            if (lineNumber === maxLines - 1 && words.length > 0) {
                tspan.text(line.join(' ') + '...');
            } else {
                tspan.text(line.join(' '));
            }

            line = [word];
            lineNumber++;

            if (lineNumber < maxLines) {
                tspan = text.append('tspan')
                    .attr('x', text.attr('x') || 0)
                    .attr('y', y)
                    .attr('dy', lineNumber * lineHeight + 'em')
                    .text(word);
            }
        }
    }

    // Center text vertically
    const tspans = text.selectAll('tspan');
    const numLines = tspans.size();
    if (numLines > 1) {
        tspans.attr('dy', function(d, i) {
            return (i - (numLines - 1) / 2) * lineHeight + 'em';
        });
    } else if (numLines === 1) {
        // Single line - center vertically with dominant-baseline
        tspans.attr('dy', '0.35em');
    }
}

/**
 * Add D3 tree CSS styles dynamically
 */
function addD3TreeStyles() {
    if (document.getElementById('d3-tree-styles')) {
        return; // Already added
    }

    const styles = `
        .mindmap-link {
            fill: none;
            stroke: #e5e5e7;
            stroke-width: 2px;
        }

        .mindmap-node rect {
            fill: white;
            stroke: #e5e5e7;
            stroke-width: 2px;
            rx: 8px;
            ry: 8px;
            transition: all 0.2s;
        }

        .mindmap-node.root rect {
            fill: #0066CC;
            stroke: none;
        }

        .mindmap-node.root text {
            fill: white;
            font-family: 'Questrial', sans-serif;
            font-size: 14px;
            font-weight: 600;
            text-anchor: middle;
        }

        .mindmap-node.child rect {
            fill: white;
            stroke: #e5e5e7;
        }

        .mindmap-node.child rect.expanded {
            fill: #e3f2fd;
            stroke: #0066CC;
        }

        .mindmap-node.child rect:hover {
            stroke: #0066CC;
            filter: drop-shadow(0 2px 4px rgba(0, 102, 204, 0.2));
        }

        .mindmap-node.child text {
            fill: #333333;
            font-family: 'Questrial', sans-serif;
            font-size: 12px;
            font-weight: 600;
            text-anchor: middle;
        }

        .mindmap-node.grandchild rect {
            fill: #f5f5f7;
            stroke: #e5e5e7;
        }

        .mindmap-node.grandchild rect:hover {
            fill: white;
            stroke: #0066CC;
        }

        .mindmap-node.grandchild text {
            fill: #666666;
            font-family: 'Barlow', sans-serif;
            font-size: 11px;
            text-anchor: middle;
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'd3-tree-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
}

// ===========================================
// PUBLIC API
// ===========================================

/**
 * Refresh the tree with current persona
 */
function refreshD3Tree() {
    const persona = typeof canvasState !== 'undefined'
        ? canvasState.currentPersona
        : 'retail-manager';
    initializeD3Tree(persona);
}

/**
 * Get currently expanded node name
 * @returns {string|null}
 */
function getExpandedNodeName() {
    return d3TreeExpandedNode ? d3TreeExpandedNode.data.name : null;
}

// ===========================================
// EXPORTS
// ===========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        D3TreeConfig,
        nodeIconMap,
        initializeD3Tree,
        refreshD3Tree,
        getTreeDataForPersona,
        getExpandedNodeName
    };
}
