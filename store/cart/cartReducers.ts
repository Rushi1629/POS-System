import { clearCartDB, saveCartToDB } from "@/lib/db";
import { CartItem, CartState } from "@/types/cart-types";
import { current, PayloadAction } from "@reduxjs/toolkit";

export const addItem = (state: CartState, action: PayloadAction<CartItem>) => {
  debugger;
  const item = action.payload;

  const existingItem = state.items[item.id];

  console.log(existingItem, "itemsexist");

  if (existingItem) {
    // ✅ Increase main item quantity
    existingItem.quantity += 1;
    existingItem.isUpdated = true;

    // ✅ Handle extras
    if (item.extras?.length) {
      if (!existingItem.extras) existingItem.extras = [];

      item.extras.forEach((newExtra) => {
        const existingExtra = existingItem.extras?.find(
          (e) => e.id === newExtra.id,
        );

        if (existingExtra) {
          existingExtra.quantity =
            (existingExtra.quantity || 0) + (newExtra.quantity || 1);
            existingItem.isUpdated = true;
        } else {
          existingItem.extras?.push({
            ...newExtra,
            quantity: newExtra.quantity || 1,
          });
        }
      });
    }
  } else {
    // ✅ First time item
    state.items[item.id] = {
      ...item,
      quantity: 1,
      isUpdated: false,
      extras:
        item.extras?.map((e) => ({
          ...e,
          quantity: e.quantity || 1,
          isUpdated: false,
        })) || [],
    };
  }
};

export const removeItem = (state: CartState, action: PayloadAction<number>) => {
  const id = action.payload;

  const existingItem = state.items[id];
  if (!existingItem) return;

  if (existingItem.quantity > 1) {
    existingItem.quantity -= 1;

    // ✅ MARK UPDATED
    existingItem.isUpdated = true;

  } else {
    // ❗ Before deleting, mark updated if needed (optional logic)
    existingItem.isUpdated = true;

    delete state.items[id];
  }
};

export const updateItemNote = (
  state: CartState,
  action: PayloadAction<{ id: number; notes?: string }>,
) => {
  const { id, notes } = action.payload;
  if (!state.items[id]) return;
  state.items[id].notes = notes;
};

export const clearCart = (state: CartState) => {
  state.items = {};
};

export const setCart = (
  state: CartState,
  action: PayloadAction<Record<string, CartItem>>,
) => {
  state.items = action.payload;
};
