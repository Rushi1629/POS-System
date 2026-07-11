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
    (t) => (t.from === current || t.from === "ANY") && t.roles.includes(role),
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
};
