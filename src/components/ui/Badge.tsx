import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'primary' | 'accent' | 'success' | 'neutral';
}

export function Badge({ label, variant = 'primary', style, ...props }: BadgeProps) {
  return (
    <View
      accessibilityLabel={label}
      style={[styles.base, styles[variant], style]}
      {...props}>
      <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  primary: { backgroundColor: colors.secondary },
  accent: { backgroundColor: colors.accent },
  success: { backgroundColor: '#E8F5E9' },
  neutral: { backgroundColor: colors.neutral[50] },
  text: { ...typography.label },
  primaryText: { color: colors.primary },
  accentText: { color: colors.neutral[900] },
  successText: { color: colors.success },
  neutralText: { color: colors.neutral[700] },
});
