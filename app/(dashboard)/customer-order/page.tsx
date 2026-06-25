"use client";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChefHat,
  CheckCheck,
  CircleDot,
  Clock,
  Flame,
  Hash,
  Leaf,
  Drumstick,
  MapPin,
  Receipt,
  ShoppingBag,
  Sparkles,
  StickyNote,
  Truck,
  Utensils,
  XCircle,
  RotateCcw,
  Phone,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useFetchActiveOrders } from "@/client/hooks/useOrder";
import { Order, STEPS } from "@/types/customer-order-types";
import EmptyEmptyState from "@/components/EmptyState";
import SummaryCard from "@/components/SummaryCard";
import OrderCardCustomer from "@/components/OrderCardCustomer";
import { useProfile } from "@/client/hooks/useAuth";
import { useFetchTableByTokenCustomer } from "@/client/hooks/useCustomer";
import { useSearchParams } from "next/navigation";

function isActive(s: Order["orderStatus"]) {
  return s !== "COMPLETED" && s !== "CANCELLED";
}
export default function CustomerOrdersPage() {
  const {
    data: ActiveOrders,
    isLoading: isTableWiseLoading,
    isError: isTableWiseError,
  } = useFetchActiveOrders();
  const searchParams = useSearchParams();

  const tableToken = searchParams?.get("tableToken");

  const {
    data: tableData,
    isLoading: isLoadingTable,
    refetch: refetchTable,
  } = useFetchTableByTokenCustomer(tableToken);

  const { data: profile } = useProfile({ enabled: !tableToken });

  console.log(ActiveOrders, "orders");

  const getExtraPrice = (e: any) => {
    if (Number(e.unitPrice) > 0) return Number(e.unitPrice);

    if (Number(e.totalPrice) > 0 && e.quantity > 0) {
      return Number(e.totalPrice) / e.quantity;
    }

    return Number(e.subMenuItem?.price || 0);
  };

  const mapOrder = (apiOrder: any): Order => {
    return {
      id: apiOrder.orderId || Date.now(),
      tableId: apiOrder.tableId,

      // ✅ FIX: use correct field name
      orderStatus: apiOrder.orderStatus,

      orderNumber: apiOrder.orderNumber,
      orderType: apiOrder.orderType,

      paymentStatus: apiOrder.paymentStatus,
      subtotal: apiOrder.subtotal,
      taxAmount: apiOrder.taxAmount,
      discountAmount: apiOrder.discountAmount,
      serviceCharge: apiOrder.serviceCharge,
      timeChargeAmount: apiOrder.timeChargeAmount,
      totalAmount: apiOrder.totalAmount,

      notes: apiOrder.notes,
      placedAt: apiOrder.placedAt || "Just now",

      items: apiOrder.items.map((item: any) => ({
        id: item.orderItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        notes: item.notes,

        // ✅ FIX: required in OrderItem
        orderItemStatus: item.orderItemStatus,

        isCancelled: item.isCancelled,
        menuItem: item.menuItem,

        subMenuItems:
          item.orderSubMenuItems?.map((e: any) => ({
            id: e.subMenuItem.id,
            name: e.subMenuItem.name,

            // ✅ FIX submenu price issue
            price:
              Number(e.unitPrice) > 0
                ? Number(e.unitPrice)
                : Number(e.subMenuItem.price),
          })) || [],
      })),
    };
  };

  const [tab, setTab] = useState<"active" | "past">("active");

  const mappedOrders = useMemo(() => {
    return ActiveOrders?.map(mapOrder) ?? [];
  }, [ActiveOrders]);

  const active = useMemo(
    () => mappedOrders.filter((o) => isActive(o.orderStatus)),
    [mappedOrders],
  );

  const past = useMemo(
    () => mappedOrders.filter((o) => !isActive(o.orderStatus)),
    [mappedOrders],
  );
  const list = tab === "active" ? active : past;

  console.log(list, "list");

  const totalSpent = ActiveOrders?.filter(
    (o) => o.orderStatus === "COMPLETED",
  ).reduce((s, o) => s + parseFloat(o.totalAmount), 0);

  const totalAmount = useMemo(() => {
    return mappedOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0,
    );
  }, [mappedOrders]);

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-border bg-card/40 px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/customer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Track your live orders and revisit past ones
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/customer">
                  <Utensils className="mr-1.5 h-4 w-4" /> Order More
                </Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/customer/cart">
                  <ShoppingBag className="mr-1.5 h-4 w-4" /> View Cart
                </Link>
              </Button>
            </div>
          </div>

          {/* Mini summary cards */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard
              icon={<Flame className="h-4 w-4" />}
              label="Active"
              value={String(active.length)}
              tint="bg-amber-500/10 text-amber-600"
            />
            <SummaryCard
              icon={<CheckCheck className="h-4 w-4" />}
              label="Completed"
              value={String(
                ActiveOrders?.filter((o) => o.orderStatus === "COMPLETED")
                  .length ?? 0,
              )}
              tint="bg-emerald-500/10 text-emerald-600"
            />
            <SummaryCard
              icon={<Receipt className="h-4 w-4" />}
              label="Total Orders"
              value={String(ActiveOrders?.length ?? 0)}
              tint="bg-sky-500/10 text-sky-600"
            />
            <SummaryCard
              icon={<Star className="h-4 w-4" />}
              label="Lifetime Spend"
              value={`₹${totalAmount.toFixed(0)}`}
              tint="bg-primary/10 text-primary"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            {(["active", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-medium capitalize transition",
                  tab === t
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "active"
                  ? `Active (${active.length})`
                  : `History (${past.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-5 px-8 py-6">
          {list.length === 0 ? (
            <EmptyEmptyState tab={tab} />
          ) : (
            list.map((o) => <OrderCardCustomer key={o.id} order={o} />)
          )}
        </div>
      </main>
    </div>
  );
}
