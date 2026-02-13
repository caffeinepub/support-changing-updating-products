import type { Product } from '../backend';

export type Audience = 'Men' | 'Women' | 'Unisex';

export type Category = 'Watches' | 'Belts' | 'Sunglasses' | 'Jewelry' | 'Bags' | 'Hats';

export interface StorefrontProduct extends Product {
  audience: Audience;
  category: Category;
  images: string[];
  createdAt: number;
}

export interface CartItem {
  product: StorefrontProduct;
  quantity: number;
}

export interface FilterOptions {
  audience?: Audience;
  categories: Category[];
  priceRange: [number, number];
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest';

export interface ShippingInfo {
  name: string;
  email: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}
