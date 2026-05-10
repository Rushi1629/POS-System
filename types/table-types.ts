import { tableSchema } from "@/Schema/tableSchema";
import { z } from "zod";

export interface CreateTablePayload {
  name: string;
  type: TableType; // ✅ fixed
  status: TableStatus; // ✅ fixed
  capacity: number;
  enableTimeRate: boolean;
  ratePerMinute: number; // we’ll discuss below
  isActive: boolean;
}

export interface FetchTableResponse {
  id: number;
  name: string;
  type: TableType; // ✅ fixed
  status: TableStatus; // ✅ fixed
  capacity: number;
  enableTimeRate: boolean;
  ratePerMinute: number;
  qrCode: string | null;
  isActive: boolean;
}

export const TABLE_TYPES = ["FAMILY", "POD", "HALL"] as const;
export type TableType = (typeof TABLE_TYPES)[number];

export const TABLE_STATUS = ["AVAILABLE", "OCCUPIED", "RESERVED" , "CLEANING"] as const;
export type TableStatus = (typeof TABLE_STATUS)[number];

export type TableFormValues = z.infer<typeof tableSchema>;

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
