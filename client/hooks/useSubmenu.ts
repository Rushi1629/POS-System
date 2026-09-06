import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubmenu,
  deleteSubmenuById,
  editSubmenuById,
  fetchAllSubmenuItems,
} from "../services/submenu.service";
import {
  FetchSubmenuParams,
  FetchSubmenuResponse,
} from "@/types/submenu-types";

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

export const useFetchSubMenus = (
  page = 1,
  limit = 10,
  search = "",
  status?: string,
) => {
  const params: FetchSubmenuParams = { page, limit, search, status };

  return useQuery<FetchSubmenuResponse>({
    queryKey: ["submenus", params],
    queryFn: () => fetchAllSubmenuItems(params),
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
