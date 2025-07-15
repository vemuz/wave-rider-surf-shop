'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { type ShopifyProduct, type ShopifyVariant } from '@/lib/shopify';

interface CartItem {
  id: string;
  product: ShopifyProduct;
  variant: ShopifyVariant;
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: ShopifyProduct; variant: ShopifyVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;
      const itemId = `${product.id}-${variant.id}`;

      const existingItem = state.items.find(item => item.id === itemId);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: itemId,
          product,
          variant,
          quantity,
          addedAt: new Date().toISOString(),
        };
        newItems = [...state.items, newItem];
      }

      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (parseFloat(item.variant.price) * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalQuantity,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.itemId);
      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (parseFloat(item.variant.price) * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalQuantity,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { itemId } });
      }

      const newItems = state.items.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      );

      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (parseFloat(item.variant.price) * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalQuantity,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: ShopifyProduct, variant: ShopifyVariant, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('scrole-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('scrole-cart', JSON.stringify(state));
  }, [state]);

  const addItem = (product: ShopifyProduct, variant: ShopifyVariant, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
