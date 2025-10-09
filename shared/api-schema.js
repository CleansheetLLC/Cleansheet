/**
 * Cleansheet API Schema
 * Defines the API contract for all three applications
 * Version: 1.0.0
 */

const API_SCHEMA = {
    baseUrl: '/api/v1',

    // Library & Content APIs (Learner)
    library: {
        // Get paginated list of articles
        list: {
            method: 'GET',
            path: '/library/articles',
            params: {
                page: 'number',
                limit: 'number',
                search: 'string',
                tags: 'array',
                level: 'string',
                careerPath: 'string'
            },
            response: {
                articles: 'array',
                total: 'number',
                page: 'number',
                hasMore: 'boolean'
            }
        },

        // Get single article
        get: {
            method: 'GET',
            path: '/library/articles/:id',
            response: {
                id: 'string',
                title: 'string',
                subtitle: 'string',
                content: 'string',
                tags: 'array',
                level: 'string',
                careerPaths: 'array',
                createdAt: 'string',
                updatedAt: 'string'
            }
        },

        // Track reading progress
        progress: {
            method: 'POST',
            path: '/library/progress',
            body: {
                articleId: 'string',
                percentComplete: 'number',
                completed: 'boolean'
            }
        },

        // Bookmark article
        bookmark: {
            method: 'POST',
            path: '/library/bookmarks',
            body: {
                articleId: 'string'
            }
        },

        // Get user bookmarks
        bookmarks: {
            method: 'GET',
            path: '/library/bookmarks',
            response: {
                bookmarks: 'array'
            }
        }
    },

    // Job Search APIs (Job Seeker)
    jobs: {
        // Search jobs
        search: {
            method: 'GET',
            path: '/jobs/search',
            params: {
                query: 'string',
                location: 'string',
                remote: 'boolean',
                page: 'number'
            },
            response: {
                jobs: 'array',
                total: 'number',
                page: 'number'
            }
        },

        // Get job details
        get: {
            method: 'GET',
            path: '/jobs/:id',
            response: {
                id: 'string',
                title: 'string',
                company: 'string',
                location: 'string',
                description: 'string',
                salary: 'string',
                postedDate: 'string',
                url: 'string'
            }
        },

        // Track application
        application: {
            create: {
                method: 'POST',
                path: '/jobs/applications',
                body: {
                    jobId: 'string',
                    company: 'string',
                    position: 'string',
                    status: 'string',
                    appliedDate: 'string',
                    notes: 'string'
                }
            },
            update: {
                method: 'PUT',
                path: '/jobs/applications/:id',
                body: {
                    status: 'string',
                    notes: 'string',
                    nextStep: 'string'
                }
            },
            list: {
                method: 'GET',
                path: '/jobs/applications',
                response: {
                    applications: 'array'
                }
            }
        }
    },

    // Professional Work Management APIs
    projects: {
        // List all projects
        list: {
            method: 'GET',
            path: '/projects',
            response: {
                projects: 'array'
            }
        },

        // Create project
        create: {
            method: 'POST',
            path: '/projects',
            body: {
                name: 'string',
                type: 'string',
                parentId: 'string|null',
                sharedWith: 'array'
            }
        },

        // Update project
        update: {
            method: 'PUT',
            path: '/projects/:id',
            body: {
                name: 'string',
                sharedWith: 'array'
            }
        },

        // Delete project
        delete: {
            method: 'DELETE',
            path: '/projects/:id'
        }
    },

    // Tables API
    tables: {
        list: {
            method: 'GET',
            path: '/tables',
            response: {
                tables: 'array'
            }
        },

        get: {
            method: 'GET',
            path: '/tables/:id',
            response: {
                id: 'string',
                name: 'string',
                columns: 'array',
                rows: 'array',
                views: 'array',
                createdAt: 'string',
                updatedAt: 'string'
            }
        },

        create: {
            method: 'POST',
            path: '/tables',
            body: {
                name: 'string',
                columns: 'array'
            }
        },

        update: {
            method: 'PUT',
            path: '/tables/:id',
            body: {
                name: 'string',
                columns: 'array'
            }
        },

        delete: {
            method: 'DELETE',
            path: '/tables/:id'
        },

        // Row operations
        rows: {
            list: {
                method: 'GET',
                path: '/tables/:tableId/rows',
                response: {
                    rows: 'array'
                }
            },
            create: {
                method: 'POST',
                path: '/tables/:tableId/rows',
                body: {
                    data: 'object'
                }
            },
            update: {
                method: 'PUT',
                path: '/tables/:tableId/rows/:rowId',
                body: {
                    data: 'object'
                }
            },
            delete: {
                method: 'DELETE',
                path: '/tables/:tableId/rows/:rowId'
            }
        }
    },

    // Documents API
    documents: {
        list: {
            method: 'GET',
            path: '/documents',
            response: {
                documents: 'array'
            }
        },

        get: {
            method: 'GET',
            path: '/documents/:id',
            response: {
                id: 'string',
                title: 'string',
                blocks: 'array',
                createdAt: 'string',
                updatedAt: 'string'
            }
        },

        create: {
            method: 'POST',
            path: '/documents',
            body: {
                title: 'string',
                blocks: 'array'
            }
        },

        update: {
            method: 'PUT',
            path: '/documents/:id',
            body: {
                title: 'string',
                blocks: 'array'
            }
        },

        delete: {
            method: 'DELETE',
            path: '/documents/:id'
        }
    },

    // Forms API
    forms: {
        list: {
            method: 'GET',
            path: '/forms',
            response: {
                forms: 'array'
            }
        },

        get: {
            method: 'GET',
            path: '/forms/:id',
            response: {
                id: 'string',
                title: 'string',
                description: 'string',
                fields: 'array',
                createdAt: 'string',
                updatedAt: 'string'
            }
        },

        create: {
            method: 'POST',
            path: '/forms',
            body: {
                title: 'string',
                description: 'string',
                fields: 'array'
            }
        },

        update: {
            method: 'PUT',
            path: '/forms/:id',
            body: {
                title: 'string',
                description: 'string',
                fields: 'array'
            }
        },

        delete: {
            method: 'DELETE',
            path: '/forms/:id'
        },

        // Form submissions
        submissions: {
            list: {
                method: 'GET',
                path: '/forms/:formId/submissions',
                response: {
                    submissions: 'array'
                }
            },
            create: {
                method: 'POST',
                path: '/forms/:formId/submissions',
                body: {
                    data: 'object'
                }
            }
        }
    },

    // Reports/Dashboards API
    reports: {
        list: {
            method: 'GET',
            path: '/reports',
            response: {
                reports: 'array'
            }
        },

        get: {
            method: 'GET',
            path: '/reports/:id',
            response: {
                id: 'string',
                title: 'string',
                visualizations: 'array',
                createdAt: 'string',
                updatedAt: 'string'
            }
        },

        create: {
            method: 'POST',
            path: '/reports',
            body: {
                title: 'string',
                visualizations: 'array'
            }
        },

        update: {
            method: 'PUT',
            path: '/reports/:id',
            body: {
                title: 'string',
                visualizations: 'array'
            }
        },

        delete: {
            method: 'DELETE',
            path: '/reports/:id'
        }
    },

    // User/Profile API
    user: {
        profile: {
            method: 'GET',
            path: '/user/profile',
            response: {
                id: 'string',
                name: 'string',
                email: 'string',
                role: 'string',
                avatar: 'string'
            }
        },

        update: {
            method: 'PUT',
            path: '/user/profile',
            body: {
                name: 'string',
                email: 'string',
                avatar: 'string'
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_SCHEMA;
}
