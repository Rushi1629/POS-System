import { CartState } from "@/types/types";
import { PayloadAction } from "@reduxjs/toolkit";

export const addItem = (state: CartState, action: PayloadAction<string>) => {
  const id = action.payload;
  state.cart[id] = (state.cart[id] || 0) + 1;
};

export const removeItem = (state: CartState, action: PayloadAction<string>) => {
  const id = action.payload;

  if (state.cart[id] > 1) state.cart[id]--;
  else delete state.cart[id];
};

export const clearCart = (state: CartState) => {
  state.cart = {};
};