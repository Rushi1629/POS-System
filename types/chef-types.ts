import { Role, UserRole } from "./types";

export type ItemStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";
export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type TableOrder = {
  tableId: number;
  tableName: string;
  orders: Order[];
};

export type Order = {
  orderId: number;
  orderStatus: OrderStatus;
  tableId: number;
  orderNumber: string;
  orderType: string;
  paymentStatus: string;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  serviceCharge: string;
  timeChargeAmount: string | null;
  totalAmount: string;
  notes: string | null;
  items: OrderItem[];
};

export type OrderItem = {
  orderItemId: number;
  orderItemStatus: ItemStatus;
  orderId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string | null;
  isCancelled: boolean;
  menuItem: MenuItem;
  orderSubMenuItems: SubMenuItem[];
};

export type MenuItem = {
  menuItemId: number;
  id: number;
  name: string;
  price: string;
  menuType: string;
};

export type SubMenuItem = {
  orderSubMenuItemId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string | null;
  isCancelled: boolean;
  subMenuItem: {
    subMenuItemId: number;
    id: number;
    name: string;
    price: string;
  };
};

export type KItem = {
  id: number;
  name: string;
  qty: number;
  note?: string;
  isCancelled: boolean;
  status: ItemStatus;
};

export type KOrder = {
  id: number;
  table: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  items: KItem[];
};

export const NEXT: Record<ItemStatus, ItemStatus | null> = {
  PENDING: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
  READY: "SERVED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  SERVED: "SERVED",
};

export const STATUS_STYLES: Record<
  ItemStatus,
  { label: string; chip: string; dot: string; accent: string }
> = {
  PENDING: {
    label: "Pending",
    chip: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
    dot: "bg-amber-500",
    accent: "from-amber-500/60 to-amber-500/0",
  },
  ACCEPTED: {
    label: "Accepted",
    chip: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
    dot: "bg-sky-500",
    accent: "from-sky-500/60 to-sky-500/0",
  },
  PREPARING: {
    label: "Preparing",
    chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
    accent: "from-emerald-500/60 to-emerald-500/0",
  },
  READY: {
    label: "Ready",
    chip: "bg-primary/15 text-primary border-primary/30",
    dot: "bg-primary",
    accent: "from-primary/60 to-primary/0",
  },
  SERVED: {
    label: "Served",
    chip: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
    accent: "from-muted-foreground/30 to-transparent",
  },
  COMPLETED: {
    label: "Completed",
    chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
    accent: "from-emerald-500/60 to-emerald-500/0",
  },
  CANCELLED: {
    label: "Cancelled",
    chip: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30",
    dot: "bg-rose-500",
    accent: "from-rose-500/60 to-rose-500/0",
  },
};

type StatusTransition = {
  from: OrderStatus | "ANY";
  to: OrderStatus;
  roles: UserRole[];
};

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
    roles: ["Super Admin", "Waiter"],
  },
];
