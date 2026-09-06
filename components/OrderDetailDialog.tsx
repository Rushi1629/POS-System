import { OrderAdminChef, STATUS_META } from "@/types/order-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Receipt } from "lucide-react";
import { Badge } from "./ui/badge";
import InfoTile from "./InfoTile";
import { fmt } from "@/utils/utils";
import { cn } from "@/lib/utils";

const OrderDetailDialog = ({
  order,
  onOpenChange,
}: {
  order: OrderAdminChef | null;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!order) return null;
  const status = STATUS_META[order.orderStatus];
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-160 max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            {order.orderNumber}
            <Badge
              variant="outline"
              className={cn("ml-2 rounded-full border", status?.cls)}
            >
              {status.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          <InfoTile label="Type" value={order.orderType.replace("_", " ")} />
          <InfoTile label="Table" value={`${order.tableName}`} />
          <InfoTile label="Payment" value={order.paymentStatus} />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-border space-y-2 p-3 no-scrollbar">
          {order.items.map((i, idx) => (
            <div
              key={i.orderId + idx}
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
