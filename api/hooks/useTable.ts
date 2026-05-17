import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTable,
  deleteTableById,
  editTableById,
  editTableSession,
  fetchAllTables,
} from "../services/table.service";
import { FetchTableResponse } from "@/types/table-types";

export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};

export const useFetchTables = () => {
  return useQuery<FetchTableResponse[]>({
    queryKey: ["tables"],
    queryFn: fetchAllTables,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTableById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};

export const useEditTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<FetchTableResponse>;
    }) => editTableById(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};


export const useEditTableSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTableSession,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};
