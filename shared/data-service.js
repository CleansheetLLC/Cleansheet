/**
 * Cleansheet Data Service
 * Provides a unified interface for data operations
 * Supports both localStorage (demo) and REST API (production)
 * Version: 1.0.0
 */

class LocalStorageBackend {
    constructor() {
        this.prefix = 'cleansheet_';
    }

    async get(key) {
        const data = localStorage.getItem(this.prefix + key);
        return data ? JSON.parse(data) : null;
    }

    async set(key, value) {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
        return value;
    }

    async delete(key) {
        localStorage.removeItem(this.prefix + key);
        return true;
    }

    async list(pattern) {
        const keys = Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix + pattern))
            .map(key => key.replace(this.prefix, ''));

        return Promise.all(keys.map(key => this.get(key)));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

class ApiBackend {
    constructor(baseUrl = '/api/v1') {
        this.baseUrl = baseUrl;
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    async request(method, path, data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(this.baseUrl + path, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    async get(path) {
        return this.request('GET', path);
    }

    async post(path, data) {
        return this.request('POST', path, data);
    }

    async put(path, data) {
        return this.request('PUT', path, data);
    }

    async delete(path) {
        return this.request('DELETE', path);
    }
}

class DataService {
    constructor(backend = 'localStorage') {
        this.backend = backend === 'api'
            ? new ApiBackend()
            : new LocalStorageBackend();
        this.mode = backend;
    }

    // Library Methods
    async getArticles(filters = {}) {
        if (this.mode === 'api') {
            const params = new URLSearchParams(filters);
            return this.backend.get(`/library/articles?${params}`);
        }

        // localStorage implementation
        const articles = await this.backend.get('library_articles') || [];
        let filtered = articles;

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(search) ||
                article.content.toLowerCase().includes(search)
            );
        }

        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(article =>
                filters.tags.some(tag => article.tags.includes(tag))
            );
        }

        if (filters.level) {
            filtered = filtered.filter(article =>
                article.level === filters.level
            );
        }

        return {
            articles: filtered,
            total: filtered.length,
            page: 1,
            hasMore: false
        };
    }

    async getArticle(id) {
        if (this.mode === 'api') {
            return this.backend.get(`/library/articles/${id}`);
        }

        const articles = await this.backend.get('library_articles') || [];
        return articles.find(article => article.id === id);
    }

    async saveReadingProgress(articleId, percentComplete, completed = false) {
        if (this.mode === 'api') {
            return this.backend.post('/library/progress', {
                articleId,
                percentComplete,
                completed
            });
        }

        const progress = await this.backend.get('reading_progress') || {};
        progress[articleId] = { percentComplete, completed, updatedAt: new Date().toISOString() };
        return this.backend.set('reading_progress', progress);
    }

    async getReadingProgress(articleId = null) {
        if (this.mode === 'api') {
            return this.backend.get('/library/progress');
        }

        const progress = await this.backend.get('reading_progress') || {};
        return articleId ? progress[articleId] : progress;
    }

    async bookmarkArticle(articleId) {
        if (this.mode === 'api') {
            return this.backend.post('/library/bookmarks', { articleId });
        }

        const bookmarks = await this.backend.get('bookmarks') || [];
        if (!bookmarks.includes(articleId)) {
            bookmarks.push(articleId);
            await this.backend.set('bookmarks', bookmarks);
        }
        return { success: true };
    }

    async unbookmarkArticle(articleId) {
        if (this.mode === 'api') {
            return this.backend.delete(`/library/bookmarks/${articleId}`);
        }

        const bookmarks = await this.backend.get('bookmarks') || [];
        const filtered = bookmarks.filter(id => id !== articleId);
        await this.backend.set('bookmarks', filtered);
        return { success: true };
    }

    async getBookmarks() {
        if (this.mode === 'api') {
            return this.backend.get('/library/bookmarks');
        }

        return await this.backend.get('bookmarks') || [];
    }

    // Job Search Methods
    async searchJobs(query, filters = {}) {
        if (this.mode === 'api') {
            const params = new URLSearchParams({ query, ...filters });
            return this.backend.get(`/jobs/search?${params}`);
        }

        // localStorage demo data
        return {
            jobs: [],
            total: 0,
            page: 1
        };
    }

    async getApplications() {
        if (this.mode === 'api') {
            return this.backend.get('/jobs/applications');
        }

        return await this.backend.get('job_applications') || [];
    }

