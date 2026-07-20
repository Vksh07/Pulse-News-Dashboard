// ════════════════════════════════════════════════════
// PULSE — Health Pulse Page (Health & Therapy Agent OC)
// ════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../utils';
import {
  Heart, Activity, Pill, Brain, Moon, Sun, Thermometer,
  Droplets, ChevronRight, CheckCircle, AlertTriangle,
  TrendingUp, Clock, Sparkles, Zap, RefreshCw
} from 'lucide-react';

// ─── Medication Schedule (Venkat's actual regimen) ──

const MEDICATIONS = [
  { name: 'Clonazepam 0.25mg', times: '1-0-2', route: 'Sublingual', notes: 'Anxiety + Sleep维稳' },
  { name: 'Vortioxetine 20mg', times: '0-0-1', route: 'Oral', notes: 'Night — Antidepressant' },
  { name: 'Carbamazepine 200mg', times: '1-0-1', route: 'Oral', notes: 'Mood stabiliser' },
  { name: 'Etizolam 0.25mg', times: '0-1-0', route: 'Oral', notes: 'Evening SOS — Anxiety' },
  { name: 'Ramosetron', times: 'SOS', route: 'Oral', notes: 'IBS flare rescue' },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', icon: Sun, time: '7-9 AM' },
  { id: 'afternoon', label: 'Afternoon', icon: Sun, time: '12-2 PM' },
  { id: 'evening', label: 'Evening', icon: Moon, time: '6-8 PM' },
  { id: 'night', label: 'Night', icon: Moon, time: '9-11 PM' },
];

const DOSAGE_MAP: Record<string, string[]> = {
  'Clonazepam 0.25mg': ['morning', 'night'],
  'Vortioxetine 20mg': ['night'],
  'Carbamazepine 200mg': ['morning', 'night'],
  'Etizolam 0.25mg': ['evening'],
  'Ramosetron': [],
};

// ─── Symptom/Energy Check ──

const ENERGY_LEVELS = [
  { value: 1, label: 'Crash', emoji: '🛌', color: 'bg-red-500/20 text-red-400' },
  { value: 2, label: 'Low', emoji: '😴', color: 'bg-orange-500/20 text-orange-400' },
  { value: 3, label: 'Okay', emoji: '🙂', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 4, label: 'Good', emoji: '💪', color: 'bg-lime-500/20 text-lime-400' },
  { value: 5, label: 'Great', emoji: '🚀', color: 'bg-green-500/20 text-green-400' },
];

const SYMPTOMS = [
  { id: 'ibs', label: 'IBS Flare', icon: AlertTriangle },
  { id: 'pain', label: 'Body Pain', icon: Activity },
  { id: 'headache', label: 'Headache', icon: Brain },
  { id: 'dizziness', label: 'Dizziness', icon: Thermometer },
  { id: 'brain_fog', label: 'Brain Fog', icon: Brain },
  { id: 'anxiety', label: 'Anxiety', icon: Heart },
  { id: 'pem', label: 'PEM Crash', icon: Zap },
];

// ─── Pacing Tips (ADHD/ME/CFS-aware) ──

const PACING_TIPS = [
  { text: '🍅 25:5 Pomodoro — work 25, rest 5. No exceptions.', xp: 5 },
  { text: '💧 Drink water — if you\'re reading this, take a sip.', xp: 2 },
  { text: '🧘 2-min box breathing: 4-4-4-4. Reset vagus nerve.', xp: 5 },
  { text: '🚶 5-min walk or stand if PEM allows. Micro-movement.', xp: 10 },
  { text: '📵 15-min screen break. Lie down. Close eyes.', xp: 5 },
  { text: '🍽️ Eat something — don\'t skip meals.', xp: 5 },
  { text: '💊 Meds check — did you take your doses?', xp: 3 },
  { text: '🧠 One task. Not five. Just one.', xp: 5 },
  { text: '📝 Journal 2 mins — whatever is in your head.', xp: 10 },
  { text: '🌿 Electrolytes — sugar-free. For autonomic tone.', xp: 5 },
];

// ─── Store helpers (localStorage) ──

