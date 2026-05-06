import { Middleware } from "@reduxjs/toolkit";
import { saveCartToDB } from "@/lib/db";

let timeout: ReturnType<typeof setTimeout> | null = null;

export const cartSyncMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    const result = next(action);

    // ✅ Only cart actions
    if (!action.type.startsWith("cart/")) return result;

    // ✅ Debounce (prevents spam writes)
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      const state = storeAPI.getState();

      // ✅ IMPORTANT: clone to remove proxy
      const items = structuredClone(state.cart.items);

      console.log("SYNCING CART:", items);

      saveCartToDB(items).catch(console.error);
    }, 300); // 300ms debounce

    return result;
  };
