import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, fetchAllOrders, fetchAllOrdersTableWise, updateOrderItemStatus, updateOrderStatus } from "../services/order.service";
import { FetchTableWiseOrdersParams, GetOrdersResponseAdminChef } from "@/types/order-types";
import { toast } from "sonner";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
    },
    onError: (err) => {
      toast.error("Failed to create order. Please try again.");
    },
  });
};

export const useFetchActiveOrders = () => {
  return useQuery({
    queryKey: ["active-orders"],
    queryFn: fetchAllOrders,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useFetchOrdersTableWise = (
  page = 1,
  limit = 20,
  search = "",
  filters?: { status?: string; orderType?: string; latestOrder?: boolean },
) => {
  const params: FetchTableWiseOrdersParams = {
    page,
    limit,
    search,
    status: filters?.status,
    orderType: filters?.orderType,
    latestOrder: filters?.latestOrder,
  };

  return useQuery<GetOrdersResponseAdminChef>({
    queryKey: [
      "orders-table-wise",
      params.page,
      params.limit,
      params.search,
      params.status,
      params.orderType,
      params.latestOrder,
    ],
    queryFn: () => fetchAllOrdersTableWise(params),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useUpdateItemOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderItemStatus,

    onSuccess: () => {
      // 🔥 Refetch orders after update
      queryClient.invalidateQueries({ queryKey: ["orders-table-wise"] });
    },

    onError: (error) => {
      toast.error("Failed to update order item status. Please try again.");
    },
  });
};
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,

    onSuccess: () => {
      // 🔥 Refetch orders after update
      queryClient.invalidateQueries({ queryKey: ["orders-table-wise"] });
    },

    onError: (error) => {
      toast.error("Failed to update order status. Please try again.");
    },
  });
};
