export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";
export type TableCategory = "family" | "pod" | "hall";
export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "served" | "completed";

export interface TableData {
  id: string;
  number: number;
  category: TableCategory;
  status: TableStatus;
  seats: number;
  guestCount?: number;
  timerStart?: string;
  currentOrderId?: string;
}

export interface MenuAddon {
  name: string;
  options: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  description: string;
  available: boolean;
  veg: boolean;
  image?: string;
  addons?: MenuAddon[];
}

export const menuSubcategories: Record<string, string[]> = {
  "Starters": ["Veg Starters", "Non-Veg Starters", "Soups"],
  "Main Course": ["Veg Curries", "Non-Veg Curries", "Rice & Biryani"],
  "Breads": ["Naan", "Roti", "Paratha"],
  "Sides": ["Raita", "Salad", "Pickles"],
  "Beverages": ["Hot Drinks", "Cold Drinks", "Mocktails"],
  "Desserts": ["Indian Sweets", "Ice Cream", "Cakes"],
};

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: OrderStatus;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
}

export const tables: TableData[] = [
  { id: "t1", number: 1, category: "family", status: "available", seats: 4 },
  { id: "t2", number: 2, category: "family", status: "occupied", seats: 4, guestCount: 3, timerStart: "2026-04-06T10:30:00", currentOrderId: "o1" },
  { id: "t3", number: 3, category: "family", status: "reserved", seats: 6 },
  { id: "t4", number: 4, category: "family", status: "cleaning", seats: 4 },
  { id: "t5", number: 5, category: "family", status: "available", seats: 2 },
  { id: "t6", number: 6, category: "pod", status: "occupied", seats: 4, guestCount: 4, timerStart: "2026-04-06T11:00:00", currentOrderId: "o2" },
  { id: "t7", number: 7, category: "pod", status: "available", seats: 6 },
  { id: "t8", number: 8, category: "pod", status: "reserved", seats: 4 },
  { id: "t9", number: 9, category: "hall", status: "occupied", seats: 8, guestCount: 6, timerStart: "2026-04-06T09:45:00", currentOrderId: "o3" },
  { id: "t10", number: 10, category: "hall", status: "available", seats: 10 },
  { id: "t11", number: 11, category: "hall", status: "available", seats: 12 },
  { id: "t12", number: 12, category: "hall", status: "cleaning", seats: 8 },
];

export const menuItems: MenuItem[] = [
  { id: "m1", name: "Butter Chicken", category: "Main Course", price: 350, description: "Creamy tomato-based curry with tender chicken", available: true, veg: false },
  { id: "m2", name: "Paneer Tikka", category: "Starters", price: 280, description: "Grilled cottage cheese with spices", available: true, veg: true },
  { id: "m3", name: "Biryani", category: "Main Course", price: 320, description: "Fragrant basmati rice with aromatic spices", available: true, veg: false },
  { id: "m4", name: "Dal Makhani", category: "Main Course", price: 240, description: "Slow-cooked black lentils in creamy sauce", available: true, veg: true },
  { id: "m5", name: "Garlic Naan", category: "Breads", price: 60, description: "Soft bread with garlic and butter", available: true, veg: true },
  { id: "m6", name: "Tandoori Chicken", category: "Starters", price: 300, description: "Charcoal-grilled marinated chicken", available: false, veg: false },
  { id: "m7", name: "Mango Lassi", category: "Beverages", price: 120, description: "Sweet mango yogurt drink", available: true, veg: true },
  { id: "m8", name: "Gulab Jamun", category: "Desserts", price: 150, description: "Deep-fried milk solids in sugar syrup", available: true, veg: true },
  { id: "m9", name: "Masala Chai", category: "Beverages", price: 60, description: "Spiced Indian tea with milk", available: true, veg: true },
  { id: "m10", name: "Chicken Tikka", category: "Starters", price: 260, description: "Spiced grilled chicken pieces", available: true, veg: false },
  { id: "m11", name: "Palak Paneer", category: "Main Course", price: 260, description: "Spinach and cottage cheese curry", available: true, veg: true },
  { id: "m12", name: "Raita", category: "Sides", price: 80, description: "Yogurt with cucumber and spices", available: true, veg: true },
];

export const orders: Order[] = [
  {
    id: "o1",
    tableId: "t2",
    tableNumber: 2,
    items: [
      { id: "oi1", menuItemId: "m1", name: "Butter Chicken", quantity: 1, price: 350, status: "preparing" },
      { id: "oi2", menuItemId: "m5", name: "Garlic Naan", quantity: 3, price: 60, notes: "Extra crispy", status: "ready" },
      { id: "oi3", menuItemId: "m7", name: "Mango Lassi", quantity: 2, price: 120, status: "served" },
    ],
    status: "preparing",
    createdAt: "2026-04-06T10:35:00",
    totalAmount: 770,
  },
  {
    id: "o2",
    tableId: "t6",
    tableNumber: 6,
    items: [
      { id: "oi4", menuItemId: "m3", name: "Biryani", quantity: 2, price: 320, status: "pending" },
      { id: "oi5", menuItemId: "m2", name: "Paneer Tikka", quantity: 1, price: 280, status: "accepted" },
      { id: "oi6", menuItemId: "m9", name: "Masala Chai", quantity: 4, price: 60, status: "ready" },
    ],
    status: "accepted",
    createdAt: "2026-04-06T11:10:00",
    totalAmount: 1160,
  },
  {
    id: "o3",
    tableId: "t9",
    tableNumber: 9,
    items: [
      { id: "oi7", menuItemId: "m4", name: "Dal Makhani", quantity: 2, price: 240, status: "preparing" },
      { id: "oi8", menuItemId: "m11", name: "Palak Paneer", quantity: 1, price: 260, status: "preparing" },
      { id: "oi9", menuItemId: "m5", name: "Garlic Naan", quantity: 6, price: 60, status: "pending" },
      { id: "oi10", menuItemId: "m8", name: "Gulab Jamun", quantity: 3, price: 150, status: "pending" },
    ],
    status: "preparing",
    createdAt: "2026-04-06T09:50:00",
    totalAmount: 1550,
  },
];

export const menuCategories = ["All", "Starters", "Main Course", "Breads", "Sides", "Beverages", "Desserts"];

export const dailyStats = {
  totalSales: 24580,
  ordersToday: 42,
  avgOrderValue: 585,
  tablesActive: 3,
  peakHour: "1:00 PM",
  topItem: "Butter Chicken",
};
