import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authApi, LoginData, RegisterData, UpdateProfileData } from '../api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(data);
          localStorage.setItem('token', response.token);
          set({ user: response.user, token: response.token, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          localStorage.setItem('token', response.token);
          set({ user: response.user, token: response.token, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          set({ user: null, token: null });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.updateProfile(data);
          set({ user, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Update failed', isLoading: false });
          throw error;
        }
      },

      loadUser: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
          const user = await authApi.me();
          set({ user, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to load user', isLoading: false });
          localStorage.removeItem('token');
          set({ user: null, token: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
