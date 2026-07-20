// ════════════════════════════════════════════════════
// PULSE — Panel Components
// ════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store';
import { useArticlesStore } from '../../store';
import { X, Bookmark, Volume2, ExternalLink, Share2, MessageSquare, Plus, Trash2, Settings, RotateCcw, Filter, Loader2, Bell, BellOff, Search, Save, Timer } from 'lucide-react';
import { formatRelativeTime, escapeHtml } from '../../utils';
import { cn } from '../../utils';
import toast from 'react-hot-toast';

// ─── Bookmarks Panel ───
export function BookmarksPanel({ onClose }: { onClose: () => void }) {
  const { bookmarksPanelOpen, toggleBookmarks } = useUIStore();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('pulse_bookmarks');
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = (url: string) => {
    setBookmarks(prev => prev.filter(b => b.url !== url));
    localStorage.setItem('pulse_bookmarks', JSON.stringify(
      bookmarks.filter(b => b.url !== url)
    ));
  };

  if (!bookmarksPanelOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-950 border-l border-slate-800 z-50 flex flex-col animate-fade-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Bookmarks ({bookmarks.length})
        </h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-slate-600" />
            <p>No saved articles yet</p>
            <p className="text-sm mt-1">Click the 📌 on any article to save it</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bm, i) => (
              <article key={bm.url} className="card p-3 group">
                <div className="flex gap-3">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0"
                    onClick={e => e.stopPropagation()}
                  >
                    <p className="font-medium text-white line-clamp-2 mb-1">{escapeHtml(bm.title)}</p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <span>{escapeHtml(bm.source || '')}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(bm.published)}</span>
                    </p>
                  </a>
                  <button
                    onClick={() => removeBookmark(bm.url)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {bookmarks.length > 0 && (
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              if (confirm('Clear all bookmarks?')) {
                setBookmarks([]);
                localStorage.removeItem('pulse_bookmarks');
              }
            }}
            className="w-full btn-secondary btn-sm text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Bookmarks
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Social Panel ───
export function SocialPanel({ onClose }: { onClose: () => void }) {
  const { socialPanelOpen, toggleSocial } = useUIStore();
  const [shares, setShares] = useState<number>(() => Number(localStorage.getItem('pulse_shares') || '0'));

  useEffect(() => {
    localStorage.setItem('pulse_shares', String(shares));
  }, [shares]);

  if (!socialPanelOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-950 border-l border-slate-800 z-50 flex flex-col animate-fade-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Social
        </h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">Total Shares: <span className="font-bold text-yellow-500">{shares}</span></span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-secondary p-4 flex flex-col items-center gap-2 hover:bg-blue-500/10 hover:border-blue-500 transition-all">
            <span className="text-2xl">📱</span>
            <span className="font-medium">Copy Link</span>
            <span className="text-xs text-slate-500">Share via clipboard</span>
          </button>
          <button className="btn-secondary p-4 flex flex-col items-center gap-2 hover:bg-green-500/10 hover:border-green-500 transition-all">
            <span className="text-2xl">🐦</span>
            <span className="font-medium">X (Twitter)</span>
            <span className="text-xs text-slate-500">Share to X</span>
          </button>
          <button className="btn-secondary p-4 flex flex-col items-center gap-2 hover:bg-blue-600/10 hover:border-blue-600 transition-all">
            <span className="text-2xl">💼</span>
            <span className="font-medium">LinkedIn</span>
            <span className="text-xs text-slate-500">Professional share</span>
          </button>
          <button className="btn-secondary p-4 flex flex-col items-center gap-2 hover:bg-purple-500/10 hover:border-purple-500 transition-all">
            <span className="text-2xl">📧</span>
            <span className="font-medium">Email</span>
            <span className="text-xs text-slate-500">Send via email</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="font-medium text-white mb-4">Recent Shares</h4>
        <p className="text-slate-500 text-sm">Share history will appear here</p>
      </div>
    </div>
  );
}

// ─── Feed Manager ───
export function FeedManager({ onClose }: { onClose: () => void }) {
  const { feedPanelOpen, toggleFeed } = useUIStore();
  const [rssFeeds, setRssFeeds] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [newFeed, setNewFeed] = useState({ id: '', url: '' });
  const [newTopic, setNewTopic] = useState({ id: '', label: '', query: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeeds();
  }, []);

  const loadFeeds = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('pulse_feeds');
      if (stored) {
        const data = JSON.parse(stored);
        setRssFeeds(data.rss_feeds || []);
        setTopics(data.topics || []);
      }
    } catch {
      setRssFeeds([]);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const saveFeeds = () => {
    localStorage.setItem('pulse_feeds', JSON.stringify({ rss_feeds: rssFeeds, topics: topics }));
  };

  const addFeed = () => {
    if (!newFeed.id || !newFeed.url) return;
    setRssFeeds([...rssFeeds, { ...newFeed, enabled: true }]);
    setNewFeed({ id: '', url: '' });
    saveFeeds();
  };

  const removeFeed = (id: string) => {
    setRssFeeds(rssFeeds.filter(f => f.id !== id));
    saveFeeds();
  };

  const toggleFeedEnabled = (id: string) => {
    setRssFeeds(rssFeeds.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    saveFeeds();
  };

  const addTopicItem = () => {
    if (!newTopic.id || !newTopic.query) return;
    setTopics([...topics, { ...newTopic, enabled: true, label: newTopic.label || newTopic.id }]);
    setNewTopic({ id: '', label: '', query: '' });
    saveFeeds();
  };

  const removeTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
    saveFeeds();
  };

  const resetDefaults = () => {
    if (confirm('Reset all feeds and topics to defaults?')) {
      localStorage.removeItem('pulse_feeds');
      loadFeeds();
    }
  };

  if (!feedPanelOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-950 border-l border-slate-800 z-50 flex flex-col animate-fade-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Feed Manager
        </h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* RSS Feeds */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">RSS Feeds ({rssFeeds.filter(f => f.enabled).length}/{rssFeeds.length} active)</h4>
            <button onClick={resetDefaults} className="text-xs text-slate-500 hover:text-slate-400">Reset defaults</button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              {rssFeeds.map(feed => (
                <div key={feed.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <input
                    type="checkbox"
                    checked={feed.enabled}
                    onChange={() => toggleFeedEnabled(feed.id)}
                    className="w-5 h-5 rounded border-slate-600 text-yellow-500 focus:ring-yellow-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{feed.id}</p>
                    <p className="text-xs text-slate-500 truncate">{feed.url}</p>
                  </div>
                  <button
                    onClick={() => removeFeed(feed.id)}
                    className="p-2 rounded hover:bg-slate-700 transition-colors"
                    aria-label="Remove feed"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-4">
            <input
              type="text"
              value={newFeed.id}
              onChange={e => setNewFeed({...newFeed, id: e.target.value})}
              placeholder="Feed ID (e.g., thehindu_politics)"
              className="input"
            />
            <input
              type="url"
              value={newFeed.url}
              onChange={e => setNewFeed({...newFeed, url: e.target.value})}
              placeholder="https://example.com/rss.xml"
              className="input"
            />
          </div>
          <button onClick={addFeed} disabled={!newFeed.id || !newFeed.url} className="w-full btn-primary btn-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add RSS Feed
          </button>
        </section>

        {/* Topics */}
        <section>
          <h4 className="font-semibold text-white mb-4">Search Topics ({topics.filter(t => t.enabled).length}/{topics.length} active)</h4>

          <div className="space-y-2 mb-6">
            {topics.map(topic => (
              <div key={topic.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                <input
                  type="checkbox"
                  checked={topic.enabled}
                  onChange={() => { /* toggle topic */ }}
                  className="w-5 h-5 rounded border-slate-600 text-yellow-500 focus:ring-yellow-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{topic.label}</p>
                  <p className="text-xs text-slate-500 truncate">{topic.query}</p>
                </div>
                <button
                  onClick={() => removeTopic(topic.id)}
                  className="p-2 rounded hover:bg-slate-700 transition-colors"
                  aria-label="Remove topic"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={newTopic.id}
              onChange={e => setNewTopic({...newTopic, id: e.target.value})}
              placeholder="Topic ID (lowercase, underscores)"
              className="input"
            />
            <input
              type="text"
              value={newTopic.label}
              onChange={e => setNewTopic({...newTopic, label: e.target.value})}
              placeholder="Display Label (optional)"
              className="input"
            />
            <input
              type="text"
              value={newTopic.query}
              onChange={e => setNewTopic({...newTopic, query: e.target.value})}
              placeholder="Search Query"
              className="input"
            />
            <button onClick={addTopicItem} disabled={!newTopic.id || !newTopic.query} className="w-full btn-primary btn-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Pomodoro Panel ───
export function PomodoroPanel({ onClose }: { onClose: () => void }) {
  const { pomodoroPanelOpen, togglePomodoro } = useUIStore();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  if (!pomodoroPanelOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-slate-950 border-l border-slate-800 z-50 flex flex-col animate-fade-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Pomodoro
        </h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className={cn('text-6xl font-mono font-bold tabular-nums mb-8', running ? 'text-yellow-500' : 'text-white')}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setMode('focus')}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', mode === 'focus' ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400 hover:bg-slate-700')}
          >
            🎯 Focus ({minutes}m)
          </button>
          <button
            onClick={() => setMode('break')}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', mode === 'break' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700')}
          >
            ☕ Break (5m)
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { /* timer logic */ }}
            className={cn('flex-1 btn-primary btn-lg', running && 'bg-green-500')}
          >
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            onClick={() => { /* reset */ }}
            className="btn-secondary px-6 py-3"
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}