import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RatingPill } from '@/components/ui/RatingPill';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDistance } from '@/utils/formatDistance';
import { restaurantImageUri } from '@/constants/placeholders';
import type { Restaurant } from '@/types/restaurant';

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: (id: string) => void;
  compact?: boolean;
}

export function RestaurantCard({ restaurant, onPress, compact = false }: RestaurantCardProps) {
  const cuisineLine = restaurant.cuisine.join(' · ');
  const distanceText =
    restaurant.distance !== undefined ? formatDistance(restaurant.distance) : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${restaurant.name}, rated ${restaurant.rating}`}
      hitSlop={8}
      onPress={() => onPress?.(restaurant.id)}
      style={({ pressed }) => [
        compact ? styles.compactCard : styles.card,
        pressed && styles.pressed,
      ]}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: restaurantImageUri(restaurant.coverImage) }}
          style={compact ? styles.compactImage : styles.image}
          contentFit="cover"
          accessibilityLabel={`${restaurant.name} cover`}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add to favourites"
          hitSlop={8}
          style={styles.favourite}>
          <Heart size={20} color={colors.primary} fill="transparent" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.headingRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <RatingPill rating={restaurant.rating} />
        </View>

        <Text style={styles.cuisine} numberOfLines={1}>
          {cuisineLine}
        </Text>

        <Text style={styles.meta}>
          {distanceText ? `${distanceText} away · ` : ''}
          <Text style={styles.feeHighlight}>{formatCurrency(restaurant.deliveryFee)}</Text>
          {' Delivery Fee'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: layout.cardGap, marginBottom: layout.sectionGap },
  compactCard: {
    width: layout.smallCardWidth,
    gap: layout.cardGap,
  },
  pressed: { opacity: 0.92 },
  imageWrap: { position: 'relative' },
  image: {
    width: '100%',
    height: layout.largeCardImageHeight,
    borderRadius: layout.largeCardRadius,
    backgroundColor: colors.neutral[100],
  },
  compactImage: {
    width: layout.smallCardWidth,
    height: layout.smallCardImageHeight,
    borderRadius: layout.largeCardRadius,
    backgroundColor: colors.neutral[100],
  },
  favourite: {
    position: 'absolute',
    top: 19,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  content: { gap: 2, marginTop:8 },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.cardTitle,
    color: colors.neutral[900],
    flex: 1,
  },
  cuisine: {
    ...typography.caption,
    color: colors.neutral[700],
  },
  meta: {
    ...typography.caption,
    color: colors.neutral[700],
  },
  feeHighlight: {
    ...typography.caption,
    color: colors.primary,
  },
});
