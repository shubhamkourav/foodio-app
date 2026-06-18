import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface CategoryCarouselProps {
  categories: string[];
  selected?: string;
  onSelect?: (category: string) => void;
}

export function CategoryCarousel({ categories, selected, onSelect }: CategoryCarouselProps) {
  const allCategories = ['All', ...categories.filter((c) => c !== 'All')];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      accessibilityLabel="Food categories">
      {allCategories.map((category) => {
        const isActive = (selected ?? 'All') === category;
        return (
          <Pressable
            key={category}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${category}`}
            accessibilityState={{ selected: isActive }}
            hitSlop={8}
            onPress={() => onSelect?.(category)}
            style={[styles.chip, isActive && styles.chipActive]}>
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.sm, paddingHorizontal: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { ...typography.label, color: colors.neutral[700] },
  chipTextActive: { color: colors.white },
});
