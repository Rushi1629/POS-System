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

// ───────── Types ─────────
type MenuItem = { id: number; name: string; price: string; menuType: string };
type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string | null;
  isCancelled: boolean;
  menuItem: MenuItem;
  subMenuItem: MenuItem | null;
};
type Order = {
  id: number;
  tableId: number;
  orderNumber: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  status: "PENDING" | "PREPARING" | "READY" | "SERVED" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  serviceCharge: string;
  timeChargeAmount: string | null;
  totalAmount: string;
  notes: string | null;
  placedAt: string;
  etaMinutes?: number;
  items: OrderItem[];
};

// ───────── Sample ─────────
const SAMPLE: Order[] = [
  {
    id: 1,
    tableId: 2090002,
    orderNumber: "ORD-1780233494254",
    orderType: "DINE_IN",
    status: "PREPARING",
    paymentStatus: "UNPAID",
    subtotal: "387.75",
    taxAmount: "19.39",
    discountAmount: "0",
    serviceCharge: "0",
    timeChargeAmount: null,
    totalAmount: "407.14",
    notes: "Need Fast Service",
    placedAt: "2 min ago",
    etaMinutes: 12,
    items: [
      {
        id: 1, quantity: 2, unitPrice: "129.25", totalPrice: "258.5",
        notes: "Low Sugar", isCancelled: false,
        menuItem: { id: 30001, name: "Veg Cheese Burger", price: "129.25", menuType: "Veg" },
        subMenuItem: null,
      },
      {
        id: 2, quantity: 1, unitPrice: "129.25", totalPrice: "129.25",
        notes: null, isCancelled: false,
        menuItem: { id: 60001, name: "Non Veg Cheese Burger", price: "129.25", menuType: "Non Veg" },
        subMenuItem: null,
      },
    ],
  },
  {
    id: 2,
    tableId: 2090005,
    orderNumber: "ORD-1780233512881",
    orderType: "TAKEAWAY",
    status: "READY",
    paymentStatus: "PAID",
    subtotal: "540.00", taxAmount: "27.00", discountAmount: "0",
    serviceCharge: "0", timeChargeAmount: null, totalAmount: "567.00",
    notes: null,
    placedAt: "18 min ago",
    items: [
      {
        id: 3, quantity: 2, unitPrice: "180.00", totalPrice: "360.00",
        notes: "Extra cheese", isCancelled: false,
        menuItem: { id: 40001, name: "Margherita Pizza", price: "180.00", menuType: "Veg" },
        subMenuItem: { id: 1, name: "Extra Cheese", price: "10.50", menuType: "Veg" },
      },
      {
        id: 4, quantity: 3, unitPrice: "60.00", totalPrice: "180.00",
        notes: null, isCancelled: false,
        menuItem: { id: 70001, name: "Cold Coffee", price: "60.00", menuType: "Veg" },
        subMenuItem: null,
      },
    ],
  },
  {
    id: 3,
    tableId: 2090001,
    orderNumber: "ORD-1780233601122",
    orderType: "DINE_IN",
    status: "COMPLETED",
    paymentStatus: "PAID",
    subtotal: "950.00", taxAmount: "47.50", discountAmount: "50",
    serviceCharge: "20", timeChargeAmount: "15.00", totalAmount: "982.50",
    notes: "Birthday celebration",
    placedAt: "Yesterday · 8:42 PM",
    items: [
      {
        id: 5, quantity: 1, unitPrice: "450.00", totalPrice: "450.00",
        notes: null, isCancelled: false,
        menuItem: { id: 80001, name: "Paneer Tikka Platter", price: "450.00", menuType: "Veg" },
        subMenuItem: null,
      },
      {
        id: 6, quantity: 2, unitPrice: "250.00", totalPrice: "500.00",
        notes: "Spicy", isCancelled: false,
        menuItem: { id: 90001, name: "Chicken Biryani", price: "250.00", menuType: "Non Veg" },
        subMenuItem: null,
      },
    ],
  },
  {
    id: 4,
    tableId: 2090003,
    orderNumber: "ORD-1780233699871",
    orderType: "DELIVERY",
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    subtotal: "220.00", taxAmount: "11.00", discountAmount: "0",
    serviceCharge: "0", timeChargeAmount: null, totalAmount: "231.00",
    notes: null,
    placedAt: "3 days ago",
    items: [
      {
        id: 7, quantity: 1, unitPrice: "220.00", totalPrice: "220.00",
        notes: null, isCancelled: true,
        menuItem: { id: 30001, name: "Veg Cheese Burger Combo", price: "220.00", menuType: "Veg" },
        subMenuItem: null,
      },
    ],
  },
];

