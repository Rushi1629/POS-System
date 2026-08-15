import React from "react";

const Detail = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-foreground">{children}</dd>
    </div>
  );
};

export default Detail;
