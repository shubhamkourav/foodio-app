import { Star } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export interface RatingPillProps {
  rating: number;
}

export function RatingPill({ rating }: RatingPillProps) {
  return (
    <View style={styles.pill}>
      <Star size={16} color={colors.white} fill={colors.white} />
      <Text style={styles.text}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  text: { ...typography.label, color: colors.white },
});
