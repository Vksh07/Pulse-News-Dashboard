import React, { useEffect, useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useArticlesStore, useGamificationStore, useUIStore } from '../store';
import { formatRelativeTime, escapeHtml, cn } from '../utils';
import { ArticleCard } from '../components/articles/ArticleCard';
import { BreakingNews } from '../components/articles/BreakingNews';
import { StatusLine } from '../components/ui/StatusLine';
import { RescanButton } from '../components/ui/RescanButton';
import { ADHDWidgetDock } from '../components/adhd/ADHDWidgetDock';

const TOPICS = [
  { id: 'india', label: '🇮🇳 India', color: 'from-yellow-500/20 to-yellow-500/5', border: 'rgba(234, 179, 8, 0.55)' },
  { id: 'tamilnadu', label: '📍 Tamil Nadu', color: 'from-blue-500/20 to-blue-500/5', border: 'rgba(59, 130, 246, 0.55)' },
  { id: 'andhra', label: '📍 Andhra Pradesh', color: 'from-purple-500/20 to-purple-500/5', border: 'rgba(139, 92, 246, 0.55)' },
  { id: 'world', label: '🌍 International', color: 'from-green-500/20 to-green-500/5', border: 'rgba(34, 197, 94, 0.55)' },
  { id: 'governance', label: '⚖️ Governance', color: 'from-sky-500/20 to-sky-500/5', border: 'rgba(14, 165, 233, 0.55)' },
  { id: 'ethics', label: '🧭 Ethics', color: 'from-amber-500/20 to-amber-500/5', border: 'rgba(245, 158, 11, 0.55)' },
  { id: 'ir_security', label: '🛡️ IR & Security', color: 'from-rose-500/20 to-rose-500/5', border: 'rgba(244, 63, 94, 0.55)' },
  { id: 'education', label: '🎓 Education & HR', color: 'from-teal-500/20 to-teal-500/5', border: 'rgba(20, 184, 166, 0.55)' },
  { id: 'economy_industry', label: '📈 Economy & Industry', color: 'from-emerald-500/20 to-emerald-500/5', border: 'rgba(16, 185, 129, 0.55)' },
  { id: 'environment_science', label: '🌱 Environment & Science', color: 'from-lime-500/20 to-lime-500/5', border: 'rgba(101, 163, 13, 0.55)' },
  { id: 'society_media', label: '👥 Society & Media', color: 'from-pink-500/20 to-pink-500/5', border: 'rgba(236, 72, 153, 0.55)' },
  { id: 'sports', label: '🏏 Sports', color: 'from-red-500/20 to-red-500/5', border: 'rgba(239, 68, 68, 0.55)' },
  { id: 'national_sports', label: '🏟️ National Sports', color: 'from-fuchsia-500/20 to-fuchsia-500/5', border: 'rgba(217, 70, 239, 0.55)' },
  { id: 'international_sports', label: '🌐 Intl. Sports', color: 'from-indigo-500/20 to-indigo-500/5', border: 'rgba(99, 102, 241, 0.55)' },
  { id: 'tech_ai', label: '💻 Tech & AI', color: 'from-cyan-500/20 to-cyan-500/5', border: 'rgba(6, 182, 212, 0.55)' },
  { id: 'health_medicine', label: '🏥 Health & Medicine', color: 'from-green-500/20 to-green-500/5', border: 'rgba(34, 197, 94, 0.55)' },
  { id: 'psychology', label: '🧠 Psychology', color: 'from-violet-500/20 to-violet-500/5', border: 'rgba(139, 92, 246, 0.55)' },
  { id: 'sexology', label: '🔬 Sexology', color: 'from-fuchsia-500/20 to-fuchsia-500/5', border: 'rgba(217, 70, 239, 0.55)' },
  { id: 'finance', label: '💰 Finance', color: 'from-emerald-500/20 to-emerald-500/5', border: 'rgba(16, 185, 129, 0.55)' },
  { id: 'earnings', label: '💼 Earning Opportunities', color: 'from-orange-500/20 to-orange-500/5', border: 'rgba(249, 115, 22, 0.55)' },
];

