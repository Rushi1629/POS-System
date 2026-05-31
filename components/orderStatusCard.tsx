import React from "react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

function OrderStatusCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tone: "primary" | "amber" | "emerald" | "violet";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    violet: "bg-violet-500/10 text-violet-600",
  } as const;
  return (
    <Card className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            toneMap[tone],
          )}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
export default OrderStatusCard;
