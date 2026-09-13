import {
  BillListItem,
  GenerateBillData,
  GenerateBillRequest,
  GetAllBillsResponse,
  PayBillRequest,
  PaymentStatus,
} from "@/types/billing-types";
import { fetcher } from "../client";

export const fetchAllBills = async (
  page: number,
  limit: number,
  status?: "ALL" | PaymentStatus,
): Promise<GetAllBillsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const normalizedStatus =
    status && typeof status === "string" ? status.toUpperCase() : status;

  if (normalizedStatus && normalizedStatus !== "ALL") {
    params.set("status", normalizedStatus);
  }

  const res: GetAllBillsResponse = await fetcher(
    `/billing?${params.toString()}`,
  );

  return {
    ...res,
    data: (res.data ?? []).map((bill) => ({
      ...bill,
      billingId: String(bill.billingId),
      tableId: String(bill.tableId),
      sessionId: bill.sessionId ? String(bill.sessionId) : undefined,
      orderId: bill.orderId ? String(bill.orderId) : null,
      session: bill.session
        ? {
            ...bill.session,
            id: bill.session.id ? String(bill.session.id) : undefined,
            tableId: String(bill.session.tableId),
          }
        : bill.session,
      order: bill.order
        ? {
            ...bill.order,
            id: bill.order.id ? String(bill.order.id) : undefined,
            orderId: bill.order.orderId
              ? String(bill.order.orderId)
              : undefined,
            items: bill.order.items.map((item) => ({
              ...item,
              id: item.id ? String(item.id) : undefined,
              orderItemId: item.orderItemId
                ? String(item.orderItemId)
                : undefined,
              menuItemId: item.menuItemId
                ? String(item.menuItemId)
                : undefined,
              subMenuItems: item.subMenuItems.map((subItem) => ({
                ...subItem,
                id: subItem.id ? String(subItem.id) : undefined,
                subMenuItemId: subItem.subMenuItemId
                  ? String(subItem.subMenuItemId)
                  : undefined,
              })),
            })),
          }
        : null,
    })),
    pagination: res.pagination ?? {
      page,
      limit,
      total: res.data?.length ?? 0,
      totalPages: 1,
    },
  };
};

export const payBill = async (data: PayBillRequest) => {
  const res = await fetcher("/billing/pay", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.data;
};

export const generateBill = async (
  data: GenerateBillRequest,
): Promise<GenerateBillData> => {
  const res = await fetcher("/billing/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.data as GenerateBillData;
};
