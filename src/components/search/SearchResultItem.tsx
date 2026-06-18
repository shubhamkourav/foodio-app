import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface SearchResultItemProps {
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
}

/** Autocomplete row — Search/ result/ output frame (64px) */
export function SearchResultItem({ label, icon: Icon, onPress }: SearchResultItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.leading}>
        <Icon size={20} color={colors.neutral[900]} />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
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
    height: layout.searchResultItemHeight,
    paddingRight: layout.screenPadding,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  leading: { padding: 14, marginLeft: 2 },
  label: {
    ...typography.body16,
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
