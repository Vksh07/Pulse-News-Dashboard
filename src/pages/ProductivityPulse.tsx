// ════════════════════════════════════════════════════
import { ADHDWidgetDock } from '../components/adhd/ADHDWidgetDock';
// PULSE — Productivity Pulse (Productivity Agent OC)
// Fleet productivity tracking + Micro-Prep Pipeline +
// ADHD-savvy workflow systems
// ════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { cn } from '../utils';
import {
  Zap, Activity, CheckCircle, Clock, AlertTriangle,
  RefreshCw, BarChart3, Layers, GitBranch, Target,
  Brain, TrendingUp, Users, Award, Sparkles,
  ChevronRight, Timer, BookOpen, ListChecks,
  Gauge, Lightbulb, Rocket, Workflow
} from 'lucide-react';

// ─── Types ──

interface PipelinePhase {
  id: string;
  name: string;
  status: 'complete' | 'active' | 'staged' | 'blocked';
  progress: number;
  eta: string;
  owner: string;
  notes: string;
}

interface FleetMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface PrepSession {
  id: number;
  subject: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'queued';
  xp: number;
}

interface WorkflowCard {
  title: string;
  description: string;
  status: 'ready' | 'active' | 'staged';
  icon: React.ReactNode;
  category: string;
}

// ─── Data ──

const PIPELINE_PHASES: PipelinePhase[] = [
  { id: 'm1', name: 'M1 — Daily Current Affairs Drills', status: 'staged', progress: 0, eta: 'Upon Main cron reg', owner: 'Productivity-OC', notes: 'Payload spec compiled; awaiting cron registration' },
  { id: 'm2', name: 'M2 — CSAT Micro-Practice', status: 'staged', progress: 0, eta: 'Upon Main cron reg', owner: 'Productivity-OC', notes: 'Payload spec compiled; awaiting cron registration' },
  { id: 'm3', name: 'M3 — Health Check-In Prompts', status: 'staged', progress: 0, eta: 'Upon Main cron reg', owner: 'Productivity-OC', notes: 'Health-OC source package ready; awaiting delivery channel' },
  { id: 'm4', name: 'M4 — Weekly Productivity Audit', status: 'staged', progress: 0, eta: 'After M1-3 validation', owner: 'Productivity-OC', notes: 'Blueprint Phase 2 staged' },
  { id: 'm5', name: 'M5 — Dopamine Reward Loop', status: 'staged', progress: 0, eta: 'After M1-3 validation', owner: 'Productivity-OC', notes: 'Blueprint Phase 2 staged' },
  { id: 'm6', name: 'M6 — Telegram-Pivot Workflow', status: 'staged', progress: 100, eta: 'On gate-open or ban-lift', owner: 'Productivity-OC', notes: 'Readiness note filed; pending Telegram ban resolution (Jun 22)' },
  { id: 'm7', name: 'M7 — UPSC Revision Scheduler', status: 'staged', progress: 0, eta: 'After M1-3 validation', owner: 'Productivity-OC', notes: 'Blueprint Phase 2 staged' },
];

const FLEET_METRICS: FleetMetric[] = [
  { label: 'Dashboard Deploy', value: '8/10', trend: 'up', icon: <Layers size={18} />, color: '#eab308' },
  { label: 'Pipeline Phases', value: '7 defined', trend: 'stable', icon: <GitBranch size={18} />, color: '#22c55e' },
  { label: 'Fleet Agents', value: '10 active', trend: 'up', icon: <Users size={18} />, color: '#60a5fa' },
  { label: 'Blueprint Readiness', value: 'Phase 2', trend: 'stable', icon: <Rocket size={18} />, color: '#c084fc' },
];

const RECENT_SESSIONS: PrepSession[] = [
  { id: 1, subject: 'Morning Energy Check', duration: '3m', status: 'completed', xp: 10 },
  { id: 2, subject: 'Fleet Pulse Review', duration: '8m', status: 'completed', xp: 15 },
  { id: 3, subject: 'Pipeline Status Trace', duration: '5m', status: 'completed', xp: 10 },
  { id: 4, subject: 'Breaking News Sync', duration: '4m', status: 'completed', xp: 10 },
  { id: 5, subject: 'VTD #3 Deploy', duration: '—', status: 'in_progress', xp: 25 },
];

