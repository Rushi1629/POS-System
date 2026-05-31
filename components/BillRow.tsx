"use client";

import { cn } from "@/lib/utils";

const BillRow = ({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-semibold tabular-nums",
          negative && "text-emerald-600",
        )}
      >
        {value}
      </span>
    </div>
  );
};

export default BillRow;
