// ============================================================
// Billing API TypeScript Interfaces
// One interface set per API endpoint (Generate / Pay / Get All)
// ============================================================

import { Banknote, CircleDollarSign, CreditCard, IndianRupee, Smartphone, Wallet } from "lucide-react";

export type PaymentStatus = "PAID" | "UNPAID" | "PARTIAL" | "REFUNDED";
export type PaymentMethod = "CASH" | "CARD" | "UPI" | "CASH_ONLINE" | "OTHER";
export type TableType = "FAMILY" | "COUPLE" | "HALL" | "OUTDOOR" | "PRIVATE";

// ---------- Shared sub-shapes ----------
export interface BillSession {
  id?: string;
  tableId: string;
  tableName: string;
  tableType: TableType;
  guestCount: number;
  startedAt?: string;
  endedAt?: string | null;
}

export interface BillSubMenuItem {
  id?: string;
  subMenuItemId?: string;
  subMenuItemName: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
  notes: string;
}

export interface BillOrderItem {
  id?: string;
  orderItemId?: string;
  menuItemId?: string;
  menuItemName: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
  notes: string;
  subMenuItems: BillSubMenuItem[];
}

export interface BillOrder {
  id?: string;
  orderId?: string;
  orderNumber: string;
  items: BillOrderItem[];
}

// ============================================================
// 1) Generate Bill API   →  POST /bills/generate
// ============================================================

export interface Discount {
  id: string;
  name: string;
  description: string;
  type: "AMOUNT" | "PERCENTAGE";
  value: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedDiscount {
  discountId: string;
  sequence: number;
}
export interface GenerateBillRequest {
  tableId: string;
  mobileNumber: string;
  discounts: SelectedDiscount[];
  notes: string;
}

export interface GenerateBillData {
  id: string;
  billNumber: string;
  sessionId: string;
  orderId: string;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  serviceCharge: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  paidAt: string | null;
  mobileNumber: string;
  notes: string;
  createdAt: string;
  session?: BillSession;
  order?: BillOrder;
}

export interface GenerateBillResponse {
  status: boolean;
  message: string;
  data: GenerateBillData;
}

// ============================================================
// 2) Pay Bill API   →  POST /bills/pay
// ============================================================
export interface PayBillRequest {
  billingId: string;
  paymentMethod: PaymentMethod;
  notes: string;
  cashAmount?: number;
  onlineAmount?: number;
}

export interface PayBillData {
  id: string;
  billNumber: string;
  sessionId: string;
  orderId: string;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  serviceCharge: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paidAt: string;
  mobileNumber: string;
  notes: string;
  createdAt: string;
  session: BillSession;
  order: {
    id: string;
    orderNumber: string;
    items: BillOrderItem[];
  };
}

export interface PayBillResponse {
  status: boolean;
  message: string;
  data: PayBillData;
}

// ============================================================
// 3) Get All Bills API   →  GET /bills
// ============================================================
export interface BillListItem {
  billingId: string;
  billNumber: string;
  tableId: string;
  sessionId?: string;
  orderId: string | null;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  serviceCharge: string;
  timeChargeAmount: string | null;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  paidAt: string | null;
  mobileNumber: string;
  notes: string | null;
  createdAt: string;
  totalDiscount?: string;
  discounts?: {
    discountId: string;
    discountName: string;
    discountType: "AMOUNT" | "PERCENTAGE";
    discountValue: string;
    discountAmount: string;
    sequence: number;
  }[];
  session: BillSession;
  order: BillOrder | null;
}

export interface GetAllBillsResponse {
  status: boolean;
  message: string;
  data: BillListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const STATUS_STYLES: Record<PaymentStatus, string> = {
  PAID: "bg-status-completed text-status-completed-foreground",
  UNPAID: "bg-status-pending text-status-pending-foreground",
  PARTIAL: "bg-status-accepted text-status-accepted-foreground",
  REFUNDED: "bg-status-cancelled text-status-cancelled-foreground",
};

export const PAYMENT_ICONS: Record<PaymentMethod, typeof Banknote> = {
  CASH: Banknote,
  CARD: CreditCard,
  UPI: Smartphone,
  "CASH_ONLINE": IndianRupee,
  OTHER: CircleDollarSign,
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH: "Cash",
  CARD: "Card",
  UPI: "UPI",
  CASH_ONLINE: "Cash + Online", // 👈 UI label
  OTHER: "Other",
};
