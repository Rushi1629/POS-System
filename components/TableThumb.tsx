import { TableType } from "@/types/table-types";
import { Armchair } from "lucide-react";

function TableThumb({ name, type }: { name: string; type: TableType }) {
  const tint =
    type === "FAMILY"
      ? "from-primary/20 to-primary/5 text-primary"
      : type === "POD"
        ? "from-chart-2/25 to-chart-2/5 text-chart-2"
        : "from-accent/40 to-accent/10 text-foreground";
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${tint} ring-1 ring-border`}
      title={name}
    >
      <Armchair className="h-5 w-5" />
    </div>
  );
}

export default TableThumb;