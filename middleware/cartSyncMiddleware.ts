import { Middleware } from "@reduxjs/toolkit";
import { saveCartToDB } from "@/lib/db";
import { toast } from "sonner";

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

      // Try to detect tableToken from current URL (if running in browser)
      let tableToken: string | undefined = undefined;
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          tableToken = params.get("tableToken") ?? undefined;
        }
      } catch (e) {
        // ignore
      }

      if (!tableToken || tableToken === "undefined" || tableToken === "null") {
        toast.warning("Skipping cart sync: missing tableToken");
        return;
      }

      saveCartToDB(items, tableToken).catch(console.error);
    }, 300); // 300ms debounce

    return result;
  };