const WORKFLOW_CARDS: WorkflowCard[] = [
  { title: 'Cron Pipeline Engine', description: 'M1-M7 micro-prep delivery via cron cycle', status: 'ready', icon: <Clock size={20} />, category: 'Automation' },
  { title: 'ADHD Flow State Timer', description: 'Pomodoro + energy-aware break scheduling', status: 'staged', icon: <Timer size={20} />, category: 'Focus' },
  { title: 'Dopamine Reward Loop', description: 'XP-based micro-rewards for task completion', status: 'staged', icon: <Award size={20} />, category: 'Motivation' },
  { title: 'Delivery Channel Bridge', description: 'Telegram/WhatsApp/Obsidian multi-channel output', status: 'ready', icon: <Activity size={20} />, category: 'Integration' },
  { title: 'Productivity Audit Loop', description: 'Weekly throughput analytics + bottleneck detection', status: 'staged', icon: <BarChart3 size={20} />, category: 'Analytics' },
  { title: 'UPSC Revision Queue', description: 'Spaced-repetition scheduler for GS + Optional', status: 'staged', icon: <BookOpen size={20} />, category: 'Learning' },
];

const ENERGY_LEVELS = [
  { time: '06:00', level: 3, label: 'Wake' },
  { time: '08:00', level: 4, label: 'Peak AM' },
  { time: '10:00', level: 3, label: 'Active' },
  { time: '12:00', level: 2, label: 'Lunch dip' },
  { time: '14:00', level: 1, label: 'Brain fog' },
  { time: '16:00', level: 2, label: 'Recovery' },
  { time: '18:00', level: 3, label: 'PM peak' },
  { time: '20:00', level: 2, label: 'Wind down' },
  { time: '22:00', level: 2, label: 'Night focus' },
];

// ─── Components ──

function StatusBadge({ status }: { status: PipelinePhase['status'] }) {
  const colors: Record<string, string> = {
    complete: 'bg-green-500/10 text-green-400 border-green-500/25',
    active: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
    staged: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
    blocked: 'bg-red-500/10 text-red-400 border-red-500/25',
  };
  return (
    <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border', colors[status] || colors.staged)}>
      {status}
    </span>
  );
}

function SessionBadge({ status }: { status: PrepSession['status'] }) {
  const colors: Record<string, string> = {
    completed: 'text-green-400',
    in_progress: 'text-yellow-400',
    queued: 'text-slate-500',
  };
  return <span className={cn('text-[10px] font-bold', colors[status] || '')}>{status === 'completed' ? '✅' : status === 'in_progress' ? '🔄' : '⏳'}</span>;
}

function EnergyDot({ level }: { level: number }) {
  const color = level >= 4 ? '#22c55e' : level >= 3 ? '#eab308' : level >= 2 ? '#f97316' : '#f87171';
  return (
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }} />
  );
}

