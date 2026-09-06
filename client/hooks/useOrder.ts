import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, fetchAllOrders, fetchAllOrdersTableWise, updateOrderItemStatus, updateOrderStatus } from "../services/order.service";
import { FetchTableWiseOrdersParams, GetOrdersResponseAdminChef } from "@/types/order-types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
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
) => {
  const params: FetchTableWiseOrdersParams = { page, limit, search };

  return useQuery<GetOrdersResponseAdminChef>({
    queryKey: ["orders-table-wise", params],
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
      console.error("Update failed", error.message);
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
      console.error("Update failed", error);
    },
  });
};
