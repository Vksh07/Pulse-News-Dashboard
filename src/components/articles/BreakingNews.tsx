import React from 'react';
import { useArticlesStore } from '../../store';
import { formatRelativeTime } from '../../utils';
import type { BreakingArticle } from '../../types';
import { Bookmark, Volume2, ExternalLink, Zap, Flame } from 'lucide-react';

const ACCENTS = [
  { border: 'border-l-red-500', bg: 'bg-red-500/[0.10]', ring: 'shadow-[0_0_0_1px_rgba(239,68,68,0.35)]', badge: 'bg-red-500/25 text-red-200', glow: 'shadow-[0_0_18px_rgba(239,68,68,0.35)]' },
  { border: 'border-l-orange-500', bg: 'bg-orange-500/[0.10]', ring: 'shadow-[0_0_0_1px_rgba(249,115,22,0.30)]', badge: 'bg-orange-500/25 text-orange-200', glow: 'shadow-[0_0_14px_rgba(249,115,22,0.30)]' },
  { border: 'border-l-yellow-500', bg: 'bg-yellow-500/[0.10]', ring: 'shadow-[0_0_0_1px_rgba(234,179,8,0.30)]', badge: 'bg-yellow-500/25 text-yellow-200', glow: 'shadow-[0_0_14px_rgba(234,179,8,0.30)]' },
  { border: 'border-l-emerald-500', bg: 'bg-emerald-500/[0.10]', ring: 'shadow-[0_0_0_1px_rgba(16,185,129,0.30)]', badge: 'bg-emerald-500/25 text-emerald-200', glow: '' },
  { border: 'border-l-sky-500', bg: 'bg-sky-500/[0.10]', ring: 'shadow-[0_0_0_1px_rgba(14,165,233,0.30)]', badge: 'bg-sky-500/25 text-sky-200', glow: '' },
  { border: 'border-l-violet-500', bg: 'bg-violet-500/[0.10]', ring: 'shadow-[0_0_0_1px_rgba(139,92,246,0.30)]', badge: 'bg-violet-500/25 text-violet-200', glow: '' },
];

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function BreakingNews() {
  const { breaking } = useArticlesStore();
  const data = Array.isArray(breaking) ? breaking : [];
  const list = data.slice(0, 6);

  if (!list.length) return null;

  const Card = ({ item, idx }: { item: BreakingArticle; idx: number }) => {
    const a = ACCENTS[idx % ACCENTS.length];
    const title = decodeHtmlEntities((item.title || '').trim()) || 'Breaking update';
    const source = decodeHtmlEntities((item.source || '').trim()) || '';
    const excerpt = decodeHtmlEntities((item.enrichment?.excerpt || item.snippet || '').trim());

    return (
      <article
        className={[
          'min-w-0 flex-1 basis-[min(100%,340px)] rounded-xl border border-slate-700/60 bg-slate-950/60 transition-all duration-200',
          'hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-500',
          a.border,
          a.bg,
          a.ring,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span
                className={[
                  'h-8 w-8 rounded-lg flex-shrink-0 leading-none inline-flex items-center justify-center text-[11px] font-black',
                  a.badge,
                  a.glow,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-extrabold text-white leading-snug tracking-tight">{title}</p>
                {excerpt ? (
                  <p className="mt-2 text-[13px] text-slate-300 leading-relaxed line-clamp-3">{excerpt}</p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
                    {source}
                  </span>
                  <span>{item.published ? formatRelativeTime(item.published) : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </article>
    );
  };

  return (
    <section aria-label="Breaking News" className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-90" />
          <span className="relative rounded-full bg-red-500 h-3 w-3" />
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200">Breaking</span>
        <Flame className="h-3.5 w-3.5 text-orange-300 animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-3 min-w-0">
        {list.map((item, idx) => (
          <Card key={item.url || `${idx}-${item.title}`} item={item} idx={idx} />
        ))}
      </div>
    </section>
  );
}
