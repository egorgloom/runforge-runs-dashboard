export function formatDuration(seconds?: number): string {
  if (seconds == null || seconds < 0) return "—";
  if (seconds < 60) return `${seconds} sec`;

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} sec`;
}
