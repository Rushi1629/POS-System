import { z } from "zod";

export const submenuSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(0),
  available: z.boolean().default(true),
  description: z.string().optional(),
});

// ✅ ADD THIS
export type SubmenuFormValues = z.input<typeof submenuSchema>;