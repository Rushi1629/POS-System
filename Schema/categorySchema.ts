import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "Name must be at least 5 characters" })
    .max(60, { message: "Name must be under 60 characters" }),

  description: z
    .string()
    .trim()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(400, { message: "Description must be under 400 characters" }),

  isActive: z.boolean(),

  imageFile: z
    .any()
    .optional()
    .refine(
      (file) => !file || file instanceof File, // ✅ allow undefined OR File
      { message: "Invalid file" }
    ),
});
