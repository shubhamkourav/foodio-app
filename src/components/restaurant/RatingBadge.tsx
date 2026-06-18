import { Star } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export function RatingBadge({ rating, reviewCount, size = 'md' }: RatingBadgeProps) {
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <View
      style={[styles.badge, size === 'sm' && styles.badgeSm]}
      accessibilityLabel={`Rating ${rating.toFixed(1)}${reviewCount ? ` from ${reviewCount} reviews` : ''}`}>
      <Star size={iconSize} color={colors.accent} fill={colors.accent} />
      <Text style={[styles.text, size === 'sm' && styles.textSm]}>{rating.toFixed(1)}</Text>
      {reviewCount !== undefined ? (
        <Text style={[styles.count, size === 'sm' && styles.textSm]}>({reviewCount})</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  badgeSm: { paddingHorizontal: spacing.xs },
  text: { ...typography.label, color: colors.neutral[900] },
  textSm: { fontSize: 11 },
  count: { ...typography.caption, color: colors.neutral[700] },
});
