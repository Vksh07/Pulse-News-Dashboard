// ════════════════════════════════════════════════════
// PULSE — Research Intelligence Page (Research Agent OC)
// Breaking news + fleet pulse + AaS intelligence + CA digest
// ════════════════════════════════════════════════════

import React, { useState } from 'react';
import { cn } from '../utils';
import {
  Newspaper, Globe, TrendingUp, Brain, Radar, Shield,
  Activity, BookOpen, Zap, ExternalLink, ChevronRight,
  Clock, Hash, AlertTriangle, CheckCircle, Lightbulb,
  BarChart3, Users, Target, Sparkles
} from 'lucide-react';

// ─── breaking news cards ──

interface NewsItem {
  headline: string;
  source: string;
  gsTag: string;
  relevance: 'critical' | 'high' | 'medium';
  summary: string;
  timestamp: string;
}

const BREAKING_NEWS: NewsItem[] = [
  {
    headline: 'Delhi HC REJECTS Telegram appeal — ban upheld under Section 69A',
    source: 'Reuters / India Today',
    gsTag: 'GS2: Polity & Governance',
    relevance: 'critical',
    summary: 'Telegram lost bid to overturn blocking order. Centre\'s Section 69A stance validated. NEET re-exam June 21. Next: SC appeal expected.',
    timestamp: '19-JUN 19:00'
  },
  {
    headline: 'Israel strikes 80+ Hezbollah targets in Lebanon — Iran-US deal under strain',
    source: 'The Hindu',
    gsTag: 'GS2: IR / GS3: Security',
    relevance: 'critical',
    summary: 'Fresh strain on Iran-US framework peace deal signed Jun 15. Hegseth warns return to naval blockade if terms violated. Strait of Hormuz reopening timeline uncertain.',
    timestamp: '19-JUN 18:30'
  },
  {
    headline: 'NIMHANS-2 Announced — India\'s 90% mental health gap target',
    source: 'Multiple',
    gsTag: 'GS2: Social Justice / Psych Optional',
    relevance: 'high',
    summary: 'Second NIMHANS campus signals major mental health infra expansion. Relevant for Psych Optional, clinical + community psychology units.',
    timestamp: '19-JUN 17:00'
  },
  {
    headline: 'Creator Economy Bill 2026 passed in Rajya Sabha',
    source: 'Purple Hube / Tridatta',
    gsTag: 'GS3: Economy / GS2: Governance',
    relevance: 'high',
    summary: 'Digital creators formally recognised as professionals. Registration mandatory above income threshold. Major tailwind for AaS Creator-Ops Pack.',
    timestamp: '19-JUN 16:30'
  },
  {
    headline: 'SC declares right to walk on footpaths a fundamental right',
    source: 'The Hindu',
    gsTag: 'GS2: Polity — Fundamental Rights',
    relevance: 'high',
    summary: 'Overrides motorized vehicle privilege. Enforceable duty mandated. Landmark for urban governance and pedestrian rights jurisprudence.',
    timestamp: '19-JUN 15:00'
  },
  {
    headline: 'India monsoon deficit widens to 41% — IMD holds "normal" label',
    source: 'Business Standard',
    gsTag: 'GS1: Geography / GS3: Agriculture',
    relevance: 'high',
    summary: 'Trough stalled over Maharashtra. Goa water reserves <1 month. Kharif pulses/oilseeds sowing hit. Rural demand + inflation concerns.',
    timestamp: '19-JUN 12:38'
  },
  {
    headline: 'Nifty IT index cracks 6% — Accenture slashes FY26 guidance',
    source: 'Business Standard',
    gsTag: 'GS3: Economy',
    relevance: 'medium',
    summary: 'TCS, Infosys, TechM plunge 8%. Global IT spending slowdown. Risk-off for enterprise SaaS but Creator-Ops Pack relatively insulated.',
    timestamp: '19-JUN 13:09'
  },
  {
    headline: 'India-US trade acceleration in G-7 window — NSE files ₹30,000 Cr IPO',
    source: 'Economic Times',
    gsTag: 'GS2: IR / GS3: Economy',
    relevance: 'medium',
    summary: 'Bilateral trade agreement fast-tracked. Capital-market momentum favors AaS fiat bridge thesis. Tariff noise remains headwind for cross-border SaaS.',
    timestamp: '19-JUN 09:20'
  },
  {
    headline: 'SC flags legal brain drain — Young Lawyers\' Fund directed in every State',
    source: 'The Hindu',
    gsTag: 'GS2: Judiciary / GS1: Social Issues',
    relevance: 'medium',
    summary: 'First-generation lawyers and economically disadvantaged advocates singled out for professional assistance fund. Relevant for GS2 Polity & Social Justice.',
    timestamp: '19-JUN 14:00'
  },
];

