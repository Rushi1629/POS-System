import { createSlice } from "@reduxjs/toolkit";
import {
  addItem,
  clearCart,
  removeItem,
  setCart,
  updateItemNote,
} from "./cartReducers";
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
    updateItemNote,
    clearCart,
    setCart,
  },
});

export const {
  addItem: addItemAction,
  removeItem: removeItemAction,
  updateItemNote: updateItemNoteAction,
  clearCart: clearCartAction,
  setCart: setCartAction,
} = cartSlice.actions;

export default cartSlice.reducer;