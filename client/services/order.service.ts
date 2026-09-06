import {
  CreateOrderRequest,
  CustomerOrder,
  FetchTableWiseOrdersParams,
  GetOrdersResponseAdminChef,
} from "@/types/order-types";
import { fetcher } from "../client";

export const createOrder = (data: CreateOrderRequest) =>
  fetcher("/order", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllOrders = async (): Promise<CustomerOrder[]> => {
  const res: any = await fetcher("/order");
  console.log("API response:", res);

  const arr: any[] = Array.isArray(res) ? res : (res?.data ?? []);

  return arr.map((u: any) => ({
    orderId: u.id,
    tableId: u.tableId,
    orderNumber: u.orderNumber,
    orderType: u.orderType,
    orderStatus: u.orderStatus,
    paymentStatus: u.paymentStatus,
    subtotal: u.subtotal,
    taxAmount: u.taxAmount,
    discountAmount: u.discountAmount,
    serviceCharge: u.serviceCharge,
    timeChargeAmount: u.timeChargeAmount,
    totalAmount: u.totalAmount,
    notes: u.notes,
    items: u.items,
  }));
};

export const fetchAllOrdersTableWise =
  async ({
    page,
    limit,
    search = "",
  }: FetchTableWiseOrdersParams): Promise<GetOrdersResponseAdminChef> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
    });
    const res: GetOrdersResponseAdminChef = await fetcher(
      `/order/table-orders?${params.toString()}`,
    );

    return {
      ...res,
      pagination: res.pagination ?? {
        page,
        limit,
        total: res.data?.length ?? 0,
        totalPages: 1,
      },
    };
  };

export const updateOrderItemStatus = async ({
  orderItemId,
  status,
}: {
  orderItemId: number;
  status: string;
}) => {
  const res = await fetcher(`/order/order-item-status`, {
    method: "PATCH",
    body: JSON.stringify({
      orderItemId,
      status,
    }),
  });

  return res;
};
export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: number;
  status: string;
}) => {
  const res = await fetcher(`/order/order-status`, {
    method: "PATCH",
    body: JSON.stringify({
      orderId,
      status,
    }),
  });

  return res;
};
