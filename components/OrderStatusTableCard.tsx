import { OrderItem, OrderStatus, TableOrders } from "@/types/order-status-types";
import { UserRole } from "@/types/types";
import React from "react";
import OrderStatusItemRow from "./OrderStatusItemRow";
import OrderStausStatusBadge from "./OrderStausStatusBadge";

const OrderStatusTableCard = ({
  table,
  role,
  onPick,
}: {
  table: TableOrders;
  role: UserRole;
  onPick: (item: OrderItem, status: OrderStatus) => void;
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
              <div className="text-sm">
                <span className="text-muted-foreground">Total </span>
                <span className="font-semibold">₹{order.totalAmount}</span>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <OrderStatusItemRow
                  key={item.orderItemId}
                  item={item}
                  role={role}
                  onPick={onPick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTableCard;
