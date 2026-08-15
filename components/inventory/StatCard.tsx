import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

const StatCard = ({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  tone: "primary" | "success" | "warning" | "danger";
}) => {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-secondary text-secondary-foreground",
    warning: "bg-accent text-accent-foreground",
    danger: "bg-destructive/10 text-destructive",
  };
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            tones[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
};

export default StatCard;
