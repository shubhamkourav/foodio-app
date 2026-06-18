import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { FoodioLogo } from '@/components/brand/FoodioLogo';
import { colors } from '@/constants/colors';

const LAUNCH_DURATION_MS = 1200;

export default function LaunchScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/signup');
    }, LAUNCH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FoodioLogo variant="white" size="lg" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
