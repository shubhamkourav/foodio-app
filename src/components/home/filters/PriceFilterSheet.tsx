import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterSheetActions } from '@/components/home/filters/FilterSheetActions';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { MENU_PRICE_OPTIONS } from '@/constants/priceFilters';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export interface PriceFilterSheetProps {
  visible: boolean;
  value?: number[];
  onClose: () => void;
  onApply: (priceAmounts?: number[]) => void;
}

/** Figma Docked/ button/Filter/ Price — menu price amounts */
export function PriceFilterSheet({
  visible,
  value,
  onClose,
  onApply,
}: PriceFilterSheetProps) {
  const [draft, setDraft] = useState<number[]>(value ?? []);

  useEffect(() => {
    if (visible) setDraft(value ?? []);
  }, [visible, value]);

  const toggleAmount = (amount: number) => {
    setDraft((current) =>
      current.includes(amount)
        ? current.filter((item) => item !== amount)
        : [...current, amount],
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Menu price">
      <View style={styles.grid}>
        {MENU_PRICE_OPTIONS.map((option) => {
          const selected = draft.includes(option.amount);
          return (
            <Pressable
              key={option.amount}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              onPress={() => toggleAmount(option.amount)}
              style={styles.priceTouchable}>
              <View style={[styles.priceCircle, selected && styles.priceCircleActive]}>
                <Text style={[styles.priceLabel, selected && styles.priceLabelActive]}>
                  {option.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <FilterSheetActions
        onReset={() => setDraft([])}
        onApply={() => {
          onApply(draft.length > 0 ? draft : undefined);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  priceTouchable: {},
  priceCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  priceCircleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  priceLabel: {
    ...typography.captionMedium,
    color: colors.neutral[800],
  },
  priceLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
