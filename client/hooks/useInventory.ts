import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInventory,
  deleteInventory,
  fetchAllInventory,
  updateInventory,
} from "../services/inventory.service";
import {
  CreateInventoryRequest,
  UpdateInventoryRequest,
} from "@/types/inventory-types";

export const useFetchAllInventory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["inventory", page, limit],
    queryFn: () => fetchAllInventory(page, limit),
  });
};

export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryRequest) => createInventory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryRequest }) =>
      updateInventory(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInventory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
    },
  });
};
