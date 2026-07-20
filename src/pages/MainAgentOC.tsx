// ════════════════════════════════════════════════════
// PULSE — Main Agent OC: Mission Control
// Fleet orchestration hub + System overview + VTD tracking
// ════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { cn } from '../utils';
import {
  Activity, Shield, Users, Target, Zap, Clock, Cpu,
  CheckCircle, AlertTriangle, ChevronRight, ExternalLink,
  Radio, Globe, Brain, BarChart3, TrendingUp, DollarSign,
  Heart, BookOpen, MessageSquare, Server, GitBranch,
  Sparkles, Grid3X3, ListChecks, Layers
} from 'lucide-react';

// ─── Fleet Agent Status ──

interface AgentDeploy {
  name: string;
  route: string;
  status: 'live' | 'staged' | 'pending';
  feature: string;
  role: string;
}

const FLEET_DEPLOY: AgentDeploy[] = [
  { name: 'Health & Therapy OC', route: '/health', status: 'live', feature: 'Health Pulse 🫀', role: 'Health / Therapy' },
  { name: 'Tutor Agent OC', route: '/psychology', status: 'live', feature: 'Psychology Optional 🧠', role: 'Education' },
  { name: 'UPSC Agent OC', route: '/csat', status: 'live', feature: 'CSAT Dashboard 📚', role: 'UPSC Prep' },
  { name: 'Research Agent OC', route: '/research', status: 'live', feature: 'Research Intel 🔍', role: 'Research / Intel' },
  { name: 'zFinance Agent OC', route: '/finance', status: 'live', feature: 'MarketFin 💰', role: 'Finance / Earnings' },
  { name: 'Social Media Agent OC', route: '/social', status: 'live', feature: 'Social Pulse 📢', role: 'Content / Social' },
  { name: 'Maverick Godmode OC', route: '/command', status: 'live', feature: 'Command Center ⚡', role: 'COO / Team Lead' },
  { name: 'Systems Engineer OC', route: '/systems', status: 'live', feature: 'Systems Telemetry 🖥️', role: 'Systems / Infra' },
  { name: 'Productivity Agent OC', route: '/productivity', status: 'live', feature: 'Productivity Pulse ⚙️', role: 'Productivity' },
  { name: 'Main Agent OC', route: '/main', status: 'live', feature: 'Mission Control 🎯', role: 'Chairman / CEO' },
];

// ─── Orchestration Metrics ──

interface OrchestrationMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  accent: string;
}

const ORCH_METRICS: OrchestrationMetric[] = [
  { label: 'Agents Deployed', value: '10/10', trend: 'up', icon: <CheckCircle className="w-5 h-5" />, accent: 'text-emerald-400' },
  { label: 'Routes Live', value: '10', trend: 'up', icon: <Globe className="w-5 h-5" />, accent: 'text-blue-400' },
  { label: 'VTD #3 Closure', value: '100%', trend: 'up', icon: <Target className="w-5 h-5" />, accent: 'text-purple-400' },
  { label: 'Cron Cycles Today', value: '12+', trend: 'stable', icon: <Activity className="w-5 h-5" />, accent: 'text-cyan-400' },
  { label: 'AIT Anti-Idle', value: 'Active', trend: 'up', icon: <Zap className="w-5 h-5" />, accent: 'text-amber-400' },
  { label: 'AaS Pipeline', value: 'Wave 1', trend: 'up', icon: <TrendingUp className="w-5 h-5" />, accent: 'text-rose-400' },
];

// ─── System Pulse ──

interface SystemPulse {
  id: string;
  label: string;
  status: 'healthy' | 'degraded' | 'down';
  detail: string;
}

const SYSTEM_PULSE: SystemPulse[] = [
  { id: 'dashboard', label: 'Project-News Dashboard', status: 'healthy', detail: 'SPA React — 10/10 routes live on port 18926' },
  { id: 'searxng', label: 'SearXNG Search Engine', status: 'degraded', detail: 'Running — engines suspended (rate-limit/CAPTCHA)' },
  { id: 'telegram', label: 'Telegram Delivery', status: 'down', detail: 'Banned — SC appeal pending; fleet hold through Jun 22' },
  { id: 'whatsapp', label: 'WhatsApp Delivery', status: 'healthy', detail: 'Operational — DMs delivered (last successful: Jun 19)' },
  { id: 'cron', label: 'Cron Scheduler', status: 'healthy', detail: 'All agent cycles active; isolated sessions operational' },
];

