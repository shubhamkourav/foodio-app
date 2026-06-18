import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface ScreenStateProps {
  message?: string;
  errors?: string[];
  onRetry?: () => void;
}

export function LoadingState({ message = 'Loading...' }: ScreenStateProps) {
  return (
    <View style={styles.container} accessibilityLabel={message}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export function ErrorState({
  message = 'Something went wrong',
  errors = [],
  onRetry,
}: ScreenStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      {errors.length > 0 ? (
        <View style={styles.errorList}>
          {errors.map((item) => (
            <Text key={item} style={styles.errorItem}>
              • {item}
            </Text>
          ))}
        </View>
      ) : null}
      {onRetry ? <Button label="Try again" onPress={onRetry} variant="outline" /> : null}
    </View>
  );
}

export function EmptyState({
  message = 'Nothing here yet',
  onRetry,
}: ScreenStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empty</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button label="Refresh" onPress={onRetry} variant="ghost" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.neutral[50],
  },
  title: { ...typography.h3, color: colors.neutral[900] },
  message: { ...typography.body, color: colors.neutral[700], textAlign: 'center' },
  errorList: { gap: 4, alignSelf: 'stretch', paddingHorizontal: spacing.sm },
  errorItem: { ...typography.caption, color: colors.error, textAlign: 'left' },
});
