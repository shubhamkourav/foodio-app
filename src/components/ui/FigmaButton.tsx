import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface FigmaButtonProps extends Omit<TouchableOpacityProps, 'children' | 'style'> {
  label: string;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Primary rect button — medium, label only */
export function FigmaButton({
  label,
  loading = false,
  fullWidth = true,
  disabled,
  style,
  activeOpacity = 0.9,
  ...props
}: FigmaButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      activeOpacity={activeOpacity}
      disabled={isDisabled}
      style={[fullWidth && styles.fullWidth, style]}
      {...props}>
      <View style={[styles.button, isDisabled && styles.disabled]}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: layout.buttonRadius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  disabled: { opacity: 0.5 },
  label: {
    ...typography.buttonLabel,
    color: colors.white,
  },
});
