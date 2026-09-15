import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInventory,
  deleteInventory,
  fetchAllInventory,
  updateInventory,
} from "../services/inventory.service";
import {
  CreateInventoryRequest,
  InventoryStatusFilter,
  UpdateInventoryRequest,
} from "@/types/inventory-types";
import { toast } from "sonner";

export const useFetchAllInventory = (
  page = 1,
  limit = 10,
  status?: InventoryStatusFilter,
) => {
  return useQuery({
    queryKey: ["inventory", page, limit, status],
    queryFn: () => fetchAllInventory(page, limit, status),
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
    onError: (err) => {
      toast.error("Failed to create inventory. Please try again.");
    }
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
    onError: (err) => {
      toast.error("Failed to update inventory. Please try again.");
    }
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
    onError: (err) => {
      toast.error("Failed to delete inventory. Please try again.");
    }
  });
};
