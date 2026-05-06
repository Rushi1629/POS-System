export type CartItem = {
  id: string;
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