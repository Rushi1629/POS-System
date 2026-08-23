export type DashboardPeriod = "today" | "7d" | "30d" | "ytd";
export type DashboardGroupBy = "hour" | "day" | "week";

export type DashboardSummary = {
	revenue: {
		amount: number;
		comparisonPercentage?: number | null;
		comparisonDirection?: string;
	};
	orders: {
		count: number;
		comparisonPercentage?: number | null;
		comparisonDirection?: string;
	};
	activeTables: { active: number; total: number; occupancyPercentage?: number };
	itemsSold: {
		quantity: number;
		comparisonPercentage?: number | null;
		comparisonDirection?: string;
	};
	timeCharges: {
		amount: number;
		comparisonPercentage?: number | null;
	};
	outstanding: {
		amount: number;
		comparisonPercentage?: number | null;
		billCount: number;
	};
	avgBill: {
		averageAmount: number;
		billCount: number;
		comparisonPercentage?: number | null;
	};
	lowStock: { count: number };
};

export type SalesTrendPoint = { label: string; revenue: number; orders: number };
export type OrderStatusData = Record<string, number>;
export type TopItem = { name: string; quantity: number };
export type PaymentMethod = { name: string; count: number; percentage?: number };
export type InventoryLevel = { name: string; percentage: number };
export type RecentOrder = {
	id: string;
	customer: string;
	table: string;
	items: number;
	total: number;
	payment: string;
	status: string;
};
export type LowStockItem = { name: string; percentage: number };
export type RevenueVsOrdersPoint = { label: string; revenue: number; orders: number };