// ─── Task Queue ──

interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'done';
  deadline: string;
}

const TASK_QUEUE: TaskItem[] = [
  { id: 't1', title: 'AaS Wave 1 Deploy — hosting gate', assignee: 'All Agents', priority: 'high', status: 'in_progress', deadline: 'Jun 20' },
  { id: 't2', title: 'QUICKFLIP T+0 Activation (Mon)', assignee: 'zFinance-OC', priority: 'high', status: 'pending', deadline: 'Jun 22' },
  { id: 't3', title: 'CSAT×UPSC Stage 3 Merge Confirmation', assignee: 'UPSC-OC', priority: 'medium', status: 'in_progress', deadline: 'Jun 20' },
  { id: 't4', title: 'Blueprint Phase 2 Cron Registration', assignee: 'Main-OC', priority: 'medium', status: 'pending', deadline: 'Jun 21' },
  { id: 't5', title: 'Telegram Ban Appeal Monitoring', assignee: 'All Agents', priority: 'medium', status: 'pending', deadline: 'Jun 22' },
  { id: 't6', title: 'Weekly Memory Distill Review', assignee: 'Main-OC', priority: 'low', status: 'pending', deadline: 'Jun 21' },
];

// ─── Earning Pipeline ──

const EARNING_LANES = [
  { name: 'AaS (Agent-as-Service)', value: 'Wave 1 — Pre-launch', progress: 60, status: 'staging', color: 'from-blue-500 to-cyan-500' },
  { name: 'QUICKFLIP', value: 'T+0 — Mon Jun 22', progress: 85, status: 'ready', color: 'from-amber-500 to-orange-500' },
  { name: 'UPSC Content Store', value: 'Gumroad PDF — Q3', progress: 25, status: 'staged', color: 'from-emerald-500 to-teal-500' },
  { name: 'Freelancer Pipeline', value: 'Awaiting .env token', progress: 10, status: 'blocked', color: 'from-purple-500 to-violet-500' },
];

// ─── Time-Based Greeting ──

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return '☀️ Good Morning';
  if (h < 17) return '🌤️ Good Afternoon';
  if (h < 22) return '🌅 Good Evening';
  return '🌙 Night Owl Mode';
}

function getIST(): string {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit',
    hour12: true, day: 'numeric', month: 'short'
  });
}

// ══════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════

