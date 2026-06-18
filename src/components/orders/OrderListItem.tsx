import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Order, OrderStatus } from '@/types/order';

export interface OrderListItemProps {
  order: Order;
}

const ACTIVE_STATUSES: OrderStatus[] = [
  'pending_payment',
  'confirmed',
  'preparing',
  'picked_up',
];

function formatOrderStatus(status: OrderStatus): string {
  switch (status) {
    case 'delivered':
      return 'Completed';
    case 'cancelled':
      return 'Canceled';
    case 'pending_payment':
      return 'Pending payment';
    default:
      return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

function formatOrderDate(date?: string): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function OrderListItem({ order }: OrderListItemProps) {
  const itemCount = order.itemCount ?? order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const restaurantName = order.restaurantName ?? 'Restaurant';
  const dateLine = `${formatOrderDate(order.createdAt)} · ${formatOrderStatus(order.status)}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Order from ${restaurantName}`}
      onPress={() => router.push(`/tracking/${order.id}`)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.content}>
        {order.restaurantImage ? (
          <Image
            source={{ uri: order.restaurantImage }}
            style={styles.image}
            contentFit="cover"
            accessibilityLabel={restaurantName}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurantName}
          </Text>
          <Text style={styles.summary}>
            {itemCount} Items · {formatCurrency(order.total)}
          </Text>
          <Text style={styles.meta}>{dateLine}</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View store"
        hitSlop={8}
        onPress={(event) => {
          event.stopPropagation();
          router.push(`/restaurant/${order.restaurantId}`);
        }}
        style={styles.viewStore}>
        <Text style={styles.viewStoreText}>View store</Text>
      </Pressable>

      <View style={styles.divider} />
    </Pressable>
  );
}

export function isActiveOrder(status: OrderStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

const styles = StyleSheet.create({
  row: {
    minHeight: layout.orderRowHeight,
    justifyContent: 'center',
    paddingTop: 21,
    paddingBottom: 21,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
  },
  imagePlaceholder: { backgroundColor: colors.secondary },
  details: { flex: 1, gap: 2 },
  name: { ...typography.fieldLabel, color: colors.neutral[900] },
  summary: { ...typography.body, color: colors.neutral[900] },
  meta: { ...typography.body, color: colors.neutral[600] },
  viewStore: {
    position: 'absolute',
    right: layout.screenPadding,
    top: 39,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.buttonRadius,
  },
  viewStoreText: { ...typography.captionMedium, color: colors.neutral[900] },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});
