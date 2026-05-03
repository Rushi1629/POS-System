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

function getPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
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


export { formatDuration, getPageNumbers, delay };