import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../services/order.service";

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
