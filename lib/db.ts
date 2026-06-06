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

// ✅ Save full cart
export const saveCartToDB = async (
  items: Record<string, CartItem>,
  tableToken?: string,
): Promise<void> => {
  try {
    const db = await getDB();
    const key = tableToken ? `cartItems:${tableToken}` : `cartItems:${tableToken}`;

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
    const db = await getDB();
    const key = tableToken ? `cartItems:${tableToken}` : `cartItems:${tableToken}`;

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
  if (tableToken) {
    const key = `cartItems:${tableToken}`;
    await db.delete(STORE_NAME, key);
    console.log("CLEARED CART DB KEY:", key);
  } else {
    // fallback: clear all cart entries
    await db.clear(STORE_NAME);
    console.log("CLEARED ENTIRE CART STORE");
  }
};
