import { FetchMenuResponse, FetchMenusApiResponse, FetchMenusParams, FetchMenusResponse } from "@/types/menu-types";
import { fetcher } from "../client";

export const createMenu = (data: FormData) =>
  fetcher("/menu", {
    method: "POST",
    body: data,
  });

export const fetchAllMenus = async ({
  page,
  limit,
  search = "",
  status,
}: FetchMenusParams): Promise<FetchMenusResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  // Only send status when provided
  if (status) {
    params.set("status", status);
  }

  const res: FetchMenusApiResponse = await fetcher(
    `/menu?${params.toString()}`,
  );

  return {
    data: res.data.map((u) => ({
      id: u.id,
      name: u.name,
      price: Number(u.price),
      menuType: u.menuType,
      available: u.available,
      description: u.description,
      imageUrl: u.imageUrl || "",
      category: u.category,
      subMenuItems: u.subMenuItems || [],
    })),

    pagination: {
      page: Number(res.pagination?.page ?? page),
      limit: Number(res.pagination?.limit ?? limit),
      total: Number(res.pagination?.total ?? 0),
      totalPages: Number(res.pagination?.totalPages ?? 0),
    },
  };
};

export const editMenuById = async (
  id: string,
  data: FormData,
): Promise<FetchMenuResponse> => {
  const res = await fetcher(`/menu/${id}`, {
    method: "PATCH",
    body: data, // ✅ FormData
  });

  return res.data;
};

export const deleteMenuById = async (id: string): Promise<void> => {
  await fetcher(`/menu/${id}`, {
    method: "DELETE",
  });
};
