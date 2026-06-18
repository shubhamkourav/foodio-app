import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowLeft, Clock, Heart, Share2, Star } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { restaurantImageUri } from '@/constants/placeholders';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDistance } from '@/utils/formatDistance';
import type { Restaurant } from '@/types/restaurant';

export interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const insets = useSafeAreaInsets();
  const cuisineLine = restaurant.cuisine.join(' · ');
  const distanceText =
    restaurant.distance !== undefined ? formatDistance(restaurant.distance) : null;
  const deliveryFeeText =
    restaurant.deliveryFee === 0 ? 'Free Delivery' : `${formatCurrency(restaurant.deliveryFee)} delivery`;

  return (
    <View>
      <View style={styles.coverWrap}>
        <Image
          source={{ uri: restaurantImageUri(restaurant.coverImage) }}
          style={styles.cover}
          contentFit="cover"
          accessibilityLabel={`${restaurant.name} cover image`}
        />
        <View style={[styles.actions, { top: insets.top + 24 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            onPress={() => router.back()}
            style={styles.actionButton}>
            <ArrowLeft size={18} color={colors.neutral[900]} />
          </Pressable>
          <View style={styles.actionsRight}>
            <Pressable accessibilityRole="button" accessibilityLabel="Share" style={styles.actionButton}>
              <Share2 size={18} color={colors.neutral[900]} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Favourite" style={styles.actionButton}>
              <Heart size={18} color={colors.neutral[900]} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{restaurant.name}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingValue}>{restaurant.rating.toFixed(1)}</Text>
          <View style={styles.stars}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={14}
                color={colors.accent}
                fill={index < Math.round(restaurant.rating) ? colors.accent : 'transparent'}
              />
            ))}
          </View>
          <Text style={styles.reviews}>{restaurant.reviewCount} reviews</Text>
          <Text style={styles.priceLevel}>· $$$ ·</Text>
        </View>

        <Text style={styles.metaLine}>
          {distanceText ? `${distanceText} · ` : ''}
          {restaurant.deliveryTimeMin} min delivery · {deliveryFeeText}
        </Text>

        <Text style={styles.cuisineLine} numberOfLines={2}>
          {cuisineLine}
        </Text>

        <View style={styles.hoursRow}>
          <Clock size={20} color={colors.neutral[900]} />
          <Text style={styles.hoursText}>
            {restaurant.isOpen ? 'Open now' : 'Closed'} · Today, 04:00 am - 9:00 pm
          </Text>
          <Text style={styles.changeLink}>Change</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coverWrap: { position: 'relative' },
  cover: {
    width: '100%',
    height: layout.restaurantCoverHeight,
    backgroundColor: colors.secondary,
  },
  actions: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsRight: { flexDirection: 'row', gap: spacing.md },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 14,
    paddingBottom: spacing.md,
    gap: 4,
    backgroundColor: colors.white,
  },
  name: { ...typography.sectionTitle, color: colors.neutral[900] },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  ratingValue: { ...typography.body, color: colors.neutral[900] },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  reviews: { ...typography.body, color: colors.neutral[900] },
  priceLevel: { ...typography.body, color: colors.neutral[900] },
  metaLine: { ...typography.body, color: colors.neutral[900], marginTop: 4 },
  cuisineLine: { ...typography.body, color: colors.neutral[700], marginTop: 4 },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  hoursText: { ...typography.body, color: colors.neutral[900], flex: 1 },
  changeLink: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
