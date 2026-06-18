import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterSheetActions } from '@/components/home/filters/FilterSheetActions';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

const OFFER_OPTIONS = [
  { key: 'hasOffers' as const, label: 'Active offers' },
  { key: 'freeDelivery' as const, label: 'Free delivery' },
];

export interface OffersFilterSheetProps {
  visible: boolean;
  hasOffers?: boolean;
  freeDelivery?: boolean;
  onClose: () => void;
  onApply: (value: { hasOffers: boolean; freeDelivery: boolean }) => void;
}

/** Figma filter sheet — Offers */
export function OffersFilterSheet({
  visible,
  hasOffers,
  freeDelivery,
  onClose,
  onApply,
}: OffersFilterSheetProps) {
  const [draftOffers, setDraftOffers] = useState(hasOffers ?? false);
  const [draftFreeDelivery, setDraftFreeDelivery] = useState(freeDelivery ?? false);

  useEffect(() => {
    if (visible) {
      setDraftOffers(hasOffers ?? false);
      setDraftFreeDelivery(freeDelivery ?? false);
    }
  }, [visible, hasOffers, freeDelivery]);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Offers">
      <View style={styles.list}>
        {OFFER_OPTIONS.map((option) => {
          const selected =
            option.key === 'hasOffers' ? draftOffers : draftFreeDelivery;
          return (
            <Pressable
              key={option.key}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              onPress={() => {
                if (option.key === 'hasOffers') {
                  setDraftOffers((current) => !current);
                } else {
                  setDraftFreeDelivery((current) => !current);
                }
              }}
              style={[styles.row, selected && styles.rowSelected]}>
              <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <FilterSheetActions
        onReset={() => {
          setDraftOffers(false);
          setDraftFreeDelivery(false);
        }}
        onApply={() => {
          onApply({
            hasOffers: draftOffers,
            freeDelivery: draftFreeDelivery,
          });
          onClose();
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  rowSelected: {
    backgroundColor: colors.secondary,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
  labelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
