import { IDBPDatabase, openDB } from "idb";
import { CartItem } from "@/types/cart-types";

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
      console.warn("Skipping cart save to IndexedDB: missing tableToken");
      return;
    }

    const db = await getDB();
    await db.put(STORE_NAME, items, key);

    console.log("✅ Saved to DB:", key, items);
    const check = await db.get(STORE_NAME, key);
    console.log("AFTER SAVE READ:", check);
  } catch (err) {
    console.error("DB ERROR:", err);
  }
};

export const loadCartFromDB = async (
  tableToken?: string,
): Promise<Record<string, CartItem>> => {
  if (typeof window === "undefined") return {};

  try {
    const key = getCartDBKey(tableToken);
    if (!key) {
      console.warn("Skipping cart load from IndexedDB: missing tableToken");
      return {};
    }

    const db = await getDB();
    const items = await db.get(STORE_NAME, key);

    console.log("LOADED FROM DB:", key, items);

    return items || {};
  } catch (err) {
    console.error("LOAD ERROR:", err);
    return {};
  }
};

// ✅ Clear DB
export const clearCartDB = async (tableToken?: string) => {
  if (typeof window === "undefined") return;

  const db = await getDB();
  const key = getCartDBKey(tableToken);

  if (key) {
    await db.delete(STORE_NAME, key);
    console.log("CLEARED CART DB KEY:", key);
    return;
  }

  // fallback: clear all cart entries only when the caller deliberately chose no table token.
  await db.clear(STORE_NAME);
  console.log("CLEARED ENTIRE CART STORE");
};
