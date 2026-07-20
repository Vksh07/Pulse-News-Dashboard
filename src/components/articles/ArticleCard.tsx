import React, { useContext } from 'react';
import { ExternalLink, Bookmark, Volume2, Brain, TrendingUp, Clock } from 'lucide-react';
import type { Article } from '../../types';
import { formatRelativeTime, escapeHtml, unescapeHtml, cn } from '../../utils';
import { TTSContext, TTSContextValue } from '../tts/TTSContext';

interface ArticleCardProps {
  article: Article;
  index?: number;
  isFocusMode?: boolean;
  isUPSCLens?: boolean;
  onMarkRead: (title: string) => void;
  compact?: boolean;
}

const TOPIC_ACCENTS: Record<string, string> = {
  india: 'topic-india', tamilnadu: 'topic-tamilnadu', andhra: 'topic-andhra',
  world: 'topic-world', finance: 'topic-finance', earnings: 'topic-earnings',
  sports: 'topic-sports', national_sports: 'topic-national_sports', international_sports: 'topic-international_sports',
};

export function ArticleCard({ article, index = 0, isFocusMode, isUPSCLens, onMarkRead, compact = false }: ArticleCardProps) {
  const isRead = article.read;
  const isBookmarked = article.bookmarked;
  const upscScore = article.upsc?.score || 0;
  const upscTags = article.upsc?.tags || [];
  const upscPapers = article.upsc?.papers || [];
  const topicAccent = TOPIC_ACCENTS[article.topic || 'india'] || 'topic-india';

  // TTS from context
  const tts = useContext(TTSContext) as TTSContextValue | null;
  const isSpeaking = tts?.isActive && tts?.currentText === article.title;

  const handleListen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tts?.isActive) {
      tts.cancel();
    }
    tts?.speak({ title: article.title, snippet: article.snippet });
  };

  return (
    <article
      className={cn(
        'card group relative overflow-hidden transition-all duration-300',
        topicAccent,
        isRead && 'opacity-50 saturate-50',
        isSpeaking && 'ring-2 ring-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)]',
        isFocusMode && '!border-l-4 !border-l-yellow-500',
        isUPSCLens && upscScore > 0 && '!border-l-4 !border-l-green-500',
      )}
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* UPSC Badge */}
      {isUPSCLens && upscScore > 0 && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
          <span className="badge-green text-[11px] px-2 py-0.5">
            <Brain className="h-2.5 w-2.5 mr-0.5" />
            {upscScore}
          </span>
          {upscPapers.length > 0 && (
            <span className="badge text-[11px] px-2 py-0.5 bg-slate-800/80 text-slate-300 border-slate-700">
              {upscPapers.join(', ')}
            </span>
          )}
        </div>
      )}

      <div className="pr-14">
        {/* Source + Time row */}
        <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
            {escapeHtml(article.source || 'Unknown')}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(article.published)}
          </span>
          {article.intensityScore && (
            <span className="flex items-center gap-1 text-orange-400/80">
              <TrendingUp className="h-3 w-3" />
              {article.intensityScore.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[15px] leading-snug font-semibold text-white mb-2.5 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200"
          onClick={e => e.stopPropagation()}
        >
          {unescapeHtml(article.title)}
        </a>

        {!isFocusMode && article.snippet && (
          <p className={`text-slate-400 leading-relaxed ${compact ? 'text-xs line-clamp-1 mb-2' : 'text-sm line-clamp-2 mb-3.5'}`}>
            {unescapeHtml(article.snippet)}
          </p>
        )}

        {/* UPSC Tags */}
        {isUPSCLens && upscTags.length > 0 && (
          <div className={`flex flex-wrap gap-1.5 ${compact ? 'mb-2' : 'mb-3.5'}`}>
            {upscTags.slice(0, compact ? 2 : 4).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-green-500/8 text-green-400/80 text-[11px] rounded-md border border-green-500/10">
                {tag}
              </span>
            ))}
            {upscTags.length > (compact ? 2 : 4) && (
              <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-[11px] rounded-md">
                +{upscTags.length - (compact ? 2 : 4)}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className={`flex items-center gap-1.5 ${compact ? 'pt-2' : 'pt-3'} border-t border-slate-800/60`}>
          <button
            className={cn(
              `flex items-center gap-1.5 ${compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-lg font-medium transition-all duration-200`,
              isBookmarked
                ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
            )}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            <Bookmark className={cn('h-3.5 w-3.5', isBookmarked && 'fill-yellow-400')} />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleListen}
            className={cn(
              `flex items-center gap-1.5 ${compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-lg font-medium transition-all duration-200`,
              isSpeaking
                ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
            )}
            aria-label={isSpeaking ? 'Stop listening' : 'Listen to article'}
          >
            <Volume2 className={cn('h-3.5 w-3.5', isSpeaking && 'animate-pulse')} />
            <span className="hidden sm:inline">{isSpeaking ? 'Playing…' : 'Listen'}</span>
          </button>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              `flex items-center gap-1.5 ${compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-lg font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent transition-all duration-200 ml-auto`
            )}
            onClick={e => e.stopPropagation()}
            aria-label="Open article"
          >
            <ExternalLink className={cn('h-3.5 w-3.5')} />
            <span className="hidden sm:inline">Open</span>
          </a>
        </div>
      </div>

      {/* TTS Highlight glow */}
      {isSpeaking && (
        <div className="absolute inset-0 pointer-events-none bg-yellow-500/5 animate-pulse rounded-xl" />
      )}

      {/* Read indicator bar */}
      {isRead && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500/60 to-green-500/20" aria-hidden="true" />
      )}
    </article>
  );
}
