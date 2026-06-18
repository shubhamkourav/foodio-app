import { CreditCard, Smartphone, Wallet } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { PaymentMethod } from '@/types/order';

const METHODS: Array<{
  id: PaymentMethod;
  label: string;
  icon: typeof CreditCard;
}> = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'cod', label: 'Cash on Delivery', icon: Wallet },
];

export interface PaymentMethodCardProps {
  selected?: PaymentMethod;
  onSelect?: (method: PaymentMethod) => void;
}

export function PaymentMethodCard({ selected = 'card', onSelect }: PaymentMethodCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Payment Method</Text>
      {METHODS.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;
        return (
          <Pressable
            key={method.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={method.label}
            hitSlop={8}
            onPress={() => onSelect?.(method.id)}
            style={[styles.methodRow, isSelected && styles.methodSelected]}>
            <Icon size={20} color={isSelected ? colors.primary : colors.neutral[400]} />
            <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
              {method.label}
            </Text>
          </Pressable>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  title: { ...typography.h3, color: colors.neutral[900], marginBottom: spacing.xs },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  methodSelected: { borderColor: colors.primary, backgroundColor: colors.secondary },
  methodLabel: { ...typography.body, color: colors.neutral[700] },
  methodLabelSelected: { color: colors.neutral[900], fontFamily: typography.label.fontFamily },
});
