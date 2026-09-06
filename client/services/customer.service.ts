import {
  FetchMenuResponse,
  FetchMenusApiResponse,
  FetchMenusParams,
  FetchMenusResponse,
} from "@/types/menu-types";
import { fetcher } from "../client";
import {
  Category,
  CustomerCategoryParams,
  FetchCategoriesResponse,
} from "@/types/types";
import { EditTableSessionPayload } from "@/types/table-types";

export const fetchAllMenusCustomer = async ({
  page,
  limit,
  search = "",
  status = "all",
}: FetchMenusParams): Promise<FetchMenusResponse> => {
  const params = new URLSearchParams({ search, status });

  if (status !== "all") {
    params.set("page", String(page));
    params.set("limit", String(limit));
  }

  const res: FetchMenusApiResponse = await fetcher(
    `/customer/menu?${params.toString()}`,
  );

  return {
    data: (res.data ?? []).map((u) => ({
      id: String(u.id),
      name: u.name,
      price: Number(u.price),
      menuType: u.menuType,
      available: u.available,
      description: u.description,
      imageUrl: u.imageUrl || "",
      category: u.category
        ? { ...u.category, id: String(u.category.id) }
        : u.category,
      subMenuItems: (u.subMenuItems || []).map((item) => ({
        ...item,
        id: String(item.id),
        price: Number(item.price),
      })),
    })),
    pagination: {
      page: Number(res.pagination?.page ?? page),
      limit: Number(res.pagination?.limit ?? limit),
      total: Number(res.pagination?.total ?? res.data?.length ?? 0),
      totalPages: Number(res.pagination?.totalPages ?? 1),
    },
  };
};

export const fetchAllCategoriesCustomer = async (
  params?: CustomerCategoryParams,
): Promise<Category[]> => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 100;
  const search = params?.search?.trim() ?? "";

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    query.set("search", search);
  }

  const res: FetchCategoriesResponse = await fetcher(
    `/customer/categories?${query.toString()}`,
  );

  return res.data.map((u) => ({
    id: String(u.id),
    name: u.name,
    description: u.description ?? "",
    isActive: Boolean(u.isActive),
    imageUrl: u.imageUrl ?? "",
    createdAt: new Date(u.createdAt).getTime(),
  }));
};

export const fetchTableByTokenCustomer = async (token: any) => {
  const res = await fetcher(`/customer/table/token/${token}`);
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
    qrCodeImageUrl: u.qrCodeImageUrl ?? null,
    tableToken: u.tableToken,
    isActive: u.isActive,
  };
};

export const editTableSessionCustomer = (data: EditTableSessionPayload) =>
  fetcher("/customer/table/table-session", {
    method: "POST",
    body: JSON.stringify(data),
  });
