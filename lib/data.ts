export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: "chef-special", name: "Chef Special", icon: "👨‍🍳", count: 12 },
  { id: "summer-special", name: "Summer Special", icon: "☀️", count: 8 },
  { id: "hot-coffee", name: "Hot Coffee", icon: "☕", count: 10 },
  { id: "chocolate", name: "Chocolate Drinks", icon: "🍫", count: 6 },
  { id: "cold-coffee", name: "Cold Coffee", icon: "🧊", count: 9 },
  { id: "smoothie", name: "Smoothies", icon: "🥤", count: 7 },
  { id: "coolers", name: "Coolers", icon: "🍹", count: 5 },
  { id: "tea", name: "Tea", icon: "🍵", count: 8 },
  { id: "mocktail", name: "Mocktails", icon: "🍸", count: 6 },
  { id: "fries", name: "French Fries", icon: "🍟", count: 4 },
  { id: "appetizers-veg", name: "Appetizers (Veg)", icon: "🥗", count: 11 },
  { id: "burgers", name: "Burgers", icon: "🍔", count: 7 },
];

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Mango Royale Smoothie",
    price: 289,
    description: "A refreshing blend of ripe, juicy mangoes and chilled yogurt, topped with a drizzle of honey and fresh mint leaves.",
    category: "chef-special",
    isVeg: true,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Mango Kick Mocktail",
    price: 159,
    description: "A bold and refreshing blend of sweet mango flavor infused with a tangy lime kick and sparkling soda.",
    category: "chef-special",
    isVeg: true,
  },
  {
    id: "3",
    name: "Mango Delight Croissant",
    price: 179,
    description: "A flaky, buttery croissant filled with luscious mango cream and topped with fresh mango slices.",
    category: "chef-special",
    isVeg: true,
    isBestseller: true,
  },
  {
    id: "4",
    name: "Mango Matcha Latte",
    price: 309,
    description: "Premium matcha green tea blended with sweet mango puree and creamy oat milk for a tropical twist.",
    category: "chef-special",
    isVeg: true,
  },
  {
    id: "5",
    name: "Truffle Mushroom Toast",
    price: 249,
    description: "Artisan sourdough topped with sautéed wild mushrooms, truffle oil, and a sprinkle of parmesan.",
    category: "chef-special",
    isVeg: true,
  },
  {
    id: "6",
    name: "Berry Bliss Smoothie Bowl",
    price: 319,
    description: "A thick and creamy açai berry smoothie bowl loaded with granola, fresh berries, and coconut flakes.",
    category: "chef-special",
    isVeg: true,
    isBestseller: true,
  },
  {
    id: "7",
    name: "Classic Cappuccino",
    price: 149,
    description: "Rich espresso with steamed milk and a velvety foam cap, perfect for any time of day.",
    category: "hot-coffee",
    isVeg: true,
  },
  {
    id: "8",
    name: "Hazelnut Mocha",
    price: 199,
    description: "Indulgent hazelnut-flavored espresso with dark chocolate and steamed milk, topped with whipped cream.",
    category: "hot-coffee",
    isVeg: true,
  },
  {
    id: "9",
    name: "Tropical Mango Cooler",
    price: 189,
    description: "Chilled mango juice with a splash of coconut water, lime, and crushed ice for the ultimate refreshment.",
    category: "coolers",
    isVeg: true,
  },
  {
    id: "10",
    name: "Spicy Paneer Tikka Fries",
    price: 229,
    description: "Crispy golden fries loaded with tandoori paneer tikka, mint chutney, and a sprinkle of chaat masala.",
    category: "fries",
    isVeg: true,
    isBestseller: true,
  },
  {
    id: "11",
    name: "Classic Veggie Burger",
    price: 199,
    description: "A hearty veggie patty with fresh lettuce, tomato, pickles, and our signature house sauce.",
    category: "burgers",
    isVeg: true,
  },
  {
    id: "12",
    name: "Chicken Crunch Burger",
    price: 259,
    description: "Crispy fried chicken fillet with spicy mayo, coleslaw, and jalapeños on a toasted brioche bun.",
    category: "burgers",
    isVeg: false,
  },
];
