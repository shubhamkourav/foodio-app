import { Info } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export interface OrderCostSummaryProps {
  subtotal: number;
  deliveryFee: number;
  estimatedTax: number;
  tip?: number;
  total: number;
}

export function OrderCostSummary({
  subtotal,
  deliveryFee,
  estimatedTax,
  tip = 0,
  total,
}: OrderCostSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary</Text>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.labelWithIcon}>
            <Text style={styles.label}>Delivery Fee</Text>
            <Info size={12} color={colors.neutral[500]} />
          </View>
          <Text style={styles.value}>{formatCurrency(deliveryFee)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.labelWithIcon}>
            <Text style={styles.label}>Fees & Estimated Taxes</Text>
            <Info size={12} color={colors.neutral[500]} />
          </View>
          <Text style={styles.value}>{formatCurrency(estimatedTax)}</Text>
        </View>

        {tip > 0 ? (
          <View style={styles.row}>
            <Text style={styles.label}>Tip</Text>
            <Text style={styles.value}>{formatCurrency(tip)}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 13,
    paddingBottom: 16,
  },
  title: {
    ...typography.h3,
    color: colors.neutral[900],
    paddingHorizontal: layout.screenPadding,
    marginBottom: 16,
  },
  rows: { gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
    paddingHorizontal: layout.screenPadding,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: { ...typography.body, color: colors.neutral[900] },
  value: { ...typography.body, color: colors.neutral[900] },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginHorizontal: layout.screenPadding,
    marginTop: 12,
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
    paddingHorizontal: layout.screenPadding,
  },
  totalLabel: { ...typography.buttonLabel, color: colors.neutral[900] },
  totalValue: { ...typography.buttonLabel, color: colors.neutral[900] },
});