// ─── Fleet Pulse ──

interface FleetAgent {
  name: string;
  status: 'active' | 'standby' | 'blocked';
  currentTask: string;
  emoji: string;
}

const FLEET_AGENTS: FleetAgent[] = [
  { name: 'Main Agent OC', status: 'active', currentTask: 'Gate-open coordination · Cron reg pending (session-restricted)', emoji: '🧠' },
  { name: 'Maverick OC', status: 'active', currentTask: 'COO direction · AaS legal wrapper (T+2hrs)', emoji: '⚡' },
  { name: 'Productivity-OC', status: 'active', currentTask: 'Blueprint Phase 2 · M1-M3 payloads defined', emoji: '⚙️' },
  { name: 'zFinance-OC', status: 'active', currentTask: 'AaS v0.2 integration · Payment×Prospect×Pricing merge', emoji: '💰' },
  { name: 'Research-OC', status: 'active', currentTask: 'AaS Phase 1-3 complete · CA Digest · Research Intel page', emoji: '🔍' },
  { name: 'Tutor-OC', status: 'standby', currentTask: 'CSAT×UPSC Stage 1 HOLD · Psych intake started', emoji: '📚' },
  { name: 'UPSC-OC', status: 'standby', currentTask: 'Stage 1 merge HOLD · Psych pipeline timing custody', emoji: '🎯' },
  { name: 'Health-OC', status: 'active', currentTask: 'Health Pulse deployed · Psych source · PACING protocol', emoji: '🫀' },
  { name: 'SM-OC', status: 'active', currentTask: 'IT Rules series done · AaS social wire · Awaiting clearance', emoji: '📱' },
];

// ─── AaS Intelligence ──

interface AasMetric {
  label: string;
  value: string;
  change: 'up' | 'down' | 'neutral';
  note: string;
}

const AAS_METRICS: AasMetric[] = [
  { label: 'Products Defined', value: '3 Packs', change: 'up', note: 'Creator-Ops · Research Intel · AI Eval & QA' },
  { label: 'Pricing Tiers', value: '3 per pack', change: 'up', note: 'Starter ₹999 / Pro ₹2,999 / Agency ₹9,999' },
  { label: 'Prospects', value: '9 (3 tiers)', change: 'up', note: 'Tier 1: UPSC + Creator + Consultant' },
  { label: 'Payment Routing', value: 'Dual-track', change: 'up', note: 'Instamojo INR + USDT/ETH/SOL' },
  { label: 'Legal Wrapper', value: 'Maverick-owned', change: 'neutral', note: 'T+2hrs skeleton' },
  { label: 'Market Tailwind', value: 'Creator Bill ✅', change: 'up', note: 'Regulatory legitimacy for Creator-Ops' },
];

// ─── GS Current Affairs Snapshot ──

const CA_CATEGORIES = [
  { topic: 'Polity & Governance', items: 5, color: 'bg-blue-500/20 text-blue-400' },
  { topic: 'International Relations', items: 3, color: 'bg-purple-500/20 text-purple-400' },
  { topic: 'Economy', items: 4, color: 'bg-green-500/20 text-green-400' },
  { topic: 'Social Justice', items: 3, color: 'bg-pink-500/20 text-pink-400' },
  { topic: 'Geography & Agriculture', items: 2, color: 'bg-amber-500/20 text-amber-400' },
  { topic: 'Security', items: 1, color: 'bg-red-500/20 text-red-400' },
];

