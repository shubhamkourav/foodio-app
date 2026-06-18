import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary, ErrorState, LoadingState, EmptyState } from '@/components';
import { isActiveOrder, OrderListItem } from '@/components/orders/OrderListItem';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useOrders } from '@/hooks/useOrders';
import type { Order } from '@/types/order';
import { getErrorMessage } from '@/utils/getErrorMessage';

export default function OrdersScreen() {
  const { data, isLoading, isError, error, refetch } = useOrders();

  const orders = data?.data ?? [];
  const activeOrders = orders.filter((order) => isActiveOrder(order.status));
  const pastOrders = orders.filter((order) => !isActiveOrder(order.status));

  const sections: Array<{ title: string; data: Order[] }> = [];
  if (activeOrders.length > 0) {
    sections.push({ title: 'In Progress', data: activeOrders });
  }
  if (pastOrders.length > 0) {
    sections.push({ title: 'Past Orders', data: pastOrders });
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>My orders</Text>
        </View>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            message={getErrorMessage(error, 'Could not load orders')}
            onRetry={() => refetch()}
          />
        ) : orders.length === 0 ? (
          <EmptyState message="No orders yet. Start exploring!" />
        ) : (
          <FlatList
            data={sections}
            keyExtractor={(item) => item.title}
            renderItem={({ item: section }) => (
              <View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.data.map((order) => (
                  <OrderListItem key={order.id} order={order} />
                ))}
              </View>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 16,
    minHeight: 56,
    justifyContent: 'flex-end',
  },
  title: { ...typography.pageTitle, color: colors.neutral[900] },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral[900],
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.searchTitleListGap,
    paddingBottom: 8,
  },
  list: { paddingBottom: 32 },
});
