import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import api from '../services/api';

export const registerPasskey = async (userId: string, userEmail: string) => {
    try {
        // 1. Get options from server
        // The backend expects body.user. I'll pass the userID.
        // Adjust this if the backend expects the email or full object.
        const startResponse = await api.post('/passkeys/register', {
            user: { id: userId, email: userEmail }
        });

        const options = startResponse.data;

        // 2. Start WebAuthn ceremony
        const attResp = await startRegistration({ optionsJSON: options });

        // 3. Verify with server
        const verifyResponse = await api.post('/passkeys/verify', {
            userId: userId,
            // The backend needs the full response to verify and extract publicKey/counter
            // We also send specific fields if the backend DTO requires them strictly at the root level,
            // but usually verification needs the full object.
            credentialId: attResp.id,
            credential: attResp
        });

        return verifyResponse.data;
    } catch (error) {
        console.error('Passkey registration failed:', error);
        throw error;
    }
};

export const loginPasskey = async () => {
    try {
        // 1. Get authentication options from backend
        console.log('Login Passkey');
        const optionsResponse = await api.post('/passkeys/authenticate');
        const options = optionsResponse.data;
        console.log('Options Response', options);

        // 2. Start WebAuthn authentication ceremony
        const asseResp = await startAuthentication({ optionsJSON: options });

        console.log('Assertion Response', asseResp);

        // 3. Verify with backend
        const verifyResponse = await api.post('/passkeys/authenticate/verify', {
            credential: asseResp
        });

        console.log('Verify Response', verifyResponse);

        return verifyResponse.data;
    } catch (error) {
        console.error('Passkey login failed:', error);
        throw error;
    }
};
