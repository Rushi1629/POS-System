import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, fetchAllOrders, fetchAllOrdersTableWise } from "../services/order.service";

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

export const useFetchOrders = () => {
  return useQuery({
    queryKey: ["orders"],
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
