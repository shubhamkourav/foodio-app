import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { authApi } from '@/services/authApi';
import type { RegisterPayload } from '@/services/authApi';
import { usersApi } from '@/services/usersApi';
import { useAuthStore } from '@/stores/authStore';
import { markOnboardingSeen } from '@/utils/onboardingStorage';

export function useAuth() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setUser = useAuthStore((s) => s.setUser);

  const isAuthenticated = !!accessToken;

  const profileQuery = useQuery({
    queryKey: ['user', 'me'],
    queryFn: usersApi.getProfile,
    enabled: isHydrated && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (profileQuery.data) {
      setUser(profileQuery.data);
    }
  }, [profileQuery.data, setUser]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async (data) => {
      await markOnboardingSeen();
      setUser(data.user);
      queryClient.setQueryData(['user', 'me'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authApi.verifyOtp(email, code),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    user: user ?? profileQuery.data ?? null,
    isAuthenticated,
    isHydrated,
    isLoading: profileQuery.isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    verifyOtp: verifyOtpMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    refetchProfile: profileQuery.refetch,
  };
}
