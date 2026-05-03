import { z } from "zod";

export const subSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  price: z.number().min(0, "Must be ≥ 0"),
  available: z.boolean(),
  description: z.string().trim().max(300).optional().or(z.literal("")),
});

export const menuSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  price: z.number().min(0, "Price must be ≥ 0"),
  menuType: z.enum(["Veg", "NonVeg"]),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  available: z.boolean(),
  categoryId: z.number({ message: "Select a category" }),
  submenu: z.array(subSchema),
});