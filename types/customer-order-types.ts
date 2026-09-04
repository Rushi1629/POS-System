import { CheckCheck, ChefHat, Receipt, ShoppingBag, Sparkles, Truck, Utensils } from "lucide-react";

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  menuType: string;
};
export type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string | null;
  orderItemStatus:
    | "PENDING"
    | "ACCEPTED"
    | "PREPARING"
    | "READY"
    | "SERVED"
    | "COMPLETED"
    | "CANCELLED";
  isCancelled: boolean;
  menuItem: MenuItem;
  subMenuItems?: {
    id: number;
    name: string;
    price: number;
  }[];
};
export type Order = {
  id: string;
  tableId: string;
  orderStatus:
    | "PENDING"
    | "ACCEPTED"
    | "PREPARING"
    | "READY"
    | "SERVED"
    | "COMPLETED"
    | "CANCELLED";
  orderNumber: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  serviceCharge: string;
  timeChargeAmount: string | null;
  totalAmount: string;
  notes: string | null;
  placedAt: string;
  etaMinutes?: number;
  items: OrderItem[];
};


export const STEPS: Array<{
  key: Order["orderStatus"];
  label: string;
  icon: React.ElementType;
}> = [
  { key: "PENDING", label: "Placed", icon: Receipt },
  { key: "ACCEPTED", label: "Accepted", icon: CheckCheck },
  { key: "PREPARING", label: "Preparing", icon: ChefHat },
  { key: "READY", label: "Ready", icon: Sparkles },
  { key: "SERVED", label: "Served", icon: Utensils },
  { key: "COMPLETED", label: "Completed", icon: CheckCheck },
];
export type OrderItemStatus = OrderItem["orderItemStatus"];

export const ORDER_ITEM_STATUS_META: Record<
  OrderItemStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Placed",
    className: "bg-gray-100 text-gray-600",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-700",
  },
  PREPARING: {
    label: "Preparing",
    className: "bg-amber-100 text-amber-700",
  },
  READY: {
    label: "Ready",
    className: "bg-blue-100 text-blue-700",
  },
  SERVED: {
    label: "Served",
    className: "bg-purple-100 text-purple-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive",
  },
};

export const TYPE_META: Record<
  Order["orderType"],
  { label: string; icon: React.ElementType }
> = {
  DINE_IN: { label: "Dine-In", icon: Utensils },
  TAKEAWAY: { label: "Takeaway", icon: ShoppingBag },
  DELIVERY: { label: "Delivery", icon: Truck },
};