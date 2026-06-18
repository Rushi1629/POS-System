import { clearCartDB, saveCartToDB } from "@/lib/db";
import {
  CartItem,
  CartState,
  getCartKey,
  normalizeCartItems,
} from "@/types/cart-types";
import { current, PayloadAction } from "@reduxjs/toolkit";

export const addItem = (state: CartState, action: PayloadAction<CartItem>) => {
  const item = action.payload;
  const cartKey =
    item.cartKey ?? getCartKey(item.id, item.extras, item.menuType);

  const existingItem = state.items[cartKey];

  if (existingItem) {
    existingItem.quantity += 1;

    if (item.extras?.length) {
      if (!existingItem.extras) existingItem.extras = [];

      item.extras.forEach((newExtra) => {
        const existingExtra = existingItem.extras?.find(
          (e) => e.id === newExtra.id,
        );

        if (existingExtra) {
          existingExtra.quantity =
            (existingExtra.quantity || 0) + (newExtra.quantity || 1);
        } else {
          existingItem.extras?.push({
            ...newExtra,
            quantity: newExtra.quantity || 1,
          });
        }
      });
    }
  } else {
    state.items[cartKey] = {
      ...item,
      cartKey,
      quantity: 1,
      originalQuantity: item.originalQuantity ?? 1,
      extras:
        item.extras?.map((e) => ({
          ...e,
          quantity: e.quantity || 1,
        })) || [],
    };
  }
};

export const removeItem = (state: CartState, action: PayloadAction<string>) => {
  const cartKey = action.payload;

  const existingItem = state.items[cartKey];
  if (!existingItem) return;

  if (existingItem.quantity > 1) {
    existingItem.quantity -= 1;
  } else {
    delete state.items[cartKey];
  }
};

export const updateItemNote = (
  state: CartState,
  action: PayloadAction<{ cartKey: string; notes?: string }>,
) => {
  const { cartKey, notes } = action.payload;
  if (!state.items[cartKey]) return;
  state.items[cartKey].notes = notes;
};

export const clearCart = (state: CartState) => {
  state.items = {};
};

export const setCart = (
  state: CartState,
  action: PayloadAction<Record<string, CartItem>>,
) => {
  state.items = normalizeCartItems(action.payload);
};
