import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface AccountMenuItemProps {
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
}

export function AccountMenuItem({ label, icon: Icon, onPress }: AccountMenuItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Icon size={20} color={colors.neutral[900]} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <ChevronRight size={20} color={colors.neutral[400]} />
      <View style={styles.divider} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingRight: layout.screenPadding,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  iconWrap: { padding: 14, marginLeft: 2 },
  label: {
    ...typography.fieldLabel,
    color: colors.neutral[900],
    flex: 1,
    marginLeft: 8,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});