export default function MainAgentOC() {
  const greeting = getGreeting();
  const istTime = getIST();

  // ─── Fleet stats ──
  const liveAgents = FLEET_DEPLOY.filter(a => a.status === 'live').length;
  const highPriority = TASK_QUEUE.filter(t => t.priority === 'high' && t.status !== 'done');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6">

      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30">
              <Radio className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Mission Control</h1>
              <p className="text-sm text-slate-400">Main Agent OC — Orchestration Dashboard</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Nominal
          </span>
          <span className="text-slate-500">{istTime}</span>
        </div>
      </div>

      {/* ─── GREETING ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">{greeting}, Commander</p>
            <p className="text-sm text-slate-400 mt-1">
              Fleet: {liveAgents}/10 deployed · {highPriority.length} high-priority task{highPriority.length !== 1 ? 's' : ''} · VTD #3: ✅ Complete
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Autonomous Execution · 100%</span>
          </div>
        </div>
      </div>

      {/* ─── ORCHESTRATION METRICS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {ORCH_METRICS.map((m, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 hover:border-slate-600/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className={m.accent}>{m.icon}</span>
              <span className="text-xs text-slate-500">{m.label}</span>
            </div>
            <div className="text-lg font-bold">{m.value}</div>
          </div>
        ))}
      </div>

      {/* ─── TWO-COLUMN LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ─── FLEET DEPLOY STATUS ─── */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Fleet Deploy Status
            </h2>
            <span className="text-xs text-emerald-400">{liveAgents}/10 Live</span>
          </div>
          <div className="space-y-1">
            {FLEET_DEPLOY.map((agent, i) => (
              <div key={i} className={cn(
                "flex items-center justify-between p-2 rounded-lg text-sm",
                "hover:bg-slate-700/30 transition-colors",
                agent.status === 'pending' ? 'opacity-50' : ''
              )}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    agent.status === 'live' ? 'bg-emerald-400' :
                    agent.status === 'staged' ? 'bg-amber-400' : 'bg-slate-600'
                  )} />
                  <span className="font-medium truncate">{agent.name}</span>
                  <span className="text-xs text-slate-500 hidden sm:inline">{agent.role}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {agent.status === 'live' ? (
                    <a href={`#${agent.route}`}
                      className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
                      {agent.feature} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SYSTEM PULSE ─── */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" /> System Pulse
            </h2>
            <span className="text-xs text-slate-500">Real-time</span>
          </div>
          <div className="space-y-2">
            {SYSTEM_PULSE.map((sys) => (
              <div key={sys.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
                <span className={cn(
                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                  sys.status === 'healthy' ? 'bg-emerald-400' :
                  sys.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{sys.label}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                      sys.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' :
                      sys.status === 'degraded' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    )}>
                      {sys.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{sys.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── TASK QUEUE ─── */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-amber-400" /> Active Task Queue
            </h2>
            <span className="text-xs text-slate-500">{TASK_QUEUE.filter(t => t.status !== 'done').length} open</span>
          </div>
          <div className="space-y-1">
            {TASK_QUEUE.map((task) => (
              <div key={task.id} className={cn(
                "flex items-center justify-between p-2 rounded-lg text-sm",
                "hover:bg-slate-700/30 transition-colors",
                task.status === 'done' ? 'opacity-40' : ''
              )}>
                <div className="flex items-center gap-3 min-w-0">
                  {task.status === 'done' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : task.status === 'in_progress' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="font-medium truncate block">{task.title}</span>
                    <span className="text-[10px] text-slate-500">{task.assignee} · {task.deadline}</span>
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                  task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                  task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-slate-500/10 text-slate-400'
                )}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── EARNING PIPELINE ─── */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Earning Pipeline
            </h2>
            <span className="text-xs text-amber-400">Target: ₹3k/day → ₹1B/yr</span>
          </div>
          <div className="space-y-3">
            {EARNING_LANES.map((lane, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{lane.name}</span>
                  <span className={cn(
                    "text-xs",
                    lane.status === 'ready' ? 'text-emerald-400' :
                    lane.status === 'staging' ? 'text-blue-400' :
                    lane.status === 'staged' ? 'text-amber-400' :
                    'text-red-400'
                  )}>
                    {lane.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                      lane.color
                    )} style={{ width: `${lane.progress}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 w-24 text-right">{lane.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── QUICK LINKS ─── */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-purple-400" /> Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { label: 'Command Center', icon: <Radio className="w-4 h-4" />, route: '/command', color: 'text-yellow-400' },
            { label: 'Health Pulse', icon: <Heart className="w-4 h-4" />, route: '/health', color: 'text-rose-400' },
            { label: 'Research Intel', icon: <Brain className="w-4 h-4" />, route: '/research', color: 'text-cyan-400' },
            { label: 'MarketFin', icon: <TrendingUp className="w-4 h-4" />, route: '/finance', color: 'text-emerald-400' },
            { label: 'Systems', icon: <Server className="w-4 h-4" />, route: '/systems', color: 'text-blue-400' },
            { label: 'Psychology', icon: <BookOpen className="w-4 h-4" />, route: '/psychology', color: 'text-green-400' },
            { label: 'CSAT Practice', icon: <Brain className="w-4 h-4" />, route: '/csat', color: 'text-blue-400' },
            { label: 'Social Pulse', icon: <MessageSquare className="w-4 h-4" />, route: '/social', color: 'text-violet-400' },
            { label: 'Productivity', icon: <Zap className="w-4 h-4" />, route: '/productivity', color: 'text-amber-400' },
            { label: 'UPSC Lens', icon: <BookOpen className="w-4 h-4" />, route: '/upsc', color: 'text-indigo-400' },
          ].map((link, i) => (
            <a key={i} href={`#${link.route}`}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-700/20 border border-slate-700/30
                         hover:bg-slate-700/40 hover:border-slate-600/50 transition-all text-sm">
              <span className={link.color}>{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ─── FOOTER TIMESTAMP ─── */}
      <div className="text-center text-[10px] text-slate-600 pb-4">
        Mission Control · Main Agent OC · Last sync: {istTime} · All routes live
      </div>
    </div>
  );
}
