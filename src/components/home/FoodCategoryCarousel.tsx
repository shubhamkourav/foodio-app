import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import type { Cuisine } from '@/services/cuisinesApi';

export interface FoodCategoryCarouselProps {
  categories: Cuisine[];
  selected?: string;
  onSelect?: (category: string) => void;
}

export function FoodCategoryCarousel({
  categories,
  selected,
  onSelect,
}: FoodCategoryCarouselProps) {
  if (categories.length === 0) return null;

  const activeCategory = selected ?? categories[0]?.name;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      accessibilityLabel="Food categories">
      {categories.map((item) => {
        const isActive = activeCategory === item.name;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            hitSlop={8}
            onPress={() => onSelect?.(item.name)}
            style={styles.item}>
            <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: layout.screenPadding,
    gap: 8,
    minHeight: layout.categoryRowHeight,
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  item: {
    alignItems: 'center',
    minWidth: 60,
    maxWidth: 73,
    gap: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: colors.neutral[150],
  },
  emoji: { fontSize: 22 },
  label: {
    ...typography.categoryLabel,
    color: colors.neutral[800],
    textAlign: 'center',
  },
  labelActive: {
    color: colors.neutral[900],
    fontWeight: '500',
  },
});