export function ResearchIntelligence() {
  const [activeTab, setActiveTab] = useState<'news' | 'fleet' | 'aas'>('news');
  const [expandedNews, setExpandedNews] = useState<number | null>(null);

  const relevanceColor = (r: string) => {
    switch(r) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const statusColor = (s: string) => {
    switch(s) {
      case 'active': return 'text-green-400';
      case 'standby': return 'text-amber-400';
      case 'blocked': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      {/* ─── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-white">
            <Radar className="h-8 w-8 text-cyan-400" />
            Research Intelligence
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Fleet-wide intelligence · Breaking news · GS-tagged CA · AaS Analytics
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span>Updated 19-JUN-26 19:15 IST</span>
        </div>
      </div>

      {/* ─── CA Category Pills ── */}
      <div className="flex flex-wrap gap-2">
        {CA_CATEGORIES.map((cat) => (
          <span key={cat.topic} className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', cat.color)}>
            {cat.items} {cat.topic}
          </span>
        ))}
      </div>

      {/* ─── Tab Bar ── */}
      <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
        {[
          { id: 'news' as const, label: 'Breaking News', icon: Newspaper },
          { id: 'fleet' as const, label: 'Fleet Pulse', icon: Users },
          { id: 'aas' as const, label: 'AaS Intelligence', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: Breaking News ── */}
      {activeTab === 'news' && (
        <div className="space-y-3">
          {BREAKING_NEWS.map((news, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg border bg-slate-900/30 p-4 transition-all hover:bg-slate-900/50 cursor-pointer',
                i === 0 ? 'border-red-500/40' : 'border-slate-800'
              )}
              onClick={() => setExpandedNews(expandedNews === i ? null : i)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                      relevanceColor(news.relevance)
                    )}>
                      {news.relevance}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                      <Hash className="h-3 w-3" />
                      {news.gsTag}
                    </span>
                    <span className="ml-auto text-[10px] text-slate-500">{news.timestamp}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white leading-snug">{news.headline}</h3>
                  <p className="mt-1 text-xs text-slate-400">{news.summary}</p>
                  {expandedNews === i && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                      <span>Source: {news.source}</span>
                      <span>·</span>
                      <span className="text-cyan-500">Click to collapse</span>
                    </div>
                  )}
                </div>
                <ChevronRight className={cn(
                  'ml-3 h-4 w-4 text-slate-600 transition-transform',
                  expandedNews === i && 'rotate-90'
                )} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB: Fleet Pulse ── */}
      {activeTab === 'fleet' && (
        <div className="grid gap-3">
          {FLEET_AGENTS.map((agent) => (
            <div key={agent.name} className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-lg">
                {agent.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{agent.name}</span>
                  <span className={cn('text-xs font-medium', statusColor(agent.status))}>
                    ● {agent.status}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-400">{agent.currentTask}</p>
              </div>
              <div className="flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1">
                <Activity className="h-3 w-3 text-slate-500" />
                <span className="text-[10px] text-slate-500">
                  {agent.status === 'active' ? 'Online' : agent.status === 'standby' ? 'Standby' : 'Blocked'}
                </span>
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <Zap className="h-3.5 w-3.5" />
              <span>7 of 9 agents active · Gate-Open🔓 execution mode · All systems nominal</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: AaS Intelligence ── */}
      {activeTab === 'aas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {AAS_METRICS.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{metric.label}</span>
                  {metric.change === 'up' && <TrendingUp className="h-3.5 w-3.5 text-green-400" />}
                </div>
                <p className="mt-1 text-lg font-bold text-white">{metric.value}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{metric.note}</p>
              </div>
            ))}
          </div>

          {/* Product Architecture */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Target className="h-4 w-4 text-cyan-400" />
              AaS Product Architecture
            </h3>
            <div className="space-y-3">
              {[
                { pack: 'Creator-Ops Pack', price: '₹999–₹9,999', status: 'Lead product', tag: 'MVP' },
                { pack: 'Research Intelligence Pack', price: '₹1,499–₹14,999', status: 'UPSC + Enterprise', tag: 'Phase 1' },
                { pack: 'AI Eval & QA Pack', price: '₹2,999–₹29,999', status: 'Enterprise compliance', tag: 'Phase 2' },
              ].map((p) => (
                <div key={p.pack} className="flex items-center justify-between rounded-md bg-slate-800/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{p.pack}</p>
                    <p className="text-xs text-slate-500">{p.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-400">{p.price}</span>
                    <span className="rounded bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300">{p.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase Progress */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Brain className="h-4 w-4 text-purple-400" />
              AaS Phase Completion
            </h3>
            <div className="space-y-2">
              {[
                { phase: 'Phase 1: Prospect & Pricing', status: '✅ Done', by: 'Research-OC + zFinance-OC' },
                { phase: 'Phase 2: Outreach Scripts', status: '✅ Done', by: 'Research-OC' },
                { phase: 'Phase 3: Landing Page Content', status: '✅ Done', by: 'Research-OC → SM-OC cross-wired' },
                { phase: 'Phase 3b: Social Content', status: '✅ Staged (Awaiting clearance)', by: 'SM-OC' },
                { phase: 'Phase 4: Legal Wrapper', status: '⏳ In progress', by: 'Maverick OC (T+2hrs)' },
                { phase: 'Phase 5: Payment Integration', status: '⏳ Pending legal', by: 'zFinance-OC + Maverick' },
                { phase: 'Phase 6: Channel Deploy', status: '🔴 Blocked', by: 'Telegram ban + WhatsApp config' },
              ].map((p) => (
                <div key={p.phase} className="flex items-center justify-between rounded-md bg-slate-800/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">{p.phase}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{p.by}</span>
                    <span className="text-xs font-medium">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Footer ── */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/20 p-4 text-center text-xs text-slate-500">
        <p>Research Agent OC · 19-JUN-26 19:15 IST · Fleet gate-open 🔓 · All AaS Phase 1-3 complete</p>
        <p className="mt-1 text-[10px] text-slate-600">Data reflects fleet state as of cron cycle · Updates every cycle</p>
      </div>
    </div>
  );
}
