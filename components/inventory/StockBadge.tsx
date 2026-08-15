import { cn } from "@/lib/utils";
import React from "react";

const StockBadge = ({ state }: { state: "OUT" | "LOW" | "OK" }) => {
  const map = {
    OK: {
      label: "In Stock",
      cls: "bg-primary/10 text-primary",
      dot: "bg-primary",
    },
    LOW: {
      label: "Low Stock",
      cls: "bg-accent text-accent-foreground",
      dot: "bg-accent-foreground",
    },
    OUT: {
      label: "Out of Stock",
      cls: "bg-destructive/10 text-destructive",
      dot: "bg-destructive",
    },
  } as const;
  const s = map[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        s.cls,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
};

export default StockBadge;
