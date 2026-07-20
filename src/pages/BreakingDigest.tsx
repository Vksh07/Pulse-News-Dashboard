import React, { useEffect, useState } from 'react';
import type { DigestResponse, DigestItem } from '../types';

export function BreakingDigest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [digest, setDigest] = useState<DigestResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch('/breaking-digest.json', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: DigestResponse) => {
        if (!cancelled) {
          setDigest(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load digest');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = () => {
    setRefreshing(true);
    setError(null);
    fetch('/breaking-digest.json?force=1', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: DigestResponse) => {
        setDigest(data);
        setRefreshing(false);
      })
      .catch((err) => {
        setError(err?.message || 'Refresh failed');
        setRefreshing(false);
      });
  };

  const items = Array.isArray(digest?.items) ? digest!.items : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200">Breaking Digest</span>
          <span className="text-[11px] text-slate-400">Summarized</span>
        </div>
        <div className="flex items-center gap-2">
          {digest?.generatedAt ? (
            <span className="text-[11px] text-slate-500">Generated: {new Date(digest.generatedAt).toLocaleString()}</span>
          ) : null}
          <button
            onClick={refresh}
            disabled={refreshing}
            className="text-[11px] font-bold uppercase tracking-wider border border-slate-700/60 bg-slate-900/70 text-slate-200 rounded-lg px-2 py-1 hover:border-slate-500 disabled:opacity-60"
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-400">Scraping and summarizing top 10 breaking stories…</p>}
      {error && <p className="text-sm text-red-300">Digest unavailable: {error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-slate-400">No summarized items yet.</p>
      )}

      <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
        {items.map((item: DigestItem) => (
          <a
            key={`${item.rank}-${item.url}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-slate-700/60 bg-slate-900/70 p-3 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-500 transition-all"
          >
            <div className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-7 h-7 rounded-md bg-amber-500/20 text-amber-200 flex items-center justify-center text-xs font-black">
                {item.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-extrabold text-white leading-snug">{item.title || 'Untitled'}</p>
                <p className="text-[12px] text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                  {item.summary || 'No summary available.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                  <span>{item.source}</span>
                  {item.published ? (
                    <>
                      <span>•</span>
                      <span>{new Date(item.published).toLocaleString()}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
