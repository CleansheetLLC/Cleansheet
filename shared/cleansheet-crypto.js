/**
 * Cleansheet Client-Side Encryption Utilities
 *
 * Provides browser-compatible encryption for sensitive data stored in localStorage
 * Uses Web Crypto API with AES-GCM encryption
 *
 * @version 1.0
 * @date 2025-11-16
 */

const CleansheetCrypto = {
    /**
     * Encrypt plaintext using AES-GCM with a user-specific derived key
     * @param {string} plaintext - The data to encrypt
     * @returns {Promise<string>} Base64-encoded encrypted data with embedded salt and IV
     */
    async encrypt(plaintext) {
        try {
            // Get user identifier for key derivation (email if authenticated, or device ID)
            const userIdentifier = this.getUserIdentifier();

            // Generate random salt (32 bytes)
            const salt = crypto.getRandomValues(new Uint8Array(32));

            // Derive encryption key from user identifier using PBKDF2
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(userIdentifier),
                'PBKDF2',
                false,
                ['deriveBits', 'deriveKey']
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000, // OWASP recommended minimum
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );

            // Generate random IV (12 bytes for AES-GCM)
            const iv = crypto.getRandomValues(new Uint8Array(12));

            // Encrypt the plaintext
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                new TextEncoder().encode(plaintext)
            );

            // Combine salt + IV + encrypted data into single array
            const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(encrypted), salt.length + iv.length);

            // Return as Base64 string
            return this.arrayBufferToBase64(combined);
        } catch (error) {
            console.error('[CleansheetCrypto] Encryption failed:', error);
            throw new Error('Failed to encrypt data: ' + error.message);
        }
    },

    /**
     * Decrypt Base64-encoded encrypted data
     * @param {string} encryptedBase64 - Base64 string with embedded salt, IV, and encrypted data
     * @returns {Promise<string>} Decrypted plaintext
     */
    async decrypt(encryptedBase64) {
        try {
            // Get user identifier (must match what was used for encryption)
            const userIdentifier = this.getUserIdentifier();

            // Decode Base64 to byte array
            const combined = this.base64ToArrayBuffer(encryptedBase64);

            // Extract salt (first 32 bytes)
            const salt = combined.slice(0, 32);

            // Extract IV (next 12 bytes)
            const iv = combined.slice(32, 44);

            // Extract encrypted data (remaining bytes)
            const encrypted = combined.slice(44);

            // Derive the same key using salt
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(userIdentifier),
                'PBKDF2',
                false,
                ['deriveBits', 'deriveKey']
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );

            // Decrypt the data
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );

            // Convert decrypted bytes to string
            return new TextDecoder().decode(decrypted);
        } catch (error) {
            console.error('[CleansheetCrypto] Decryption failed:', error);
            throw new Error('Failed to decrypt data: ' + error.message);
        }
    },

    /**
     * Get user identifier for key derivation
     * Priority: authenticated email > localStorage device ID > generated device ID
     * @returns {string} User identifier
     */
    getUserIdentifier() {
        // Try to get authenticated user email
        if (typeof window.userEmail !== 'undefined' && window.userEmail) {
            return window.userEmail;
        }

        // Try to get email from localStorage (set during authentication)
        const storedEmail = localStorage.getItem('user_email');
        if (storedEmail) {
            return storedEmail;
        }

        // Fall back to device ID (generate if doesn't exist)
        let deviceId = localStorage.getItem('cleansheet_device_id');
        if (!deviceId) {
            deviceId = this.generateDeviceId();
            localStorage.setItem('cleansheet_device_id', deviceId);
        }
        return deviceId;
    },

    /**
     * Generate a unique device identifier
     * @returns {string} Device ID
     */
    generateDeviceId() {
        // Generate random 32-byte hex string
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Convert ArrayBuffer to Base64 string
     * @param {Uint8Array} buffer - Data to encode
     * @returns {string} Base64 string
     */
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    },

    /**
     * Convert Base64 string to Uint8Array
     * @param {string} base64 - Base64 encoded string
     * @returns {Uint8Array} Decoded data
     */
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    },

    /**
     * Encrypt plaintext using AES-GCM with a password-derived key
     * Used for password-protected backups
     * @param {string} plaintext - The data to encrypt
     * @param {string} password - User password for key derivation
     * @returns {Promise<string>} Base64-encoded encrypted data with embedded salt and IV
     */
    async encryptWithPassword(plaintext, password) {
        try {
            if (!password || password.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }

            // Generate random salt (32 bytes)
            const salt = crypto.getRandomValues(new Uint8Array(32));

            // Derive encryption key from password using PBKDF2
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(password),
                'PBKDF2',
                false,
                ['deriveBits', 'deriveKey']
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000, // OWASP recommended minimum
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );

            // Generate random IV (12 bytes for AES-GCM)
            const iv = crypto.getRandomValues(new Uint8Array(12));

            // Encrypt the plaintext
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                new TextEncoder().encode(plaintext)
            );

            // Combine salt + IV + encrypted data into single array
            const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(encrypted), salt.length + iv.length);

            // Return as Base64 string
            return this.arrayBufferToBase64(combined);
        } catch (error) {
            console.error('[CleansheetCrypto] Password encryption failed:', error);
            throw new Error('Failed to encrypt data with password: ' + error.message);
        }
    },

    /**
     * Decrypt Base64-encoded password-encrypted data
     * Used for password-protected backup restoration
     * @param {string} encryptedBase64 - Base64 string with embedded salt, IV, and encrypted data
     * @param {string} password - User password for key derivation
     * @returns {Promise<string>} Decrypted plaintext
     */
    async decryptWithPassword(encryptedBase64, password) {
        try {
            if (!password || password.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }

            // Decode Base64 to byte array
            const combined = this.base64ToArrayBuffer(encryptedBase64);

            // Extract salt (first 32 bytes)
            const salt = combined.slice(0, 32);

            // Extract IV (next 12 bytes)
            const iv = combined.slice(32, 44);

            // Extract encrypted data (remaining bytes)
            const encrypted = combined.slice(44);

            // Derive the same key using password and salt
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(password),
                'PBKDF2',
                false,
                ['deriveBits', 'deriveKey']
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );

            // Decrypt the data
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );

            // Convert decrypted bytes to string
            return new TextDecoder().decode(decrypted);
        } catch (error) {
            console.error('[CleansheetCrypto] Password decryption failed:', error);
            throw new Error('Failed to decrypt data with password: ' + error.message);
        }
    },

    /**
     * Test encryption/decryption functionality
     * @returns {Promise<boolean>} True if test passes
     */
    async test() {
        try {
            const testData = 'sk-proj-test123456789';
            console.log('[CleansheetCrypto] Testing encryption...');
            console.log('[CleansheetCrypto] Original:', testData);

            const encrypted = await this.encrypt(testData);
            console.log('[CleansheetCrypto] Encrypted:', encrypted.substring(0, 50) + '...');

            const decrypted = await this.decrypt(encrypted);
            console.log('[CleansheetCrypto] Decrypted:', decrypted);

            const success = testData === decrypted;
            console.log('[CleansheetCrypto] Test result:', success ? '✓ PASS' : '✗ FAIL');

            return success;
        } catch (error) {
            console.error('[CleansheetCrypto] Test failed:', error);
            return false;
        }
    }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.CleansheetCrypto = CleansheetCrypto;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CleansheetCrypto;
}

console.log('[CleansheetCrypto] Encryption utilities loaded');
