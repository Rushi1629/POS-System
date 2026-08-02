import type { menuSchema } from "@/Schema/menuScheme";
import { z } from "zod";

export interface SubMenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string | null;
}

export interface allCategory {
  id: number;
  name: string;
}

export interface FetchMenuResponse {
  id: number;
  name: string;
  price: number;
  menuType: "Veg" | "NonVeg";
  available: boolean;
  description: string;
  imageUrl: string;
  category: allCategory;
  subMenuItems: SubMenuItem[];
}

export interface FetchMenusApiResponse {
  status: boolean;
  message: string;
  data: FetchMenuResponse[];
}

export type MenuFormValues = {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  available: boolean;
  imageFile?: File;
};

export type FormValues = z.infer<typeof menuSchema>;

export type menuDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: any;
  onSave: (formData: FormData) => Promise<void>;
  allCategory: allCategory[];
  loading: boolean; // ✅ add loading prop
};

export type MenuPayload = {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  available: boolean;
  menuType: "Veg" | "NonVeg";
  submenu?: {
    subMenuItemId: number;
  }[];
};
