import { StyleSheet, Text, View } from 'react-native';

import { RestaurantCard } from '@/components/home/RestaurantCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { Restaurant } from '@/types/restaurant';

export interface FeaturedSectionProps {
  title?: string;
  restaurants: Restaurant[];
  loading?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  onRestaurantPress?: (id: string) => void;
}

export function FeaturedSection({
  title = 'Recommended for you',
  restaurants,
  loading = false,
  emptyMessage = 'No restaurants found nearby.',
  onRetry,
  onRestaurantPress,
}: FeaturedSectionProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Skeleton height={layout.largeCardImageHeight + 72} borderRadius={layout.largeCardRadius} />
        <Skeleton
          height={layout.largeCardImageHeight + 72}
          borderRadius={layout.largeCardRadius}
          style={{ marginTop: spacing.md }}
        />
      </View>
    );
  }

  if (restaurants.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.empty}>{emptyMessage}</Text>
        {onRetry ? (
          <Button label="Try again" onPress={onRetry} variant="outline" style={styles.retry} />
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onPress={onRestaurantPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: layout.screenPadding, paddingTop: layout.sectionGap },
  title: { ...typography.sectionTitle, color: colors.neutral[900], marginBottom: layout.cardGap },
  empty: { ...typography.body, color: colors.neutral[700] },
  retry: { marginTop: spacing.md, alignSelf: 'flex-start' },
});
