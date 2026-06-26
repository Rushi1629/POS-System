"use client";
import { useEffect, useMemo, useState } from "react";
import { ChefHat, Flame, Timer, CheckCheck, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import {
  ItemStatus,
  KOrder,
  NEXT,
  OrderStatus,
  STATUS_STYLES,
  TableOrder,
} from "@/types/chef-types";
import ChefCard from "@/components/ChefCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  useFetchOrdersTableWise,
  useUpdateOrderStatus,
} from "@/client/hooks/useOrder";

const transformOrders = (data: TableOrder[]): KOrder[] => {
  return data.flatMap((table) =>
    table.orders.map((order) => ({
      id: order.orderId,
      table: table.tableName,
      orderNumber: order.orderNumber,
      placedAt: new Date().toISOString(), // or use API time if available
      status: order.orderStatus,

      items: order.items.map((item) => ({
        id: item.orderItemId,
        name: item.menuItem.name,
        qty: item.quantity,
        note: item.notes ?? "",
        status: item.orderItemStatus,
        isCancelled: item.isCancelled ?? false,
      })),
    })),
  );
};

export default function page() {
  const {
    data: TableWiseOrders,
    isLoading: isTableWiseLoading,
    isError: isTableWiseError,
  } = useFetchOrdersTableWise();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const [orders, setOrders] = useState<KOrder[]>([]);

  useEffect(() => {
    if (TableWiseOrders) {
      const formatted = transformOrders(TableWiseOrders.data);
      setOrders(formatted);
    }
  }, [TableWiseOrders]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        o.table.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    });
  }, [orders, filter, query]);

  const totals = useMemo(() => {
    const items = orders.flatMap((o) => o.items);
    return {
      activeOrders: orders.filter((o) => o.status !== "SERVED").length,
      queue: items.filter((i) => i.status !== "SERVED").length,
      preparing: items.filter((i) => i.status === "PREPARING").length,
      ready: items.filter((i) => i.status === "READY").length,
    };
  }, [orders]);

  const advanceItem = (orderId: number, itemId: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        const items = o.items.map((i) => {
          if (i.id !== itemId) return i;

          const next = NEXT[i.status];

          if (next) {
            // 🔥 API CALL HERE
            updateStatus({
              orderItemId: i.id,
              status: next,
            });

            return { ...i, status: next }; // optimistic UI
          }

          return i;
        });

        return { ...o, items };
      }),
    );
  };

  const bumpAll = (orderId: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        const items = o.items.map((i) => {
          const next = NEXT[i.status];

          if (next) {
            // 🔥 API CALL FOR EACH ITEM
            updateStatus({
              orderItemId: i.id,
              status: next,
            });

            return { ...i, status: next };
          }

          return i;
        });

        return { ...o, items };
      }),
    );
  };

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Chef Station
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Track tickets in real-time and bump items as they progress.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live sync · just now
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={<ChefHat className="h-4 w-4" />}
          label="Active Orders"
          value={totals.activeOrders}
          tint="primary"
        />
        <StatCard
          icon={<Timer className="h-4 w-4" />}
          label="Items in Queue"
          value={totals.queue}
          tint="amber"
        />
        <StatCard
          icon={<Flame className="h-4 w-4" />}
          label="Now Preparing"
          value={totals.preparing}
          tint="emerald"
        />
        <StatCard
          icon={<CheckCheck className="h-4 w-4" />}
          label="Ready to Serve"
          value={totals.ready}
          tint="primary"
        />
      </div>

      <Card className="mt-7 border-border/70 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search table, order # or dish..."
              className="h-10 rounded-full border-border bg-card pl-9"
            />
          </div>
          <div className="flex gap-1 rounded-full border border-border bg-card p-1">
            {(
              ["all", "PENDING", "ACCEPTED", "PREPARING", "READY"] as const
            ).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f === "all" ? "All" : STATUS_STYLES[f as ItemStatus].label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <hr />

      <div className="grid mt-6 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((o) => (
          <ChefCard
            key={o.id}
            order={o}
            onAdvance={(itemId) => advanceItem(o.id, itemId)}
            onBumpAll={() => bumpAll(o.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex mt-6 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center">
          <ChefHat className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">
            No tickets match your filter
          </p>
          <p className="text-xs text-muted-foreground">
            Try clearing the search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
