// Azure Blob Service Implementation
// Handles all Azure Blob Storage operations for the professional platform

class AzureBlobService {
    constructor(accountName, containerName, sasToken) {
        this.baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}`;
        this.sasToken = sasToken;
        this.headers = {
            'x-ms-version': '2020-04-08',
            'x-ms-blob-type': 'BlockBlob'
        };
    }

    /**
     * Upload a blob to Azure Blob Storage
     * @param {string} blobName - The name/path of the blob
     * @param {Object|string} data - The data to upload
     * @param {Object} metadata - Optional metadata for the blob
     * @returns {Promise<Object>} Upload result
     */
    async uploadBlob(blobName, data, metadata = {}) {
        try {
            const url = `${this.baseUrl}/${blobName}?${this.sasToken}`;

            // Convert data to string if it's an object
            const content = typeof data === 'object' ? JSON.stringify(data) : data;

            // Prepare headers
            const headers = {
                ...this.headers,
                'Content-Type': typeof data === 'object' ? 'application/json' : 'text/plain',
                'Content-Length': content.length.toString()
            };

            // Add metadata headers
            Object.keys(metadata).forEach(key => {
                headers[`x-ms-meta-${key}`] = metadata[key];
            });

            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: content
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} - ${errorText}`);
            }

            return {
                success: true,
                blobName,
                url: `${this.baseUrl}/${blobName}`,
                lastModified: response.headers.get('Last-Modified'),
                etag: response.headers.get('ETag')
            };

        } catch (error) {
            console.error('Azure Blob upload error:', error);
            return {
                success: false,
                error: error.message,
                blobName
            };
        }
    }

    /**
     * Download a blob from Azure Blob Storage
     * @param {string} blobName - The name/path of the blob
     * @returns {Promise<Object>} Download result with data
     */
    async downloadBlob(blobName) {
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                const url = `${this.baseUrl}/${blobName}?${this.sasToken}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        ...this.headers
                    }
                });

                if (response.status === 404) {
                    return {
                        success: false,
                        error: 'Blob not found',
                        blobName
                    };
                }

                if (!response.ok) {
                    throw new Error(`Download failed: ${response.status} - ${response.statusText}`);
                }

                const contentType = response.headers.get('Content-Type') || '';
                let data;

                if (contentType.includes('application/json')) {
                    const text = await response.text();
                    try {
                        data = JSON.parse(text);
                    } catch (parseError) {
                        data = text; // Fallback to raw text if JSON parsing fails
                    }
                } else {
                    data = await response.text();
                }

                // Get metadata
                const metadata = {};
                for (const [key, value] of response.headers.entries()) {
                    if (key.startsWith('x-ms-meta-')) {
                        const metaKey = key.substring(10); // Remove 'x-ms-meta-' prefix
                        metadata[metaKey] = value;
                    }
                }

                return {
                    success: true,
                    data,
                    metadata,
                    blobName,
                    lastModified: response.headers.get('Last-Modified'),
                    etag: response.headers.get('ETag'),
                    contentType
                };

            } catch (error) {
                retryCount++;
                if (retryCount >= maxRetries) {
                    console.error(`Azure Blob download error after ${maxRetries} retries:`, error);
                    return {
                        success: false,
                        error: error.message,
                        blobName
                    };
                }

                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
            }
        }
    }

    /**
     * List blobs in the container with optional prefix filtering
     * @param {string} prefix - Optional prefix to filter blobs
     * @param {number} maxResults - Maximum number of results to return
     * @returns {Promise<Object>} List of blobs
     */
    async listBlobs(prefix = '', maxResults = 100) {
        try {
            let url = `${this.baseUrl}?comp=list&restype=container&${this.sasToken}`;

            if (prefix) {
                url += `&prefix=${encodeURIComponent(prefix)}`;
            }

            if (maxResults) {
                url += `&maxresults=${maxResults}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    ...this.headers
                }
            });

            if (!response.ok) {
                throw new Error(`List blobs failed: ${response.status} - ${response.statusText}`);
            }

            const xmlText = await response.text();

            // Parse XML response (simplified parser for blob listing)
            const blobs = this.parseListBlobsResponse(xmlText);

            return {
                success: true,
                blobs,
                prefix,
                count: blobs.length
            };

        } catch (error) {
            console.error('Azure Blob list error:', error);
            return {
                success: false,
                error: error.message,
                blobs: []
            };
        }
    }

    /**
     * Delete a blob from Azure Blob Storage
     * @param {string} blobName - The name/path of the blob to delete
     * @returns {Promise<Object>} Deletion result
     */
    async deleteBlob(blobName) {
        try {
            const url = `${this.baseUrl}/${blobName}?${this.sasToken}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    ...this.headers
                }
            });

            if (response.status === 404) {
                return {
                    success: true, // Consider it successful if already deleted
                    blobName,
                    message: 'Blob already deleted'
                };
            }

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.status} - ${response.statusText}`);
            }

            return {
                success: true,
                blobName,
                message: 'Blob deleted successfully'
            };

        } catch (error) {
            console.error('Azure Blob delete error:', error);
            return {
                success: false,
                error: error.message,
                blobName
            };
        }
    }

    /**
     * Check if a blob exists
     * @param {string} blobName - The name/path of the blob
     * @returns {Promise<boolean>} True if blob exists
     */
    async blobExists(blobName) {
        try {
            const url = `${this.baseUrl}/${blobName}?${this.sasToken}`;

            const response = await fetch(url, {
                method: 'HEAD',
                headers: {
                    ...this.headers
                }
            });

            return response.ok;

        } catch (error) {
            console.error('Azure Blob exists check error:', error);
            return false;
        }
    }

    /**
     * Simple XML parser for blob listing response
     * @param {string} xmlText - XML response from Azure
     * @returns {Array} Array of blob objects
     */
    parseListBlobsResponse(xmlText) {
        const blobs = [];

        // Simple regex-based XML parsing (for basic blob listing)
        const blobRegex = /<Blob>(.*?)<\/Blob>/gs;
        const nameRegex = /<Name>(.*?)<\/Name>/;
        const lastModifiedRegex = /<Last-Modified>(.*?)<\/Last-Modified>/;
        const sizeRegex = /<Content-Length>(.*?)<\/Content-Length>/;
        const contentTypeRegex = /<Content-Type>(.*?)<\/Content-Type>/;

        let match;
        while ((match = blobRegex.exec(xmlText)) !== null) {
            const blobXml = match[1];

            const nameMatch = nameRegex.exec(blobXml);
            const lastModifiedMatch = lastModifiedRegex.exec(blobXml);
            const sizeMatch = sizeRegex.exec(blobXml);
            const contentTypeMatch = contentTypeRegex.exec(blobXml);

            if (nameMatch) {
                blobs.push({
                    name: nameMatch[1],
                    lastModified: lastModifiedMatch ? lastModifiedMatch[1] : null,
                    size: sizeMatch ? parseInt(sizeMatch[1]) : 0,
                    contentType: contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream',
                    url: `${this.baseUrl}/${nameMatch[1]}`
                });
            }
        }

        return blobs;
    }

    /**
     * Get the container structure as defined in the plan
     * @param {string} userId - The current user ID
     * @returns {Object} Container paths for different data types
     */
    getContainerPaths(userId) {
        return {
            user: {
                documents: `users/${userId}/documents/`,
                projects: `users/${userId}/projects/`,
                schemas: `users/${userId}/schemas/`,
                preferences: `users/${userId}/preferences/`,
                metadata: `users/${userId}/metadata/`
            },
            shared: {
                templates: 'shared/templates/',
                components: 'shared/components/',
                public: 'shared/public/'
            },
            workspaces: (workspaceId) => ({
                documents: `workspaces/${workspaceId}/documents/`,
                projects: `workspaces/${workspaceId}/projects/`,
                metadata: `workspaces/${workspaceId}/metadata/`
            })
        };
    }

    /**
     * Health check for the Azure Blob service
     * @returns {Promise<Object>} Health status
     */
    async healthCheck() {
        try {
            // Try to list blobs to verify connection
            const result = await this.listBlobs('', 1);

            return {
                healthy: result.success,
                timestamp: new Date().toISOString(),
                service: 'Azure Blob Storage',
                details: result.success ? 'Connection successful' : result.error
            };

        } catch (error) {
            return {
                healthy: false,
                timestamp: new Date().toISOString(),
                service: 'Azure Blob Storage',
                error: error.message
            };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AzureBlobService;
} else if (typeof window !== 'undefined') {
    window.AzureBlobService = AzureBlobService;
}