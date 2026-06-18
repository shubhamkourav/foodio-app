import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface AccountDetailRowProps {
  label: string;
  value: string;
  icon: LucideIcon;
  onPress?: () => void;
  secure?: boolean;
}

/** Figma My Account — icon, stacked label/value, chevron */
export function AccountDetailRow({
  label,
  value,
  icon: Icon,
  onPress,
  secure = false,
}: AccountDetailRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${secure ? 'hidden' : value}`}
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
          <View style={styles.copy}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {secure ? '••••••••••••' : value}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.neutral[400]} strokeWidth={1.75} />
          <View style={styles.divider} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.accountDetailRowMinHeight,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 14,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  iconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  copy: {
    flex: 1,
    gap: 6,
    paddingRight: 8,
  },
  label: {
    ...typography.fieldLabel,
    color: colors.neutral[900],
  },
  value: {
    ...typography.body,
    color: colors.placeholder,
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
  },
});
