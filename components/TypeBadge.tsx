import { TableType } from "@/types/table-types";
import { Badge } from "./ui/badge";

function TypeBadge({ type }: { type: TableType }) {
  return (
    <Badge
      variant="secondary"
      className="rounded-full text-[10px] font-semibold tracking-wide"
    >
      {type}
    </Badge>
  );
}

export default TypeBadge;
