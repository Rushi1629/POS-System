import { TABLE_TYPES, TABLE_STATUS } from "@/types/table-types";
import { z } from "zod";

export const tableSchema = z
  .object({
    name: z.string().trim().min(1, "Table name is required"),

    type: z.enum(TABLE_TYPES, {
      message: "Select valid table type",
    }),

    // status: z.enum(TABLE_STATUS, {
    //   message: "Select valid status",
    // }),

    capacity: z.number().min(1, "Capacity must be at least 1"),

    enableTimeRate: z.boolean(),

    ratePerMinute: z.number().min(0, "Rate must be ≥ 0"),

    isActive: z.boolean(),

    // guestCount: z.number().min(1, "Guest count must be at least 1"),
  })
  // .refine((data) => data.guestCount <= data.capacity, {
  //   message: "Guest count cannot exceed capacity",
  //   path: ["guestCount"],
  // })
  .refine((data) => (data.enableTimeRate ? data.ratePerMinute > 0 : true), {
    message: "Rate must be > 0 when enabled",
    path: ["ratePerMinute"],
  });

