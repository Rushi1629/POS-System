import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getApplicationLogs } from "../services/logs.service";
import { LogFilters } from "@/types/logs-types";

export const useApplicationLogs = (filters: LogFilters) => {
  return useQuery({
    queryKey: ["application-logs", filters],
    queryFn: () => getApplicationLogs(filters),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};