import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FigmaButton } from '@/components/ui/FigmaButton';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface LocationPermissionCardProps {
  visible: boolean;
  loading?: boolean;
  onShareLocation: () => void;
  onDismiss: () => void;
}

/** Figma Docked/button/Card/Location */
export function LocationPermissionCard({
  visible,
  loading = false,
  onShareLocation,
  onDismiss,
}: LocationPermissionCardProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.title}>Get your deliveries to the right address</Text>
          <Text style={styles.subtitle}>
            Share your location to help us ensure your orders are delivered where you want them.
          </Text>
        </View>
        <View style={styles.actions}>
          <FigmaButton label="Share location" onPress={onShareLocation} loading={loading} />
          <Pressable
            accessibilityRole="button"
            onPress={onDismiss}
            style={styles.secondaryButton}>
            <Text style={styles.secondaryLabel}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  content: { gap: spacing.sm, paddingHorizontal: spacing.xs },
  title: { ...typography.h3, color: colors.neutral[900] },
  subtitle: { ...typography.body, color: colors.neutral[700] },
  actions: { gap: spacing.sm },
  secondaryButton: {
    minHeight: 52,
    borderRadius: layout.buttonRadius,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  secondaryLabel: { ...typography.buttonLabel, color: colors.neutral[900] },
});
