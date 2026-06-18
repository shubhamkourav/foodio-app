import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import type { User } from '@/types/user';

const ACCESS_TOKEN_KEY = 'foodio_access_token';
const REFRESH_TOKEN_KEY = 'foodio_refresh_token';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isHydrated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  setUser: (user: User | null) => void;
  clearAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isHydrated: false,

  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken });
  },

  setUser: (user) => set({ user }),

  clearAuth: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    set({ accessToken: null, refreshToken: null, user: null });
  },

  hydrate: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);
    set({ accessToken, refreshToken, isHydrated: true });
  },
}));

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function getRefreshToken(): string | null {
  return useAuthStore.getState().refreshToken;
}
