import { UserRole } from "./types";

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export interface StatusTransition {
  from: OrderStatus | "ANY";
  to: OrderStatus;
  roles: UserRole[];
}

// export const STATUS_TRANSITIONS: StatusTransition[] = [
//   { from: "PENDING", to: "ACCEPTED", roles: ["Admin", "Super Admin"] },
//   { from: "ACCEPTED", to: "PREPARING", roles: ["Chef", "Super Admin"] },
//   { from: "PREPARING", to: "READY", roles: ["Chef", "Super Admin"] },
//   { from: "READY", to: "SERVED", roles: ["Waiter", "Super Admin"] },
//   { from: "SERVED", to: "COMPLETED", roles: ["Admin", "Super Admin"] },
//   { from: "ANY", to: "CANCELLED", roles: ["Admin", "Waiter", "Super Admin"] },
// ];

export const STATUS_TRANSITIONS: StatusTransition[] = [
  {
    from: "PENDING",
    to: "ACCEPTED",
    roles: ["Admin", "Super Admin"],
  },
  {
    from: "ACCEPTED",
    to: "PREPARING",
    roles: ["Chef"],
  },
  {
    from: "PREPARING",
    to: "READY",
    roles: ["Chef"],
  },
  {
    from: "READY",
    to: "SERVED",
    roles: ["Waiter"],
  },
  {
    from: "SERVED",
    to: "COMPLETED",
    roles: ["Admin", "Super Admin"],
  },
  {
    from: "ANY",
    to: "CANCELLED",
    roles: ["Admin", "Waiter"],
  },
];

export const ALL_ROLES: UserRole[] = ["Super Admin", "Admin", "Chef", "Waiter"];

export const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
];

export function getAllowedTransitions(
  current: OrderStatus,
  role: UserRole,
): OrderStatus[] {
  return STATUS_TRANSITIONS.filter(
    (t) =>
      (t.from === current || t.from === "ANY") &&
      t.roles.includes(role) && // ✅ STRICT ROLE CHECK
      t.to !== current,
  ).map((t) => t.to);
}

export const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-[oklch(0.95_0.06_70)] text-[oklch(0.45_0.15_55)]",
  ACCEPTED: "bg-[oklch(0.93_0.07_230)] text-[oklch(0.4_0.15_240)]",
  PREPARING: "bg-[oklch(0.94_0.08_100)] text-[oklch(0.45_0.15_90)]",
  READY: "bg-[oklch(0.93_0.09_170)] text-[oklch(0.4_0.13_175)]",
  SERVED: "bg-[oklch(0.93_0.08_145)] text-[oklch(0.38_0.13_150)]",
  COMPLETED: "bg-[oklch(0.93_0.04_145)] text-[oklch(0.35_0.08_150)]",
  CANCELLED: "bg-[oklch(0.94_0.04_25)] text-[oklch(0.5_0.18_25)]",
};

export interface UpdateStatusPayload {
  orderId: number;
  status: OrderStatus;
}

export interface ActiveTarget {
  orderId: number;
  orderStatus: OrderStatus;
  tableName: string;
  orderNumber?: string;
}

export interface SubMenuItem {
  subMenuItemId: number;
  id: number;
  name: string;
  price: string;
}
export interface OrderSubMenuItem {
  orderSubMenuItemId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string | null;
  isCancelled: boolean;
  subMenuItem: SubMenuItem;
}
export interface MenuItem {
  menuItemId: number;
  id: number;
  name: string;
  price: string;
  menuType: "Veg" | "Non Veg";
}
export interface OrderItem {
  orderItemId: number;
  orderItemStatus: OrderStatus;
  orderId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string | null;
  isCancelled: boolean;
  menuItem: MenuItem;
  orderSubMenuItems: OrderSubMenuItem[];
}
export interface Order {
  orderId: number;
  orderStatus: OrderStatus;
  tableId: number;
  orderNumber: string;
  orderType: string;
  paymentStatus: string;
  subtotal: string;
  totalAmount: string;
  notes: string | null;
  items: OrderItem[];
}
export interface TableOrders {
  tableId: number;
  tableName: string;
  orders: Order[];
}

export function labelFor(s: OrderStatus): string {
  switch (s) {
    case "ACCEPTED":
      return "Accept";
    case "PREPARING":
      return "Start prep";
    case "READY":
      return "Mark ready";
    case "SERVED":
      return "Mark served";
    case "COMPLETED":
      return "Complete";
    case "CANCELLED":
      return "Cancel";
    default:
      return s;
  }
}
