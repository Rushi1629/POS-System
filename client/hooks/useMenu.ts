import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMenu,
  deleteMenuById,
  editMenuById,
  fetchAllMenus,
} from "../services/menu.service";
import { toast } from "sonner";

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (err) => {
      toast.error("Failed to create menu. Please try again.");
    },
  });
};

export const useFetchMenus = (
  page: number,
  limit: number,
  search: string = "",
  status?: string,
  categoryId?: string,
) => {
  return useQuery({
    queryKey: ["menus", page, limit, search, status, categoryId],

    queryFn: () =>
      fetchAllMenus({
        page,
        limit,
        search,
        status,
        categoryId,
      }),

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
    onError: (err) => {
      toast.error("Failed to update menu. Please try again.");
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
    onError: (err) => {
      toast.error("Failed to delete menu. Please try again.");
    },
  });
};
