import { API_BASE_URL } from '@/constants/config';
import {
  getAccessToken,
  getRefreshToken,
  useAuthStore,
} from '@/stores/authStore';
import type { ApiResponse } from '@/types/api';
import { ApiClientError } from '@/types/api';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

async function performFetch(
  path: string,
  init: { method: HttpMethod; headers: Record<string, string>; body?: string },
): Promise<Response> {
  try {
    return await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new ApiClientError(
      0,
      __DEV__
        ? `Cannot reach the API at ${API_BASE_URL}. Is foodio-backend running?`
        : 'Network error. Check your connection and try again.',
    );
  }
}

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiClientError(response.status, 'Invalid response from server');
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await performFetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const json = await parseJsonResponse<{
    accessToken: string;
    refreshToken: string;
  }>(response);

  if (!response.ok || !json.data) {
    await useAuthStore.getState().clearAuth();
    return null;
  }

  await useAuthStore
    .getState()
    .setTokens(json.data.accessToken, json.data.refreshToken);

  return json.data.accessToken;
}

async function getValidAccessToken(): Promise<string | null> {
  return getAccessToken();
}

async function buildAuthHeaders(auth: boolean): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getValidAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, auth = true, retry = true } = options;
  const headers = await buildAuthHeaders(auth);

  const response = await performFetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await parseJsonResponse<T>(response);

  if (response.status === 401 && auth && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;
    if (newToken) {
      return apiRequest<T>(path, { ...options, retry: false });
    }
  }

  if (!response.ok || !json.success) {
    throw new ApiClientError(
      json.statusCode ?? response.status,
      json.message ?? 'Request failed',
      json.errors ?? [],
    );
  }

  if (json.data === null) {
    throw new ApiClientError(response.status, 'No data returned');
  }

  return json.data;
}

export async function apiRequestPaginated<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; pagination: NonNullable<ApiResponse<T>['pagination']> }> {
  const { method = 'GET', body, auth = true, retry = true } = options;
  const headers = await buildAuthHeaders(auth);

  const response = await performFetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await parseJsonResponse<T>(response);

  if (response.status === 401 && auth && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;
    if (newToken) {
      return apiRequestPaginated<T>(path, { ...options, retry: false });
    }
  }

  if (!response.ok || !json.success || json.data === null || !json.pagination) {
    throw new ApiClientError(
      json.statusCode ?? response.status,
      json.message ?? 'Request failed',
      json.errors ?? [],
    );
  }

  return { data: json.data, pagination: json.pagination };
}
