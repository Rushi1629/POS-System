import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  ChevronDown,
  CreditCard,
  Drumstick,
  Eye,
  Hash,
  Leaf,
  Printer,
  Receipt,
  StickyNote,
  Table2,
  Utensils,
  XCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { fmt } from "@/utils/utils";
import { Order, PAY_META, STATUS_META, TYPE_META } from "@/types/order-types";
import { Badge } from "./ui/badge";
import BillRow from "./BillRow";

function OrderCard({ order, onView }: { order: Order; onView: () => void }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_META[order.status];
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
        {/* Left: Identity */}
        <div className="flex items-center gap-4 lg:w-[280px]">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
              status.cls,
            )}
          >
            <Receipt className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="truncate">{order.orderNumber}</span>
            </div>
            <p className="mt-0.5 text-base font-bold">Order #{order.id}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Table2 className="h-3 w-3" /> Table {order.tableId}
            </div>
          </div>
        </div>

        {/* Middle: badges */}
        <div className="flex flex-wrap items-center gap-2 lg:flex-1">
          <Badge
            variant="outline"
            className={cn("rounded-full border", TYPE_META[order.orderType])}
          >
            {order.orderType.replace("_", " ")}
          </Badge>
          <Badge
            variant="outline"
            className={cn("rounded-full border gap-1.5", status.cls)}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />{" "}
            {status.label}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border gap-1.5",
              PAY_META[order.paymentStatus],
            )}
          >
            <CreditCard className="h-3 w-3" /> {order.paymentStatus}
          </Badge>
          <Badge variant="outline" className="rounded-full border-border">
            <Utensils className="mr-1 h-3 w-3" /> {totalQty} item
            {totalQty === 1 ? "" : "s"}
          </Badge>
          {order.notes && (
            <Badge
              variant="outline"
              className="rounded-full border-amber-500/30 bg-amber-500/10 text-amber-700"
            >
              <StickyNote className="mr-1 h-3 w-3" /> Note
            </Badge>
          )}
        </div>

        {/* Right: total + actions */}
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total
            </p>
            <p className="text-xl font-bold tabular-nums text-primary">
              {fmt(order.totalAmount)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-lg"
              onClick={onView}
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-lg"
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-lg"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    open && "rotate-180",
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
      </div>

      <CollapsibleContent>
        <div className="border-t border-border bg-muted/30 p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            {/* Items */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Items
              </p>
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                {order.items.map((i) => {
                  const isVeg = i.menuItem.menuType === "Veg";
                  return (
                    <div
                      key={i.id}
                      className={cn(
                        "flex items-start gap-3 p-3",
                        i.isCancelled && "opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
                          isVeg ? "border-emerald-600" : "border-rose-600",
                        )}
                      >
                        {isVeg ? (
                          <Leaf className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Drumstick className="h-3 w-3 text-rose-600" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "truncate text-sm font-semibold",
                              i.isCancelled && "line-through",
                            )}
                          >
                            {i.menuItem.name}
                          </p>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            ×{i.quantity}
                          </span>
                          {i.isCancelled && (
                            <Badge
                              variant="outline"
                              className="rounded-full border-rose-500/30 bg-rose-500/10 text-[10px] text-rose-600"
                            >
                              <XCircle className="mr-1 h-2.5 w-2.5" /> Cancelled
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                          {fmt(i.unitPrice)} each
                        </p>
                        {i.subMenuItem && (
                          <p className="mt-1 text-xs text-foreground/70">
                            <span className="font-medium">+ Add-on:</span>{" "}
                            {i.subMenuItem.name} ({fmt(i.subMenuItem.price)})
                          </p>
                        )}
                        {i.notes && (
                          <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-700">
                            <StickyNote className="h-3 w-3" /> {i.notes}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 text-sm font-bold tabular-nums">
                        {fmt(i.totalPrice)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {order.notes && (
                <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                    <StickyNote className="h-3 w-3" /> Order Note
                  </p>
                  <p className="mt-1 text-sm text-foreground/80">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Bill Summary
              </p>
              <BillRow label="Subtotal" value={fmt(order.subtotal)} />
              <BillRow label="Tax" value={fmt(order.taxAmount)} />
              <BillRow label="Service" value={fmt(order.serviceCharge)} />
              {order.timeChargeAmount && (
                <BillRow
                  label="Time charge"
                  value={fmt(order.timeChargeAmount)}
                />
              )}
              <BillRow
                label="Discount"
                value={`- ${fmt(order.discountAmount)}`}
                negative
              />
              <div className="my-2 border-t border-dashed border-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-lg font-bold tabular-nums text-primary">
                  {fmt(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default OrderCard;
