import { z } from "zod";


export const baseSchema = {
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only"),
  email: z.string().trim().email("Invalid email").max(255),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  role: z.enum(["Super Admin", "Admin", "Chef", "Waiter", "Customer"]),
  isActive: z.boolean(),
};

export const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export const editSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .max(72)
    .optional()
    .refine(
      (v) => !v || v.length >= 6,
      "Password must be at least 6 characters",
    ),
});