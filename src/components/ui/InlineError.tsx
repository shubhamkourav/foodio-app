import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface InlineErrorProps {
  message: string;
  errors?: string[];
}

export function InlineError({ message, errors = [] }: InlineErrorProps) {
  if (!message && errors.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} accessibilityRole="alert">
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {errors.length > 0 ? (
        <View style={styles.list}>
          {errors.map((item) => (
            <Text key={item} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginBottom: 12,
  },
  message: {
    ...typography.caption,
    color: colors.error,
  },
  list: {
    gap: 2,
    paddingLeft: 4,
  },
  listItem: {
    ...typography.caption,
    color: colors.error,
  },
});
