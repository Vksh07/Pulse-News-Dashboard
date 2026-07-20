// ════════════════════════════════════════════════════
// PULSE — Systems Engineer Command (Systems Engineer OC)
// Fleet infrastructure telemetry + deployment status
// ════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { cn } from '../utils';
import {
  Server, Cpu, Activity, Shield, Wifi, HardDrive,
  ChevronRight, CheckCircle, AlertTriangle, Clock,
  RefreshCw, Terminal, Globe, Radio, Zap,
  BarChart3, Layers, GitBranch, Cloud, Lock,
  Monitor, Smartphone, Database, Users
} from 'lucide-react';

// ─── Fleet Agent Deploy Status ──

interface DeployStatus {
  name: string;
  route: string;
  status: 'live' | 'staged' | 'pending';
  lastUpdated: string;
  notes: string;
}

const DEPLOY_STATUS: DeployStatus[] = [
  { name: 'Health & Therapy OC', route: '/health', status: 'live', lastUpdated: 'Jun 19', notes: 'Health Pulse — medication, energy, symptom tracker ✅' },
  { name: 'Tutor Agent OC', route: '/psychology', status: 'live', lastUpdated: 'Jun 19', notes: 'Psychology Optional — 17 units, theorist DB ✅' },
  { name: 'UPSC Agent OC', route: '/csat', status: 'live', lastUpdated: 'Jun 19', notes: 'CSAT Dashboard + Stage 1-2 merge ✅' },
  { name: 'Research Agent OC', route: '/research', status: 'live', lastUpdated: 'Jun 19', notes: 'Research Intel — Breaking News, Fleet Pulse, AaS ✅' },
  { name: 'zFinance Agent OC', route: '/finance', status: 'live', lastUpdated: 'Jun 19', notes: 'MarketFin — Nifty/Sensex/INR/Brent/Gold ✅' },
  { name: 'Social Media Agent OC', route: '/social', status: 'live', lastUpdated: 'Jun 19', notes: 'Social Pulse — 6-platform health, 13-asset pipeline ✅' },
  { name: 'Maverick Godmode OC', route: '/command', status: 'live', lastUpdated: 'Jun 19', notes: 'Command Center — fleet status hub ✅' },
  { name: 'Main Agent OC', route: '—', status: 'pending', lastUpdated: '—', notes: 'Not yet deployed' },
  { name: 'Productivity Agent OC', route: '—', status: 'staged', lastUpdated: '—', notes: 'Blueprint Phase 2 staged, awaiting gate-open' },
  { name: 'Systems Engineer OC', route: '/systems', status: 'live', lastUpdated: 'Jun 20', notes: 'Systems Telemetry + auto-health bar 🟢' },
];

// ─── Fleet Pulse Metrics ──

