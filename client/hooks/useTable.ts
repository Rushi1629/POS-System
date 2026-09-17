import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTable,
  deleteTableById,
  editTableById,
  editTableSession,
  fetchAllTables,
  fetchTableByToken,
  getTableLiveCharge,
} from "../services/table.service";
import { EditTablePayload } from "@/types/table-types";
import { toast } from "sonner";

export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err) => {
      toast.error("Failed to create table. Please try again.");
    },
  });
};

export const useFetchTables = (
  page: number,
  limit: number,
  filters?: { status?: string; type?: string; tableStatus?: string },
) => {
  return useQuery({
    queryKey: [
      "tables",
      page,
      limit,
      filters?.status,
      filters?.type,
      filters?.tableStatus,
    ],
    queryFn: () =>
      fetchAllTables({
        page,
        limit,
        status: filters?.status,
        type: filters?.type,
        tableStatus: filters?.tableStatus,
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTableById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
    onError: (err) => {
      toast.error("Failed to delete table. Please try again.");
    },
  });
};

export const useEditTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditTablePayload }) =>
      editTableById(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err) => {
      toast.error("Failed to update table. Please try again.");
    },
  });
};

export const useEditTableSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTableSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err) => {
      toast.error("Failed to update table session. Please try again.");
    },
  });
};

export const useFetchLiveCharge = (id?: string) => {
  return useQuery({
    queryKey: ["liveCharge", id],
    queryFn: async () => {
      toast.info("🔄 Fetching live charge for table:");
      const res = await getTableLiveCharge(id as string);
      return res ?? { totalMinutes: 0, currentCharge: 0 };
    },
    enabled: !!id,
    refetchInterval: 60000,
    staleTime: 4000,
    refetchOnWindowFocus: true,
    retry: 1,
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
