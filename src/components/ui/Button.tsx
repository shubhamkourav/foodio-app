import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      hitSlop={HIT_SLOP}
      disabled={isDisabled}
      style={(state) => {
        const userStyle = typeof style === 'function' ? style(state) : style;
        return [
          styles.base,
          styles[size],
          styles[variant],
          fullWidth && styles.fullWidth,
          state.pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
          userStyle,
        ];
      }}
      {...props}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label` as keyof typeof styles]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.buttonRadius,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 36 },
  md: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, minHeight: layout.inputHeight },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: { backgroundColor: colors.secondary },
  outline: { backgroundColor: colors.white, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  fullWidth: { width: '100%' },
  label: { ...typography.buttonLabel },
  primaryLabel: { color: colors.white },
  secondaryLabel: { color: colors.primary },
  outlineLabel: { color: colors.primary },
  ghostLabel: { color: colors.primary },
});
