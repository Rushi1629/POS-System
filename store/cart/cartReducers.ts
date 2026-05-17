import { clearCartDB, saveCartToDB } from "@/lib/db";
import { CartItem, CartState } from "@/types/cart-types";
import { current, PayloadAction } from "@reduxjs/toolkit";

export const addItem = (state: CartState, action: PayloadAction<CartItem>) => {
  const item = action.payload;

  if (state.items[item.id]) {
    state.items[item.id].quantity += 1;
  } else {
    state.items[item.id] = { ...item, quantity: 1 };
  }
};

export const removeItem = (state: CartState, action: PayloadAction<number>) => {
  const id = action.payload;

  if (!state.items[id]) return;

  if (state.items[id].quantity > 1) {
    state.items[id].quantity -= 1;
  } else {
    delete state.items[id];
  }
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
