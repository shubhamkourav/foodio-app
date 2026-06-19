import { ChevronRight, Search } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface SearchShowAllRowProps {
  query: string;
  onPress?: () => void;
}

export function SearchShowAllRow({ query, onPress }: SearchShowAllRowProps) {
  const trimmed = query.trim();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Show all results for ${trimmed}`}
      onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.row, pressed && styles.pressed]}>
          <Search size={20} color={colors.neutral[900]} strokeWidth={1.75} />
          <Text style={styles.label}>Show all result for “{trimmed}”</Text>
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
    height: layout.searchListItemHeight,
    paddingHorizontal: layout.screenPadding,
    gap: 12,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  label: {
    ...typography.body16,
    color: colors.neutral[900],
    flex: 1,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
  },
});
