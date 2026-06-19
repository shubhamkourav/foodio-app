import { router } from 'expo-router';
import { Search, UtensilsCrossed } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { SearchRestaurantSuggestion } from '@/components/search/SearchRestaurantSuggestion';
import { SearchShowAllRow } from '@/components/search/SearchShowAllRow';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useCuisines } from '@/hooks/useCuisines';
import { useLocation } from '@/hooks/useLocation';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useSearch } from '@/hooks/useSearch';
import type { SearchResult } from '@/types/search';
import { matchesFoodCategory } from '@/utils/categoryFilter';
import { getErrorMessage } from '@/utils/getErrorMessage';

const DEFAULT_LAT = 19.076;
const DEFAULT_LNG = 72.8777;
const SEARCH_RADIUS = 12000;

const PEOPLE_ALSO_SEARCHED = ['Pizza', 'Chaat', 'Dosa', 'Thali', 'Lassi'] as const;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const { coordinates } = useLocation();
  const { data: cuisines = [] } = useCuisines();

  const lat = coordinates?.lat ?? DEFAULT_LAT;
  const lng = coordinates?.lng ?? DEFAULT_LNG;

  const topSearchTerms = useMemo(
    () => cuisines.slice(0, 5).map((cuisine) => cuisine.name),
    [cuisines],
  );

  const categoryTerms = useMemo(
    () => cuisines.slice(0, 5).map((cuisine) => cuisine.name),
    [cuisines],
  );

  const isTyping = query.trim().length > 0;
  const compactHeader = isFocused || isTyping;
  const showSuggestionList = isTyping && !showAllResults;
  const showResultsList = isTyping && showAllResults;

  const {
    data: searchData,
    isLoading: isSearching,
    isError: isSearchError,
    error: searchError,
    refetch: refetchSearch,
  } = useSearch(query, { lat, lng }, { enabled: isTyping });

  const { data: nearbyRestaurantData } = useRestaurants({
    lat,
    lng,
    radius: SEARCH_RADIUS,
    limit: 50,
  });

  const { data: allRestaurantData } = useRestaurants({ limit: 50 });

  const restaurantPool = useMemo(() => {
    const nearby = nearbyRestaurantData?.data ?? [];
    if (nearby.length > 0) return nearby;
    return allRestaurantData?.data ?? [];
  }, [allRestaurantData?.data, nearbyRestaurantData?.data]);

  const localMatches = useMemo(() => {
    if (!isTyping) return [];

    const term = query.trim();
    return restaurantPool.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(term.toLowerCase()) ||
        matchesFoodCategory(restaurant, term, cuisines),
    );
  }, [cuisines, isTyping, query, restaurantPool]);

  const searchResults = useMemo<SearchResult[]>(() => {
    const apiResults = searchData?.data ?? [];
    if (apiResults.length > 0) return apiResults;
    if (!isTyping) return [];

    return localMatches.map((restaurant) => ({ ...restaurant, matchedDishes: [] }));
  }, [isTyping, localMatches, searchData?.data]);

  const applySearch = (term: string) => {
    setQuery(term);
    setShowAllResults(false);
  };

  const openRestaurant = (id: string) => router.push(`/restaurant/${id}`);

  const renderInitialContent = () => (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Top search</Text>
      {topSearchTerms.map((item) => (
        <SearchListItem
          key={item}
          label={item}
          icon={Search}
          onPress={() => applySearch(item)}
        />
      ))}

      <Text style={[styles.sectionTitle, styles.sectionGap]}>Search by Category</Text>
      {categoryTerms.map((item) => (
        <SearchListItem
          key={item}
          label={item}
          icon={UtensilsCrossed}
          onPress={() => applySearch(item)}
        />
      ))}
    </ScrollView>
  );

  const renderSuggestionContent = () => {
    if (isSearching) return <LoadingState />;

    if (isSearchError && searchResults.length === 0) {
      return (
        <ErrorState
          message={getErrorMessage(searchError, 'Search failed')}
          onRetry={() => refetchSearch()}
        />
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {searchResults.length === 0 ? (
          <Text style={styles.emptyHint}>
            No restaurants or dishes found for “{query.trim()}”
          </Text>
        ) : (
          searchResults.slice(0, 5).map((restaurant) => (
            <SearchRestaurantSuggestion
              key={restaurant.id}
              restaurant={restaurant}
              onPress={openRestaurant}
            />
          ))
        )}

        {searchResults.length > 0 ? (
          <SearchShowAllRow query={query} onPress={() => setShowAllResults(true)} />
        ) : null}

        <Text style={styles.sectionTitle}>People also searched for</Text>
        {PEOPLE_ALSO_SEARCHED.filter((item) => item.toLowerCase() !== query.toLowerCase()).map(
          (item) => (
            <SearchListItem
              key={item}
              label={item}
              icon={Search}
              onPress={() => applySearch(item)}
            />
          ),
        )}
      </ScrollView>
    );
  };

  const renderResultsContent = () => {
    if (isSearching) return <LoadingState />;

    if (isSearchError && searchResults.length === 0) {
      return (
        <ErrorState
          message={getErrorMessage(searchError, 'Search failed')}
          onRetry={() => refetchSearch()}
        />
      );
    }

    if (searchResults.length === 0) {
      return <EmptyState message={`No results for “${query.trim()}”`} onRetry={() => refetchSearch()} />;
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Text style={styles.resultsHeading}>
            {searchResults.length} results for “{query.trim()}”
          </Text>
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} onPress={openRestaurant} />
        )}
      />
    );
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <SearchHeader
          value={query}
          compact={compactHeader}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmit={() => {
            if (isTyping) setShowAllResults(true);
          }}
          onChangeText={(text) => {
            setQuery(text);
            setShowAllResults(false);
          }}
        />

        <View style={styles.body}>
          {showResultsList
            ? renderResultsContent()
            : showSuggestionList
              ? renderSuggestionContent()
              : renderInitialContent()}
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1 },
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
  emptyHint: {
    ...typography.body16,
    color: colors.placeholder,
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.searchSectionGap,
  },
  list: { paddingHorizontal: layout.screenPadding, paddingBottom: 24 },
});
