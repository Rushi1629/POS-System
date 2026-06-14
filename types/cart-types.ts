export type CartItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  menuType?: "Veg" | "NonVeg";
  isBest?: boolean;
  imageUrl: string;
  notes?: string;
  extras?: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
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