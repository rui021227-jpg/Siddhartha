import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../services/auth';
import { authService } from '../services/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    guestLogin: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,

            guestLogin: async () => {
                set({ isLoading: true, error: null });
                try {
                    const { access_token } = await authService.guestLogin();
                    localStorage.setItem('token', access_token);
                    set({ token: access_token });
                    const user = await authService.getMe();
                    set({ user, isLoading: false });
                } catch (err) {
                    set({ error: 'Failed to create guest session', isLoading: false });
                }
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { access_token } = await authService.login(email, password);
                    localStorage.setItem('token', access_token);
                    set({ token: access_token });
                    const user = await authService.getMe();
                    set({ user, isLoading: false });
                } catch (err: any) {
                    const errorMsg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
                    set({ error: errorMsg, isLoading: false });
                    throw err;
                }
            },

            register: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { access_token } = await authService.register(email, password);
                    localStorage.setItem('token', access_token);
                    set({ token: access_token });
                    const user = await authService.getMe();
                    set({ user, isLoading: false });
                } catch (err: any) {
                    const errorMsg = err.response?.data?.detail || 'Registration failed. Please try again.';
                    set({ error: errorMsg, isLoading: false });
                    throw err;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null });
            },

            initialize: async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    set({ token });
                    try {
                        const user = await authService.getMe();
                        set({ user });
                    } catch {
                        // Token invalid
                        localStorage.removeItem('token');
                        set({ token: null, user: null });
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }), // Only persist token
        }
    )
);
