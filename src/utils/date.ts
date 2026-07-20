export function formatISTTime(date?: Date): string {
  const d = date || new Date();
  return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export function formatRelativeTimeIST(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
