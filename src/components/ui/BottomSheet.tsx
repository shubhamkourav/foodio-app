import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, type ModalProps } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface BottomSheetProps extends Omit<ModalProps, 'children'> {
  title?: string;
  children: ReactNode;
  onClose: () => void;
  showHandle?: boolean;
}

export function BottomSheet({
  title,
  children,
  onClose,
  visible,
  showHandle = true,
  ...props
}: BottomSheetProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose} {...props}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          accessibilityLabel="Close sheet"
          onPress={onClose}
        />
        <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.sheet}>
          {showHandle ? <View style={styles.handle} /> : null}
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: layout.accountSignOutSheetRadius,
    borderTopRightRadius: layout.accountSignOutSheetRadius,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral[200],
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
});
