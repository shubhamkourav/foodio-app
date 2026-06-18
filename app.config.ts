import type { ExpoConfig } from 'expo/config';

const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

const config: ExpoConfig = {
  name: 'Foodio',
  slug: 'foodio',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'foodio',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.foodio.app',
    infoPlist: {
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
      NSLocationWhenInUseUsageDescription:
        'Foodio uses your location to show nearby restaurants and deliver to the right address.',
    },
    config: googleMapsApiKey ? { googleMapsApiKey } : undefined,
  },
  android: {
    package: 'com.foodio.app',
    adaptiveIcon: {
      backgroundColor: '#EBFFF3',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    config: googleMapsApiKey ? { googleMaps: { apiKey: googleMapsApiKey } } : undefined,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Foodio uses your location to show nearby restaurants and deliver to the right address.',
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#EBFFF3',
      },
    ],
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: 'merchant.com.foodio.app',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
  },
};

export default config;
