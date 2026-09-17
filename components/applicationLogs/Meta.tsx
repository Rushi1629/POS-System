import React from "react";

const Meta = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-xs">{value}</p>
    </div>
  );
};

export default Meta;
