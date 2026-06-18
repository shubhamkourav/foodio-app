import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DELIVERY_OPTIONS } from '@/constants/deliveryOptions';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { DeliveryOption } from '@/types/user';

export interface DeliveryOptionPickerProps {
  value: DeliveryOption;
  instructions?: string;
  onChange: (option: DeliveryOption) => void;
  onChangeInstructions: (text: string) => void;
  showInstructionsInput?: boolean;
  onToggleInstructions?: () => void;
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected ? <View style={styles.radioDot} /> : null}
    </View>
  );
}

/** Figma Enter Address — delivery option list */
export function DeliveryOptionPicker({
  value,
  instructions = '',
  onChange,
  onChangeInstructions,
  showInstructionsInput = false,
  onToggleInstructions,
}: DeliveryOptionPickerProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery option</Text>

      {DELIVERY_OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.id)}
            style={styles.optionRow}>
            <Radio selected={selected} />
            <Text style={styles.optionLabel}>{option.label}</Text>
            <View style={styles.divider} />
          </Pressable>
        );
      })}

      <Pressable
        accessibilityRole="button"
        onPress={onToggleInstructions}
        style={styles.instructionsRow}>
        <Text style={styles.instructionsLabel}>Add Instructions</Text>
        <ChevronRight size={20} color={colors.neutral[900]} />
        <View style={styles.divider} />
      </Pressable>

      {showInstructionsInput ? (
        <TextInput
          accessibilityLabel="Delivery instructions"
          value={instructions}
          onChangeText={onChangeInstructions}
          placeholder="e.g. Ring the doorbell, leave at reception"
          placeholderTextColor={colors.placeholder}
          style={styles.instructionsInput}
          multiline
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral[900],
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: layout.screenPadding,
    gap: spacing.md,
  },
  optionLabel: {
    ...typography.body16,
    color: colors.neutral[900],
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  instructionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: layout.screenPadding,
  },
  instructionsLabel: {
    ...typography.body16,
    color: colors.info,
    flex: 1,
  },
  instructionsInput: {
    ...typography.body,
    color: colors.neutral[900],
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: layout.inputRadius,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  divider: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
  },
});