// ───────── Tracker steps ─────────
const STEPS: Array<{ key: Order["status"]; label: string; icon: React.ElementType }> = [
  { key: "PENDING", label: "Placed", icon: Receipt },
  { key: "PREPARING", label: "Preparing", icon: ChefHat },
  { key: "READY", label: "Ready", icon: Sparkles },
  { key: "SERVED", label: "Served", icon: Utensils },
  { key: "COMPLETED", label: "Completed", icon: CheckCheck },
];

const TYPE_META: Record<Order["orderType"], { label: string; icon: React.ElementType }> = {
  DINE_IN: { label: "Dine-In", icon: Utensils },
  TAKEAWAY: { label: "Takeaway", icon: ShoppingBag },
  DELIVERY: { label: "Delivery", icon: Truck },
};

function statusIndex(s: Order["status"]) {
  return STEPS.findIndex((x) => x.key === s);
}

function isActive(s: Order["status"]) {
  return s !== "COMPLETED" && s !== "CANCELLED";
}

// ───────── Page ─────────
export default function CustomerOrdersPage() {
  const [tab, setTab] = useState<"active" | "past">("active");

  const active = useMemo(() => SAMPLE.filter((o) => isActive(o.status)), []);
  const past = useMemo(() => SAMPLE.filter((o) => !isActive(o.status)), []);
  const list = tab === "active" ? active : past;

  const totalSpent = SAMPLE
    .filter((o) => o.status === "COMPLETED")
    .reduce((s, o) => s + parseFloat(o.totalAmount), 0);

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
              value={String(SAMPLE.filter((o) => o.status === "COMPLETED").length)}
              tint="bg-emerald-500/10 text-emerald-600"
            />
            <SummaryCard
              icon={<Receipt className="h-4 w-4" />}
              label="Total Orders"
              value={String(SAMPLE.length)}
              tint="bg-sky-500/10 text-sky-600"
            />
            <SummaryCard
              icon={<Star className="h-4 w-4" />}
              label="Lifetime Spend"
              value={`₹${totalSpent.toFixed(0)}`}
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
                {t === "active" ? `Active (${active.length})` : `History (${past.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-5 px-8 py-6">
          {list.length === 0 ? (
            <EmptyState tab={tab} />
          ) : (
            list.map((o) => <OrderCard key={o.id} order={o} />)
          )}
        </div>
      </main>
    </div>
  );
}

// ───────── Components ─────────

function SummaryCard({
  icon, label, value, tint,
}: { icon: React.ReactNode; label: string; value: string; tint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", tint)}>
          {icon}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const isCancelled = order.status === "CANCELLED";
  const isDone = order.status === "COMPLETED";
  const TypeIcon = TYPE_META[order.orderType].icon;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:shadow-md",
        isCancelled
          ? "border-destructive/30"
          : isDone
            ? "border-border"
            : "border-primary/30 ring-1 ring-primary/10",
      )}
    >
      {/* Header band */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 px-5 py-4",
          isCancelled
            ? "bg-destructive/5"
            : isDone
              ? "bg-muted/40"
              : "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-2xl",
              isCancelled
                ? "bg-destructive/15 text-destructive"
                : isDone
                  ? "bg-emerald-500/15 text-emerald-600"
                  : "bg-primary/15 text-primary",
            )}
          >
            <TypeIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold tracking-tight">
                {TYPE_META[order.orderType].label}
              </p>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                {order.orderNumber.replace("ORD-", "")}
              </p>
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" /> {order.placedAt}
              {order.orderType === "DINE_IN" && (
                <>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <MapPin className="h-3 w-3" /> Table #{order.tableId}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isCancelled && !isDone && order.etaMinutes && (
            <div className="rounded-full border border-primary/30 bg-background px-3 py-1 text-xs font-semibold text-primary">
              ETA · {order.etaMinutes} min
            </div>
          )}
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total
            </p>
            <p className="text-lg font-bold tabular-nums">
              ₹{parseFloat(order.totalAmount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Tracker */}
      {isCancelled ? (
        <div className="flex items-center gap-3 border-t border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive">
          <XCircle className="h-4 w-4" /> Order cancelled · Refund issued
        </div>
      ) : (
        <Tracker status={order.status} />
      )}

      {/* Items */}
      <div className="divide-y divide-border px-5">
        {order.items.map((it) => {
          const veg = it.menuItem.menuType === "Veg";
          return (
            <div key={it.id} className="flex items-start gap-3 py-3">
              <span
                className={cn(
                  "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2",
                  veg ? "border-emerald-600" : "border-rose-600",
                )}
              >
                {veg ? (
                  <Leaf className="h-2.5 w-2.5 text-emerald-600" />
                ) : (
                  <Drumstick className="h-2.5 w-2.5 text-rose-600" />
                )}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className={cn(
                      "truncate text-sm font-semibold",
                      it.isCancelled && "line-through text-muted-foreground",
                    )}
                  >
                    <span className="mr-1.5 text-muted-foreground">
                      {it.quantity}×
                    </span>
                    {it.menuItem.name}
                  </p>
                  <p className="shrink-0 text-sm font-semibold tabular-nums">
                    ₹{parseFloat(it.totalPrice).toFixed(2)}
                  </p>
                </div>
                {it.subMenuItem && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    + {it.subMenuItem.name} (₹
                    {parseFloat(it.subMenuItem.price).toFixed(2)})
                  </p>
                )}
                {it.notes && (
                  <p className="mt-1 flex items-start gap-1 text-[11px] italic text-muted-foreground">
                    <StickyNote className="mt-0.5 h-3 w-3 shrink-0" />
                    {it.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order note */}
      {order.notes && (
        <div className="mx-5 mb-4 rounded-xl border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Order note:</span>{" "}
          {order.notes}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3">
        <div className="flex items-center gap-2 text-xs">
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-0 font-semibold",
              order.paymentStatus === "PAID"
                ? "bg-emerald-500/10 text-emerald-700"
                : order.paymentStatus === "REFUNDED"
                  ? "bg-muted text-muted-foreground"
                  : "bg-amber-500/10 text-amber-700",
            )}
          >
            {order.paymentStatus === "PAID"
              ? "Paid"
              : order.paymentStatus === "REFUNDED"
                ? "Refunded"
                : "Pay at counter"}
          </Badge>
          <span className="text-muted-foreground">
            Subtotal ₹{parseFloat(order.subtotal).toFixed(2)} · Tax ₹
            {parseFloat(order.taxAmount).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isDone && (
            <>
              <Button variant="outline" size="sm" className="h-8 rounded-full">
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reorder
              </Button>
              <Button variant="outline" size="sm" className="h-8 rounded-full">
                <Star className="mr-1.5 h-3.5 w-3.5" /> Rate
              </Button>
            </>
          )}
          {!isDone && !isCancelled && (
            <Button variant="outline" size="sm" className="h-8 rounded-full">
              <Phone className="mr-1.5 h-3.5 w-3.5" /> Call Staff
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-8 rounded-full">
            <Receipt className="mr-1.5 h-3.5 w-3.5" /> Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}

function Tracker({ status }: { status: Order["status"] }) {
  const idx = Math.max(0, statusIndex(status));
  return (
    <div className="border-t border-border bg-background px-5 py-5">
      <div className="relative flex items-start justify-between">
        {/* progress line */}
        <div className="absolute left-5 right-5 top-4 h-0.5 bg-border" />
        <div
          className="absolute left-5 top-4 h-0.5 bg-primary transition-all"
          style={{
            width: `calc((100% - 2.5rem) * ${idx / (STEPS.length - 1)})`,
          }}
        />

        {STEPS.map((step, i) => {
          const done = i < idx;
          const current = i === idx;
          const Icon = step.icon;
          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-1 flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition",
                  done && "border-primary bg-primary text-primary-foreground",
                  current &&
                    "border-primary bg-background text-primary ring-4 ring-primary/20 animate-pulse",
                  !done && !current && "border-border bg-background text-muted-foreground",
                )}
              >
                {done ? <CheckCheck className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  current ? "text-primary" : done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {current && (
                <span className="flex items-center gap-1 text-[10px] text-primary">
                  <CircleDot className="h-2.5 w-2.5" /> Now
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: "active" | "past" }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/40 p-16 text-center">
      <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/60" />
      <p className="mt-4 text-sm font-medium text-foreground">
        {tab === "active" ? "No active orders right now" : "No past orders yet"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {tab === "active"
          ? "Place an order and track it live here."
          : "Your order history will appear here once you complete an order."}
      </p>
      <Button asChild className="mt-5 rounded-full">
        <Link href="/customer">Browse Menu</Link>
      </Button>
    </div>
  );
}
