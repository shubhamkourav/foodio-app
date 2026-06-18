import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface FilterSheetActionsProps {
  onReset: () => void;
  onApply: () => void;
}

/** Figma docked filter actions — Reset + Apply */
export function FilterSheetActions({ onReset, onApply }: FilterSheetActionsProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Reset filters"
        onPress={onReset}
        style={styles.resetTouchable}>
        <View style={styles.resetButton}>
          <Text style={styles.resetLabel}>Reset</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Apply filters"
        onPress={onApply}
        style={styles.applyTouchable}>
        <View style={styles.applyButton}>
          <Text style={styles.applyLabel}>Apply</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
  },
  resetTouchable: {
    flex: 1,
  },
  applyTouchable: {
    flex: 1,
  },
  resetButton: {
    height: 52,
    borderRadius: layout.buttonRadius,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  applyButton: {
    height: 52,
    borderRadius: layout.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  resetLabel: {
    ...typography.buttonLabel,
    color: colors.neutral[800],
  },
  applyLabel: {
    ...typography.buttonLabel,
    color: colors.white,
  },
});
