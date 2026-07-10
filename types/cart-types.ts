export type CartItem = {
  id: number;
  cartKey: string;
  name: string;
  description?: string;
  price: number;
  isUpdated?: boolean;
  quantity: number;
  originalQuantity?: number; // Track the starting quantity for update detection
  menuType?: "Veg" | "NonVeg";
  isBest?: boolean;
  imageUrl: string;
  isCancelled?: boolean;
  notes?: string;
  orderItemId?: number; // ⚠️ not in original type, but needed for mapping orders to cart
  extras?: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
};
export const getCartKey = (
  id: number,
  // extras?: { id: number }[],
  // menuType?: "Veg" | "NonVeg",
) => {
  // const typeKey = menuType || "notype";

  // const extrasKey =
  //   extras
  //     ?.map((e) => e.id) // ✅ ONLY ID, NOT quantity
  //     .sort()
  //     .join("|") || "noextra";

  return `${id}`;
};

export const normalizeCartItems = (
  items: Record<string, CartItem>,
): Record<string, CartItem> => {
  const normalized: Record<string, CartItem> = {};

  Object.values(items).forEach((item) => {
    const cartKey =
      item.cartKey ?? getCartKey(item.id);
    const normalizedItem: CartItem = {
      ...item,
      cartKey,
      originalQuantity: item.originalQuantity ?? item.quantity,
      extras:
        item.extras?.map((e) => ({
          ...e,
          quantity: e.quantity || 1,
        })) || [],
    };

    if (normalized[cartKey]) {
      const existing = normalized[cartKey];

      // ✅ merge quantity
      existing.quantity += normalizedItem.quantity;

      // preserve orderItemId / notes when duplicates merge
      // existing.orderItemId = existing.orderItemId ?? normalizedItem.orderItemId;
      // existing.notes = existing.notes ?? normalizedItem.notes;
      // existing.isCancelled = existing.isCancelled ?? normalizedItem.isCancelled;
      // existing.originalQuantity =
      //   existing.originalQuantity ?? normalizedItem.originalQuantity ?? normalizedItem.quantity;

      // ✅ merge extras
      const extrasMap = new Map();

      [...(existing.extras || []), ...(normalizedItem.extras || [])].forEach(
        (e) => {
          const key = e.id;

          if (extrasMap.has(key)) {
            extrasMap.get(key).quantity += e.quantity;
          } else {
            extrasMap.set(key, { ...e });
          }
        },
      );

      existing.extras = Array.from(extrasMap.values());
    } else {
      normalized[cartKey] = normalizedItem;
    }
  });

  return normalized;
};
export type OrderItemPayload = {
  menuItemId: number;
  quantity: number;
  notes?: string;
  subMenuItemId: {
    subMenuItemId: number;
    quantity: number;
  }[];
};

export type CartState = {
  items: Record<string, CartItem>;
};
