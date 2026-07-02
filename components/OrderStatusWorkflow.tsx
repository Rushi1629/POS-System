import { cn } from "@/lib/utils";
import { OrderStatus, STATUS_ORDER, STATUS_STYLES } from "@/types/order-status-types";
import { ChevronRight } from "lucide-react";
import React from "react";

const OrderStatusWorkflow = ({
  current,
  next,
}: {
  current: OrderStatus;
  next: OrderStatus | null;
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
        Workflow
      </p>
      <div className="flex items-center gap-1 overflow-x-auto">
        {STATUS_ORDER.map((s, i) => {
          const isCurrent = s === current;
          const isNext = s === next;
          const reached = STATUS_ORDER.indexOf(current) >= i;
          return (
            <div key={s} className="flex items-center gap-1">
              <div
                className={cn(
                  "rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
                  isNext
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : isCurrent
                      ? STATUS_STYLES[s]
                      : reached
                        ? "bg-muted text-foreground"
                        : "bg-muted text-muted-foreground",
                )}
              >
                {s}
              </div>
              {i < STATUS_ORDER.length - 1 && (
                <ChevronRight className="size-3 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusWorkflow;