interface HealthLogEntry {
  date: string;
  energy: number;
  symptoms: string[];
  meds_taken: string[];
  note?: string;
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function loadHealthLog(): HealthLogEntry[] {
  try {
    const raw = localStorage.getItem('pulse_health_log');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHealthLog(log: HealthLogEntry[]) {
  localStorage.setItem('pulse_health_log', JSON.stringify(log));
}

function getTodayLog(): HealthLogEntry | null {
  const log = loadHealthLog();
  return log.find(e => e.date === getTodayKey()) ?? null;
}

function getStreakCount(): number {
  const log = loadHealthLog();
  if (log.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (log.some(e => e.date === key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function awardXP(amount: number) {
  window.dispatchEvent(new CustomEvent('adhd-xp', { detail: { amount } }));
}

// ─── Component ──

export function HealthPulse() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meds' | 'log' | 'tips'>('dashboard');
  const [energy, setEnergy] = useState<number>(0);
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>([]);
  const [medsTaken, setMedsTaken] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [streak, setStreak] = useState(0);
  const [todayDone, setTodayDone] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [rotation, setRotation] = useState(0);

  // Load state
  useEffect(() => {
    const today = getTodayLog();
    if (today) {
      setEnergy(today.energy);
      setActiveSymptoms(today.symptoms);
      setMedsTaken(today.meds_taken);
      setTodayDone(true);
    }
    setStreak(getStreakCount());
  }, []);

  // Rotate pacing tips
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % PACING_TIPS.length);
      setCurrentTip(prev => (prev + 1) % PACING_TIPS.length);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const toggleSymptom = useCallback((id: string) => {
    setActiveSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }, []);

  const toggleMed = useCallback((medName: string) => {
    setMedsTaken(prev =>
      prev.includes(medName) ? prev.filter(m => m !== medName) : [...prev, medName]
    );
  }, []);

  const saveLog = useCallback(() => {
    const log = loadHealthLog();
    const todayKey = getTodayKey();
    const existing = log.findIndex(e => e.date === todayKey);
    const entry: HealthLogEntry = {
      date: todayKey,
      energy,
      symptoms: activeSymptoms,
      meds_taken: medsTaken,
      note: note || undefined,
    };
    if (existing >= 0) log[existing] = entry;
    else log.push(entry);
    saveHealthLog(log);
    setTodayDone(true);
    setStreak(getStreakCount());
    awardXP(15);
  }, [energy, activeSymptoms, medsTaken, note]);

  const clearToday = useCallback(() => {
    const log = loadHealthLog().filter(e => e.date !== getTodayKey());
    saveHealthLog(log);
    setEnergy(0);
    setActiveSymptoms([]);
    setMedsTaken([]);
    setNote('');
    setTodayDone(false);
    setStreak(getStreakCount());
  }, []);

  const getMedsForSlot = (slotId: string) => {
    return MEDICATIONS.filter(m => DOSAGE_MAP[m.name]?.includes(slotId));
  };

  const getMedStatus = (medName: string) => {
    return medsTaken.includes(medName) ? 'taken' : 'pending';
  };

  // ─── Render ──

  const tabs = [
    { id: 'dashboard' as const, label: 'Vitals', icon: Heart },
    { id: 'meds' as const, label: 'Meds', icon: Pill },
    { id: 'log' as const, label: 'Log', icon: Activity },
    { id: 'tips' as const, label: 'Pacing', icon: Zap },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Health Pulse</h1>
            <p className="text-xs text-slate-400">Track • Pace • Recover</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
              <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-sm font-bold text-rose-400">{streak}d</span>
            </div>
          )}
          <button
            onClick={clearToday}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
            title="Reset today"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-800/50 border border-slate-700/50">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center',
                activeTab === tab.id
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && (
        <>
          {/* Energy + Symptoms summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Energy Ring */}
            <div className="card p-5 border-rose-500/10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-slate-300">Energy Level</span>
              </div>
              <div className="flex gap-2 justify-center">
                {ENERGY_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setEnergy(level.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl transition-all min-w-[60px]',
                      energy === level.value
                        ? 'ring-2 ring-rose-500/50 bg-rose-500/10 scale-105'
                        : 'bg-slate-800/50 hover:bg-slate-700/50'
                    )}
                  >
                    <span className="text-2xl">{level.emoji}</span>
                    <span className="text-xs font-medium text-slate-400">{level.label}</span>
                  </button>
                ))}
              </div>
              {energy > 0 && (
                <p className="text-center text-xs text-slate-500 mt-3">
                  {energy <= 2 ? '🛑 Rest priority — no pushing through' :
                   energy === 3 ? '⚖️ Pace yourself — match effort to capacity' :
                   '✅ Energy available — but stay within bounds'}
                </p>
              )}
            </div>

            {/* Quick Symptoms */}
            <div className="card p-5 border-rose-500/10">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <span className="text-sm font-semibold text-slate-300">Symptoms Today</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOMS.map(sym => {
                  const Icon = sym.icon;
                  const isActive = activeSymptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      onClick={() => toggleSymptom(sym.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border',
                        isActive
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-300'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {sym.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Today's Overview + Save */}
          <div className="card p-5 border-emerald-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-300">
                  {todayDone ? '✅ Today logged' : 'Log today\'s check-in'}
                </span>
              </div>
              {medsTaken.length > 0 && (
                <span className="text-xs text-emerald-400">{medsTaken.length}/{MEDICATIONS.length} meds taken</span>
              )}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Quick note (optional)..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50"
              />
              <button
                onClick={saveLog}
                disabled={energy === 0}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2',
                  energy > 0
                    ? 'bg-gradient-to-r from-rose-600 to-pink-700 text-white hover:from-rose-500 hover:to-pink-600 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                )}
              >
                <Sparkles className="h-4 w-4" />
                Log +15 XP
              </button>
            </div>
          </div>

          {/* Pacing Tip Rotator */}
          <div className="card p-4 border-amber-500/10 bg-gradient-to-r from-amber-500/5 to-rose-500/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{PACING_TIPS[currentTip].text}</p>
                <p className="text-xs text-amber-400/70 mt-1">+{PACING_TIPS[currentTip].xp} XP on complete</p>
              </div>
              <button
                onClick={() => awardXP(PACING_TIPS[currentTip].xp)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors shrink-0"
              >
                ✅ Done
              </button>
            </div>
          </div>

          {/* Health Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-3 text-center border-slate-700/50">
              <p className="text-2xl font-bold text-rose-400">{streak}</p>
              <p className="text-xs text-slate-500 mt-0.5">Day Streak</p>
            </div>
            <div className="card p-3 text-center border-slate-700/50">
              <p className="text-2xl font-bold text-emerald-400">{loadHealthLog().length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total Logs</p>
            </div>
            <div className="card p-3 text-center border-slate-700/50">
              <p className="text-2xl font-bold text-amber-400">
                {todayDone ? medsTaken.length : '-'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Meds Today</p>
            </div>
          </div>
        </>
      )}

      {/* ── MEDS TAB ── */}
      {activeTab === 'meds' && (
        <div className="space-y-5">
          {TIME_SLOTS.map(slot => {
            const Icon = slot.icon;
            const slotMeds = getMedsForSlot(slot.id);
            if (slotMeds.length === 0 && slot.id !== 'evening') return null;
            return (
              <div key={slot.id} className="card p-4 border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">{slot.label}</span>
                  <span className="text-xs text-slate-500 ml-auto">{slot.time}</span>
                </div>
                {slotMeds.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No scheduled meds for this slot</p>
                ) : (
                  <div className="space-y-2">
                    {slotMeds.map(med => {
                      const status = getMedStatus(med.name);
                      return (
                        <button
                          key={med.name}
                          onClick={() => toggleMed(med.name)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border text-sm',
                            status === 'taken'
                              ? 'bg-emerald-500/10 border-emerald-500/20'
                              : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                          )}
                        >
                          <div className={cn(
                            'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0',
                            status === 'taken' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                          )}>
                            {status === 'taken' && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('font-medium', status === 'taken' ? 'text-emerald-300' : 'text-white')}>
                              {med.name}
                            </p>
                            <p className="text-xs text-slate-500">{med.notes}</p>
                          </div>
                          <span className={cn(
                            'text-xs font-bold px-2 py-0.5 rounded',
                            status === 'taken' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'
                          )}>
                            {status === 'taken' ? 'Taken ✅' : med.times}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Ramosetron SOS note */}
          <div className="card p-4 border-amber-500/10 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Ramosetron — SOS Only</p>
                <p className="text-xs text-slate-500 mt-1">Take only during active IBS flare. Not a scheduled daily med. Log separately if used.</p>
              </div>
            </div>
          </div>

          {/* Save meds to log */}
          <button
            onClick={() => awardXP(5)}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-pink-700 text-white text-sm font-bold hover:from-rose-500 hover:to-pink-600 transition-all shadow-lg shadow-rose-500/20"
          >
            ⚡ Confirm Meds +5 XP
          </button>
        </div>
      )}

      {/* ── LOG TAB ── */}
      {activeTab === 'log' && (
        <div className="space-y-4">
          {/* Today's snapshot */}
          <div className="card p-5 border-rose-500/10">
            <h3 className="text-sm font-semibold text-white mb-4">Log Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-1">Energy</p>
                <p className="text-lg font-bold text-white">
                  {energy > 0 ? ENERGY_LEVELS[energy-1]?.emoji + ' ' + ENERGY_LEVELS[energy-1]?.label : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Symptoms</p>
                <p className="text-lg font-bold text-white">
                  {activeSymptoms.length > 0 ? `${activeSymptoms.length} active` : 'None ☀️'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Meds Taken</p>
                <p className="text-lg font-bold text-white">{medsTaken.length}/{MEDICATIONS.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Logged</p>
                <p className="text-lg font-bold text-white">{todayDone ? '✅ Yes' : '⭕ No'}</p>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="card p-5 border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-3">Recent Logs</h3>
            {loadHealthLog().slice(-7).reverse().map((entry, i) => {
              const energyLevel = ENERGY_LEVELS[entry.energy-1];
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono w-20">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-sm">{energyLevel?.emoji}</span>
                    <span className="text-xs text-slate-400">
                      {entry.symptoms.length > 0 ? `${entry.symptoms.length} sym` : '✅'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{entry.meds_taken.length}/{MEDICATIONS.length} meds</span>
                </div>
              );
            })}
            {loadHealthLog().length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-4">No logs yet. Log your first check-in!</p>
            )}
          </div>
        </div>
      )}

      {/* ── PACING TIPS TAB ── */}
      {activeTab === 'tips' && (
        <div className="space-y-3">
          {PACING_TIPS.map((tip, i) => (
            <div key={i} className={cn(
              'card p-4 flex items-center justify-between transition-all',
              i === currentTip ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700/50'
            )}>
              <p className="text-sm text-white flex-1">{tip.text}</p>
              <button
                onClick={() => awardXP(tip.xp)}
                className="ml-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors shrink-0"
              >
                +{tip.xp} XP
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
