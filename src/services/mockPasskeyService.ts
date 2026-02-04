import type { PublicKeyCredentialRequestOptionsJSON, PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';

// Storage key mimicking a database table
const DB_KEY = 'mock_auth_passkeys';

interface SavedPasskey {
    id: string;
    name: string;
    transports?: AuthenticatorTransport[];
    created_at: number;
}

// Utility to generate a random base64url string for challenges
const generateChallenge = (): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    const length = 32;
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
};

// Helper to access our "Database"
const getDB = (): SavedPasskey[] => {
    try {
        const stored = localStorage.getItem(DB_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveToDB = (passkey: SavedPasskey) => {
    const db = getDB();
    db.push(passkey);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const mockPasskeyService = {
    /**
     * Get all registered passkeys for the user (to display in UI)
     */
    getRegisteredPasskeys: (): SavedPasskey[] => {
        return getDB();
    },

    /**
     * Mock getting authentication options from the backend.
     * Uses saved credentials to strictly allow only registered keys.
     */
    getAuthenticationOptions: (): PublicKeyCredentialRequestOptionsJSON => {
        // Synchronous generation

        const db = getDB();

        return {
            challenge: generateChallenge(),
            rpId: window.location.hostname,
            // In a real app, this ensures the browser only asks for credentials we know about
            allowCredentials: db.map(pk => ({
                id: pk.id,
                type: 'public-key',
                transports: pk.transports || undefined
            })),
            userVerification: 'preferred',
            timeout: 60000,
        };
    },

    /**
     * Mock verification of the authentication response.
     */
    verifyAuthentication: async (credential: any): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('Verifying credential:', credential);

        const db = getDB();
        // Check if the credential ID used is one we have on file
        const isValid = db.some(pk => pk.id === credential.id);

        return isValid;
    },

    /**
     * Mock getting registration options (for Sign Up).
     */
    getRegistrationOptions: (username: string, attachment?: AuthenticatorAttachment): PublicKeyCredentialCreationOptionsJSON => {
        // Synchronous generation for strictly valid user activation

        return {
            challenge: generateChallenge(),
            rp: {
                name: 'BrainBooster AI',
                id: window.location.hostname,
            },
            user: {
                id: 'user_123456', // In a real app, strict stable ID
                name: username,
                displayName: username,
            },
            pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -257, type: 'public-key' },
            ],
            authenticatorSelection: {
                // Use the attachment type selected by the user (platform vs cross-platform)
                authenticatorAttachment: attachment,
                userVerification: 'preferred',
                residentKey: 'preferred', // 'preferred' allows creation even if the device can't store a full passkey
            },
            timeout: 60000,
            attestation: 'none',
        };
    },

    /**
     * Mock verification of the registration response.
     * NOW SAVES TO LOCALSTORAGE
     */
    // Add missing property validation
    verifyRegistration: async (credential: any, name: string): Promise<boolean> => {
        console.log('Verifying registration:', credential);

        // SAVE to "Database"
        saveToDB({
            id: credential.id,
            name: name,
            transports: credential.response?.transports || [],
            created_at: Date.now()
        });

        return true;
    }
};
