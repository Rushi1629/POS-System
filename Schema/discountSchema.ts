import { z } from "zod";

export const discountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name is too long"),
  description: z.string().max(200, "Keep the description under 200 characters"),
  type: z.enum(["AMOUNT", "PERCENTAGE"]),
  value: z.coerce.number().positive("Value must be greater than 0"),
  isActive: z.boolean(),
});

export type DiscountFormValues = z.input<typeof discountSchema>;