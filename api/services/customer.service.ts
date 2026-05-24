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

export const fetchTableByToken = async (token: any) => {
  const res = await fetcher(`/table/token/${token}`);
  const u = res.data;

  return {
    id: u.id,
    name: u.name,
    type: u.type,
    tableStatus: u.tableStatus,
    capacity: Number(u.capacity),
    guestCount: Number(u.guestCount ?? 0),
    enableTimeRate: u.enableTimeRate,
    ratePerMinute: Number(u.ratePerMinute),
    chargePerPerson: Boolean(u.chargePerPerson),
    qrCodeImageUrl: u.qrCode ?? null,
    tableToken: u.tableToken,
    isActive: u.isActive,
  };
};