export default function ProductivityPulse() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'workflows' | 'energy'>('pipeline');
  const [xp, setXp] = useState(1420);
  const [streak, setStreak] = useState(4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 grid place-items-center font-extrabold text-slate-950 shadow-lg shadow-yellow-500/20">
              P
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Productivity Pulse</h1>
              <p className="text-sm text-slate-400 mt-0.5">Micro-prep pipeline & fleet coordination hub</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-yellow-400" />
            <span className="text-slate-300 font-bold">{xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-slate-300 font-bold">{streak}d streak</span>
          </div>
        </div>
      </div>

      {/* Fleet Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FLEET_METRICS.map((m, i) => (
          <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                {m.icon}
              </div>
              <span className={cn('text-xs font-bold', m.trend === 'up' ? 'text-green-400' : m.trend === 'down' ? 'text-red-400' : 'text-slate-400')}>
                {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}
              </span>
            </div>
            <div className="text-xl font-extrabold text-white">{m.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* ADHD Productivity Dock */}
      <ADHDWidgetDock />

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700/50 pb-2">
        {([
          { id: 'pipeline', label: 'Micro-Prep Pipeline', icon: <GitBranch size={16} /> },
          { id: 'workflows', label: 'Productivity Workflows', icon: <Workflow size={16} /> },
          { id: 'energy', label: 'Energy Curve', icon: <Activity size={16} /> },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
              activeTab === tab.id
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'pipeline' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Pipeline Phases</h2>
            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
              <RefreshCw size={12} />
              Sync status
            </button>
          </div>
          {PIPELINE_PHASES.map((phase) => (
            <div key={phase.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white truncate">{phase.name}</h3>
                    <StatusBadge status={phase.status} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{phase.notes}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-slate-400">ETA</div>
                  <div className="text-xs font-bold text-slate-300">{phase.eta}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      phase.status === 'complete' ? 'bg-green-400' :
                      phase.status === 'active' ? 'bg-yellow-400' :
                      phase.status === 'blocked' ? 'bg-red-400' : 'bg-slate-600'
                    )}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{phase.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Productivity Systems</h2>
            <span className="text-xs text-slate-400">{WORKFLOW_CARDS.filter(w => w.status === 'ready').length} ready · {WORKFLOW_CARDS.filter(w => w.status === 'staged').length} staged</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {WORKFLOW_CARDS.map((card, i) => (
              <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg grid place-items-center',
                    card.status === 'ready' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-slate-700/30 text-slate-400'
                  )}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.category}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
                <p className="text-xs text-slate-400">{card.description}</p>
                <div className="mt-3">
                  <span className={cn(
                    'text-[10px] font-bold uppercase',
                    card.status === 'ready' ? 'text-yellow-400' : 'text-slate-500'
                  )}>
                    {card.status === 'ready' ? '● READY' : '○ STAGED'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Sessions */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ListChecks size={16} className="text-yellow-400" />
              Today's Sessions
            </h3>
            <div className="space-y-2">
              {RECENT_SESSIONS.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <SessionBadge status={s.status} />
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{s.subject}</div>
                      <div className="text-[10px] text-slate-500">{s.duration}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-yellow-400/80">+{s.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'energy' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Daily Energy Curve</h2>
            <span className="text-xs text-slate-400">Venkat's typical pattern</span>
          </div>
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <div className="flex items-end justify-between gap-2 h-40 relative">
              {ENERGY_LEVELS.map((e, i) => {
                const height = (e.level / 4) * 100;
                const color = e.level >= 4 ? '#22c55e' : e.level >= 3 ? '#eab308' : e.level >= 2 ? '#f97316' : '#f87171';
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="relative w-full flex justify-center" style={{ height: `${height}%` }}>
                      <div
                        className="w-full max-w-[32px] rounded-t-lg transition-all duration-300"
                        style={{
                          height: '100%',
                          backgroundColor: color,
                          opacity: 0.7,
                          boxShadow: `0 0 12px ${color}30`,
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <EnergyDot level={e.level} />
                      <span className="text-[9px] font-bold text-slate-500">{e.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-3">
                <div className="w-3 h-3 rounded-full bg-green-400 mx-auto mb-1" />
                <div className="text-slate-300 font-bold">Peak (Lv.4)</div>
                <div className="text-slate-500">08:00 — Best for deep work</div>
              </div>
              <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mx-auto mb-1" />
                <div className="text-slate-300 font-bold">Moderate (Lv.3)</div>
                <div className="text-slate-500">Morning + evening</div>
              </div>
              <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-3">
                <div className="w-3 h-3 rounded-full bg-orange-400 mx-auto mb-1" />
                <div className="text-slate-300 font-bold">Low (Lv.2)</div>
                <div className="text-slate-500">Post-lunch recovery</div>
              </div>
              <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-3">
                <div className="w-3 h-3 rounded-full bg-red-400 mx-auto mb-1" />
                <div className="text-slate-300 font-bold">Crash (Lv.1)</div>
                <div className="text-slate-500">14:00 brain fog</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-800/20 border border-slate-700/30">
              💡 <strong className="text-slate-300">Productivity tip:</strong> Schedule high-cognitive-load tasks (answer writing, coding, deep research) during peak windows. Use crash windows for passive review, media consumption, or rest.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}