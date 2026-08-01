import { FetchSubmenuItem, FetchSubmenuResponse } from "@/types/submenu-types";
import { fetcher } from "../client";

export const createSubmenu = (data: any) =>
  fetcher("/submenu", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllSubmenuItems = async (): Promise<FetchSubmenuItem[]> => {
  const res: FetchSubmenuResponse = await fetcher("/submenu");

  return res.data.map((u) => ({
    id: u.id,
    name: u.name,
    price: u.price,
    available: u.available,
    description: u.description,
    imageUrl: u.imageUrl || "",
  }));
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
