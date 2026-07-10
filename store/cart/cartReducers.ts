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
    const incrementBy = item.quantity ?? 1;
    const newQuantity = existingItem.quantity + incrementBy;

    existingItem.quantity = newQuantity;

    // preserve item metadata from the existing cart line
    // existingItem.orderItemId = existingItem.orderItemId ?? item.orderItemId;
    // existingItem.notes = existingItem.notes ?? item.notes;

    if (existingItem.originalQuantity === undefined) {
      existingItem.originalQuantity = existingItem.quantity - incrementBy;
    }

    existingItem.isUpdated =
      existingItem.quantity !== existingItem.originalQuantity;
  } else {
    state.items[cartKey] = {
      ...item,
      cartKey,
      quantity: item.quantity || 1,
      originalQuantity: item.originalQuantity ?? (item.quantity || 1),
      // originalQuantity: item.quantity || 1,
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

  const newQuantity = existingItem.quantity - 1;

  // ✅ DO NOT DELETE — keep item for cancellation tracking
  existingItem.quantity = Math.max(newQuantity, 0);

  // ✅ Ensure originalQuantity exists
  if (existingItem.originalQuantity === undefined) {
    existingItem.originalQuantity = existingItem.quantity + 1;
  }

  // ✅ Mark updated
  existingItem.isUpdated =
    existingItem.quantity !== existingItem.originalQuantity;
};

export const updateItemNote = (
  state: CartState,
  action: PayloadAction<{ cartKey: string; notes?: string }>,
) => {
  const { cartKey, notes } = action.payload;
  const item = state.items[cartKey];

  if (!item) return;

  item.notes = notes;
  item.isUpdated = true;
};

export const clearCart = (state: CartState) => {
  state.items = {};
};

export const setCart = (
  state: CartState,
  action: PayloadAction<Record<string, CartItem>>,
) => {
  const normalized = normalizeCartItems(action.payload);

  Object.values(normalized).forEach((item) => {
    if (item.originalQuantity === undefined) {
      item.originalQuantity = item.quantity;
    }

    item.isUpdated = false;
  });

  state.items = normalized;
};
