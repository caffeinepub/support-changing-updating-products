import { create } from 'zustand';
import type { CartItem, StorefrontProduct } from '../types/storefront';

interface CartState {
  items: CartItem[];
  addItem: (product: StorefrontProduct, quantity: number) => void;
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CART_STORAGE_KEY = 'accessories-cart';

const loadCartFromSession = (): CartItem[] => {
  try {
    const stored = sessionStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert bigint strings back to bigint
      return parsed.map((item: any) => ({
        ...item,
        product: {
          ...item.product,
          id: BigInt(item.product.id),
          price: BigInt(item.product.price),
          stock: BigInt(item.product.stock)
        }
      }));
    }
  } catch (error) {
    console.error('Failed to load cart from session:', error);
  }
  return [];
};

const saveCartToSession = (items: CartItem[]) => {
  try {
    // Convert bigint to string for JSON serialization
    const serializable = items.map(item => ({
      ...item,
      product: {
        ...item.product,
        id: item.product.id.toString(),
        price: item.product.price.toString(),
        stock: item.product.stock.toString()
      }
    }));
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error('Failed to save cart to session:', error);
  }
};

export const useCart = create<CartState>((set, get) => ({
  items: loadCartFromSession(),
  
  addItem: (product, quantity) => {
    set(state => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      
      saveCartToSession(newItems);
      return { items: newItems };
    });
  },
  
  removeItem: (productId) => {
    set(state => {
      const newItems = state.items.filter(item => item.product.id !== productId);
      saveCartToSession(newItems);
      return { items: newItems };
    });
  },
  
  updateQuantity: (productId, quantity) => {
    set(state => {
      const newItems = state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartToSession(newItems);
      return { items: newItems };
    });
  },
  
  clearCart: () => {
    sessionStorage.removeItem(CART_STORAGE_KEY);
    set({ items: [] });
  },
  
  getTotal: () => {
    return get().items.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  },
  
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));
