import { fetcher } from "../client";
import { firstValue, numberValue, toRecordArray } from "@/utils/utils";
import type {
  DashboardGroupBy,
  DashboardPeriod,
  DashboardSummary,
  InventoryLevel,
  LowStockItem,
  OrderStatusData,
  PaymentMethod,
  RecentOrder,
  RevenueVsOrdersPoint,
  SalesTrendPoint,
  TopItem,
} from "@/types/dashboard-types";

export type {
  DashboardGroupBy,
  DashboardPeriod,
} from "@/types/dashboard-types";

type ApiResponse<T> = { data: T };

const unwrap = <T>(response: ApiResponse<T>) => response.data;

 

export const dateRange = (period: DashboardPeriod) => {
  const end = new Date();
  const start = new Date(end);
  if (period === "7d") start.setDate(end.getDate() - 6);
  if (period === "30d") start.setDate(end.getDate() - 29);
  if (period === "ytd") start.setMonth(0, 1);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

export const periodParams = (
  period: DashboardPeriod,
  startDate?: string,
  endDate?: string,
) => {
  const range =
    startDate && endDate ? { startDate, endDate } : dateRange(period);
  return `period=${period === "7d" || period === "30d" || period === "ytd" ? period : "today"}&startDate=${range.startDate}&endDate=${range.endDate}`;
};

export const fetchDashboardSummary = async (
  period: DashboardPeriod,
  startDate?: string,
  endDate?: string,
): Promise<DashboardSummary> =>
  unwrap(
    await fetcher(
      `/dashboard/summary?${periodParams(period, startDate, endDate)}`,
    ),
  );

export const fetchSalesTrend = async (
  groupBy: DashboardGroupBy,
): Promise<SalesTrendPoint[]> => {
  const data = unwrap(
    await fetcher(`/dashboard/sales-trend?groupBy=${groupBy}`),
  );
  return toRecordArray(data).map((item, index) => ({
    label: String(
      firstValue(item, ["label", "date", "period", "hour"]) ?? index + 1,
    ),
    revenue: numberValue(firstValue(item, ["revenue", "amount"])),
    orders: numberValue(firstValue(item, ["orders", "orderCount", "count"])),
  }));
};

export const fetchOrderStatus = async (
  period: DashboardPeriod,
  startDate?: string,
  endDate?: string,
): Promise<OrderStatusData> => {
  const data = unwrap(
    await fetcher(
      `/dashboard/order-status?${periodParams(period, startDate, endDate)}`,
    ),
  );
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return Object.fromEntries(
      Object.entries(data).map(([name, value]) => [
        name.toLowerCase(),
        numberValue(value),
      ]),
    );
  }
  return Object.fromEntries(
    toRecordArray(data).map((item) => [
      String(item.name).toLowerCase(),
      numberValue(item.value),
    ]),
  );
};

export const fetchTopItems = async (): Promise<TopItem[]> => {
  const data = unwrap(
    await fetcher("/dashboard/top-items?sort=quantity&limit=10"),
  );
  return toRecordArray(data).map((item) => ({
    name: String(
      firstValue(item, ["name", "itemName", "productName"]) ?? "Unknown",
    ),
    quantity: numberValue(firstValue(item, ["quantity", "count", "sold"])),
  }));
};

export const fetchPaymentMethods = async (
  period: DashboardPeriod,
  startDate?: string,
  endDate?: string,
): Promise<PaymentMethod[]> => {
  const data = unwrap(
    await fetcher(
      `/dashboard/payment-methods?${periodParams(period, startDate, endDate)}`,
    ),
  );
  const methods = toRecordArray(data).map((item) => ({
    name: String(
      firstValue(item, ["name", "method", "paymentMethod"]) ?? "Unknown",
    ),
    count: numberValue(firstValue(item, ["count", "quantity", "total"])),
    percentage: numberValue(firstValue(item, ["percentage", "share"])),
  }));
  const total = methods.reduce((sum, item) => sum + item.count, 0);
  return methods.map((item) => ({
    ...item,
    percentage: item.percentage || (total ? (item.count / total) * 100 : 0),
  }));
};

export const fetchInventoryLevels = async (): Promise<InventoryLevel[]> => {
  const data = unwrap(await fetcher("/dashboard/inventory"));
  return toRecordArray(data).map((item) => ({
    name: String(
      firstValue(item, ["name", "itemName", "productName"]) ?? "Unknown",
    ),
    percentage: numberValue(
      firstValue(item, ["percentage", "stockPercentage", "stockPercent"]),
    ),
  }));
};

export const fetchRecentOrders = async (): Promise<RecentOrder[]> => {
  const response = await fetcher("/dashboard/recent-orders?page=1&limit=10");
  const data = unwrap(response);
  return toRecordArray(
    data && typeof data === "object" && "items" in data
      ? (data as Record<string, unknown>).items
      : data,
  ).map((item) => ({
    id: String(firstValue(item, ["id", "orderId", "orderNumber"]) ?? "-"),
    customer: String(
      firstValue(item, ["customer", "customerName", "userName"]) ?? "Walk-in",
    ),
    table: String(
      firstValue(item, ["table", "tableName", "tableNumber"]) ?? "-",
    ),
    items: numberValue(firstValue(item, ["items", "itemCount", "quantity"])),
    total: numberValue(firstValue(item, ["total", "totalAmount", "amount"])),
    payment: String(firstValue(item, ["payment", "paymentMethod"]) ?? "-"),
    status: String(firstValue(item, ["status", "orderStatus"]) ?? "Pending"),
  }));
};

export const fetchLowStock = async (): Promise<LowStockItem[]> => {
  const data = unwrap(await fetcher("/dashboard/low-stock"));
  return toRecordArray(data).map((item) => ({
    name: String(
      firstValue(item, ["name", "itemName", "productName"]) ?? "Unknown",
    ),
    percentage: numberValue(
      firstValue(item, [
        "percentage",
        "stockPercentage",
        "stockPercent",
        "currentStock",
      ]),
    ),
  }));
};

export const fetchRevenueVsOrders = async (
  groupBy: DashboardGroupBy,
): Promise<RevenueVsOrdersPoint[]> => {
  const data = unwrap(
    await fetcher(`/dashboard/revenue-vs-orders?groupBy=${groupBy}`),
  );
  return toRecordArray(data).map((item, index) => ({
    label: String(firstValue(item, ["label", "date", "period"]) ?? index + 1),
    revenue: numberValue(firstValue(item, ["revenue", "amount"])),
    orders: numberValue(firstValue(item, ["orders", "orderCount", "expenses"])),
  }));
};
