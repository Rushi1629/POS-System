import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubmenu,
  deleteSubmenuById,
  editSubmenuById,
  fetchAllSubmenuItems,
} from "../services/submenu.service";

export const useCreateSubmenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubmenu,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["submenus"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useFetchSubMenus = () => {
  return useQuery({
    queryKey: ["submenus"],
    queryFn: fetchAllSubmenuItems,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useUpdateSubMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      editSubmenuById(id, data),

    onSuccess: () => {
      // 🔥 refresh submenus
      queryClient.invalidateQueries({ queryKey: ["submenus"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useDeleteSubMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubmenuById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["submenus"],
      });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};
