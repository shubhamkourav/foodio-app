export function formatETA(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = Math.round(minutes % 60);
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function formatETAFromDate(isoDate: string): string {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.round((target - now) / 60000));
  return formatETA(diffMinutes);
}
