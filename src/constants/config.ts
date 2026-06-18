import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 3001;

function extractExpoDevHost(): string | null {
  const debuggerHost = Constants.expoGoConfig?.debuggerHost;
  if (debuggerHost) {
    return debuggerHost.split(':')[0] ?? null;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const withoutScheme = hostUri.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
    return withoutScheme.split(':')[0] ?? null;
  }

  return null;
}

/** Host reachable from the current simulator, emulator, or physical device. */
function resolveDevHost(): string {
  const expoHost = extractExpoDevHost();
  if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
    return expoHost;
  }

  // Android emulator maps 10.0.2.2 to the dev machine.
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return 'localhost';
}

function rewriteLocalhostUrl(url: string): string {
  if (!__DEV__) return url;
  if (!url.includes('localhost') && !url.includes('127.0.0.1')) return url;
  return url.replace(/localhost|127\.0\.0\.1/g, resolveDevHost());
}

const envApiUrl = process.env.EXPO_PUBLIC_API_URL ?? `http://localhost:${API_PORT}/api/v1`;
const envSocketUrl = process.env.EXPO_PUBLIC_SOCKET_URL ?? `http://localhost:${API_PORT}`;

export const API_BASE_URL = rewriteLocalhostUrl(envApiUrl);
export const SOCKET_URL = rewriteLocalhostUrl(envSocketUrl);
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export const APP_SCHEME = 'foodio';

if (__DEV__) {
  console.info('[Foodio] API:', API_BASE_URL);
}
