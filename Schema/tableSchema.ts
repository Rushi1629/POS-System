import { TABLE_TYPES, TABLE_STATUS } from "@/types/table-types";
import { z } from "zod";

export const tableSchema = z
  .object({
    name: z.string().trim().min(1, "Table name is required"),

    type: z.enum(TABLE_TYPES, {
      message: "Select valid table type",
    }),

    status: z.enum(TABLE_STATUS, {
      message: "Select valid status",
    }),

    capacity: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Capacity must be at least 1"),
    ),

    enableTimeRate: z.boolean(),

    ratePerMinute: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().min(0, "Rate must be ≥ 0"),
    ),

    isActive: z.boolean(),
  })
  .refine((data) => (data.enableTimeRate ? data.ratePerMinute > 0 : true), {
    message: "Rate must be > 0 when enabled",
    path: ["ratePerMinute"],
  });
