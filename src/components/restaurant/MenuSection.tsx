import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';

import { MenuItem } from '@/components/restaurant/MenuItem';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useMenuItems } from '@/hooks/useMenu';
import type { MenuCategory } from '@/types/menu';

export interface MenuSectionProps {
  restaurantId: string;
  categories: MenuCategory[];
  loading?: boolean;
  header?: React.ReactNode;
  onItemPress?: (itemId: string) => void;
}

export function MenuSection({
  restaurantId,
  categories,
  loading = false,
  header,
  onItemPress,
}: MenuSectionProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategoryId = selectedCategoryId ?? categories[0]?.id;
  const trimmedSearch = searchQuery.trim();

  useEffect(() => {
    if (!selectedCategoryId && categories[0]?.id) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const filters = useMemo(
    () => ({
      categoryId: trimmedSearch ? undefined : activeCategoryId,
      q: trimmedSearch || undefined,
    }),
    [activeCategoryId, trimmedSearch],
  );

  const {
    data,
    isLoading: itemsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    refetch,
  } = useMenuItems(restaurantId, filters);

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const renderItem: ListRenderItem<(typeof items)[number]> = ({ item }) => (
    <MenuItem item={item} onPress={onItemPress} />
  );

  const listHeader = (
    <View>
      {header}
      <View style={styles.menuContainer}>
        <TextInput
          accessibilityLabel="Search menu"
          placeholder="Search dishes..."
          placeholderTextColor={colors.neutral[500]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        {categories.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}>
            {categories.map((category) => {
              const selected = !trimmedSearch && category.id === activeCategoryId;
              return (
                <Pressable
                  key={category.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategoryId(category.id);
                  }}
                  style={[styles.categoryChip, selected && styles.categoryChipSelected]}>
                  <Text style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.menuContainer}>
        {header}
        <Skeleton height={24} width="40%" style={{ marginBottom: spacing.md }} />
        <Skeleton height={88} borderRadius={12} />
        <Skeleton height={88} borderRadius={12} style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View>
        {header}
        <View style={styles.menuContainer}>
          <Text style={styles.empty}>Menu not available.</Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      contentContainerStyle={styles.listContent}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.4}
      ListEmptyComponent={
        itemsLoading ? (
          <View style={styles.loadingMore}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : isError ? (
          <Pressable onPress={() => refetch()} style={styles.emptyState}>
            <Text style={styles.empty}>Could not load dishes. Tap to retry.</Text>
          </Pressable>
        ) : (
          <Text style={styles.empty}>No dishes found.</Text>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.loadingMore}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  menuContainer: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  listContent: { paddingBottom: 100 },
  searchInput: {
    ...typography.body,
    color: colors.neutral[900],
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryRow: { gap: spacing.sm, paddingBottom: spacing.md },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.pillRadius,
    backgroundColor: colors.neutral[100],
  },
  categoryChipSelected: { backgroundColor: colors.primary },
  categoryLabel: { ...typography.caption, color: colors.neutral[700] },
  categoryLabelSelected: { color: colors.white, fontWeight: '600' },
  empty: { ...typography.body, color: colors.neutral[700], paddingVertical: spacing.lg },
  emptyState: { paddingVertical: spacing.lg },
  loadingMore: { paddingVertical: spacing.lg, alignItems: 'center' },
});
