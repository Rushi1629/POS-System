import {
  CreateDiscountRequest,
  FetchDiscountsParams,
  GetAllDiscountsResponse,
} from "@/types/discount-types";
import { fetcher } from "../client";

export const createDiscount = (data: CreateDiscountRequest) =>
  fetcher("/discount", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllDiscounts = async ({
  page,
  limit,
  search = "",
  status,
}: FetchDiscountsParams): Promise<GetAllDiscountsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  if (status) {
    params.set("status", status);
  }

  const res: GetAllDiscountsResponse = await fetcher(
    `/discount?${params.toString()}`,
  );

  return {
    ...res,
    data: (res.data ?? []).map((u) => ({
      id: String(u.id),
      name: u.name,
      description: u.description,
      type: u.type,
      value: u.value,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    })),
    pagination: res.pagination ?? {
      page,
      limit,
      total: res.data?.length ?? 0,
      totalPages: 1,
    },
  };
};

export const editDiscountById = async (
  id: string,
  data: Partial<CreateDiscountRequest>,
): Promise<CreateDiscountRequest> => {
  const res = await fetcher(`/discount/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return res.data;
};

export const deleteDiscountById = async (id: string): Promise<void> => {
  await fetcher(`/discount/${id}`, {
    method: "DELETE",
  });
};
