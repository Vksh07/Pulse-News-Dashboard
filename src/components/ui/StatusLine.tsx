import React from 'react';
import { useArticlesStore } from '../../store';
import { Wifi, WifiOff, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export function StatusLine() {
  const { isLoading, error, filteredArticles, lastUpdated } = useArticlesStore();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-yellow-400 text-xs font-medium">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-red-500/20 text-red-400 text-xs font-medium">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>Connection error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700/30 text-xs font-medium">
      <Wifi className="h-3.5 w-3.5 text-green-400" />
      <span className="text-slate-300">{filteredArticles.length} articles</span>
      {lastUpdated && (
        <>
          <span className="text-slate-600">|</span>
          <Clock className="h-3 w-3 text-slate-500" />
          <span className="text-slate-500">{new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </>
      )}
    </div>
  );
}
