import { Check } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { OrderStatus } from '@/types/order';

const STEPS: Array<{ status: OrderStatus; label: string }> = [
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'picked_up', label: 'Picked up' },
  { status: 'delivered', label: 'Delivered' },
];

const STATUS_ORDER: OrderStatus[] = [
  'pending_payment',
  'confirmed',
  'preparing',
  'picked_up',
  'delivered',
  'cancelled',
];

export interface DeliveryTimelineProps {
  currentStatus: OrderStatus;
}

export function DeliveryTimeline({ currentStatus }: DeliveryTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <View style={styles.container} accessibilityLabel="Delivery status timeline">
      {STEPS.map((step, index) => {
        const stepIndex = STATUS_ORDER.indexOf(step.status);
        const isComplete = currentIndex >= stepIndex && currentStatus !== 'cancelled';
        const isActive = currentStatus === step.status;

        return (
          <View key={step.status} style={styles.step}>
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.circle,
                  isComplete && styles.circleComplete,
                  isActive && styles.circleActive,
                ]}>
                {isComplete ? <Check size={12} color={colors.white} /> : null}
              </View>
              {index < STEPS.length - 1 ? (
                <View style={[styles.line, isComplete && styles.lineComplete]} />
              ) : null}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{step.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.sm },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  stepLeft: { alignItems: 'center', width: 24 },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleComplete: { backgroundColor: colors.success, borderColor: colors.success },
  circleActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  line: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.xs,
  },
  lineComplete: { backgroundColor: colors.success },
  label: { ...typography.body, color: colors.neutral[700], paddingTop: 2 },
  labelActive: { ...typography.label, color: colors.neutral[900] },
});
