export interface CreateTablePayload {
  name: string;
  type: TableType;
  capacity: number;
  enableTimeRate: boolean;
  chargePerPerson : boolean;
  ratePerMinute: number;
  isActive: boolean;
}

export interface EditTableSessionPayload {
  tableId: number;
  guestCount: number;
  status: TableStatus;
  notes: string;
}

export interface EditTablePayload {
  name?: string;
  type?: TableType;
  tableStatus?: TableStatus;
  capacity?: number;
  enableTimeRate?: boolean;
  ratePerMinute?: number;
  chargePerPerson?: boolean;
  qrCode?: string | null;
  isActive?: boolean;
  guestCount?: number;
}

export interface getTableLiveChargeResponse {
  totalMinutes: number;
  currentCharge: number;
}
export interface FetchTableResponse {
  id: number;
  name: string;
  type: TableType;
  tableStatus: TableStatus;
  capacity: number;
  enableTimeRate: boolean;
  ratePerMinute: number;
  chargePerPerson: boolean;
  qrCode: string | null;
  isActive: boolean;
  guestCount: number;
  qrCodeImageUrl?: string;
  // startTime?: string;
}

export const TABLE_TYPES = ["FAMILY", "POD", "HALL"] as const;
export const TABLE_STATUS = [
  "AVAILABLE",
  "OCCUPIED",
  "RESERVED",
  "CLEANING",
] as const;

export type TableType = (typeof TABLE_TYPES)[number];
export type TableStatus = (typeof TABLE_STATUS)[number];

export type TableFormValues = {
  name: string;
  type: TableType;
  capacity: number;
  enableTimeRate: boolean;
  ratePerMinute: number;
  chargePerPerson: boolean;
  isActive: boolean;
};

export const statusMap: Record<
  TableStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Available",
    className: "bg-emerald-500/15 text-emerald-600",
  },
  OCCUPIED: {
    label: "Occupied",
    className: "bg-red-500/15 text-red-600",
  },
  RESERVED: {
    label: "Reserved",
    className: "bg-yellow-500/15 text-yellow-600",
  },
  CLEANING: {
    label: "Cleaning",
    className: "bg-blue-500/15 text-blue-600",
  },
};

export const TABLE_TYPE_LABELS: Record<TableType, string> = {
  FAMILY: "Family Table",
  POD: "Private Pod",
  HALL: "Hall Seating",
};
