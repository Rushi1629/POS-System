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
  status,
}: FetchCategoriesParams): Promise<FetchCategoriesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  if (status) {
    params.set("status", status);
  }

  const res = await fetcher(`/category?${params.toString()}`);

  console.log("🔥 CATEGORY RAW RESPONSE:", res);
  console.log("🔥 CATEGORY DATA:", res?.data);
  console.log("🔥 CATEGORY PAGINATION:", res?.pagination);

  return {
    status: res.status,
    message: res.message,

    data: (res.data ?? []).map(
      (u: any): Category => ({
        id: String(u.id),
        name: u.name,
        description: u.description ?? null,
        isActive: u.isActive,
        imageUrl: u.imageUrl ?? null,
        createdAt: new Date(u.createdAt).getTime(),
      }),
    ),

    pagination: res.pagination
      ? {
          page: res.pagination.page,
          limit: res.pagination.limit,
          total: res.pagination.total,
          totalPages: res.pagination.totalPages,
        }
      : {
          page,
          limit,
          total: res.data?.length ?? 0,
          totalPages: 1,
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
