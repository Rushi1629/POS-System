export interface LogFilters {
  page: number;
  limit: number;
  search?: string;
  requestId?: string;
  moduleName?: string;
  method?: string;
  path?: string;
  statusCode?: string;
  userId?: string;
  ip?: string;
  from?: string;
  to?: string;
}

export interface ApplicationLog {
  logId: string;
  requestId: string;
  moduleName: string;
  method: string;
  path: string;
  statusCode: number;
  userId?: string | null;
  ip?: string | null;
  durationMs: number;
  requestBody?: unknown;
  responseBody?: unknown;
  error?: unknown;
  createdAt: string;
}

export interface ApplicationLogsResponse {
  data: ApplicationLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const ALL = "__all__";

export const MODULES = [
  "auth",
  "billing",
  "order",
  "table",
  "menu",
  "sub-menu",
  "category",
  "discount",
  "inventory",
  "dashboard",
  "customer",
  "roles",
  "user",
];
export const METHODS = ["GET", "POST", "PATCH", "DELETE"];
export const STATUSES = [
  "2xx",
  "4xx",
  "5xx",
  "200",
  "201",
  "400",
  "401",
  "403",
  "500",
];

export const emptyFilters: LogFilters = { page: 1, limit: 10 };
