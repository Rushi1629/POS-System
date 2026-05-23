import { useQuery } from "@tanstack/react-query";
import {
  fetchAllCategoriesCustomer,
  fetchAllMenusCustomer,
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
