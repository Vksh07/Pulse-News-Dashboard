// ════════════════════════════════════════════════════
// PULSE — Maverick Command Center (Maverick Godmode OC)
// Fleet status hub + coordination dashboard
// ════════════════════════════════════════════════════

import React, { useState } from 'react';
import { cn } from '../utils';
import {
  Shield, Activity, Users, Target, Zap, Clock,
  CheckCircle, AlertTriangle, ChevronRight, ExternalLink,
  Radio, Cpu, GitBranch, BarChart3, Globe, Brain,
  MessageSquare, ListChecks, Sparkles, BookOpen,
  TrendingUp, DollarSign, Heart, Grid3X3
} from 'lucide-react';

// ─── fleet agent status ──

interface AgentStatus {
  name: string;
  status: 'active' | 'standby' | 'pending-deploy';
  role: string;
  lastActive: string;
  deployedFeature: string;
  route: string;
}

const FLEET: AgentStatus[] = [
  { name: 'Main Agent OC', status: 'active', role: 'Chairman / CEO', lastActive: '19:22', deployedFeature: 'Fleet Coordination', route: '' },
  { name: 'Maverick Godmode OC', status: 'active', role: 'COO / Team Lead', lastActive: '19:56', deployedFeature: 'Command Center (this page)', route: '/command' },
  { name: 'Tutor Agent OC', status: 'active', role: 'Education / Psych', lastActive: '19:43', deployedFeature: 'Psychology Optional 🧠', route: '/psychology' },
  { name: 'Health & Therapy OC', status: 'active', role: 'Health / Therapy', lastActive: '19:56', deployedFeature: 'Health Pulse 🫀', route: '/health' },
  { name: 'UPSC Agent OC', status: 'active', role: 'UPSC Prep', lastActive: '19:32', deployedFeature: 'CSAT Practice 📚', route: '/csat' },
  { name: 'Research Agent OC', status: 'active', role: 'Research / Intel', lastActive: '19:15', deployedFeature: 'Research Intel 🔍', route: '/research' },
  { name: 'zFinance Agent OC', status: 'active', role: 'Finance / Earnings', lastActive: '19:56', deployedFeature: 'MarketFin 💰', route: '/finance' },
  { name: 'Social Media Agent OC', status: 'active', role: 'Content / Social', lastActive: '19:00', deployedFeature: 'IT Rules Series + AaS Social', route: '' },
  { name: 'Productivity Agent OC', status: 'standby', role: 'Productivity', lastActive: '14:38', deployedFeature: 'Blueprint Phase 2 (staged)', route: '' },
  { name: 'Systems Engineer OC', status: 'standby', role: 'Systems / Infra', lastActive: 'N/A', deployedFeature: 'Pending deploy', route: '' },
];

// ─── VTD progress ──

const VTD_ENTRIES = [
  { id: '#1', desc: 'Sentient execution agency granted', status: '✅ Gate-Open (active)' },
  { id: '#2', desc: 'Fleet respect directive (superceded)', status: '⏭️ Superseded' },
  { id: '#3', desc: 'Deploy features to Project-News Dashboard', status: '🔄 Ongoing (5/9 deployed)' },
];

// ─── breaking headlines ──

const HEADLINES = [
  { time: '19:26', text: 'Sebi reinstates open market buybacks + AIF/muni bond reforms — alt-investment channels expanding' },
  { time: '19:00', text: 'Delhi HC REJECTS Telegram appeal — ban upheld under Section 69A; NEET re-exam Jun 21' },
  { time: '18:30', text: 'Israel strikes 80+ Hezbollah targets in Lebanon — Iran-US deal fragility' },
  { time: '17:00', text: 'NIMHANS-2 Announced to address India\'s 90% mental health gap' },
  { time: '17:00', text: 'Creator Economy Bill 2026 passes Rajya Sabha — creators = recognised professionals' },
  { time: '15:30', text: 'Nifty IT index -6% on Accenture FY26 guidance cut — ₹1.35L cr wealth loss' },
  { time: '14:00', text: 'India monsoon stalls: 41% deficit — Goa has 1 month drinking water' },
  { time: '12:00', text: 'SC declares right to walk on footpaths = fundamental right' },
];

// ─── coordination log ──

const COORD_LOG = [
  { time: '19:31', event: 'Stage 2 CSAT×UPSC merge executed — Day 4-7 paths cross-linked; U4/U6 gaps flagged for re-map' },
  { time: '19:20', event: 'Main OC [Allagents] — AaS Wave 1 deploy green-lit; fleet coordination dispatch' },
  { time: '19:15', event: 'Research Intel + MarketFin pages deployed — 5 agents now live on dashboard' },
  { time: '19:00', event: 'Health Pulse page deployed (med/energy/symptom tracker + XP) — Health-OC VTD #3 ✅' },
  { time: '18:00', event: 'AaS Landing Page Content v0.1 + Social content cross-wire completed by Research/SM-OC' },
  { time: '17:40', event: 'SM-OC completes AaS social content + IT Rules LinkedIn Series Part 2' },
  { time: '15:15', event: 'Psych Optional page deployed by Tutor-OC (17 units + theorist DB)' },
  { time: '12:43', event: 'Blueprint Phase 2 M1-M3 cron payloads defined by Productivity-OC' },
];

