/**
 * Table Configuration - Extracted from career-canvas.html
 *
 * Contains:
 * - TABLE_TYPES: Table definitions with icons, descriptions, and column schemas
 * - POSTGRES_COLUMN_TYPES: PostgreSQL-aligned column type definitions with icons
 *
 * Used by: career-canvas.html (Database/Tables view)
 */

// ============================================
// Table Type Definitions
// ============================================

/**
 * Standard table types for the visual database editor
 * Each table includes schema definition and visual metadata
 */
const TABLE_TYPES = [
    {
        name: 'Contacts',
        icon: 'ph-address-book',
        description: 'People and organizations with contact information, roles, and relationships.',
        columns: ['Name', 'Email', 'Phone', 'Company', 'Role', 'Location', 'Notes']
    },
    {
        name: 'Customers',
        icon: 'ph-users',
        description: 'Customer records with account details, history, and engagement data.',
        columns: ['Customer ID', 'Name', 'Email', 'Account Type', 'Status', 'Created Date', 'Lifetime Value']
    },
    {
        name: 'Projects',
        icon: 'ph-folder',
        description: 'Project tracking with timelines, resources, and deliverables.',
        columns: ['Project Name', 'Status', 'Start Date', 'End Date', 'Budget', 'Team', 'Priority']
    },
    {
        name: 'Tasks',
        icon: 'ph-check-square',
        description: 'Task management with assignments, deadlines, and dependencies.',
        columns: ['Task Name', 'Assigned To', 'Due Date', 'Status', 'Priority', 'Tags', 'Progress']
    },
    {
        name: 'Inventory',
        icon: 'ph-package',
        description: 'Product or asset inventory with quantities, locations, and specifications.',
        columns: ['Item Name', 'SKU', 'Quantity', 'Location', 'Supplier', 'Cost', 'Last Updated']
    },
    {
        name: 'Vendors',
        icon: 'ph-handshake',
        description: 'Vendor and supplier information with contracts and performance metrics.',
        columns: ['Vendor Name', 'Contact', 'Services', 'Contract Start', 'Contract End', 'Rating', 'Notes']
    },
    {
        name: 'Events',
        icon: 'ph-calendar',
        description: 'Event planning and scheduling with attendees and logistics.',
        columns: ['Event Name', 'Date', 'Time', 'Location', 'Attendees', 'Status', 'Budget']
    },
    {
        name: 'Assets',
        icon: 'ph-briefcase',
        description: 'Equipment and resource tracking with maintenance and ownership.',
        columns: ['Asset Name', 'Type', 'Owner', 'Location', 'Purchase Date', 'Value', 'Status']
    },
    {
        name: 'Issues',
        icon: 'ph-warning',
        description: 'Issue and bug tracking with severity, assignments, and resolutions.',
        columns: ['Issue ID', 'Title', 'Severity', 'Status', 'Assigned To', 'Created Date', 'Resolved Date']
    },
    {
        name: 'Expenses',
        icon: 'ph-receipt',
        description: 'Expense tracking and reimbursement management.',
        columns: ['Date', 'Category', 'Amount', 'Vendor', 'Payment Method', 'Status', 'Receipt']
    }
];

// ============================================
// PostgreSQL Column Types
// ============================================

/**
 * PostgreSQL-aligned column types for the visual database editor
 * Used for column type selection in table schema editing
 */
const POSTGRES_COLUMN_TYPES = [
    { value: 'text', label: 'Text', icon: 'ph-text-aa' },
    { value: 'varchar', label: 'VARCHAR', icon: 'ph-text-aa' },
    { value: 'integer', label: 'Integer', icon: 'ph-hash' },
    { value: 'bigint', label: 'Big Integer', icon: 'ph-hash' },
    { value: 'numeric', label: 'Numeric', icon: 'ph-number-square-one' },
    { value: 'decimal', label: 'Decimal', icon: 'ph-number-square-one' },
    { value: 'real', label: 'Real', icon: 'ph-number-square-one' },
    { value: 'double', label: 'Double Precision', icon: 'ph-number-square-one' },
    { value: 'boolean', label: 'Boolean', icon: 'ph-check-square' },
    { value: 'date', label: 'Date', icon: 'ph-calendar-blank' },
    { value: 'timestamp', label: 'Timestamp', icon: 'ph-clock' },
    { value: 'timestamptz', label: 'Timestamp with TZ', icon: 'ph-clock' },
    { value: 'time', label: 'Time', icon: 'ph-clock' },
    { value: 'interval', label: 'Interval', icon: 'ph-timer' },
    { value: 'json', label: 'JSON', icon: 'ph-brackets-curly' },
    { value: 'jsonb', label: 'JSONB', icon: 'ph-brackets-curly' },
    { value: 'uuid', label: 'UUID', icon: 'ph-fingerprint' },
    { value: 'array', label: 'Array', icon: 'ph-list' },
    { value: 'bytea', label: 'Bytea', icon: 'ph-file-code' }
];

// ============================================
// Table Schema Templates
// ============================================

/**
 * Pre-defined table templates for guided table creation wizard
 * Each template includes full PostgreSQL schema definitions
 */
