import { createSlice } from "@reduxjs/toolkit";
import { addItem, clearCart, removeItem } from "./cartReducers";

type CartState = {
  cart: Record<string, number>;
};

const initialState: CartState = {
  cart: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem,
    removeItem,
    clearCart,
  },
});

export const { addItem: addItemAction, removeItem: removeItemAction, clearCart: clearCartAction } = cartSlice.actions;

export default cartSlice.reducer;