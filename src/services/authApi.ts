import { apiRequest } from './apiClient';
import { useAuthStore } from '@/stores/authStore';
import type { LoginResponse } from '@/types/user';

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiRequest<{ id: string; email: string; message: string }>('/auth/register', {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  verifyOtp: (email: string, code: string) =>
    apiRequest<{ verified: boolean }>('/auth/verify-otp', {
      method: 'POST',
      body: { email, code },
      auth: false,
    }),

  login: async (email: string, password: string) => {
    const data = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    });
    await useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
    useAuthStore.getState().setUser(data.user);
    return data;
  },

  logout: async () => {
    try {
      await apiRequest<{ loggedOut: boolean }>('/auth/logout', { method: 'POST' });
    } finally {
      await useAuthStore.getState().clearAuth();
    }
  },

  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      auth: false,
    }),

  resetPassword: (email: string, code: string, password: string) =>
    apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: { email, code, password },
      auth: false,
    }),
};
