"use client";
import { Button } from "@/components/ui/button";
import {
  OrderAdminChef,
  STATUS_META,
} from "@/types/order-types";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Receipt,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderCard from "@/components/OrderCard";
import OrderDetailDialog from "@/components/OrderDetailDialog";
import { fmt } from "@/utils/utils";
import OrderStatusCard from "@/components/orderStatusCard";
import {
  useFetchOrdersTableWise,
} from "@/client/hooks/useOrder";
import ApiLoader from "@/components/ApiLoader";

const page = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [detail, setDetail] = useState<OrderAdminChef | null>(null);

  const {
    data: tableWiseData,
    isLoading: isTableWiseLoading,
    isError: isTableWiseError,
  } = useFetchOrdersTableWise();

  const orders = useMemo<OrderAdminChef[]>(() => {
    if (!tableWiseData?.data) return [];

    return tableWiseData.data.flatMap((table) =>
      table.orders.map((order) => ({
        ...order,
        tableName: table.tableName,
      })),
    );
  }, [tableWiseData]);

  console.log(orders, "orders");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.orderStatus !== statusFilter)
        return false;
      if (typeFilter !== "all" && o.orderType !== typeFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchOrder = o.orderNumber.toLowerCase().includes(q);
        const matchTable = String(o.tableId).includes(q);
        const matchItem = o.items.some((i) =>
          i.menuItem.name.toLowerCase().includes(q),
        );
        if (!matchOrder && !matchTable && !matchItem) return false;
      }
      return true;
    });
  }, [orders, query, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) =>
        ["PENDING", "PREPARING", "READY"].includes(o.orderStatus),
      ).length,
      revenue: orders
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((s, o) => s + Number(o.totalAmount), 0),
      completed: orders.filter((o) => o.orderStatus === "COMPLETED").length,
    };
  }, [orders]);
  if (isTableWiseLoading) return <ApiLoader message="Fetching orders..." />;
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Orders Management
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Track every customer order, status, and payment in real time.
          </p>
        </div>
        <Button className="rounded-lg shadow-md shadow-primary/20">
          <Receipt className="mr-1 h-4 w-4" /> New Order
        </Button>
      </div>
      <div className="mt-7">
        {/* Stat cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OrderStatusCard
            label="TOTAL ORDERS"
            value={stats.total}
            icon={<Receipt className="h-5 w-5" />}
            tone="primary"
          />
          <OrderStatusCard
            label="ACTIVE"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            tone="amber"
          />
          <OrderStatusCard
            label="COMPLETED"
            value={stats.completed}
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="emerald"
          />
          <OrderStatusCard
            label="REVENUE"
            value={fmt(stats.revenue)}
            icon={<CircleDollarSign className="h-5 w-5" />}
            tone="violet"
          />
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order #, table or item..."
              className="h-10 rounded-lg border-border pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10 w-full rounded-lg sm:w-44">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="DINE_IN">Dine In</SelectItem>
              <SelectItem value="TAKEAWAY">Takeaway</SelectItem>
              <SelectItem value="DELIVERY">Delivery</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-full rounded-lg sm:w-44">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {Object.keys(STATUS_META).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_META[s as OrderAdminChef["orderStatus"]].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-10 rounded-lg"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
          >
            Reset
          </Button>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center">
              <Receipt className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <p className="mt-4 text-sm font-medium">No orders found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your filters.
              </p>
            </div>
          ) : (
            filtered.map((o, m) => (
              <OrderCard
                key={`${o.orderId}-${m}`}
                order={o}
                onView={() => setDetail(o)}
              />
            ))
          )}
        </div>
      </div>

      <OrderDetailDialog
        order={detail}
        onOpenChange={(v) => !v && setDetail(null)}
      />
    </div>
  );
};

export default page;
