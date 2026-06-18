import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface HomeSectionHeaderProps {
  title: string;
  onPress?: () => void;
}

export function HomeSectionHeader({ title, onPress }: HomeSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
          hitSlop={8}
          onPress={onPress}
          style={styles.iconButton}>
          <ChevronRight size={20} color={colors.neutral[900]} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    height: layout.sectionHeaderHeight,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.neutral[900],
    flex: 1,
    paddingTop: 2,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
