import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface SearchListItemProps {
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
}

export function SearchListItem({ label, icon: Icon, onPress }: SearchListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.leading}>
        <Icon size={20} color={colors.neutral[900]} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trailing}>
        <ChevronRight size={20} color={colors.neutral[400]} />
      </View>
      <View style={styles.divider} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.searchListItemHeight,
    paddingRight: layout.screenPadding,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  leading: { padding: 14, marginLeft: 2 },
  label: {
    ...typography.body16,
    fontSize: 16,
    lineHeight: 24,
    color: colors.neutral[900],
    flex: 1,
    marginLeft: 8,
  },
  trailing: { padding: 14 },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});
