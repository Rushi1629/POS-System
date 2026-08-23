import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/Progress";
import { AlertTriangle } from "lucide-react";
import type { LowStockItem } from "@/types/dashboard-types";

export function LowStockAlerts({ items }: { items: LowStockItem[] }) {
  return (
    <Card className="border-border/60 shadow-(--shadow-card)">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-warning" /> Low Stock Alerts
        </CardTitle>
        <p className="text-xs text-muted-foreground">Restock these items soon</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((i) => {
          const pct = i.percentage;
          const critical = pct < 25;
          return (
            <div key={i.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{i.name}</span>
                <span className={critical ? "text-destructive font-semibold" : "text-warning font-semibold"}>
                  {pct}%
                </span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}