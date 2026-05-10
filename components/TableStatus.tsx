import { statusMap } from "@/types/table-types";

import type { TableStatus } from "@/types/table-types";
import { Badge } from "./ui/badge";

const TableStatusCustom = ({ status }: { status: TableStatus }) => {
  const config = statusMap[status];

  return (
    <Badge
      className={`rounded-full border-0 px-3 py-1 font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
};

export default TableStatusCustom;
