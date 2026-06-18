import { Search, SlidersHorizontal } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { typography } from '@/constants/typography';

export interface SearchHeaderProps {
  value: string;
  onChangeText: (text: string) => void;
  /** Compact bar while typing — no page title (Screen/ Search/ result) */
  compact?: boolean;
}

export function SearchHeader({ value, onChangeText, compact = false }: SearchHeaderProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {!compact ? <Text style={styles.title}>Search</Text> : null}
      <View style={styles.inputRow}>
        <Search size={24} color={colors.neutral[700]} />
        <TextInput
          accessibilityLabel="Search restaurants"
          placeholder="Search here...."
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          autoCorrect={false}
        />
        <SlidersHorizontal size={20} color={colors.neutral[700]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.screenPadding,
    paddingBottom: 17,
    gap: layout.screenPadding,
    minHeight: layout.searchHeaderHeight,
    ...shadows.header,
  },
  containerCompact: {
    paddingTop: 8,
    paddingBottom: 8,
    gap: 0,
    minHeight: layout.searchHeaderCompactHeight,
    justifyContent: 'center',
  },
  title: { ...typography.h1, color: colors.neutral[900] },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.inputRadius,
    paddingHorizontal: 15,
    minHeight: layout.inputHeight,
    gap: 8,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.neutral[900],
    paddingVertical: 12,
  },
});
