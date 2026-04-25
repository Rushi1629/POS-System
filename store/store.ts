import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/cartSlice";
import tableReducer from "./table/tableSlice";
import authReducer from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    tables: tableReducer,
    auth: authReducer,
  },
});

// types (very important for TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;