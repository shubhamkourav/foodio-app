import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { FoodioLogo } from '@/components/brand/FoodioLogo';
import { colors } from '@/constants/colors';
import { getHasSeenOnboarding } from '@/utils/onboardingStorage';

const SPLASH_DURATION_MS = 1200;

export default function SplashScreen() {
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      void getHasSeenOnboarding().then((hasSeenOnboarding) => {
        if (cancelled) return;
        router.replace(hasSeenOnboarding ? '/(auth)/login' : '/(auth)/welcome');
      });
    }, SPLASH_DURATION_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <FoodioLogo variant="color" size="lg" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
