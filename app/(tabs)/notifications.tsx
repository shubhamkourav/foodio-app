import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export default function NotificationsScreen() {
  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Notification</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  title: {
    ...typography.pageTitle,
    color: colors.neutral[900],
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 12,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { ...typography.body, color: colors.placeholder },
});
