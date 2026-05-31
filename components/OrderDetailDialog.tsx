import { Order, STATUS_META } from "@/types/order-types";
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Receipt } from "lucide-react";
import { Badge } from "./ui/badge";
import InfoTile from "./InfoTile";
import { fmt } from "@/utils/utils";
import { cn } from "@/lib/utils";

const OrderDetailDialog = ({
  order,
  onOpenChange,
}: {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!order) return null;
  const status = STATUS_META[order.status];
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Order #{order.id}
            <Badge
              variant="outline"
              className={cn("ml-2 rounded-full border", status.cls)}
            >
              {status.label}
            </Badge>
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          <InfoTile label="Type" value={order.orderType.replace("_", " ")} />
          <InfoTile label="Table" value={`#${order.tableId}`} />
          <InfoTile label="Payment" value={order.paymentStatus} />
        </div>

        <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-xl border border-border p-3">
          {order.items.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary">
                  ×{i.quantity}
                </span>
                <div>
                  <p className="text-sm font-semibold">{i.menuItem.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {fmt(i.unitPrice)} each
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold tabular-nums">
                {fmt(i.totalPrice)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-primary/5 p-4">
          <span className="text-sm font-semibold">Total Amount</span>
          <span className="text-2xl font-bold tabular-nums text-primary">
            {fmt(order.totalAmount)}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
