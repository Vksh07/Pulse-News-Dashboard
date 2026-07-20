// ═════════════════════════════════════════════════════
// PULSE — MarketFin Page (zFinance Agent OC)
// ═════════════════════════════════════════════════════
// ADHD-friendly: API-connected, micro-interactions, stale-warning, animated progress
// ═════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  PieChart, Wallet, Target, Zap, AlertTriangle,
  Activity, ArrowUpRight, ArrowDownRight, RefreshCw,
  Sparkles, Eye, EyeOff, MousePointerClick
} from 'lucide-react';

// ─── Type ──
interface EarningsData {
  daily_goal: number;
  daily_progress: number;
  daily_remaining: number;
  monthly_goal: number;
  lanes: Array<{id:string;label:string;status:string;notes:string}>;
  active_lanes: number;
  ready_lanes: number;
  total_lanes: number;
  blocker: string;
  pipeline_status: string;
  updated_at: string;
}
interface EconBrief {
  key_rates?: Record<string,string>;
}

// ─── Market Snapshot (static fallback if API down) ──

const DEFAULT_MARKET = {
  nifty: { value: 23947, change: -220, pct: -0.91, direction: 'down' as const },
  sensex: { value: 76592, change: -817, pct: -1.07, direction: 'down' as const },
  usdinr: { value: 94.36, change: 0.12, pct: 0.13, direction: 'up' as const },
  brent: { value: 80.12, change: 1.62, pct: 2.06, direction: 'up' as const },
  gold: { value: 146392, change: -2917, pct: -1.96, direction: 'down' as const },
};
type MarketKeys = keyof typeof DEFAULT_MARKET;

// ─── AaS Product Overview ──

const AAS_PRODUCTS = [
  {
    name: 'Creator-Ops Pack',
    tier: 'Launch',
    price: '₹2,499/mo',
    prospects: 8,
    payment: 'Instamojo (₹)',
    status: 'MVP-ready',
  },
  {
    name: 'Research Intelligence',
    tier: 'Growth',
    price: '₹4,999/mo',
    prospects: 4,
    payment: 'Instamojo (₹)',
    status: 'MVP-ready',
  },
  {
    name: 'AI Eval & QA',
    tier: 'Scale',
    price: '₹9,999/mo',
    prospects: 3,
    payment: 'Crypto/USDC',
    status: 'MVP-ready',
  },
];

// ─── Earning Milestones (dynamic from API) ──

const LONG_TERM_TARGET = 250_000_000_000;

const QUICKFLIP_STATUS = {
  state: 'STAGED — Awaiting Capitulation',
  triggers: [
    { name: 'VIX > 25', met: false },
    { name: 'IT rout > -8%', met: false },
    { name: 'FII net sellers > ₹5K Cr', met: false },
    { name: 'Nifty PCR < 0.7', met: false },
  ],
  capital: '₹0 (pre-seed)',
  entryCriteria: '2/4 triggers + capital availability',
};

// ─── Small XP award helper (fires custom event for gamification store) ──
function awardXP(amount: number) {
  try {
    window.dispatchEvent(new CustomEvent('adhd-xp', { detail: { amount } }));
  } catch { /* gamification store may not be mounted */ }
}

