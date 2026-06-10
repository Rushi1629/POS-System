import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTable,
  deleteTableById,
  editTableById,
  editTableSession,
  fetchAllTables,
  fetchTableByToken,
  getTableLiveCharge,
} from "../services/table.service";
import {
  FetchTableResponse,
  getTableLiveChargeResponse,
  EditTablePayload,
} from "@/types/table-types";

export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      // ✅ Automatically refetch users
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
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
    onError: (err) => {
      console.log("❌ API ERROR", err);
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
      data: EditTablePayload;
    }) => editTableById(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err) => {
      console.log("❌ API ERROR", err);
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
    onError: (err) => {
      console.log("❌ API ERROR", err);
    },
  });
};

export const useFetchLiveCharge = (id?: number) => {
  return useQuery({
    queryKey: ["liveCharge", id],
    queryFn: async () => {
      console.log("🔄 Fetching live charge for table:", id);
      const res = await getTableLiveCharge(id as number);
      console.log("📊 Live charge result:", res);
      return res ?? { totalMinutes: 0, currentCharge: 0 };
    },
    enabled: !!id, // 🔥 Only run when id is available
    refetchInterval: 60000, // ✅ Fetch every 5 seconds for LIVE updates
    staleTime: 4000, // Keep data fresh for 4 seconds before marking stale
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 1, // Retry once on failure
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
