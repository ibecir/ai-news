import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserWithStats } from '@/types';
import api from '@/services/api';

interface AuthState {
  user: UserWithStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.login({ email });
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: response.message || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: unknown) {
          const err = error as { response?: { data?: { detail?: { message?: string } | string } } };
          const message =
            typeof err.response?.data?.detail === 'string'
              ? err.response.data.detail
              : err.response?.data?.detail?.message || 'Login failed. Please try again.';
          set({
            error: message,
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        api.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
