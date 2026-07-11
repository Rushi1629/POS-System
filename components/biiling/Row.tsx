import React from "react";

const Row = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
};

export default Row;
