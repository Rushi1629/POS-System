import {
  ActiveTarget,
  getAllowedTransitions,
  labelFor,
  OrderStatus,
} from "@/types/order-status-types";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import OrderStausStatusBadge from "./OrderStausStatusBadge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import OrderStatusWorkflow from "./OrderStatusWorkflow";
import { UserRole } from "@/types/types";

const OrderStatusUpdateDialog = ({
  open,
  target,
  role,
  pending,
  submitting,
  onPending,
  onClose,
  onConfirm,
}: {
  open: boolean;
  target: ActiveTarget | null;
  role: UserRole;
  pending: OrderStatus | null;
  submitting: boolean;
  onPending: (s: OrderStatus) => void;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const allowed = target ? getAllowedTransitions(target.orderStatus, role) : [];
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={cn(
          "w-[95vw] sm:max-w-[560px]", // mobile full width
          "max-h-[90vh] flex flex-col overflow-hidden",
          "p-0",
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b bg-muted/30 px-4 sm:px-6 py-4">
          <DialogTitle>Update order status</DialogTitle>
          <DialogDescription>
            {target && (
              <>
                <span className="font-medium text-foreground">
                  Order #{target.orderNumber ?? target.orderId}
                </span>{" "}
                · {target.tableName}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {target && (
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 py-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Current order status
              </div>
              <OrderStausStatusBadge status={target.orderStatus} />
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Move to
              </p>
              <div className="grid grid-cols-2 gap-2">
                {allowed.map((s) => {
                  const active = pending === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onPending(s)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all",
                        active
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border hover:border-primary/50 hover:bg-accent/50",
                      )}
                    >
                      <span className="text-sm font-medium">{labelFor(s)}</span>
                      <span
                        className={cn(
                          "ml-2 flex h-5 w-5 items-center justify-center rounded-full",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {active ? <Check className="size-3" /> : null}
                      </span>
                    </button>
                  );
                })}
                {allowed.length === 0 && (
                  <p className="col-span-2 rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    No order transitions are available for the “{role}” role
                    from <strong>{target.orderStatus}</strong>.
                  </p>
                )}
              </div>
            </div>

            <OrderStatusWorkflow current={target.orderStatus} next={pending} />
          </div>
        )}

        <div className="border-t px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={!pending || submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? "Updating…" : "Confirm update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusUpdateDialog;
