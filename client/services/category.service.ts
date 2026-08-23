import {
  Category,
  CreateCategoryPayload,
  FetchCategoriesParams,
  FetchCategoriesResponse,
} from "@/types/types";
import { fetcher } from "../client";

export const createCategory = (data: FormData) =>
  fetcher("/category", {
    method: "POST",
    body: data, // ✅ send FormData directly
  });

export const fetchAllCategories = async ({
  page,
  limit,
  search = "",
  status = "all",
}: FetchCategoriesParams): Promise<FetchCategoriesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  if (status !== "all") {
    params.append("status", status);
  }

  const res = await fetcher(`/category?${params.toString()}`);

  return {
    status: res.status,
    message: res.message,

    data: res.data.map(
      (u: any): Category => ({
        id: String(u.id),
        name: u.name,
        description: u.description ?? null,
        isActive: u.isActive,
        imageUrl: u.imageUrl ?? null,
        createdAt: new Date(u.createdAt).getTime(),
      }),
    ),

    pagination: {
      page: res.pagination.page,
      limit: res.pagination.limit,
      total: res.pagination.total,
      totalPages: res.pagination.totalPages,
    },
  };
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
