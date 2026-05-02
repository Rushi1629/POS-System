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
    ...u,
    imageUrl: u.image,
  }));
};

export const editCategoryById = async (
  id: string,
  data: FormData
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
