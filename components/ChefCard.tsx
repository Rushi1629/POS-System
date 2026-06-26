"use client";
import { ItemStatus, KOrder, NEXT, STATUS_STYLES } from "@/types/chef-types";
import React from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Clock, StickyNote } from "lucide-react";
import { Button } from "./ui/button";

const ChefCard = ({
  order,
  onAdvance,
  onBumpAll,
}: {
  order: KOrder;
  onAdvance: (itemId: number) => void;
  onBumpAll: () => void;
}) => {
  const allServed = order.items.every((i) => i.status === "SERVED");
  const headerTone = STATUS_STYLES[order.status as ItemStatus];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Accent bar */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[0.9px] bg-gradient-to-r",
          headerTone.accent,
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight">{order.table}</h3>
            <Badge variant="outline" className={cn("border", headerTone.chip)}>
              {headerTone.label}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {order.orderNumber}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {order.placedAt}
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-2 px-5">
        {order.items.map((item) => {
          const s = STATUS_STYLES[item.status];
          const next = NEXT[item.status];
          const isCancelled = item.isCancelled;
          return (
            <div
              key={item.id}
              className="group/item flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 transition-colors hover:bg-muted"
            >
              <span className={cn("h-2 w-2 shrink-0 rounded-full", s.dot)} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <span className="text-xs font-medium text-muted-foreground">
                    ×{item.qty}
                  </span>
                  {isCancelled && (
                    <span className="text-[10px] font-semibold text-red-500">
                      Cancelled
                    </span>
                  )}
                </div>
                {item.note && (
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-300">
                    <StickyNote className="h-3 w-3" />
                    {item.note}
                  </p>
                )}
              </div>
              <Badge variant="outline" className={cn("border", s.chip)}>
                {s.label}
              </Badge>
              {!isCancelled && next ? (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                  onClick={() => onAdvance(item.id)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center text-muted-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 px-5 py-3">
        <p className="text-xs text-muted-foreground">
          {order.items.length} items
        </p>
        <Button
          size="sm"
          variant={allServed ? "outline" : "default"}
          disabled={allServed}
          onClick={onBumpAll}
          className="h-8 rounded-full"
        >
          {allServed ? "Completed" : "Bump all"}
          {!allServed && <ArrowRight className="ml-1 h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
};

export default ChefCard;
