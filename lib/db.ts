import { IDBPDatabase, openDB } from "idb";
import { CartItem } from "@/types/cart-types";
import { toast } from "sonner";

const DB_NAME = "pos-db";
const STORE_NAME = "cart";

let dbPromise: Promise<IDBPDatabase> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }

  return dbPromise;
};

const normalizeTableToken = (tableToken?: string | null) => {
  const token = tableToken?.trim();
  return token && token !== "undefined" && token !== "null" ? token : "";
};

const getCartDBKey = (tableToken?: string | null) => {
  const token = normalizeTableToken(tableToken);
  return token ? `cartItems:${token}` : null;
};

// ✅ Save full cart
export const saveCartToDB = async (
  items: Record<string, CartItem>,
  tableToken?: string,
): Promise<void> => {
  try {
    const key = getCartDBKey(tableToken);
    if (!key) {
      toast.warning("Skipping cart save to IndexedDB: missing tableToken");
      return;
    }

    const db = await getDB();
    await db.put(STORE_NAME, items, key);

    const check = await db.get(STORE_NAME, key);
  } catch (err) {
    toast.error("Failed to save cart to local storage. Please try again.");
  }
};

export const loadCartFromDB = async (
  tableToken?: string,
): Promise<Record<string, CartItem>> => {
  if (typeof window === "undefined") return {};

  try {
    const key = getCartDBKey(tableToken);
    if (!key) {
      toast.warning("Skipping cart load from IndexedDB: missing tableToken");
      return {};
    }

    const db = await getDB();
    const items = await db.get(STORE_NAME, key);

    return items || {};
  } catch (err) {
    toast.error("Failed to load cart. Please try again.");
    return {};
  }
};

// ✅ Clear DB
export const clearCartDB = async (tableToken?: string) => {
  if (typeof window === "undefined") return;

  const db = await getDB();
  const key = getCartDBKey(tableToken);

  if (!key) {
    toast.warning("Skipping cart delete from IndexedDB: missing tableToken");
    return;
  }

  await db.delete(STORE_NAME, key);
};
