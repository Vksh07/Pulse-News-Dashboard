import React, { useEffect, useMemo, useState } from 'react';
import { useArticlesStore } from '../store';
import { BreakingNews } from '../components/articles/BreakingNews';
import { ArticleCard } from '../components/articles/ArticleCard';

const TOPICS = [
  { id: 'all', label: 'All' },
  { id: 'india', label: '🇮🇳 India' },
  { id: 'world', label: '🌍 International' },
  { id: 'finance', label: '💰 Finance' },
  { id: 'sports', label: '🏏 Sports' },
];

export function FlexDashboard() {
  const { refresh, filteredArticles } = useArticlesStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 300000);
    return () => clearInterval(interval);
  }, [refresh]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (id === 'all') {
        const all = new Set(TOPICS.map(t => t.id).filter(x => x !== 'all'));
        return next.size === all.size ? new Set() : all;
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const grouped = useMemo(() => {
    const acc: Record<string, any[]> = {};
    for (const article of filteredArticles) {
      const topic = article.topic || 'india';
      if (!acc[topic]) acc[topic] = [];
      acc[topic].push(article);
    }
    const keys = selected.size ? selected : new Set(TOPICS.map(t => t.id).filter(id => id !== 'all'));
    const out: Record<string, any[]> = {};
    for (const id of keys) {
      if (acc[id]?.length) out[id] = acc[id];
    }
    return out;
  }, [filteredArticles, selected]);

  return (
    <div className="space-y-5">
      <BreakingNews />

      <div className="flex flex-row gap-2 overflow-x-auto">
        {TOPICS.map((topic) => {
          const allExcept = TOPICS.map(t => t.id).filter(x => x !== 'all');
          const active = topic.id === 'all' ? selected.size === allExcept.length : selected.has(topic.id);
          const base = 'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors select-none';
          const cls = active
            ? base + ' border-white/30 bg-white/10 text-white'
            : base + ' border-slate-700/60 bg-slate-900/70 text-slate-400 hover:border-slate-600';
          return (
            <button key={topic.id} onClick={() => toggle(topic.id)} className={cls}>
              {topic.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOPICS.filter((topicItem) => topicItem.id !== 'all' && grouped[topicItem.id]?.length).map((topicItem) => {
          const articles = grouped[topicItem.id] || [];
          const borderColor =
            topicItem.id === 'india'
              ? 'border-orange-500'
              : topicItem.id === 'world'
                ? 'border-sky-500'
                : topicItem.id === 'finance'
                  ? 'border-emerald-500'
                  : topicItem.id === 'sports'
                    ? 'border-rose-500'
                    : 'border-slate-400';
          return (
            <section
              key={topicItem.id}
              className={`rounded-xl border-2 ${borderColor} bg-slate-900/80 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]`}
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                {topicItem.label}
              </div>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={article.id || article.url}
                    article={article}
                    index={index}
                    onMarkRead={() => {}}
                    compact
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
