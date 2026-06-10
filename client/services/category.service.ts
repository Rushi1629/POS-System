import {
  Category,
  CreateCategoryPayload,
  FetchCategoriesResponse,
} from "@/types/types";
import { fetcher } from "../client";

export const createCategory = (data: FormData) =>
  fetcher("/category", {
    method: "POST",
    body: data, // ✅ send FormData directly
  });

export const fetchAllCategories = async (): Promise<
  FetchCategoriesResponse[]
> => {
  const res = await fetcher("/category");

  return res.data.map((u: any) => ({
    id: String(u.id),
    name: u.name,
    description: u.description,
    isActive: u.isActive,
    imageUrl: u.imageUrl || "", // ✅ FIX
    createdAt: new Date(u.createdAt).getTime(), // ✅ FIX (important)
  }));
};

export const editCategoryById = async (
  id: string,
  data: FormData,
): Promise<Category> => {
  const res = await fetcher(`/category/${id}`, {
    method: "PATCH",
    body: data, // ✅ FormData
  });

  return res.data;
};

export const deleteCategoryById = async (id: string): Promise<void> => {
  await fetcher(`/category/${id}`, {
    method: "DELETE",
  });
};
