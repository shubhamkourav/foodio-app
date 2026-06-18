import { OrderCostSummary } from '@/components/cart/OrderCostSummary';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { estimateTax, DEFAULT_DELIVERY_FEE, calculateOrderTotal } from '@/utils/orderPricing';
import { StyleSheet, Text, View } from 'react-native';

export interface OrderSummaryCardProps {
  restaurantName?: string;
  itemCount: number;
  subtotal: number;
  deliveryFee?: number;
  discount?: number;
}

export function OrderSummaryCard({
  restaurantName,
  itemCount,
  subtotal,
  deliveryFee = DEFAULT_DELIVERY_FEE,
  discount = 0,
}: OrderSummaryCardProps) {
  const estimatedTax = estimateTax(subtotal);
  const total = calculateOrderTotal(subtotal, deliveryFee, estimatedTax, 0, discount);

  return (
    <View style={styles.container}>
      {restaurantName ? (
        <Text style={styles.restaurant} accessibilityLabel={`Order from ${restaurantName}`}>
          {restaurantName}
        </Text>
      ) : null}
      <Text style={styles.items}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
      <OrderCostSummary
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        estimatedTax={estimatedTax}
        total={total - discount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  restaurant: { ...typography.h3, color: colors.neutral[900], paddingHorizontal: 16 },
  items: {
    ...typography.caption,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
    paddingHorizontal: 16,
  },
});
