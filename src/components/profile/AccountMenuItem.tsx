import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface AccountMenuItemProps {
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
}

/** Figma Account menu — thin icon + bold label */
export function AccountMenuItem({ label, icon: Icon, onPress }: AccountMenuItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.row, pressed && styles.pressed]}>
          <View style={styles.iconWrap}>
            <Icon
              size={layout.accountMenuIconSize}
              color={colors.neutral[900]}
              strokeWidth={1.5}
            />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.accountMenuRowHeight,
    paddingHorizontal: layout.screenPadding,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  iconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    ...typography.fieldLabel,
    color: colors.neutral[900],
    flex: 1,
  },
});
