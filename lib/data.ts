export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
  imageUrl?: string;
}

export type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  isActive?: boolean;
};
