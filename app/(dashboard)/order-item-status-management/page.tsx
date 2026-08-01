"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ChefHat,
  Flame,
  Timer,
  CheckCheck,
  Search,
  RotateCcw,
} from "lucide-react";

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
  useUpdateItemOrderStatus,
} from "@/client/hooks/useOrder";
import { getNextStatus } from "@/utils/utils";
import { useProfile } from "@/client/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@/types/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function transformOrders(data: any[]): KOrder[] {
  return data.map((table) => ({
    id: table.tableId,
    table: table.tableName,
    orderNumber: table.orders?.[0]?.orderNumber || "",
    placedAt: table.orders?.[0]?.createdAt || "",
    status: table.orders?.[0]?.orderStatus || "PENDING",

    items: table.orders.flatMap((order: any) =>
      order.items.map((item: any) => ({
        id: item.orderItemId,
        name: item.menuItem?.name || "Item",
        qty: item.quantity,
        note: item.notes || "",
        status: item.orderItemStatus,
        isCancelled: item.isCancelled ?? false,
      })),
    ),
  }));
}

export default function page() {
  const {
    data: TableWiseOrders,
    isLoading: isTableWiseLoading,
    isError: isTableWiseError,
    refetch,
  } = useFetchOrdersTableWise();
  const {
    mutate: updateStatus,
    isPending,
    isError,
  } = useUpdateItemOrderStatus();
  const searchParams = useSearchParams();

  const tableToken = searchParams?.get("tableToken");

  const { data: profile } = useProfile({ enabled: !tableToken });

  const [orders, setOrders] = useState<KOrder[]>([]);

  const role = profile?.role?.name as UserRole | undefined;

  if (!role) {
    console.warn("Role not loaded yet");
    return;
  }

  console.log(role, "role");

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
    debugger;
    if (!role) {
      toast.error("Role not loaded yet");
      return;
    }

    let errorShown = false;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        const items = o.items.map((i) => {
          if (i.id !== itemId) return i;

          // 🚫 Cancelled check
          if (i.isCancelled) {
            if (!errorShown) {
              toast.error(`${i.name} is cancelled`);
              errorShown = true;
            }
            return i;
          }

          const next = getNextStatus(i.status, role);

          if (next === "CANCELLED") {
            return i;
          }

          if (!next) {
            // ✅ show only once
            if (!errorShown) {
              toast.error(
                `Not allowed: ${role} cannot move ${i.name} from ${i.status}`,
              );
              errorShown = true;
            }
            return i;
          }

          if (next === i.status) {
            if (!errorShown) {
              toast.error(
                `Invalid transition: ${i.status} → ${next} for ${i.name}`,
              );
              errorShown = true;
            }
            return i;
          }

          updateStatus(
            {
              orderItemId: i.id,
              status: next,
            },
            {
              onSuccess: () => {
                toast.success(`${i.name} moved to ${next}`);
              },
              onError: (err: any) => {
                const msg =
                  err?.message || "Failed to update status";
                toast.error(msg);
              },
            },
          );

          return { ...i, status: next };
        });

        return { ...o, items };
      }),
    );
  };

  const handleCancel = (itemId: number) => {
    const item = orders.flatMap((o) => o.items).find((i) => i.id === itemId);

    if (!item) return;

    // 🚫 Already cancelled
    if (item.isCancelled || item.status === "CANCELLED") {
      toast.error("Item already cancelled");
      return;
    }

    // 🚫 Completed cannot cancel
    if (item.status === "COMPLETED") {
      toast.error("Completed item cannot be cancelled");
      return;
    }

    updateStatus(
      {
        orderItemId: itemId,
        status: "CANCELLED",
      },
      {
        onSuccess: () => {
          toast.success("Item cancelled");

          // ✅ Update UI immediately
          setOrders((prev) =>
            prev.map((o) => ({
              ...o,
              items: o.items.map((i) =>
                i.id === itemId
                  ? { ...i, status: "CANCELLED", isCancelled: true }
                  : i,
              ),
            })),
          );
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            error.message ||
            "Failed to cancel item";

          toast.error(message);
        },
      },
    );
  };

  // const bumpAll = (orderId: number) => {
  //   setOrders((prev) =>
  //     prev.map((o) => {
  //       if (o.id !== orderId) return o;

  //       const items = o.items.map((i) => {
  //         // 🚫 CORRECT CHECK (use isCancelled)
  //         if (i.isCancelled) {
  //           return i;
  //         }

  //         const next = getNextStatus(i.status, role);

  //         if (!next) {
  //           return i;
  //         }

  //         updateStatus(
  //           {
  //             orderItemId: i.id,
  //             status: next,
  //           },
  //           {
  //             onSuccess: () => {
  //               toast.success(`${i.name} moved to ${next}`);
  //             },
  //             onError: () => {
  //               toast.error(`Failed to update ${i.name}`);
  //             },
  //           },
  //         );

  //         return { ...i, status: next };
  //       });

  //       return { ...o, items };
  //     }),
  //   );
  // };

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Order Item Status Management
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
          <div className="relative flex-1 min-w-60">
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isTableWiseLoading}
            className="rounded-full"
          >
            <RotateCcw
              className={cn("h-4 w-4", isTableWiseLoading && "animate-spin")}
            />
          </Button>
        </CardContent>
      </Card>

      <div className="grid mt-6 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((o) => (
          <ChefCard
            key={o.id}
            order={o}
            onAdvance={(itemId) => advanceItem(o.id, itemId)}
            onCancel={handleCancel}
            // onBumpAll={() => bumpAll(o.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex mt-6 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center">
          {isTableWiseLoading ? (
            <>
              <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <h3 className="mt-4 text-lg font-semibold">
                Loading order items...
              </h3>
            </>
          ) : (
            <>
              <ChefHat className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">
                No tickets match your filter
              </p>
              <p className="text-xs text-muted-foreground">
                Try clearing the search or filter.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
