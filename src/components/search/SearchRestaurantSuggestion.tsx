import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { restaurantImageUri } from '@/constants/placeholders';
import { typography } from '@/constants/typography';
import type { SearchResult } from '@/types/search';

export interface SearchRestaurantSuggestionProps {
  restaurant: SearchResult;
  onPress?: (id: string) => void;
}

/** Figma Search/ result — thumbnail, name, cuisine or matched dishes, chevron */
export function SearchRestaurantSuggestion({ restaurant, onPress }: SearchRestaurantSuggestionProps) {
  const subtitle =
    restaurant.matchedDishes && restaurant.matchedDishes.length > 0
      ? restaurant.matchedDishes.join(', ')
      : restaurant.cuisine.join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={restaurant.name}
      onPress={() => onPress?.(restaurant.id)}>
      {({ pressed }) => (
        <View style={[styles.row, pressed && styles.pressed]}>
          <Image
            source={{ uri: restaurantImageUri(restaurant.coverImage) }}
            style={styles.thumb}
            contentFit="cover"
            accessibilityLabel={`${restaurant.name} photo`}
          />
          <View style={styles.copy}>
            <Text style={styles.name} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <Text style={styles.tags} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.neutral[400]} strokeWidth={1.75} />
          <View style={styles.divider} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.searchResultItemHeight,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 8,
    gap: 12,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  thumb: {
    width: layout.searchSuggestionThumbSize,
    height: layout.searchSuggestionThumbSize,
    borderRadius: layout.searchSuggestionThumbRadius,
    backgroundColor: colors.neutral[100],
  },
  copy: {
    flex: 1,
    gap: 4,
    paddingRight: 4,
  },
  name: {
    ...typography.fieldLabel,
    color: colors.neutral[900],
  },
  tags: {
    ...typography.caption,
    color: colors.neutral[700],
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
  },
});
