import { CheckCheck, ChefHat, Receipt, ShoppingBag, Sparkles, Truck, Utensils } from "lucide-react";

export type MenuItem = {
  id: number;
  name: string;
  price: string;
  menuType: string;
};
export type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string | null;
  orderItemStatus:
    | "PENDING"
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
  id: number;
  tableId: number;
  orderStatus:
    | "PENDING"
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
  { key: "PREPARING", label: "Preparing", icon: ChefHat },
  { key: "READY", label: "Ready", icon: Sparkles },
  { key: "SERVED", label: "Served", icon: Utensils },
  { key: "COMPLETED", label: "Completed", icon: CheckCheck },
];

export const TYPE_META: Record<
  Order["orderType"],
  { label: string; icon: React.ElementType }
> = {
  DINE_IN: { label: "Dine-In", icon: Utensils },
  TAKEAWAY: { label: "Takeaway", icon: ShoppingBag },
  DELIVERY: { label: "Delivery", icon: Truck },
};