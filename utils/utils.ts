import { ItemStatus, STATUS_TRANSITIONS } from "@/types/chef-types";
import { Order, STEPS } from "@/types/customer-order-types";
import { UserRole } from "@/types/types";

// 🧠 Timer formatter
function formatDuration(startTime: string) {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);

  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m ${secs}s`;
}

function getPageNumbers(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  const pages: Array<number | "ellipsis"> = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 3) pages.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// 🧠 Format minutes to "X hr Y min" format
function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}

const fmt = (n: number | string) =>
  `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function statusIndex(s: Order["orderStatus"]) {
  return STEPS.findIndex((x) => x.key === s);
}

function getNextStatus(
  current: ItemStatus,
  role: UserRole,
  isCancelled?: boolean,
): ItemStatus | null {
  if (isCancelled) return null;

  const transition = STATUS_TRANSITIONS.find(
    (t) =>
      (t.from === current || t.from === "ANY") &&
      t.roles.includes(role) &&
      t.to !== "CANCELLED", // 🔥 ignore cancel here
  );

  return transition ? (transition.to as ItemStatus) : null;
}

const inr = (v: string | number) =>
  `₹${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const numberValue = (value: unknown): number =>
  typeof value === "number" ? value : Number(value ?? 0);

const formatCurrency = (value: unknown): string =>
  `₹${numberValue(value).toLocaleString("en-IN")}`;

const parseDateInput = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDashboardDate = (value: string): string =>
  parseDateInput(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const firstValue = (
  item: Record<string, unknown>,
  keys: string[],
): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }
  return undefined;
};

const toRecordArray = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }
  return [];
};

export {
  formatDuration,
  getPageNumbers,
  delay,
  formatMinutes,
  fmt,
  statusIndex,
  getNextStatus,
  inr,
  fmtDate,
  numberValue,
  formatCurrency,
  parseDateInput,
  formatDateInput,
  formatDashboardDate,
  firstValue,
  toRecordArray,
};
