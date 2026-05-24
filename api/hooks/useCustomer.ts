import { useQuery } from "@tanstack/react-query";
import {
  fetchAllCategoriesCustomer,
  fetchAllMenusCustomer,
  fetchTableByToken,
  fetchTableByTokenCustomer,
} from "../services/customer.service";
import { Category } from "@/types/types";

export const useFetchMenusCustomer = () => {
  return useQuery({
    queryKey: ["menus"],
    queryFn: fetchAllMenusCustomer,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useFetchCategoriesCustomer = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchAllCategoriesCustomer,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useFetchTableByToken = (token: any) => {
  return useQuery({
    queryKey: ["table", token],
    queryFn: () => fetchTableByToken(token),
    enabled: !!token,
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
