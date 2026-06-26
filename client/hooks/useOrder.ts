import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, fetchAllOrders, fetchAllOrdersTableWise, updateOrderStatus } from "../services/order.service";

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

export const useFetchOrdersTableWise = () => {
  return useQuery({
    queryKey: ["orders-table-wise"],
    queryFn: fetchAllOrdersTableWise,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
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
