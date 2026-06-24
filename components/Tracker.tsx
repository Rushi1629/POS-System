import { cn } from "@/lib/utils";
import { Order, STEPS } from "@/types/customer-order-types";
import { statusIndex } from "@/utils/utils";
import { CheckCheck, CircleDot } from "lucide-react";
import React from "react";

const Tracker = ({ status }: { status: Order["orderStatus"] }) => {
  const idx = Math.max(0, statusIndex(status));

  return (
    <div className="border-t border-border bg-background px-5 py-5">
      <div className="relative flex items-start justify-between">
        {/* progress line */}
        <div className="absolute left-5 right-5 top-4 h-0.5 bg-border" />
        <div
          className="absolute left-5 top-4 h-0.5 bg-primary transition-all"
          style={{
            width: `calc((100% - 2.5rem) * ${idx / (STEPS.length - 1)})`,
          }}
        />

        {STEPS.map((step, i) => {
          const done = i < idx;
          const current = i === idx;
          const Icon = step.icon;
          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-1 flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition",
                  done && "border-primary bg-primary text-primary-foreground",
                  current &&
                    "border-primary bg-background text-primary ring-4 ring-primary/20 animate-pulse",
                  !done &&
                    !current &&
                    "border-border bg-background text-muted-foreground",
                )}
              >
                {done ? (
                  <CheckCheck className="h-4 w-4" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  current
                    ? "text-primary"
                    : done
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {current && (
                <span className="flex items-center gap-1 text-[10px] text-primary">
                  <CircleDot className="h-2.5 w-2.5" /> Now
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracker;
