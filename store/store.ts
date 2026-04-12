import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/cartSlice";
import tableReducer from "./table/tableSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    tables: tableReducer,
  },
});

// types (very important for TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;