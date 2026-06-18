import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, accessibilityLabel, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={accessibilityLabel ?? label}
        placeholderTextColor={colors.placeholder}
        style={[styles.input, error && styles.inputError, style]}
        {...props}
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { ...typography.fieldLabel, color: colors.neutral[900] },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.inputRadius,
    paddingHorizontal: layout.inputPaddingH,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[100],
    color: colors.neutral[900],
    minHeight: layout.inputHeight,
  },
  inputError: { borderColor: colors.error },
  error: { ...typography.caption, color: colors.error },
});