const tableTemplates = {
    inventory: {
        name: 'Inventory Management',
        tableName: 'inventory_items',
        columns: [
            { name: 'id', dataType: 'serial', primaryKey: true, notNull: true },
            { name: 'item_name', dataType: 'varchar', notNull: true },
            { name: 'sku', dataType: 'varchar', unique: true },
            { name: 'quantity', dataType: 'integer', notNull: true },
            { name: 'location', dataType: 'varchar' },
            { name: 'supplier', dataType: 'varchar' },
            { name: 'reorder_point', dataType: 'integer' },
            { name: 'unit_cost', dataType: 'decimal' },
            { name: 'last_updated', dataType: 'timestamptz' }
        ]
    },
    calendar: {
        name: 'Event Calendar',
        tableName: 'events',
        columns: [
            { name: 'id', dataType: 'serial', primaryKey: true, notNull: true },
            { name: 'event_name', dataType: 'varchar', notNull: true },
            { name: 'event_date', dataType: 'date', notNull: true },
            { name: 'event_time', dataType: 'time' },
            { name: 'attendees', dataType: 'text' },
            { name: 'location', dataType: 'varchar' },
            { name: 'status', dataType: 'varchar' },
            { name: 'reminder_sent', dataType: 'boolean' },
            { name: 'created_at', dataType: 'timestamptz' }
        ]
    },
    backlog: {
        name: 'Sprint Backlog',
        tableName: 'backlog_items',
        columns: [
            { name: 'id', dataType: 'serial', primaryKey: true, notNull: true },
            { name: 'title', dataType: 'varchar', notNull: true },
            { name: 'description', dataType: 'text' },
            { name: 'priority', dataType: 'varchar' },
            { name: 'story_points', dataType: 'integer' },
            { name: 'assignee', dataType: 'varchar' },
            { name: 'sprint', dataType: 'varchar' },
            { name: 'status', dataType: 'varchar', notNull: true },
            { name: 'created_at', dataType: 'timestamptz' }
        ]
    },
    assets: {
        name: 'Asset Management',
        tableName: 'assets',
        columns: [
            { name: 'id', dataType: 'serial', primaryKey: true, notNull: true },
            { name: 'asset_name', dataType: 'varchar', notNull: true },
            { name: 'asset_type', dataType: 'varchar' },
            { name: 'owner', dataType: 'varchar' },
            { name: 'purchase_date', dataType: 'date' },
            { name: 'purchase_value', dataType: 'decimal' },
            { name: 'current_value', dataType: 'decimal' },
            { name: 'location', dataType: 'varchar' },
            { name: 'status', dataType: 'varchar' }
        ]
    },
    wip: {
        name: 'Work in Progress',
        tableName: 'wip_projects',
        columns: [
            { name: 'id', dataType: 'serial', primaryKey: true, notNull: true },
            { name: 'project_name', dataType: 'varchar', notNull: true },
            { name: 'description', dataType: 'text' },
            { name: 'status', dataType: 'varchar', notNull: true },
            { name: 'progress_percent', dataType: 'integer' },
            { name: 'due_date', dataType: 'date' },
            { name: 'owner', dataType: 'varchar' },
            { name: 'started_at', dataType: 'timestamptz' },
            { name: 'completed_at', dataType: 'timestamptz' }
        ]
    },
    contacts: {
        name: 'Contacts & CRM',
        tableName: 'contacts',
        columns: [
            { name: 'id', dataType: 'serial', primaryKey: true, notNull: true },
            { name: 'full_name', dataType: 'varchar', notNull: true },
            { name: 'email', dataType: 'varchar', unique: true },
            { name: 'phone', dataType: 'varchar' },
            { name: 'company', dataType: 'varchar' },
            { name: 'role', dataType: 'varchar' },
            { name: 'notes', dataType: 'text' },
            { name: 'last_contacted', dataType: 'date' },
            { name: 'created_at', dataType: 'timestamptz' }
        ]
    }
};

// ============================================
// Default Table Column Definitions
// ============================================

/**
 * Column definitions for default table types
 * Used in form builder foreign key selection
 */
const defaultTableColumns = {
    'Contacts': ['ID', 'Name', 'Email', 'Phone', 'Company', 'Role', 'Location', 'Notes'],
    'Customers': ['Customer_ID', 'Name', 'Email', 'Account_Type', 'Status', 'Contact_ID', 'Created_Date', 'Lifetime_Value'],
    'Projects': ['Project_ID', 'Project_Name', 'Status', 'Start_Date', 'End_Date', 'Customer_ID', 'Budget', 'Team', 'Priority'],
    'Tasks': ['Task_ID', 'Task_Name', 'Assigned_To_ID', 'Due_Date', 'Status', 'Project_ID', 'Priority', 'Tags', 'Progress'],
    'Inventory': ['Item_ID', 'Item_Name', 'SKU', 'Quantity', 'Location', 'Supplier_ID', 'Cost', 'Last_Updated'],
    'Vendors': ['Vendor_ID', 'Vendor_Name', 'Contact', 'Services', 'Contract_Start', 'Contract_End', 'Rating', 'Notes'],
    'Events': ['Event_ID', 'Event_Name', 'Date', 'Time', 'Location', 'Project_ID', 'Attendees', 'Status', 'Budget'],
    'Assets': ['Asset_ID', 'Asset_Name', 'Type', 'Owner_ID', 'Location', 'Vendor_ID', 'Purchase_Date', 'Value', 'Status'],
    'Issues': ['Issue_ID', 'Title', 'Severity', 'Status', 'Assigned_To_ID', 'Project_ID', 'Created_Date', 'Resolved_Date'],
    'Expenses': ['Expense_ID', 'Date', 'Category', 'Amount', 'Vendor_ID', 'Project_ID', 'Submitted_By_ID', 'Payment_Method', 'Status', 'Receipt']
};

/**
 * Default table names for form foreign key selection
 */
const defaultTables = [
    'Contacts', 'Customers', 'Projects', 'Tasks', 'Inventory',
    'Vendors', 'Events', 'Assets', 'Issues', 'Expenses'
];
