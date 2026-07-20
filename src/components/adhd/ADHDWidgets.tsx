// ════════════════════════════════════════════════════
// PULSE — ADHD Widgets (Enhanced with Dialogs + Confetti)
// ════════════════════════════════════════════════════

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useUIStore, useGamificationStore, useMicroGoalsStore, useEnergyStore } from '../../store';
import { cn } from '../../utils';
import { Zap, Shield, Check, X } from 'lucide-react';

// ─── Confetti Trigger ───
export function triggerConfettiLight(count = 20) {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#eab308','#22c55e','#f87171','#60a5fa','#a78bfa','#fb923c','#34d399','#f472b6'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.cssText = `
      left: ${30 + Math.random() * 40}%;
      top: -5%;
      width: ${6 + Math.random() * 6}px; height: ${(6 + Math.random() * 6) * 0.6}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-delay: ${Math.random() * 0.3}s;
      animation-duration: ${1.5 + Math.random() * 1.5}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

// ─── Next Thing Widget ───
const CONTEXTUAL_NUDGES = [
  { hours: [0, 7], emoji: '🌙', text: 'Rest is productive. Log your sleep', action: 'Log sleep' },
  { hours: [7, 10], emoji: '🌅', text: 'Morning peak — check overnight news', action: 'Open Pulse' },
  { hours: [10, 12], emoji: '📝', text: 'CSAT: do one more question', action: 'Open CSAT' },
  { hours: [12, 15], emoji: '📖', text: 'Read 3 UPSC articles from Pulse', action: 'Open Pulse' },
  { hours: [15, 18], emoji: '⚡', text: 'Evening energy — review what you learned', action: 'Review day' },
  { hours: [18, 22], emoji: '🌙', text: 'Wind-down revision — 1 quick topic', action: 'Quick revise' },
  { hours: [22, 24], emoji: '🛌', text: 'Rest is productive. Log your sleep', action: 'Log sleep' },
];

export function NextThingWidget() {
  const [nudge, setNudge] = useState(CONTEXTUAL_NUDGES[0]);
  const { dailyCount } = useGamificationStore();

  useEffect(() => {
    const updateNudge = () => {
      const h = new Date().getHours();
      const match = CONTEXTUAL_NUDGES.find(n => h >= n.hours[0] && h < n.hours[1]);
      if (match) setNudge(match);
    };
    updateNudge();
    const interval = setInterval(updateNudge, 60000);
    return () => clearInterval(interval);
  }, []);

  if (dailyCount < 5 && nudge.hours[0] >= 10 && nudge.hours[0] < 15) {
    return (
      <div className="adhd-widget next-thing-widget p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl flex-shrink-0">
            {nudge.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">NEXT THING</p>
            <p className="font-semibold text-white">{nudge.text}</p>
            <p className="text-xs text-slate-400 mt-1">→ {nudge.action}</p>
          </div>
        </div>
        <div className="mt-3 p-2 bg-slate-800/50 rounded-lg text-xs text-slate-400">
          {dailyCount}/5 articles today — {5 - dailyCount} to go
        </div>
      </div>
    );
  }

  return (
    <div className="adhd-widget next-thing-widget p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl flex-shrink-0">
          {nudge.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">NEXT THING</p>
          <p className="font-semibold text-white">{nudge.text}</p>
          <p className="text-xs text-slate-400 mt-1">→ {nudge.action}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Three Second Widget ───
const SPRINT_TASKS = [
  'Open one article and read the first paragraph',
  'Write down ONE thing you learned today',
  'Solve one CSAT question — just one',
  'Open a topic you\'ve been avoiding and skim it',
  'Take 3 deep breaths. That\'s the task.',
  'Review your streak. Feel proud.',
  'Open the UPSC feed. Click one article.',
];

export function ThreeSecondWidget() {
  const [sprintActive, setSprintActive] = useState(false);
  const [seconds, setSeconds] = useState(180);
  const [currentTask, setCurrentTask] = useState(SPRINT_TASKS[0]);
  const [showDialog, setShowDialog] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (showDialog) return;
    if (!sprintActive) return;
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setSprintActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [sprintActive, showDialog]);

  const startSprint = () => {
    setCurrentTask(SPRINT_TASKS[Math.floor(Math.random() * SPRINT_TASKS.length)]);
    setSeconds(180);
    setSprintActive(true);
    setShowDialog(true);
  };

  const completeSprint = () => {
    clearInterval(timerRef.current!);
    setSprintActive(false);
    setShowDialog(false);
    triggerConfettiLight(20);
    // Award XP
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('adhd-xp', { detail: { amount: 10, reason: 'sprint' } });
      window.dispatchEvent(event);
    }
  };

  const cancelSprint = () => {
    clearInterval(timerRef.current!);
    setSprintActive(false);
    setShowDialog(false);
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div className="adhd-widget three-sec-widget p-4">
      {!showDialog && sprintActive ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full flex items-center gap-1">
              <Zap className="h-3 w-3" />
              3-SECOND SPRINT
            </span>
            <span className="font-mono text-lg text-yellow-500 tabular-nums">{formatTime(seconds)}</span>
          </div>
          <p className="text-white">{currentTask}</p>
          <p className="text-xs text-slate-500 text-center">Timer runs down. No planning. Just doing.</p>
          <div className="flex gap-2">
            <button
              onClick={completeSprint}
              className="flex-1 btn-primary btn-sm"
            >
              ✅ I did it!
            </button>
            <button
              onClick={cancelSprint}
              className="flex-1 btn-secondary btn-sm"
            >
              ✕ Skip
            </button>
          </div>
        </div>
      ) : !showDialog ? (
        <button onClick={startSprint} className="three-second-btn w-full">
          <div className="flex items-center justify-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center text-xl">⚡</span>
            <div className="text-left">
              <span className="font-bold text-lg text-white">START NOW</span>
              <span className="block text-xs text-slate-400">3-second rule — no thinking, just doing</span>
            </div>
          </div>
        </button>
      ) : null}

      {/* Sprint Dialog Overlay */}
      {showDialog && (
        <div className="dialog-overlay" onClick={cancelSprint}>
          <div className="dialog sprint-dialog" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full flex items-center gap-1">
                <Zap className="h-3 w-3" />
                SPRINT
              </span>
              <span className="font-mono text-lg text-yellow-500 tabular-nums">{formatTime(seconds)}</span>
            </div>
            <p className="text-white text-lg mb-2">{currentTask}</p>
            <p className="text-xs text-slate-500 text-center mb-4">Timer runs down. No planning. Just doing.</p>
            <div className="flex gap-2">
              <button onClick={completeSprint} className="flex-1 btn-primary btn-sm">
                ✅ I did it!
              </button>
              <button onClick={cancelSprint} className="flex-1 btn-secondary btn-sm">
                ✕ Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Energy Widget ───
export function EnergyWidget() {
  const { energyData, updateEnergy } = useEnergyStore();

  useEffect(() => {
    updateEnergy();
    const interval = setInterval(updateEnergy, 300000);
    return () => clearInterval(interval);
  }, [updateEnergy]);

  const { level, percentage, recommendation, nextTransition } = energyData;

  const modeConfig = {
    high: { label: 'GO 🚀', color: 'text-yellow-500', icon: '🔥', bg: 'bg-yellow-500/20' },
    medium: { label: 'Pace ⚡', color: 'text-blue-500', icon: '⚡', bg: 'bg-blue-500/20' },
    low: { label: 'Rest 🌙', color: 'text-purple-500', icon: '🌙', bg: 'bg-purple-500/20' },
    rest: { label: 'Rest 🌙', color: 'text-gray-500', icon: '🛌', bg: 'bg-gray-500/20' },
  };

  const mode = modeConfig[level] || modeConfig.medium;

  return (
    <div className="adhd-widget energy-widget p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-white">⚡ Energy</span>
        <span className={cn('font-mono text-lg', mode.color)}>{percentage}%</span>
      </div>
      <div className="energy-track mb-2">
        <div className="energy-fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', mode.bg, mode.color)}>
          {mode.icon} {mode.label}
        </span>
        <span className="text-xs text-slate-500">{nextTransition}</span>
      </div>
      <p className="text-xs text-slate-400 mt-2">{recommendation}</p>
    </div>
  );
}

// ─── Streak Widget ───
export function StreakWidget({ streak }: { streak: number }) {
  const fireCount = Math.min(streak, 7);
  const fires = '🔥'.repeat(fireCount || 1);
  const level = Math.floor(streak / 7) + 1;

  return (
    <div className="adhd-widget streak-widget p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-white">🔥 Streak</span>
        <span className={cn('font-mono text-lg', streak >= 3 ? 'text-yellow-500' : 'text-slate-400')}>
          {streak}d
        </span>
      </div>
      <div className="streak-fire-wrap">
        <div className={cn('streak-fire', streak >= 3 ? 'hot' : '')} style={{ transform: `scale(${1 + Math.min(streak, 21) / 42})` }}>
          {fires}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-400">{streak > 0 ? 'Keep the fire burning!' : 'Start your streak today'}</span>
        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs font-medium rounded-full">
          Level {level}
        </span>
      </div>
    </div>
  );
}

// ─── Micro Goal Widget (with Dialog interaction) ───
const MICRO_GOALS = [
  { id: 'read1', label: '📖 Read 1 article', xp: 5 },
  { id: 'csat1', label: '📝 Solve 1 CSAT Q', xp: 10 },
  { id: 'pyq1', label: '🎯 Answer 1 PYQ', xp: 15 },
  { id: 'page5', label: '📄 Study 5 pages', xp: 10 },
  { id: 'focus15', label: '⏱ 15-min focus block', xp: 8 },
  { id: 'revise1', label: '🔄 Revise 1 topic', xp: 12 },
];

export function MicroGoalWidget() {
  const { active, chain, completed, date, doneGoals, setActiveGoal, completeGoal, cancelGoal, resetDaily } = useMicroGoalsStore();
  const [dialogGoal, setDialogGoal] = useState<string | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);
  const goalDoneSet = useMemo(() => new Set(doneGoals || []), [doneGoals, completed]);

  useEffect(() => {
    if (date !== todayStr) resetDaily();
  }, [date, resetDaily, todayStr]);

  // Recover from legacy localStorage shape that broke .has() before the store merge fix.
  useEffect(() => {
    try {
      if (!(doneGoals instanceof Set)) {
        localStorage.removeItem('pulse-microgoals');
        resetDaily();
      }
    } catch {}
  }, [doneGoals, resetDaily]);

  const handleGoalClick = (goalId: string) => {
    if (doneGoals.has(goalId)) return;
    if (active === goalId) {
      cancelGoal();
      setDialogGoal(null);
      return;
    }
    setActiveGoal(goalId);
    setDialogGoal(goalId);
  };

  const handleComplete = (goalId: string) => {
    completeGoal(goalId);
    setDialogGoal(null);
    // Confetti + XP
    triggerConfettiLight(12);
    if (chain >= 2) triggerConfettiLight(20); // Chain bonus
    // Chain bonus notification via custom event
    if (chain >= 2) {
      const event = new CustomEvent('adhd-xp', { detail: { amount: 10, reason: 'chain-bonus' } });
      window.dispatchEvent(event);
    }
  };

  const handleCancelDialog = () => {
    cancelGoal();
    setDialogGoal(null);
  };

  const activeGoalData = dialogGoal ? MICRO_GOALS.find(g => g.id === dialogGoal) : null;

  return (
    <div className="adhd-widget microgoal-widget p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-white">🎯 Micro-Goals</span>
        <span className="text-xs text-slate-400">
          {chain > 0 ? `🧩 Chain: ${'🧩'.repeat(chain)}` : 'Pick one → earn 🧩'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {MICRO_GOALS.map(g => {
          const done = goalDoneSet.has(g.id);
          const isActive = active === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleGoalClick(g.id)}
              disabled={done}
              className={cn(
                'mg-btn p-2 text-xs rounded-lg transition-all text-left',
                done && 'mg-done bg-green-500/20 text-green-400 cursor-default',
                isActive && !done && 'mg-active bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
                !done && !isActive && 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              <span className="flex items-center justify-between">
                {g.label}
                <span className={cn('text-xs font-bold', done ? 'text-green-400' : 'text-yellow-500')}>
                  {done ? '✅' : `+${g.xp}⭐`}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="text-xs text-slate-500 text-center">
        Today: {completed}/6 goals
      </div>

      {/* Micro-Goal Dialog */}
      {dialogGoal && activeGoalData && (
        <div className="dialog-overlay" onClick={handleCancelDialog}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-lg font-bold text-white">{activeGoalData.label}</h3>
              <p className="text-sm text-slate-400 mt-1">Focus on this until done</p>
              <div className="my-4 text-3xl opacity-70">⏳</div>
              <div className="text-xs text-slate-500 mb-4">Chain: {chain} 🧩 | XP: {activeGoalData.xp}{chain >= 3 ? ' (x2 bonus!)' : ''}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleComplete(dialogGoal)}
                className="flex-1 btn-primary btn-sm"
              >
                ✅ Complete!
              </button>
              <button
                onClick={handleCancelDialog}
                className="flex-1 btn-secondary btn-sm"
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quote Widget ───
const QUOTES = [
  { text: "You don't need perfect, you need started.", author: "ADHD Mantra" },
  { text: "The best time to study was yesterday. The next best time is now.", author: "UPSC Wisdom" },
  { text: "Small steps daily → big changes. Your streak proves it.", author: "Maverick" },
  { text: "Every article read = one step closer to your goal.", author: "Pulse" },
  { text: "Focus is a muscle. Every session = one rep.", author: "ADHD Science" },
  { text: "Comparison is the thief of joy. Compete with yesterday-you.", author: "Self-Leaderboard" },
  { text: "Your brain craves completion. Finish one thing.", author: "Research-OC" },
  { text: "Three deep breaths. You've got this.", author: "Health-Therapy" },
  { text: "One question. One page. One step. That's all.", author: "UPSC-OC" },
  { text: "Discipline = deciding between what you want now and what you want most.", author: "Study Wisdom" },
];

export function QuoteWidget() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setQuoteIdx((p) => (p + 1) % QUOTES.length);
        setOpacity(1);
      }, 200);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const q = QUOTES[quoteIdx];

  return (
    <div className="adhd-widget quote-widget p-4">
      <div className="quote-rotator" style={{ opacity, transition: 'opacity 0.2s ease' }}>
        <p className="quote-text text-slate-300 italic mb-2">"{q.text}"</p>
        <p className="quote-author text-xs text-slate-500 text-right">— {q.author}</p>
      </div>
    </div>
  );
}

// ─── Shield Widget ───
export function ShieldWidget() {
  const { focusShield, toggleShield } = useUIStore();

  return (
    <div className="adhd-shield-bar p-2">
      <button
        id="adhd-shield-btn"
        onClick={toggleShield}
        className={cn(
          'w-full tool-btn py-2',
          focusShield ? 'active bg-purple-500/20 border-purple-500/30 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
        )}
        aria-pressed={focusShield}
      >
        <Shield className="h-4 w-4 mr-2" />
        {focusShield ? '🛡️ Focus Shield ON' : '🛡️ Focus Shield OFF'}
      </button>
      {focusShield && (
        <div className="mt-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400">
          Distractions hidden. Only the task remains.
        </div>
      )}
    </div>
  );
}
