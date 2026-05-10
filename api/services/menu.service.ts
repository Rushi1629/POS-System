import { FetchMenuResponse, FetchMenusApiResponse } from "@/types/menu-types";
import { fetcher } from "../client";

export const createMenu = (data: FormData) =>
  fetcher("/menu", {
    method: "POST",
    body: data,
  });

export const fetchAllMenus = async (): Promise<FetchMenuResponse[]> => {
  const res: FetchMenusApiResponse = await fetcher("/menu");

  return res.data.map((u) => ({
    id: u.id,
    name: u.name,
    price:  Number(u.price),
    menuType: u.menuType,
    available: u.available,
    description: u.description,
    imageUrl: u.imageUrl || "",
    category: u.category,
    subMenuItems: u.subMenuItems || [],
  }));
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

