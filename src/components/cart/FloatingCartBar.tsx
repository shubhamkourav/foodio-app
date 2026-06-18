import { ShoppingBag } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface FloatingCartBarProps {
  itemCount: number;
  subtotal: number;
  onPress?: () => void;
}

export function FloatingCartBar({ itemCount, subtotal, onPress }: FloatingCartBarProps) {
  const insets = useSafeAreaInsets();

  if (itemCount <= 0) return null;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${itemCount} items, total ${formatCurrency(subtotal)}`}
        hitSlop={8}
        onPress={onPress}
        style={({ pressed }) => [styles.bar, pressed && styles.pressed]}>
        <View style={styles.left}>
          <ShoppingBag size={20} color={colors.white} />
          <Text style={styles.count}>{itemCount}</Text>
        </View>
        <Text style={styles.label}>View Cart</Text>
        <Text style={styles.total}>{formatCurrency(subtotal)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 0,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  pressed: { backgroundColor: colors.primaryDark },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  count: { ...typography.label, color: colors.white },
  label: { ...typography.label, color: colors.white, flex: 1, textAlign: 'center' },
  total: { ...typography.h3, color: colors.white },
});
