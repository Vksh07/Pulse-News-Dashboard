import React, { useMemo } from 'react';
import { useArticlesStore } from '../store';
import { BreakingNews } from '../components/articles/BreakingNews';

export function BreakingStream() {
  const { breaking } = useArticlesStore();
  const list = useMemo(() => (Array.isArray(breaking) ? breaking : []).slice(0, 40), [breaking]);

  return (
    <div className="space-y-6">
      <BreakingNews />
      <section aria-label="Rolling Breaking Stream" className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-90" />
            <span className="relative rounded-full bg-red-500 h-3 w-3" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200">Rolling Stream</span>
        </div>
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {list.map((item, idx) => (
            <a
              key={item.url || `rs-${idx}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-700/60 bg-slate-900/70 p-3 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-500 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-extrabold text-white leading-snug">{String(item.title || '').slice(0, 140)}</p>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{String(item.published || '').slice(0, 24)}</span>
              </div>
              {item.source ? (
                <div className="mt-1.5 text-[11px] text-slate-400">{String(item.source).slice(0, 80)}</div>
              ) : null}
              <div className="mt-2 h-px bg-gradient-to-r from-red-500/30 via-orange-500/20 to-transparent" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
