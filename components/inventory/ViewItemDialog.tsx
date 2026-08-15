import { InventoryItem, stockState } from "@/types/inventory-types";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Package } from "lucide-react";
import StockBadge from "./StockBadge";
import { cn } from "@/lib/utils";
import Detail from "./Detail";
import { Badge } from "../ui/badge";
import { Button } from "../button";

const ViewItemDialog = ({
  item,
  onOpenChange,
}: {
  item: InventoryItem | null;
  onOpenChange: (v: boolean) => void;
}) => {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135 max-h-[85vh] flex flex-col">
        {item && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {item.name}
              </DialogTitle>
              <DialogDescription>
                SKU <span className="font-medium">{item.sku}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto px-2 no-scrollbar">
              <div className="rounded-xl border border-border/70 bg-card p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Current stock
                    </p>
                    <p className="mt-1 text-3xl font-bold text-foreground">
                      {item.quantity}{" "}
                      <span className="text-base font-medium text-muted-foreground">
                        {item.unit}
                      </span>
                    </p>
                  </div>
                  <StockBadge state={stockState(item)} />
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      stockState(item) === "OK"
                        ? "bg-primary"
                        : "bg-destructive",
                    )}
                    style={{
                      width: `${Math.min(
                        100,
                        item.lowStockThreshold > 0
                          ? (item.quantity / (item.lowStockThreshold * 3)) * 100
                          : 100,
                      )}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Low-stock alert triggers at {item.lowStockThreshold}{" "}
                  {item.unit}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Status">
                  <Badge variant={item.isActive ? "default" : "outline"}>
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Detail>
                <Detail label="Unit">{item.unit}</Detail>
                <Detail label="Created">
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Detail>
                <Detail label="Last updated">
                  {new Date(item.updatedAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Detail>
                <div className="col-span-2">
                  <Detail label="Inventory ID">
                    <code className="break-all text-xs">
                      {item.inventoryId}
                    </code>
                  </Detail>
                </div>
              </dl>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewItemDialog;
