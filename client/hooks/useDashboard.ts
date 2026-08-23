import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardSummary,
  fetchInventoryLevels,
  fetchLowStock,
  fetchOrderStatus,
  fetchPaymentMethods,
  fetchRecentOrders,
  fetchRevenueVsOrders,
  fetchSalesTrend,
  fetchTopItems,
} from "../services/dashboard.service";
import type { DashboardGroupBy, DashboardPeriod } from "@/types/dashboard-types";

export const useDashboard = (
  period: DashboardPeriod = "today",
  salesGroupBy: DashboardGroupBy = "day",
  revenueGroupBy: DashboardGroupBy = "day",
  startDate?: string,
  endDate?: string,
) => {
  const summary = useQuery({
    queryKey: ["dashboard", "summary", period, startDate, endDate],
    queryFn: () => fetchDashboardSummary(period, startDate, endDate),
  });
  const salesTrend = useQuery({
    queryKey: ["dashboard", "sales-trend", salesGroupBy],
    queryFn: () => fetchSalesTrend(salesGroupBy),
  });
  const orderStatus = useQuery({
    queryKey: ["dashboard", "order-status", period, startDate, endDate],
    queryFn: () => fetchOrderStatus(period, startDate, endDate),
  });
  const topItems = useQuery({
    queryKey: ["dashboard", "top-items"],
    queryFn: fetchTopItems,
  });
  const paymentMethods = useQuery({
    queryKey: ["dashboard", "payment-methods", period, startDate, endDate],
    queryFn: () => fetchPaymentMethods(period, startDate, endDate),
  });
  const inventory = useQuery({
    queryKey: ["dashboard", "inventory"],
    queryFn: fetchInventoryLevels,
  });
  const recentOrders = useQuery({
    queryKey: ["dashboard", "recent-orders"],
    queryFn: fetchRecentOrders,
  });
  const lowStock = useQuery({
    queryKey: ["dashboard", "low-stock"],
    queryFn: fetchLowStock,
  });
  const revenueVsOrders = useQuery({
    queryKey: ["dashboard", "revenue-vs-orders", revenueGroupBy],
    queryFn: () => fetchRevenueVsOrders(revenueGroupBy),
  });

  const queries = [
    summary,
    salesTrend,
    orderStatus,
    topItems,
    paymentMethods,
    inventory,
    recentOrders,
    lowStock,
    revenueVsOrders,
  ];

  return {
    summary: summary.data,
    salesTrend: salesTrend.data ?? [],
    orderStatus: orderStatus.data ?? {},
    topItems: topItems.data ?? [],
    paymentMethods: paymentMethods.data ?? [],
    inventory: inventory.data ?? [],
    recentOrders: recentOrders.data ?? [],
    lowStock: lowStock.data ?? [],
    revenueVsOrders: revenueVsOrders.data ?? [],
    isLoading: queries.some((query) => query.isLoading),
    error: queries.find((query) => query.error)?.error,
  };
};