    async createApplication(application) {
        if (this.mode === 'api') {
            return this.backend.post('/jobs/applications', application);
        }

        const applications = await this.getApplications();
        const newApp = {
            id: this.backend.generateId(),
            ...application,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        applications.push(newApp);
        await this.backend.set('job_applications', applications);
        return newApp;
    }

    async updateApplication(id, updates) {
        if (this.mode === 'api') {
            return this.backend.put(`/jobs/applications/${id}`, updates);
        }

        const applications = await this.getApplications();
        const index = applications.findIndex(app => app.id === id);
        if (index !== -1) {
            applications[index] = {
                ...applications[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            await this.backend.set('job_applications', applications);
            return applications[index];
        }
        return null;
    }

    async deleteApplication(id) {
        if (this.mode === 'api') {
            return this.backend.delete(`/jobs/applications/${id}`);
        }

        const applications = await this.getApplications();
        const filtered = applications.filter(app => app.id !== id);
        await this.backend.set('job_applications', filtered);
        return { success: true };
    }

    // Table Methods
    async getTables() {
        if (this.mode === 'api') {
            return this.backend.get('/tables');
        }

        const tableKeys = Object.keys(localStorage)
            .filter(key => key.startsWith('cleansheet_table_def_'));

        return tableKeys.map(key => {
            const tableData = JSON.parse(localStorage.getItem(key));
            const tableName = key.replace('cleansheet_table_def_', '').replace(/_/g, ' ');
            return {
                id: key.replace('cleansheet_table_def_', ''),
                name: tableName,
                ...tableData
            };
        });
    }

    async getTable(id) {
        if (this.mode === 'api') {
            return this.backend.get(`/tables/${id}`);
        }

        return await this.backend.get(`table_def_${id}`);
    }

    async createTable(table) {
        if (this.mode === 'api') {
            return this.backend.post('/tables', table);
        }

        const id = table.name.toLowerCase().replace(/\s+/g, '_');
        const newTable = {
            ...table,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await this.backend.set(`table_def_${id}`, newTable);
        return newTable;
    }

    async updateTable(id, updates) {
        if (this.mode === 'api') {
            return this.backend.put(`/tables/${id}`, updates);
        }

        const table = await this.getTable(id);
        if (table) {
            const updated = {
                ...table,
                ...updates,
                updatedAt: new Date().toISOString()
            };
            await this.backend.set(`table_def_${id}`, updated);
            return updated;
        }
        return null;
    }

    async deleteTable(id) {
        if (this.mode === 'api') {
            return this.backend.delete(`/tables/${id}`);
        }

        await this.backend.delete(`table_def_${id}`);
        await this.backend.delete(`table_data_${id}`);
        return { success: true };
    }

    // Document Methods
    async getDocuments() {
        if (this.mode === 'api') {
            return this.backend.get('/documents');
        }

        return await this.backend.get('documents') || [];
    }

    async getDocument(id) {
        if (this.mode === 'api') {
            return this.backend.get(`/documents/${id}`);
        }

        const documents = await this.getDocuments();
        return documents.find(doc => doc.id === id);
    }

    async createDocument(document) {
        if (this.mode === 'api') {
            return this.backend.post('/documents', document);
        }

        const documents = await this.getDocuments();
        const newDoc = {
            id: this.backend.generateId(),
            ...document,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        documents.push(newDoc);
        await this.backend.set('documents', documents);
        return newDoc;
    }

    async updateDocument(id, updates) {
        if (this.mode === 'api') {
            return this.backend.put(`/documents/${id}`, updates);
        }

        const documents = await this.getDocuments();
        const index = documents.findIndex(doc => doc.id === id);
        if (index !== -1) {
            documents[index] = {
                ...documents[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            await this.backend.set('documents', documents);
            return documents[index];
        }
        return null;
    }

    async deleteDocument(id) {
        if (this.mode === 'api') {
            return this.backend.delete(`/documents/${id}`);
        }

        const documents = await this.getDocuments();
        const filtered = documents.filter(doc => doc.id !== id);
        await this.backend.set('documents', filtered);
        return { success: true };
    }

    // Form Methods
    async getForms() {
        if (this.mode === 'api') {
            return this.backend.get('/forms');
        }

        return await this.backend.get('forms') || [];
    }

    async getForm(id) {
        if (this.mode === 'api') {
            return this.backend.get(`/forms/${id}`);
        }

        const forms = await this.getForms();
        return forms.find(form => form.id === id);
    }

    async createForm(form) {
        if (this.mode === 'api') {
            return this.backend.post('/forms', form);
        }

        const forms = await this.getForms();
        const newForm = {
            id: this.backend.generateId(),
            ...form,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        forms.push(newForm);
        await this.backend.set('forms', forms);
        return newForm;
    }

    async updateForm(id, updates) {
        if (this.mode === 'api') {
            return this.backend.put(`/forms/${id}`, updates);
        }

        const forms = await this.getForms();
        const index = forms.findIndex(form => form.id === id);
        if (index !== -1) {
            forms[index] = {
                ...forms[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            await this.backend.set('forms', forms);
            return forms[index];
        }
        return null;
    }

    async deleteForm(id) {
        if (this.mode === 'api') {
            return this.backend.delete(`/forms/${id}`);
        }

        const forms = await this.getForms();
        const filtered = forms.filter(form => form.id !== id);
        await this.backend.set('forms', filtered);
        return { success: true };
    }

    // Projects Methods
    async getProjects() {
        if (this.mode === 'api') {
            return this.backend.get('/projects');
        }

        return await this.backend.get('projectFolders') || [];
    }

    async createProject(project) {
        if (this.mode === 'api') {
            return this.backend.post('/projects', project);
        }

        const projects = await this.getProjects();
        const newProject = {
            id: this.backend.generateId(),
            ...project,
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };
        projects.push(newProject);
        await this.backend.set('projectFolders', projects);
        return newProject;
    }

    async updateProject(id, updates) {
        if (this.mode === 'api') {
            return this.backend.put(`/projects/${id}`, updates);
        }

        const projects = await this.getProjects();
        const index = projects.findIndex(proj => proj.id === id);
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                ...updates,
                modified: new Date().toISOString()
            };
            await this.backend.set('projectFolders', projects);
            return projects[index];
        }
        return null;
    }

    async deleteProject(id) {
        if (this.mode === 'api') {
            return this.backend.delete(`/projects/${id}`);
        }

        const projects = await this.getProjects();
        const filtered = projects.filter(proj => proj.id !== id);
        await this.backend.set('projectFolders', filtered);
        return { success: true };
    }
}

// Export for use in HTML pages
if (typeof window !== 'undefined') {
    window.DataService = DataService;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}
