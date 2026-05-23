import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "info" | "warning";
};

const toneMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/15 text-warning",
} as const;

export function KpiCard({ label, value, delta, hint, icon: Icon, tone = "primary" }: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="overflow-hidden border-border/60 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elevated)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          </div>
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs">
          {typeof delta === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta)}%
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}