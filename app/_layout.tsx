import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/components/useColorScheme';
import { colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { AppProviders } from '@/providers/AppProviders';
import { getHasSeenOnboarding } from '@/utils/onboardingStorage';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const FoodioLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.white,
    card: colors.white,
    text: colors.neutral[900],
    border: colors.neutral[200],
  },
};

const FoodioDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      void getHasSeenOnboarding().then((hasSeenOnboarding) => {
        router.replace(hasSeenOnboarding ? '/(auth)/login' : '/(auth)/splash');
      });
      return;
    }

    if (
      !isAuthenticated &&
      inAuthGroup &&
      (segments[1] === 'welcome' || segments[1] === 'splash')
    ) {
      void getHasSeenOnboarding().then((hasSeenOnboarding) => {
        if (hasSeenOnboarding) {
          router.replace('/(auth)/login');
        }
      });
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isHydrated, router, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? FoodioDarkTheme : FoodioLightTheme}>
      <Stack screenOptions={{ headerBackTitle: 'Back' }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="restaurant/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="restaurant/[id]/item/[itemId]"
          options={{ title: 'Item', presentation: 'modal', headerShown: true }}
        />
        <Stack.Screen name="cart" options={{ title: 'Cart', headerBackTitle: 'Back' }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout', headerBackTitle: 'Back' }} />
        <Stack.Screen name="tracking/[orderId]" options={{ title: 'Track Order' }} />
        <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="filters" options={{ title: 'Filter' }} />
        <Stack.Screen name="address" options={{ title: 'Delivery address' }} />
        <Stack.Screen name="location-map" options={{ headerShown: false }} />
        <Stack.Screen name="add-address" options={{ title: 'Enter Address' }} />
      </Stack>
    </ThemeProvider>
  );
}
