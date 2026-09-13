import {
  CreateInventoryRequest,
  CreateInventoryResponse,
  DeleteInventoryResponse,
  GetAllInventoryResponse,
  InventoryStatusFilter,
  UpdateInventoryRequest,
  UpdateInventoryResponse,
} from "@/types/inventory-types";
import { fetcher } from "../client";

export const fetchAllInventory = async (
  page = 1,
  limit = 10,
  status?: InventoryStatusFilter,
): Promise<GetAllInventoryResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status && status !== "all") {
    params.set("status", status);
  }

  if (status === "all") {
    params.delete("limit");
  }

  return fetcher(`/inventory?${params.toString()}`);
};

export const createInventory = async (
  data: CreateInventoryRequest,
): Promise<CreateInventoryResponse> => {
  return fetcher("/inventory", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateInventory = async (
  id: string,
  data: UpdateInventoryRequest,
): Promise<UpdateInventoryResponse> => {
  return fetcher(`/inventory/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteInventory = async (
  id: string,
): Promise<DeleteInventoryResponse> => {
  return fetcher(`/inventory/${id}`, {
    method: "DELETE",
  });
};