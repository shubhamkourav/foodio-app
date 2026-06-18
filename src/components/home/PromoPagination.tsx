import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';

export interface PromoPaginationProps {
  total: number;
  activeIndex: number;
}

/** Figma Pagination 2 — black active pill, grey inactive dots */
export function PromoPagination({ total, activeIndex }: PromoPaginationProps) {
  if (total <= 1) return null;

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
    minHeight: layout.promoPaginationHeight + 3,
    marginTop: 8,
  },
  dot: { borderRadius: 999 },
  dotActive: {
    width: layout.promoPaginationActiveWidth,
    height: layout.promoPaginationHeight,
    backgroundColor: colors.neutral[900],
  },
  dotInactive: {
    width: layout.promoPaginationInactiveSize,
    height: layout.promoPaginationInactiveSize,
    backgroundColor: colors.neutral[300],
  },
});
