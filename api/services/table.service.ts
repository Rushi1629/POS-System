import {
  CreateTablePayload,
  EditTableSessionPayload,
  EditTablePayload,
  FetchTableResponse,
  getTableLiveChargeResponse,
} from "@/types/table-types";
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
    tableStatus: u.tableStatus,
    capacity: Number(u.capacity),
    enableTimeRate: u.enableTimeRate,
    ratePerMinute: Number(u.ratePerMinute),
    chargePerPerson: Boolean(u.chargePerPerson),
    qrCode: u.qrCode ?? null,
    isActive: u.isActive,
    guestCount: Number(u.guestCount ?? 0),
  }));
};

export const editTableById = async (
  id: number,
  data: EditTablePayload,
): Promise<FetchTableResponse> => {
  const res = await fetcher(`/table/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const u = res.data;

  return {
    id: u.id,
    name: u.name,
    type: u.type,
    tableStatus: u.tableStatus,
    capacity: Number(u.capacity),
    enableTimeRate: u.enableTimeRate,
    ratePerMinute: Number(u.ratePerMinute),
    chargePerPerson: Boolean(u.chargePerPerson),
    qrCode: u.qrCode ?? null,
    isActive: u.isActive,
    guestCount: Number(u.guestCount ?? 0),
  };
};

export const deleteTableById = async (id: number): Promise<void> => {
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
  id: number,
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
    if (res.data && typeof res.data === 'object') {
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

