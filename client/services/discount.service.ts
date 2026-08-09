import {
  CreateDiscountRequest,
  Discount,
  GetAllDiscountsResponse,
} from "@/types/discount-types";
import { fetcher } from "../client";

export const createDiscount = (data: CreateDiscountRequest) =>
  fetcher("/discount", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllDiscounts = async (): Promise<Discount[]> => {
  const res: GetAllDiscountsResponse = await fetcher("/discount");

  return res.data.map((u) => ({
    id: u.id,
    name: u.name,
    description: u.description,
    type: u.type,
    value: u.value,
    isActive: u.isActive,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));
};

export const editDiscountById = async (
  id: number,
  data: Partial<CreateDiscountRequest>,
): Promise<CreateDiscountRequest> => {
  const res = await fetcher(`/discount/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return res.data;
};

export const deleteDiscountById = async (id: number): Promise<void> => {
  await fetcher(`/discount/${id}`, {
    method: "DELETE",
  });
};
