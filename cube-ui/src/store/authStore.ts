import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../types/auth';

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userInfo: UserInfo) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      isAuthenticated: false,
      setAuth: (token: string, userInfo: UserInfo) =>
        set({
          token,
          userInfo,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          token: null,
          userInfo: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);