const TOPIC_BORDER = Object.fromEntries(TOPICS.map(t => [t.id, t.border]));

function TopicPills() {
  const { activeTopics, toggleTopic } = useArticlesStore();
  const base = 'inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors border';
  const active = 'bg-white text-black border-white';
  const inactive = 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500';
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Topic filters">
      {TOPICS.map(topic => (
        <button
          key={topic.id}
          onClick={() => toggleTopic(topic.id)}
          className={cn(base, activeTopics.has(topic.id) ? active : inactive)}
          aria-pressed={activeTopics.has(topic.id)}
        >
          {topic.label}
        </button>
      ))}
    </div>
  );
}

function ArticleGrid({ onArticleRead }: { onArticleRead?: (article: { id?: string; url?: string }) => void } = {}) {
  const { filteredArticles, isLoading, error, isFocusMode, isUPSCLens, activeTopics } = useArticlesStore();
  const { awardXP } = useGamificationStore();

  const handleMarkRead = (article: { id?: string; url?: string; title?: string }) => {
    onArticleRead?.(article);
    awardXP(5);
  };

  if (isLoading && filteredArticles.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl p-3 bg-slate-900/50 border border-slate-800/50">
            <div className="skeleton h-3 w-1/3 mb-2" />
            <div className="skeleton h-4 w-4/5 mb-1.5" />
            <div className="skeleton h-4 w-3/5 mb-2" />
            <div className="skeleton h-3 w-full mb-1" />
            <div className="skeleton h-3 w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-10">
        <div className="text-3xl mb-3">⚠️</div>
        <p className="text-red-400 font-medium mb-1.5">Connection error</p>
        <p className="text-xs text-slate-500 mb-3">Could not reach the news server</p>
        <RescanButton />
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-3 opacity-50">📭</div>
        <p className="text-slate-300 font-medium text-sm">No articles match your filters</p>
        <p className="text-[11px] text-slate-500 mt-1">Try adjusting your topic selection</p>
      </div>
    );
  }

  const grouped: Record<string, typeof filteredArticles> = {};
  for (const article of filteredArticles) {
    const topic = article.topic || 'india';
    if (!activeTopics.has(topic)) continue;
    if (!grouped[topic]) grouped[topic] = [];
    grouped[topic].push(article);
  }

  const topicMeta: Record<string, { unread: number; topSource: string; latest: string }> = {};
  for (const topic of Object.keys(grouped)) {
    const items = grouped[topic];
    const unread = items.filter(a => !a.read).length;
    const sourceCount: Record<string, number> = {};
    let latest = items[0]?.published || '';
    for (const a of items) {
      sourceCount[a.source || 'Unknown'] = (sourceCount[a.source || 'Unknown'] || 0) + 1;
      if (a.published && a.published > latest) latest = a.published;
    }
    const topSource = Object.entries(sourceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    topicMeta[topic] = { unread, topSource, latest };
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 min-w-0">
      {TOPICS.map(topic => {
        const topicId = topic.id;
        const articles = grouped[topicId] || [];
        const label = topic.label;
        const borderColor = topic.border;
        const meta = topicMeta[topicId];

        return (
          <section key={topicId} className="rounded-xl border border-slate-700/80 bg-slate-900/70 overflow-hidden h-[560px] flex flex-col" style={{ borderColor }}>
            <div className="flex flex-col gap-2 px-4 py-3 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest border" style={{ color: borderColor, borderColor, background: 'rgba(255,255,255,0.04)' }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: borderColor }} />
                  {label}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-900/60 border border-slate-800/70 rounded-full px-2 py-0.5">{articles.length}</span>
              </div>
              {articles.length > 0 && meta && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-400">Top: {meta.topSource}</span>
                  <span className="text-slate-700">|</span>
                  <span>{meta.unread} unread</span>
                  <span className="text-slate-700">|</span>
                  <span>Latest: {formatRelativeTime(meta.latest)}</span>
                </div>
              )}
            </div>
            <div className="px-3 pb-2 overflow-y-auto flex-1 min-h-0">
              {articles.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-[11px]">No articles in this topic right now</div>
              ) : (
                articles.map((article, idx) => (
                  <div key={article.id || article.url} className="border-b border-slate-800/70 last:border-b-0">
                    <ArticleCard
                      article={article}
                      index={idx}
                      onMarkRead={handleMarkRead}
                      compact
                    />
                  </div>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function Dashboard() {
  const { refresh, isLoading, filteredArticles, activeTopics, toggleTopic, error, lastUpdated, lastRefreshedAt, newArticleCount, clearNewCounts, resetRefreshError } = useArticlesStore();
  const { streak, level } = useGamificationStore();
  const { setCurrentPage } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const mountedRef = useRef(false);
  const pollingRef = useRef<number | null>(null);
  const staleTimerRef = useRef<number | null>(null);
  const markReadRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  const doRefresh = useCallback(async (opts?: Parameters<typeof refresh>[0]) => {
    if (!mountedRef.current) return;
    await refresh(opts);
    if (!mountedRef.current) return;
    if (newArticleCount > 0) {
      setShowNew(true);
    }
    clearNewCounts();
  }, [refresh, clearNewCounts, newArticleCount]);

  useEffect(() => {
    mountedRef.current = true;
    setMounted(true);
    setCurrentPage('dashboard');

    // Seed initial state once; periodic refresh is handled by polling/stale timers.
    if (!initializedRef.current) {
      initializedRef.current = true;
      doRefresh({ force: true, retryOnFail: false });
    }

    const startPolling = () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = window.setInterval(() => {
        doRefresh();
      }, 180000);
    };

    const markStale = () => {
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
      staleTimerRef.current = window.setTimeout(() => {
        if (!mountedRef.current) return;
        const state = useArticlesStore.getState();
        if (state.lastRefreshedAt && !state.isLoading && state.error === null) {
          doRefresh({ force: true, retryOnFail: true });
        }
      }, 300000);
    };

    startPolling();
    markStale();

    return () => {
      mountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
      pollingRef.current = null;
      staleTimerRef.current = null;
    };
  }, [doRefresh, setCurrentPage, refresh, clearNewCounts, newArticleCount]);

  const handleRescan = useCallback(async () => {
    setShowNew(false);
    resetRefreshError();
    await refresh({ force: true, retryOnFail: true });
  }, [refresh, resetRefreshError]);

  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => {
      if (!mountedRef.current || error === null) return;
      resetRefreshError();
      doRefresh({ force: true, retryOnFail: true });
    }, 12000);
    return () => clearTimeout(t);
  }, [error, doRefresh, resetRefreshError]);

  useEffect(() => {
    if (!showNew) return;
    const t = window.setTimeout(() => setShowNew(false), 4000);
    return () => clearTimeout(t);
  }, [showNew, filteredArticles.length]);

  const handleArticleRead = useCallback((article: { id?: string; url?: string }) => {
    const id = article.id || article.url;
    if (!id || markReadRef.current.has(id)) return;
    markReadRef.current.add(id);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-9 w-9 border-2 border-slate-600 border-t-yellow-500" />
          <p className="text-xs text-slate-500">Loading Pulse…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-extrabold text-white tracking-tight">📰 Pulse</h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/15">
            Lv.{level}
          </span>
          {showNew && newArticleCount > 0 && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 animate-pulse">
              +{newArticleCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />}
          <StatusLine />
          <RescanButton />
          {error && (
            <button
              onClick={handleRescan}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/20"
            >
              Retry
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        <BreakingNews />
      </div>

      <TopicPills />

      <div className="grid grid-cols-1 gap-4">
        <ArticleGrid onArticleRead={handleArticleRead} />
      </div>
    </div>
  );
}
