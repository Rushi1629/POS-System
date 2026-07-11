// ============================================================
// Billing API TypeScript Interfaces
// One interface set per API endpoint (Generate / Pay / Get All)
// ============================================================

import { Banknote, CircleDollarSign, CreditCard, Smartphone, Wallet } from "lucide-react";

export type PaymentStatus = "PAID" | "UNPAID" | "PARTIAL" | "REFUNDED";
export type PaymentMethod = "CASH" | "CARD" | "UPI" | "WALLET" | "OTHER";
export type TableType = "FAMILY" | "COUPLE" | "HALL" | "OUTDOOR" | "PRIVATE";

// ---------- Shared sub-shapes ----------
export interface BillSession {
  id: number;
  tableId: number;
  tableName: string;
  tableType: TableType;
  guestCount: number;
  startedAt: string;
  endedAt?: string | null;
}

export interface BillSubMenuItem {
  id: number;
  subMenuItemId: number;
  subMenuItemName: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
  notes: string;
}

export interface BillOrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
  notes: string;
  subMenuItems: BillSubMenuItem[];
}

export interface BillOrder {
  id: number;
  orderNumber: string;
  items: BillOrderItem[];
}

// ============================================================
// 1) Generate Bill API   →  POST /bills/generate
// ============================================================
export interface GenerateBillRequest {
  orderId: number;
  mobileNumber: string;
  notes: string;
}

