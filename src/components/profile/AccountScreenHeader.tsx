import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface AccountScreenHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightSlot?: ReactNode;
}

/** Figma Account — back row + page title */
export function AccountScreenHeader({
  title,
  showBack = false,
  onBack,
  rightSlot,
}: AccountScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 4 }]}>
      <View style={styles.toolbar}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack ?? (() => router.back())}
            hitSlop={8}
            style={styles.backButton}>
            <ArrowLeft size={22} color={colors.neutral[900]} strokeWidth={2} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        {rightSlot ?? <View style={styles.backPlaceholder} />}
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 12,
  },
  toolbar: {
    minHeight: layout.accountHeaderBackSize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: layout.accountHeaderBackSize,
    height: layout.accountHeaderBackSize,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: layout.accountHeaderBackSize,
    height: layout.accountHeaderBackSize,
  },
  title: {
    ...typography.pageTitle,
    color: colors.neutral[900],
    marginTop: 4,
  },
});
