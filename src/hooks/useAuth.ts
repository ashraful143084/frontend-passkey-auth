import { useMutation } from '@tanstack/react-query';
import api from '../services/api';

interface AuthCredentials {
    email: string;
    password?: string;
}

interface AuthResponse {
    access_token: string;
    user: {
        email: string;
        hasPasskey: boolean;
        _id: string;
    };
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials: AuthCredentials) => {
            const response = await api.post<AuthResponse>('/auth/login', credentials);
            console.log(response.data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Login successful, response data:', data);
            if (data.user) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                console.error('Login response missing user object:', data);
            }
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (credentials: AuthCredentials) => {
            const response = await api.post<AuthResponse>('/auth/register', credentials);
            return response.data;
        },
    });
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
};

export const checkAuth = (): boolean => {
    return !!localStorage.getItem('access_token');
};

export const getUser = (): { email: string; hasPasskey: boolean; _id: string; } | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Failed to parse user from local storage', e);
            return null;
        }
    }
    return null;
};