export interface GenerateBillData {
  id: number;
  billNumber: string;
  sessionId: number;
  orderId: number;
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
  session: BillSession;
  order: BillOrder;
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
  billingId: number;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface PayBillData {
  id: number;
  billNumber: string;
  sessionId: number;
  orderId: number;
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
    id: number;
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
  id: number;
  billNumber: string;
  sessionId: number;
  orderId: number | null;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  serviceCharge: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  paidAt: string | null;
  mobileNumber: string;
  notes: string | null;
  createdAt: string;
  session: BillSession;
  order: BillOrder | null;
}

export interface GetAllBillsResponse {
  status: boolean;
  message: string;
  data: BillListItem[];
}

export const MOCK_BILLS: BillListItem[] = [
  {
    id: 1,
    billNumber: "BILL-20260623-0001",
    sessionId: 1,
    orderId: null,
    subtotal: "505.5",
    taxAmount: "0",
    discountAmount: "0",
    serviceCharge: "0",
    totalAmount: "505.5",
    paymentStatus: "PAID",
    paymentMethod: "CASH",
    paidAt: "2026-06-23T11:49:15.947Z",
    mobileNumber: "9167939647",
    notes: null,
    createdAt: "2026-06-23T11:43:32.667Z",
    session: {
      id: 1,
      tableId: 1,
      tableName: "F-1",
      tableType: "FAMILY",
      guestCount: 4,
      startedAt: "2026-06-20T05:23:04.474Z",
      endedAt: "2026-06-20T06:34:22.764Z",
    },
    order: null,
  },
  {
    id: 2,
    billNumber: "BILL-20260710-0001",
    sessionId: 1,
    orderId: 6,
    subtotal: "371.75",
    taxAmount: "0",
    discountAmount: "0",
    serviceCharge: "0",
    totalAmount: "371.75",
    paymentStatus: "UNPAID",
    paymentMethod: null,
    paidAt: null,
    mobileNumber: "9167939647",
    notes: "n/a",
    createdAt: "2026-07-10T11:53:14.802Z",
    session: {
      id: 1,
      tableId: 1,
      tableName: "F-1",
      tableType: "FAMILY",
      guestCount: 4,
      startedAt: "2026-06-20T05:23:04.474Z",
    },
    order: {
      id: 6,
      orderNumber: "ORD-1783678167174",
      items: [
        {
          id: 14,
          menuItemId: 2,
          menuItemName: "Veg Cheese Pizza",
          unitPrice: "119",
          quantity: 2,
          totalPrice: "238",
          notes: "Extra Cheese",
          subMenuItems: [
            {
              id: 12,
              subMenuItemId: 1,
              subMenuItemName: "Extra Cheese",
              unitPrice: "4.5",
              quantity: 1,
              totalPrice: "4.5",
              notes: "n/a",
            },
          ],
        },
        {
          id: 15,
          menuItemId: 1,
          menuItemName: "Veg Cheese Burger",
          unitPrice: "129.25",
          quantity: 1,
          totalPrice: "129.25",
          notes: "Extra Cheese",
          subMenuItems: [
            {
              id: 13,
              subMenuItemId: 1,
              subMenuItemName: "Extra Cheese",
              unitPrice: "0",
              quantity: 1,
              totalPrice: "0",
              notes: "n/a",
            },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    billNumber: "BILL-20260711-0002",
    sessionId: 2,
    orderId: 7,
    subtotal: "820.00",
    taxAmount: "41",
    discountAmount: "20",
    serviceCharge: "15",
    totalAmount: "856.00",
    paymentStatus: "PAID",
    paymentMethod: "UPI",
    paidAt: "2026-07-11T13:12:00.000Z",
    mobileNumber: "9820011223",
    notes: null,
    createdAt: "2026-07-11T12:58:00.000Z",
    session: {
      id: 2,
      tableId: 3,
      tableName: "H-3",
      tableType: "HALL",
      guestCount: 6,
      startedAt: "2026-07-11T12:00:00.000Z",
      endedAt: "2026-07-11T13:10:00.000Z",
    },
    order: {
      id: 7,
      orderNumber: "ORD-1783678999001",
      items: [],
    },
  },
];

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
  WALLET: Wallet,
  OTHER: CircleDollarSign,
};

// ---- mock API endpoints ----
export async function apiGenerateBill(req: {
  orderId: number;
  mobileNumber: string;
  notes: string;
}): Promise<GenerateBillData> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    id: Math.floor(Math.random() * 1000),
    billNumber: `BILL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-000X`,
    sessionId: 1,
    orderId: req.orderId,
    subtotal: "371.75",
    taxAmount: "0",
    discountAmount: "0",
    serviceCharge: "0",
    totalAmount: "371.75",
    paymentStatus: "UNPAID",
    paymentMethod: null,
    paidAt: null,
    mobileNumber: req.mobileNumber,
    notes: req.notes,
    createdAt: new Date().toISOString(),
    session: {
      id: 1,
      tableId: 1,
      tableName: "F-1",
      tableType: "FAMILY",
      guestCount: 4,
      startedAt: new Date().toISOString(),
    },
    order: { id: req.orderId, orderNumber: `ORD-${Date.now()}`, items: [] },
  };
}

export async function apiPayBill(req: {
  billingId: number;
  paymentMethod: PayBillData["paymentMethod"];
  notes: string;
}): Promise<PayBillData> {
  await new Promise((r) => setTimeout(r, 400));
  const source = MOCK_BILLS.find((b) => b.id === req.billingId);
  return {
    id: req.billingId,
    billNumber: source?.billNumber ?? "BILL-XXXX",
    sessionId: source?.sessionId ?? 1,
    orderId: source?.orderId ?? 0,
    subtotal: source?.subtotal ?? "0",
    taxAmount: source?.taxAmount ?? "0",
    discountAmount: source?.discountAmount ?? "0",
    serviceCharge: source?.serviceCharge ?? "0",
    totalAmount: source?.totalAmount ?? "0",
    paymentStatus: "PAID",
    paymentMethod: req.paymentMethod,
    paidAt: new Date().toISOString(),
    mobileNumber: source?.mobileNumber ?? "",
    notes: req.notes,
    createdAt: source?.createdAt ?? new Date().toISOString(),
    session: source?.session ?? {
      id: 1,
      tableId: 1,
      tableName: "F-1",
      tableType: "FAMILY",
      guestCount: 4,
      startedAt: new Date().toISOString(),
    },
    order: {
      id: source?.orderId ?? 0,
      orderNumber: source?.order?.orderNumber ?? "ORD-XXXX",
      items: source?.order?.items ?? [],
    },
  };
}
