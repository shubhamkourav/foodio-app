import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface DividerWithTextProps {
  label: string;
}

export function DividerWithText({ label }: DividerWithTextProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.neutral[200] },
  label: { ...typography.caption, color: colors.neutral[600] },
});
