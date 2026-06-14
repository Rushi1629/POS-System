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
    quantity: number;
  }[];
};

export type CartState = {
  items: Record<string, CartItem>;
};