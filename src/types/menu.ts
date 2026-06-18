export interface CustomizationOption {
  name: string;
  priceModifier: number;
}

export interface Customization {
  groupName: string;
  required: boolean;
  multiSelect: boolean;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  isAvailable: boolean;
  isPopular: boolean;
  isVeg: boolean;
  customizations?: Customization[];
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface RestaurantMenu {
  categories: MenuCategory[];
}

export interface MenuItemFilters {
  categoryId?: string;
  q?: string;
  isVeg?: boolean;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}
