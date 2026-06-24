import React from "react";
import { Button } from "./ui/button";
import {
  Clock,
  Drumstick,
  Hash,
  Leaf,
  MapPin,
  Phone,
  Receipt,
  RotateCcw,
  Star,
  StickyNote,
  XCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Order, TYPE_META } from "@/types/customer-order-types";
import Tracker from "./Tracker";

const OrderCardCustomer = ({ order }: { order: Order }) => {
  const isCancelled = order.orderStatus === "CANCELLED";
  const isDone = order.orderStatus === "COMPLETED";
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
              : "bg-linear-to-r from-primary/10 via-primary/5 to-transparent",
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
              <Clock className="h-3 w-3" />{" "}
              {Number(order.timeChargeAmount ?? 0) > 0
                ? Number(order.timeChargeAmount).toFixed(2)
                : "0"}
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
        <Tracker status={order.orderStatus} />
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
                {it.subMenuItems?.map((extra: any) => (
                  <p
                    key={extra.id}
                    className="mt-0.5 text-[11px] text-muted-foreground"
                  >
                    + {extra.name} (₹{extra.price.toFixed(2)})
                  </p>
                ))}
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
};

export default OrderCardCustomer;
