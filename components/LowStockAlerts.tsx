import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/Progress";
import { AlertTriangle } from "lucide-react";

const items = [
  { name: "Chicken (kg)", value: 14, total: 100 },
  { name: "Buns (pcs)", value: 24, total: 100 },
  { name: "Cheese Slice", value: 32, total: 100 },
  { name: "Lettuce (kg)", value: 48, total: 100 },
];

export function LowStockAlerts() {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-warning" /> Low Stock Alerts
        </CardTitle>
        <p className="text-xs text-muted-foreground">Restock these items soon</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((i) => {
          const pct = (i.value / i.total) * 100;
          const critical = pct < 25;
          return (
            <div key={i.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{i.name}</span>
                <span className={critical ? "text-destructive font-semibold" : "text-warning font-semibold"}>
                  {i.value}%
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