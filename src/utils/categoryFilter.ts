import type { Restaurant } from '@/types/restaurant';
import type { Cuisine } from '@/services/cuisinesApi';

function matchesCuisineName(restaurant: Restaurant, cuisineName: string): boolean {
  const needle = cuisineName.toLowerCase();
  return restaurant.cuisine.some(
    (tag) => tag.toLowerCase() === needle || tag.toLowerCase().includes(needle),
  );
}

function matchesCuisineMatchers(restaurant: Restaurant, matchers: string[]): boolean {
  return restaurant.cuisine.some((tag) => {
    const normalized = tag.toLowerCase();
    return matchers.some((matcher) => normalized.includes(matcher.toLowerCase()));
  });
}

export function matchesFoodCategory(
  restaurant: Restaurant,
  category: string,
  cuisines?: Cuisine[],
): boolean {
  const cuisine = cuisines?.find((item) => item.name === category);
  if (cuisine?.matchers?.length) {
    return matchesCuisineMatchers(restaurant, cuisine.matchers);
  }

  return matchesCuisineName(restaurant, category);
}

export function filterRestaurantsByCategory(
  restaurants: Restaurant[],
  category: string,
  cuisines?: Cuisine[],
): Restaurant[] {
  const filtered = restaurants.filter((restaurant) =>
    matchesFoodCategory(restaurant, category, cuisines),
  );

  return filtered.length > 0 ? filtered : restaurants;
}
