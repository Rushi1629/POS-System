import { CreateTablePayload, FetchTableResponse } from "@/types/table-types";
import { fetcher } from "../client";

export const createTable = (data: CreateTablePayload) =>
  fetcher("/table", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllTables = async (): Promise<FetchTableResponse[]> => {
  const res = await fetcher("/table");

  return res.data.map((u: any) => ({
    id: u.id,
    name: u.name,
    type: u.type,
    status: u.status,
    capacity: Number(u.capacity),
    enableTimeRate: u.enableTimeRate,
    ratePerMinute: u.ratePerMinute,
    qrCode: u.qrCode ?? null,
    isActive: u.isActive,
  }));
};

export const editTableById = async (
  id: number,
  data: Partial<FetchTableResponse>,
): Promise<FetchTableResponse> => {
  const res = await fetcher(`/table/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return res.data;
};

export const deleteTableById = async (id: number): Promise<void> => {
  await fetcher(`/table/${id}`, {
    method: "DELETE",
  });
};
