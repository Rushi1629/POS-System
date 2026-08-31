import {
  CreateTablePayload,
  EditTableSessionPayload,
  EditTablePayload,
  FetchTableResponse,
  getTableLiveChargeResponse,
  FetchTablesParams,
  FetchTablesResponse,
} from "@/types/table-types";
import { fetcher } from "../client";

export const createTable = (data: CreateTablePayload) =>
  fetcher("/table", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllTables = async ({
  page,
  limit,
  status,
}: FetchTablesParams): Promise<FetchTablesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status && status === "all") {
    params.set("status", status);
  }

  const res = await fetcher(`/table?${params.toString()}`);

  return {
    data: res.data.map((u: any) => ({
      id: u.id,
      name: u.name,
      type: u.type,
      tableStatus: u.tableStatus,
      capacity: Number(u.capacity),
      enableTimeRate: Boolean(u.enableTimeRate),
      ratePerMinute: Number(u.ratePerMinute ?? 0),
      chargePerPerson: Boolean(u.chargePerPerson),
      qrCode: u.qrCode ?? null,
      qrCodeImageUrl: u.qrCodeImageUrl ?? null,
      isActive: Boolean(u.isActive),
      guestCount: Number(u.guestCount ?? 0),
      rushMode: Boolean(u.rushMode),
    })),

    pagination: {
      page: Number(res.pagination?.page ?? page),
      limit: Number(res.pagination?.limit ?? limit),
      total: Number(res.pagination?.total ?? 0),
      totalPages: Number(res.pagination?.totalPages ?? 0),
    },
  };
};

export const editTableById = async (
  id: string,
  data: EditTablePayload,
): Promise<FetchTableResponse> => {
  const res = await fetcher(`/table/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const u = res.data;

  return {
    id: u?.id,
    name: u?.name,
    type: u?.type,
    tableStatus: u?.tableStatus,
    capacity: Number(u?.capacity),
    enableTimeRate: u?.enableTimeRate,
    ratePerMinute: Number(u?.ratePerMinute),
    chargePerPerson: Boolean(u?.chargePerPerson),
    qrCode: u?.qrCode ?? null,
    isActive: u?.isActive,
    guestCount: Number(u?.guestCount ?? 0),
    rushMode: u?.rushMode,
  };
};

export const deleteTableById = async (id: string): Promise<void> => {
  await fetcher(`/table/${id}`, {
    method: "DELETE",
  });
};

export const editTableSession = (data: EditTableSessionPayload) =>
  fetcher("/table/table-session", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getTableLiveCharge = async (
  id: string,
): Promise<getTableLiveChargeResponse> => {
  try {
    const res = await fetcher(`/table/live-charge/${id}`, {
      method: "GET",
    });

    console.log("🔥 API Response for live-charge:", res);

    // Handle different response formats from API
    if (!res) {
      return {
        totalMinutes: 0,
        currentCharge: 0,
      };
    }

    // If response has data property, use it
    if (res.data && typeof res.data === "object") {
      return {
        totalMinutes: res.data.totalMinutes ?? 0,
        currentCharge: res.data.currentCharge ?? 0,
      };
    }

    // If response is the data directly (has totalMinutes/currentCharge)
    if (res.totalMinutes !== undefined || res.currentCharge !== undefined) {
      return {
        totalMinutes: res.totalMinutes ?? 0,
        currentCharge: res.currentCharge ?? 0,
      };
    }

    return {
      totalMinutes: 0,
      currentCharge: 0,
    };
  } catch (error) {
    console.error("❌ Error fetching live charge:", error);
    return {
      totalMinutes: 0,
      currentCharge: 0,
    };
  }
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
    qrCodeImageUrl: u.qrCodeImageUrl ?? null,
    tableToken: u.tableToken,
    isActive: u.isActive,
  };
};
