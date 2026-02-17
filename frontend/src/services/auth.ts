import api from './api';

export interface User {
    id: string;
    email?: string;
    is_anonymous: boolean;
    preferences?: any;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export const authService = {
    guestLogin: async (): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/guest');
        return response.data;
    },

    register: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', { email, password });
        return response.data;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        // OAuth2PasswordRequestForm requires form-encoded data
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        const response = await api.post<AuthResponse>('/auth/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': ''
            }
        });
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },
};
