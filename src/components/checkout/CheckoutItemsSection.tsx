import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import type { CartItem } from '@/types/cart';

export interface CheckoutItemsSectionProps {
  items: CartItem[];
  restaurantName?: string;
  onSeeMenu?: () => void;
  onAddItems?: () => void;
}

export function CheckoutItemsSection({
  items,
  restaurantName,
  onSeeMenu,
  onAddItems,
}: CheckoutItemsSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Items</Text>
        {onSeeMenu ? (
          <Pressable accessibilityRole="link" hitSlop={8} onPress={onSeeMenu}>
            <Text style={styles.link}>See menu</Text>
          </Pressable>
        ) : null}
      </View>

      {restaurantName ? <Text style={styles.restaurant}>{restaurantName}</Text> : null}

      {items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.qtyBadge}>
            <Text style={styles.qty}>{item.quantity}x</Text>
          </View>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>
            {formatCurrency((item.price + item.selectedCustomizations.reduce((s, c) => s + c.priceModifier, 0)) * item.quantity)}
          </Text>
          <View style={styles.itemDivider} />
        </View>
      ))}

      {onAddItems ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add items"
          onPress={onAddItems}
          style={({ pressed }) => [styles.addRow, pressed && styles.pressed]}>
          <Text style={styles.addLabel}>+ Add items</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 8 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    marginBottom: 8,
  },
  title: { ...typography.h3, color: colors.neutral[900] },
  link: { ...typography.caption, color: colors.primary },
  restaurant: {
    ...typography.caption,
    color: colors.neutral[600],
    paddingHorizontal: layout.screenPadding,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
  qtyBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { ...typography.captionMedium, color: colors.neutral[900] },
  itemName: {
    ...typography.body16,
    color: colors.neutral[900],
    flex: 1,
  },
  itemPrice: { ...typography.body, color: colors.neutral[900] },
  itemDivider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: layout.screenPadding,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
  addRow: {
    minHeight: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  addLabel: { ...typography.bodyMedium, color: colors.primary },
  pressed: { opacity: 0.85 },
});
