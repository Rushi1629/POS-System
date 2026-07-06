import { Order, OrderItem, OrderStatus, TableOrders } from "@/types/order-status-types";
import { UserRole } from "@/types/types";
import React from "react";
import OrderStausStatusBadge from "./OrderStausStatusBadge";
import { cn } from "@/lib/utils";

const OrderStatusTableCard = ({
  table,
  role,
  onPick,
}: {
  table: TableOrders;
  role: UserRole;
  onPick: (order: Order) => void;
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-accent/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <span className="text-sm font-semibold">{table.tableName}</span>
          </div>
          <div>
            <h2 className="text-base font-semibold">Table {table.tableName}</h2>
            <p className="text-xs text-muted-foreground">
              {table.orders.length} order{table.orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {table.orders.map((order) => (
          <div key={order.orderId} className="px-6 py-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {order.orderNumber}
                </span>
                <OrderStausStatusBadge status={order.orderStatus} />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total </span>
                  <span className="font-semibold">₹{order.totalAmount}</span>
                </div>
                <button
                  onClick={() => onPick(order)}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  Update Order Status
                </button>
              </div>
            </div>

            <div className="space-y-2 opacity-75">
              {order.items.map((item) => {
                const cancelled =
                  item.isCancelled || item.orderItemStatus === "CANCELLED";
                return (
                  <div
                    key={item.orderItemId}
                    className={cn(
                      "flex flex-wrap items-center gap-4 rounded-xl border border-transparent bg-background/30 px-4 py-3",
                      cancelled && "opacity-60",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-sm",
                        item.menuItem.menuType === "Veg"
                          ? "bg-emerald-500/20 text-emerald-600"
                          : "bg-rose-500/20 text-rose-600",
                      )}
                    >
                      {item.menuItem.menuType === "Veg" ? "🥬" : "🔥"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "truncate font-medium text-sm",
                            cancelled && "line-through",
                          )}
                        >
                          {item.menuItem.name}
                        </p>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          ×{item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-semibold">₹{item.totalPrice}</p>
                    </div>

                    <OrderStausStatusBadge status={item.orderItemStatus} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTableCard;
