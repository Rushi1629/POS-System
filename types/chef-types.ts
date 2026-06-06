export type ItemStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED";
export type OrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED";

export type KItem = {
  id: number;
  name: string;
  qty: number;
  note?: string;
  status: ItemStatus;
};

export type KOrder = {
  id: number;
  table: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  items: KItem[];
};

export const NEXT: Record<ItemStatus, ItemStatus | null> = {
  PENDING: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
  READY: "SERVED",
  SERVED: null,
};

export const STATUS_STYLES: Record<
  ItemStatus,
  { label: string; chip: string; dot: string; accent: string }
> = {
  PENDING: {
    label: "Pending",
    chip: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
    dot: "bg-amber-500",
    accent: "from-amber-500/60 to-amber-500/0",
  },
  ACCEPTED: {
    label: "Accepted",
    chip: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
    dot: "bg-sky-500",
    accent: "from-sky-500/60 to-sky-500/0",
  },
  PREPARING: {
    label: "Preparing",
    chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
    accent: "from-emerald-500/60 to-emerald-500/0",
  },
  READY: {
    label: "Ready",
    chip: "bg-primary/15 text-primary border-primary/30",
    dot: "bg-primary",
    accent: "from-primary/60 to-primary/0",
  },
  SERVED: {
    label: "Served",
    chip: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
    accent: "from-muted-foreground/30 to-transparent",
  },
};