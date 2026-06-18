import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export interface OnboardingPaginationProps {
  total: number;
  activeIndex: number;
}

export function OnboardingPagination({ total, activeIndex }: OnboardingPaginationProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {Array.from({ length: total }).map((_, index) => {
        const active = index === activeIndex;
        return (
          <View
            key={index}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.dot, active ? styles.dotActive : styles.dotInactive]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  dot: { height: 6, borderRadius: 999 },
  dotActive: { width: 18, backgroundColor: colors.primary },
  dotInactive: { width: 6, backgroundColor: colors.neutral[300] },
});
