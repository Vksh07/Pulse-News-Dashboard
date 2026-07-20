// ════════════════════════════════════════════════════
// PULSE — UPSC Lens Page
// ════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticlesStore } from '../store';
import { useUIStore } from '../store';
import { Filter, Bookmark, Volume2, ExternalLink, Brain, Target, FileText, TrendingUp } from 'lucide-react';
import { ArticleCard } from '../components/articles/ArticleCard';
import { formatRelativeTime, escapeHtml, cn } from '../utils';
import { StatusLine } from '../components/ui/StatusLine';
import { RescanButton } from '../components/ui/RescanButton';

const GS_PAPERS = [
  { id: 'GS1', label: 'GS1: History, Geography, Society', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'GS2', label: 'GS2: Polity, Governance, IR', color: 'bg-green-500/20 text-green-400' },
  { id: 'GS3', label: 'GS3: Economy, Science, Security', color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'GS4', label: 'GS4: Ethics, Integrity', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'Optional', label: 'Optional: Psychology', color: 'bg-pink-500/20 text-pink-400' },
];

const UPSC_TAGS = [
  'ancient', 'medieval', 'modern', 'independence', 'geography', 'climate', 'urban',
  'polity', 'governance', 'election', 'judiciary', 'constitution', 'parliament',
  'bill', 'amendment', 'economy', 'budget', 'finance', 'gdp', 'inflation',
  'science', 'technology', 'space', 'defence', 'cyber', 'biotech', 'energy',
  'ethics', 'integrity', 'aptitude', 'psychology', 'cognition', 'perception',
  'learning', 'memory', 'society', 'social justice', 'caste', 'gender',
  'education', 'health', 'environment', 'ecology', 'international', 'summit',
  'treaty', 'bilateral', 'security', 'border',
];

export function UPSCLens() {
  const { articles, isLoading, error, refresh, setUPSCLens, isUPSCLens } = useArticlesStore();
  const { setCurrentPage } = useUIStore();
  const [selectedPapers, setSelectedPapers] = useState<string[]>(['GS1', 'GS2', 'GS3', 'GS4']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'recency' | 'score'>('relevance');

  useEffect(() => {
    setCurrentPage('upsc');
    setUPSCLens(true);
    return () => setUPSCLens(false);
  }, [setCurrentPage, setUPSCLens]);

  // Filter and score articles
  const scoredArticles = articles
    .map(article => {
      const upsc = article.upsc;
      if (!upsc || upsc.score === 0) return null;
      
      const papersMatch = selectedPapers.length === 0 || upsc.papers.some((p: string) => selectedPapers.includes(p));
      const tagsMatch = selectedTags.length === 0 || upsc.tags.some((t: string) => selectedTags.includes(t));
      
      if (!papersMatch || !tagsMatch) return null;
      
      return { ...article, upscScore: upsc.score, upscTags: upsc.tags, upscPapers: upsc.papers };
    })
    .filter(Boolean) as (typeof articles[0] & { upscScore: number; upscTags: string[]; upscPapers: string[] })[];

  const sorted = [...scoredArticles].sort((a, b) => {
    if (sortBy === 'score') return b.upscScore - a.upscScore;
    if (sortBy === 'recency') return new Date(b.published).getTime() - new Date(a.published).getTime();
    return b.upscScore - a.upscScore;
  });

  const handleMarkRead = (title: string) => {
    // Handled by ArticleCard
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Brain className="h-7 w-7 text-green-500" />
            UPSC Lens
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Curated for GS papers • Tagged by syllabus</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusLine />
          <RescanButton />
        </div>
      </div>

      {/* Paper Filters */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="GS Paper filters">
        {GS_PAPERS.map(paper => (
          <button
            key={paper.id}
            onClick={() => setSelectedPapers(prev => 
              prev.includes(paper.id) ? prev.filter(p => p !== paper.id) : [...prev, paper.id]
            )}
            className={cn(
              'pill px-3 py-1.5',
              selectedPapers.includes(paper.id) ? 'pill-active' : 'pill-inactive'
            )}
            aria-pressed={selectedPapers.includes(paper.id)}
          >
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', paper.color)}>
              {paper.id}
            </span>
          </button>
        ))}
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Topic tags">
        <select
          value={selectedTags.join(',')}
          onChange={e => setSelectedTags(e.target.value.split(',').filter(Boolean))}
          className="input px-3 py-1.5 text-sm max-w-xs"
          multiple
        >
          {UPSC_TAGS.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="input px-3 py-1.5 text-sm max-w-xs"
        >
          <option value="relevance">📊 Relevance (UPSC Score)</option>
          <option value="recency">🕐 Most Recent</option>
          <option value="score">⭐ Highest Score</option>
        </select>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-500" />
          <span className="font-semibold text-white">{sorted.length} UPSC-relevant articles</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span>Papers: {selectedPapers.join(', ')}</span>
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading && sorted.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="skeleton h-6 w-3/4 mb-2" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-2/3 mb-2" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card text-center py-8">
          <p className="text-red-400 mb-4">⚠️ Connection error</p>
          <RescanButton />
        </div>
      ) : sorted.length === 0 ? (
        <div className="card text-center py-12">
          <Brain className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No UPSC articles match your filters</p>
          <p className="text-sm text-slate-500 mt-2">Try adjusting paper selection or tags</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.slice(0, 30).map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              isFocusMode={false}
              isUPSCLens={true}
              onMarkRead={() => {}}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
        <Link to="/csat" className="card group hover:border-green-500 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-500"><Target className="h-5 w-5" /></div>
            <div><p className="font-semibold text-white">CSAT Practice</p><p className="text-xs text-slate-400">Daily questions</p></div>
          </div>
        </Link>
        <Link to="/sr" className="card group hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500"><TrendingUp className="h-5 w-5" /></div>
            <div><p className="font-semibold text-white">Spaced Repetition</p><p className="text-xs text-slate-400">Smart review</p></div>
          </div>
        </Link>
        <Link to="/analytics" className="card group hover:border-purple-500 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500"><TrendingUp className="h-5 w-5" /></div>
            <div><p className="font-semibold text-white">Analytics</p><p className="text-xs text-slate-400">Progress insights</p></div>
          </div>
        </Link>
        <Link to="/" className="card group hover:border-yellow-500 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500"><Brain className="h-5 w-5" /></div>
            <div><p className="font-semibold text-white">Back to Dashboard</p><p className="text-xs text-slate-400">Full news view</p></div>
          </div>
        </Link>
      </div>
    </div>
  );
}