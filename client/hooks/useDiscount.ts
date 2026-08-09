import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDiscount,
  deleteDiscountById,
  editDiscountById,
  fetchAllDiscounts,
} from "../services/discount.service";
import { CreateDiscountRequest, Discount } from "@/types/discount-types";

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["Discounts"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useFetchDiscounts = () => {
  return useQuery<Discount[]>({
    queryKey: ["Discounts"],
    queryFn: fetchAllDiscounts,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDiscountById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Discounts"],
      });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useEditDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateDiscountRequest>;
    }) => editDiscountById(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Discounts"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};
