import { router } from 'expo-router';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { typography } from '@/constants/typography';

export interface SearchHeaderProps {
  value: string;
  onChangeText: (text: string) => void;
  /** Hide page title — focused or typing (Screen/ Search/ 2 & result) */
  compact?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
}

export function SearchHeader({
  value,
  onChangeText,
  compact = false,
  onFocus,
  onBlur,
  onSubmit,
}: SearchHeaderProps) {
  const hasQuery = value.trim().length > 0;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {!compact ? <Text style={styles.title}>Search</Text> : null}
      <View style={styles.inputRow}>
        <Search size={22} color={colors.neutral[700]} strokeWidth={1.75} />
        <TextInput
          accessibilityLabel="Search restaurants"
          placeholder="Search here..."
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmit}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
        />
        {hasQuery ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={() => onChangeText('')}
            style={styles.trailingButton}>
            <X size={20} color={colors.neutral[700]} strokeWidth={2} />
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open filters"
            hitSlop={8}
            onPress={() => router.push('/filters')}
            style={styles.trailingButton}>
            <SlidersHorizontal size={20} color={colors.neutral[700]} strokeWidth={1.75} />
          </Pressable>
        )}
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
    paddingHorizontal: layout.inputPaddingH,
    minHeight: layout.inputHeight,
    gap: 8,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.neutral[900],
    paddingVertical: 12,
  },
  trailingButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
