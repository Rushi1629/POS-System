import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMenu,
  deleteMenuById,
  editMenuById,
  fetchAllMenus,
} from "../services/menu.service";
import { FetchMenuResponse } from "@/types/menu-types";

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useFetchMenus = () => {
  return useQuery({
    queryKey: ["menus"],
    queryFn: fetchAllMenus,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      editMenuById(id, formData),

    onSuccess: () => {
      // 🔥 refresh menus
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMenuById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["menus"],
      });
    },
  });
};
