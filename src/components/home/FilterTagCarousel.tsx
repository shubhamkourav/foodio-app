import { ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FILTER_TAG_CHIPS, type FilterSheetId, type FilterToggleId } from '@/constants/filterTags';
import { formatSelectedPriceAmounts } from '@/constants/priceFilters';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { hasActiveHomeFilters, type HomeFilters } from '@/types/homeFilters';

export type { FilterToggleId } from '@/constants/filterTags';

export interface FilterTagCarouselProps {
  filters: HomeFilters;
  onOpenAllFilters: () => void;
  onOpenSheet: (sheet: FilterSheetId) => void;
  onToggleChip: (id: FilterToggleId) => void;
}

function isChipActive(filters: HomeFilters, chip: (typeof FILTER_TAG_CHIPS)[number]): boolean {
  if (chip.kind === 'sheet') {
    if (chip.id === 'ratings') return filters.minRating != null;
    if (chip.id === 'offers') return filters.hasOffers === true || filters.freeDelivery === true;
    if (chip.id === 'price') return (filters.priceAmounts?.length ?? 0) > 0;
    return false;
  }

  switch (chip.id) {
    case '30 min delivery':
      return filters.fastDelivery || filters.deliveryTimeMax === 30;
    case 'Takeout':
      return filters.takeout;
    case 'Picked for you':
      return filters.pickedForYou === true;
    case 'Top place':
      return filters.topPlace === true;
    case 'Halal':
      return filters.halal === true;
    case 'Fastfood':
      return filters.fastfood === true;
    case 'Vegetarian':
      return filters.vegetarian === true;
    default:
      return false;
  }
}

function getChipLabel(chip: (typeof FILTER_TAG_CHIPS)[number], filters: HomeFilters): string {
  if (chip.id === 'price' && filters.priceAmounts?.length) {
    return formatSelectedPriceAmounts(filters.priceAmounts);
  }
  return chip.label;
}

/** Figma Filter tag row — tabs & tags */
export function FilterTagCarousel({
  filters,
  onOpenAllFilters,
  onOpenSheet,
  onToggleChip,
}: FilterTagCarouselProps) {
  const showFilterDot = hasActiveHomeFilters(filters);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      accessibilityLabel="Restaurant filters">
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Open all filters"
        hitSlop={8}
        onPress={onOpenAllFilters}
        style={styles.filterIconTouchable}>
        <View style={styles.filterIcon}>
          <SlidersHorizontal size={18} color={colors.neutral[800]} />
          {showFilterDot ? <View style={styles.filterDot} /> : null}
        </View>
      </TouchableOpacity>

      {FILTER_TAG_CHIPS.map((chip) => {
        const isActive = isChipActive(filters, chip);
        const label = getChipLabel(chip, filters);
        const onPress =
          chip.kind === 'sheet' ? () => onOpenSheet(chip.id) : () => onToggleChip(chip.id);

        return (
          <TouchableOpacity
            key={chip.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            hitSlop={8}
            onPress={onPress}
            style={styles.chipTouchable}>
            <View style={[styles.chip, isActive && styles.chipActive]}>
              {chip.kind === 'toggle' && chip.icon ? (
                <chip.icon size={16} color={isActive ? colors.primary : colors.neutral[800]} />
              ) : null}
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
              {chip.kind === 'sheet' && chip.chevron ? (
                <ChevronDown size={14} color={isActive ? colors.primary : colors.neutral[800]} />
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: layout.screenPadding,
    gap: 8,
    minHeight: layout.filterRowHeight,
    alignItems: 'center',
    paddingVertical: 9,
  },
  filterIconTouchable: {
    alignSelf: 'center',
  },
  filterIcon: {
    width: 50,
    height: 39,
    borderRadius: layout.pillRadius,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderOpaque,
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  chipTouchable: {
    alignSelf: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 34,
    borderRadius: layout.pillRadius,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderOpaque,
  },
  chipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  chipText: {
    ...typography.captionMedium,
    color: colors.neutral[800],
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
