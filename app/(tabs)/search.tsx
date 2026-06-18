import { router } from 'expo-router';
import { ArrowRight, Search, UtensilsCrossed } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ErrorBoundary,
  ErrorState,
  LoadingState,
  RestaurantCard,
  EmptyState,
} from '@/components';
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchListItem } from '@/components/search/SearchListItem';
import { SearchResultItem } from '@/components/search/SearchResultItem';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useLocation } from '@/hooks/useLocation';
import { useRestaurants } from '@/hooks/useRestaurants';
import { getErrorMessage } from '@/utils/getErrorMessage';

const TOP_SEARCH = ['Indian', 'Biriyani', 'Burger', 'Kacchi', 'Kabab'];
const PEOPLE_ALSO_SEARCHED = ['Pizza', 'Chinese', 'Thai', 'Sushi', 'Dessert'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);
  const { coordinates } = useLocation();

  const { data, isLoading, isError, error, refetch } = useRestaurants({
    lat: coordinates?.lat ?? 37.7749,
    lng: coordinates?.lng ?? -122.4194,
    limit: 50,
  });

  const allRestaurants = data?.data ?? [];

  const restaurants = useMemo(() => {
    if (!query.trim()) return allRestaurants;
    const q = query.toLowerCase();
    return allRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q)),
    );
  }, [allRestaurants, query]);

  const categories = useMemo(
    () => [...new Set(allRestaurants.flatMap((r) => r.cuisine))],
    [allRestaurants],
  );

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const names = allRestaurants
      .filter((r) => r.name.toLowerCase().includes(q))
      .map((r) => r.name);
    const cuisines = categories.filter((c) => c.toLowerCase().includes(q));
    return [...new Set([...names, ...cuisines])].slice(0, 5);
  }, [allRestaurants, categories, query]);

  const isTyping = query.trim().length > 0;
  const showSuggestionList = isTyping && !showAllResults;

  const applySearch = (term: string) => {
    setQuery(term);
    setShowAllResults(false);
  };

  const openAllResults = () => setShowAllResults(true);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <SearchHeader
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setShowAllResults(false);
          }}
          compact={isTyping}
        />

        {showSuggestionList ? (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {suggestions.map((item) => (
              <SearchResultItem
                key={item}
                label={item}
                icon={Search}
                onPress={() => applySearch(item)}
              />
            ))}

            {suggestions.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Show all results for ${query}`}
                onPress={openAllResults}
                style={({ pressed }) => [styles.showAllRow, pressed && styles.pressed]}>
                <Search size={24} color={colors.neutral[900]} />
                <Text style={styles.showAllText}>Show all result for “{query.trim()}”</Text>
                <ArrowRight size={20} color={colors.neutral[400]} />
                <View style={styles.divider} />
              </Pressable>
            ) : null}

            <Text style={styles.sectionTitle}>People also searched for</Text>
            {PEOPLE_ALSO_SEARCHED.filter((item) => item.toLowerCase() !== query.toLowerCase()).map(
              (item) => (
                <SearchListItem
                  key={item}
                  label={item}
                  icon={UtensilsCrossed}
                  onPress={() => applySearch(item)}
                />
              ),
            )}
          </ScrollView>
        ) : isTyping ? (
          isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState message={getErrorMessage(error, 'Search failed')} onRetry={() => refetch()} />
          ) : restaurants.length === 0 ? (
            <EmptyState message="No restaurants match your search" onRetry={() => refetch()} />
          ) : (
            <FlatList
              data={restaurants}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <Text style={styles.resultsHeading}>
                  {restaurants.length} results for “{query.trim()}”
                </Text>
              }
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <RestaurantCard
                  restaurant={item}
                  onPress={(id) => router.push(`/restaurant/${id}`)}
                />
              )}
            />
          )
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Top search</Text>
            {TOP_SEARCH.map((item) => (
              <SearchListItem
                key={item}
                label={item}
                icon={Search}
                onPress={() => applySearch(item)}
              />
            ))}

            <Text style={[styles.sectionTitle, styles.sectionGap]}>Search by Category</Text>
            {categories.map((item) => (
              <SearchListItem
                key={item}
                label={item}
                icon={UtensilsCrossed}
                onPress={() => applySearch(item)}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral[900],
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.searchSectionGap,
    paddingBottom: 8,
  },
  sectionGap: { marginTop: layout.searchTitleListGap },
  resultsHeading: {
    ...typography.pageTitle,
    color: colors.neutral[900],
    marginBottom: layout.searchTitleListGap,
  },
  list: { paddingHorizontal: layout.screenPadding, paddingBottom: 32 },
  showAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.searchListItemHeight,
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
  showAllText: {
    ...typography.body,
    color: colors.neutral[900],
    flex: 1,
  },
  pressed: { backgroundColor: colors.neutral[100] },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});
