/** Fallback images when API URLs are missing or fail to load */
export const PLACEHOLDER_IMAGES = {
  restaurant:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  dish: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
} as const;

export function restaurantImageUri(uri?: string | null): string {
  return uri?.trim() ? uri : PLACEHOLDER_IMAGES.restaurant;
}

export function dishImageUri(uri?: string | null): string {
  return uri?.trim() ? uri : PLACEHOLDER_IMAGES.dish;
}
