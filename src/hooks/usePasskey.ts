import { startRegistration } from '@simplewebauthn/browser';
import api from '../services/api';

export const registerPasskey = async (userId: string, userEmail: string) => {
    try {
        // 1. Get options from server
        // The backend expects body.user. I'll pass the userID.
        // Adjust this if the backend expects the email or full object.
        const startResponse = await api.post('/auth/passkeys/register', {
            user: { id: userId, email: userEmail } 
        });
        
        const options = startResponse.data;

        // 2. Start WebAuthn ceremony
        const attResp = await startRegistration({ optionsJSON: options });

        // 3. Verify with server
        const verifyResponse = await api.post('/auth/passkeys/verify', {
            user: { id: userId, email: userEmail },
            credential: attResp
        });

        return verifyResponse.data;
    } catch (error) {
        console.error('Passkey registration failed:', error);
        throw error;
    }
};
