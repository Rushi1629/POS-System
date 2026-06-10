import { CreateOrderRequest, Order } from "@/types/order-types";
import { fetcher } from "../client";

export const createOrder = (data: CreateOrderRequest) =>
  fetcher("/order", {
    method: "POST",
    body: JSON.stringify(data),
  });

  export const fetchAllOrders = async (): Promise<Order[]> => {
  const res: any = await fetcher("/order");
  console.log("API response:", res);

  // support both: [{..},...]  and { data: [{..}, ...] }
  const arr: any[] = Array.isArray(res) ? res : (res?.data ?? []);

  return arr.map((u: any) => ({
    id: u.id,
    tableId: u.tableId,
    orderNumber: u.orderNumber,
    orderType: u.orderType,
    status: u.status,
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
