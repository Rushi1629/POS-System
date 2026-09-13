import {
  GetAllBillsResponse,
  PaymentStatus,
} from "@/types/billing-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllBills,
  generateBill,
  payBill,
} from "../services/billing.service";

export const useFetchAllBills = (
  page = 1,
  limit = 10,
  status?: "ALL" | PaymentStatus,
) => {
  return useQuery<GetAllBillsResponse>({
    queryKey: ["bills", page, limit, status],
    queryFn: () => fetchAllBills(page, limit, status),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const usePayBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useGenerateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};
