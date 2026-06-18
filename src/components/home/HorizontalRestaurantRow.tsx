import { ScrollView, StyleSheet, View } from 'react-native';

import { SmallRestaurantCard } from '@/components/home/SmallRestaurantCard';
import { layout } from '@/constants/layout';
import type { Restaurant } from '@/types/restaurant';

export interface HorizontalRestaurantRowProps {
  restaurants: Restaurant[];
  onRestaurantPress?: (id: string) => void;
}

export function HorizontalRestaurantRow({
  restaurants,
  onRestaurantPress,
}: HorizontalRestaurantRowProps) {
  if (restaurants.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}>
      {restaurants.map((restaurant, index) => (
        <View key={restaurant.id} style={index > 0 ? styles.gap : undefined}>
          <SmallRestaurantCard restaurant={restaurant} onPress={onRestaurantPress} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 4,
  },
  gap: { marginLeft: layout.smallCardGap },
});
