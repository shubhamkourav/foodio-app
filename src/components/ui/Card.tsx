import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export interface CardProps extends ViewProps {
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ padded = true, elevated = true, style, children, ...props }: CardProps) {
  return (
    <View
      accessibilityRole="none"
      style={[styles.card, padded && styles.padded, elevated && styles.elevated, style]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
  },
  padded: { padding: spacing.md },
  elevated: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
