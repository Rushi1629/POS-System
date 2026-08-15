import { z } from "zod";

export const inventorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(30, "SKU is too long")
    .regex(/^[A-Za-z0-9-_]+$/, "Use letters, numbers, - or _ only"),
  unit: z.string().min(1, "Select a unit"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  lowStockThreshold: z.coerce.number().min(0, "Threshold cannot be negative"),
  isActive: z.boolean(),
});

export type InventoryFormValues = z.input<typeof inventorySchema>;
