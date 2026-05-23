import { FetchMenuResponse, FetchMenusApiResponse } from "@/types/menu-types";
import { fetcher } from "../client";
import { FetchCategoriesResponse } from "@/types/types";

export const fetchAllMenusCustomer = async (): Promise<FetchMenuResponse[]> => {
  const res: FetchMenusApiResponse = await fetcher("/customer/menu");

  return res.data.map((u) => ({
    id: u.id,
    name: u.name,
    price: Number(u.price),
    menuType: u.menuType,
    available: u.available,
    description: u.description,
    imageUrl: u.imageUrl || "",
    category: u.category,
    subMenuItems: u.subMenuItems || [],
  }));
};

export const fetchAllCategoriesCustomer = async (): Promise<
  FetchCategoriesResponse[]
> => {
  const res = await fetcher("/customer/categories");

  return res.data.map((u: any) => ({
    id: String(u.id),
    name: u.name,
    description: u.description,
    isActive: u.isActive,
    imageUrl: u.imageUrl || "", // ✅ FIX
    createdAt: new Date(u.createdAt).getTime(), // ✅ FIX (important)
  }));
};
