import React from "react";
import { Card, CardContent } from "./ui/card";

function StatCard({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tint: "primary" | "emerald" | "muted";
}) {
  const tintCls =
    tint === "primary"
      ? "bg-[#cd4805]/10 text-[#cd4805]"
      : tint === "emerald"
        ? "bg-chart-2/15 text-chart-2"
        : "bg-muted text-muted-foreground";
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
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${tintCls}`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
export default StatCard;
