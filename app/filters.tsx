import { router, Stack } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterSheetActions } from '@/components/home/filters/FilterSheetActions';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { MENU_PRICE_OPTIONS } from '@/constants/priceFilters';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useHomeFiltersStore } from '@/stores/homeFiltersStore';
import { DEFAULT_HOME_FILTERS, type HomeFilters, type HomeSortBy } from '@/types/homeFilters';

const SORT_OPTIONS: { id: HomeSortBy; label: string }[] = [
  { id: 'popular', label: 'Most popular' },
  { id: 'rating', label: 'Rating' },
  { id: 'delivery_time', label: 'Delivery time' },
  { id: 'distance', label: 'Distance' },
  { id: 'cost', label: 'Cost' },
];

const DELIVERY_TIME_OPTIONS = [10, 20, 30, 40] as const;
const DISTANCE_OPTIONS = [2, 5, 10] as const;

export default function FiltersScreen() {
  const { filters, setFilters } = useHomeFiltersStore();
  const [draft, setDraft] = useState<HomeFilters>(filters);

  const patch = (patchValue: Partial<HomeFilters>) => {
    setDraft((current) => ({ ...current, ...patchValue }));
  };

  const handleApply = () => {
    setFilters(draft);
    router.back();
  };

  const handleReset = () => {
    setDraft({ ...DEFAULT_HOME_FILTERS });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Filter' }} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        <View style={styles.sortList}>
          {SORT_OPTIONS.map((option) => {
            const selected = draft.sortBy === option.id;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => patch({ sortBy: option.id })}
                style={styles.sortRow}>
                <Text style={[styles.sortLabel, selected && styles.sortLabelActive]}>
                  {option.label}
                </Text>
                {selected ? <View style={styles.sortCheck} /> : null}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Menu price</Text>
        <View style={styles.priceRow}>
          {MENU_PRICE_OPTIONS.map((option) => {
            const selected = draft.priceAmounts?.includes(option.amount) ?? false;
            return (
              <TouchableOpacity
                key={option.amount}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  const current = draft.priceAmounts ?? [];
                  const next = selected
                    ? current.filter((item) => item !== option.amount)
                    : [...current, option.amount];
                  patch({ priceAmounts: next.length > 0 ? next : undefined });
                }}
                style={styles.priceTouchable}>
                <View style={[styles.priceCircle, selected && styles.priceCircleActive]}>
                  <Text style={[styles.priceLabel, selected && styles.priceLabelActive]}>
                    {option.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Rating</Text>
        <View style={styles.ratingRow}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const selected = draft.minRating === stars;
            return (
              <Pressable
                key={stars}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => patch({ minRating: selected ? undefined : stars })}
                style={[styles.ratingChip, selected && styles.ratingChipActive]}>
                <View style={styles.ratingStars}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      color={colors.accent}
                      fill={index < stars ? colors.accent : 'transparent'}
                    />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Delivery time</Text>
        <View style={styles.pillRow}>
          {DELIVERY_TIME_OPTIONS.map((minutes) => {
            const selected = draft.deliveryTimeMax === minutes;
            return (
              <TouchableOpacity
                key={minutes}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() =>
                  patch({
                    deliveryTimeMax: selected ? undefined : minutes,
                    fastDelivery: selected ? false : minutes === 30,
                  })
                }
                style={styles.pillTouchable}>
                <View style={[styles.pill, selected && styles.pillActive]}>
                  <Text style={[styles.pillText, selected && styles.pillTextActive]}>
                    {minutes} min
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Distance</Text>
        <View style={styles.pillRow}>
          {DISTANCE_OPTIONS.map((km) => {
            const selected = draft.maxDistanceKm === km;
            return (
              <TouchableOpacity
                key={km}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => patch({ maxDistanceKm: selected ? undefined : km })}
                style={styles.pillTouchable}>
                <View style={[styles.pill, selected && styles.pillActive]}>
                  <Text style={[styles.pillText, selected && styles.pillTextActive]}>
                    {km} km
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.dock}>
        <FilterSheetActions onReset={handleReset} onApply={handleApply} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.cardTitle,
    fontSize: 18,
    lineHeight: 24,
    color: colors.neutral[900],
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sortList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderOpaque,
  },
  sortRow: {
    minHeight: layout.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderOpaque,
    paddingHorizontal: spacing.xs,
  },
  sortLabel: {
    ...typography.body16,
    color: colors.neutral[800],
  },
  sortLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  sortCheck: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  priceRow: {
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
  ratingRow: {
    gap: 8,
  },
  ratingChip: {
    minHeight: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  ratingChipActive: {
    backgroundColor: colors.secondary,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillTouchable: {
    flexGrow: 1,
    minWidth: '22%',
  },
  pill: {
    height: 33,
    borderRadius: layout.pillRadius,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pillActive: {
    backgroundColor: colors.secondary,
  },
  pillText: {
    ...typography.captionMedium,
    color: colors.neutral[800],
  },
  pillTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  dock: {
    paddingHorizontal: layout.screenPadding,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderOpaque,
    backgroundColor: colors.white,
  },
});
