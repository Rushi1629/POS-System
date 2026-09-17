import { Middleware } from "@reduxjs/toolkit";
import { saveCartToDB } from "@/lib/db";
import { toast } from "sonner";

let timeout: ReturnType<typeof setTimeout> | null = null;

export const cartSyncMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    const result = next(action);

    if (!action.type.startsWith("cart/")) return result;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      const state = storeAPI.getState();

      const items = structuredClone(state.cart.items);

      let tableToken: string | undefined = undefined;
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          tableToken = params.get("tableToken") ?? undefined;
        }
      } catch (e) {
      }

      if (!tableToken || tableToken === "undefined" || tableToken === "null") {
        return;
      }

      saveCartToDB(items, tableToken).catch(console.error);
    }, 300);

    return result;
  };
