import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

const TIP_OPTIONS = [1, 2, 3, 4, 5] as const;

export interface TipSelectorProps {
  selected?: number | null;
  onSelect?: (amount: number | null) => void;
}

export function TipSelector({ selected = null, onSelect }: TipSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Add Tip</Text>
        <Text style={styles.optional}>(Optional)</Text>
      </View>
      <View style={styles.options}>
        {TIP_OPTIONS.map((amount) => {
          const isSelected = selected === amount;
          return (
            <Pressable
              key={amount}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Tip ${formatCurrency(amount)}`}
              onPress={() => onSelect?.(isSelected ? null : amount)}
              style={[styles.pill, isSelected && styles.pillSelected]}>
              <Text style={[styles.pillLabel, isSelected && styles.pillLabelSelected]}>
                {formatCurrency(amount)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 9,
    paddingBottom: 12,
    paddingHorizontal: layout.screenPadding,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  title: { ...typography.h3, color: colors.neutral[900] },
  optional: { ...typography.caption, color: colors.neutral[600] },
  options: {
    flexDirection: 'row',
    gap: 0,
  },
  pill: {
    flex: 1,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  pillLabel: { ...typography.captionMedium, color: colors.neutral[900] },
  pillLabelSelected: { color: colors.primary, fontWeight: '600' },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginTop: 12,
  },
});
