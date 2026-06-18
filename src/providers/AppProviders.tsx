import { StripeProvider } from '@stripe/stripe-react-native';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { APP_SCHEME, STRIPE_PUBLISHABLE_KEY } from '@/constants/config';
import { connectOrdersSocket, disconnectOrdersSocket } from '@/services/socket';
import { useAuthStore } from '@/stores/authStore';
import { ApiClientError } from '@/types/api';
import { getErrorMessage } from '@/utils/getErrorMessage';

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiClientError) {
    if (error.statusCode === 0) return failureCount < 2;
    if (error.statusCode >= 400 && error.statusCode < 500) return false;
  }

  return failureCount < 1;
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (__DEV__) {
        console.warn('[query]', getErrorMessage(error));
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (__DEV__) {
        console.warn('[mutation]', getErrorMessage(error));
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: shouldRetryQuery,
    },
    mutations: {
      retry: false,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate().finally(() => setReady(true));
  }, [hydrate]);

  useEffect(() => {
    if (!ready) return;

    if (accessToken) {
      connectOrdersSocket();
      return () => disconnectOrdersSocket();
    }

    disconnectOrdersSocket();
  }, [accessToken, ready]);

  if (!ready) {
    return null;
  }

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY || 'pk_test_unconfigured'}
      urlScheme={APP_SCHEME}
      merchantIdentifier="merchant.com.foodio.app">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StripeProvider>
  );
}

export { queryClient };
