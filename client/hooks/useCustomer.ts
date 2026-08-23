import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  editTableSessionCustomer,
  fetchAllCategoriesCustomer,
  fetchAllMenusCustomer,
  fetchTableByTokenCustomer,
} from "../services/customer.service";
import { Category, CustomerCategoryParams } from "@/types/types";

export const useFetchMenusCustomer = () => {
  return useQuery({
    queryKey: ["menus"],
    queryFn: fetchAllMenusCustomer,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useFetchCategoriesCustomer = (params?: CustomerCategoryParams) => {
  return useQuery<Category[]>({
    queryKey: ["customer-categories", params],
    queryFn: () => fetchAllCategoriesCustomer(params),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};
export const useFetchTableByTokenCustomer = (token: any) => {
  return useQuery({
    queryKey: ["table", token],
    queryFn: () => fetchTableByTokenCustomer(token),
    enabled: !!token,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useEditTableSessionCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTableSessionCustomer,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};
