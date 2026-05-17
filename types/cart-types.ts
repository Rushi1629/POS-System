export type CartItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  menuType?: "Veg" | "NonVeg";
  isBest?: boolean;
  imageUrl: string; 
};

export type CartState = {
  items: Record<string, CartItem>;
};