import { ApplicationLogsResponse, LogFilters } from "@/types/logs-types";
import { fetcher } from "../client";

export const getApplicationLogs = async (
  filters: LogFilters
): Promise<ApplicationLogsResponse> => {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.requestId) {
    params.set("requestId", filters.requestId);
  }

  if (filters.moduleName) {
    params.set("moduleName", filters.moduleName);
  }

  if (filters.method) {
    params.set("method", filters.method);
  }

  if (filters.path) {
    params.set("path", filters.path);
  }

  if (filters.statusCode) {
    params.set("statusCode", filters.statusCode);
  }

  if (filters.userId) {
    params.set("userId", filters.userId);
  }

  if (filters.ip) {
    params.set("ip", filters.ip);
  }

  if (filters.from) {
    params.set("from", filters.from);
  }

  if (filters.to) {
    params.set("to", filters.to);
  }

  return fetcher(`/applicationlogs?${params.toString()}`, {
    method: "GET",
  });
};