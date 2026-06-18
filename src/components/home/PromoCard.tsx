import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface PromoCardProps {
  title: string;
  description: string;
  code: string;
  image?: string;
  onPress?: () => void;
}

export function PromoCard({ title, description, code, image, onPress }: PromoCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Promotion ${title}, code ${code}`}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" accessibilityLabel={title} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.content}>
        <Badge label={code} variant="accent" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.9 },
  image: { width: 96, height: 96 },
  imagePlaceholder: { backgroundColor: colors.secondary },
  content: { flex: 1, padding: spacing.md, gap: spacing.xs, justifyContent: 'center' },
  title: { ...typography.h3, color: colors.neutral[900] },
  description: { ...typography.caption, color: colors.neutral[700] },
});