export function MarketFin() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [economyBrief, setEconomyBrief] = useState<EconBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [clickFx, setClickFx] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // ── Fetch earnings + econ brief ──
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [earnRes, econRes] = await Promise.all([
        fetch('/api/earnings.json').then(r => r.ok ? r.json() : null),
        fetch('/api/economy-brief.json').then(r => r.ok ? r.json() : null),
      ]);
      if (earnRes) setEarnings(earnRes);
      if (econRes) setEconomyBrief(econRes);
      setLastFetch(new Date().toLocaleTimeString('en-IN', { hour12: false }));
      awardXP(5); // small dopamine for refreshing
    } catch {
      console.warn('[MarketFin] API fetch failed — using fallback data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Animate progress bars on load ──
  useEffect(() => {
    if (!isLoading && progressRef.current) {
      const bars = progressRef.current.querySelectorAll('.progress-fill');
      bars.forEach((bar, i) => {
        setTimeout(() => {
          (bar as HTMLElement).style.transition = 'width 0.8s ease-out';
        }, i * 150);
      });
    }
  }, [isLoading, earnings]);

  // ── Micro-interaction: card click ──
  const handleMicroWin = useCallback((label: string, xpAmount = 3) => {
    awardXP(xpAmount);
    setClickFx(label);
    setTimeout(() => setClickFx(null), 600);
  }, []);

  // ── Helper ──
  const formatValue = (val: number, unit = '') => {
    if (Math.abs(val) >= 10000000) return `${(val / 10000000).toFixed(2)}Cr${unit}`;
    if (Math.abs(val) >= 100000) return `${(val / 100000).toFixed(2)}L${unit}`;
    return `${val.toLocaleString('en-IN')}${unit}`;
  };

  const dailyPct = earnings ? Math.min(100, (earnings.daily_progress / earnings.daily_goal) * 100) : 0;
  const monthlyPct = earnings ? Math.min(100, (earnings.daily_progress / earnings.monthly_goal) * 100) : 0;
  const staleWarning = lastFetch && (Date.now() - new Date(lastFetch).getTime() > 15 * 60 * 1000);

  return (
    <div className={`min-h-screen bg-slate-950 p-4 md:p-6 space-y-4 md:space-y-6 ${focusMode ? 'max-w-2xl mx-auto' : ''}`}>
      {/* ── Header with ADHD-friendly micro-win zone ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" /> 
            {focusMode ? 'Finance • Focus' : 'Markets & Finance'}
          </h1>
          <p className="text-slate-400 text-xs flex items-center gap-2 flex-wrap">
            <span>Last fetch: {lastFetch || '—'}</span>
            {staleWarning && <span className="text-amber-400 font-semibold">⚠ STALE</span>}
            {isLoading && <span className="text-blue-400 animate-pulse">⟳ loading…</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Focus Mode toggle */}
          <button
            onClick={() => setFocusMode(f => !f)}
            className={`p-2 rounded-lg transition ${focusMode ? 'bg-emerald-900/40 text-emerald-300' : 'text-slate-400 hover:text-white'}`}
            title={focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
          >
            {focusMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          {/* Refresh button with micro-win */}
          <button
            onClick={() => { fetchData(); handleMicroWin('refresh', 5); }}
            className={`p-2 rounded-lg transition ${isLoading ? 'text-slate-600' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title="Refresh data (+5 XP)"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Micro-win flash feedback ── */}
      {clickFx && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900/80 text-emerald-200 px-3 py-1.5 rounded-lg text-sm font-medium animate-bounce shadow-lg">
          ✨ +3 XP · {clickFx}
        </div>
      )}

      {/* ── Quick-glance Finance Pulse (ADHD win) ── */}
      <div
        onClick={() => handleMicroWin('pulse-check')}
        className="bg-gradient-to-r from-emerald-900/30 to-slate-900/80 border border-emerald-800/30 rounded-xl p-4 cursor-pointer hover:border-emerald-600/50 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium mb-1">
          <Activity className="w-4 h-4" /> Daily Finance Pulse
          <Sparkles className="w-3 h-3 text-amber-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-slate-400">Daily Target</span>
            <div className="text-white font-bold">{earnings ? `₹${earnings.daily_goal.toLocaleString('en-IN')}` : '₹3,000'}</div>
          </div>
          <div>
            <span className="text-slate-400">Progress</span>
            <div className="text-white font-bold">₹0 <span className="text-slate-500 text-xs">(T+0)</span></div>
          </div>
          <div>
            <span className="text-slate-400">Blocked By</span>
            <div className="text-amber-300 font-medium text-xs">{earnings?.blocker || '.env tokens'}</div>
          </div>
          <div>
            <span className="text-slate-400">Pipeline</span>
            <div className="text-emerald-400 font-medium text-xs">{earnings?.pipeline_status || '5/5 ready'}</div>
          </div>
        </div>
      </div>

      {/* ── Market Snapshot Grid ── (clickable for micro-win dopamine) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.entries(DEFAULT_MARKET) as [MarketKeys, typeof DEFAULT_MARKET[MarketKeys]][]).map(([key, item]) => (
          <div
            key={key}
            onClick={() => handleMicroWin(key)}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 cursor-pointer hover:border-slate-600 hover:bg-slate-900 transition-all active:scale-95"
          >
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
              {key === 'nifty' ? 'NIFTY 50' : key === 'sensex' ? 'SENSEX' : key === 'usdinr' ? 'USD/INR' : key === 'brent' ? 'BRENT OIL' : 'GOLD'}
            </div>
            <div className="text-white text-lg font-bold">
              {key === 'nifty' || key === 'sensex' || key === 'gold'
                ? item.value.toLocaleString('en-IN')
                : key === 'usdinr' ? item.value.toFixed(2) : `$${item.value.toFixed(2)}`}
            </div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${
              item.direction === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {item.direction === 'up' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {item.pct > 0 ? '+' : ''}{item.pct.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      {/* ── Two Column ── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* ── AaS Products (clickable for dopamine + hover animation) ── */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" /> AaS Products
          </h2>
          <div className="space-y-2">
            {AAS_PRODUCTS.map((p, i) => (
              <div
                key={i}
                onClick={() => handleMicroWin(p.name)}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 cursor-pointer hover:border-purple-600/50 hover:bg-slate-800/70 transition-all active:scale-[0.98] group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-white font-medium group-hover:text-purple-300 transition-colors">{p.name}</span>
                    <span className="ml-2 text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded">{p.tier}</span>
                  </div>
                  <span className="text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">{p.price}</span>
                </div>
                <div className="flex gap-3 mt-1.5 text-xs text-slate-400">
                  <span>{p.prospects} prospects</span>
                  <span>{p.payment}</span>
                  <span className="text-emerald-400/80">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Earning Milestones (animated progress bars) ── */}
        <div ref={progressRef} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" /> Revenue Targets
          </h2>
          <div className="space-y-3">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Daily Floor</span>
                <span className="text-slate-400">
                  <span className="text-red-400">₹{earnings?.daily_progress.toLocaleString('en-IN') || '0'}</span>
                  <span className="text-slate-600"> / ₹{earnings?.daily_goal.toLocaleString('en-IN') || '3,000'}</span>
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="progress-fill bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full"
                  style={{ width: `${dailyPct}%`, transition: 'width 0.8s ease-out' }}
                />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Monthly Goal</span>
                <span className="text-slate-400">
                  <span className="text-red-400">₹{earnings?.daily_progress.toLocaleString('en-IN') || '0'}</span>
                  <span className="text-slate-600"> / ₹{earnings?.monthly_goal.toLocaleString('en-IN') || '90,000'}</span>
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="progress-fill bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                  style={{ width: `${monthlyPct}%`, transition: 'width 0.8s ease-out' }}
                />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Yearly Ambition</span>
                <span className="text-slate-400">
                  <span className="text-red-400">₹0</span>
                  <span className="text-slate-600"> / ₹250B</span>
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="progress-fill bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full" style={{ width: '0%', transition: 'width 0.8s ease-out' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICKFLIP Monitor — ADHD-friendly trigger tracker ── */}
      <div className="bg-slate-900/80 border border-amber-800/40 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> QUICKFLIP Signal Monitor
          </h2>
          <span className="text-xs text-amber-400/60 font-mono">{QUICKFLIP_STATUS.capital}</span>
        </div>
        <div
          onClick={() => handleMicroWin('quickflip-status')}
          className="bg-gradient-to-r from-amber-900/20 to-amber-950/30 border border-amber-800/30 rounded-lg p-3 mb-3 cursor-pointer hover:border-amber-600/50 transition-all"
        >
          <div className="flex items-center gap-2 text-amber-300">
            <Activity className="w-4 h-4" />
            <span className="font-medium">{QUICKFLIP_STATUS.state}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Triggers needed: {QUICKFLIP_STATUS.entryCriteria}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {QUICKFLIP_STATUS.triggers.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs bg-slate-800/40 rounded-lg p-2">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.met ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className={t.met ? 'text-green-300' : 'text-slate-400'}>{t.name}</span>
              <span className="ml-auto">{t.met ? '✅' : '⏳'}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <span>Progress:</span>
          <span className="text-amber-400 font-medium">{QUICKFLIP_STATUS.triggers.filter(t=>t.met).length}/{QUICKFLIP_STATUS.triggers.length}</span>
          <span>triggers met</span>
        </div>
      </div>

      {/* ── Pipeline Lanes Status ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" /> Earnings Pipeline
        </h2>
        <div className="space-y-2">
          {(earnings?.lanes || [
            {id:'freelancer',label:'Freelancer',status:'ready',notes:'Awaiting .env token'},
            {id:'telegram_bot',label:'Telegram Bot',status:'ready',notes:'Awaiting .env token'},
            {id:'gumroad_pdf',label:'Gumroad PDFs',status:'staged',notes:'Pivot drafted'},
            {id:'quickflip',label:'QUICKFLIP.sh',status:'ready',notes:'Bidding script ready'},
            {id:'news_dashboard',label:'ADHD News Dashboard',status:'active',notes:'Live :18926'},
          ]).map((lane) => (
            <div key={lane.id} className="flex items-center gap-2 text-xs bg-slate-800/40 rounded-lg px-3 py-2">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                lane.status === 'active' ? 'bg-green-400 animate-pulse' :
                lane.status === 'ready' ? 'bg-amber-400' :
                lane.status === 'staged' ? 'bg-blue-400' : 'bg-slate-500'
              }`} />
              <span className="text-white font-medium">{lane.label}</span>
              <span className={`text-[10px] px-1 py-0.5 rounded ${
                lane.status === 'active' ? 'bg-green-900/40 text-green-300' :
                lane.status === 'ready' ? 'bg-amber-900/40 text-amber-300' :
                'bg-blue-900/40 text-blue-300'
              }`}>{lane.status}</span>
              <span className="text-slate-500 ml-auto">{lane.notes}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Market Context ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" /> Market Context
        </h2>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• <strong className="text-white">Nifty IT index -6%</strong> — TCS, Infosys, TechM plunged after Accenture slashed FY26 guidance to 3-4%</p>
          <p>• <strong className="text-white">Fed held at 3.5-3.75%</strong> — Warsh dissented; rate cut path uncertain</p>
          <p>• <strong className="text-white">Brent ~$80</strong> — US-Iran deal uncertainty; Israel-Lebanon escalation risk</p>
          <p>• <strong className="text-white">USD/INR 94.36</strong> — Rupee under pressure from FII outflows</p>
          <p>• <strong className="text-white">AaS MVP: Instamojo + Crypto</strong> — Dual-track live. 15 prospects across 3 tiers staged.</p>
        </div>
      </div>

      {/* ── Footer — quick-win daily review click ── */}
      <div className="text-center pb-4">
        <button
          onClick={() => handleMicroWin('daily-review', 10)}
          className="text-xs text-slate-500 hover:text-emerald-400 transition border border-slate-800 hover:border-emerald-800/40 rounded-full px-4 py-1.5"
        >
          ✅ Daily Review · +10 XP
        </button>
      </div>
    </div>
  );
}
