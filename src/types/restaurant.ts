export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  coverImage?: string;
  logoImage?: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryFee: number;
  minOrderAmount: number;
  isOpen: boolean;
  distance?: number;
  coordinates: Coordinates;
  address?: string;
  promotions?: Promotion[];
}

export interface RestaurantFilters {
  page?: number;
  limit?: number;
  cuisine?: string;
  minRating?: number;
  lat?: number;
  lng?: number;
  radius?: number;
}
