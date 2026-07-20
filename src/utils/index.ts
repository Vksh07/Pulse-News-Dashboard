export const today = (): string => new Date().toISOString().slice(0, 10);
export const formatTime = (iso: string): string => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
export const formatRelativeTime = (iso: string): string => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
};
export const escapeHtml = (s: string): string =>
  String(s || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[m] as string));
export const unescapeHtml = (s: string): string => {
  if (!s) return '';
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
};
export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
export const formatNumber = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
