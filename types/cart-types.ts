export type CartItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  isVeg?: boolean;
  isBest?: boolean;
};

export type CartState = {
  items: Record<string, CartItem>;
};