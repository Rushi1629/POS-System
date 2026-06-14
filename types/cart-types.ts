export type CartItem = {
  id: string;
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
  }[];
  subMenuItemId?: {
    id: number;
    price: number;
    name: string;
  }[];
};

export type CartState = {
  items: Record<string, CartItem>;
};