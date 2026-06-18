import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface CheckoutOptionRowProps {
  label: string;
  subtitle?: string;
  icon: LucideIcon;
  onPress?: () => void;
}

/** Tappable checkout row — 48–64px (delivery, payment, promo) */
export function CheckoutOptionRow({ label, subtitle, icon: Icon, onPress }: CheckoutOptionRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Icon size={20} color={colors.neutral[900]} />
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <ChevronRight size={20} color={colors.neutral[400]} />
      <View style={styles.divider} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 11,
    gap: 16,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  text: { flex: 1, gap: 2 },
  label: { ...typography.body16, color: colors.neutral[900] },
  subtitle: { ...typography.caption, color: colors.neutral[600] },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: layout.screenPadding,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});
