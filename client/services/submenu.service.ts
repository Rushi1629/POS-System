import {
  FetchSubmenuItem,
  FetchSubmenuParams,
  FetchSubmenuResponse,
} from "@/types/submenu-types";
import { fetcher } from "../client";

export const createSubmenu = (data: any) =>
  fetcher("/submenu", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllSubmenuItems = async ({
  page,
  limit,
  search = "",
  status,
}: FetchSubmenuParams): Promise<FetchSubmenuResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  if (status) {
    params.set("status", status);
  }

  const res: FetchSubmenuResponse = await fetcher(
    `/submenu?${params.toString()}`,
  );

  return {
    ...res,
    data: (res.data ?? []).map((u) => ({
    id: String(u.id),
    name: u.name,
    price: u.price,
    available: u.available,
    description: u.description,
    imageUrl: u.imageUrl || "",
    })),
    pagination: res.pagination ?? {
      page,
      limit,
      total: res.data?.length ?? 0,
      totalPages: 1,
    },
  };
};

export const editSubmenuById = async (
  id: string,
  data: any,
): Promise<FetchSubmenuItem> => {
  const res = await fetcher(`/submenu/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return res.data;
};

export const deleteSubmenuById = async (id: string): Promise<void> => {
  await fetcher(`/submenu/${id}`, {
    method: "DELETE",
  });
};
