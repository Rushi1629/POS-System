import { CreateOrderRequest } from "@/types/order-types";
import { fetcher } from "../client";

export const createOrder = (data: CreateOrderRequest) =>
  fetcher("/order", {
    method: "POST",
    body: JSON.stringify(data),
  });
