import { cn } from "@/lib/utils";
import React from "react";

const Json = ({
  title,
  value,
  danger,
}: {
  title: string;
  value: unknown;
  danger?: boolean;
}) => {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <pre
        className={cn(
          "overflow-x-auto rounded-xl border p-3 text-[11px] leading-relaxed",
          danger
            ? "border-destructive/30 bg-destructive/5 text-destructive"
            : "border-border bg-card",
        )}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
};

export default Json;
