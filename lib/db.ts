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
  items: Record<string, CartItem>
): Promise<void> => {
  try {
    const db = await getDB();

    await db.put(STORE_NAME, items, "cartItems");

    console.log("✅ Saved to DB:", items);
    const check = await db.get(STORE_NAME, "cartItems");
    console.log("AFTER SAVE READ:", check);
  } catch (err) {
    console.error("DB ERROR:", err);
  }
};

export const loadCartFromDB = async (): Promise<Record<string, CartItem>> => {
  if (typeof window === "undefined") return {};

  try {
    const db = await getDB();

    const items = await db.get("cart", "cartItems");

    console.log("LOADED FROM DB:", items);

    return items || {};
  } catch (err) {
    console.error("LOAD ERROR:", err);
    return {};
  }
};

// ✅ Clear DB
export const clearCartDB = async () => {
  if (typeof window === "undefined") return;

  const db = await getDB();
  await db.clear("cart");
};