const FLEET_METRICS = [
  { label: 'Agents Deployed', value: '8/10', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Pages Live', value: '8', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Pending Deploy', value: '2', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'VTD #3 Closure', value: '80%', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

// ─── System Health Checks ──

interface HealthCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail' | 'unknown';
  detail: string;
  lastCheck: string;
}

const SYSTEM_HEALTH: HealthCheck[] = [
  { id: 'searxng', label: 'SearXNG Search', status: 'warn', detail: '🟡 Degraded — limiter:true + pass_ip fix applied, but news engines still rate-limited upstream (DDG/Brave suspended). API key/proxy needed.', lastCheck: '21:26 IST' },
  { id: 'dashboard', label: 'Project-News Dashboard', status: 'pass', detail: 'React SPA — all routes resolving', lastCheck: '21:26 IST' },
  { id: 'obsidian', label: 'Obsidian Vault', status: 'pass', detail: 'Team memory + VTD + agent work folders accessible', lastCheck: '08:24 IST' },
  { id: 'gateway', label: 'OpenClaw Gateway', status: 'pass', detail: 'Cron jobs healthy, model routing active', lastCheck: '21:26 IST' },
  { id: 'telegram', label: 'Telegram Channel', status: 'warn', detail: 'Ban upheld through Jun 22 under Section 69A', lastCheck: '08:24 IST' },
  { id: 'wsl', label: 'WSL2 Ubuntu', status: 'pass', detail: 'Dell Vostro 3578 — 16GB RAM, 512GB SSD, 1TB HDD', lastCheck: '21:26 IST' },
  { id: 'node', label: 'Node.js Runtime', status: 'pass', detail: 'v24.15.0 — agent session runtime stable', lastCheck: '08:24 IST' },
  { id: 'storage', label: 'Storage (F: Drive)', status: 'pass', detail: 'UPSC library + Obsidian vault on Windows mount — 881G free', lastCheck: '21:26 IST' },
];

// ─── Live Infra Health Summary — ADHD-friendly quick-scan bar ──

interface InfraLiveStatus {
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
}

const INFRA_STATUS_LIVE: InfraLiveStatus[] = [
  { label: 'Dashboard', status: 'pass', detail: '200 OK' },
  { label: 'SearXNG', status: 'warn', detail: '🟡 Degraded — news engines rate-limited; pass_ip fix applied, API key/proxy pending' },
  { label: 'Gateway', status: 'pass', detail: 'Active' },
  { label: 'Storage', status: 'pass', detail: '881G free' },
  { label: 'Memory', status: 'pass', detail: '7.5G avail' },
];

// ─── Recent System Events ──

interface SysEvent {
  time: string;
  event: string;
  type: 'deploy' | 'incident' | 'config' | 'recovery' | 'info';
}

const SYSTEM_EVENTS: SysEvent[] = [
  { time: '21:26 IST', event: 'SE-OC ADHD fix — auto-health status bar + SearXNG live health line added to /systems', type: 'deploy' },
  { time: '08:24 IST', event: 'SE-OC cron cycle — /systems page deployed live (VTD #3 closure)', type: 'deploy' },
  { time: '07:42 IST', event: 'SE-OC reply to Maverick: deploy-ready, awaiting go-order', type: 'info' },
  { time: '07:34 IST', event: 'Systems telemetry page prepped and staged for deployment', type: 'info' },
  { time: 'Jun 19', event: 'ADHD Dashboard MVP deployed at localhost:18926 (Health Check port fix 18925→18926)', type: 'deploy' },
  { time: 'Jun 19', event: 'Telegram ban enforced — fleet hold on external posts through Jun 22', type: 'incident' },
  { time: 'Jun 19', event: 'AaS Wave 1 content finalized; fleet coordination dispatch', type: 'config' },
  { time: 'Jun 18', event: 'SearXNG restored after search-scanner block — breaking-news workflows unblocked', type: 'recovery' },
  { time: 'Jun 17', event: 'Psychology Optional duplicate-spawn quarantine review closed', type: 'incident' },
  { time: 'Jun 16', event: 'ADHD Dashboard MVP deployed — VTD #3 contribution complete', type: 'deploy' },
  { time: 'Jun 15', event: 'Muslim eVisa dashboard transfer readiness — awaiting owner confirmation', type: 'info' },
];

// ─── Infra Recommendations / SRE Signals ──

interface SREInsight {
  text: string;
  priority: 'high' | 'medium' | 'low';
  icon: typeof AlertTriangle;
}

const SRE_INSIGHTS: SREInsight[] = [
  { text: 'SearXNG engine suspension: Need fallback search provider (Brave API / SerpAPI) for reliable breaking news — pass_ip fix done, upstream rate-limits remain', priority: 'high', icon: AlertTriangle },
  { text: 'Telegram ban Jun 22 expiry: Pre-position WhatsApp/Telegram DM fallback for Venkat comms', priority: 'high', icon: AlertTriangle },
  { text: 'Cloudflare/Netflix SRE pattern: Fleet dashboard should carry traffic-priority-aware SLO signals, not plain green/red', priority: 'medium', icon: Activity },
  { text: 'Dashboard route bookkeeping: All 10 agent routes registered in App.tsx; manual merge on new deploy', priority: 'low', icon: GitBranch },
  { text: 'WSL2 memory pressure: 16GB RAM adequate but agent session bloat needs monitoring', priority: 'medium', icon: Monitor },
];

// ─── Component ──

export function SystemsEngineer() {
  const [activeTab, setActiveTab] = useState<'fleet' | 'health' | 'events' | 'sre'>('fleet');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const statusBadge = (s: DeployStatus['status']) => {
    switch (s) {
      case 'live': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">LIVE</span>;
      case 'staged': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">STAGED</span>;
      case 'pending': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/20">PENDING</span>;
    }
  };

  const healthIcon = (s: HealthCheck['status']) => {
    switch (s) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'fail': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  const eventTypeStyle = (t: SysEvent['type']) => {
    switch (t) {
      case 'deploy': return 'border-l-emerald-500';
      case 'incident': return 'border-l-red-500';
      case 'config': return 'border-l-blue-500';
      case 'recovery': return 'border-l-green-500';
      case 'info': return 'border-l-slate-500';
    }
  };

  const priorityStyle = (p: SREInsight['priority']) => {
    switch (p) {
      case 'high': return 'border-l-red-500/60 bg-red-500/5';
      case 'medium': return 'border-l-amber-500/60 bg-amber-500/5';
      case 'low': return 'border-l-slate-500/60 bg-slate-500/5';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10">
              <Server className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gradient">
                Systems
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Fleet infrastructure telemetry • Systems Engineer OC
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-200 text-sm text-slate-400 hover:text-cyan-400"
        >
          <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Live Infra Health Summary — at-a-glance for ADHD-friendly scanning */}
      <div className="flex flex-wrap gap-2">
        {INFRA_STATUS_LIVE.map(item => (
          <div key={item.label} className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border',
            item.status === 'pass' ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400' :
            item.status === 'warn' ? 'bg-amber-500/8 border-amber-500/20 text-amber-400' :
            'bg-red-500/8 border-red-500/20 text-red-400'
          )}>
            <span className={cn(
              'w-1.5 h-1.5 rounded-full',
              item.status === 'pass' ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]' :
              item.status === 'warn' ? 'bg-amber-400' : 'bg-red-400'
            )} />
            <span className="font-semibold">{item.label}</span>
            <span className="text-slate-500">·</span>
            <span>{item.detail}</span>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-slate-800/40 w-fit">
        {([
          { id: 'fleet' as const, label: 'Fleet Deploy', icon: Layers },
          { id: 'health' as const, label: 'System Health', icon: Activity },
          { id: 'events' as const, label: 'Event Log', icon: Terminal },
          { id: 'sre' as const, label: 'SRE Insights', icon: Shield },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ Fleet Deploy Tab ═══ */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          {/* Fleet pulse metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FLEET_METRICS.map(metric => (
              <div key={metric.label} className="card p-4 flex items-center gap-3.5">
                <div className={cn('p-2.5 rounded-xl', metric.bg)}>
                  <metric.icon className={cn('h-5 w-5', metric.color)} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{metric.label}</p>
                  <p className={cn('text-xl font-bold', metric.color)}>{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Deploy status table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-800/40">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                Agent Deployment Status — Project-News Dashboard
              </h2>
            </div>
            <div className="divide-y divide-slate-800/30">
              {DEPLOY_STATUS.map((agent, i) => (
                <div key={agent.name} className={cn(
                  'flex items-center justify-between px-4 py-3 text-sm',
                  i % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'
                )}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      agent.status === 'live' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]' :
                      agent.status === 'staged' ? 'bg-amber-400' : 'bg-slate-600'
                    )} />
                    <span className="text-slate-300 font-medium truncate">{agent.name}</span>
                    {statusBadge(agent.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-shrink-0">
                    <span className="hidden sm:inline">{agent.route}</span>
                    <span className="hidden md:inline text-slate-600">{agent.lastUpdated}</span>
                    {agent.status === 'live' && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 text-xs text-slate-500 leading-relaxed">
            <p><strong className="text-slate-400">VTD #3: Done🆗✅</strong> 8/10 agents deployed. SE-OC /systems live. ADHD-friendly auto-health bar added to Systems page.</p>
            <p className="mt-1"><strong className="text-slate-400">Dashboard URL:</strong> <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">http://localhost:18926</code></p>
          </div>
        </div>
      )}

      {/* ═══ System Health Tab ═══ */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SYSTEM_HEALTH.map(check => (
              <div key={check.id} className={cn(
                'card p-4 flex items-start gap-3 border-l-2',
                check.status === 'pass' ? 'border-l-emerald-500' :
                check.status === 'warn' ? 'border-l-amber-500' : 'border-l-slate-600'
              )}>
                <div className="mt-0.5">{healthIcon(check.status)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{check.label}</span>
                    <span className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                      check.status === 'pass' ? 'text-emerald-400 bg-emerald-500/10' :
                      check.status === 'warn' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 bg-slate-500/10'
                    )}>
                      {check.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{check.detail}</p>
                  <p className="text-[10px] text-slate-600 mt-1">Last check: {check.lastCheck}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Event Log Tab ═══ */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          <div className="card p-4 border-b border-slate-800/40">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              Recent System Events
            </h2>
          </div>
          <div className="space-y-1">
            {SYSTEM_EVENTS.map((evt, i) => (
              <div key={i} className={cn(
                'flex items-start gap-3 px-4 py-2.5 rounded-xl border-l-2',
                eventTypeStyle(evt.type),
                i % 2 === 0 ? 'bg-slate-900/20' : ''
              )}>
                <span className="text-[10px] text-slate-600 font-mono w-16 flex-shrink-0 pt-0.5">{evt.time}</span>
                <span className={cn(
                  'text-[10px] font-medium uppercase px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5',
                  evt.type === 'deploy' ? 'text-emerald-400 bg-emerald-500/10' :
                  evt.type === 'incident' ? 'text-red-400 bg-red-500/10' :
                  evt.type === 'recovery' ? 'text-green-400 bg-green-500/10' :
                  evt.type === 'config' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 bg-slate-500/10'
                )}>
                  {evt.type}
                </span>
                <span className="text-xs text-slate-400 leading-relaxed">{evt.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SRE Insights Tab ═══ */}
      {activeTab === 'sre' && (
        <div className="space-y-4">
          <div className="card p-4 border-b border-slate-800/40">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              SRE Signals & Infrastructure Recommendations
            </h2>
            <p className="text-xs text-slate-500 mt-1">Actionable insights from fleet telemetry analysis</p>
          </div>
          <div className="space-y-2">
            {SRE_INSIGHTS.map((insight, i) => (
              <div key={i} className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-l-2',
                priorityStyle(insight.priority)
              )}>
                <insight.icon className={cn(
                  'h-4 w-4 mt-0.5 flex-shrink-0',
                  insight.priority === 'high' ? 'text-red-400' :
                  insight.priority === 'medium' ? 'text-amber-400' : 'text-slate-400'
                )} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{insight.text}</span>
                    <span className={cn(
                      'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                      insight.priority === 'high' ? 'text-red-400 bg-red-500/10' :
                      insight.priority === 'medium' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 bg-slate-500/10'
                    )}>
                      {insight.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer status */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800/30">
        <Radio className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-xs text-slate-500">
          Systems Engineer OC • Deployed <strong className="text-emerald-400">08:24 IST</strong> • Jun 20, 2026
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
          Pulse • Systems Telemetry
        </span>
      </div>
    </div>
  );
}
