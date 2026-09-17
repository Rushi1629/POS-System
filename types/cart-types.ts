export type CartItem = {
  id: string;
  cartKey: string;
  name: string;
  description?: string;
  price: number;
  isUpdated?: boolean;
  quantity: number;
  originalQuantity?: number;
  menuType?: "Veg" | "NonVeg";
  isBest?: boolean;
  imageUrl: string;
  isCancelled?: boolean;
  notes?: string;
  orderItemId?: string;
  extras?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
};
export const getCartKey = (
  id: string,
) => {
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

      existing.quantity += normalizedItem.quantity;

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
  menuItemId: string;
  quantity: number;
  notes?: string;
  subMenuItemId: {
    subMenuItemId: string;
    quantity: number;
  }[];
};

export type CartState = {
  items: Record<string, CartItem>;
};
