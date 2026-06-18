import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export interface AuthTabBarProps {
  active: 'login' | 'signup';
  onLoginPress: () => void;
  onSignupPress: () => void;
}

export function AuthTabBar({ active, onLoginPress, onSignupPress }: AuthTabBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: active === 'signup' }}
        onPress={onSignupPress}
        style={styles.tab}>
        <Text style={[styles.label, active === 'signup' ? styles.active : styles.inactive]}>
          Sign Up
        </Text>
        {active === 'signup' ? <View style={styles.indicatorActive} /> : <View style={styles.indicator} />}
      </Pressable>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: active === 'login' }}
        onPress={onLoginPress}
        style={styles.tab}>
        <Text style={[styles.label, active === 'login' ? styles.active : styles.inactive]}>
          Log In
        </Text>
        {active === 'login' ? <View style={styles.indicatorActive} /> : <View style={styles.indicator} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', height: 57 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { ...typography.fieldLabel, marginBottom: 5 },
  active: { color: colors.neutral[900] },
  inactive: { color: colors.placeholder },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.borderOpaque,
  },
  indicatorActive: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: colors.neutral[900],
  },
});
