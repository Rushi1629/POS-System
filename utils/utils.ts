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


export { formatDuration };