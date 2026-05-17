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

// export const categories: Category[] = [
//   { id: "chef-special", name: "Chef Special", icon: "👨‍🍳", count: 12 },
//   { id: "summer-special", name: "Summer Special", icon: "☀️", count: 8 },
//   { id: "hot-coffee", name: "Hot Coffee", icon: "☕", count: 10 },
//   { id: "chocolate", name: "Chocolate Drinks", icon: "🍫", count: 6 },
//   { id: "cold-coffee", name: "Cold Coffee", icon: "🧊", count: 9 },
//   { id: "smoothie", name: "Smoothies", icon: "🥤", count: 7 },
//   { id: "coolers", name: "Coolers", icon: "🍹", count: 5 },
//   { id: "tea", name: "Tea", icon: "🍵", count: 8 },
//   { id: "mocktail", name: "Mocktails", icon: "🍸", count: 6 },
//   { id: "fries", name: "French Fries", icon: "🍟", count: 4 },
//   { id: "appetizers-veg", name: "Appetizers (Veg)", icon: "🥗", count: 11 },
//   { id: "burgers", name: "Burgers", icon: "🍔", count: 7 },
// ];
