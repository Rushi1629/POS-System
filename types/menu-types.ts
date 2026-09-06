import type { menuSchema } from "@/Schema/menuScheme";
import { z } from "zod";

export interface FetchMenusParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface MenuPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FetchMenusApiResponse {
  status: boolean;
  message: string;
  data: FetchMenuResponse[];
  pagination?: MenuPagination;
}

export interface FetchMenusResponse {
  data: FetchMenuResponse[];
  pagination: MenuPagination;
}

export interface SubMenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string | null;
}

export interface allCategory {
  id: string;
  name: string;
}

export interface FetchMenuResponse {
  id: string;
  name: string;
  price: number;
  menuType: "Veg" | "NonVeg";
  available: boolean;
  description: string;
  imageUrl: string;
  category: allCategory;
  subMenuItems: SubMenuItem[];
}

export type MenuFormValues = {
  name: string;
  price: number;
  description?: string;
  categoryId: string;
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
  categoryId: string;
  available: boolean;
  menuType: "Veg" | "NonVeg";
  submenu?: {
    subMenuItemId: string;
  }[];
};
