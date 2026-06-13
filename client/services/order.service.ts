import {
  CreateOrderRequest,
  CustomerOrder,
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
  async (): Promise<GetOrdersResponseAdminChef> => {
    const res = await fetcher("/order/table-orders");
    console.log("API response new:", res);

    return res;
  };
