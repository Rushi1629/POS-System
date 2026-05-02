import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(60, "Name must be under 60 characters"),

 description: z
  .string()
  .trim()
  .min(5, "Description must be at least 5 characters") // ✅ this triggers error
  .max(400, "Description must be under 400 characters"),
  isActive: z.boolean(),

  image: z
  .string()
  .optional()
  .refine((val) => !!val, {
    message: "Image is required",
  }),
  
});