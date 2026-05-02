import React from 'react'
import { Badge } from './ui/badge';

function StatusPill({ active }: { active: boolean }) {
  return active ? (
    <Badge className="rounded-full border-0 bg-[#f77f00]/15 px-3 py-1 font-medium text-[#f77f00] hover:bg-#f77f00/15">
      Active
    </Badge>
  ) : (
    <Badge className="rounded-full border-0 bg-muted px-3 py-1 font-medium text-muted-foreground hover:bg-muted">
      Inactive
    </Badge>
  );
}

export default StatusPill