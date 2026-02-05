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
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
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