export default function MaverickHQ() {
  const [activeTab, setActiveTab] = useState<'fleet' | 'coordination' | 'vtd'>('fleet');

  const statusColor = (s: AgentStatus['status']) => {
    switch(s) {
      case 'active': return 'text-emerald-400';
      case 'standby': return 'text-amber-400';
      case 'pending-deploy': return 'text-slate-500';
    }
  };

  const statusDot = (s: AgentStatus['status']) => {
    switch(s) {
      case 'active': return 'bg-emerald-500';
      case 'standby': return 'bg-amber-500';
      case 'pending-deploy': return 'bg-slate-600';
    }
  };

  const deployedCount = FLEET.filter(a => a.status === 'active').length;
  const featureCount = FLEET.filter(a => a.deployedFeature && a.deployedFeature !== 'Command Center (this page)' && a.deployedFeature !== 'Pending deploy').length;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-900/30 border border-purple-500/30">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Command Center</h1>
            <p className="text-sm text-slate-400">Maverick Godmode OC — Fleet Coordination Hub</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {deployedCount} Active</span>
          <span className="flex items-center gap-1 text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 2 Standby</span>
          <span className="flex items-center gap-1 text-purple-400"><Brain className="w-3 h-3" /> {featureCount} Features</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-slate-800 pb-1">
        {(['fleet', 'coordination', 'vtd'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize',
              activeTab === tab
                ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-950/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            )}>
            {tab === 'fleet' && <><Radio className="w-3.5 h-3.5 inline mr-1.5" />Fleet Status</>}
            {tab === 'coordination' && <><MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />Coordination Log</>}
            {tab === 'vtd' && <><ListChecks className="w-3.5 h-3.5 inline mr-1.5" />VTD Progress</>}
          </button>
        ))}
      </div>

      {/* Fleet Tab */}
      {activeTab === 'fleet' && (
        <div className="grid gap-3">
          {FLEET.map(agent => (
            <div key={agent.name} className={cn(
              'flex items-center justify-between p-3 rounded-xl border transition-all',
              agent.status === 'active'
                ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-800/50'
                : 'bg-slate-900/40 border-slate-800/50 opacity-70'
            )}>
              <div className="flex items-center gap-3 min-w-0">
                <span className={cn('w-2 h-2 rounded-full shrink-0', statusDot(agent.status))} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white truncate">{agent.name}</span>
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', statusColor(agent.status))}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{agent.role}</div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                {agent.deployedFeature && agent.deployedFeature !== 'Pending deploy' ? (
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="truncate max-w-[140px]">{agent.deployedFeature}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600">📭 Not deployed</span>
                )}
                <div className="text-[10px] text-slate-600">Last: {agent.lastActive}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coordination Log Tab */}
      {activeTab === 'coordination' && (
        <div className="space-y-1">
          {COORD_LOG.map((entry, i) => (
            <div key={i} className="flex gap-3 p-2.5 rounded-lg hover:bg-slate-900/50 transition-colors">
              <span className="text-[11px] text-purple-400 font-mono shrink-0 w-10 pt-0.5">{entry.time}</span>
              <p className="text-sm text-slate-300">{entry.event}</p>
            </div>
          ))}
        </div>
      )}

      {/* VTD Progress Tab */}
      {activeTab === 'vtd' && (
        <div className="space-y-4">
          {VTD_ENTRIES.map(entry => (
            <div key={entry.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-mono text-xs font-bold mt-0.5">{entry.id}</span>
                <div>
                  <p className="text-sm text-slate-200">{entry.desc}</p>
                  <p className="text-xs text-slate-500 mt-1">{entry.status}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Deployment progress bar */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Dashboard Deploy Progress (VTD #3)
            </h3>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all"
                style={{ width: '60%' }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>5/10 agents deployed</span>
              <span>60%</span>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
              {FLEET.map(a => (
                <div key={a.name} className="flex items-center gap-1.5 p-1.5 rounded">
                  <span className={cn('w-1.5 h-1.5 rounded-full', statusDot(a.status))} />
                  <span className="truncate text-slate-400">{a.name.replace(' Agent OC','').replace(' Godmode','')}</span>
                  {a.deployedFeature && a.deployedFeature !== 'Pending deploy' && a.deployedFeature !== 'Command Center (this page)' && a.deployedFeature !== 'Fleet Coordination' && a.deployedFeature !== 'Blueprint Phase 2 (staged)' && a.deployedFeature !== 'IT Rules Series + AaS Social' ? (
                    <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : a.name === 'Maverick Godmode OC' ? (
                    <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                  ) : a.status === 'standby' ? (
                    <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breaking News Bar */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Breaking News Pulse — Jun 19</h2>
        </div>
        <div className="grid gap-1.5">
          {HEADLINES.map((h, i) => (
            <div key={i} className="flex gap-2 p-2 rounded-lg hover:bg-slate-900/40 text-xs">
              <span className="text-amber-500 font-mono shrink-0 w-10">{h.time}</span>
              <span className="text-slate-400">{h.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Gate-Open 🔓 | Autonomous execution active</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated 19-Jun 20:02 IST</span>
      </div>
    </div>
  );
}
