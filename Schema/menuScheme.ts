import { z } from "zod";

export const subSchema = z.object({
  subMenuItemId: z.coerce.number().optional(),
  name: z.string().trim().min(1, "Required").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Must be ≥ 0").optional(),
  available: z.boolean().optional(),
  description: z.string().trim().max(300).optional().or(z.literal("")),
});

export const menuSchema = z.object({
  imageFile: z.any().optional(),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  menuType: z.enum(["Veg", "NonVeg"]),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  available: z.boolean(),
  categoryId: z.string().min(1, "Please select a category"),
  submenu: z.array(subSchema).optional(),
});
