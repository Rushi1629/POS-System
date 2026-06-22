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
  extras?: { id: number }[],
  menuType?: "Veg" | "NonVeg",
) => {
  // ✅ Don't include extras in key - merge all variants of same item
  const typeKey = menuType || "notype";
  return `${id}-${typeKey}`;
};

export const normalizeCartItems = (
  items: Record<string, CartItem>,
): Record<string, CartItem> => {
  const normalized: Record<string, CartItem> = {};

  Object.values(items).forEach((item) => {
    const cartKey =
      item.cartKey ?? getCartKey(item.id, item.extras, item.menuType);
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
      normalized[cartKey] = {
        ...normalized[cartKey],
        quantity: normalized[cartKey].quantity + normalizedItem.quantity,
        notes: normalizedItem.notes ?? normalized[cartKey].notes,
        originalQuantity:
          normalized[cartKey].originalQuantity ?? normalizedItem.originalQuantity,
      };
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