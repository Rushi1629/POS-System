export interface CreateOrderRequest {
  tableId: number;
  notes?: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  notes?: string;
}

export type MenuItem = {
  id: number;
  name: string;
  price: string;
  menuType: string;
};

export type OrderItemAdmin = {
  orderItemId: number;
  orderItemStatus: "PENDING" | "PREPARING" | "READY" | "SERVED" | "COMPLETED" | "CANCELLED";
  orderId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string | null;
  isCancelled: boolean;
  menuItem: MenuItem;
  subMenuItem: MenuItem | null;
};

export type Order = {
  orderId: number;
  tableId: number;
  orderNumber: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  orderStatus: "PENDING" | "PREPARING" | "READY" | "SERVED" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  serviceCharge: string;
  timeChargeAmount: string | null;
  totalAmount: string;
  notes: string | null;
  items: OrderItemAdmin[];
};

export const STATUS_META: Record<
  Order["orderStatus"],
  { label: string; cls: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    dot: "bg-amber-500",
  },
  PREPARING: {
    label: "Preparing",
    cls: "bg-sky-500/10 text-sky-600 border-sky-500/30",
    dot: "bg-sky-500",
  },
  READY: {
    label: "Ready",
    cls: "bg-violet-500/10 text-violet-600 border-violet-500/30",
    dot: "bg-violet-500",
  },
  SERVED: {
    label: "Served",
    cls: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
    dot: "bg-indigo-500",
  },
  COMPLETED: {
    label: "Completed",
    cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-rose-500/10 text-rose-600 border-rose-500/30",
    dot: "bg-rose-500",
  },
};

export const PAY_META: Record<Order["paymentStatus"], string> = {
  UNPAID: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  REFUNDED: "bg-muted text-muted-foreground border-border",
};

export const TYPE_META: Record<Order["orderType"], string> = {
  DINE_IN: "bg-primary/10 text-primary border-primary/30",
  TAKEAWAY: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  DELIVERY: "bg-blue-500/10 text-blue-600 border-blue-500/30",
};
