import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FigmaButton } from '@/components/ui/FigmaButton';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface SignOutSheetProps {
  visible: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** Figma sign-out confirmation sheet */
export function SignOutSheet({ visible, loading = false, onConfirm, onClose }: SignOutSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheet visible={visible} onClose={onClose} showHandle={false}>
      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Text style={styles.message}>Are you Sure You want to sign out?</Text>
        <FigmaButton label="Sign out" onPress={onConfirm} loading={loading} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          onPress={onClose}
          hitSlop={8}
          style={styles.cancelWrap}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  message: {
    ...typography.body16,
    color: colors.neutral[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cancelWrap: {
    alignItems: 'center',
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  cancel: {
    ...typography.fieldLabel,
    color: colors.primary,
  },
});
