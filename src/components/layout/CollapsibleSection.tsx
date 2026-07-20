import React, { useState, Suspense } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '../../utils';

interface Props {
  title: string;
  icon: React.ReactNode;
  accent?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  /** If set, shows a "View full" link */
  fullPath?: string;
  badge?: string;
  /** Constrain height and make scrollable */
  scrollHeight?: string;
  loading?: string;
}

export function CollapsibleSection({
  title, icon, accent = 'border-slate-700', defaultOpen = false,
  children, fullPath, badge, scrollHeight, loading = 'Loading...',
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn(
      'rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden transition-all duration-300',
      open && 'ring-1 ring-slate-700/50'
    )}>
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/30 transition-colors group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className={cn('p-1.5 rounded-lg', accent)}>
            {icon}
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700/50">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {fullPath && open && (
            <a
              href={`#${fullPath}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
            >
              Full <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <div className={cn(
            'transition-transform duration-300 text-slate-500 group-hover:text-slate-300',
            open && 'rotate-180'
          )}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>

      {/* Content */}
      <div className={cn(
        'grid transition-all duration-300 ease-in-out',
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div
            className={cn('px-5 pb-4 pt-1', scrollHeight && 'overflow-y-auto')}
            style={scrollHeight ? { maxHeight: scrollHeight } : undefined}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-600 border-t-yellow-500" />
                <span className="ml-3 text-sm text-slate-500">{loading}</span>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
