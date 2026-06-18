import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface CartAddItemsRowProps {
  onPress?: () => void;
}

export function CartAddItemsRow({ onPress }: CartAddItemsRowProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add items"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Plus size={16} color={colors.neutral[900]} />
        <Text style={styles.label}>Add items</Text>
      </Pressable>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 17,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: layout.pillRadius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  label: { ...typography.bodyMedium, color: colors.neutral[900] },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: layout.screenPadding,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});
