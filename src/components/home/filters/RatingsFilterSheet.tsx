import { Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterSheetActions } from '@/components/home/filters/FilterSheetActions';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

const RATING_OPTIONS = [
  { value: 5, label: '5' },
  { value: 4, label: '4' },
  { value: 3, label: '3' },
  { value: 2, label: '2' },
  { value: 1, label: '1' },
  { value: undefined, label: 'Any' },
] as const;

export interface RatingsFilterSheetProps {
  visible: boolean;
  value?: number;
  onClose: () => void;
  onApply: (minRating?: number) => void;
}

/** Figma Docked/ button/Filter/ Ratings */
export function RatingsFilterSheet({
  visible,
  value,
  onClose,
  onApply,
}: RatingsFilterSheetProps) {
  const [draft, setDraft] = useState<number | undefined>(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Rating">
      <View style={styles.list}>
        {RATING_OPTIONS.map((option) => {
          const selected = draft === option.value;
          return (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setDraft(option.value)}
              style={[styles.row, selected && styles.rowSelected]}>
              {option.value != null ? (
                <View style={styles.stars}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      color={colors.accent}
                      fill={index < option.value! ? colors.accent : 'transparent'}
                    />
                  ))}
                  <Text style={styles.andUp}>& up</Text>
                </View>
              ) : (
                <Text style={styles.anyLabel}>Any</Text>
              )}
            </Pressable>
          );
        })}
      </View>
      <FilterSheetActions
        onReset={() => setDraft(undefined)}
        onApply={() => {
          onApply(draft);
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
    minHeight: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  rowSelected: {
    backgroundColor: colors.secondary,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  andUp: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
    marginLeft: 4,
  },
  anyLabel: {
    ...typography.bodyMedium,
    color: colors.neutral[800],
  },
});
