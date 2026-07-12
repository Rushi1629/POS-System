import { BillListItem } from "@/types/billing-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllBills, payBill } from "../services/billing.service";

export const useFetchAllBills = () => {
  return useQuery<BillListItem[]>({
    queryKey: ["bills"],
    queryFn: fetchAllBills,
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
