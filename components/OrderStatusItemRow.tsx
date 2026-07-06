import { cn } from "@/lib/utils";
import {
  getAllowedTransitions,
  labelFor,
  Order,
  OrderItem,
  OrderStatus,
} from "@/types/order-status-types";
import { ChevronRight, Flame, Leaf, X } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import OrderStausStatusBadge from "./OrderStausStatusBadge";
import { UserRole } from "@/types/types";

const OrderStatusItemRow = ({
  item,
  order,
  role,
  onPick,
}: {
  item: OrderItem;
  order: Order;
  role: UserRole;
  onPick: (order: Order, item: OrderItem, status: OrderStatus) => void;
}) => {
  const allowed = item.isCancelled
    ? []
    : getAllowedTransitions(item.orderItemStatus, role);
  const cancelled = item.isCancelled || item.orderItemStatus === "CANCELLED";
  return (
    <div
      className={cn(
        "group flex flex-wrap items-center gap-4 rounded-xl border border-transparent bg-background/50 px-4 py-3 transition-colors hover:border-border",
        cancelled && "opacity-60",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          item.menuItem.menuType === "Veg"
            ? "bg-[oklch(0.93_0.08_145)] text-[oklch(0.38_0.13_150)]"
            : "bg-[oklch(0.94_0.04_25)] text-[oklch(0.5_0.18_25)]",
        )}
        title={item.menuItem.menuType}
      >
        {item.menuItem.menuType === "Veg" ? (
          <Leaf className="size-4" />
        ) : (
          <Flame className="size-4" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn("truncate font-medium", cancelled && "line-through")}
          >
            {item.menuItem.name}
          </p>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            ×{item.quantity}
          </span>
        </div>
        {item.orderSubMenuItems.length > 0 && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            +{" "}
            {item.orderSubMenuItems
              .map(
                (s) =>
                  `${s.subMenuItem.name.replace(/\.$/, "")} ×${s.quantity}`,
              )
              .join(", ")}
          </p>
        )}
      </div>

      <div className="text-right text-sm">
        <p className="font-semibold">₹{item.totalPrice}</p>
        <p className="text-xs text-muted-foreground">@ ₹{item.unitPrice}</p>
      </div>

      <OrderStausStatusBadge status={item.orderItemStatus} />

      <div className="flex items-center gap-2">
        {allowed.length === 0 ? (
          <span className="text-xs text-muted-foreground">No actions</span>
        ) : (
          <>
            {allowed.slice(0, 2).map((next) => (
              <Button
                key={next}
                size="sm"
                variant={next === "CANCELLED" ? "outline" : "default"}
                className={cn(
                  "h-8 rounded-lg",
                  next === "CANCELLED" &&
                    "border-status-cancelled-foreground/30 text-status-cancelled-foreground hover:bg-status-cancelled",
                )}
                onClick={() => onPick(order, item, next)}
              >
                {next === "CANCELLED" ? (
                  <X className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
                {labelFor(next)}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderStatusItemRow;
