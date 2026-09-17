import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDiscount,
  deleteDiscountById,
  editDiscountById,
  fetchAllDiscounts,
} from "../services/discount.service";
import {
  CreateDiscountRequest,
  DiscountStatus,
  GetAllDiscountsResponse,
} from "@/types/discount-types";
import { toast } from "sonner";

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Discounts"] });
    },
    onError: (err) => {
      toast.error("Failed to create discount. Please try again.");
    },
  });
};

export const useFetchDiscounts = (
  page = 1,
  limit = 20,
  search = "",
  status?: DiscountStatus,
) => {
  return useQuery<GetAllDiscountsResponse>({
    queryKey: ["Discounts", page, limit, search, status],
    queryFn: () => fetchAllDiscounts({ page, limit, search, status }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 0,
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDiscountById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Discounts"],
      });
    },
    onError: (err) => {
      toast.error("Failed to delete discount. Please try again.");
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
      id: string;
      data: Partial<CreateDiscountRequest>;
    }) => editDiscountById(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Discounts"] });
    },
    onError: (err) => {
      toast.error("Failed to edit discount. Please try again.");
    },
  });
};
