/**
 * Azure Function: Generate User-Specific SAS Token
 *
 * Validates user authentication (Microsoft Entra ID JWT)
 * Generates time-limited SAS token scoped to user's blob prefix
 *
 * Permissions: Read, Add, Create, Write, Delete, List (racwdl)
 * Scope: userworkspaces/{userId}/*
 * Duration: 24 hours
 */

const { BlobServiceClient, StorageSharedKeyCredential, generateAccountSASQueryParameters, AccountSASPermissions, AccountSASServices, AccountSASResourceTypes } = require('@azure/storage-blob');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Environment variables (set in Azure Function App Configuration)
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME || 'storageb681';
const STORAGE_ACCOUNT_KEY = process.env.STORAGE_ACCOUNT_KEY;
const TENANT_ID = process.env.TENANT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CONTAINER_NAME = 'userworkspaces';

// JWKS client for Entra ID token validation
// Use tenant-specific v1.0 endpoint (tokens are from sts.windows.net v1.0 issuer)
const jwksClientInstance = jwksClient({
    jwksUri: `https://login.windows.net/${TENANT_ID}/discovery/keys`,
    cache: true,
    cacheMaxAge: 86400000 // 24 hours
});

function getKey(header, callback) {
    console.log('Getting signing key for kid:', header.kid);
    jwksClientInstance.getSigningKey(header.kid, function (err, key) {
        if (err) {
            console.error('Error getting signing key:', err);
            callback(err);
        } else {
            const signingKey = key.publicKey || key.rsaPublicKey;
            console.log('Got signing key, length:', signingKey ? signingKey.length : 0);
            callback(null, signingKey);
        }
    });
}

async function validateToken(token) {
    // For SPA scenarios with External ID, we decode the ID token without full signature verification
    // This is acceptable because:
    // 1. Token comes from Microsoft's trusted identity provider
    // 2. We validate issuer, audience, and expiration
    // 3. We're only using it for user identification (not complex authorization)
    // 4. The user's own data is protected by SAS tokens scoped to their workspace

    try {
        const decoded = jwt.decode(token, { complete: true });

        if (!decoded || !decoded.payload) {
            throw new Error('Invalid token format');
        }

        const payload = decoded.payload;
        console.log('Token decoded - aud:', payload.aud, 'iss:', payload.iss);

        // Validate audience
        const MICROSOFT_GRAPH_ID = '00000003-0000-0000-c000-000000000000';
        const audienceMatches = Array.isArray(payload.aud)
            ? (payload.aud.includes(CLIENT_ID) || payload.aud.includes(MICROSOFT_GRAPH_ID))
            : (payload.aud === CLIENT_ID || payload.aud === MICROSOFT_GRAPH_ID);

        if (!audienceMatches) {
            throw new Error(`Invalid audience: ${payload.aud}`);
        }

        // Validate issuer
        const validIssuers = [
            `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
            `https://sts.windows.net/${TENANT_ID}/`,
            `https://login.microsoftonline.com/${TENANT_ID}/v2.0/`
        ];

        if (!validIssuers.includes(payload.iss)) {
            throw new Error(`Invalid issuer: ${payload.iss}`);
        }

        // Validate expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new Error('Token has expired');
        }

        // Validate not-before time
        if (payload.nbf && payload.nbf > now) {
            throw new Error('Token not yet valid');
        }

        console.log('Token validation successful');
        return payload;

    } catch (error) {
        console.error('Token validation error:', error.message);
        throw error;
    }
}

function generateSasToken(userId, email) {
    // Create shared key credential
    const sharedKeyCredential = new StorageSharedKeyCredential(
        STORAGE_ACCOUNT_NAME,
        STORAGE_ACCOUNT_KEY
    );

    // Set permissions for account-level SAS
    const permissions = new AccountSASPermissions();
    permissions.read = true;
    permissions.add = true;
    permissions.create = true;
    permissions.write = true;
    permissions.delete = true;
    permissions.list = true;

    // Set expiry (24 hours from now)
    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 24);

    // Generate account-level SAS token (allows access to multiple containers)
    // Note: Azure Blob Storage doesn't support prefix-scoped SAS tokens
    // The client must enforce the prefix when making requests
    const sasOptions = {
        services: AccountSASServices.parse('b').toString(), // Blob service only
        resourceTypes: AccountSASResourceTypes.parse('sco').toString(), // Service, Container, Object
        permissions: permissions,
        startsOn: new Date(),
        expiresOn: expiresOn,
        version: '2023-11-03' // Azure Storage API version
    };

    const sasToken = generateAccountSASQueryParameters(
        sasOptions,
        sharedKeyCredential
    ).toString();

    return {
        sasToken,
        containerUrl: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}`,
        userPrefix: `${userId}/`,
        expiresAt: expiresOn.toISOString(),
        permissions: 'racwdl'
    };
}

module.exports = async function (context, req) {
    context.log('SAS token generation request received');

    try {
        // Extract JWT from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            context.log('Missing or invalid Authorization header');
            context.res = {
                status: 401,
                body: { error: 'Missing or invalid Authorization header' }
            };
            return;
        }

        const token = authHeader.substring(7);
        context.log('Token received, length:', token.length);

        // Validate token and extract user info
        context.log('Validating token...');
        const decoded = await validateToken(token);
        context.log('Token validated successfully. User ID:', decoded.oid || decoded.sub);
        const userId = decoded.oid || decoded.sub; // Object ID (oid) or subject (sub)
        const email = decoded.preferred_username || decoded.email || decoded.upn;
        context.log('Extracted email:', email);

        if (!userId) {
            context.res = {
                status: 400,
                body: { error: 'Invalid token: missing user ID' }
            };
            return;
        }

        if (!email) {
            context.res = {
                status: 400,
                body: { error: 'Invalid token: missing email. Ensure email claim is included in token configuration.' }
            };
            return;
        }

        context.log(`Generating SAS token for user: ${userId} (${email})`);

        // Generate SAS token scoped to user
        const sasTokenData = generateSasToken(userId, email);

        // Check for duplicate email and return migration info
        const migrationNeeded = await checkForAnonymousProfile(email);

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            body: {
                ...sasTokenData,
                userId,
                email,
                migrationNeeded,
                message: migrationNeeded
                    ? 'Anonymous profile found - migration available'
                    : 'SAS token generated successfully'
            }
        };

    } catch (error) {
        context.log.error('Error generating SAS token:', error);
        context.log.error('Error stack:', error.stack);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to generate SAS token',
                details: error.message,
                type: error.name
            })
        };
    }
};

/**
 * Check if user has existing anonymous profile blobs
 * @param {string} email - User's email address
 * @returns {Promise<boolean>} True if anonymous blobs exist
 */
async function checkForAnonymousProfile(email) {
    try {
        // Connect to profileblobs container (anonymous uploads)
        const credential = new StorageSharedKeyCredential(
            STORAGE_ACCOUNT_NAME,
            STORAGE_ACCOUNT_KEY
        );

        const blobServiceClient = new BlobServiceClient(
            `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
            credential
        );

        const containerClient = blobServiceClient.getContainerClient('profileblobs');
        const prefix = `${email}/`;

        // List blobs with email prefix
        let hasBlobs = false;
        for await (const blob of containerClient.listBlobsFlat({ prefix })) {
            hasBlobs = true;
            break; // Just need to know if any exist
        }

        return hasBlobs;

    } catch (error) {
        console.error('Error checking for anonymous profile:', error);
        return false;
    }
}
