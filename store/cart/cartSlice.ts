import { createSlice } from "@reduxjs/toolkit";
import { addItem, clearCart, removeItem, setCart } from "./cartReducers";
import { CartState } from "@/types/cart-types";

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem,
    removeItem,
    clearCart,
    setCart,
  },
});

export const {
  addItem: addItemAction,
  removeItem: removeItemAction,
  clearCart: clearCartAction,
  setCart: setCartAction,
} = cartSlice.actions;

export default cartSlice.reducer;